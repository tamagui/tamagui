import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from '@tamagui/lucide-icons'
import { Paragraph, Theme, XStack, YStack } from 'tamagui'

import { StudioPaletteBar } from '../../StudioPaletteBar'
import { getThemeSuitePalettes } from '../helpers/getThemeSuitePalettes'
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
  const { selectedSchemes } = useThemeBuilderStore()

  return (
    <YStack br="$4" ov="hidden" bc="$color8" bw={0.5} elevation="$1">
      {selectedSchemes.light && (
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
            <XStack ai="center" gap="$1">
              <ArrowLeft opacity={0.33} size={12} />
              <Paragraph size="$1">Background</Paragraph>
            </XStack>

            {selectedSchemes.light && selectedSchemes.dark && (
              <XStack pos="absolute" l="25%" r="25%" ai="center" space jc="center">
                <XStack y={0} ai="center" gap="$1">
                  <ArrowUp opacity={0.33} size={12} />
                  <Paragraph size="$1">Light</Paragraph>
                </XStack>
                <XStack y={0} ai="center" gap="$1">
                  <Paragraph size="$1">Dark</Paragraph>
                  <ArrowDown opacity={0.33} size={12} />
                </XStack>
              </XStack>
            )}

            <XStack ai="center" gap="$1">
              <Paragraph size="$1">Foreground</Paragraph>
              <ArrowRight opacity={0.33} size={12} />
            </XStack>
          </XStack>
        </Theme>
      )}

      {selectedSchemes.dark && (
        <StudioPaletteBar showLabelIndices={!condensed} colors={palettes.dark} />
      )}
    </YStack>
  )
}
