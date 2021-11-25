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
    <YStack elevation="$6" w={160} bc="$bg" p="$2" br="$2" space="$1" {...props}>
      <Button>Plain</Button>
      <Button themeIcon icon={Airplay} size="$6">
        Large
      </Button>
      <InteractiveContainer>
        <Button size="$3" br={0} theme="active">
          Active
        </Button>
        <Button size="$3" br={0} theme="yellow">
          Yellow
        </Button>
      </InteractiveContainer>
      <Button themeIcon iconAfter={Gift} size="$3">
        Small
      </Button>
      <Button themeIcon icon={Activity} size="$2">
        XS
      </Button>
      <Button size="$2" disabled>
        Disabled
      </Button>
      <Button size="$2" chromeless>
        Chromeless
      </Button>
    </YStack>
  )
}
