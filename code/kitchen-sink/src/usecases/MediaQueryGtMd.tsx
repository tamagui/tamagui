import { Text, useMedia, YStack } from 'tamagui'

/**
 * Test case for media query regression bug (started in 1.132.17)
 *
 * Bug: On small screens (iPhone), $gtMd styles incorrectly apply when they shouldn't.
 * The $md styles should apply on mobile, NOT the $gtMd styles.
 *
 * Breakpoints (from @tamagui/config):
 * - md: maxWidth 1020 (matches when width <= 1020)
 * - gtMd: minWidth 1021 (matches when width > 1020)
 *
 * Expected behavior on iPhone (~390px width):
 * - Test 1: bc should be 'yellow' from $md (gtMd doesn't match)
 * - Test 2: bc should be 'red' (gtMd doesn't match, stays default)
 * - Test 3: bc should be 'yellow' from $md
 * - Test 4: bc should be 'yellow' from $md (md has higher priority than sm)
 */
export const MediaQueryGtMd = () => {
  const media = useMedia()

  return (
    <YStack p="$4" gap="$4">
      {/* Display current media state for Detox verification */}
      <Text testID="media-state-sm">{`sm: ${media.sm}`}</Text>
      <Text testID="media-state-md">{`md: ${media.md}`}</Text>
      <Text testID="media-state-gtMd">{`gtMd: ${media.gtMd}`}</Text>

    {/* Test 1: Both $md and $gtMd - should respect breakpoint boundaries */}
    <YStack
      id="media-test-both"
      testID="media-test-both"
      height={100}
      width={100}
      backgroundColor="red"
      $md={{ backgroundColor: 'yellow' }}
      $gtMd={{ backgroundColor: 'green' }}
    />

    {/* Test 2: Only $gtMd - should NOT apply on small screens */}
    <YStack
      id="media-test-gtmd-only"
      testID="media-test-gtmd-only"
      height={100}
      width={100}
      backgroundColor="red"
      $gtMd={{ backgroundColor: 'green' }}
    />

    {/* Test 3: Only $md - should apply on small screens */}
    <YStack
      id="media-test-md-only"
      testID="media-test-md-only"
      height={100}
      width={100}
      backgroundColor="red"
      $md={{ backgroundColor: 'yellow' }}
    />

    {/* Test 4: $sm, $md, and $gtMd together */}
    <YStack
      id="media-test-all"
      testID="media-test-all"
      height={100}
      width={100}
      backgroundColor="red"
      $sm={{ backgroundColor: 'blue' }}
      $md={{ backgroundColor: 'yellow' }}
      $gtMd={{ backgroundColor: 'green' }}
    />
    </YStack>
  )
}
