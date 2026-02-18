import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import React from 'react'

import type { FontSizeTokens, SelectProps } from 'tamagui'
import { Adapt, Label, Select, Sheet, Theme, XStack, YStack, getFontSize } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

export function SelectDemo() {
  return (
    <Theme name="surface1">
      <YStack gap="$4">
        <XStack width="100%" items="center" gap="$4">
          <Label htmlFor="select-demo-1" flex={1} minW={80}>
            Custom
          </Label>
          <SelectDemoContents id="select-demo-1" />
        </XStack>

        <XStack width="100%" items="center" gap="$4">
          <Label htmlFor="select-demo-2" flex={1} minW={80}>
            Native
          </Label>
          <SelectDemoContents id="select-demo-2" native />
        </XStack>
      </YStack>
    </Theme>
  )
}

type SelectValue = Lowercase<(typeof items)[number]['name']>

// Helper to get item label from value - used by renderValue for SSR
const getItemLabel = (value: string) =>
  items.find((item) => item.name.toLowerCase() === value)?.name

export function SelectDemoContents(
  props: SelectProps<SelectValue> & { trigger?: React.ReactNode }
) {
  const [val, setVal] = React.useState<SelectValue>('apple')

  return (
    <Select
      value={val}
      onValueChange={setVal}
      disablePreventBodyScroll
      {...props}
      // renderValue enables SSR support by providing the label synchronously
      renderValue={getItemLabel}
    >
      {props?.trigger || (
        <Select.Trigger
          maxWidth={220}
          iconAfter={ChevronDown}
          borderRadius="$4"
          backgroundColor="$background"
        >
          <Select.Value placeholder="Something" />
        </Select.Trigger>
      )}

      <Adapt when="maxMd" platform="touch">
        <Sheet native={!!props.native} modal dismissOnSnapToBottom transition="medium">
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
        <Select.ScrollUpButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack z={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
            rounded="$4"
          />
        </Select.ScrollUpButton>
        <Select.Viewport
          minW={200}
          bg="$background"
          rounded="$4"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <Select.Group>
            <Select.Label fontWeight="700">Fruits</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {React.useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.name}
                      value={item.name.toLowerCase()}
                    >
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  )
                }),
              [items]
            )}
          </Select.Group>
          {/* Native gets an extra icon */}
          {props.native && (
            <YStack
              position="absolute"
              r={0}
              t={16}
              items="center"
              justify="center"
              width={'$4'}
              pointerEvents="none"
            >
              <ChevronDown
                size={getFontSize((props.size as FontSizeTokens) ?? '$true')}
              />
            </YStack>
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack z={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
            rounded="$4"
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
] as const
