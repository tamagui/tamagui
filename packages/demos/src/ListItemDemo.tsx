import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/feather-icons'
import React from 'react'
import { ListItem, Separator, XStack, YGroup } from 'tamagui'

export function ListItemDemo() {
  return (
    <XStack $sm={{ flexDirection: 'column' }} px="$4" space>
      <ListItemDemo1 />
      <ListItemDemo2 />
    </XStack>
  )
}

function ListItemDemo1() {
  return (
    <YGroup als="center" bordered w={240} size="$4">
      <ListItem hoverTheme icon={Star} title="Star" subTitle="Twinkles" />
      <ListItem hoverTheme icon={Moon}>
        Moon
      </ListItem>
      <ListItem hoverTheme icon={Sun}>
        Sun
      </ListItem>
      <ListItem hoverTheme icon={Cloud}>
        Cloud
      </ListItem>
    </YGroup>
  )
}

function ListItemDemo2() {
  return (
    <YGroup als="center" bordered w={240} size="$5" separator={<Separator />}>
      <ListItem hoverTheme title="Star" subTitle="Subtitle" icon={Star} iconAfter={ChevronRight} />
      <ListItem hoverTheme title="Moon" subTitle="Subtitle" icon={Moon} iconAfter={ChevronRight} />
    </YGroup>
  )
}
