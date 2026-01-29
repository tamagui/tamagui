import { memo } from 'react'
import { YStack, XStack, H4, Paragraph, Button } from 'tamagui'
import { useThemeBuilderStore } from '../../store/ThemeBuilderStore'
import { ColorThemeIndicator } from '../../views/ColorThemeIndicator'

export const ThemeBuilderPalettesPane = memo(() => {
  const store = useThemeBuilderStore()
  const palettes = Object.entries(store.palettes)

  return (
    <YStack flex={1} gap="$4" p="$4">
      <YStack gap="$2">
        <H4>Color Palettes</H4>
        <Paragraph color="$color10" size="$3">
          These are the available color palettes for your themes
        </Paragraph>
      </YStack>

      <YStack gap="$3" flex={1}>
        {palettes.map(([name, palette]) => (
          <XStack
            key={name}
            items="center"
            gap="$3"
            p="$3"
            rounded="$4"
            borderWidth={1}
            borderColor="$color5"
            hoverStyle={{
              borderColor: '$color7',
              bg: '$color2',
            }}
          >
            <ColorThemeIndicator size={40} primary={palette} />
            <YStack flex={1}>
              <Paragraph fontWeight="600">{name}</Paragraph>
              <Paragraph size="$2" color="$color10">
                {palette.anchors.length} anchor points
              </Paragraph>
            </YStack>
          </XStack>
        ))}

        {palettes.length === 0 && (
          <YStack flex={1} items="center" justify="center" gap="$4">
            <Paragraph color="$color10">No palettes defined yet</Paragraph>
            <Button theme="accent" size="$3">
              Add Palette
            </Button>
          </YStack>
        )}
      </YStack>
    </YStack>
  )
})

ThemeBuilderPalettesPane.displayName = 'ThemeBuilderPalettesPane'
