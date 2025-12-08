import { AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons'
import type { SizeTokens } from 'tamagui'
import { Label, styled, ToggleGroup, XStack, YStack } from 'tamagui'

const PurpleItem = styled(ToggleGroup.Item, {
  color: '$red10', 
  activeBackgroundColor: '$purple9',
  activeColor: '$yellow10',  
})

const GreenItem = styled(ToggleGroup.Item, {
  color: '$blue10', 
  activeBackgroundColor: '$green9',
  activeColor: '$orange10', 
})

const RedItem = styled(ToggleGroup.Item, {
  color: '$purple10',  
  activeBackgroundColor: '$red9',
  activeColor: '$pink10',  
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
        disableDeactivation={false}
      >
        <PurpleItem value="left" aria-label="Left aligned" style={{ color: '$yellow10' }}>
          <AlignLeft />
        </PurpleItem>
        <GreenItem value="center"  aria-label="Center aligned">
          <AlignCenter />
        </GreenItem>
        <RedItem value="right" aria-label="Right aligned">
          <AlignRight />
        </RedItem>
      </ToggleGroup>
    </XStack>
  )
}

