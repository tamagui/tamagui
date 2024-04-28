import { memo } from 'react'
import { YStack } from 'tamagui'

import { useThemeBuilderStore } from '../../ThemeBuilderStore'
import { BuildThemeItemFrame } from './BuildThemeItemFrame'
import { PaletteView } from './PaletteView'

export const ThemeBuilderPalettesPane = memo(() => {
  const store = useThemeBuilderStore()

  return (
    <YStack gap="$3" py="$3" px="$2">
      {Object.entries(store.palettes).map(([name, palette]) => {
        return (
          <BuildThemeItemFrame
            key={name}
            label={name}
            {...(name !== 'base' && {
              onDelete: () => {
                store.deletePalette(name)
              },
            })}
          >
            <PaletteView
              onUpdate={(next) => {
                store.updatePalette(name, next)
              }}
              palette={palette}
            />
          </BuildThemeItemFrame>
        )
      })}
    </YStack>
  )
})
