import React from 'react'
import { Label, Switch, XStack, YStack } from 'tamagui'

export default function SwitchDemo() {
  return (
    <YStack w={300} ai="center" space="$1">
      <XStack ai="center" space="$2">
        <Label size="$2" htmlFor="switch-1">
          Dark mode
        </Label>
        <Switch id="switch-1" size="$2">
          <Switch.Thumb animation="bouncy" />
        </Switch>
      </XStack>

      <XStack ai="center" space="$2">
        <Label size="$3" htmlFor="switch-2">
          Dark mode
        </Label>
        <Switch id="switch-2" size="$3">
          <Switch.Thumb animation="bouncy" />
        </Switch>
      </XStack>

      <XStack ai="center" space="$2">
        <Label size="$4" htmlFor="switch-3">
          Dark mode
        </Label>
        <Switch id="switch-3" size="$4">
          <Switch.Thumb animation="bouncy" />
        </Switch>
      </XStack>

      <XStack ai="center">
        <Label size="$5" htmlFor="switch-4">
          Dark mode
        </Label>
        <Switch id="switch-4" size="$5">
          <Switch.Thumb animation="bouncy" />
        </Switch>
      </XStack>
    </YStack>
  )
}
