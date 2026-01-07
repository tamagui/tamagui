import { AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons'
import type { SizeTokens } from 'tamagui'
import { Label, styled, ToggleGroup, XStack, YStack } from 'tamagui'

const GreenItem = styled(ToggleGroup.Item, {
  color: '$green8',
  toggledStyle: { backgroundColor: '$green9', color: '$yellow9' },
})

const BlueItem = styled(ToggleGroup.Item, {
  color: '$blue8',
  toggledStyle: { backgroundColor: '$blue9', color: '$green9' },
})

const RedItem = styled(ToggleGroup.Item, {
  color: '$red8',
  toggledStyle: { backgroundColor: '$red9', color: '$blue9' },
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
        type={props.type as any}
        size={props.size}
        disableDeactivation={props.type === 'single' ? true : undefined}
      >
        <GreenItem
          value="left"
          aria-label="Left aligned"
          focusStyle={{ background: '$color12' }}
        >
          <AlignLeft />
        </GreenItem>
        <BlueItem
          value="center"
          aria-label="Center aligned"
          focusStyle={{ background: '$color12' }}
        >
          <AlignCenter />
        </BlueItem>
        <RedItem
          value="right"
          aria-label="Right aligned"
          focusStyle={{ background: '$color12' }}
        >
          <AlignRight />
        </RedItem>
      </ToggleGroup>
    </XStack>
  )
}
