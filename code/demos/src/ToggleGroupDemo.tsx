import { AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons'
import type { SizeTokens } from 'tamagui'
import { Label, styled, ToggleGroup, XStack, YStack } from 'tamagui'

export function ToggleGroupDemo() {
  return (
    <YStack px="$4">
      <XStack items="center" gap="$10">
        <YStack items="center" gap="$6">
          <ToggleGroupComponent type="single" size="$4" orientation="horizontal" />
          <ToggleGroupComponent type="multiple" size="$10" orientation="horizontal" />
        </YStack>
        <XStack items="center" gap="$6">
          <ToggleGroupComponent type="single" size="$4" orientation="vertical" />
          <ToggleGroupComponent type="multiple" size="$5" orientation="vertical" />
        </XStack>
      </XStack>
    </YStack>
  )
}

function ToggleGroupComponent(props: {
  size: SizeTokens
  type: 'single' | 'multiple'
  orientation: 'vertical' | 'horizontal'
}) {
  const id = `switch-${props.size.toString().slice(1)}-${props.type}`
  return (
    <XStack
      flexDirection={props.orientation === 'horizontal' ? 'row' : 'column'}
      items="center"
      justify="center"
      gap="$4"
    >
      <Label pr="$0" justify="flex-end" size="$4" htmlFor={id}>
        {props.type === 'single' ? 'Single' : 'Multiple'}
      </Label>

      <ToggleGroup
        orientation={props.orientation}
        id={id}
        type={props.type as any} // since this demo switches between loosen types
        size={props.size}
        disableDeactivation={props.type === 'single' ? true : undefined}
      >
        {/* Using styled() component */}
        <StyledItem value="left" aria-label="Left aligned">
          <AlignLeft />
        </StyledItem>

        <ToggleGroup.Item
          value="center"
          aria-label="Center aligned"
          hoverStyle={{ backgroundColor: '$color5' }}
          size="$4"
        >
          <AlignCenter />
        </ToggleGroup.Item>

        {/* Using inline activeStyle prop */}
        <ToggleGroup.Item
          value="right"
          aria-label="Right aligned"
          hoverStyle={{ backgroundColor: 'red' }}
          activeStyle={{ backgroundColor: 'green' }}
        >
          <AlignRight />
        </ToggleGroup.Item>
      </ToggleGroup>
    </XStack>
  )
}

// Example using styled() to define activeStyle and hoverStyle

const StyledItem = styled(ToggleGroup.Item, {
  hoverStyle: {
    backgroundColor: '$color5',
  },
  activeStyle: {
    backgroundColor: '$color6',
  },
})
