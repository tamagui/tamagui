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
      <Theme name="yellow">
        <Button size="$6">Large</Button>
      </Theme>
      <Button size="$3">Small</Button>
      <Button disabled>Disabled</Button>
      <Button chromeless>Chromeless</Button>
    </YStack>
  )
}
