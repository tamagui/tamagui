import {
  createExtractor,
  extractToClassNames,
  extractToNative,
  loadTamagui,
  loadTamaguiBuildConfigSync,
} from '@tamagui/static'
import type { CLIResolvedOptions, TamaguiOptions } from '@tamagui/types'
import chokidar from 'chokidar'
import { copyFile, mkdir, readFile, rm, stat, writeFile } from 'fs-extra'
import MicroMatch from 'micromatch'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'

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

  // Load tamagui for web first (needed for both targets)
  const webTamaguiOptions = {
    ...buildOptions,
    platform: 'web' as const,
  } satisfies TamaguiOptions

  await loadTamagui(webTamaguiOptions)

  // Collect all files first
  const allFiles: string[] = []

  // Handle both directory and specific file paths
  const watchPattern = sourceDir.match(/\.(tsx|jsx)$/)
    ? sourceDir // Single file
    : `${sourceDir}/**/*.{tsx,jsx}` // Directory

  await new Promise<void>((res) => {
    chokidar
      .watch(watchPattern, {
        ignoreInitial: false,
      })
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
      .on('ready', () => res())
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
      } else if (platform === 'native' || platform === 'ios' || platform === 'android') {
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

  // Track files for restoration (when using --run)
  const trackedFiles: TrackedFile[] = []
  const restoreDir = options.runCommand
    ? join(tmpdir(), `tamagui-restore-${process.pid}`)
    : null

  if (restoreDir) {
    await mkdir(restoreDir, { recursive: true })
  }

  // Helper to backup a file before modifying it
  const trackFile = async (filePath: string): Promise<void> => {
    if (!restoreDir) return
    const hash = createHash('md5').update(filePath).digest('hex')
    const backupPath = join(restoreDir, hash)
    // Use copy instead of hardlink - hardlinks share content, so modifying
    // the original would also modify the "backup"
    await copyFile(filePath, backupPath)
    trackedFiles.push({ path: filePath, hardlinkPath: backupPath, mtimeAfterWrite: 0 })
  }

  // Helper to record mtime after writing
  const recordMtime = async (filePath: string): Promise<void> => {
    if (!restoreDir) return
    const tracked = trackedFiles.find((t) => t.path === filePath)
    if (tracked) {
      const fileStat = await stat(filePath)
      tracked.mtimeAfterWrite = fileStat.mtimeMs
    }
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
          const extractor = createExtractor({
            platform: 'web',
          })

          const out = await extractToClassNames({
            extractor,
            source: originalSource,
            sourcePath,
            options: {
              ...buildOptions,
              platform: 'web',
            },
            shouldPrintDebug: options.debug || false,
          })

          if (out) {
            stats.filesProcessed++
            stats.optimized += out.stats.optimized
            stats.flattened += out.stats.flattened
            stats.styled += out.stats.styled
            stats.found += out.stats.found

            if (isDryRun) {
              const jsContent =
                typeof out.js === 'string' ? out.js : out.js.toString('utf-8')
              if (out.styles) {
                console.info(`\ncss:\n${out.styles}`)
              }
              console.info(`\njs:\n${jsContent}`)
            } else {
              // compute relative path to preserve directory structure in output
              const relPath = outputDir
                ? relative(resolve(sourceDir), sourcePath)
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
              const jsContent =
                typeof out.js === 'string' ? out.js : out.js.toString('utf-8')
              const code = insertCssImport(jsContent, cssImport)

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
              await writeFile(stylePath, out.styles, 'utf-8')
              if (!outputDir) {
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
          const nativeTamaguiOptions = {
            ...buildOptions,
            platform: 'native' as const,
          } satisfies TamaguiOptions

          // Use the ORIGINAL source, not what was just written to disk
          const nativeOut = extractToNative(
            sourcePath,
            originalSource,
            nativeTamaguiOptions
          )

          if (isDryRun) {
            if (nativeOut.code) {
              console.info(`\nnative:\n${nativeOut.code}`)
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
              const relPath = relative(resolve(sourceDir), sourcePath)
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

            if (nativeOut.code) {
              // check if extraction actually happened by looking for our markers
              const hasExtraction =
                nativeOut.code.includes('__ReactNativeStyleSheet') ||
                nativeOut.code.includes('_withStableStyle')
              if (hasExtraction) {
                stats.filesProcessed++
                // count styled wrappers as flattened (native extraction flattens styles)
                const wrapperMatches = nativeOut.code.match(/_withStableStyle/g)
                if (wrapperMatches) {
                  stats.flattened += wrapperMatches.length
                }
              }

              // Track original if overwriting existing file (skip if using output dir or outputAround)
              if (
                !outputDir &&
                !outputAround &&
                (nativeOutputPath === sourcePath || filePlatforms.length === 1)
              ) {
                await trackFile(nativeOutputPath)
              }
              await writeFile(nativeOutputPath, nativeOut.code, 'utf-8')
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
      process.exit(1)
    }
    console.info(
      `\n✓ Met optimization target: ${totalOptimizations} >= ${options.expectOptimizations}`
    )
  }

  // If a command was provided, run it and then restore files
  if (options.runCommand && options.runCommand.length > 0) {
    const command = options.runCommand.join(' ')
    console.info(`\nRunning: ${command}\n`)

    try {
      execSync(command, { stdio: 'inherit' })
    } catch (err: any) {
      console.error(`\nCommand failed with exit code ${err.status || 1}`)
      process.exitCode = err.status || 1
    } finally {
      // Always restore files
      await restoreFiles(trackedFiles, restoreDir)
    }
  }

  return { stats, trackedFiles }
}

async function restoreFiles(
  trackedFiles: TrackedFile[],
  restoreDir: string | null
): Promise<void> {
  if (!restoreDir || trackedFiles.length === 0) return

  console.info(`\nRestoring ${trackedFiles.length} files...`)
  let restored = 0
  let skipped = 0
  let deleted = 0

  for (const tracked of trackedFiles) {
    try {
      const currentStat = await stat(tracked.path).catch(() => null)

      // Check if file was modified during command execution
      if (currentStat && currentStat.mtimeMs !== tracked.mtimeAfterWrite) {
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
