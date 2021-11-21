import React from 'react'
import { Button, Theme, XStack, YStack } from 'tamagui'

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
      <Button theme="active">Active</Button>
      <Button theme="yellow">Yellow</Button>
      <Button size="$7">XL</Button>
      <Button size="$2">Small</Button>
      <Button size="$1">XS</Button>
      <Button size="$2" disabled>
        Disabled
      </Button>
      <Button size="$2" chromeless>
        Chromeless
      </Button>
    </YStack>
  )
}
