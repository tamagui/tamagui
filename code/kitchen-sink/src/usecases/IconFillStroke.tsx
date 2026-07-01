import { Heart, Star } from '@tamagui/lucide-icons-2'
import { YStack, XStack, Text } from 'tamagui'

// smoke case for SVG fill/stroke/strokeWidth on themed icons:
// - plain colors pass through
// - theme tokens ($colorN) resolve via the themed() wrapper on both web and native
export const IconFillStroke = () => (
  <YStack gap="$4" padding="$4">
    <XStack gap="$3" alignItems="center">
      <Text>plain stroke</Text>
      <Heart stroke="red" testID="stroke-plain-red" />
    </XStack>

    <XStack gap="$3" alignItems="center">
      <Text>themed stroke</Text>
      <Heart stroke="$color10" testID="stroke-token" />
    </XStack>

    <XStack gap="$3" alignItems="center">
      <Text>plain fill</Text>
      <Star fill="orange" stroke="orange" testID="fill-plain" />
    </XStack>

    <XStack gap="$3" alignItems="center">
      <Text>themed fill</Text>
      <Star fill="$color10" stroke="$color10" testID="fill-token" />
    </XStack>

    <XStack gap="$3" alignItems="center">
      <Text>strokeWidth (number)</Text>
      <Heart strokeWidth={4} testID="strokeWidth-number" />
    </XStack>

    <XStack gap="$3" alignItems="center">
      <Text>strokeWidth (token)</Text>
      <Heart strokeWidth="$1" testID="strokeWidth-token" />
    </XStack>
  </YStack>
)
