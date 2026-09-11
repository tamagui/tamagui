import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons-2'
import { ListItem, Separator, XStack, YGroup } from 'tamagui'

// the rows sit on color-1, the step just off the page background, so the list
// reads as a surface without needing a theme change
const surface = { bg: 'color-1 hover:color-2 press:color-3' } as const

export function ListItemDemo() {
  return (
    <XStack flexDirection="max-md:column" px="4" gap="4">
      <ListItemDemo1 />
      <ListItemDemo2 />
    </XStack>
  )
}

function ListItemDemo1() {
  return (
    <YGroup
      self="center"
      borderWidth={1}
      borderColor="border-color"
      rounded="4"
      overflow="hidden"
      width={240}
      size="4"
    >
      <YGroup.Item>
        <ListItem
          {...surface}
          gap="3"
          icon={Star}
          title="Star"
          subTitle={<ListItem.Subtitle>Twinkles</ListItem.Subtitle>}
          iconAfter={ChevronRight}
        />
      </YGroup.Item>
      <YGroup.Item>
        <ListItem {...surface} gap="3" icon={Moon}>
          Moon
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem {...surface} gap="3" icon={Sun}>
          Sun
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem {...surface} gap="3" icon={Cloud}>
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
      borderColor="border-color"
      rounded="4"
      overflow="hidden"
      width={240}
      size="5"
    >
      <YGroup.Item>
        <ListItem
          {...surface}
          gap="3"
          title="Star"
          subTitle="Subtitle"
          icon={Star}
          iconAfter={ChevronRight}
        />
      </YGroup.Item>
      <Separator />
      <YGroup.Item>
        <ListItem
          {...surface}
          gap="3"
          title="Moon"
          subTitle="Subtitle"
          icon={Moon}
          iconAfter={ChevronRight}
        />
      </YGroup.Item>
    </YGroup>
  )
}
