import { AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons'
import { Label, Separator, SizeTokens, ToggleGroup, XStack, YStack } from 'tamagui'

export function ToggleGroupDemo() {
  return (
    <YStack w={500} ai="center" space="$3">
      <XStack w={400} ai="center" space="$4">
        <ToggleGroupComponent type="single" size="$4" orientation="horizontal" />
        <ToggleGroupComponent type="single" size="$2" orientation="horizontal" />
      </XStack>
      <XStack w={400} ai="center" space="$4">
        <ToggleGroupComponent type="multiple" size="$4" orientation="horizontal" />
        <ToggleGroupComponent type="multiple" size="$2" orientation="horizontal" />
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
    <XStack ai="center" space="$4">
      <Label pr="$0" miw={90} jc="flex-end" size={props.size} htmlFor={id}>
        {props.type === 'single' ? 'Single' : 'Multiple'}
      </Label>
      <Separator mih={20} vertical />

      <ToggleGroup
        orientation={props.orientation}
        id={id}
        type={props.type}
        size={props.size}
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
