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
  const [childPressInCount, setChildPressInCount] = useState(0)
  const [childPressOutCount, setChildPressOutCount] = useState(0)
  const [soloPressCount, setSoloPressCount] = useState(0)
  const [soloPressInCount, setSoloPressInCount] = useState(0)
  const [soloPressOutCount, setSoloPressOutCount] = useState(0)
  const [lastPressed, setLastPressed] = useState<'none' | 'parent' | 'child'>('none')

  const resetCounts = () => {
    setParentPressCount(0)
    setChildPressCount(0)
    setChildPressInCount(0)
    setChildPressOutCount(0)
    setSoloPressCount(0)
    setSoloPressInCount(0)
    setSoloPressOutCount(0)
    setLastPressed('none')
  }

  return (
    <YStack gap="$4" padding="$4" testID="nested-press-root">
      <Text fontSize="$5" fontWeight="bold">
        Nested Press Exclusivity
      </Text>
      <Text fontSize="$3" color="$gray11">
        Tapping the button should only fire child onPress, not parent.
      </Text>

      <YStack gap="$2">
        <Text fontSize="$4" fontWeight="bold">
          Standalone Tamagui Button
        </Text>
        <Button
          testID="tamagui-button-solo"
          onPressIn={() => setSoloPressInCount((c) => c + 1)}
          onPressOut={() => setSoloPressOutCount((c) => c + 1)}
          onPress={() => setSoloPressCount((c) => c + 1)}
        >
          Tamagui Button (solo)
        </Button>
        <XStack gap="$4">
          <Text testID="solo-press-count">Solo: {soloPressCount}</Text>
          <Text testID="solo-press-in-count">Solo in: {soloPressInCount}</Text>
          <Text testID="solo-press-out-count">Solo out: {soloPressOutCount}</Text>
        </XStack>
      </YStack>

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
          onPressIn={() => setChildPressInCount((c) => c + 1)}
          onPressOut={() => setChildPressOutCount((c) => c + 1)}
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
        <XStack gap="$4">
          <Text testID="child-press-in-count">Child in: {childPressInCount}</Text>
          <Text testID="child-press-out-count">Child out: {childPressOutCount}</Text>
        </XStack>
        <Text testID="last-pressed">Last pressed: {lastPressed}</Text>
        <Button testID="nested-press-reset" size="$3" onPress={resetCounts}>
          Reset counts
        </Button>
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
