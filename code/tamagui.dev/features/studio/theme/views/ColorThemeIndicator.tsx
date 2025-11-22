import { Circle, YStack, useThemeName } from 'tamagui'
import {
  type BuildPalette,
  PALETTE_BACKGROUND_OFFSET,
  getThemeSuitePalettes,
} from '@tamagui/theme-builder'

export const ColorThemeIndicator = ({
  primary,
  secondary,
  size = 15,
}: {
  primary: BuildPalette
  secondary?: BuildPalette
  size?: number
}) => {
  const isDark = useThemeName().startsWith('dark')
  const palettes = [primary, secondary]
    .filter(Boolean)
    .map(
      (x) =>
        getThemeSuitePalettes(x!)[isDark ? 'dark' : 'light'][
          PALETTE_BACKGROUND_OFFSET + 8
        ]
    )

  return (
    <YStack>
      <Circle width={size} height={size} bg={palettes[0] as any} />
      {!!palettes[1] && (
        <Circle
          position="absolute"
          b={-1}
          r={-1}
          width={8}
          height={8}
          bg={palettes[1] as any}
        />
      )}
    </YStack>
  )
}
