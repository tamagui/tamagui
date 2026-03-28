import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons-2'
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
      overflow="hidden"
      width={240}
      size="$4"
    >
      <YGroup.Item>
        <ListItem
          gap="$3"
          icon={Star}
          title="Star"
          subTitle={<ListItem.Subtitle>Twinkles</ListItem.Subtitle>}
          iconAfter={ChevronRight}
        />
      </YGroup.Item>
      <YGroup.Item>
        <ListItem gap="$3" icon={Moon}>
          Moon
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem gap="$3" icon={Sun}>
          Sun
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem gap="$3" icon={Cloud}>
          Cloud
        </ListItem>
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
      overflow="hidden"
      width={240}
      size="$5"
    >
      <YGroup.Item>
        <ListItem
          gap="$3"
          title="Star"
          subTitle="Subtitle"
          icon={Star}
          iconAfter={ChevronRight}
        />
      </YGroup.Item>
      <Separator />
      <YGroup.Item>
        <ListItem
          gap="$3"
          title="Moon"
          subTitle="Subtitle"
          icon={Moon}
          iconAfter={ChevronRight}
        />
      </YGroup.Item>
    </YGroup>
  )
}
