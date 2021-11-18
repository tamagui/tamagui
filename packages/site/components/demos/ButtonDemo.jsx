import React from 'react'
import { Button, Theme, XStack, YStack } from 'tamagui'

export function ButtonDemo() {
  return (
    <XStack space>
      <YStack bc="$bg" p="$3" br="$3" space>
        <Button>Dark</Button>
        {/* <Button size="$4">Dark</Button> */}
        <Button theme="active">Active dark</Button>
        <Theme name="yellow">
          <Button>Yellow dark</Button>
        </Theme>
      </YStack>

      <Theme name="light">
        <YStack bc="$bg" p="$3" br="$3" space>
          <Button>Light</Button>
          {/* <Button padding="$2">Hello world</Button> */}
          <Button theme="active">Active light</Button>
          <Theme name="yellow">
            <Button>Yellow light</Button>
          </Theme>
        </YStack>
      </Theme>
    </XStack>
  )
}
