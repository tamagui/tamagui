import { useState } from 'react'
import { Pressable } from 'react-native'
import { Button, Text, YStack, XStack } from 'tamagui'

/**
 * Test case for nested press exclusivity:
 *
 * Verifies that when a Tamagui component (using RNGH) is nested inside
 * a RN Pressable, only the inner Tamagui component fires onPress.
 *
 * This tests the responder claiming behavior that blocks parent
 * RN Pressable/TouchableOpacity from receiving press events.
 */

export function NestedPressExclusive() {
  const [parentPressCount, setParentPressCount] = useState(0)
  const [childPressCount, setChildPressCount] = useState(0)
  const [lastPressed, setLastPressed] = useState<'none' | 'parent' | 'child'>('none')

  return (
    <YStack gap="$4" padding="$4" testID="nested-press-root">
      <Text fontSize="$5" fontWeight="bold">
        Nested Press Exclusivity
      </Text>
      <Text fontSize="$3" color="$gray11">
        Tapping the button should only fire child onPress, not parent.
      </Text>

      {/* RN Pressable parent with Tamagui Button child */}
      <Pressable
        testID="rn-pressable-parent"
        onPress={() => {
          setParentPressCount((c) => c + 1)
          setLastPressed('parent')
        }}
        style={{
          padding: 20,
          backgroundColor: '#e0e0e0',
          borderRadius: 8,
        }}
      >
        <Text testID="parent-label" marginBottom="$2">
          RN Pressable (parent)
        </Text>
        <Button
          testID="tamagui-button-child"
          onPress={() => {
            setChildPressCount((c) => c + 1)
            setLastPressed('child')
          }}
        >
          Tamagui Button (child)
        </Button>
      </Pressable>

      {/* counters for verification */}
      <YStack gap="$2">
        <XStack gap="$4">
          <Text testID="parent-press-count">Parent: {parentPressCount}</Text>
          <Text testID="child-press-count">Child: {childPressCount}</Text>
        </XStack>
        <Text testID="last-pressed">Last pressed: {lastPressed}</Text>
      </YStack>

      {/* also test nested Tamagui components (should also be exclusive) */}
      <Text fontSize="$4" fontWeight="bold" marginTop="$4">
        Tamagui → Tamagui nesting
      </Text>
      <NestedTamaguiTest />
    </YStack>
  )
}

function NestedTamaguiTest() {
  const [outerCount, setOuterCount] = useState(0)
  const [innerCount, setInnerCount] = useState(0)

  return (
    <YStack gap="$2">
      <Button
        testID="outer-tamagui-button"
        size="$5"
        onPress={() => setOuterCount((c) => c + 1)}
      >
        <YStack alignItems="center">
          <Text>Outer Tamagui Button</Text>
          <Button
            testID="inner-tamagui-button"
            size="$3"
            onPress={() => setInnerCount((c) => c + 1)}
          >
            Inner Button
          </Button>
        </YStack>
      </Button>
      <XStack gap="$4">
        <Text testID="outer-press-count">Outer: {outerCount}</Text>
        <Text testID="inner-press-count">Inner: {innerCount}</Text>
      </XStack>
    </YStack>
  )
}
