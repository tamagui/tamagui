import { AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons'
import { Label, Separator, SizeTokens, ToggleGroup, XStack, YStack } from 'tamagui'

export function ToggleGroupDemo() {
  return (
    <YStack w={200} ai="center" space="$3">
      <ToggleGroupComponent type="single" size="$8" />
      <ToggleGroupComponent type="multiple" size="$8" />
    </YStack>
  )
}

function ToggleGroupComponent(props: { size: SizeTokens; type: 'single' | 'multiple' }) {
  const id = `switch-${props.size.toString().slice(1)}`
  return (
    <XStack w={200} ai="center" space="$4">
      <Label pr="$0" miw={90} jc="flex-end" size={props.size} htmlFor={id}>
        {props.type === 'single'?'Single':'Multiple'}
      </Label>
      <Separator mih={20} vertical />
      <ToggleGroup id={id} type={props.type}>
        <ToggleGroup.Item size={props.size} value="left" aria-label="Left aligned">
          <AlignLeft />
        </ToggleGroup.Item>
        <ToggleGroup.Item size={props.size} value="center" aria-label="Center aligned">
          <AlignCenter />
        </ToggleGroup.Item>
        <ToggleGroup.Item size={props.size} value="right" aria-label="Right aligned">
          <AlignRight />
        </ToggleGroup.Item>
      </ToggleGroup>
    </XStack>
  )
}
