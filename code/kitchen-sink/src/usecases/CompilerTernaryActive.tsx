/**
 * Tests compiler extraction of ternaries mixing theme-token and non-token values.
 * Regression test for bug where fontWeight ternary was dropped when combined
 * with a theme-token color ternary on native.
 *
 * The compiler's extractToNative was unconditionally adding plain styles
 * (fontWeight) from ternary branches instead of wrapping them in the conditional.
 */

import { useState } from 'react'
import { Button, Text, YStack } from 'tamagui'

function ActiveText({ isActive, label }: { isActive: boolean; label: string }) {
  return (
    <Text
      testID="active-text"
      fontSize="$3"
      fontWeight={isActive ? '700' : '400'}
      color={isActive ? '$color12' : '$color11'}
    >
      {label}
    </Text>
  )
}

function ActiveTextNoOpt({ isActive, label }: { isActive: boolean; label: string }) {
  return (
    <Text
      disableOptimization
      testID="active-text-noopt"
      fontSize="$3"
      fontWeight={isActive ? '700' : '400'}
      color={isActive ? '$color12' : '$color11'}
    >
      {label}
    </Text>
  )
}

export function CompilerTernaryActive() {
  const [isActive, setIsActive] = useState(false)

  return (
    <YStack
      testID="compiler-ternary-active-root"
      flex={1}
      padding="$4"
      gap="$4"
      backgroundColor="$background"
    >
      <Text testID="active-state-label" fontSize="$3">
        Active: {isActive ? 'YES' : 'NO'}
      </Text>

      <Button size="$2" testID="toggle-active" onPress={() => setIsActive((a) => !a)}>
        Toggle Active
      </Button>

      <YStack gap="$2">
        <Text fontSize="$2">Optimized:</Text>
        <YStack testID="opt-text-container" backgroundColor="$background" padding="$2">
          <ActiveText isActive={isActive} label="Hello World" />
        </YStack>
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$2">Non-optimized:</Text>
        <YStack testID="noopt-text-container" backgroundColor="$background" padding="$2">
          <ActiveTextNoOpt isActive={isActive} label="Hello World" />
        </YStack>
      </YStack>
    </YStack>
  )
}
