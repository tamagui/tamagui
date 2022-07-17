import { Activity, Airplay } from '@tamagui/feather-icons'
import React from 'react'
import { Button, ListItem, Separator, XGroup, YGroup, YStack } from 'tamagui'

export function GroupDemo() {
  return (
    <YStack p="$3" space="$2" ai="center">
      <XGroup size="$3">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </XGroup>

      <XGroup size="$5">
        <Button icon={Activity}>First</Button>
        <Button icon={Airplay}>Second</Button>
      </XGroup>

      <YGroup size="$4" separator={<Separator />}>
        <ListItem title="First" />
        <ListItem title="Second" subTitle="Second subtitle" />
        <ListItem>Second</ListItem>
        <ListItem>Third</ListItem>
      </YGroup>
    </YStack>
  )
}
