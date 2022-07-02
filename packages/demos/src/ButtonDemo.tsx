import { Activity, Airplay } from '@tamagui/feather-icons'
import React from 'react'
import { Button, Group, XStack, YStack } from 'tamagui'

export function ButtonDemo(props) {
  return (
    <YStack p="$3" space {...props}>
      <Button>Plain</Button>
      <Button als="center" icon={Airplay} size="$6">
        Large
      </Button>
      <Group>
        <Button w="50%" size="$3" theme="alt2">
          Alt2
        </Button>
        <Button w="50%" size="$3" theme="yellow">
          Yellow
        </Button>
      </Group>
      <XStack space="$2">
        <Button themeInverse size="$3">
          Small Inverse
        </Button>
        <Button iconAfter={Activity} size="$3">
          After
        </Button>
      </XStack>
      <Group>
        <Button w="50%" size="$2" disabled>
          disabled
        </Button>
        <Button w="50%" size="$2" chromeless>
          chromeless
        </Button>
      </Group>
    </YStack>
  )
}
