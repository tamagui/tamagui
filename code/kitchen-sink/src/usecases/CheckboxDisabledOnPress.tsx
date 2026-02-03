import { Check as CheckIcon } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Checkbox, Label, Paragraph, XStack, YStack } from 'tamagui'

/**
 * Test case for issue #3267
 * Checkbox disabled onPress should be consistent between web and native
 * When disabled=true, onPress should NOT be called on either platform
 */
export function CheckboxDisabledOnPress() {
  const [pressCount, setPressCount] = useState(0)
  const [disabledPressCount, setDisabledPressCount] = useState(0)

  return (
    <YStack padding="$4" gap="$4">
      <Paragraph>Test: Disabled checkbox should NOT trigger onPress</Paragraph>

      {/* Enabled checkbox - onPress SHOULD work */}
      <XStack gap="$4" alignItems="center">
        <Checkbox
          id="enabled-checkbox"
          testID="enabled-checkbox"
          size="$5"
          onPress={() => setPressCount((c) => c + 1)}
        >
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox>
        <Label htmlFor="enabled-checkbox">Enabled checkbox</Label>
      </XStack>
      <Paragraph testID="enabled-press-count">
        Enabled press count: {pressCount}
      </Paragraph>

      {/* Disabled checkbox - onPress should NOT work */}
      <XStack gap="$4" alignItems="center">
        <Checkbox
          id="disabled-checkbox"
          testID="disabled-checkbox"
          size="$5"
          disabled
          onPress={() => setDisabledPressCount((c) => c + 1)}
        >
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox>
        <Label htmlFor="disabled-checkbox">Disabled checkbox</Label>
      </XStack>
      <Paragraph testID="disabled-press-count">
        Disabled press count: {disabledPressCount}
      </Paragraph>

      <Paragraph color="$color10" fontSize="$2">
        Expected: Clicking disabled checkbox should NOT increment the count.
        {'\n'}
        Bug: On native, the count was incrementing even when disabled.
      </Paragraph>
    </YStack>
  )
}
