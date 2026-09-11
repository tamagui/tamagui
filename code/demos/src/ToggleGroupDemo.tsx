import { AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons-2'
import { Label, ToggleGroup, XGroup, YGroup, XStack, YStack } from 'tamagui'

export function ToggleGroupDemo() {
  return (
    <YStack px="4">
      <XStack items="center" gap="10">
        <YStack items="center" gap="6">
          <ToggleGroupComponent type="single" orientation="horizontal" />
          <ToggleGroupComponent type="multiple" orientation="horizontal" />
        </YStack>
        <XStack items="center" gap="6" y={-28}>
          <ToggleGroupComponent type="single" orientation="vertical" />
          <ToggleGroupComponent type="multiple" orientation="vertical" />
        </XStack>
      </XStack>
    </YStack>
  )
}

function ToggleGroupComponent(props: {
  type: 'single' | 'multiple'
  orientation: 'vertical' | 'horizontal'
}) {
  const id = `switch-${props.type}`
  const Group = props.orientation === 'horizontal' ? XGroup : YGroup

  const items = (
    <Group>
      <Group.Item>
        <ToggleGroup.Item value="left" aria-label="Left aligned" borderRadius="4">
          <AlignLeft size={16} />
        </ToggleGroup.Item>
      </Group.Item>

      <Group.Item>
        <ToggleGroup.Item value="center" aria-label="Center aligned" borderRadius="4">
          <AlignCenter size={16} />
        </ToggleGroup.Item>
      </Group.Item>

      <Group.Item>
        <ToggleGroup.Item value="right" aria-label="Right aligned" borderRadius="4">
          <AlignRight size={16} />
        </ToggleGroup.Item>
      </Group.Item>
    </Group>
  )

  return (
    <XStack
      flexDirection={props.orientation === 'horizontal' ? 'row' : 'column'}
      items="center"
      justify="center"
      gap="4"
    >
      <Label pr="0" justify="flex-end" size="4" htmlFor={id}>
        {props.type === 'single' ? 'Single' : 'Multiple'}
      </Label>

      {/* `type` discriminates the props union, so each variant is written out */}
      {props.type === 'single' ? (
        <ToggleGroup
          type="single"
          orientation={props.orientation}
          id={id}
          disableDeactivation
        >
          {items}
        </ToggleGroup>
      ) : (
        <ToggleGroup type="multiple" orientation={props.orientation} id={id}>
          {items}
        </ToggleGroup>
      )}
    </XStack>
  )
}
