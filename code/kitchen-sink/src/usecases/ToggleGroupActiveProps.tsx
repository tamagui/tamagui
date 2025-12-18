import React from 'react'
import { SizableText, ToggleGroup, YStack } from 'tamagui'

// Issue #3485: ToggleGroup active prop passed to children
// Children of ToggleGroup.Item should receive `active` prop based on selection state

const CustomItem = ({
  active,
  children,
}: { active?: boolean; children: React.ReactNode }) => {
  return (
    <SizableText id={`custom-item-${children}`} data-active={active}>
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
