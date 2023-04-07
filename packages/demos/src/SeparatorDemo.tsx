import React from 'react'
import { Paragraph, Separator, XStack, YStack } from 'tamagui'

export function SeparatorDemo() {
  return (
    <YStack width="100%" maxWidth={300} marginHorizontal={15}>
      <Paragraph fontWeight="800">Tamagui</Paragraph>
      <Paragraph>A cross-platform component library.</Paragraph>
      <Separator marginVertical={15} />
      <XStack height={20} alignItems="center">
        <Paragraph>Blog</Paragraph>
        <Separator alignSelf="stretch" vertical marginHorizontal={15} />
        <Paragraph>Docs</Paragraph>
        <Separator alignSelf="stretch" vertical marginHorizontal={15} />
        <Paragraph>Source</Paragraph>
      </XStack>
    </YStack>
  )
}
