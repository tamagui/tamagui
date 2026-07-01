import { Image } from '@tamagui/image'
import { Text, View, XStack, YStack } from 'tamagui'

const IMG_SRC = 'https://placecats.com/600/300'

// Wide source image (600x300) into a square box (140x140) so the
// difference between objectFit values is visually obvious.
const fits = ['cover', 'contain', 'fill', 'none', 'scale-down'] as const

// objectPosition: only really renders on web today (and via expo-image on
// native using contentPosition). The non-keyword native default Image
// will ignore these; on web they crop/anchor the visible region.
const positions = ['center', 'top', 'bottom', 'left', 'right'] as const

export function ImageObjectFit() {
  return (
    <YStack gap="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$5">
        Image objectFit
      </Text>

      <XStack gap="$3" flexWrap="wrap">
        {fits.map((fit) => (
          <YStack key={fit} width={140} alignItems="center" gap="$2">
            <Text fontSize="$2">{fit}</Text>
            <View width={140} height={140} backgroundColor="$gray5" overflow="hidden">
              <Image
                id={`fit-${fit}`}
                src={IMG_SRC}
                width={140}
                height={140}
                objectFit={fit}
              />
            </View>
          </YStack>
        ))}
      </XStack>

      <Text fontWeight="bold" fontSize="$5">
        Image objectPosition (objectFit=cover)
      </Text>

      <XStack gap="$3" flexWrap="wrap">
        {positions.map((pos) => (
          <YStack key={pos} width={140} alignItems="center" gap="$2">
            <Text fontSize="$2">{pos}</Text>
            <View width={140} height={140} backgroundColor="$gray5" overflow="hidden">
              <Image
                id={`pos-${pos}`}
                src={IMG_SRC}
                width={140}
                height={140}
                objectFit="cover"
                objectPosition={pos}
              />
            </View>
          </YStack>
        ))}
      </XStack>
    </YStack>
  )
}
