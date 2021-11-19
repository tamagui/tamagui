import React from 'react'
import { Button, Theme, XStack, YStack } from 'tamagui'

export function ButtonDemo() {
  return (
    <XStack space>
      <Theme name="dark">
        <Buttons />
      </Theme>
      <Theme name="light">
        <Buttons />
      </Theme>
    </XStack>
  )
}

function Buttons() {
  return (
    <YStack bc="$bg" p="$3" br="$3" space>
      <Button>Plain</Button>
      <Button theme="active">Active</Button>
      <Theme name="yellow">
        <Button>Yellow</Button>
      </Theme>
    </YStack>
  )
}
