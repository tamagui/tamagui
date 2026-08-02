import React from 'react'
import { Square, Theme, YStack, Text } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

/**
 * Test case for GitHub issue #3673: Nested theme regression
 *
 * When using nested themes like <Theme name="blue"><Theme name="surface2">,
 * the parent color context (blue) should be preserved, resulting in
 * light_blue_surface2 theme being applied.
 *
 * The bug causes the nested theme to lose the color context, resulting in
 * just light_surface2 being applied instead.
 */
export function ThemeNested() {
  return (
    <YStack gap="4" padding="4">
      <Text fontWeight="bold" fontSize="6">
        Nested Theme Test (Issue #3673)
      </Text>

      {/* Test Case 1: Direct theme vs nested theme comparison */}
      <YStack gap="2">
        <Text fontWeight="bold">Case 1: Direct light_blue_surface2</Text>
        <Theme name="light_blue_surface2">
          <Square id={TEST_IDS.nestedThemeDirect} bg="background" size={100} />
        </Theme>
      </YStack>

      <YStack gap="2">
        <Text fontWeight="bold">
          Case 2: Nested blue → surface2 (should match Case 1)
        </Text>
        <Theme name="blue">
          <Theme name="surface2">
            <Square id={TEST_IDS.nestedThemeNested} bg="background" size={100} />
          </Theme>
        </Theme>
      </YStack>

      {/* Test Case 2: With explicit light parent */}
      <YStack gap="2">
        <Text fontWeight="bold">Case 3: Nested light → blue → surface2</Text>
        <Theme name="light">
          <Theme name="blue">
            <Theme name="surface2">
              <Square id={TEST_IDS.nestedThemeWithParent} bg="background" size={100} />
            </Theme>
          </Theme>
        </Theme>
      </YStack>

      {/* Test Case 3: Different color - red */}
      <YStack gap="2">
        <Text fontWeight="bold">Case 4: Direct light_red_surface2</Text>
        <Theme name="light_red_surface2">
          <Square id={TEST_IDS.nestedThemeRedDirect} bg="background" size={100} />
        </Theme>
      </YStack>

      <YStack gap="2">
        <Text fontWeight="bold">Case 5: Nested red → surface2 (should match Case 4)</Text>
        <Theme name="red">
          <Theme name="surface2">
            <Square id={TEST_IDS.nestedThemeRedNested} bg="background" size={100} />
          </Theme>
        </Theme>
      </YStack>

      {/* Test Case 4: Verify blue and red are different */}
      <YStack gap="2">
        <Text fontWeight="bold">Case 6: Direct light_surface2 (no color - baseline)</Text>
        <Theme name="light_surface2">
          <Square id={TEST_IDS.nestedThemeNoColor} bg="background" size={100} />
        </Theme>
      </YStack>

      {/* Test Case 5: Exact reproduction from issue #3673 - surface1 → surface2 */}
      <YStack gap="2">
        <Text fontWeight="bold">
          Case 7: Direct light_blue_surface2 (expected result)
        </Text>
        <Theme name="light_blue_surface2">
          <Square id={TEST_IDS.nestedSurface1To3Direct} bg="background" size={100} />
        </Theme>
      </YStack>

      <YStack gap="2">
        <Text fontWeight="bold">
          Case 8: Nested blue → surface1 → surface2 (should match Case 7)
        </Text>
        <Theme name="blue">
          <Theme name="surface1">
            <Theme name="surface2">
              <Square id={TEST_IDS.nestedSurface1To3Nested} bg="background" size={100} />
            </Theme>
          </Theme>
        </Theme>
      </YStack>
    </YStack>
  )
}
