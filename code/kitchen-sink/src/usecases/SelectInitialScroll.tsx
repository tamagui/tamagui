import React from 'react'
import { Adapt, Select, Sheet, Text, YStack } from 'tamagui'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'

import { TEST_IDS } from '../constants/test-ids'

// Generate a list of items to ensure we have scrollable content
const items = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
  'Honeydew',
  'Kiwi',
  'Lemon',
  'Mango',
  'Nectarine',
  'Orange',
  'Papaya',
  'Quince',
  'Raspberry',
  'Strawberry',
  'Tangerine',
  'Watermelon',
]

/**
 * Test case for GitHub issue #3616: Select initial scroll position
 *
 * When a Select has a default value that's not the first item,
 * the dropdown viewport should scroll to show the selected item when opened.
 *
 * The bug causes the dropdown to always start at the top (index 0),
 * not scrolled to the selected item.
 */
export function SelectInitialScroll() {
  // Start with a value that's far down in the list
  const [value, setValue] = React.useState('Papaya')

  return (
    <YStack gap="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$6">
        Select Initial Scroll Test (Issue #3616)
      </Text>
      <Text>
        The dropdown should scroll to show the selected item (Papaya) when
        opened.
      </Text>
      <Text>Current value: {value}</Text>

      <Select value={value} onValueChange={setValue}>
        <Select.Trigger id={TEST_IDS.selectInitialScrollTrigger} width={250}>
          <Select.Value placeholder="Select a fruit..." />
        </Select.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet modal dismissOnSnapToBottom>
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton>
            <ChevronUp size={20} />
          </Select.ScrollUpButton>

          <Select.Viewport>
            <Select.Group>
              <Select.Label>Fruits</Select.Label>
              {items.map((item, index) => (
                <Select.Item
                  key={item}
                  id={
                    item === 'Papaya'
                      ? TEST_IDS.selectInitialScrollItem
                      : undefined
                  }
                  index={index}
                  value={item}
                >
                  <Select.ItemText>{item}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>

          <Select.ScrollDownButton>
            <ChevronDown size={20} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    </YStack>
  )
}
