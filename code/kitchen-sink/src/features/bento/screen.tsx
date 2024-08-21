import { Data } from '@tamagui/bento'
import React from 'react'
import { ListItem, ScrollView, Separator, YGroup, YStack } from 'tamagui'

import { LinkListItem } from '../home/screen'

export function BentoScreen() {
  return (
    <ScrollView>
      <YStack bg="$color2" p="$3" pt="$6" pb="$8" f={1} space>
        <YGroup size="$4" separator={<Separator />}>
          {Data.listingData.sections.map(({ parts, sectionName }) => {
            return (
              <React.Fragment key={sectionName}>
                <YGroup.Item key={sectionName}>
                  <ListItem>{sectionName.toUpperCase()}</ListItem>
                </YGroup.Item>
                {parts.map(({ name, route }) => {
                  return (
                    <YGroup.Item key={route}>
                      <LinkListItem
                        bg="$color1"
                        href={route}
                        pressTheme
                        size="$4"
                      >
                        {name}
                      </LinkListItem>
                    </YGroup.Item>
                  )
                })}
              </React.Fragment>
            )
          })}
        </YGroup>
      </YStack>
    </ScrollView>
  )
}
