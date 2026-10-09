import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

process.env.TAMAGUI_TARGET = 'native'

const options = { options: { components: ['@tamagui/core', '@tamagui/tailwind'] } }

// a number prop whose value maps 1:1 to its style key passes through as is
test('an arithmetic width lowers to a passthrough style key', async () => {
  const output = await extractForNative(
    [
      "import { View } from '@tamagui/core'",
      'export function Row({ index }: { index: number }) {',
      '  return <View height={12} width={80 + ((index * 17) % 60)} />',
      '}',
      '',
    ].join('\n'),
    options
  )
  expect(output.diagnostics).toEqual([])
  expect(output.stats.flattened).toBe(1)
  expect(output.code).toContain('_expressions={[80 + ((index * 17) % 60)]}')
  expect(output.code).toContain('{ "width": expressions[0] }')
})

// scale becomes a transform on native, so a runtime number cannot pass through
test('an arithmetic scale stays on the runtime path', async () => {
  const output = await extractForNative(
    [
      "import { View } from '@tamagui/core'",
      'export function Row({ index }: { index: number }) {',
      '  return <View height={12} scale={1 + index / 10} />',
      '}',
      '',
    ].join('\n'),
    options
  )
  expect(output.stats.flattened).toBe(0)
  expect(output.diagnostics.map((d) => d.code)).toEqual(['local/dynamic-style-value'])
})

// a member of a static array resolves each element at compile time and selects
// the resolved style by the runtime value
test('a static array member lowers to a lookup of resolved styles', async () => {
  const output = await extractForNative(
    [
      "import { View } from '@tamagui/core'",
      "const colors = ['rgb(1,2,3)', 'rgb(4,5,6)']",
      'export function Row({ index }: { index: number }) {',
      '  return <View width={44} backgroundColor={colors[index % colors.length]} />',
      '}',
      '',
    ].join('\n'),
    options
  )
  expect(output.diagnostics).toEqual([])
  expect(output.stats.flattened).toBe(1)
  expect(output.code).toContain(
    '({ "rgb(1,2,3)": {"backgroundColor":"rgb(1,2,3)"}, "rgb(4,5,6)": {"backgroundColor":"rgb(4,5,6)"} })[expressions[0]]'
  )
})

test('a className template over a static array lowers per class string', async () => {
  const output = await extractForNative(
    [
      "import { View } from '@tamagui/tailwind'",
      "const sizes = ['w-6', 'w-8']",
      'export function Row({ index }: { index: number }) {',
      '  return <View className={`h-4 ${sizes[index % 2]}`} />',
      '}',
      '',
    ].join('\n'),
    options
  )
  expect(output.diagnostics).toEqual([])
  expect(output.stats.flattened).toBe(1)
  expect(output.code).toContain('"h-4 w-6": {"height":16,"width":24}')
  expect(output.code).toContain('"h-4 w-8": {"height":16,"width":32}')
  expect(output.code).not.toContain('className')
})
