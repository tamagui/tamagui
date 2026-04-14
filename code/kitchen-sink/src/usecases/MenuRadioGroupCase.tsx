import { Check } from '@tamagui/lucide-icons-2'
import { Menu } from '@tamagui/menu'
import React from 'react'
import { Button, H1, Paragraph, Text, YStack } from 'tamagui'

export function MenuRadioGroupCase() {
  const [color, setColor] = React.useState('blue')
  const [changeCount, setChangeCount] = React.useState(0)

  const options = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ] as const

  const handleValueChange = React.useCallback((nextValue: string) => {
    setColor(nextValue)
    setChangeCount((current) => current + 1)
  }, [])

  return (
    <YStack gap="$4" padding="$4" maxWidth={800} margin="auto">
      <YStack gap="$2" testID="menu-radio-group-case">
        <H1 testID="menu-radio-title">Menu RadioGroup</H1>
        <Paragraph>
          Verifies that Menu.RadioGroup/RadioItem enforces single-selection on both web
          and native (via zeego CheckboxItem mapping).
        </Paragraph>
        <Text testID="menu-radio-selected-value" color="$color10">
          Selected value: {color}
        </Text>
        <Text testID="menu-radio-change-count" color="$color10">
          Change count: {changeCount}
        </Text>
      </YStack>

      <YStack alignItems="flex-start" gap="$4">
        <Menu allowFlip placement="bottom-start" offset={8}>
          <Menu.Trigger asChild>
            <Button testID="menu-radio-trigger" size="$4">
              Pick a color
            </Button>
          </Menu.Trigger>

          <Menu.Portal zIndex={100}>
            <Menu.Content
              testID="menu-radio-content"
              p="$2"
              minW={220}
              borderWidth={1}
              borderColor="$borderColor"
              bg="$background"
              elevation="$3"
            >
              <Menu.RadioGroup value={color} onValueChange={handleValueChange}>
                {options.map((option) => (
                  <Menu.RadioItem
                    key={option.value}
                    testID={`menu-radio-item-${option.value}`}
                    value={option.value}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 4,
                    }}
                    focusStyle={{ bg: '$backgroundHover' }}
                  >
                    <Menu.ItemIndicator>
                      <Check size={14} />
                    </Menu.ItemIndicator>
                    <Menu.ItemTitle>{option.label}</Menu.ItemTitle>
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Content>
          </Menu.Portal>
        </Menu>
      </YStack>
    </YStack>
  )
}
