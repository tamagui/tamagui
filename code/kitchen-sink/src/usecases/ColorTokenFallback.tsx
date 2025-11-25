import { Square, Theme, YStack, Text } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

/**
 * Test case for GitHub issue #3620: Theme switching broken after v1.132.15
 *
 * Color tokens should act as fallbacks - if a theme defines a value for the same key,
 * the theme value should take precedence over the color token.
 *
 * The bug was that Object.assign(theme, colorTokens) was overwriting theme values
 * with color token values instead of the other way around.
 */
export function ColorTokenFallback() {
  return (
    <YStack gap="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$6">
        Color Token Fallback Test (Issue #3620)
      </Text>

      {/* Test Case 1: Theme overrides color token */}
      <YStack gap="$2">
        <Text fontWeight="bold">
          Theme value should override color token (customRed should be green #00ff00)
        </Text>
        {/* @ts-expect-error - custom test theme */}
        <Theme name="light_ColorTokenTest">
          <Square
            id={TEST_IDS.colorTokenFallbackThemeValue}
            backgroundColor="$customRed"
            size={100}
          />
        </Theme>
      </YStack>

      {/* Test Case 2: Color token used as fallback when theme doesn't define it */}
      <YStack gap="$2">
        <Text fontWeight="bold">
          Color token as fallback (customBlue should be blue #0000ff)
        </Text>
        {/* @ts-expect-error - custom test theme */}
        <Theme name="light_ColorTokenTest">
          <Square
            id={TEST_IDS.colorTokenFallbackTokenValue}
            backgroundColor="$customBlue"
            size={100}
          />
        </Theme>
      </YStack>
    </YStack>
  )
}
