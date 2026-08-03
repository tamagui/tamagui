import { Activity, Airplay } from '@tamagui/lucide-icons-2'
import { Group, ListItem, Separator, XGroup, YGroup, YStack } from 'tamagui'
import { Button } from './Button'

export function GroupDemo() {
  return (
    <YStack p="3" gap="2" items="center">
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

      {/* responsive size - children control their own size/radius */}
      <XGroup>
        <XGroup.Item>
          <Button size="4 gtSm:5" icon={Activity}>
            First
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button size="4 gtSm:5" icon={Airplay}>
            Second
          </Button>
        </XGroup.Item>
      </XGroup>

      {/* with separators - add them between items */}
      <YGroup>
        <YGroup.Item>
          <ListItem borderRadius="6" theme="level2" title="First" />
        </YGroup.Item>
        <Separator />
        <YGroup.Item>
          <ListItem
            borderRadius="6"
            theme="level2"
            title="Second"
            subTitle="Second subtitle"
          />
        </YGroup.Item>
        <Separator />
        <YGroup.Item>
          <ListItem borderRadius="6" theme="level2">
            Third
          </ListItem>
        </YGroup.Item>
      </YGroup>
    </YStack>
  )
}
