import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons'
import { ListItem, Separator, XStack, YGroup } from 'tamagui'

export function ListItemDemo() {
  return (
    <XStack $sm={{ flexDirection: 'column' }} paddingHorizontal="$4" space>
      <ListItemDemo1 />
      <ListItemDemo2 />
    </XStack>
  )
}

function ListItemDemo1() {
  return (
    <YGroup alignSelf="center" bordered width={240} size="$4">
      <YGroup.Item>
        <ListItem hoverTheme icon={Star} title="Star" subTitle="Twinkles" />
      </YGroup.Item>
      <YGroup.Item>
        <ListItem hoverTheme icon={Moon}>
          Moon
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem hoverTheme icon={Sun}>
          Sun
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem hoverTheme icon={Cloud}>
          Cloud
        </ListItem>
      </YGroup.Item>
    </YGroup>
  )
}

function ListItemDemo2() {
  return (
    <YGroup alignSelf="center" bordered width={240} size="$5" separator={<Separator />}>
      <YGroup.Item>
        <ListItem
          hoverTheme
          pressTheme
          title="Star"
          subTitle="Subtitle"
          icon={Star}
          iconAfter={ChevronRight}
        />
      </YGroup.Item>
      <YGroup.Item>
        <ListItem
          hoverTheme
          pressTheme
          title="Moon"
          subTitle="Subtitle"
          icon={Moon}
          iconAfter={ChevronRight}
        />
      </YGroup.Item>
    </YGroup>
  )
}
