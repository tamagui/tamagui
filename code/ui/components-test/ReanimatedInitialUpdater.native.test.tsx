import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, expect, test, vi } from 'vitest'

vi.mock('react-native-reanimated', async (importOriginal) => {
  const reanimated = await importOriginal<typeof import('react-native-reanimated')>()

  return {
    ...reanimated,
    // mirrors defineAnimation on the ReactNative runtime: during
    // initialUpdaterRun (IN_STYLE_UPDATER) withTiming/withSpring return the
    // plain starting value, not an animation descriptor
    withTiming: ((toValue: unknown) => toValue) as typeof reanimated.withTiming,
    withSpring: ((toValue: unknown) => toValue) as typeof reanimated.withSpring,
  }
})

const { createAnimations } = await import('@tamagui/animations-reanimated')

const animations = createAnimations({
  medium: {
    damping: 16,
    stiffness: 90,
  },
})

const config = createTamagui({
  ...getDefaultTamaguiConfig('native'),
  animations,
})

afterEach(() => {
  vi.restoreAllMocks()
})

// when the style updater re-initializes after a color key has already
// emitted, withTiming/withSpring hand back the raw color string; the onStart
// seed wrapper must not assume an animation descriptor — assigning onStart
// onto the primitive throws
// "Cannot create property 'onStart' on string 'rgba(0, 0, 0, 0)'"
// and React 19 responds to the render error by unmounting the root.
test('initial updater run with emitted color history does not throw', async () => {
  // the updater runs from a mapper microtask after the commit, so the throw
  // surfaces as an uncaught exception rather than rejecting act
  const unhandled: string[] = []
  const onUncaught = (error: unknown) => {
    unhandled.push(String(error))
  }
  process.on('uncaughtException', onUncaught)

  try {
    let rendered: TestRenderer.ReactTestRenderer | null = null

    await act(async () => {
      rendered = TestRenderer.create(
        <TamaguiProvider config={config} defaultTheme="light">
          <YStack backgroundColor="transparent" transition="medium" />
        </TamaguiProvider>
      )
    })

    await act(async () => {
      rendered!.update(
        <TamaguiProvider config={config} defaultTheme="light">
          <YStack backgroundColor="red" transition="medium" />
        </TamaguiProvider>
      )
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(unhandled.join('\n')).not.toContain("Cannot create property 'onStart'")

    rendered!.unmount()
  } finally {
    process.off('uncaughtException', onUncaught)
  }
})
