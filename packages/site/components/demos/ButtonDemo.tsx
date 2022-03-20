import { Activity, Airplay, Gift } from '@tamagui/feather-icons'
import React from 'react'
import { Button, InteractiveContainer, Theme, XStack, YStack } from 'tamagui'

export function ButtonDemo(props) {
  return (
    <YStack p="$3" space="$1" {...props}>
      <Button>Plain</Button>
      <Button icon={Airplay} size="$6">
        Large
      </Button>
      <InteractiveContainer>
        <Button w="50%" size="$3" br={0} theme="alt1">
          Alt1
        </Button>
        <Button w="50%" size="$3" br={0} theme="yellow">
          Yellow
        </Button>
      </InteractiveContainer>
      <XStack space>
        <Button themeInverse iconAfter={Gift} size="$2">
          Small Inversed
        </Button>
        <Button icon={Activity} size="$1">
          XS
        </Button>
      </XStack>
      <InteractiveContainer>
        <Button w="50%" size="$1" disabled>
          Disabled
        </Button>
        <Button w="50%" size="$1" chromeless>
          Chromeless
        </Button>
      </InteractiveContainer>
    </YStack>
  )
}
