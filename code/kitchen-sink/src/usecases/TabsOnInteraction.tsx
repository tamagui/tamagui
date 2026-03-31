/**
 * Test case: Tabs onInteraction fires with layout on native
 * Verifies that createTabs TabsTrigger reports layout measurements
 * via onInteraction when a tab is selected.
 */

import React from 'react'
import type { TabLayout } from 'tamagui'
import { SizableText, Tabs, Text, YStack } from 'tamagui'

export function TabsOnInteraction() {
  const [interactionType, setInteractionType] = React.useState<string | null>(null)
  const [layout, setLayout] = React.useState<TabLayout | null>(null)

  return (
    <YStack padding="$4" gap="$4" flex={1}>
      <Tabs
        defaultValue="tab1"
        orientation="horizontal"
        flexDirection="column"
        width={350}
        testID="tabs-root"
      >
        <Tabs.List>
          <Tabs.Tab
            flex={1}
            value="tab1"
            testID="tabs-tab1"
            onInteraction={(type, tabLayout) => {
              setInteractionType(type)
              setLayout(tabLayout)
            }}
          >
            <SizableText>Tab 1</SizableText>
          </Tabs.Tab>
          <Tabs.Tab
            flex={1}
            value="tab2"
            testID="tabs-tab2"
            onInteraction={(type, tabLayout) => {
              setInteractionType(type)
              setLayout(tabLayout)
            }}
          >
            <SizableText>Tab 2</SizableText>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Content value="tab1" padding="$4">
          <Text testID="tabs-content-tab1">Content 1</Text>
        </Tabs.Content>
        <Tabs.Content value="tab2" padding="$4">
          <Text testID="tabs-content-tab2">Content 2</Text>
        </Tabs.Content>
      </Tabs>

      <YStack gap="$2" testID="tabs-layout-info">
        <Text testID="tabs-interaction-type">
          interaction: {interactionType ?? 'none'}
        </Text>
        <Text testID="tabs-layout-width">width: {layout?.width ?? 'null'}</Text>
        <Text testID="tabs-layout-height">height: {layout?.height ?? 'null'}</Text>
        <Text testID="tabs-layout-has-value">hasLayout: {layout ? 'true' : 'false'}</Text>
      </YStack>
    </YStack>
  )
}
