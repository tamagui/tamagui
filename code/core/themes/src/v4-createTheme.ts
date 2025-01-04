import { createThemeBuilder } from '@tamagui/theme-builder'
import { parseToHsla } from 'color2k'
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

type Colors = string[]
type ColorsByScheme = { light: Colors; dark: Colors }
type ColorDefs = Colors | ColorsByScheme

export function createThemes<
  ComponentThemes extends SimpleThemeDefinitions,
  SubThemes extends Record<string, ColorDefs>,
>({
  base,
  accent,
  subThemes,
  componentThemes = defaultComponentThemes as unknown as any,
}: {
  base: ColorDefs
  accent: ColorDefs
  subThemes?: SubThemes
  componentThemes?: ComponentThemes
  colorsToTheme?: (props: {
    colors: string[]
    name: string
    scheme?: 'light' | 'dark'
  }) => Record<string, string>
}) {
  return buildThemes({
    componentThemes,
    palettes: createPalettes(getBuildPalettes(colors)),
  })
}

function getColorsByScheme(colors: Colors): ColorsByScheme {
  return {
    light: colors,
    dark: colors.toReversed(),
  }
}

function getAnchors(colorsByScheme: ColorsByScheme) {
  return colorsByScheme.light.map((lcolor, index) => {
    const dcolor = colorsByScheme.dark[index]
    const [lhue, lsat, llum] = parseToHsla(lcolor)
    const [dhue, dsat, dlum] = parseToHsla(dcolor)
    return {
      index,
      hue: { light: lhue, dark: dhue },
      sat: { light: lsat, dark: dsat },
      lum: { light: llum, dark: dlum },
    } as const
  })
}

function getBuildPalettes(colors: CreateThemeColors): BuildPalettes {
  const base = Array.isArray(colors.base) ? getColorsByScheme(colors.base) : colors.base
  const accent = Array.isArray(colors.accent)
    ? getColorsByScheme(colors.accent)
    : colors.accent

  return {
    base: {
      name: 'base',
      anchors: getAnchors(base),
    },
    ...(accent && {
      accent: {
        name: 'accent',
        anchors: getAnchors(accent),
      },
    }),
  }
}

// allows more detailed configuration, used by studio
// eventually we should merge this down into simple and have it handle what we need
export function createThemesFromStudio(props: BuildThemeSuiteProps) {
  const palettes = createPalettes(props.palettes)
  return buildThemes({
    palettes,
    templates: props.templates,
    componentThemes: defaultComponentThemes,
  })
}

const defaultPalettes: SimplePaletteDefinitions = createPalettes(
  getBuildPalettes({
    base: ['#fff', '#000'],
    accent: ['darkred', 'lightred'],
  })
)

// a simpler API surface
export function buildThemes<
  Templates extends BuildTemplates,
  Palettes extends SimplePaletteDefinitions,
  ComponentThemes extends SimpleThemeDefinitions<
    keyof Templates extends string ? keyof Templates : string
  >,
>({
  templates = defaultTemplates as unknown as Templates,
  palettes = defaultPalettes as unknown as Palettes,
  componentThemes = templates === (defaultTemplates as any)
    ? (defaultComponentThemes as unknown as ComponentThemes)
    : undefined,
}: {
  palettes?: Palettes
  templates?: Templates
  componentThemes?: ComponentThemes
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

export function createPalettes(palettes: BuildPalettes): SimplePaletteDefinitions {
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

  return next as any
}
