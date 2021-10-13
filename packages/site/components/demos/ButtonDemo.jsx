import React from 'react'
import { Button, Theme, XStack, YStack } from 'tamagui'

export function ButtonDemo() {
  return (
    <XStack spacing>
      <YStack spacing>
        <Button>Hello world</Button>
        <Button padding="$2">Hello world</Button>
        <Button theme="active">Hello world</Button>
        <Theme name="yellow">
          <Button>This is sub-themed properly</Button>
        </Theme>
      </YStack>

      <Theme name="light">
        <YStack spacing>
          <Button>Hello world</Button>
          <Button padding="$2">Hello world</Button>
          <Button theme="active">Hello world</Button>
          <Theme name="yellow">
            <Button>This is sub-themed properly</Button>
          </Theme>
        </YStack>
      </Theme>
    </XStack>
  )
}
