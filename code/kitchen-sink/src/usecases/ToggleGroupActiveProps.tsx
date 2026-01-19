import React from 'react'
import { SizableText, ToggleGroup, YStack, useToggleGroupItem } from 'tamagui'

// Issue #3485: ToggleGroup active prop passed to children
// Children of ToggleGroup.Item can access active state via useToggleGroupItem hook

const CustomItem = ({ children }: { children: React.ReactNode }) => {
  const { active } = useToggleGroupItem()
  return (
    <SizableText id={`custom-item-${children}`} data-active={active ? 'true' : 'false'}>
      {children}
    </SizableText>
  )
}

export function ToggleGroupActiveProps() {
  const [value, setValue] = React.useState('option1')

  return (
    <YStack p="$4" gap="$4">
      <ToggleGroup
        id="toggle-group"
        type="single"
        value={value}
        onValueChange={(val) => val && setValue(val)}
        disableDeactivation
      >
        <ToggleGroup.Item value="option1" id="item-1">
          <CustomItem>option1</CustomItem>
        </ToggleGroup.Item>
        <ToggleGroup.Item value="option2" id="item-2">
          <CustomItem>option2</CustomItem>
        </ToggleGroup.Item>
        <ToggleGroup.Item value="option3" id="item-3">
          <CustomItem>option3</CustomItem>
        </ToggleGroup.Item>
      </ToggleGroup>
    </YStack>
  )
}
