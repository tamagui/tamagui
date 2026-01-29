import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from '@tamagui/lucide-icons'
import { type BuildPalette, getThemeSuitePalettes } from '@tamagui/theme-builder'
import { Paragraph, XStack, YStack } from 'tamagui'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { StudioPaletteBar } from '../../StudioPaletteBar'

export function Palettes({
  palette,
  condensed = false,
}: {
  palette: BuildPalette
  condensed?: boolean
}) {
  const palettes = getThemeSuitePalettes(palette)
  const { schemes } = useThemeBuilderStore()

  return (
    <YStack
      rounded="$4"
      overflow="hidden"
      borderColor="$color8"
      borderWidth={0.5}
      elevation="$1"
    >
      {schemes.light && (
        <StudioPaletteBar showLabelIndices={!condensed} colors={palettes.light} />
      )}

      {!condensed && (
        <XStack
          bg="$background"
          pointerEvents="none"
          py="$1"
          px="$2"
          justify="space-between"
          items="center"
        >
          <XStack items="center" gap="$1">
            <ArrowLeft opacity={0.33} size={12} />
            <Paragraph size="$1">Background</Paragraph>
          </XStack>

          {schemes.light && schemes.dark && (
            <XStack
              position="absolute"
              l="25%"
              r="25%"
              items="center"
              gap="$4"
              justify="center"
            >
              <XStack y={0} items="center" gap="$1">
                <ArrowUp opacity={0.33} size={12} />
                <Paragraph size="$1">Light</Paragraph>
              </XStack>
              <XStack y={0} items="center" gap="$1">
                <Paragraph size="$1">Dark</Paragraph>
                <ArrowDown opacity={0.33} size={12} />
              </XStack>
            </XStack>
          )}

          <XStack items="center" gap="$1">
            <Paragraph size="$1">Foreground</Paragraph>
            <ArrowRight opacity={0.33} size={12} />
          </XStack>
        </XStack>
      )}

      {schemes.dark && (
        <StudioPaletteBar showLabelIndices={!condensed} colors={palettes.dark} />
      )}
    </YStack>
  )
}
