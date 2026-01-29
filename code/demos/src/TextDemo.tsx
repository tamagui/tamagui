import { Em, Paragraph, SizableText, Span, Strong, YStack } from 'tamagui'

export function TextDemo() {
  return (
    <YStack gap="$2" items="center">
      <SizableText size="$3">SizableText</SizableText>
      <Paragraph size="$2" fontWeight="800">
        Paragraph
      </Paragraph>
      <Paragraph>
        <Strong>Strong</Strong>, <Em>Em</Em>, <Span>Span</Span>
      </Paragraph>
    </YStack>
  )
}
