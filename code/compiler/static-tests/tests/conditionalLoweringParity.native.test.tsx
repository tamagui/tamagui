import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

window['React'] = React

test('lowers logical AND expression on native', async () => {
  const output = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test({ active }) {
      return <View backgroundColor={active && 'red'} />
    }
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('_withStableStyle')
  expect(output.code).toContain('_expressions={[active]}')
})

test('lowers nested ternaries to nested conditional expressions on native', async () => {
  const output = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test({ status }) {
      return <View backgroundColor={status === 'err' ? 'red' : status === 'warn' ? 'yellow' : 'green'} />
    }
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('_withStableStyle')
  expect(output.code).toContain(
    'expressions[0] ? {"backgroundColor":"red"} : expressions[1] ? {"backgroundColor":"yellow"} : {"backgroundColor":"green"}'
  )
})

test('lowers multiple disjoint conditionals on native', async () => {
  const output = await extractForNative(`
    import { Text } from '@tamagui/core'
    export function Test({ active, bold }) {
      return (
        <Text
          color={active ? 'red' : 'blue'}
          fontWeight={bold ? '700' : '400'}
        />
      )
    }
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('_withStableStyle')
  expect(output.code).toContain('expressions[0] ? {"color":"red"} : {"color":"blue"}')
  expect(output.code).toContain(
    'expressions[1] ? {"fontWeight":700} : {"fontWeight":400}'
  )
})

test('lowers evaluable static spread with mixed style and non-style props on native', async () => {
  const output = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test() {
      return <View {...{ backgroundColor: 'red', testID: 'my-view' }} />
    }
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('{...{ "testID": "my-view" }}')
  expect(output.code).toContain('style={')
  expect(output.code).not.toContain('backgroundColor=')
})

test('preserves static spread precedence over an earlier conditional on native', async () => {
  const output = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test({ active }) {
      return (
        <View
          backgroundColor={active ? 'red' : 'blue'}
          {...{ backgroundColor: 'green', testID: 'last-wins' }}
        />
      )
    }
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('_expressions={[active]}')
  expect(output.code).toContain('{...{ "testID": "last-wins" }}')
  expect(output.code).toContain('"backgroundColor":"green"')
  expect(output.code).not.toContain('"backgroundColor":"red"')
  expect(output.code).not.toContain('"backgroundColor":"blue"')
})

test('lowers an imported evaluable spread on native', async () => {
  const output = await extractForNative(`
    import { View } from '@tamagui/core'
    import { importedSpread } from './fixtures/conditional-lowering-import'
    export function Test() {
      return <View {...importedSpread} />
    }
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('{...{ "id": "imported-spread" }}')
  expect(output.code).toContain('"backgroundColor":"purple"')
})

test('lowers mixed spreads in compiled prop objects on native', async () => {
  const output = await extractForNative(`
    import React from 'react'
    import { View } from '@tamagui/core'
    export function Test() {
      return React.createElement(View, { ...{ backgroundColor: 'red', testID: 'compiled' } })
    }
  `)

  expect(output.diagnostics).toEqual([])
  expect(output.code).toContain('...{ "testID": "compiled" }')
  expect(output.code).toContain('"backgroundColor":"red"')
})

test('bails when multiple native conditionals resolve the same style key', async () => {
  const output = await extractForNative(`
    import { View } from '@tamagui/core'
    export function Test({ inset, edge }) {
      return <View padding={inset ? 10 : 20} paddingLeft={edge ? 1 : 2} />
    }
  `)

  expect(output.code).toContain('<View padding=')
  expect(output.diagnostics.map(({ code }) => code)).toContain(
    'local/dynamic-style-value'
  )
})

test('keeps native DOM mixed spreads on the runtime mapping path', async () => {
  const output = await extractForNative(`
    import { html } from '@tamagui/core'
    export function Test() {
      return <html.div {...{ backgroundColor: 'red', id: 'mapped-id' }} />
    }
  `)

  expect(output.code).toContain('<html.div {...{ backgroundColor:')
  expect(output.diagnostics.map(({ code }) => code)).toContain(
    'local/unsafe-style-spread'
  )
})
