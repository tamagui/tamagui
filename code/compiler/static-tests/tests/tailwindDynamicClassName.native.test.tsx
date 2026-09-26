import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

process.env.TAMAGUI_TARGET = 'native'

// each branch of a tailwind View's className resolves to a native style
// object, so the conditional lowers to the same per-branch program a core
// prop conditional does
test('a conditional className lowers to a per-branch native style program', async () => {
  const output = await extractForNative(
    [
      "import { View } from '@tamagui/tailwind'",
      'export function Test({ seed }: { seed: number }) {',
      "  return <View className={seed % 2 ? 'w-6 bg-[red]' : 'w-6 bg-[blue]'} />",
      '}',
      '',
    ].join('\n'),
    { options: { components: ['@tamagui/core', '@tamagui/tailwind'] } }
  )
  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('_expressions={[seed % 2]}')
  expect(output.code).toContain(
    'expressions[0] ? {"width":24,"backgroundColor":"red"} : {"width":24,"backgroundColor":"blue"}'
  )
  expect(output.code).not.toContain('className')
})
