import React from 'react'
import { Paragraph, SizableText, Text, YStack } from 'tamagui'

export function TextDemo() {
  return (
    <YStack space="$2" ai="center">
      <Text>Hello world</Text>
      <SizableText size="$3">Hello world</SizableText>
      <Paragraph size="$2">Hello world</Paragraph>
    </YStack>
  )
}
