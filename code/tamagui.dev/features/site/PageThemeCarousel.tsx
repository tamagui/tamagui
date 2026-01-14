import { Image } from '@tamagui/image'
import { ThemeTint, useTint } from '@tamagui/logo'
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
            <Image
              src="/takeout/pixel-icons/next.svg"
              alt="Previous theme"
              width={24}
              height={24}
              className="pixelate"
              filter={isDark ? 'invert(1)' : 'none'}
              style={{ transform: 'scaleX(-1)' }}
            />
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
            <Image
              src="/takeout/pixel-icons/next.svg"
              alt="Next theme"
              width={24}
              height={24}
              className="pixelate"
              filter={isDark ? 'invert(1)' : 'none'}
            />
          </YStack>
        </XStack>
      </XStack>
    </ThemeTint>
  )
}
