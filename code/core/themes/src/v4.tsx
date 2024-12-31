import { createThemeBuilder } from '@tamagui/theme-builder'
import { getThemeSuitePalettes } from './getThemeSuitePalettes'
import type { BuildPalettes, BuildTemplates, BuildThemeSuiteProps } from './types'
import { defaultTemplates } from './v4-defaultTemplates'

export { getThemeSuitePalettes, PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes'
export type * from './types'
export { defaultTemplates } from './v4-defaultTemplates'

type SimpleThemeDefinitions<TemplateName extends string = string> = {
  [ComponentName: string]: TemplateName
}

type SimplePaletteDefinitions = Record<string, string[]>

// allows more detailed configuration, used by studio
export function createThemesComplex(props: BuildThemeSuiteProps) {
  const palettes = createPalettes(props.palettes)
  return createThemes({
    palettes,
    templates: props.templates,
    componentThemes: defaultComponentThemes,
  })
}

// a simpler API surface
export function createThemes<
  Templates extends BuildTemplates,
  Palettes extends SimplePaletteDefinitions,
>({
  templates = defaultTemplates as unknown as Templates,
  palettes = defaultPalettes as unknown as Palettes,
  componentThemes = templates === (defaultTemplates as any)
    ? defaultComponentThemes
    : undefined,
}: {
  palettes?: Palettes
  templates?: Templates
  componentThemes?: SimpleThemeDefinitions<
    keyof Templates extends string ? keyof Templates : string
  >
}) {
  const { base, ...subTemplates } = templates
  const subTemplateNames = Object.keys(subTemplates)

  const subThemes = Object.fromEntries(
    subTemplateNames.map((key) => {
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
    .addChildThemes(subThemes)
    .addChildThemes(componentThemes ? getComponentThemes(componentThemes) : {}, {
      avoidNestingWithin: subTemplateNames,
    })

  const themes = themeBuilder.build()

  return {
    themes,
    themeBuilder,
  }
}

export const getComponentThemes = (components: SimpleThemeDefinitions) => {
  return Object.fromEntries(
    Object.entries(components).map(([componentName, templateName]) => {
      return [
        componentName,
        {
          parent: '',
          template: templateName,
        },
      ]
    })
  )
}

export const defaultComponentThemes = {
  ListItem: 'surface1',
  SelectTrigger: 'surface1',
  Card: 'surface1',
  Button: 'surface3',
  Checkbox: 'surface2',
  Switch: 'surface2',
  SwitchThumb: 'inverseSurface1',
  TooltipContent: 'surface2',
  Progress: 'surface1',
  RadioGroupItem: 'surface2',
  TooltipArrow: 'surface1',
  SliderTrackActive: 'surface3',
  SliderTrack: 'surface1',
  SliderThumb: 'inverseSurface1',
  Tooltip: 'inverseSurface1',
  ProgressIndicator: 'inverseSurface1',
  Input: 'surface1',
  TextArea: 'surface1',
} as const

const defaultPalettes = {
  light: [
    'hsla(250, 50%, 48%, 1)',
    'hsla(0, 0%, 99%, 0)',
    'hsla(0, 0%, 99%, 0.25)',
    'hsla(0, 0%, 99%, 0.5)',
    'hsla(0, 0%, 99%, 0.75)',
    'hsla(0, 0%, 99%, 1)',
    'hsla(0, 0%, 93%, 1)',
    'hsla(0, 0%, 88%, 1)',
    'hsla(0, 0%, 82%, 1)',
    'hsla(0, 0%, 77%, 1)',
    'hsla(0, 0%, 72%, 1)',
    'hsla(0, 0%, 66%, 1)',
    'hsla(0, 0%, 61%, 1)',
    'hsla(0, 0%, 55%, 1)',
    'hsla(0, 0%, 50%, 1)',
    'hsla(0, 15%, 15%, 1)',
    'hsla(0, 15%, 10%, 1)',
    'hsla(0, 14%, 10%, 0.75)',
    'hsla(0, 14%, 10%, 0.5)',
    'hsla(0, 14%, 10%, 0.25)',
    'hsla(0, 14%, 10%, 0)',
    'hsla(250, 50%, 62%, 1)',
  ],
  dark: [
    'hsla(250, 50%, 57%, 1)',
    'hsla(0, 0%, 10%, 0)',
    'hsla(0, 0%, 10%, 0.25)',
    'hsla(0, 0%, 10%, 0.5)',
    'hsla(0, 0%, 10%, 0.75)',
    'hsla(0, 0%, 10%, 1)',
    'hsla(0, 0%, 14%, 1)',
    'hsla(0, 0%, 19%, 1)',
    'hsla(0, 0%, 23%, 1)',
    'hsla(0, 0%, 28%, 1)',
    'hsla(0, 0%, 32%, 1)',
    'hsla(0, 0%, 37%, 1)',
    'hsla(0, 0%, 41%, 1)',
    'hsla(0, 0%, 46%, 1)',
    'hsla(0, 0%, 50%, 1)',
    'hsla(0, 15%, 93%, 1)',
    'hsla(0, 15%, 95%, 1)',
    'hsla(0, 15%, 95%, 0.75)',
    'hsla(0, 15%, 95%, 0.5)',
    'hsla(0, 15%, 95%, 0.25)',
    'hsla(0, 15%, 95%, 0)',
    'hsla(250, 50%, 43%, 1)',
  ],
  light_accent: [
    'hsla(0, 0%, 82%, 1)',
    'hsla(250, 50%, 40%, 0)',
    'hsla(250, 50%, 40%, 0.25)',
    'hsla(250, 50%, 40%, 0.5)',
    'hsla(250, 50%, 40%, 0.75)',
    'hsla(250, 50%, 40%, 1)',
    'hsla(250, 50%, 43%, 1)',
    'hsla(250, 50%, 46%, 1)',
    'hsla(250, 50%, 48%, 1)',
    'hsla(250, 50%, 51%, 1)',
    'hsla(250, 50%, 54%, 1)',
    'hsla(250, 50%, 57%, 1)',
    'hsla(250, 50%, 59%, 1)',
    'hsla(250, 50%, 62%, 1)',
    'hsla(250, 50%, 65%, 1)',
    'hsla(250, 50%, 95%, 1)',
    'hsla(250, 50%, 95%, 1)',
    'hsla(249, 52%, 95%, 0.75)',
    'hsla(249, 52%, 95%, 0.5)',
    'hsla(249, 52%, 95%, 0.25)',
    'hsla(249, 52%, 95%, 0)',
    'hsla(0, 0%, 55%, 1)',
  ],
  dark_accent: [
    'hsla(0, 0%, 46%, 1)',
    'hsla(250, 50%, 35%, 0)',
    'hsla(250, 50%, 35%, 0.25)',
    'hsla(250, 50%, 35%, 0.5)',
    'hsla(250, 50%, 35%, 0.75)',
    'hsla(250, 50%, 35%, 1)',
    'hsla(250, 50%, 38%, 1)',
    'hsla(250, 50%, 41%, 1)',
    'hsla(250, 50%, 43%, 1)',
    'hsla(250, 50%, 46%, 1)',
    'hsla(250, 50%, 49%, 1)',
    'hsla(250, 50%, 52%, 1)',
    'hsla(250, 50%, 54%, 1)',
    'hsla(250, 50%, 57%, 1)',
    'hsla(250, 50%, 60%, 1)',
    'hsla(250, 50%, 90%, 1)',
    'hsla(250, 50%, 95%, 1)',
    'hsla(249, 52%, 95%, 0.75)',
    'hsla(249, 52%, 95%, 0.5)',
    'hsla(249, 52%, 95%, 0.25)',
    'hsla(249, 52%, 95%, 0)',
    'hsla(0, 0%, 23%, 1)',
  ],
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
