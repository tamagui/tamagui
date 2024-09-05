import { AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons'
import type { SizeTokens } from 'tamagui'
import { Label, ToggleGroup, XStack, YStack } from 'tamagui'

export function ToggleGroupDemo() {
  return (
    <YStack paddingHorizontal="$4">
      <XStack alignItems="center" space="$10">
        <YStack alignItems="center" space="$6">
          <ToggleGroupComponent type="single" size="$3" orientation="horizontal" />
          <ToggleGroupComponent type="multiple" size="$4" orientation="horizontal" />
        </YStack>
        <XStack alignItems="center" space="$6">
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
      alignItems="center"
      justifyContent="center"
      space="$4"
    >
      <Label paddingRight="$0" justifyContent="flex-end" size={props.size} htmlFor={id}>
        {props.type === 'single' ? 'Single' : 'Multiple'}
      </Label>

      {/* @ts-ignore */}
      <ToggleGroup
        orientation={props.orientation}
        id={id}
        type={props.type as any} // since this demo switches between loosen types
        size={props.size}
        disableDeactivation={props.type === 'single' ? true : undefined}
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
