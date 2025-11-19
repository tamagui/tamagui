import React from 'react'
import { Paragraph, Separator, XStack, YStack } from 'tamagui'

export function SeparatorDemo() {
  return (
    <YStack width="100%" maxWidth={300} mx={16}>
      <Paragraph fontWeight="800">Tamagui</Paragraph>
      <Paragraph>A cross-platform component library.</Paragraph>
      <Separator marginVertical={15} />
      <XStack height={20} alignItems="center">
        <Paragraph>Blog</Paragraph>
        <Separator alignSelf="stretch" vertical mx={16} />
        <Paragraph>Docs</Paragraph>
        <Separator alignSelf="stretch" vertical mx={16} />
        <Paragraph>Source</Paragraph>
      </XStack>
    </YStack>
  )
}
