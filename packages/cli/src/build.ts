import { dirname, basename, resolve, join, extname } from 'node:path'
import {
  createExtractor,
  extractToClassNames,
  loadTamagui,
  loadTamaguiBuildConfigSync,
} from '@tamagui/static'
import type { CLIResolvedOptions } from '@tamagui/types'
import chokidar from 'chokidar'
import { readFile, writeFile } from 'fs-extra'
import MicroMatch from 'micromatch'

export const build = async (
  options: CLIResolvedOptions & {
    dir?: string
    include?: string
    exclude?: string
  }
) => {
  const sourceDir = options.dir ?? '.'
  const promises: Promise<void>[] = []

  const buildOptions = loadTamaguiBuildConfigSync(options.tamaguiOptions)
  const platform = 'web'
  process.env.TAMAGUI_TARGET = platform

  // load once first
  await loadTamagui({
    ...buildOptions,
    platform,
  })

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

        promises.push(
          (async () => {
            if (options.debug) {
              process.env.NODE_ENV ||= 'development'
            }
            const source = await readFile(sourcePath, 'utf-8')

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
          })()
        )
      })
    // .on('ready', () => {
    //   console.log('ready')
    //   res()
    // })
  })

  await Promise.all(promises)
}
