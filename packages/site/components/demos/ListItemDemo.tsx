import { Cloud, Moon, Star, Sun } from '@tamagui/feather-icons'
import { Group, ListItem, XStack } from 'tamagui'

export default function ListItemDemo() {
  return (
    <XStack $sm={{ als: 'flex-start' }} px="$4" space>
      <Group bordered w={240} size="$4" vertical>
        <ListItem iconAfter={Star}>Star</ListItem>
        <ListItem iconAfter={Moon}>Moon</ListItem>
        <ListItem iconAfter={Sun}>Sun</ListItem>
        <ListItem iconAfter={Cloud}>Cloud</ListItem>
      </Group>
    </XStack>
  )
}
