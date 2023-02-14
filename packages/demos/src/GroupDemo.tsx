import { Activity, Airplay } from '@tamagui/lucide-icons'
import { Button, ListItem, Separator, XGroup, YGroup, YStack } from 'tamagui'

export function GroupDemo() {
  return (
    <YStack p="$3" space="$2" ai="center">
      <XGroup>
        <XGroup.Item>
          <Button>First</Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button>Second</Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button>Third</Button>
        </XGroup.Item>
      </XGroup>

      {/* responsive + size */}
      <XGroup size="$3" $gtSm={{ size: '$5' }}>
        <XGroup.Item>
          <Button size="$3" icon={Activity}>
            First
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button size="$3" icon={Airplay}>
            Second
          </Button>
        </XGroup.Item>
      </XGroup>

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
