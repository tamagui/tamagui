import { Text, useMedia, YStack } from 'tamagui'

/**
 * Test case for a media query regression bug (started in 1.132.17)
 *
 * Bug: on small screens the min-width query incorrectly applied. The max-width
 * styles should apply on mobile, not the min-width ones. The case is still named
 * for the v3-config `gtMd` key the bug was first reported against; config v6 is
 * mobile-first, so the same pair is `max-md` and `md`.
 *
 * Breakpoints (from @tamagui/config/v6):
 * - max-md: maxWidth 767.98 (matches when width < 768)
 * - md: minWidth 768 (matches when width >= 768)
 *
 * Expected behavior on iPhone (~390px width):
 * - Test 1: backgroundColor should be 'yellow' from max-md (md doesn't match)
 * - Test 2: backgroundColor should be 'red' (md doesn't match, stays default)
 * - Test 3: backgroundColor should be 'yellow' from max-md
 * - Test 4: backgroundColor should be 'blue' from max-sm, which is declared after
 *   max-md and therefore wins
 */
export const MediaQueryGtMd = () => {
  const media = useMedia()

  return (
    <YStack p="4" gap="4">
      {/* Display current media state for Detox verification */}
      <Text testID="media-state-max-sm">{`max-sm: ${media['max-sm']}`}</Text>
      <Text testID="media-state-max-md">{`max-md: ${media['max-md']}`}</Text>
      <Text testID="media-state-md">{`md: ${media.md}`}</Text>

      {/* Test 1: Both max-md and md - should respect breakpoint boundaries */}
      <YStack
        id="media-test-both"
        testID="media-test-both"
        height={100}
        width={100}
        backgroundColor="red max-md:yellow md:green"
      />

      {/* Test 2: Only md - should NOT apply on small screens */}
      <YStack
        id="media-test-md-only"
        testID="media-test-md-only"
        height={100}
        width={100}
        backgroundColor="red md:green"
      />

      {/* Test 3: Only max-md - should apply on small screens */}
      <YStack
        id="media-test-max-md-only"
        testID="media-test-max-md-only"
        height={100}
        width={100}
        backgroundColor="red max-md:yellow"
      />

      {/* Test 4: max-sm, max-md, and md together */}
      <YStack
        id="media-test-all"
        testID="media-test-all"
        height={100}
        width={100}
        backgroundColor="red max-md:yellow max-sm:blue md:green"
      />
    </YStack>
  )
}
