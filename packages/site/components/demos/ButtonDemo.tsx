import { Activity, Airplay, Gift } from '@tamagui/feather-icons'
import React from 'react'
import { Button, InteractiveContainer, Theme, XStack, YStack } from 'tamagui'

export function ButtonDemo() {
  return (
    <XStack space>
      <Theme name="dark">
        <Buttons ai="flex-end" />
      </Theme>
      <Theme name="light">
        <Buttons ai="flex-start" />
      </Theme>
    </XStack>
  )
}

function Buttons(props) {
  return (
    <YStack elevation="$6" w={180} bc="$bg" p="$3" br="$2" space="$2" {...props}>
      <Button>Plain</Button>
      <Button icon={Airplay} size="$6">
        Large
      </Button>
      <Button themeInverse iconAfter={Gift} size="$2">
        Small Inversed
      </Button>
      <Button icon={Activity} size="$1">
        XS
      </Button>
      <InteractiveContainer>
        <Button size="$3" br={0} theme="active">
          Active
        </Button>
        <Button size="$3" br={0} theme="yellow">
          Yellow
        </Button>
      </InteractiveContainer>
      <InteractiveContainer>
        <Button size="$2" disabled>
          Disabled
        </Button>
        <Button size="$2" chromeless>
          Chromeless
        </Button>
      </InteractiveContainer>
    </YStack>
  )
}
