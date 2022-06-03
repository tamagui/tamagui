import { Check, X } from '@tamagui/feather-icons'
import { Avatar, Button, Group, ListItem, Separator, Square, TooltipSimple, YStack } from 'tamagui'

export function KitchenSink() {
  return <YStack space></YStack>
}

export function ButtonDemo() {
  return (
    <Button alignSelf="center" size="$2" icon={Check} iconAfter={X}>
      Hello wrold
    </Button>
  )
}

export function TooltipDemo() {
  return (
    <TooltipSimple label="test tooltip">
      <Button size="$6" icon={Check} iconAfter={X}>
        Hello wrold
      </Button>
    </TooltipSimple>
  )
}

export function GroupListItemDemo() {
  return (
    <Group width={250} size="$4" vertical separator={<Separator marginLeft="$4" />}>
      <ListItem icon={Check} subTitle="test 123">
        Bye world
      </ListItem>
      <ListItem iconAfter={Check}>Hello world</ListItem>
      <ListItem iconAfter={Check}>Hello world</ListItem>
      <ListItem iconAfter={Check}>Hello world</ListItem>
    </Group>
  )
}

export function AvatarDemo() {
  return (
    <Avatar circular size="$10">
      <Avatar.Image src="http://placekitten.com/150/150" width={150} height={150} />
      <Avatar.Fallback bc="red" />
    </Avatar>
  )
}

export function ShapesDemo() {
  return (
    <>
      <Square size="$8" />
    </>
  )
}
