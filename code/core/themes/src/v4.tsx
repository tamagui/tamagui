import { createThemeBuilder } from '@tamagui/theme-builder'
import { defaultPalettes, defaultSubThemes } from '@tamagui/themes/v3-themes'
import { getThemeSuitePalettes } from './getThemeSuitePalettes'
import type { BuildPalettes, BuildThemeSuiteProps } from './types'

export type * from './types'
export { getThemeSuitePalettes, PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes'

export function createThemes(props: BuildThemeSuiteProps) {
  const { templates, componentThemes } = props
  const palettes = createPalettes(props.palettes)

  if (palettes.light.length !== defaultPalettes.light.length) {
    console.error({ palettes, defaultPalettes })
    throw new Error(`Error - generated palette doesn't match length`)
  }

  // start theme-builder
  const themeBuilder = createThemeBuilder()
    .addPalettes(palettes)
    .addTemplates(templates)
    .addThemes({
      light: {
        template: 'base',
        palette: 'light',
      },
      dark: {
        template: 'base',
        palette: 'dark',
      },
    })
    .addChildThemes(
      palettes.light_accent
        ? {
            accent: [
              {
                parent: 'light',
                template: 'base',
                palette: 'light_accent',
              },
              {
                parent: 'dark',
                template: 'base',
                palette: 'dark_accent',
              },
            ],
          }
        : {}
    )
    .addChildThemes(defaultSubThemes)
    .addChildThemes(componentThemes, {
      avoidNestingWithin: [
        'alt1',
        'alt2',
        'surface1',
        'surface2',
        'surface3',
        'surface4',
        'active',
      ],
    })

  const themes = themeBuilder.build()

  return {
    themes,
    themeBuilder,
  }
}

export function createPalettes(palettes: BuildPalettes) {
  const accentPalettes = palettes.accent ? getThemeSuitePalettes(palettes.accent) : null
  const basePalettes = getThemeSuitePalettes(palettes.base)

  const next = Object.fromEntries(
    Object.entries(palettes).flatMap(([name, palette]) => {
      const palettes = getThemeSuitePalettes(palette)
      const isAccent = name.startsWith('accent')
      const oppositePalettes = isAccent ? basePalettes : accentPalettes
      const oppositeLight = oppositePalettes!.light
      const oppositeDark = oppositePalettes!.dark

      const bgOffset = 7

      return [
        [
          name === 'base' ? 'light' : `light_${name}`,
          [
            oppositeLight[bgOffset],
            ...palettes.light,
            oppositeLight[oppositeLight.length - bgOffset - 1],
          ],
        ],
        [
          name === 'base' ? 'dark' : `dark_${name}`,
          [
            oppositeDark[oppositeDark.length - bgOffset - 1],
            ...palettes.dark,
            oppositeDark[bgOffset],
          ],
        ],
      ] as const
    })
  )

  return next as any as Record<string, string[]>
}
