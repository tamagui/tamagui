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
  expect(removed.opacity).toBe(1)

  const readded = stylePropsBuilder.build(await paint({ [key]: 'blue' }))
  expect(readded[key]).toBe(0xff0000ff)
})

test('removing a press-only opacity resets it to 1 instead of null', async () => {
  const pressed = await paint({ opacity: 0.8 })
  expect(pressed.opacity).not.toBeNull()

  const removed = await paint({})
  expect(removed.opacity).toBe(1)
  stylePropsBuilder.build(removed)

  const restored = await paint({ opacity: 0.4 })
  expect(restored.opacity).not.toBeNull()
  expect(restored.opacity).not.toBe(1)
})

// native expands borderRadius onto the four physical corners before the driver
// sees the style, and those are the keys the android serializer reads.
const RADIUS_KEYS = [
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
] as const

test('removing border radius resets the corners to 0 instead of null', async () => {
  const mounted = await paint({ borderRadius: 8 })
  for (const key of RADIUS_KEYS) {
    expect(mounted[key]).toBe(8)
  }

  const removed = await paint({})
  for (const key of RADIUS_KEYS) {
    expect(removed[key]).toBe(0)
  }
  const built = stylePropsBuilder.build(removed)
  for (const key of RADIUS_KEYS) {
    expect(built[key]).toBe(0)
  }
})

test('removing scale clears the transform list', async () => {
  const mounted = await paint({ scale: 0.98 })
  expect(JSON.stringify(mounted)).toContain('scale')

  const removed = await paint({})
  // an empty list is the clear. a null scale inside an entry is what the
  // android serializer reads with asDouble().
  expect(removed.transform).toEqual([])
})

test('removing text color omits the key instead of making text transparent', async () => {
  const mounted = await paint({ color: 'red' }, true)
  expect(mounted).toHaveProperty('color')
  const removed = await paint({}, true)
  stylePropsBuilder.build(removed)
  expect(removed).not.toHaveProperty('color')
})
