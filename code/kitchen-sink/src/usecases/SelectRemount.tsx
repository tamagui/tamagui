/**
 * Test case for issue #1859: Select not working after remount
 * https://github.com/tamagui/tamagui/issues/1859
 */

import { Check, ChevronDown } from '@tamagui/lucide-icons'
import React from 'react'
import { Adapt, Button, Select, Sheet, Text, XStack, YStack } from 'tamagui'

const items = [
  { name: 'Apple' },
  { name: 'Pear' },
  { name: 'Blackberry' },
  { name: 'Peach' },
  { name: 'Apricot' },
]

function SelectComponent({ id }: { id: string }) {
  const [val, setVal] = React.useState('apple')

  return (
    <Select value={val} onValueChange={setVal} disablePreventBodyScroll>
      <Select.Trigger
        testID={`${id}-trigger`}
        aria-label={`${id}-trigger`}
        maxWidth={220}
        iconAfter={ChevronDown}
      >
        <Select.Value placeholder="Select a fruit" />
      </Select.Trigger>

      <Adapt when="maxMd" platform="touch">
        <Sheet modal dismissOnSnapToBottom animation="medium">
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            bg="$shadowColor"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.Viewport miw={200}>
          <Select.Group>
            <Select.Label>Fruits</Select.Label>
            {items.map((item, i) => (
              <Select.Item
                index={i}
                key={item.name}
                value={item.name.toLowerCase()}
                testID={`${id}-option-${item.name.toLowerCase()}`}
                accessibilityLabel={`${id}-option-${item.name.toLowerCase()}`}
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
  )
}

export function SelectRemount() {
  const [mounted, setMounted] = React.useState(true)
  const [key, setKey] = React.useState(0)

  return (
    <YStack padding="$4" gap="$4" flex={1}>
      <XStack gap="$2">
        <Button
          testID="toggle-mount-button"
          aria-label="toggle-mount-button"
          onPress={() => setMounted((m) => !m)}
          theme={mounted ? 'green' : 'red'}
        >
          {mounted ? 'Unmount' : 'Mount'}
        </Button>

        <Button
          testID="remount-button"
          aria-label="remount-button"
          onPress={() => {
            setMounted(false)
            setTimeout(() => {
              setKey((k) => k + 1)
              setMounted(true)
            }, 100)
          }}
        >
          Remount
        </Button>
      </XStack>

      {mounted && (
        <YStack key={key} gap="$4">
          <SelectComponent id="select-remount-test" />

          {/* Second select to test multiple on same screen */}
          <SelectComponent id="select-remount-test-2" />
        </YStack>
      )}

      <YStack padding="$2" bg="$backgroundHover" borderRadius="$2">
        <XStack gap="$2" width="100%">
          <YStack
            width={10}
            height={10}
            borderRadius={5}
            bg={mounted ? '$green10' : '$red10'}
          />
          <Text>{mounted ? `Mounted (key: ${key})` : 'Unmounted'}</Text>
        </XStack>
      </YStack>
    </YStack>
  )
}
