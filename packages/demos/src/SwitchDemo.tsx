import React from 'react'
import { Label, Separator, SizeTokens, Switch, XStack, YStack } from 'tamagui'

export function SwitchDemo() {
  return (
    <YStack w={300} ai="center" space="$3">
      <SwitchWithLabel size="$2" />
      <SwitchWithLabel size="$3" />
      <SwitchWithLabel size="$4" />
      <SwitchWithLabel size="$5" />
    </YStack>
  )
}

function SwitchWithLabel(props: { size: SizeTokens }) {
  return (
    <XStack w={300} x={-60} ai="center" space="$4">
      <Label pr="$0" miw={200} jc="flex-end" size={props.size} htmlFor="switch-1">
        Dark mode
      </Label>
      <Separator mih={20} vertical />
      <Switch id="switch-1" size={props.size}>
        <Switch.Thumb animation="bouncy" />
      </Switch>
    </XStack>
  )
}
