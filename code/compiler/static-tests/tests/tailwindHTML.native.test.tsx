import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

process.env.TAMAGUI_TARGET = 'native'

test.each(['configured', 'discovered'] as const)(
  'html tags retain their %s frontend when lowering native classes',
  async (registration) => {
    const output = await extractForNative(
      `import { html, View } from '@tamagui/tailwind'
  export function Test() {
    return <>
      <html.div className="flex flex-row items-center gap-2"><html.span className="text-[14px]">a</html.span></html.div>
      <View className="flex flex-row items-center gap-2" />
    </>
  }`,
      registration === 'configured'
        ? { options: { components: ['@tamagui/core', '@tamagui/tailwind'] } }
        : {}
    )

    expect(output.diagnostics).toEqual([])
    expect(output.code).not.toContain('className')
    expect(output.code.split('"flexDirection":"row"').length - 1).toBe(2)
    expect(output.code).toContain('"fontSize":14')
  }
)
