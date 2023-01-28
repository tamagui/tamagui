import * as babel from '@babel/core'
import {
  ExtractToClassNamesProps,
  createExtractor,
  extractToClassNames,
} from '@tamagui/static'

export async function extractForNative(code: string) {
  return await babel.transformAsync(code, {
    configFile: './babel-config-test.cjs',
    filename: 'test.tsx',
  })
}

export async function extractForWeb(
  source: string,
  opts?: Partial<ExtractToClassNamesProps>
) {
  return await extractToClassNames({
    extractor: createExtractor(),
    shouldPrintDebug: source.startsWith('// debug'),
    source,
    sourcePath: `/test.tsx`,
    ...opts,
    options: {
      components: ['@tamagui/core', '@tamagui/test-design-system'],
      config: './tests/lib/tamagui.config.cjs',
      ...opts?.options,
    },
  })
}
