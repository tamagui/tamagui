// A native bundle can decide exactly one thing about its platform: it is not
// web. So `web:` never matches there and a bare `native:` always does, and a
// value built only from those folds at compile time. Every other clause kind
// reads state the bundle only has at render, and each one gets a control here
// proving it still keeps the element on the runtime path.
import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

window['React'] = React

function nativeStyle(code: string): string {
  const match = code.match(/__TamaguiNativeStyle\d+\._ = (\{.*?\})\);/)
  if (!match) throw new Error(`no lowered native style in:\n${code}`)
  return match[1]!
}

test('folds a web clause away and a native clause in', async () => {
  const dead = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test() {
      return <View backgroundColor="red web:blue" padding={12} />
    }
  `)
  const base = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test() {
      return <View backgroundColor="red" padding={12} />
    }
  `)
  expect(dead.diagnostics).toEqual([])
  expect(dead.stats).toMatchObject({ flattened: 1, bailed: 0 })
  expect(nativeStyle(dead.code)).toBe(nativeStyle(base.code))

  const applied = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test() {
      return <View backgroundColor="red native:blue" padding={12} />
    }
  `)
  const overridden = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test() {
      return <View backgroundColor="blue" padding={12} />
    }
  `)
  expect(applied.diagnostics).toEqual([])
  expect(applied.stats).toMatchObject({ flattened: 1, bailed: 0 })
  expect(nativeStyle(applied.code)).toBe(nativeStyle(overridden.code))
})

test('the last matching native clause wins', async () => {
  const repeated = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test() {
      return <View backgroundColor="red native:blue native:green" />
    }
  `)
  const last = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test() {
      return <View backgroundColor="green" />
    }
  `)
  expect(repeated.diagnostics).toEqual([])
  expect(nativeStyle(repeated.code)).toBe(nativeStyle(last.code))
})

test('a chain that names web is dead whatever else it names', async () => {
  const chained = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test() {
      return <View backgroundColor="red web:hover:blue" padding={12} />
    }
  `)
  const base = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test() {
      return <View backgroundColor="red" padding={12} />
    }
  `)
  expect(chained.diagnostics).toEqual([])
  expect(nativeStyle(chained.code)).toBe(nativeStyle(base.code))
})

test('a value with only a dead clause contributes no style at all', async () => {
  const only = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test() {
      return <View backgroundColor="web:blue" padding={12} />
    }
  `)
  const without = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test() {
      return <View padding={12} />
    }
  `)
  expect(only.diagnostics).toEqual([])
  expect(nativeStyle(only.code)).toBe(nativeStyle(without.code))
})

test('every live clause kind keeps the element on the runtime path', async () => {
  for (const value of [
    'red hover:blue', // component pseudo state
    'red focus:blue', // component pseudo state
    'red enter:blue', // lifecycle
    'red exit:blue', // lifecycle
    'red sm:blue', // viewport media
    'red dark:blue', // theme
    'red group-hover:blue', // group subscription
    'red @sm:blue', // container subscription
    'red ios:blue', // device platform
    'red android:blue', // device platform
    'red tv:blue', // device platform
    'red native:hover:blue', // a live modifier chained onto a static one
  ]) {
    const source = `
    import { View } from '@tamagui/core'
    export function Test() {
      return <View backgroundColor="${value}" padding={12} />
    }
  `
    const output = await extractForNative(source)
    expect([value, output.diagnostics.map(({ message }) => message)]).toEqual([
      value,
      ['Native conditional value programs remain on the runtime path'],
    ])
    expect(output.stats).toMatchObject({ flattened: 0, bailed: 1 })
    expect(output.code).toBe(source.replace(/[ \t]+$/gm, ''))
  }
})

test('reduces the static clause in every branch of a conditional element', async () => {
  const folded = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test({ wide }) {
      return <View backgroundColor="red web:blue" width={wide ? 10 : 20} />
    }
  `)
  const plain = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test({ wide }) {
      return <View backgroundColor="red" width={wide ? 10 : 20} />
    }
  `)

  expect(folded.diagnostics).toEqual([])
  expect(folded.stats).toMatchObject({ flattened: 1, bailed: 0 })
  expect(folded.code).toBe(plain.code)
})

test('a clause inside the styled definition still retains', async () => {
  const source = `
    import { View, styled } from '@tamagui/core'
    const Card = styled(View, { backgroundColor: 'red web:blue' })
    export function Test() {
      return <Card padding={12} />
    }
  `
  const output = await extractForNative(source)

  expect(output.diagnostics.map(({ message }) => message)).toEqual([
    'Native conditional value programs remain on the runtime path',
  ])
  expect(output.stats).toMatchObject({ flattened: 0, bailed: 1 })
})

test('a conditional branch carrying a live clause retains, a static one folds', async () => {
  const live = `
    import { View } from '@tamagui/core'
    export function Test({ active }) {
      return <View backgroundColor={\`\${active ? 'red' : 'blue'} hover:green\`} padding={12} />
    }
  `
  const liveOutput = await extractForNative(live)
  expect(liveOutput.diagnostics.map(({ message }) => message)).toEqual([
    'Native conditional value programs remain on the runtime path',
  ])
  expect(liveOutput.code).toBe(live.replace(/[ \t]+$/gm, ''))

  const dead = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test({ active }) {
      return <View backgroundColor={\`\${active ? 'red' : 'blue'} web:green\`} padding={12} />
    }
  `)
  const plain = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test({ active }) {
      return <View backgroundColor={active ? 'red' : 'blue'} padding={12} />
    }
  `)
  expect(dead.diagnostics).toEqual([])
  expect(dead.code).toBe(plain.code)
})
