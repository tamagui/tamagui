import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/feather-icons'
import React from 'react'
import { Group, ListItem, Separator, XStack } from 'tamagui'

export default function ListItemDemo() {
  return (
    <XStack $sm={{ flexDirection: 'column' }} px="$4" space>
      <ListItemDemo1 />
      <ListItemDemo2 />
    </XStack>
  )
}

function ListItemDemo1() {
  return (
    <Group als="center" bordered w={240} size="$4" vertical>
      <ListItem hoverTheme icon={Star}>
        Star
      </ListItem>
      <ListItem hoverTheme icon={Moon}>
        Moon
      </ListItem>
      <ListItem hoverTheme icon={Sun}>
        Sun
      </ListItem>
      <ListItem hoverTheme icon={Cloud}>
        Cloud
      </ListItem>
    </Group>
  )
}

function ListItemDemo2() {
  return (
    <Group als="center" bordered w={240} size="$6" vertical separator={<Separator />}>
      <ListItem hoverTheme title="Star" subTitle="Subtitle" icon={Star} iconAfter={ChevronRight} />
      <ListItem hoverTheme title="Moon" subTitle="Subtitle" icon={Moon} iconAfter={ChevronRight} />
    </Group>
  )
}
