import * as babel from '@babel/core'

import { createExtractor, extractToClassNames } from '../../src'

export async function extractBabel(code: string) {
  return await babel.transformAsync(code, {
    configFile: './babel-config-test.js',
    filename: 'test.tsx',
  })
}

export async function extractForWeb(source: string) {
  return await extractToClassNames({
    extractor: createExtractor(),
    options: {
      components: ['@tamagui/core', '@tamagui/test-design-system'],
      config: './tests/lib/tamagui.config.js',
    },
    sourcePath: '/tmp/test.js',
    shouldPrintDebug: false,
    source,
  })
}
