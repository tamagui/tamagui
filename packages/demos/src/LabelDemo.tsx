import React from 'react'
import { Input, Label, XStack } from 'tamagui'

export function LabelDemo() {
  return (
    <XStack miw={300} p="$3" space="$4">
      <Label htmlFor="name">Name</Label>
      <Input f={1} id="name" defaultValue="Nate Wienert" />
    </XStack>
  )
}
