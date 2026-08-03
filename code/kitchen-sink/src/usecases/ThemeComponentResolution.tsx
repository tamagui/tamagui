import { Square, Text, Theme, useThemeName, YStack } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

/**
 * Test cases for generated theme path resolution.
 *
 * These tests verify that the theme resolution algorithm correctly handles:
 * 1. Explicit scheme overrides (e.g., dark_green inside blue parent)
 * 2. Inheriting scheme from the parent
 * 3. Preserving a relative level under a color theme
 */

function ThemeNameDisplay({ id }: { id: string }) {
  const themeName = useThemeName()
  return (
    <Square
      id={id}
      bg="background"
      alignItems="center"
      justifyContent="center"
      size={100}
    >
      <Text fontSize="2" color="color">
        {themeName}
      </Text>
    </Square>
  )
}

export function ThemeComponentResolution() {
  return (
    <YStack gap="4" padding="4">
      <Text fontWeight="bold" fontSize="6">
        Theme Component Resolution Tests
      </Text>

      {/* Goal 1a: Explicit scheme override */}
      <YStack gap="2">
        <Text fontWeight="bold">Goal 1a: Explicit scheme override</Text>
        <Text fontSize="2">
          When theme="dark_green" is set explicitly, it should be used even inside a blue
          parent
        </Text>

        {/* Direct: dark_green theme */}
        <YStack gap="1">
          <Text>Direct dark_green:</Text>
          <Theme name="dark_green">
            <ThemeNameDisplay id={TEST_IDS.themeExplicitSchemeDirect} />
          </Theme>
        </YStack>

        {/* Nested: blue parent, dark_green child */}
        <YStack gap="1">
          <Text>Nested: blue → dark_green (should match above):</Text>
          <Theme name="blue">
            <Theme name="dark_green">
              <ThemeNameDisplay id={TEST_IDS.themeExplicitSchemeNested} />
            </Theme>
          </Theme>
        </YStack>
      </YStack>

      {/* Goal 1b: Inherit scheme */}
      <YStack gap="2">
        <Text fontWeight="bold">Goal 1b: Inherit scheme from parent</Text>
        <Text fontSize="2">
          When theme="green" (no scheme), it should inherit light/dark from parent
        </Text>

        {/* Direct: light_green theme */}
        <YStack gap="1">
          <Text>Direct light_green:</Text>
          <Theme name="light_green">
            <ThemeNameDisplay id={TEST_IDS.themeInheritSchemeDirect} />
          </Theme>
        </YStack>

        {/* Nested: light → green should become light_green */}
        <YStack gap="1">
          <Text>Nested: light → green (should become light_green):</Text>
          <Theme name="light">
            <Theme name="green">
              <ThemeNameDisplay id={TEST_IDS.themeInheritSchemeNested} />
            </Theme>
          </Theme>
        </YStack>
      </YStack>

      {/* Goal 2: Relative level path */}
      <YStack gap="2">
        <Text fontWeight="bold">Goal 2: Relative level preservation</Text>
        <Text fontSize="2">A level nested under blue keeps the blue palette.</Text>

        {/* Direct: light_blue_level2 */}
        <YStack gap="1">
          <Text>Direct light_blue_level2:</Text>
          <Theme name="light_blue_level2">
            <ThemeNameDisplay id={TEST_IDS.themeLevel2Direct} />
          </Theme>
        </YStack>

        {/* Nested: blue → level2 */}
        <YStack gap="1">
          <Text>Nested: blue → level2:</Text>
          <Theme name="blue">
            <Theme name="level2">
              <ThemeNameDisplay id={TEST_IDS.themeLevel2Nested} />
            </Theme>
          </Theme>
        </YStack>
      </YStack>
    </YStack>
  )
}
