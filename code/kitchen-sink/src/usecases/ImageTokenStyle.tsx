import { Image } from '@tamagui/image'
import { Text, View, XStack, YStack } from 'tamagui'

const IMG_SRC = 'https://placecats.com/300/300'

const cases = [
  {
    label: 'br="$12"',
    props: { width: 120, height: 120, borderRadius: '$12' },
  },
  { label: 'br="$4"', props: { width: 120, height: 120, borderRadius: '$4' } },
  { label: 'br={20}', props: { width: 120, height: 120, borderRadius: 20 } },
  { label: 'no br', props: { width: 120, height: 120 } },
  {
    label: 'w/h="$10" br="$2"',
    props: { width: '$10', height: '$10', borderRadius: '$2' },
  },
]

export function ImageTokenStyle() {
  return (
    <YStack gap="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$5">
        Image token styles
      </Text>

      <XStack gap="$4">
        <View width={140} />
        <View width={130}>
          <Text fontWeight="bold" textAlign="center">
            Image
          </Text>
        </View>
        <View width={130}>
          <Text fontWeight="bold" textAlign="center">
            View (ref)
          </Text>
        </View>
      </XStack>

      {cases.map((c, i) => (
        <XStack key={i} gap="$4" alignItems="center">
          <View width={140}>
            <Text fontSize="$2">{c.label}</Text>
          </View>

          <YStack width={130} alignItems="center" overflow="hidden">
            <Image id={`v2-image-${i}`} src={IMG_SRC} {...c.props} />
          </YStack>

          <YStack width={130} alignItems="center" overflow="hidden">
            <View id={`view-ref-${i}`} backgroundColor="$blue10" {...c.props} />
          </YStack>
        </XStack>
      ))}
    </YStack>
  )
}
