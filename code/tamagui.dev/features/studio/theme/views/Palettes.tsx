import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from '@tamagui/lucide-icons'
import { Paragraph, Theme, XStack, YStack } from 'tamagui'
import { getThemeSuitePalettes } from '@tamagui/theme-builder'
import { StudioPaletteBar } from '../../StudioPaletteBar'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import type { BuildPalette } from '~/features/studio/theme/types'

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
    <YStack br="$4" ov="hidden" bc="$color8" bw={0.5} elevation="$1">
      {schemes.light && (
        <StudioPaletteBar showLabelIndices={!condensed} colors={palettes.light} />
      )}

      {!condensed && (
        <Theme name="alt1">
          <XStack
            bg="$background"
            pe="none"
            py="$1"
            px="$2"
            jc="space-between"
            ai="center"
          >
            <XStack ai="center" space="$1">
              <ArrowLeft opacity={0.33} size={12} />
              <Paragraph size="$1">Background</Paragraph>
            </XStack>

            {schemes.light && schemes.dark && (
              <XStack pos="absolute" l="25%" r="25%" ai="center" space jc="center">
                <XStack y={0} ai="center" space="$1">
                  <ArrowUp opacity={0.33} size={12} />
                  <Paragraph size="$1">Light</Paragraph>
                </XStack>
                <XStack y={0} ai="center" space="$1">
                  <Paragraph size="$1">Dark</Paragraph>
                  <ArrowDown opacity={0.33} size={12} />
                </XStack>
              </XStack>
            )}

            <XStack ai="center" space="$1">
              <Paragraph size="$1">Foreground</Paragraph>
              <ArrowRight opacity={0.33} size={12} />
            </XStack>
          </XStack>
        </Theme>
      )}

      {schemes.dark && (
        <StudioPaletteBar showLabelIndices={!condensed} colors={palettes.dark} />
      )}
    </YStack>
  )
}
