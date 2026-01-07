import React from 'react'
import { Select, Text, YStack } from 'tamagui'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'

import { TEST_IDS } from '../constants/test-ids'

/**
 * Test case for GitHub issue #3628: Select doesn't close when selecting same item
 *
 * On touch devices (smartphones/tablets or Chrome device emulator), selecting
 * the same item that is already selected should close the dropdown.
 *
 * The bug causes the dropdown to remain open when tapping the same item
 * that's already selected.
 */
export function SelectSameItem() {
  const [value, setValue] = React.useState('apple')

  return (
    <YStack gap="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$6">
        Select Same Item Test (Issue #3628)
      </Text>
      <Text>
        On touch devices, selecting the same item should close the dropdown.
      </Text>
      <Text>Current value: {value}</Text>

      {/* Note: We intentionally don't use Adapt here so we can test
          the inline Select behavior with touch events */}
      <Select value={value} onValueChange={setValue}>
        <Select.Trigger id={TEST_IDS.selectSameItemTrigger} width={250}>
          <Select.Value placeholder="Select a fruit..." />
        </Select.Trigger>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton>
            <ChevronUp size={20} />
          </Select.ScrollUpButton>

          <Select.Viewport>
            <Select.Group>
              <Select.Label>Fruits</Select.Label>
              <Select.Item
                id={TEST_IDS.selectSameItemApple}
                index={0}
                value="apple"
              >
                <Select.ItemText>Apple</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item
                id={TEST_IDS.selectSameItemBanana}
                index={1}
                value="banana"
              >
                <Select.ItemText>Banana</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item
                id={TEST_IDS.selectSameItemPeach}
                index={2}
                value="peach"
              >
                <Select.ItemText>Peach</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
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
