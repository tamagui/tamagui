import { TamaguiProvider, Theme, Text, Button, H1, YStack, XStack, Select, Adapt, Sheet } from 'tamagui'
import { Check, ChevronDown } from '@tamagui/lucide-icons'
import config from './tamagui.config'
import React from 'react'

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
    <YStack gap="$2" ai="center">
      <Text>Select Test:</Text>
      <Select value={val} onValueChange={setVal} disablePreventBodyScroll>
        <Select.Trigger maxWidth={220} iconAfter={ChevronDown}>
          <Select.Value placeholder="Pick a fruit" />
        </Select.Trigger>

        <Adapt when="maxMd" platform="touch">
          <Sheet modal dismissOnSnapToBottom>
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay />
          </Sheet>
        </Adapt>

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
      <YStack f={1} ai="center" jc="center" bg="$background" gap="$4" p="$4">
        <H1>Select Test</H1>
        <SelectTest />
      </YStack>
    </TamaguiProvider>
  )
}
