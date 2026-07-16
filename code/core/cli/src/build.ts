import {
  CompilerFrontend,
  loadTamagui,
  loadTamaguiBuildConfigSync,
  type CompilerProject,
} from '@tamagui/static'
import type { CLIResolvedOptions, TamaguiOptions } from '@tamagui/types'
import chokidar from 'chokidar'
import { copyFile, mkdir, readFile, rm, stat, writeFile } from 'fs-extra'
import MicroMatch from 'micromatch'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import {
  findConfigFile,
  nodeModuleNameResolver,
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
} from 'typescript'

export type BuildStats = {
  filesProcessed: number
  optimized: number
  flattened: number
  styled: number
  found: number
}

export type TrackedFile = {
  path: string
  hardlinkPath: string
  mtimeAfterWrite: number
}

export type BuildResult = {
  stats: BuildStats
  trackedFiles: TrackedFile[]
}

/**
 * Inserts a CSS import statement into JS code, placing it after any
 * 'use client' or 'use server' directives at the top of the file.
 */
export function insertCssImport(jsContent: string, cssImport: string): string {
  // Match 'use client' or 'use server' directives at the start of the file
  // Only consume one optional semicolon and one optional newline to preserve formatting
  const directiveMatch = jsContent.match(/^(['"])use (client|server)\1;?\n?/)
  if (directiveMatch) {
    // Directive found at start - insert CSS import after it
    const directive = directiveMatch[0]
    const rest = jsContent.slice(directive.length)
    return `${directive}${cssImport}\n${rest}`
  }
  return `${cssImport}\n${jsContent}`
}

export const build = async (
  options: CLIResolvedOptions & {
    target?: 'web' | 'native' | 'both'
    dir?: string
    include?: string
    exclude?: string
    output?: string
    outputAround?: boolean
    expectOptimizations?: number
    runCommand?: string[]
    dryRun?: boolean
  }
): Promise<BuildResult> => {
  const sourceDir = options.dir ?? '.'
  const outputDir = options.output
  const outputAround = options.outputAround || false
  const promises: Promise<void>[] = []
  const isDryRun = options.dryRun || false
  const trackedFiles: TrackedFile[] = []
  const trackedPaths = new Set<string>()
  const restoreDir = options.runCommand
    ? join(tmpdir(), `tamagui-restore-${process.pid}`)
    : null

  if (restoreDir) {
    await mkdir(restoreDir, { recursive: true })
  }
  let didRestore = false
  const restoreTrackedFiles = async (force = false) => {
    if (didRestore) return
    await restoreFiles(trackedFiles, restoreDir, force)
    didRestore = true
  }

  try {
    const trackFile = async (filePath: string): Promise<void> => {
      if (!restoreDir || trackedPaths.has(filePath)) return
      trackedPaths.add(filePath)

      const currentStat = await stat(filePath).catch(() => null)
      if (!currentStat) {
        trackedFiles.push({ path: filePath, hardlinkPath: '', mtimeAfterWrite: 0 })
        return
      }

      const hash = createHash('md5').update(filePath).digest('hex')
      const backupPath = join(restoreDir, hash)
      await copyFile(filePath, backupPath)
      trackedFiles.push({ path: filePath, hardlinkPath: backupPath, mtimeAfterWrite: 0 })
    }

    const recordMtime = async (filePath: string): Promise<void> => {
      if (!restoreDir) return
      const tracked = trackedFiles.find((item) => item.path === filePath)
      if (tracked) {
        const fileStat = await stat(filePath)
        tracked.mtimeAfterWrite = fileStat.mtimeMs
      }
    }

    if (isDryRun) {
      console.info('[dry-run] no files will be written\n')
    }

    // create output directory if specified
    if (outputDir) {
      await mkdir(outputDir, { recursive: true })
    }

    const loadedOptions = loadTamaguiBuildConfigSync(options.tamaguiOptions)

    // when running CLI build directly, ignore disable since user explicitly wants to build
    if (loadedOptions.disable) {
      console.warn(
        `[tamagui] Note: "disable" option in tamagui.build.ts is being ignored for CLI build command`
      )
    }
    const buildOptions = {
      ...loadedOptions,
      disable: false,
      disableExtraction: false,
    }

    const targets =
      options.target === 'both' || !options.target
        ? (['web', 'native'] as const)
        : ([options.target] as const)

    const root = process.cwd()
    const outputCSSPath = buildOptions.outputCSS
      ? resolve(root, buildOptions.outputCSS)
      : null
    if (outputCSSPath) {
      await trackFile(outputCSSPath)
    }
    const require = createRequire(
      typeof __filename === 'string' ? __filename : import.meta.url
    )
    const configPath =
      findConfigFile(root, sys.fileExists, 'tsconfig.json') ||
      findConfigFile(root, sys.fileExists, 'jsconfig.json')
    const compilerOptions = configPath
      ? parseJsonConfigFileContent(
          (() => {
            const loaded = readConfigFile(configPath, sys.readFile)
            if (loaded.error) throw new Error(String(loaded.error.messageText))
            return loaded.config
          })(),
          sys,
          dirname(configPath)
        ).options
      : {}
    const resolveCompilerId = (specifier: string, importer: string): string | null => {
      const resolved = nodeModuleNameResolver(specifier, importer, compilerOptions, sys)
        .resolvedModule?.resolvedFileName
      if (resolved && !resolved.endsWith('.d.ts')) return resolved
      try {
        return require.resolve(specifier, { paths: [dirname(importer), root] })
      } catch {
        return null
      }
    }
    const compilerFrontends = new Map<'web' | 'native', CompilerFrontend>()
    const compilerProjects = new Map<'web' | 'native', CompilerProject>()

    for (const target of targets) {
      const targetOptions = { ...buildOptions, platform: target } satisfies TamaguiOptions
      const projectInfo = await loadTamagui(targetOptions)
      if (!projectInfo) throw new Error(`Unable to load Tamagui for the ${target} build`)
      const componentModules = [
        ...new Set(['@tamagui/core', ...(targetOptions.components ?? [])]),
      ].map((moduleName) => {
        const id = resolveCompilerId(moduleName, join(root, '__tamagui_cli__.tsx'))
        if (!id) throw new Error(`Unable to resolve compiler component ${moduleName}`)
        return { moduleName, id }
      })
      compilerProjects.set(target, {
        projectInfo,
        componentModules,
        generation: createHash('sha256')
          .update(target)
          .update('\0')
          .update(buildOptions.config ?? 'tamagui.config.ts')
          .update('\0')
          .update(JSON.stringify(targetOptions.components ?? []))
          .digest('hex'),
      })
      compilerFrontends.set(target, new CompilerFrontend())
    }
    if (outputCSSPath) {
      await recordMtime(outputCSSPath)
    }

    const compileTarget = async (
      target: 'web' | 'native',
      sourcePath: string,
      source: string
    ) => {
      const compiler = compilerFrontends.get(target)!
      const project = compilerProjects.get(target)!
      return compiler.compile({
        id: sourcePath,
        source,
        root,
        target,
        project,
        resolve: async (specifier, importer) => {
          const id = resolveCompilerId(specifier, importer)
          return id ? { id, external: id.includes('/node_modules/') } : null
        },
        load: async (id) => {
          try {
            return await readFile(id.split(/[?#]/, 1)[0]!, 'utf8')
          } catch {
            return null
          }
        },
      })
    }

    // Collect all files first
    const allFiles: string[] = []

    // Handle both directory and specific file paths
    const watchPattern = sourceDir.match(/\.(tsx|jsx)$/)
      ? sourceDir // Single file
      : `${sourceDir}/**/*.{tsx,jsx}` // Directory
    const sourceRoot = sourceDir.match(/\.(tsx|jsx)$/)
      ? dirname(resolve(sourceDir))
      : resolve(sourceDir)

    await new Promise<void>((res) => {
      const watcher = chokidar.watch(watchPattern, {
        ignoreInitial: false,
      })
      watcher
        .on('add', (relativePath) => {
          const sourcePath = resolve(process.cwd(), relativePath)

          if (options.exclude && MicroMatch.contains(relativePath, options.exclude)) {
            return
          }
          if (options.include && !MicroMatch.contains(relativePath, options.include)) {
            return
          }

          allFiles.push(sourcePath)
        })
        .on('ready', () => {
          watcher.close().then(() => res())
        })
    })

    // Now determine what to optimize for each file
    const fileToTargets = new Map<string, ('web' | 'native')[]>()

    for (const sourcePath of allFiles) {
      const platformMatch = sourcePath.match(/\.(web|native|ios|android)\.(tsx|jsx)$/)
      let filePlatforms: ('web' | 'native')[] = []

      if (platformMatch) {
        // Platform-specific file - only optimize for that platform
        const platform = platformMatch[1]
        if (platform === 'web') {
          filePlatforms = ['web']
        } else if (
          platform === 'native' ||
          platform === 'ios' ||
          platform === 'android'
        ) {
          filePlatforms = ['native']
        }
      } else {
        // Base file without platform extension
        // Check if platform-specific versions exist in the collected files
        const basePath = sourcePath.replace(/\.(tsx|jsx)$/, '')
        const hasNative = allFiles.some(
          (f) =>
            f === `${basePath}.native.tsx` ||
            f === `${basePath}.native.jsx` ||
            f === `${basePath}.ios.tsx` ||
            f === `${basePath}.ios.jsx` ||
            f === `${basePath}.android.tsx` ||
            f === `${basePath}.android.jsx`
        )
        const hasWeb = allFiles.some(
          (f) => f === `${basePath}.web.tsx` || f === `${basePath}.web.jsx`
        )

        // Only optimize for targets that don't have platform-specific files
        filePlatforms = targets.filter((target) => {
          if (target === 'native' && hasNative) return false
          if (target === 'web' && hasWeb) return false
          return true
        })

        // Special case: if BOTH .web and .native exist, don't touch base file at all
        if (hasWeb && hasNative) {
          filePlatforms = []
        }
      }

      if (filePlatforms.length > 0) {
        fileToTargets.set(sourcePath, filePlatforms)
      }
    }

    // Track overall statistics
    const stats: BuildStats = {
      filesProcessed: 0,
      optimized: 0,
      flattened: 0,
      styled: 0,
      found: 0,
    }

    // Process all files
    for (const [sourcePath, filePlatforms] of fileToTargets) {
      promises.push(
        (async () => {
          if (options.debug) {
            process.env.NODE_ENV ||= 'development'
          }
          // Read original source ONCE for both targets
          const originalSource = await readFile(sourcePath, 'utf-8')

          if (isDryRun) {
            console.info(`\n${sourcePath} [${filePlatforms.join(', ')}]`)
          }

          // Build web version from original source
          if (filePlatforms.includes('web')) {
            process.env.TAMAGUI_TARGET = 'web'
            const out = await compileTarget('web', sourcePath, originalSource)

            if (out.output.changed || out.plan.stats.found > 0) {
              stats.filesProcessed++
              stats.optimized += out.plan.stats.lowered - out.plan.stats.flattened
              stats.flattened += out.plan.stats.flattened
              stats.styled += out.plan.stats.styled
              stats.found += out.plan.stats.found

              if (isDryRun) {
                if (out.plan.css) {
                  console.info(`\ncss:\n${out.plan.css}`)
                }
                console.info(`\njs:\n${out.output.code}`)
              } else {
                // compute relative path to preserve directory structure in output
                const relPath = outputDir
                  ? relative(sourceRoot, sourcePath)
                  : basename(sourcePath)
                const cssName = '_' + basename(sourcePath, extname(sourcePath))
                const outputBase = outputDir
                  ? join(outputDir, dirname(relPath))
                  : dirname(sourcePath)

                // ensure output subdirectory exists
                if (outputDir) {
                  await mkdir(outputBase, { recursive: true })
                }

                const stylePath = join(outputBase, cssName + '.css')
                const cssImport = `import "./${cssName}.css"`
                const code = out.plan.css
                  ? insertCssImport(out.output.code, cssImport)
                  : out.output.code

                // Determine output path for JS (preserve directory structure)
                const webOutputPath = outputDir ? join(outputDir, relPath) : sourcePath

                // Track original file before modifying (skip if using output dir)
                if (!outputDir) {
                  await trackFile(sourcePath)
                }

                // Write web output
                await writeFile(webOutputPath, code, 'utf-8')
                if (!outputDir) {
                  await recordMtime(sourcePath)
                }

                // CSS file is new, track for cleanup (skip if using output dir)
                if (out.plan.css) {
                  await writeFile(stylePath, out.plan.css, 'utf-8')
                }
                if (!outputDir && out.plan.css) {
                  // Note: CSS files are new (generated), we'll delete them on restore
                  trackedFiles.push({
                    path: stylePath,
                    hardlinkPath: '', // Empty means delete on restore
                    mtimeAfterWrite: (await stat(stylePath)).mtimeMs,
                  })
                }
              }
            } else if (isDryRun) {
              console.info(`  web: no output`)
            }
          }

          // Build native version from original source (NOT from the web-optimized version)
          if (filePlatforms.includes('native')) {
            process.env.TAMAGUI_TARGET = 'native'
            // Use the ORIGINAL source, not what was just written to disk
            const nativeOut = await compileTarget('native', sourcePath, originalSource)

            if (isDryRun) {
              if (nativeOut.output.code) {
                console.info(`\nnative:\n${nativeOut.output.code}`)
              } else {
                console.info(`  native: no output`)
              }
            } else {
              // Determine output path:
              // - If --output-around, write .native.tsx next to source
              // - If --output specified, preserve directory structure
              // - If this IS a .native.tsx file, overwrite it
              // - If building both targets from base file, create .native.tsx
              // - If single native target, overwrite source
              let nativeOutputPath = sourcePath
              const isPlatformSpecific = /\.(web|native|ios|android)\.(tsx|jsx)$/.test(
                sourcePath
              )
              const needsNativeSuffix =
                !isPlatformSpecific && (filePlatforms.length > 1 || outputAround)

              if (outputAround) {
                // Output .native.tsx next to source file
                nativeOutputPath = sourcePath.replace(/\.(tsx|jsx)$/, '.native.$1')
                // Check if file exists - error if so
                const exists = await stat(nativeOutputPath).catch(() => null)
                if (exists) {
                  throw new Error(
                    `--output-around: ${nativeOutputPath} already exists. Remove it first or use --output instead.`
                  )
                }
              } else if (outputDir) {
                // preserve directory structure in output
                const relPath = relative(sourceRoot, sourcePath)
                // add .native suffix when building both targets to avoid overwriting web output
                const outputRelPath = needsNativeSuffix
                  ? relPath.replace(/\.(tsx|jsx)$/, '.native.$1')
                  : relPath
                nativeOutputPath = join(outputDir, outputRelPath)
                // ensure output subdirectory exists
                await mkdir(dirname(nativeOutputPath), { recursive: true })
              } else if (needsNativeSuffix) {
                // Base file building both targets - create separate .native.tsx
                nativeOutputPath = sourcePath.replace(/\.(tsx|jsx)$/, '.native.$1')
              }

              if (nativeOut.output.code) {
                if (nativeOut.output.changed) {
                  stats.filesProcessed++
                  stats.flattened += nativeOut.plan.stats.flattened
                }

                // Track original if overwriting existing file (skip if using output dir or outputAround)
                if (
                  !outputDir &&
                  !outputAround &&
                  (nativeOutputPath === sourcePath || filePlatforms.length === 1)
                ) {
                  await trackFile(nativeOutputPath)
                }
                await writeFile(nativeOutputPath, nativeOut.output.code, 'utf-8')
                if (!outputDir && !outputAround) {
                  await recordMtime(nativeOutputPath)
                }

                // If creating new .native.tsx, track for deletion (skip if using output dir or outputAround)
                if (
                  !outputDir &&
                  !outputAround &&
                  nativeOutputPath !== sourcePath &&
                  filePlatforms.length > 1
                ) {
                  trackedFiles.push({
                    path: nativeOutputPath,
                    hardlinkPath: '', // Empty = delete on restore
                    mtimeAfterWrite: (await stat(nativeOutputPath)).mtimeMs,
                  })
                }

                if (outputAround) {
                  console.info(`  → ${nativeOutputPath}`)
                }
              }
            }
          }
        })()
      )
    }

    await Promise.all(promises)

    if (isDryRun) {
      console.info(
        `\n${stats.filesProcessed} files | ${stats.found} found | ${stats.optimized} optimized | ${stats.flattened} flattened | ${stats.styled} styled\n`
      )
    }

    // Verify expected optimizations if specified
    if (options.expectOptimizations !== undefined) {
      const totalOptimizations = stats.optimized + stats.flattened
      if (totalOptimizations < options.expectOptimizations) {
        console.error(
          `\nExpected at least ${options.expectOptimizations} optimizations but only got ${totalOptimizations}`
        )
        console.error(`Stats: ${JSON.stringify(stats, null, 2)}`)
        await restoreTrackedFiles(true)
        throw new Error(
          `Expected at least ${options.expectOptimizations} optimizations but only got ${totalOptimizations}`
        )
      }
      console.info(
        `\n✓ Met optimization target: ${totalOptimizations} >= ${options.expectOptimizations}`
      )
    }

    // If a command was provided, run it and then restore files
    if (options.runCommand && options.runCommand.length > 0) {
      let commandFailed = true

      try {
        await runCommand(options.runCommand, () => restoreTrackedFiles(true))
        commandFailed = false
      } catch (err: any) {
        console.error(`\nCommand failed with exit code ${err.status || 1}`)
        throw err
      } finally {
        // Always restore files
        await restoreTrackedFiles(commandFailed)
      }
    }

    return { stats, trackedFiles }
  } catch (error) {
    await Promise.allSettled(promises)
    await restoreTrackedFiles(true)
    throw error
  }
}

async function runCommand(
  command: string[],
  restore: () => Promise<void>
): Promise<void> {
  await new Promise<void>((resolveCommand, rejectCommand) => {
    const child = spawn(command[0], command.slice(1), { stdio: 'inherit' })
    let settled = false
    let listenersRestored = false
    const interruptListeners = process.listeners('SIGINT')
    const terminateListeners = process.listeners('SIGTERM')
    process.removeAllListeners('SIGINT')
    process.removeAllListeners('SIGTERM')

    const cleanup = () => {
      process.off('SIGINT', onInterrupt)
      process.off('SIGTERM', onTerminate)
      if (listenersRestored) return
      listenersRestored = true
      for (const listener of interruptListeners) process.on('SIGINT', listener)
      for (const listener of terminateListeners) process.on('SIGTERM', listener)
    }
    const finishSignal = (signal: NodeJS.Signals) => {
      if (settled) return
      settled = true
      void (async () => {
        const childExited =
          child.exitCode === null && child.signalCode === null
            ? new Promise<void>((resolveExit) => child.once('exit', () => resolveExit()))
            : Promise.resolve()
        child.kill(signal)
        await childExited
        try {
          await restore()
        } finally {
          cleanup()
          process.exit(signal === 'SIGINT' ? 130 : 143)
        }
      })()
    }
    const onInterrupt = () => finishSignal('SIGINT')
    const onTerminate = () => finishSignal('SIGTERM')
    process.once('SIGINT', onInterrupt)
    process.once('SIGTERM', onTerminate)
    console.info(`\nRunning: ${command.join(' ')}\n`)

    child.once('error', (error) => {
      if (settled) return
      settled = true
      cleanup()
      rejectCommand(error)
    })
    child.once('exit', (code, signal) => {
      if (settled) return
      settled = true
      cleanup()
      if (code === 0) {
        resolveCommand()
        return
      }
      const error = new Error(
        signal ? `Command terminated by ${signal}` : `Command exited with code ${code}`
      ) as Error & { status?: number }
      error.status = code ?? 1
      rejectCommand(error)
    })
  })
}

async function restoreFiles(
  trackedFiles: TrackedFile[],
  restoreDir: string | null,
  force = false
): Promise<void> {
  if (!restoreDir) return
  if (trackedFiles.length === 0) {
    await rm(restoreDir, { recursive: true, force: true })
    return
  }

  console.info(`\nRestoring ${trackedFiles.length} files...`)
  let restored = 0
  let skipped = 0
  let deleted = 0

  for (const tracked of trackedFiles) {
    try {
      const currentStat = await stat(tracked.path).catch(() => null)

      // Check if file was modified during command execution
      if (!force && currentStat && currentStat.mtimeMs !== tracked.mtimeAfterWrite) {
        console.warn(`  Skipping ${tracked.path} - modified during build`)
        skipped++
        continue
      }

      if (tracked.hardlinkPath === '') {
        // This was a generated file, delete it
        await rm(tracked.path, { force: true })
        deleted++
      } else {
        // Restore from hardlink
        await copyFile(tracked.hardlinkPath, tracked.path)
        restored++
      }
    } catch (err: any) {
      console.warn(`  Failed to restore ${tracked.path}: ${err.message}`)
      skipped++
    }
  }

  // Clean up tmpdir
  await rm(restoreDir, { recursive: true, force: true })

  console.info(`  Restored: ${restored}, Deleted: ${deleted}, Skipped: ${skipped}`)
}
