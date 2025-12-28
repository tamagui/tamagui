import { Activity, Airplay } from '@tamagui/lucide-icons'
import { Button, Group, ListItem, Separator, XGroup, YGroup, YStack } from 'tamagui'
export function GroupDemo() {
  return (
    <YStack p="$3" gap="$2" items="center">
      <Group orientation="horizontal">
        <Group.Item>
          <Button>First</Button>
        </Group.Item>
        <Group.Item>
          <Button>Second</Button>
        </Group.Item>
        <Group.Item>
          <Button>Third</Button>
        </Group.Item>
      </Group>

      {/* responsive + size */}
      <XGroup size="$3" $gtSm={{ size: '$5' }}>
        <XGroup.Item>
          <Button size="$3" icon={Activity} gap="$3">
            First
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button size="$3" icon={Airplay} gap="$3">
            Second
          </Button>
        </XGroup.Item>
      </XGroup>

      {/* Separator */}
      <YGroup separator={<Separator />}>
        <YGroup.Item>
          <ListItem title="First" />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem title="Second" subTitle="Second subtitle" />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem>Third</ListItem>
        </YGroup.Item>
      </YGroup>
    </YStack>
  )
}
