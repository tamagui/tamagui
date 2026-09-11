/**
 * Test case: the roving focus contract across every RovingFocusGroup consumer.
 * A group is ONE stop in the tab order; arrows move within it and skip disabled
 * items. Covers Tabs, ToggleGroup and RadioGroup, plus a group whose current
 * item is disabled.
 */

import { RadioGroup, Tabs, ToggleGroup, View, YStack } from 'tamagui'

export function RovingFocusCase() {
  return (
    <YStack p="4" gap="6" flex={1}>
      <View testID="before" tabIndex={0} height={20} width={20} />

      <Tabs defaultValue="a" orientation="horizontal" flexDirection="column">
        <Tabs.List testID="tabs-list">
          <Tabs.Tab value="a" testID="tab-a">
            A
          </Tabs.Tab>
          <Tabs.Tab value="b" disabled testID="tab-b">
            B
          </Tabs.Tab>
          <Tabs.Tab value="c" testID="tab-c">
            C
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value="a" />
        <Tabs.Content value="b" />
        <Tabs.Content value="c" />
      </Tabs>

      <ToggleGroup type="single" orientation="horizontal" testID="toggle-group">
        <ToggleGroup.Item value="left" aria-label="Left" testID="toggle-left">
          <View width={10} height={10} />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="center" aria-label="Center" testID="toggle-center">
          <View width={10} height={10} />
        </ToggleGroup.Item>
      </ToggleGroup>

      <RadioGroup defaultValue="one" testID="radio-group">
        <RadioGroup.Item value="one" id="one" testID="radio-one">
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <RadioGroup.Item value="two" id="two" testID="radio-two">
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </RadioGroup>

      <View testID="after" tabIndex={0} height={20} width={20} />
    </YStack>
  )
}
