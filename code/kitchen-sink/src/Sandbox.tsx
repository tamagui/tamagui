import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Heading,
  Paragraph,
  SizableText,
  ScrollView,
  XStack,
  YStack,
} from 'tamagui'

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'

const sizes = ['$1', '$2', '$3', '$4', '$5', '$6', '$7', '$8', '$9', '$10'] as const

export const Sandbox = () => {
  return (
    <ScrollView flex={1} width="100%" contentContainerStyle={{ padding: 20 }}>
      <YStack gap="$6" maxWidth={800}>
        <YStack gap="$4">
          <Heading size="$8" marginBottom="$2">
            SizableText Sizes
          </Heading>
          {sizes.map((size) => (
            <YStack key={size} gap="$1">
              <SizableText size="$2" opacity={0.5}>
                size="{size}"
              </SizableText>
              <SizableText size={size}>{lorem}</SizableText>
            </YStack>
          ))}
        </YStack>

        <YStack gap="$4">
          <Heading size="$8" marginBottom="$2">
            Heading Sizes
          </Heading>
          {sizes.map((size) => (
            <YStack key={size} gap="$1">
              <SizableText size="$2" opacity={0.5}>
                Heading size="{size}"
              </SizableText>
              <Heading size={size}>{lorem}</Heading>
            </YStack>
          ))}
        </YStack>

        <YStack gap="$4">
          <Heading size="$8" marginBottom="$2">
            H1-H6 Components
          </Heading>
          <YStack gap="$3">
            <SizableText size="$2" opacity={0.5}>
              H1
            </SizableText>
            <H1>{lorem}</H1>
            <SizableText size="$2" opacity={0.5}>
              H2
            </SizableText>
            <H2>{lorem}</H2>
            <SizableText size="$2" opacity={0.5}>
              H3
            </SizableText>
            <H3>{lorem}</H3>
            <SizableText size="$2" opacity={0.5}>
              H4
            </SizableText>
            <H4>{lorem}</H4>
            <SizableText size="$2" opacity={0.5}>
              H5
            </SizableText>
            <H5>{lorem}</H5>
            <SizableText size="$2" opacity={0.5}>
              H6
            </SizableText>
            <H6>{lorem}</H6>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
