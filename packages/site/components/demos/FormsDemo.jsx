import React from 'react'
import { Input, TextArea, YStack } from 'tamagui'

export function FormsDemo() {
  return (
    <YStack space>
      <Input size="$2" placeholder="Size 2..." />
      <Input size="$3" placeholder="Size 3..." />
      <Input size="$4" placeholder="Size 4..." />
      <TextArea />
    </YStack>
  )
}
