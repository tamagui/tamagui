import {
  createExtractor,
  extractToClassNames,
  extractToNative,
  loadTamagui,
  loadTamaguiBuildConfigSync,
} from '@tamagui/static'
import type { CLIResolvedOptions, TamaguiOptions } from '@tamagui/types'
import chokidar from 'chokidar'
import { readFile, writeFile } from 'fs-extra'
import MicroMatch from 'micromatch'
import { basename, dirname, extname, join, resolve } from 'node:path'

export const build = async (
  options: CLIResolvedOptions & {
    target?: 'web' | 'native' | 'both'
    dir?: string
    include?: string
    exclude?: string
  }
) => {
  const sourceDir = options.dir ?? '.'
  const promises: Promise<void>[] = []

  const buildOptions = loadTamaguiBuildConfigSync(options.tamaguiOptions)
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
      if (platform === 'web' || platform === 'ios') {
        filePlatforms = ['web']
      } else if (platform === 'native' || platform === 'android') {
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
          f === `${basePath}.android.tsx` ||
          f === `${basePath}.android.jsx`
      )
      const hasWeb = allFiles.some(
        (f) =>
          f === `${basePath}.web.tsx` ||
          f === `${basePath}.web.jsx` ||
          f === `${basePath}.ios.tsx` ||
          f === `${basePath}.ios.jsx`
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

  // Process all files
  for (const [sourcePath, filePlatforms] of fileToTargets) {
    promises.push(
      (async () => {
        if (options.debug) {
          process.env.NODE_ENV ||= 'development'
        }
        // Read original source ONCE for both targets
        const originalSource = await readFile(sourcePath, 'utf-8')

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
            options: buildOptions,
            shouldPrintDebug: options.debug || false,
          })

          if (out) {
            const cssName = '_' + basename(sourcePath, extname(sourcePath))
            const stylePath = join(dirname(sourcePath), cssName + '.css')
            const code = `import "./${cssName}.css"\n${out.js}`

            // Write web output
            await writeFile(sourcePath, code, 'utf-8')
            await writeFile(stylePath, out.styles, 'utf-8')
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

          // Determine output path:
          // - If this IS a .native.tsx file, overwrite it
          // - If building both targets from base file, create .native.tsx
          // - If single native target, overwrite source
          let nativeOutputPath = sourcePath
          const isPlatformSpecific = /\.(web|native|ios|android)\.(tsx|jsx)$/.test(
            sourcePath
          )
          if (!isPlatformSpecific && filePlatforms.length > 1) {
            // Base file building both targets - create separate .native.tsx
            nativeOutputPath = sourcePath.replace(/\.(tsx|jsx)$/, '.native.$1')
          }

          await writeFile(nativeOutputPath, nativeOut.code, 'utf-8')
        }
      })()
    )
  }

  await Promise.all(promises)
}
