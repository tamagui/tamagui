import React from 'react'
import { Paragraph, Separator, XStack, YStack } from 'tamagui'

export default function SeparatorDemo() {
  return (
    <YStack w="100%" maw={300} mx={15}>
      <Paragraph fontWeight="800">Tamagui</Paragraph>
      <Paragraph>An cross-platform component library.</Paragraph>
      <Separator my={15} />
      <XStack h={20} ai="center">
        <Paragraph>Blog</Paragraph>
        <Separator als="stretch" vertical mx={15} />
        <Paragraph>Docs</Paragraph>
        <Separator als="stretch" vertical mx={15} />
        <Paragraph>Source</Paragraph>
      </XStack>
    </YStack>
  )
}
