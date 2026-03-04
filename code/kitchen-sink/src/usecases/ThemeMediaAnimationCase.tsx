import { Square, YStack, Text } from 'tamagui'

/**
 * Test case for $theme-dark/$theme-light with animation drivers.
 *
 * Bug: When using an inline animation driver (e.g., motion), base styles are
 * applied as inline styles which override theme media CSS classes due to
 * CSS specificity. This means $theme-dark and $theme-light have no effect.
 */
export function ThemeMediaAnimationCase() {
  return (
    <YStack p="$4" gap="$4">
      <Text fontSize="$5" fontWeight="bold">
        Theme Media + Animation
      </Text>

      <Square
        testID="theme-media-animated"
        data-testid="theme-media-animated"
        size={100}
        bg="$color1"
        transition="quick"
        $theme-dark={{
          bg: '$color3',
        }}
      />

      <Square
        testID="theme-media-static"
        data-testid="theme-media-static"
        size={100}
        bg="$color1"
        $theme-dark={{
          bg: '$color3',
        }}
      />
    </YStack>
  )
}
