import { YStack, Text } from 'tamagui'

/**
 * Test case for flex: N expansion with flexShrink: 0 (RN-compatible default)
 *
 * Two YStack children with flex={1} inside a fixed-height column container.
 * With correct behavior (flexShrink: 0), each child takes ~200px.
 * With the bug (flexShrink: 1), children collapse to 0 height.
 */
export function FlexShrinkCase() {
  return (
    <YStack height={400} backgroundColor="$color3" testID="flex-container" data-testid="flex-container">
      <YStack flex={1} backgroundColor="$blue5" testID="flex-child" data-testid="flex-child">
        <Text>Child 1 (flex=1)</Text>
      </YStack>
      <YStack flex={1} backgroundColor="$green5" testID="flex-child" data-testid="flex-child">
        <Text>Child 2 (flex=1)</Text>
      </YStack>
    </YStack>
  )
}
