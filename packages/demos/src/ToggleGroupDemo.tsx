import { AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons'
import { Label, SizeTokens, ToggleGroup, XStack, YStack } from 'tamagui'

export function ToggleGroupDemo() {
  return (
    <XStack ai="center" space="$10">
      <YStack ai="center" space="$6">
        <ToggleGroupComponent type="single" size="$3" orientation="horizontal" />
        <ToggleGroupComponent type="multiple" size="$4" orientation="horizontal" />
      </YStack>
      <XStack ai="center" space="$6">
        <ToggleGroupComponent type="single" size="$3" orientation="vertical" />
        <ToggleGroupComponent type="multiple" size="$4" orientation="vertical" />
      </XStack>
    </XStack>
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
      ai="center"
      jc="center"
      space="$4"
    >
      <Label pr="$0"  jc="flex-end" size={props.size} htmlFor={id}>
        {props.type === 'single' ? 'Single' : 'Multiple'}
      </Label>
      {/* <Separator vertical={props.orientation === 'horizontal'} /> */}

      <ToggleGroup
        orientation={props.orientation}
        id={id}
        type={props.type}
        size={props.size}
        disableDeactivation={props.type === "single" ? true : undefined}
      >
        <ToggleGroup.Item value="left" aria-label="Left aligned">
          <AlignLeft />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="center" aria-label="Center aligned">
          <AlignCenter />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="right" aria-label="Right aligned">
          <AlignRight />
        </ToggleGroup.Item>
      </ToggleGroup>
    </XStack>
  )
}
