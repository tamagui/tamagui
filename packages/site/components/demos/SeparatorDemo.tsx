import React from 'react'
import { Paragraph, Separator, XStack, YStack } from 'tamagui'

export const SeparatorDemo = () => (
  <YStack w="100%" mw={300} mx={15}>
    <Paragraph fontWeight="800">Tamagui</Paragraph>
    <Paragraph>An cross-platform component library.</Paragraph>
    <Separator my={15} />
    <XStack h={20} ai="center">
      <Paragraph>Blog</Paragraph>
      <Separator vertical mx={15} />
      <Paragraph>Docs</Paragraph>
      <Separator vertical mx={15} />
      <Paragraph>Source</Paragraph>
    </XStack>
  </YStack>
)
