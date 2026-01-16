import React from 'react'
import { Button, Square, Theme, YStack, Text, useThemeName } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

/**
 * Test cases for theme component resolution (commit 5839319146 goals)
 *
 * These tests verify that the theme resolution algorithm correctly handles:
 * 1. Explicit scheme overrides (e.g., dark_green inside blue parent)
 * 2. Inheriting scheme from parent for component themes
 * 3. Preserving sub-themes when only componentName is provided (no backtracking)
 */

function ThemeNameDisplay({ id }: { id: string }) {
  const themeName = useThemeName()
  return (
    <Square id={id} bg="$background" size={100} alignItems="center" justifyContent="center">
      <Text fontSize="$2" color="$color">
        {themeName}
      </Text>
    </Square>
  )
}

export function ThemeComponentResolution() {
  return (
    <YStack gap="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$6">
        Theme Component Resolution Tests
      </Text>

      {/* Goal 1a: Explicit scheme override */}
      <YStack gap="$2">
        <Text fontWeight="bold">Goal 1a: Explicit scheme override</Text>
        <Text fontSize="$2">
          When theme="dark_green" is set explicitly, it should be used even inside a blue parent
        </Text>

        {/* Direct: dark_green theme */}
        <YStack gap="$1">
          <Text>Direct dark_green:</Text>
          <Theme name="dark_green">
            <ThemeNameDisplay id={TEST_IDS.themeExplicitSchemeDirect} />
          </Theme>
        </YStack>

        {/* Nested: blue parent, dark_green child */}
        <YStack gap="$1">
          <Text>Nested: blue → dark_green (should match above):</Text>
          <Theme name="blue">
            <Theme name="dark_green">
              <ThemeNameDisplay id={TEST_IDS.themeExplicitSchemeNested} />
            </Theme>
          </Theme>
        </YStack>
      </YStack>

      {/* Goal 1b: Inherit scheme for component */}
      <YStack gap="$2">
        <Text fontWeight="bold">Goal 1b: Inherit scheme from parent</Text>
        <Text fontSize="$2">
          When theme="green" (no scheme), it should inherit light/dark from parent
        </Text>

        {/* Direct: light_green theme */}
        <YStack gap="$1">
          <Text>Direct light_green:</Text>
          <Theme name="light_green">
            <ThemeNameDisplay id={TEST_IDS.themeInheritSchemeDirect} />
          </Theme>
        </YStack>

        {/* Nested: light → green should become light_green */}
        <YStack gap="$1">
          <Text>Nested: light → green (should become light_green):</Text>
          <Theme name="light">
            <Theme name="green">
              <ThemeNameDisplay id={TEST_IDS.themeInheritSchemeNested} />
            </Theme>
          </Theme>
        </YStack>
      </YStack>

      {/* Goal 2: Component-only preserves sub-theme */}
      <YStack gap="$2">
        <Text fontWeight="bold">Goal 2: Sub-theme preservation</Text>
        <Text fontSize="$2">
          When inside alt1 sub-theme, components should NOT backtrack to find a component theme
        </Text>

        {/* Direct: light_blue_alt1 */}
        <YStack gap="$1">
          <Text>Direct light_blue_alt1:</Text>
          <Theme name="light_blue_alt1">
            <ThemeNameDisplay id={TEST_IDS.themeAlt1Direct} />
          </Theme>
        </YStack>

        {/* Nested: blue → alt1, then a Button (should stay on alt1, not get Button theme) */}
        <YStack gap="$1">
          <Text>Nested: blue → alt1 (component should stay on alt1):</Text>
          <Theme name="blue">
            <Theme name="alt1">
              <ThemeNameDisplay id={TEST_IDS.themeAlt1WithComponent} />
            </Theme>
          </Theme>
        </YStack>

      </YStack>
    </YStack>
  )
}
