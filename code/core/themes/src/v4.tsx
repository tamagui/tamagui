import { createThemeBuilder } from '@tamagui/theme-builder'
import { getThemeSuitePalettes } from './getThemeSuitePalettes'
import type { BuildPalettes, BuildThemeSuiteProps } from './types'
import { defaultTemplates } from './v4-defaultTemplates'

export { defaultTemplates } from './v4-defaultTemplates'
export type * from './types'
export { getThemeSuitePalettes, PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes'

export function createThemes({
  templates = defaultTemplates,
  palettes: palettesIn = defaultPalettes,
}: {
  palettes?: BuildThemeSuiteProps['palettes']
  templates?: BuildThemeSuiteProps['templates']
}) {
  const finalPalettes = createPalettes(palettesIn)

  const { base, ...subTemplates } = templates

  const subThemes = Object.fromEntries(
    Object.keys(subTemplates).map((key) => {
      return [
        key,
        {
          template: key,
        },
      ]
    })
  )

  // start theme-builder
  const themeBuilder = createThemeBuilder()
    .addPalettes(finalPalettes)
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
      finalPalettes.light_accent
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
    .addChildThemes(subThemes)
    .addChildThemes(defaultComponentThemes, {
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

// export const defaultComponentThemes = {
//   ListItem: {
//     template: 'surface1',
//   },
//   SelectTrigger: surface1,
//   Card: surface1,
//   Button: surface3,
//   Checkbox: surface2,
//   Switch: surface2,
//   SwitchThumb: inverseSurface1,
//   TooltipContent: surface2,
//   Progress: {
//     template: 'surface1',
//   },
//   RadioGroupItem: surface2,
//   TooltipArrow: {
//     template: 'surface1',
//   },
//   SliderTrackActive: {
//     template: 'surface3',
//   },
//   SliderTrack: {
//     template: 'surface1',
//   },
//   SliderThumb: inverseSurface1,
//   Tooltip: inverseSurface1,
//   ProgressIndicator: inverseSurface1,
//   SheetOverlay: overlayThemeDefinitions,
//   DialogOverlay: overlayThemeDefinitions,
//   ModalOverlay: overlayThemeDefinitions,
//   Input: surface1,
//   TextArea: surface1,
// } as const

const palettes2 = {
  base: {
    light: ['#000', '#fff'],
    dark: ['#fff', '#000'],
  },
  accent: {
    light: ['#000', '#fff'],
    dark: ['#fff', '#000'],
  },
}

const defaultPalettes = {
  base: {
    name: 'base',
    anchors: [
      {
        index: 0,
        hue: {
          sync: true,
          light: 146,
          dark: 146,
        },
        sat: {
          sync: true,
          light: 0.2,
          dark: 0.2,
        },
        lum: {
          light: 0.9901960784313726,
          dark: 0.1,
        },
      },
      {
        index: 9,
        hue: {
          syncLeft: true,
          sync: true,
          light: 146,
          dark: 146,
        },
        sat: {
          syncLeft: true,
          sync: true,
          light: 0.2,
          dark: 0.2,
        },
        lum: {
          light: 0.5,
          dark: 0.5,
        },
      },
      {
        index: 10,
        hue: {
          sync: true,
          light: 0,
          dark: 0,
        },
        sat: {
          sync: true,
          light: 0.15,
          dark: 0.15,
        },
        lum: {
          light: 0.15,
          dark: 0.925,
        },
      },
      {
        index: 11,
        hue: {
          syncLeft: true,
          sync: true,
          light: 0,
          dark: 0,
        },
        sat: {
          syncLeft: true,
          sync: true,
          light: 0.15,
          dark: 0.15,
        },
        lum: {
          light: 0.1,
          dark: 0.95,
        },
      },
    ],
  },
  accent: {
    name: 'accent',
    anchors: [
      {
        index: 0,
        hue: {
          sync: true,
          light: 250,
          dark: 250,
        },
        sat: {
          sync: true,
          light: 0.5,
          dark: 0.5,
        },
        lum: {
          light: 0.4,
          dark: 0.35,
        },
      },
      {
        index: 9,
        hue: {
          syncLeft: true,
          sync: true,
          light: 250,
          dark: 250,
        },
        sat: {
          syncLeft: true,
          sync: true,
          light: 0.5,
          dark: 0.5,
        },
        lum: {
          light: 0.65,
          dark: 0.6,
        },
      },
      {
        index: 10,
        hue: {
          sync: true,
          light: 250,
          dark: 250,
        },
        sat: {
          sync: true,
          light: 0.5,
          dark: 0.5,
        },
        lum: {
          light: 0.95,
          dark: 0.9,
        },
      },
      {
        index: 11,
        hue: {
          syncLeft: true,
          sync: true,
          light: 250,
          dark: 250,
        },
        sat: {
          syncLeft: true,
          sync: true,
          light: 0.5,
          dark: 0.5,
        },
        lum: {
          light: 0.95,
          dark: 0.95,
        },
      },
    ],
  },
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
