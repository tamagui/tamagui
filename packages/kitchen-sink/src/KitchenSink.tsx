import { Check, X } from '@tamagui/feather-icons'
import { Button, Group, ListItem, Separator, TooltipSimple, YStack } from 'tamagui'

export function KitchenSink() {
  return (
    <YStack space>
      <Group width={250} size="$4" vertical separator={<Separator marginLeft="$4" />}>
        <ListItem icon={Check} subTitle="test 123">
          Bye world
        </ListItem>
        <ListItem iconAfter={Check}>Hello world</ListItem>
        <ListItem iconAfter={Check}>Hello world</ListItem>
        <ListItem iconAfter={Check}>Hello world</ListItem>
      </Group>

      <TooltipSimple label="test tooltip">
        <Button size="$6" icon={Check} iconAfter={X}>
          Hello wrold
        </Button>
      </TooltipSimple>

      <Button alignSelf="center" size="$2" icon={Check} iconAfter={X}>
        Hello wrold
      </Button>
    </YStack>
  )
}
