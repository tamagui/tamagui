import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

process.env.TAMAGUI_TARGET = 'native'

const options = { options: { components: ['@tamagui/core'] } }

const hoisted = (code: string) => JSON.parse(code.match(/\._ = (\{.*?\})\); \}/)![1])

// four equal sides hoist as the shorthand, which fabric mounts with fewer props
test('equal sides hoist as one shorthand per family', async () => {
  const output = await extractForNative(
    [
      "import { View } from '@tamagui/core'",
      'export function Card() {',
      "  return <View width={60} padding={4} margin={1} borderWidth={1} borderColor='rgba(0,0,0,0.1)' borderRadius={6} />",
      '}',
      '',
    ].join('\n'),
    options
  )
  expect(output.diagnostics).toEqual([])
  expect(output.stats.flattened).toBe(1)
  expect(hoisted(output.code)).toEqual({
    width: 60,
    padding: 4,
    margin: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 6,
  })
})

// unequal sides, or a start edge yoga ranks above the shorthand, keep longhands
test('unequal sides and other family keys keep the longhands', async () => {
  const output = await extractForNative(
    [
      "import { View } from '@tamagui/core'",
      'export function Card() {',
      '  return <View padding={4} paddingTop={8} margin={1} marginStart={2} />',
      '}',
      '',
    ].join('\n'),
    options
  )
  expect(output.diagnostics).toEqual([])
  const style = hoisted(output.code)
  expect(style).not.toHaveProperty('padding')
  expect(style).not.toHaveProperty('margin')
  expect(style.paddingTop).toBe(8)
  expect(style.paddingLeft).toBe(4)
  expect(style.marginStart).toBe(2)
})
