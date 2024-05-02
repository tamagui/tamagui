import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons'
import { ListItem, Separator, View, XStack, YGroup } from 'tamagui'

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
        <ListItem hoverTheme>
          <ListItem.Icon>
            <Star />
          </ListItem.Icon>
          <ListItem.TextContent>
            <ListItem.Title>Stars</ListItem.Title>
            <ListItem.Subtitle>Twinkles</ListItem.Subtitle>
          </ListItem.TextContent>
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem hoverTheme>
          <ListItem.Icon>
            <Moon />
          </ListItem.Icon>
          <ListItem.TextContent>
            <ListItem.Title>Moon</ListItem.Title>
          </ListItem.TextContent>
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem hoverTheme>
          <ListItem.Icon>
            <Sun />
          </ListItem.Icon>
          <ListItem.TextContent>
            <ListItem.Title>Sun</ListItem.Title>
          </ListItem.TextContent>
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem hoverTheme>
          <ListItem.Icon>
            <Cloud />
          </ListItem.Icon>
          <ListItem.TextContent>
            <ListItem.Title>Cloud</ListItem.Title>
          </ListItem.TextContent>
        </ListItem>
      </YGroup.Item>
    </YGroup>
  )
}

function ListItemDemo2() {
  return (
    <YGroup width={240} alignSelf="center" bordered size="$5" separator={<Separator />}>
      <YGroup.Item>
        <ListItem hoverTheme>
          <ListItem.Icon>
            <Star />
          </ListItem.Icon>
          <ListItem.TextContent>
            <ListItem.Title>Star</ListItem.Title>
            <ListItem.Subtitle>Subtitle</ListItem.Subtitle>
          </ListItem.TextContent>
          <ListItem.Icon>
            <ChevronRight />
          </ListItem.Icon>
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem hoverTheme>
          <ListItem.Icon>
            <Moon />
          </ListItem.Icon>
          <ListItem.TextContent>
            <ListItem.Title>Moon</ListItem.Title>
            <ListItem.Subtitle>Subtitle</ListItem.Subtitle>
          </ListItem.TextContent>
          <ListItem.Icon>
            <ChevronRight />
          </ListItem.Icon>
        </ListItem>
      </YGroup.Item>
    </YGroup>
  )
}
