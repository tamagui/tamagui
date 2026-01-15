import { ThemeTint, useTint } from '@tamagui/logo'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { XStack, YStack, useThemeName } from 'tamagui'

export const PageThemeCarousel = () => {
  const tint = useTint()
  const isDark = useThemeName().startsWith('dark')

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
          <YStack
            p="$3"
            cursor="pointer"
            pointerEvents="auto"
            opacity={0.4}
            hoverStyle={{
              opacity: 1,
              scale: 1.1,
            }}
            pressStyle={{
              opacity: 0.6,
              scale: 0.95,
            }}
            onPress={() => {
              tint.setTintIndex(
                tint.tintIndex - 1 < 0 ? tint.tints.length - 1 : tint.tintIndex - 1
              )
            }}
            className="ease-out ms200 all"
          >
            <ChevronLeft size={24} color="$color12" />
          </YStack>
          <YStack
            p="$3"
            cursor="pointer"
            pointerEvents="auto"
            opacity={0.4}
            hoverStyle={{
              opacity: 1,
              scale: 1.1,
            }}
            pressStyle={{
              opacity: 0.6,
              scale: 0.95,
            }}
            onPress={() => {
              tint.setTintIndex((tint.tintIndex + 1) % tint.tints.length)
            }}
            className="ease-out ms200 all"
          >
            <ChevronRight size={24} color="$color12" />
          </YStack>
        </XStack>
      </XStack>
    </ThemeTint>
  )
}
