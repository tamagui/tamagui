import { Theme, YStack, Text, styled, SizableText } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

/**
 * Test case for GitHub issue #2817: Component theme not applied with theme prop
 *
 * When a named component uses `theme="blue"` prop, it should look for
 * `blue_ComponentName` theme in addition to scheme-prefixed versions.
 */

const MyLabel = styled(SizableText, {
  name: 'MyLabel',
})

export function ComponentThemeProp() {
  return (
    <YStack gap="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$6">
        Component Theme Prop Test (Issue #2817)
      </Text>

      {/* Test Case 1: Default theme uses light_MyLabel (red) */}
      <YStack gap="$2">
        <Text fontWeight="bold">Default: should use light_MyLabel theme (red color)</Text>
        <MyLabel id={TEST_IDS.componentThemeDefault}>This text should be RED</MyLabel>
      </YStack>

      {/* Test Case 2: theme="green" prop should find light_green_MyLabel */}
      <YStack gap="$2">
        <MyLabel id={TEST_IDS.componentThemeProp} theme="green">
          This text should be GREEN
        </MyLabel>
      </YStack>

      {/* Test Case 3: Theme wrapper should also work */}
      <YStack gap="$2">
        <Theme name="green">
          <MyLabel id={TEST_IDS.componentThemeWrapper}>This text should be GREEN</MyLabel>
        </Theme>
      </YStack>
    </YStack>
  )
}
