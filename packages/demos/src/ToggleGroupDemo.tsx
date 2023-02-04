import { AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons'
import {ToggleGroup } from 'tamagui'

export function ToggleGroupDemo() {
  return (
    <ToggleGroup
      type="single"
      defaultValue="center"
      aria-label="Text alignment"
    >
      <ToggleGroup.Item
        value="left"
        aria-label="Left aligned"
      >
        <AlignLeft/>
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="center"
        aria-label="Center aligned"
      >
        <AlignCenter />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="right"
        aria-label="Right aligned"
      >
        <AlignRight />
      </ToggleGroup.Item>
    </ToggleGroup>
  )
}
