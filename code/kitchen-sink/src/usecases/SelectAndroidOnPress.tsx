/**
 * Test case for issue #3436: Select onValueChange not firing on Android physical devices
 * https://github.com/tamagui/tamagui/issues/3436
 *
 * The bug: onPressIn and onPressOut fire, but onPress never does on physical Android devices.
 * This causes Select items to not trigger onValueChange.
 */

import { Check, ChevronDown } from '@tamagui/lucide-icons'
import React from 'react'
import { Adapt, Select, Sheet, Text, YStack } from 'tamagui'

const items = [
  { name: 'Apple' },
  { name: 'Pear' },
  { name: 'Blackberry' },
  { name: 'Peach' },
]

const getItemLabel = (value: string) =>
  items.find((item) => item.name.toLowerCase() === value)?.name

export function SelectAndroidOnPress() {
  const [val, setVal] = React.useState('')
  const [changeCount, setChangeCount] = React.useState(0)
  const [lastAction, setLastAction] = React.useState('none')

  const handleValueChange = (newVal: string) => {
    console.info('[SelectAndroidOnPress] onValueChange fired:', newVal)
    setVal(newVal)
    setChangeCount((c) => c + 1)
    setLastAction(`selected: ${newVal}`)
  }

  return (
    <YStack padding="$4" gap="$4" flex={1}>
      <Text testID="select-android-title" fontSize="$5" fontWeight="bold">
        Select Android onPress Test (#3436)
      </Text>

      <Text testID="select-android-instructions" fontSize="$3" color="$gray11">
        Tap the select, then tap an item. On physical Android devices, the selection may
        not work due to onPress not firing.
      </Text>

      <Select
        value={val}
        onValueChange={handleValueChange}
        disablePreventBodyScroll
        renderValue={getItemLabel}
      >
        <Select.Trigger
          testID="select-android-trigger"
          maxWidth={280}
          iconAfter={ChevronDown}
        >
          <Select.Value placeholder="Select a fruit..." />
        </Select.Trigger>

        <Adapt when="maxMd" platform="touch">
          <Sheet modal dismissOnSnapToBottom transition="medium">
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              bg="$shadowColor"
              transition="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.Viewport minWidth={200}>
            <Select.Group>
              <Select.Label>Fruits</Select.Label>
              {items.map((item, i) => (
                <Select.Item
                  index={i}
                  key={item.name}
                  value={item.name.toLowerCase()}
                  testID={`select-android-item-${item.name.toLowerCase()}`}
                >
                  <Select.ItemText>{item.name}</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select>

      {/* status display for test verification */}
      <YStack gap="$2" padding="$3" bg="$backgroundHover" borderRadius="$2">
        <Text testID="select-android-selected-value">
          Selected value: {val || '(none)'}
        </Text>
        <Text testID="select-android-change-count">Change count: {changeCount}</Text>
        <Text testID="select-android-last-action">Last action: {lastAction}</Text>
      </YStack>

      <YStack gap="$1" padding="$2" bg="$yellow3" borderRadius="$2">
        <Text fontSize="$2" fontWeight="bold">
          Expected behavior:
        </Text>
        <Text fontSize="$2">
          • Tap trigger → sheet opens{'\n'}• Tap item → sheet closes, value updates{'\n'}•
          Change count should increment
        </Text>
      </YStack>

      <YStack gap="$1" padding="$2" bg="$red3" borderRadius="$2">
        <Text fontSize="$2" fontWeight="bold">
          Bug behavior (physical Android):
        </Text>
        <Text fontSize="$2">
          • Tap trigger → sheet opens{'\n'}• Tap item → nothing happens{'\n'}•
          onValueChange never fires
        </Text>
      </YStack>
    </YStack>
  )
}
