import { Activity, Airplay } from '@tamagui/feather-icons'
import React from 'react'
import { Button, Group, XStack, YStack } from 'tamagui'

export default function ButtonDemo(props) {
  return (
    <YStack p="$3" space="$2" {...props}>
      <Button>Plain</Button>
      <Button als="center" icon={Airplay} size="$6">
        Large
      </Button>
      <Group>
        <Button w="50%" size="$3" br={0} theme="alt2">
          Alt2
        </Button>
        <Button w="50%" size="$3" br={0} theme="yellow">
          Yellow
        </Button>
      </Group>
      <XStack space>
        <Button themeInverse size="$2">
          Small Inverse
        </Button>
        <Button iconAfter={Activity} size="$2">
          After
        </Button>
      </XStack>
      <Group>
        <Button w="50%" br={0} size="$1" disabled>
          disabled
        </Button>
        <Button w="50%" br={0} size="$1" chromeless>
          chromeless
        </Button>
      </Group>
    </YStack>
  )
}
