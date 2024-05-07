import { Data } from '@tamagui/bento'
import { ListItem, ScrollView, Separator, YGroup, YStack } from 'tamagui'
import { LinkListItem } from '../home/screen'

export function SectionScreen() {
  return (
    <ScrollView>
      <YStack bg="$color2" p="$3" pt="$6" pb="$8" f={1} space>
        <YGroup size="$4" separator={<Separator />}>
          {Data.listingData.sections.map(({ parts, sectionName }) => {
            return (
              <>
                <YGroup.Item key={sectionName}>
                  <ListItem>{sectionName.toUpperCase()}</ListItem>
                </YGroup.Item>
                {parts.map(({ name, route }) => {
                  return (
                    <YGroup.Item key={route}>
                      <LinkListItem bg="$color1" href={route} pressTheme size="$4">
                        {name}
                      </LinkListItem>
                    </YGroup.Item>
                  )
                })}
              </>
            )
          })}
        </YGroup>
      </YStack>
    </ScrollView>
  )
}
