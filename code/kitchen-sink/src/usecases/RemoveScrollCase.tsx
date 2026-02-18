import React from 'react'
import { Select, H2, Paragraph, YStack } from 'tamagui'
import { ChevronDown } from '@tamagui/lucide-icons'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
]

export function RemoveScrollCase() {
  const [value, setValue] = React.useState('')

  return (
    <YStack $platform-web={{ minHeight: '200vh' }} padding="$4" gap="$4">
      <H2>RemoveScroll Test</H2>

      <Paragraph data-testid="scroll-marker">
        Scroll down to find the select. This page is tall enough to scroll.
      </Paragraph>

      {Array.from({ length: 10 }).map((_, i) => (
        <Paragraph key={i}>
          Filler paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Paragraph>
      ))}

      <Select
        value={value}
        onValueChange={setValue}
        renderValue={(v) => items.find((item) => item.value === v)?.label}
      >
        <Select.Trigger data-testid="rs-select-trigger" iconAfter={ChevronDown}>
          <Select.Value placeholder="Pick a fruit" />
        </Select.Trigger>

        <Select.Content data-testid="rs-select-content">
          <Select.Viewport data-testid="rs-select-viewport">
            <Select.Group>
              {items.map((item, i) => (
                <Select.Item
                  key={item.value}
                  data-testid={`rs-select-${item.value}`}
                  value={item.value}
                  index={i}
                >
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select>

      {Array.from({ length: 20 }).map((_, i) => (
        <Paragraph key={`after-${i}`}>
          After-select paragraph {i + 1}. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Paragraph>
      ))}
    </YStack>
  )
}
