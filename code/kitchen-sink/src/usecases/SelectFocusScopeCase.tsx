import React from 'react'
import { Select, Label, YStack, XStack, Button } from 'tamagui'
import { ChevronDown } from '@tamagui/lucide-icons'

export function SelectFocusScopeCase() {
  const [value1, setValue1] = React.useState('')
  const [value2, setValue2] = React.useState('')
  const [value3, setValue3] = React.useState('')
  
  return (
    <YStack padding="$4" gap="$4">
      {/* Basic Select with Focus Trap */}
      <YStack gap="$2">
        <Label htmlFor="basic-select">Basic Select (Focus Trapped)</Label>
        <Select id="basic-select" value={value1} onValueChange={setValue1}>
          <Select.Trigger data-testid="basic-select-trigger" iconAfter={ChevronDown}>
            <Select.Value placeholder="Select an option" />
          </Select.Trigger>
          
          <Select.Content data-testid="basic-select-content">
            <Select.ScrollUpButton />
            <Select.Viewport data-testid="basic-select-viewport">
              <Select.Group>
                <Select.Label>Fruits</Select.Label>
                <Select.Item data-testid="select-apple" value="apple" index={0}>
                  <Select.ItemText>Apple</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
                <Select.Item data-testid="select-banana" value="banana" index={1}>
                  <Select.ItemText>Banana</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
                <Select.Item data-testid="select-orange" value="orange" index={2}>
                  <Select.ItemText>Orange</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              </Select.Group>
              
              <Select.Group>
                <Select.Label>Vegetables</Select.Label>
                <Select.Item data-testid="select-carrot" value="carrot" index={3}>
                  <Select.ItemText>Carrot</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
                <Select.Item data-testid="select-broccoli" value="broccoli" index={4}>
                  <Select.ItemText>Broccoli</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton />
          </Select.Content>
        </Select>
      </YStack>

      {/* Select with Custom Content */}
      <YStack gap="$2">
        <Label htmlFor="custom-select">Select with Custom Content</Label>
        <Select id="custom-select" value={value2} onValueChange={setValue2}>
          <Select.Trigger data-testid="custom-select-trigger" iconAfter={ChevronDown}>
            <Select.Value placeholder="Choose a color" />
          </Select.Trigger>
          
          <Select.Content data-testid="custom-select-content">
            <Select.Viewport data-testid="custom-select-viewport">
              <YStack padding="$2" gap="$2">
                <Select.Item data-testid="select-red" value="red" index={0}>
                  <XStack gap="$2" alignItems="center">
                    <View width={20} height={20} backgroundColor="red" borderRadius="$2" />
                    <Select.ItemText>Red</Select.ItemText>
                  </XStack>
                  <Select.ItemIndicator />
                </Select.Item>
                <Select.Item data-testid="select-green" value="green" index={1}>
                  <XStack gap="$2" alignItems="center">
                    <View width={20} height={20} backgroundColor="green" borderRadius="$2" />
                    <Select.ItemText>Green</Select.ItemText>
                  </XStack>
                  <Select.ItemIndicator />
                </Select.Item>
                <Select.Item data-testid="select-blue" value="blue" index={2}>
                  <XStack gap="$2" alignItems="center">
                    <View width={20} height={20} backgroundColor="blue" borderRadius="$2" />
                    <Select.ItemText>Blue</Select.ItemText>
                  </XStack>
                  <Select.ItemIndicator />
                </Select.Item>
              </YStack>
            </Select.Viewport>
          </Select.Content>
        </Select>
      </YStack>

      {/* Multiple Selects for Tab Order Testing */}
      <YStack gap="$2">
        <Label>Multiple Selects</Label>
        <XStack gap="$3" flexWrap="wrap">
          <Select value={value3} onValueChange={setValue3} size="$3">
            <Select.Trigger data-testid="small-select-trigger" iconAfter={ChevronDown}>
              <Select.Value placeholder="Size" />
            </Select.Trigger>
            
            <Select.Content data-testid="small-select-content">
              <Select.Viewport>
                <Select.Item data-testid="select-small" value="small" index={0}>
                  <Select.ItemText>Small</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
                <Select.Item data-testid="select-medium" value="medium" index={1}>
                  <Select.ItemText>Medium</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
                <Select.Item data-testid="select-large" value="large" index={2}>
                  <Select.ItemText>Large</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select>
          
          <Button data-testid="external-button">External Button</Button>
        </XStack>
      </YStack>
    </YStack>
  )
}

// Add missing import
import { View } from 'tamagui'