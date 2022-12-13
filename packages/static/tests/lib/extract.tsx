import * as babel from '@babel/core'
import { ExtractToClassNamesProps, createExtractor, extractToClassNames } from '@tamagui/static'

export async function extractForNative(code: string) {
  return await babel.transformAsync(code, {
    configFile: './babel-config-test.js',
    filename: 'test.tsx',
  })
}

export async function extractForWeb(source: string, opts?: Partial<ExtractToClassNamesProps>) {
  return await extractToClassNames({
    extractor: createExtractor(),
    shouldPrintDebug: source.startsWith('// debug'),
    source,
    ...opts,
    options: {
      components: ['@tamagui/core', '@tamagui/test-design-system'],
      config: './tests/lib/tamagui.config.js',
      ...opts?.options,
    },
  })
}
