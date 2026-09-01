import * as React from 'react'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

Error.stackTraceLimit = Number.Infinity
process.env.TAMAGUI_TARGET = 'native'

window['React'] = React

const compilerLaneAComponents = resolve(__dirname, 'fixtures/compilerLaneAComponents.tsx')

// native matches media at render time, so there is no build-time answer for a
// media clause a variant brought with it. the element has to stay on the runtime
// path rather than flatten to a StyleSheet holding whichever breakpoint node
// happened to consider active.
test('a variant carrying a media block stays on the runtime path', async () => {
  const output = await extractForNative(`
    import { MyMediaVariantText } from '@tamagui/test-design-system'

    export function Test() {
      return <MyMediaVariantText strength="large" />
    }
  `)

  const code = output?.code ?? ''

  expect(code).toContain('<MyMediaVariantText strength="large" />')
  expect(code).not.toContain('StyleSheet.create')
})

// while a variant with no media in it still flattens to a raw native element
test('a variant without media still flattens', async () => {
  const output = await extractForNative(`
    import { MySizableText } from '@tamagui/test-design-system'

    export function Test() {
      return <MySizableText />
    }
  `)

  expect(output?.code ?? '').toContain('<__TamaguiNativeText')
})

test('branded dynamics and resolver chains flatten with static props', async () => {
  const output = await extractForNative(
    `
    import { DynamicResolverStack } from './fixtures/compilerLaneAComponents'

    export function Test() {
      return <DynamicResolverStack scale={20} tone="critical" id="dim" />
    }
  `,
    { options: { components: [compilerLaneAComponents] } }
  )
  const code = output?.code ?? ''

  expect(output?.stats.lowered).toBe(1)
  expect(output?.stats.bailed).toBe(0)
  expect(code).toContain('<__TamaguiNativeView')
  expect(code).toContain('"width":20')
  expect(code).toContain('"height":20')
  expect(code).toContain('"backgroundColor":"red"')
  expect(code).toContain('"opacity":0.5')
  expect(code).toContain('"paddingTop":12')
  expect(code).not.toContain('"paddingTop":8')
})

test('resolver chains deopt when an ordinary readable prop is unknown', async () => {
  const output = await extractForNative(
    `
    import { DynamicResolverStack } from './fixtures/compilerLaneAComponents'

    export function Test(props) {
      return <DynamicResolverStack scale={20} tone="critical" id={props.id} />
    }
  `,
    { options: { components: [compilerLaneAComponents] } }
  )

  expect(output?.stats.lowered).toBe(0)
  expect(output?.stats.bailed).toBe(1)
  expect(output?.code ?? '').toContain('id={props.id}')
  expect(output?.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'local/dynamic-style-value',
        blocking: true,
        prop: 'id',
      }),
    ])
  )
})
