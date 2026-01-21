import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons'
import { ListItem, Separator, Theme, XStack, YGroup } from 'tamagui'

export function ListItemDemo() {
  return (
    <Theme name="surface1">
      <XStack $maxMd={{ flexDirection: 'column' }} px="$4" gap="$4">
        <ListItemDemo1 />
        <ListItemDemo2 />
      </XStack>
    </Theme>
  )
}

function ListItemDemo1() {
  return (
    <YGroup
      self="center"
      borderWidth={1}
      borderColor="$borderColor"
      rounded="$4"
      width={240}
      size="$4"
    >
      <YGroup.Item>
        <ListItem
          icon={Star}
          title="Star"
          subTitle={<ListItem.Subtitle>Twinkles</ListItem.Subtitle>}
          iconAfter={ChevronRight}
        />
      </YGroup.Item>
      <YGroup.Item>
        <ListItem icon={Moon}>Moon</ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem icon={Sun}>Sun</ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem icon={Cloud}>Cloud</ListItem>
      </YGroup.Item>
    </YGroup>
  )
}

function ListItemDemo2() {
  return (
    <YGroup
      self="center"
      borderWidth={1}
      borderColor="$borderColor"
      rounded="$4"
      width={240}
      size="$5"
      separator={<Separator />}
    >
      <YGroup.Item>
        <ListItem title="Star" subTitle="Subtitle" icon={Star} iconAfter={ChevronRight} />
      </YGroup.Item>
      <YGroup.Item>
        <ListItem title="Moon" subTitle="Subtitle" icon={Moon} iconAfter={ChevronRight} />
      </YGroup.Item>
    </YGroup>
  )
}
