import { useState } from 'react'
import { Text, View, XStack, YStack, styled } from 'tamagui'

/**
 * Test cases for native group press style behaviors:
 *
 * 1. $group-press WITHOUT transition
 * 2. $group-press WITH transition
 * 3. Named group ($group-testy-press)
 * 4. Press and drag off behavior - should unpress correctly
 *
 * Colors:
 * - Default: blue (#0000ff via $blue10)
 * - Pressed: red (#ff0000 via $red10)
 */

// child that reacts to group press WITHOUT transition
const GroupPressChild = styled(View, {
  name: 'GroupPressChild',
  width: 150,
  height: 60,
  backgroundColor: '$blue10',
  alignItems: 'center',
  justifyContent: 'center',

  '$group-press': {
    backgroundColor: '$red10',
  },
})

// child that reacts to group press WITH transition
const GroupPressChildAnimated = styled(View, {
  name: 'GroupPressChildAnimated',
  width: 150,
  height: 60,
  backgroundColor: '$blue10',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'quick',

  '$group-press': {
    backgroundColor: '$red10',
  },
})

// child that reacts to named group press
const NamedGroupPressChild = styled(View, {
  name: 'NamedGroupPressChild',
  width: 150,
  height: 60,
  backgroundColor: '$blue10',
  alignItems: 'center',
  justifyContent: 'center',

  '$group-testy-press': {
    backgroundColor: '$red10',
  },
})

// child with named group + transition
const NamedGroupPressChildAnimated = styled(View, {
  name: 'NamedGroupPressChildAnimated',
  width: 150,
  height: 60,
  backgroundColor: '$blue10',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'quick',

  '$group-testy-press': {
    backgroundColor: '$red10',
  },
})

export function GroupPressNative() {
  const [state1, setState1] = useState({ pressIn: 0, pressOut: 0, isPressed: false })
  const [state2, setState2] = useState({ pressIn: 0, pressOut: 0, isPressed: false })
  const [state3, setState3] = useState({ pressIn: 0, pressOut: 0, isPressed: false })
  const [state4, setState4] = useState({ pressIn: 0, pressOut: 0, isPressed: false })

  return (
    <YStack gap="$3" padding="$3" testID="group-press-native-root">
      <Text fontSize="$4" fontWeight="bold">
        Group Press Tests
      </Text>

      {/* test 1: $group-press WITHOUT transition */}
      <YStack gap="$1">
        <Text fontSize="$2">1. Group (no transition)</Text>
        <YStack
          group
          testID="group-no-transition"
          backgroundColor="$gray5"
          padding="$2"
          onPressIn={() =>
            setState1((s) => ({ ...s, pressIn: s.pressIn + 1, isPressed: true }))
          }
          onPressOut={() =>
            setState1((s) => ({ ...s, pressOut: s.pressOut + 1, isPressed: false }))
          }
        >
          <GroupPressChild testID="group-child-no-transition">
            <Text color="white" fontSize="$2">
              CHILD
            </Text>
          </GroupPressChild>
        </YStack>
        <XStack gap="$2">
          <Text testID="group1-press-in">In: {state1.pressIn}</Text>
          <Text testID="group1-press-out">Out: {state1.pressOut}</Text>
          <Text testID="group1-is-pressed">P: {state1.isPressed ? 'Y' : 'N'}</Text>
        </XStack>
      </YStack>

      {/* test 2: $group-press WITH transition */}
      <YStack gap="$1">
        <Text fontSize="$2">2. Group (with transition)</Text>
        <YStack
          group
          testID="group-with-transition"
          backgroundColor="$gray5"
          padding="$2"
          onPressIn={() =>
            setState2((s) => ({ ...s, pressIn: s.pressIn + 1, isPressed: true }))
          }
          onPressOut={() =>
            setState2((s) => ({ ...s, pressOut: s.pressOut + 1, isPressed: false }))
          }
        >
          <GroupPressChildAnimated testID="group-child-with-transition">
            <Text color="white" fontSize="$2">
              ANIMATED
            </Text>
          </GroupPressChildAnimated>
        </YStack>
        <XStack gap="$2">
          <Text testID="group2-press-in">In: {state2.pressIn}</Text>
          <Text testID="group2-press-out">Out: {state2.pressOut}</Text>
          <Text testID="group2-is-pressed">P: {state2.isPressed ? 'Y' : 'N'}</Text>
        </XStack>
      </YStack>

      {/* test 3: named $group-testy-press WITHOUT transition */}
      <YStack gap="$1">
        <Text fontSize="$2">3. Named group (no transition)</Text>
        <YStack
          group="testy"
          testID="named-group-no-transition"
          backgroundColor="$gray5"
          padding="$2"
          onPressIn={() =>
            setState3((s) => ({ ...s, pressIn: s.pressIn + 1, isPressed: true }))
          }
          onPressOut={() =>
            setState3((s) => ({ ...s, pressOut: s.pressOut + 1, isPressed: false }))
          }
        >
          <NamedGroupPressChild testID="named-group-child-no-transition">
            <Text color="white" fontSize="$2">
              NAMED
            </Text>
          </NamedGroupPressChild>
        </YStack>
        <XStack gap="$2">
          <Text testID="group3-press-in">In: {state3.pressIn}</Text>
          <Text testID="group3-press-out">Out: {state3.pressOut}</Text>
          <Text testID="group3-is-pressed">P: {state3.isPressed ? 'Y' : 'N'}</Text>
        </XStack>
      </YStack>

      {/* test 4: named $group-testy-press WITH transition */}
      <YStack gap="$1">
        <Text fontSize="$2">4. Named group (with transition)</Text>
        <YStack
          group="testy"
          testID="named-group-with-transition"
          backgroundColor="$gray5"
          padding="$2"
          onPressIn={() =>
            setState4((s) => ({ ...s, pressIn: s.pressIn + 1, isPressed: true }))
          }
          onPressOut={() =>
            setState4((s) => ({ ...s, pressOut: s.pressOut + 1, isPressed: false }))
          }
        >
          <NamedGroupPressChildAnimated testID="named-group-child-with-transition">
            <Text color="white" fontSize="$2">
              NAMED+ANIM
            </Text>
          </NamedGroupPressChildAnimated>
        </YStack>
        <XStack gap="$2">
          <Text testID="group4-press-in">In: {state4.pressIn}</Text>
          <Text testID="group4-press-out">Out: {state4.pressOut}</Text>
          <Text testID="group4-is-pressed">P: {state4.isPressed ? 'Y' : 'N'}</Text>
        </XStack>
      </YStack>
    </YStack>
  )
}
