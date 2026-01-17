import { Paragraph, SizableText, YStack } from 'tamagui'

export function TextDemo() {
  return (
    <YStack gap="$2" items="center">
      <SizableText size="$3">SizableText</SizableText>
      <Paragraph size="$2" fontWeight="800">
        Paragraph
      </Paragraph>
    </YStack>
  )
}
