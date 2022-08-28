import React from 'react'
import { Button, Input, SizeTokens, TextArea, XStack, YStack } from 'tamagui'

export function FormsDemo() {
  return (
    <YStack w={200} mih={250} overflow="hidden" space="$2" m="$3" p="$2">
      <FormDemo size="$2" />
      <FormDemo size="$3" />
      <FormDemo size="$4" />
      <TextArea numberOfLines={4} />
    </YStack>
  )
}

function FormDemo(props: { size: SizeTokens }) {
  return (
    <XStack ai="center" space="$2">
      <Input debug="verbose" f={1} size={props.size} placeholder={`Size ${props.size}...`} />
      <Button size={props.size}>Go</Button>
    </XStack>
  )
}
