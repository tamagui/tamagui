import { dirname, resolve } from 'path'

import { createExtractor, extractToClassNames } from '@tamagui/static'
import type { CLIResolvedOptions } from '@tamagui/types'
import chokidar from 'chokidar'
import { readFile } from 'fs-extra'

export const build = async (options: CLIResolvedOptions) => {
  // const tamagui = await loadTamagui(options.tamaguiOptions)

  const entry = options.pkgJson.source
  if (!entry) {
    throw new Error(`Must add "source" to package.json pointing to your source directory`)
  }
  const sourceDir = dirname(entry)
  const promises: Promise<void>[] = []
  const targets = ['web']

  await new Promise<void>((res) => {
    chokidar
      // prevent infinite loop but cause race condition if you just build directly
      .watch(sourceDir, {
        // persistent: true,
      })
      .on('add', (relativePath) => {
        const sourcePath = resolve(process.cwd(), relativePath)

        promises.push(
          (async () => {
            await Promise.all(
              targets.map(async (target) => {
                process.env.TAMAGUI_TARGET = target
                if (options.debug) {
                  process.env.NODE_ENV ||= 'development'
                }
                const source = await readFile(sourcePath, 'utf-8')
                const extractor = createExtractor()
                const out = await extractToClassNames({
                  extractor,
                  source,
                  sourcePath,
                  options: options.tamaguiOptions,
                  shouldPrintDebug: options.debug || false,
                })

                // await writeFile()
              })
            )
          })()
        )
      })
      .on('ready', () => {
        res()
      })
  })

  await Promise.all(promises)
}
