import React from 'react'
import { Paragraph, SizableText, Text, XStack, YStack } from 'tamagui'

export function TextDemo() {
  return (
    <YStack gap="$2" items="center">
      <SizableText size="$3">SizableText</SizableText>
      <XStack gap="$4">
        <SizableText theme={'alt1' as any} size="$3">
          alt1
        </SizableText>
        <SizableText theme={'alt2' as any} size="$3">
          alt2
        </SizableText>
      </XStack>
      <Paragraph size="$2" fontWeight="800">
        Paragraph
      </Paragraph>
    </YStack>
  )
}
