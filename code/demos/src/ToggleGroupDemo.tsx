import { AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons'
import type { SizeTokens } from 'tamagui'
import { Label, styled, ToggleGroup, XStack, YStack } from 'tamagui'

// Example using styled() to define toggledStyle and hoverStyle
const StyledItem = styled(ToggleGroup.Item, {
  hoverStyle: {
    backgroundColor: '$backgroundFocus',
  },
  toggledStyle: {
    backgroundColor: '$backgroundFocus',
  },
})

export function ToggleGroupDemo() {
  return (
    <YStack px="$4">
      <XStack items="center" gap="$10">
        <YStack items="center" gap="$6">
          <ToggleGroupComponent type="single" size="$3" orientation="horizontal" />
          <ToggleGroupComponent type="multiple" size="$4" orientation="horizontal" />
        </YStack>
        <XStack items="center" gap="$6">
          <ToggleGroupComponent type="single" size="$3" orientation="vertical" />
          <ToggleGroupComponent type="multiple" size="$4" orientation="vertical" />
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
      <Label pr="$0" justify="flex-end" size={props.size} htmlFor={id}>
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

        {/* Using inline toggledStyle prop */}
        <ToggleGroup.Item
          value="center"
          aria-label="Center aligned"
          hoverStyle={{ backgroundColor: '$backgroundFocus' }}
          toggledStyle={{ backgroundColor: '$backgroundFocus' }}
        >
          <AlignCenter />
        </ToggleGroup.Item>

        {/* Using inline toggledStyle prop */}
        <ToggleGroup.Item
          value="right"
          aria-label="Right aligned"
          hoverStyle={{ backgroundColor: '$backgroundFocus' }}
          toggledStyle={{ backgroundColor: '$backgroundFocus' }}
        >
          <AlignRight />
        </ToggleGroup.Item>
      </ToggleGroup>
    </XStack>
  )
}
