import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, expect, test, vi } from 'vitest'

let mapper: (() => Record<string, unknown>) | undefined
const driverCalls: string[] = []

vi.mock('react-native-reanimated', async (importOriginal) => {
  const reanimated = await importOriginal<typeof import('react-native-reanimated')>()

  return {
    ...reanimated,
    // keep shared values stable across commits so the mapper sees its history
    useSharedValue: <T,>(initial: T) => {
      const ref = React.useRef({
        value: initial,
        modify(modifier: (value: T) => T) {
          this.value = modifier(this.value)
        },
      })
      return ref.current
    },
    // the driver only builds animations inside a worklet, so run the mapper
    // the way the UI runtime would
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
    // mirrors defineAnimation on the ReactNative runtime: during
    // initialUpdaterRun (IN_STYLE_UPDATER) withTiming/withSpring return the
    // plain starting value, not an animation descriptor
    withTiming: ((toValue: unknown) => {
      driverCalls.push('withTiming')
      return toValue
    }) as typeof reanimated.withTiming,
    withSpring: ((toValue: unknown) => {
      driverCalls.push('withSpring')
      return toValue
    }) as typeof reanimated.withSpring,
  }
})

const { createAnimations } = await import('@tamagui/animations-reanimated')
const { TamaguiProvider, View, createTamagui } = await import('@tamagui/core')

const config = createTamagui({
  ...getDefaultTamaguiConfig('native'),
  animations: createAnimations({
    bouncy: { damping: 16, stiffness: 90, mass: 1 },
  }),
})

let rendered: TestRenderer.ReactTestRenderer | undefined

const paint = async (transition: string, style: Record<string, unknown>) => {
  const content = (
    <TamaguiProvider config={config} defaultTheme="light">
      <View transition={transition} style={style} />
    </TamaguiProvider>
  )
  await act(async () => {
    if (rendered) rendered.update(content)
    else rendered = TestRenderer.create(content)
  })
  return mapper!()
}

afterEach(async () => {
  await act(async () => rendered?.unmount())
  rendered = undefined
  mapper = undefined
  driverCalls.length = 0
})

// the driver decorates the descriptor withSpring/withTiming return: a
// monotonic onFrame for springs, a seeded onStart for colors. when the style
// updater re-initializes, those return the raw value instead, and assigning
// onto it throws, e.g. "Cannot create property 'onFrame' on number '0'"
// (spring) or "Cannot create property 'onStart' on string 'rgba(0, 0, 0, 0)'"
// (color, #4193). React 19 responds to the render error by unmounting the root.
test.each([
  {
    name: 'spring on a number',
    transition: 'bouncy',
    from: { opacity: 0 },
    to: { opacity: 1 },
    driver: 'withSpring',
  },
  {
    name: 'timing on a painted color',
    transition: '75ms',
    from: { backgroundColor: 'transparent' },
    to: { backgroundColor: 'red' },
    driver: 'withTiming',
  },
])(
  'initial updater run with a raw primitive: $name',
  async ({ transition, from, to, driver }) => {
    await paint(transition, from)
    await expect(paint(transition, to)).resolves.toBeDefined()
    // a mapper that never reached the driver would pass on its own, so pin that
    // the raw-primitive path actually ran
    expect(driverCalls).toContain(driver)
  }
)
