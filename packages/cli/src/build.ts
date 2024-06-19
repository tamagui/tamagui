import { dirname, basename, resolve, join, extname } from 'node:path'
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

export const build = async (
  options: CLIResolvedOptions & {
    target?: 'web' | 'native'
    dir?: string
    include?: string
    exclude?: string
  }
) => {
  const sourceDir = options.dir ?? '.'
  const promises: Promise<void>[] = []

  const buildOptions = loadTamaguiBuildConfigSync(options.tamaguiOptions)
  const platform = options.target ?? 'web'
  process.env.TAMAGUI_TARGET = platform

  const tamaguiOptions = {
    ...buildOptions,
    platform,
  } satisfies TamaguiOptions

  // load once first
  await loadTamagui(tamaguiOptions)

  await new Promise<void>((res) => {
    chokidar
      // prevent infinite loop but cause race condition if you just build directly
      .watch(`${sourceDir}/**/*.tsx`, {
        // persistent: true,
      })
      .on('add', (relativePath) => {
        if (options.exclude) {
          if (MicroMatch.contains(relativePath, options.exclude)) {
            return
          }
        }
        if (options.include) {
          if (!MicroMatch.contains(relativePath, options.include)) {
            return
          }
        }

        const sourcePath = resolve(process.cwd(), relativePath)
        console.info(` [tamagui] optimizing ${sourcePath}`)

        promises.push(
          (async () => {
            if (options.debug) {
              process.env.NODE_ENV ||= 'development'
            }
            const source = await readFile(sourcePath, 'utf-8')

            if (platform === 'web') {
              const extractor = createExtractor({
                platform,
              })

              const out = await extractToClassNames({
                extractor,
                source,
                sourcePath,
                options: buildOptions,
                shouldPrintDebug: options.debug || false,
              })

              if (!out) {
                return
              }

              const cssName = '_' + basename(sourcePath, extname(sourcePath))
              const stylePath = join(dirname(sourcePath), cssName + '.css')
              const code = `import "./${cssName}.css"\n${out.js}`

              await Promise.all([
                writeFile(sourcePath, code, 'utf-8'),
                writeFile(stylePath, out.styles, 'utf-8'),
              ])
            }

            // native
            const out = extractToNative(sourcePath, source, tamaguiOptions)
            await writeFile(sourcePath, out.code, 'utf-8')
          })()
        )
      })
      .on('ready', () => {
        res()
      })
  })

  await Promise.all(promises)
}
