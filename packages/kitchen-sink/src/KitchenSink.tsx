import { Check, X } from '@tamagui/feather-icons'
import { Button, Group, ListItem, YStack } from 'tamagui'

export function KitchenSink() {
  return (
    <YStack space>
      <Group size="$4" vertical>
        <ListItem iconAfter={Check}>Hello world</ListItem>
        <ListItem iconAfter={Check}>Hello world</ListItem>
        <ListItem iconAfter={Check}>Hello world</ListItem>
        <ListItem iconAfter={Check}>Hello world</ListItem>
      </Group>

      <Button size="$6" icon={Check} iconAfter={X}>
        Hello wrold
      </Button>

      <Button als="center" size="$2" icon={Check} iconAfter={X}>
        Hello wrold
      </Button>
    </YStack>
  )
}
