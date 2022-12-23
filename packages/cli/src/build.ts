import { basename, dirname, join, resolve } from 'path'

import { createExtractor, extractToClassNames, loadTamagui } from '@tamagui/static'
import chokidar from 'chokidar'
import { readFile } from 'fs-extra'

import { ResolvedOptions } from './types.js'

export const build = async (options: ResolvedOptions) => {
  // const tamagui = await loadTamagui(options.tamaguiOptions)

  const entry = options.pkgJson.source
  if (!entry) {
    throw new Error(
      `Must add "source" to package.json pointing to your source directory`,
    )
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

        // testing..
        if (!sourcePath.endsWith('Layouts.tsx')) return

        promises.push(
          (async () => {
            await Promise.all(
              targets.map(async (target) => {
                process.env.TAMAGUI_TARGET = target
                if (options.debug) {
                  process.env.NODE_ENV ||= 'development'
                }
                console.log('go', sourcePath)
                const source = await readFile(sourcePath, 'utf-8')
                const extractor = createExtractor()
                const out = await extractToClassNames({
                  extractor,
                  source,
                  sourcePath,
                  options: options.tamaguiOptions,
                  shouldPrintDebug: options.debug || false,
                })

                console.log('gotem', out?.js)
              }),
            )
          })(),
        )
      })
      .on('ready', () => {
        res()
      })
  })

  await Promise.all(promises)
}
