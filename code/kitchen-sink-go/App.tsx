import { Check, ChevronDown } from '@tamagui/lucide-icons'
import React from 'react'
import { H1, Select, TamaguiProvider, Text, YStack } from 'tamagui'
import config from './tamagui.config'

const items = [
  { name: 'Apple' },
  { name: 'Pear' },
  { name: 'Blackberry' },
  { name: 'Peach' },
  { name: 'Apricot' },
]

function SelectTest() {
  const [val, setVal] = React.useState('apple')
  return (
    <YStack gap="$2" items="center">
      <Text>Select Test:</Text>
      <Select value={val} onValueChange={setVal} disablePreventBodyScroll>
        <Select.Trigger maxWidth={220} iconAfter={ChevronDown}>
          <Select.Value placeholder="Pick a fruit" />
        </Select.Trigger>

        <Select.Content>
          <Select.Viewport>
            <Select.Group>
              <Select.Label>Fruits</Select.Label>
              {items.map((item, i) => (
                <Select.Item index={i} key={item.name} value={item.name.toLowerCase()}>
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
    </YStack>
  )
}

export function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <YStack flex={1} items="center" justify="center" bg="$background" gap="$4" p="$4">
        <H1>Select Test</H1>
        <SelectTest />
      </YStack>
    </TamaguiProvider>
  )
}
