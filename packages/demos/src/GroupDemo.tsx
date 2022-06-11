import { Activity, Airplay } from '@tamagui/feather-icons'
import React from 'react'
import { Button, Group, ListItem, Separator, YStack } from 'tamagui'

export default function GroupDemo() {
  return (
    <YStack p="$3" space="$2" ai="center">
      <Group size="$3">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </Group>

      <Group size="$5">
        <Button icon={Activity}>First</Button>
        <Button icon={Airplay}>Second</Button>
      </Group>

      <Group size="$3" vertical separator={<Separator />}>
        <ListItem>First</ListItem>
        <ListItem>Second</ListItem>
        <ListItem>Third</ListItem>
      </Group>
    </YStack>
  )
}
