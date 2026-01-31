import * as babel from '@babel/core'
import type { ExtractToClassNamesProps } from '@tamagui/static'
import { createExtractor, extractToClassNames } from '@tamagui/static'

export async function extractForNative(code: string) {
  const out = await babel.transformAsync(code, {
    configFile: './babel-config-test.cjs',
    filename: 'test.tsx',
  })

  return out
}

// cache extractor to avoid OOM in CI from repeated config loading
let cachedExtractor: ReturnType<typeof createExtractor> | null = null

function getExtractor() {
  if (!cachedExtractor) {
    cachedExtractor = createExtractor()
  }
  return cachedExtractor
}

export async function extractForWeb(
  source: string,
  opts?: Partial<ExtractToClassNamesProps>
) {
  return await extractToClassNames({
    extractor: getExtractor(),
    shouldPrintDebug: source.startsWith('// debug'),
    source,
    sourcePath: `/test.tsx`,
    ...opts,
    options: {
      platform: 'web',
      components: ['tamagui', '@tamagui/core', '@tamagui/test-design-system'],
      config: './tests/lib/tamagui.config.cjs',
      ...opts?.options,
    },
  })
}
