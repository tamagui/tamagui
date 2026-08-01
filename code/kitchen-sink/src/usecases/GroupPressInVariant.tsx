import { Text, YStack, styled } from 'tamagui'

// Issue #3613: $group-press not applied when in variant
// This tests that $group-press works inside variants

const GroupPressText = styled(Text, {
  name: 'GroupPressText',
  color: 'rgb(0, 0, 0)',

  variants: {
    variant: {
      primary: {
        color: 'rgb(0, 0, 255) group-press:rgb(255, 0, 0)',
      },
      secondary: {
        color: 'rgb(0, 128, 0) group-press:rgb(255, 255, 0)',
      },
    },
  } as const,
})

// Also test with a named group
const GroupPressTextNamed = styled(Text, {
  name: 'GroupPressTextNamed',
  color: 'rgb(0, 0, 0)',

  variants: {
    variant: {
      primary: {
        color: 'rgb(0, 0, 255) group-press/testgroup:rgb(255, 0, 0)',
      },
    },
  } as const,
})

// Test $group-press at root level for comparison (this should already work)
const GroupPressTextRoot = styled(Text, {
  name: 'GroupPressTextRoot',
  color: 'rgb(0, 0, 255) group-press:rgb(255, 0, 0)',
})

export function GroupPressInVariant() {
  return (
    <YStack gap="4" padding="4">
      {/* Test 1: $group-press in variant with unnamed group */}
      <YStack group backgroundColor="gray5" padding="4" id="test-unnamed-group">
        <GroupPressText id="test-variant-primary" variant="primary">
          Primary variant - should turn red on press
        </GroupPressText>
      </YStack>

      {/* Test 2: $group-press in variant with named group */}
      <YStack
        // @ts-expect-error - testing named group feature
        group="testgroup"
        backgroundColor="gray5"
        padding="4"
        id="test-named-group"
      >
        <GroupPressTextNamed id="test-variant-named" variant="primary">
          Named group variant - should turn red on press
        </GroupPressTextNamed>
      </YStack>

      {/* Test 3: $group-press at root level (comparison - this should work) */}
      <YStack group backgroundColor="gray5" padding="4" id="test-root-group">
        <GroupPressTextRoot id="test-root-press">
          Root level $group-press - should turn red on press
        </GroupPressTextRoot>
      </YStack>

      {/* Test 4: secondary variant */}
      <YStack group backgroundColor="gray5" padding="4" id="test-secondary-group">
        <GroupPressText id="test-variant-secondary" variant="secondary">
          Secondary variant - should turn yellow on press
        </GroupPressText>
      </YStack>
    </YStack>
  )
}
