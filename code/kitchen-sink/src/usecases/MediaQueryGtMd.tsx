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
      testID="media-test-both"
      h={100}
      w={100}
      bc="red"
      $md={{ bc: 'yellow' }}
      $gtMd={{ bc: 'green' }}
    />

    {/* Test 2: Only $gtMd - should NOT apply on small screens */}
    <YStack
      testID="media-test-gtmd-only"
      h={100}
      w={100}
      bc="red"
      $gtMd={{ bc: 'green' }}
    />

    {/* Test 3: Only $md - should apply on small screens */}
    <YStack
      testID="media-test-md-only"
      h={100}
      w={100}
      bc="red"
      $md={{ bc: 'yellow' }}
    />

    {/* Test 4: $sm, $md, and $gtMd together */}
    <YStack
      testID="media-test-all"
      h={100}
      w={100}
      bc="red"
      $sm={{ bc: 'blue' }}
      $md={{ bc: 'yellow' }}
      $gtMd={{ bc: 'green' }}
    />
    </YStack>
  )
}
