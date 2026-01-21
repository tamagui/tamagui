import { Activity, Airplay } from '@tamagui/lucide-icons'
import { Button, Group, ListItem, Separator, XGroup, YGroup, YStack } from 'tamagui'

export function GroupDemo() {
  return (
    <YStack p="$3" gap="$2" items="center">
      <Group orientation="horizontal">
        <Group.Item>
          <Button theme="surface3">First</Button>
        </Group.Item>
        <Group.Item>
          <Button theme="surface3">Second</Button>
        </Group.Item>
        <Group.Item>
          <Button theme="surface3">Third</Button>
        </Group.Item>
      </Group>

      {/* responsive size - children control their own size/radius */}
      <XGroup>
        <XGroup.Item>
          <Button theme="surface3" size="$3" $gtSm={{ size: '$5' }} icon={Activity}>
            First
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button theme="surface3" size="$3" $gtSm={{ size: '$5' }} icon={Airplay}>
            Second
          </Button>
        </XGroup.Item>
      </XGroup>

      {/* with separators - add them between items */}
      <YGroup>
        <YGroup.Item>
          <ListItem theme="surface1" title="First" />
        </YGroup.Item>
        <Separator />
        <YGroup.Item>
          <ListItem theme="surface1" title="Second" subTitle="Second subtitle" />
        </YGroup.Item>
        <Separator />
        <YGroup.Item>
          <ListItem theme="surface1">Third</ListItem>
        </YGroup.Item>
      </YGroup>
    </YStack>
  )
}
