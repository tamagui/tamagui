import { AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons'
import type { SizeTokens } from 'tamagui'
import { Label, styled, ToggleGroup, XStack, YStack } from 'tamagui'

// Each item has a different color and toggledStyle
const RedItem = styled(ToggleGroup.Item, {
  color: '$red10',
  toggledStyle: {
    backgroundColor: '$red9',
    borderColor: '$red11',
  },
})

const GreenItem = styled(ToggleGroup.Item, {
  color: '$green10',
  toggledStyle: {
    backgroundColor: '$green9',
    borderColor: '$green11',
  },
})

const BlueItem = styled(ToggleGroup.Item, {
  color: '$blue10',
  toggledStyle: {
    backgroundColor: '$blue9',
    borderColor: '$blue11',
  },
})

export function ToggleGroupDemo() {
  return (
    <YStack px="$4" py="$4" gap="$8" items="center" justify="center">
      <ToggleGroupComponent type="single" size="$3" orientation="horizontal" />
      <ToggleGroupComponent type="multiple" size="$4" orientation="horizontal" />
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
        type={props.type as any}
        size={props.size}
        disableDeactivation={props.type === 'single' ? true : undefined}
      >
        <RedItem value="left" aria-label="Left aligned">
          <AlignLeft />
        </RedItem>
        <GreenItem value="center" aria-label="Center aligned">
          <AlignCenter />
        </GreenItem>
        <BlueItem value="right" aria-label="Right aligned">
          <AlignRight />
        </BlueItem>
      </ToggleGroup>
    </XStack>
  )
}
