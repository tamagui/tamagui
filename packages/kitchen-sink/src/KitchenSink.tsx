import { Check, X } from '@tamagui/feather-icons'
import {
  Avatar,
  Button,
  Group,
  ListItem,
  Paragraph,
  Separator,
  Square,
  TooltipSimple,
  XStack,
  YStack,
} from 'tamagui'

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
      <Avatar.Fallback backgroundColor="red" />
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

export function SeparatorDemo() {
  return (
    <YStack width="100%" maxWidth={300} marginHorizontal={15}>
      <Paragraph fontWeight="800">Tamagui</Paragraph>
      <Paragraph>An cross-platform component library.</Paragraph>
      <Separator marginVertical={15} />
      <XStack
        height={20}
        alignItems="center"
        space
        separator={<Separator debug="verbose" alignSelf="stretch" vertical />}
      >
        <Paragraph>Blog</Paragraph>
        <Paragraph>Docs</Paragraph>
        <Paragraph>Source</Paragraph>
      </XStack>
    </YStack>
  )
}
