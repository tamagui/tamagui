import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, expect, test, vi } from 'vitest'
import { stylePropsBuilder } from 'react-native-reanimated/src/common/style/propsBuilder'

let mapper: (() => Record<string, unknown>) | undefined

vi.mock('react-native-reanimated', async (importOriginal) => {
  const reanimated = await importOriginal<typeof import('react-native-reanimated')>()
  return {
    ...reanimated,
    // preserve native shared-value identity across React commits; the upstream
    // mock creates a new proxy each render and loses the mapper's history.
    useSharedValue: <T,>(initial: T) => {
      const ref = React.useRef({
        value: initial,
        modify(modifier: (value: T) => T) {
          this.value = modifier(this.value)
        },
      })
      return ref.current
    },
    useAnimatedStyle: (worklet: () => Record<string, unknown>) => {
      mapper = () => {
        vi.stubGlobal('_WORKLET', true)
        try {
          return worklet()
        } finally {
          vi.unstubAllGlobals()
        }
      }
      return worklet()
    },
  }
})

const { createAnimations } = await import('@tamagui/animations-reanimated')
const { TamaguiProvider, View, Text, createTamagui } = await import('@tamagui/core')

const config = createTamagui({
  ...getDefaultTamaguiConfig('native'),
  animations: createAnimations({}),
})

let rendered: TestRenderer.ReactTestRenderer | undefined

const paint = async (style: Record<string, any>, text = false) => {
  const Component = text ? Text : View
  const content = (
    <TamaguiProvider config={config} defaultTheme="light">
      <Component transition="75ms" style={style} />
    </TamaguiProvider>
  )
  await act(async () => {
    if (rendered) rendered.update(content)
    else rendered = TestRenderer.create(content)
  })
  expect(rendered!.toJSON()).not.toBeNull()
  return mapper!()
}

afterEach(async () => {
  await act(async () => rendered?.unmount())
  rendered = undefined
  mapper = undefined
})

test.each([
  'backgroundColor',
  'borderLeftColor',
  'borderRightColor',
  'borderTopColor',
  'borderBottomColor',
])('removing %s produces a valid native color and can be re-added', async (key) => {
  const mounted = await paint({ [key]: 'red', opacity: 0.5 })
  expect(mounted).toHaveProperty(key)
  const processed = stylePropsBuilder.build(mounted)
  expect(processed[key]).toBe(0xffff0000)

  const removed = await paint({})
  // exercise the real style builder called by native updateProps, which throws
  // "Invalid color value: null" for the driver's former clear value.
  const cleared = stylePropsBuilder.build(removed)
  expect(cleared[key]).toBe(0)
  expect(removed.opacity).toBeNull()

  const readded = stylePropsBuilder.build(await paint({ [key]: 'blue' }))
  expect(readded[key]).toBe(0xff0000ff)
})

test('removing text color omits the key instead of making text transparent', async () => {
  const mounted = await paint({ color: 'red' }, true)
  expect(mounted).toHaveProperty('color')
  const removed = await paint({}, true)
  stylePropsBuilder.build(removed)
  expect(removed).not.toHaveProperty('color')
})
