import { AlignCenter, AlignLeft, AlignRight } from '@tamagui/lucide-icons'
import { Label, ToggleGroup, XGroup, YGroup, XStack, YStack } from 'tamagui'

export function ToggleGroupDemo() {
  return (
    <YStack px="$4">
      <XStack items="center" gap="$10">
        <YStack items="center" gap="$6">
          <ToggleGroupComponent type="single" orientation="horizontal" />
          <ToggleGroupComponent type="multiple" orientation="horizontal" />
        </YStack>
        <XStack items="center" gap="$6">
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
        type={props.type as any}
        disableDeactivation={props.type === 'single' ? true : undefined}
      >
        <Group>
          <Group.Item>
            <ToggleGroup.Item value="left" aria-label="Left aligned" borderRadius="$4" activeStyle={{ backgroundColor: '$color5' }}>
              <AlignLeft size={16} />
            </ToggleGroup.Item>
          </Group.Item>

          <Group.Item>
            <ToggleGroup.Item value="center" aria-label="Center aligned" borderRadius="$4" activeStyle={{ backgroundColor: '$color5' }}>
              <AlignCenter size={16} />
            </ToggleGroup.Item>
          </Group.Item>

          <Group.Item>
            <ToggleGroup.Item value="right" aria-label="Right aligned" borderRadius="$4" activeStyle={{ backgroundColor: '$color5' }}>
              <AlignRight size={16} />
            </ToggleGroup.Item>
          </Group.Item>
        </Group>
      </ToggleGroup>
    </XStack>
  )
}
