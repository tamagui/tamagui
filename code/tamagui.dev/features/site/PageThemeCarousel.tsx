import { ThemeTint, useTint } from '@tamagui/logo'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { XStack, View } from 'tamagui'

export const PageThemeCarousel = () => {
  const tint = useTint()

  return (
    <ThemeTint>
      <XStack
        pos="absolute"
        t={0}
        l="$4"
        r="$4"
        mah={400}
        b={0}
        pe="none"
        jc="center"
        ai="center"
        zi={100_000}
      >
        <XStack ai="center" jc="space-between" als="center" f={1} h="100%" maw={1200}>
          <View
            p="$3"
            animation="lazy"
            pe="auto"
            o={0.2}
            hoverStyle={{
              o: 1,
            }}
            pressStyle={{
              o: 0.5,
            }}
            onPress={() => {
              tint.setTintIndex(
                tint.tintIndex - 1 < 0 ? tint.tint.length - 1 : tint.tintIndex - 1
              )
            }}
          >
            <ChevronLeft
              size={48}
              color="$color08"
              hoverStyle={{
                color: '$color12',
              }}
            />
          </View>
          <View
            p="$3"
            animation="lazy"
            pe="auto"
            o={0.2}
            hoverStyle={{
              o: 1,
            }}
            pressStyle={{
              o: 0.5,
            }}
            onPress={() => {
              tint.setTintIndex((tint.tintIndex + 1) % tint.tints.length)
            }}
          >
            <ChevronRight size={48} color="$color08" />
          </View>
        </XStack>
      </XStack>
    </ThemeTint>
  )
}
