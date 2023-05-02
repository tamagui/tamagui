import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useState } from 'react'
import {
  Adapt,
  Label,
  Select,
  SelectProps,
  Sheet,
  XStack,
  YStack,
  getFontSize,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

export function SelectDemo() {
  return (
    <YStack space>
      <XStack ai="center" space>
        <Label f={1} fb={0}>
          Custom
        </Label>
        <SelectDemoItem />
      </XStack>

      <XStack ai="center" space>
        <Label f={1} fb={0}>
          Native
        </Label>
        <SelectDemoItem native />
      </XStack>
    </YStack>
  )
}

export function SelectDemoItem(props: SelectProps) {
  const [val, setVal] = useState('apple')

  return (
    <Select id="food" value={val} onValueChange={setVal} {...props}>
      <Select.Trigger width={180} iconAfter={ChevronDown}>
        <Select.Value placeholder="Something" />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet native modal dismissOnSnapToBottom>
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', '$backgroundTransparent']}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport minWidth={200}>
          <XStack>
            <Select.Group space="$0">
              <Select.Label>Fruits</Select.Label>
              {items.map((item, i) => {
                return (
                  <Select.Item index={i} key={item.name} value={item.name.toLowerCase()}>
                    <Select.ItemText>{item.name}</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                )
              })}
            </Select.Group>
            {/* special icon treatment for native */}
            {props.native && (
              <YStack
                position="absolute"
                right={0}
                top={0}
                bottom={0}
                alignItems="center"
                justifyContent="center"
                width={'$4'}
                pointerEvents="none"
              >
                <ChevronDown size={getFontSize((props.size ?? '$true') as any)} />
              </YStack>
            )}
          </XStack>
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$backgroundTransparent', '$background']}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}

const items = [
  { name: 'Apple' },
  { name: 'Pear' },
  { name: 'Blackberry' },
  { name: 'Peach' },
  { name: 'Apricot' },
  { name: 'Melon' },
  { name: 'Honeydew' },
  { name: 'Starfruit' },
  { name: 'Blueberry' },
  { name: 'Raspberry' },
  { name: 'Strawberry' },
  { name: 'Mango' },
  { name: 'Pineapple' },
  { name: 'Lime' },
  { name: 'Lemon' },
  { name: 'Coconut' },
  { name: 'Guava' },
  { name: 'Papaya' },
  { name: 'Orange' },
  { name: 'Grape' },
  { name: 'Jackfruit' },
  { name: 'Durian' },
]
