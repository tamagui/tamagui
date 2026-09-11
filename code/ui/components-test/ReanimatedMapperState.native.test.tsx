import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, expect, test, vi } from 'vitest'

vi.mock('react-native-reanimated', async (importOriginal) => {
  const reanimated = await importOriginal<typeof import('react-native-reanimated')>()

  return {
    ...reanimated,
    useSharedValue(initialValue: unknown) {
      const sharedValue = reanimated.useSharedValue(initialValue)
      if (initialValue && typeof initialValue === 'object' && 'emitted' in initialValue) {
        // mirrors Worklets' serializable-object write guard during the JS initial run
        Object.freeze(sharedValue.value)
      }
      return sharedValue
    },
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

test('does not mutate mapper shared-value objects during the JS-thread render', async () => {
  let rendered: TestRenderer.ReactTestRenderer | null = null

  await expect(
    act(async () => {
      rendered = TestRenderer.create(
        <TamaguiProvider config={config} defaultTheme="light">
          <YStack width={100} opacity={0.5} transition="medium" />
        </TamaguiProvider>
      )
    })
  ).resolves.toBeUndefined()

  rendered?.unmount()
})
