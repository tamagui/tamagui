import { useState } from 'react'
import { Text, View, XStack, YStack, styled } from 'tamagui'

/**
 * Test cases for native press style behaviors:
 *
 * 1. press clause WITHOUT transition - tests fallback path in createComponent
 * 2. press clause WITH transition - tests animation driver path
 * 3. Press and drag off behavior - should unpress correctly
 *
 * Colors are chosen to be easily distinguishable in screenshots:
 * - Default: strong blue (#155dfc via blue-600)
 * - Pressed: strong red (#e7000b via red-600)
 */

// press clause WITHOUT transition - tests the fallback to normal re-render
const ColorTestPressable = styled(View, {
  name: 'ColorTestPressable',
  width: 200,
  height: 100,
  backgroundColor: 'blue-600 press:red-600',
  alignItems: 'center',
  justifyContent: 'center',
})

// press clause WITH transition - tests animation driver path
const ColorTestPressableAnimated = styled(View, {
  name: 'ColorTestPressableAnimated',
  width: 200,
  height: 100,
  backgroundColor: 'blue-600 press:red-600',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'quick',
})

export function PressStyleNative() {
  const [simplePressState, setSimplePressState] = useState({
    pressInCount: 0,
    pressOutCount: 0,
    isPressed: false,
  })

  const [animatedPressState, setAnimatedPressState] = useState({
    pressInCount: 0,
    pressOutCount: 0,
    isPressed: false,
  })

  return (
    <YStack gap="4" padding="4" testID="press-style-native-root">
      <Text fontSize="5" fontWeight="bold">
        Press Style Tests
      </Text>

      {/* test 1: press clause WITHOUT transition */}
      <YStack gap="2">
        <Text fontSize="3">1. No Transition</Text>
        <Text fontSize="2" color="color10">
          Blue → Red (no animation)
        </Text>
        <ColorTestPressable
          testID="color-test-pressable"
          onPressIn={() => {
            setSimplePressState((s) => ({
              ...s,
              pressInCount: s.pressInCount + 1,
              isPressed: true,
            }))
          }}
          onPressOut={() => {
            setSimplePressState((s) => ({
              ...s,
              pressOutCount: s.pressOutCount + 1,
              isPressed: false,
            }))
          }}
        >
          <Text color="white" fontWeight="bold">
            PRESS ME
          </Text>
        </ColorTestPressable>
        <XStack gap="2">
          <Text testID="simple-press-in-count">In: {simplePressState.pressInCount}</Text>
          <Text testID="simple-press-out-count">
            Out: {simplePressState.pressOutCount}
          </Text>
          <Text testID="simple-is-pressed">
            Pressed: {simplePressState.isPressed ? 'YES' : 'NO'}
          </Text>
        </XStack>
      </YStack>

      {/* test 2: press clause WITH transition */}
      <YStack gap="2">
        <Text fontSize="3">2. With Transition</Text>
        <Text fontSize="2" color="color10">
          Blue → Red (animated)
        </Text>
        <ColorTestPressableAnimated
          testID="animated-color-test-pressable"
          onPressIn={() => {
            setAnimatedPressState((s) => ({
              ...s,
              pressInCount: s.pressInCount + 1,
              isPressed: true,
            }))
          }}
          onPressOut={() => {
            setAnimatedPressState((s) => ({
              ...s,
              pressOutCount: s.pressOutCount + 1,
              isPressed: false,
            }))
          }}
        >
          <Text color="white" fontWeight="bold">
            ANIMATED
          </Text>
        </ColorTestPressableAnimated>
        <XStack gap="2">
          <Text testID="animated-press-in-count">
            In: {animatedPressState.pressInCount}
          </Text>
          <Text testID="animated-press-out-count">
            Out: {animatedPressState.pressOutCount}
          </Text>
          <Text testID="animated-is-pressed">
            Pressed: {animatedPressState.isPressed ? 'YES' : 'NO'}
          </Text>
        </XStack>
      </YStack>
    </YStack>
  )
}
