import { join } from 'path'

import * as babel from '@babel/core'
import { remove, writeFile } from 'fs-extra'

import { ExtractToClassNamesProps, createExtractor, extractToClassNames } from '../../src'

export async function extractBabel(code: string) {
  return await babel.transformAsync(code, {
    configFile: './babel-config-test.js',
    filename: 'test.tsx',
  })
}

let i = 0
export async function extractForWeb(source: string, opts?: Partial<ExtractToClassNamesProps>) {
  const tmpfile = join(__dirname, `${++i}.tsx`)
  await writeFile(tmpfile, source)
  try {
    return await extractToClassNames({
      extractor: createExtractor(),
      sourcePath: tmpfile,
      shouldPrintDebug: false,
      source,
      ...opts,
      options: {
        components: ['@tamagui/core', '@tamagui/test-design-system'],
        config: './tests/lib/tamagui.config.js',
        ...opts?.options,
      },
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('extractForWeb error', err)
  } finally {
    await remove(tmpfile)
  }
}
