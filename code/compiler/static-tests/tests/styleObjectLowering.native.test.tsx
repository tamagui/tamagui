import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

process.env.TAMAGUI_TARGET = 'native'

// a conditional member of a style object lowers per branch on native the way
// a conditional direct prop does, with the static members in every branch
test('a conditional style member lowers to a per-branch native style program', async () => {
  const output = await extractForNative(
    [
      "import { View } from '@tamagui/core'",
      'export function Test({ seed }: { seed: number }) {',
      "  return <View style={{ backgroundColor: seed % 2 ? 'red' : 'blue', height: 10 }} />",
      '}',
      '',
    ].join('\n'),
    { options: { components: ['@tamagui/core'] } }
  )
  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('_expressions={[seed % 2]}')
  // the shared static member hoists into the base style; each branch carries
  // only what changes
  expect(output.code).toContain('"height":10')
  expect(output.code).toContain(
    'expressions[0] ? {"backgroundColor":"red"} : {"backgroundColor":"blue"}'
  )
  expect(output.code).not.toContain('style={{')
})
