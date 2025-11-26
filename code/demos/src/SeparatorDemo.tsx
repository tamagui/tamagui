import { Paragraph, Separator, XStack, YStack } from 'tamagui'

export function SeparatorDemo() {
  return (
    <YStack width="100%" maxW={300} mx={16}>
      <Paragraph fontWeight="800">Tamagui</Paragraph>
      <Paragraph>A cross-platform component library.</Paragraph>
      <Separator my={15} />
      <XStack height={20} items="center">
        <Paragraph>Blog</Paragraph>
        <Separator self="stretch" vertical mx={16} />
        <Paragraph>Docs</Paragraph>
        <Separator self="stretch" vertical mx={16} />
        <Paragraph>Source</Paragraph>
      </XStack>
    </YStack>
  )
}
