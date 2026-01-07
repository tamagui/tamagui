import { useState } from 'react'
import { Adapt, Button, Select, Sheet, Text, YStack } from 'tamagui'
import { Check, ChevronDown } from '@tamagui/lucide-icons'

const items = [
  { name: 'Apple' },
  { name: 'Pear' },
  { name: 'Blackberry' },
  { name: 'Peach' },
  { name: 'Apricot' },
]

export function SelectStopPropagation() {
  const [selectedValue, setSelectedValue] = useState('')
  const [buttonClicked, setButtonClicked] = useState(false)

  return (
    <YStack gap="$4" padding="$4" position="relative">
      {/* Button behind the select viewport to test propagation */}
      <Button
        id="background-button"
        position="absolute"
        top={150}
        left={50}
        width={200}
        height={150}
        zIndex={0}
        onPress={() => setButtonClicked(true)}
      >
        Background Button
      </Button>

      <Select
        value={selectedValue}
        onValueChange={setSelectedValue}
      >
        <Select.Trigger id="select-trigger" width={200}>
          <Select.Value placeholder="Select a fruit" />
          <ChevronDown size="$1" />
        </Select.Trigger>

        <Adapt platform="touch">
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
          <Select.Viewport id="select-viewport">
            {items.map((item, i) => (
              <Select.Item
                id={`select-item-${item.name.toLowerCase()}`}
                key={item.name}
                index={i}
                value={item.name.toLowerCase()}
              >
                <Select.ItemText>{item.name}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select>

      <Text id="selected-value" marginTop={200}>
        Selected: {selectedValue || 'none'}
      </Text>
      <Text id="button-status">
        Background button clicked: {buttonClicked ? 'yes' : 'no'}
      </Text>
    </YStack>
  )
}
