import { Square, Theme, YStack, Text } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

/**
 * Test case for GitHub issue #3620: Theme switching broken after v1.132.15
 *
 * V3 flat values resolve the property's configured token category before the
 * unified theme namespace, then use theme values as the fallback.
 */
export function ColorTokenFallback() {
  return (
    <YStack gap="4" padding="4">
      <Text fontWeight="bold" fontSize="6">
        Color Token Fallback Test (Issue #3620)
      </Text>

      {/* Test Case 1: the bound color category wins */}
      <YStack gap="2">
        <Text fontWeight="bold">
          Color token overrides a same-named theme value (customRed is red #ff0000)
        </Text>
        {/* @ts-expect-error - custom test theme */}
        <Theme name="light_ColorTokenTest">
          <Square
            id={TEST_IDS.colorTokenFallbackThemeValue}
            backgroundColor="customRed"
            size={100}
          />
        </Theme>
      </YStack>

      {/* Test Case 2: Color token used as fallback when theme doesn't define it */}
      <YStack gap="2">
        <Text fontWeight="bold">
          Color token as fallback (customBlue should be blue #0000ff)
        </Text>
        {/* @ts-expect-error - custom test theme */}
        <Theme name="light_ColorTokenTest">
          <Square
            id={TEST_IDS.colorTokenFallbackTokenValue}
            backgroundColor="customBlue"
            size={100}
          />
        </Theme>
      </YStack>
    </YStack>
  )
}
