import React from 'react'
import { Input, Label, Switch, XStack, YStack } from 'tamagui'

export function LabelDemo() {
  return (
    <YStack p="$3" miw={300} space="$4">
      <XStack ai="center" space="$4">
        <Label w={90} htmlFor="name">
          Name
        </Label>
        <Input f={1} id="name" defaultValue="Nate Wienert" />
      </XStack>

      <XStack ai="center" space="$4">
        <Label w={90} htmlFor="notify">
          Notifications
        </Label>
        <Switch id="notify">
          <Switch.Thumb animation="quick" />
        </Switch>
      </XStack>
    </YStack>
  )
}
