import { Activity, Airplay } from '@tamagui/feather-icons'
import React from 'react'
import { Button, Group, XStack } from 'tamagui'

export default function GroupDemo() {
  return (
    <XStack p="$3" space="$2" ai="center">
      <Group size="$3">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </Group>

      <Group size="$5">
        <Button icon={Activity}>First</Button>
        <Button icon={Airplay}>Second</Button>
      </Group>
    </XStack>
  )
}
