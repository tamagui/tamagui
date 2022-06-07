import { Cloud, Moon, Star, Sun } from '@tamagui/feather-icons'
import { Group, ListItem, Separator, XStack } from 'tamagui'

export default function ListItemDemo() {
  return (
    <XStack $sm={{ als: 'flex-start' }} px="$4" space>
      <ListItemDemo1 />
      <ListItemDemo2 />
    </XStack>
  )
}

function ListItemDemo1() {
  return (
    <Group als="center" bordered w={240} size="$4" vertical>
      <ListItem hoverable icon={Star}>
        Star
      </ListItem>
      <ListItem hoverable icon={Moon}>
        Moon
      </ListItem>
      <ListItem hoverable icon={Sun}>
        Sun
      </ListItem>
      <ListItem hoverable icon={Cloud}>
        Cloud
      </ListItem>
    </Group>
  )
}

function ListItemDemo2() {
  return (
    <Group als="center" bordered w={240} size="$5" vertical separator={<Separator />}>
      <ListItem title="Star" subTitle="Subtitle" iconAfter={Star} />
      <ListItem title="Moon" subTitle="Subtitle" iconAfter={Moon} />
    </Group>
  )
}
