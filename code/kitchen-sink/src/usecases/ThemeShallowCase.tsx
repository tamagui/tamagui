import { Square, View, Text, Theme, YStack } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

/**
 * Test case for themeShallow prop behavior
 *
 * The themeShallow prop should NOT affect DOM structure (span wrapping).
 * It only affects whether grandchildren inherit the theme change.
 *
 * This test verifies that toggling themeShallow doesn't cause DOM reparenting.
 */
export function ThemeShallowCase() {
  return (
    <YStack gap="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$6">
        Theme Shallow DOM Structure Test
      </Text>

      {/* Test Case 1: Without themeShallow - normal theme wrapping */}
      <YStack gap="$2">
        <Text fontWeight="bold">Without themeShallow (normal)</Text>
        <Theme name="dark">
          <View id={TEST_IDS.themeShallowNormal} backgroundColor="$background" padding="$4">
            <Text color="$color">Normal theme - children get dark theme</Text>
            <Theme name="light">
              <Square backgroundColor="$background" size={50}>
                <Text color="$color" fontSize="$1">
                  Light
                </Text>
              </Square>
            </Theme>
          </View>
        </Theme>
      </YStack>

      {/* Test Case 2: With themeShallow - theme doesn't propagate to grandchildren */}
      <YStack gap="$2">
        <Text fontWeight="bold">With themeShallow</Text>
        <Theme name="dark">
          <View
            id={TEST_IDS.themeShallowEnabled}
            themeShallow
            backgroundColor="$background"
            padding="$4"
          >
            <Text color="$color">Shallow theme - grandchildren reset to parent theme</Text>
            <Theme name="light">
              <Square backgroundColor="$background" size={50}>
                <Text color="$color" fontSize="$1">
                  Light
                </Text>
              </Square>
            </Theme>
          </View>
        </Theme>
      </YStack>

      {/* Test Case 3: Component with themeShallow for DOM structure comparison */}
      <YStack gap="$2">
        <Text fontWeight="bold">DOM structure comparison container</Text>
        <View id={TEST_IDS.themeShallowContainer}>
          <Theme name="dark">
            <View
              id={TEST_IDS.themeShallowInner}
              themeShallow
              backgroundColor="$background"
              padding="$2"
            >
              <Text color="$color">Inner content</Text>
            </View>
          </Theme>
        </View>
      </YStack>
    </YStack>
  )
}
