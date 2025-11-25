import { ThemeTint, useTint } from '@tamagui/logo'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { XStack, View } from 'tamagui'

export const PageThemeCarousel = () => {
  const tint = useTint()

  return (
    <ThemeTint>
      <XStack
        position="absolute"
        t={0}
        l="$0"
        r="$0"
        maxH={400}
        b={0}
        pointerEvents="none"
        justify="center"
        items="center"
        z={100_000}
      >
        <XStack
          items="center"
          justify="space-between"
          self="center"
          flex={1}
          height="100%"
          maxW={1250}
        >
          <View
            p="$3"
            animation="lazy"
            pointerEvents="auto"
            opacity={0.2}
            hoverStyle={{
              opacity: 1,
            }}
            pressStyle={{
              opacity: 0.5,
            }}
            onPress={() => {
              tint.setTintIndex(
                tint.tintIndex - 1 < 0 ? tint.tint.length - 1 : tint.tintIndex - 1
              )
            }}
          >
            <ChevronLeft
              size={22}
              color="$color08"
              hoverStyle={{
                color: '$color12',
              }}
            />
          </View>
          <View
            p="$3"
            animation="lazy"
            pointerEvents="auto"
            opacity={0.2}
            hoverStyle={{
              opacity: 1,
            }}
            pressStyle={{
              opacity: 0.5,
            }}
            onPress={() => {
              tint.setTintIndex((tint.tintIndex + 1) % tint.tints.length)
            }}
          >
            <ChevronRight size={22} color="$color08" />
          </View>
        </XStack>
      </XStack>
    </ThemeTint>
  )
}
