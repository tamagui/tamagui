import { createThemeBuilder, type ThemeBuilder } from '@tamagui/theme-builder'
import { parseToHsla } from 'color2k'
import { getThemeSuitePalettes } from './getThemeSuitePalettes'
import type { BuildPalettes, BuildTemplates, BuildThemeSuiteProps } from './types'
import { defaultTemplates } from './v4-defaultTemplates'

export { getThemeSuitePalettes, PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes'
export type * from './types'
export { defaultTemplates } from './v4-defaultTemplates'

type ExtraThemeValues = Record<string, string>
type ExtraThemeValuesByScheme<Values extends ExtraThemeValues = ExtraThemeValues> = {
  dark: Values
  light: Values
}

type SimpleThemeDefinition = { palette?: Palette; template?: string }
type BaseThemeDefinition<Extra extends ExtraThemeValuesByScheme> = {
  palette: Palette
  template?: string
  extra?: Extra
}

type SimpleThemesDefinition = Record<string, SimpleThemeDefinition>
type SimplePaletteDefinitions = Record<string, string[]>

type SinglePalette = string[]
type SchemePalette = { light: SinglePalette; dark: SinglePalette }
type Palette = SinglePalette | SchemePalette

const defaultPalettes: SimplePaletteDefinitions = createPalettes(
  getThemesPalettes({
    base: {
      palette: ['#fff', '#000'],
    },
    accent: {
      palette: ['#ff0000', '#ff9999'],
    },
  })
)

export type CreateThemesProps<
  Extra extends ExtraThemeValuesByScheme = ExtraThemeValuesByScheme,
  SubThemes extends SimpleThemesDefinition = SimpleThemesDefinition,
  ComponentThemes extends SimpleThemesDefinition = SimpleThemesDefinition,
  Templates extends BuildTemplates = typeof defaultTemplates,
> = {
  base: BaseThemeDefinition<Extra>
  accent: BaseThemeDefinition<Extra>
  subThemes?: SubThemes
  templates?: Templates
  componentThemes?: ComponentThemes
  colorsToTheme?: (props: {
    colors: string[]
    name: string
    scheme?: 'light' | 'dark'
  }) => Record<string, string>
}

export function createThemesWithSubThemes<
  Extra extends ExtraThemeValuesByScheme,
  SubThemes extends SimpleThemesDefinition,
  ComponentThemes extends SimpleThemesDefinition,
>(props: CreateThemesProps<Extra, SubThemes, ComponentThemes>) {
  const {
    subThemes,
    templates = defaultTemplates,
    componentThemes = defaultComponentThemes as unknown as any,
  } = props

  console.log('go', getThemesPalettes(props), createPalettes(getThemesPalettes(props)))

  const builder = createSimpleThemeBuilder({
    extra: props.base.extra,
    componentThemes,
    palettes: createPalettes(getThemesPalettes(props)),
    templates: templates as typeof defaultTemplates,
    subThemes: Object.fromEntries(
      Object.entries(subThemes || {}).map(([name, value]) => {
        return [
          name,
          {
            palette: name,
            template: value.template || 'base',
          },
        ]
      })
    ) as Record<keyof SubThemes, any>,
  })

  return builder.themes
}

// a simpler API surface
export function createSimpleThemeBuilder<
  Extra extends ExtraThemeValuesByScheme,
  Templates extends BuildTemplates,
  Palettes extends SimplePaletteDefinitions,
  SubThemes extends Record<
    string,
    {
      template: keyof Templates extends string ? keyof Templates : never
      palette?: string
    }
  >,
  ComponentThemes extends SimpleThemesDefinition,
>(props: {
  palettes?: Palettes
  templates?: Templates
  subThemes?: SubThemes
  componentThemes?: ComponentThemes
  extra?: Extra
}): {
  themeBuilder: ThemeBuilder<any>
  themes: {
    [Key in
      | 'light'
      | 'dark'
      | (keyof SubThemes extends string
          ? `${'light' | 'dark'}_${keyof SubThemes}`
          : never)]: {
      [ThemeKey in keyof Templates['light_base'] | keyof Extra['dark']]: string
    }
  }
} {
  const {
    extra,
    subThemes = {} as unknown as SubThemes,
    templates = defaultTemplates as unknown as Templates,
    palettes = defaultPalettes as unknown as Palettes,
    componentThemes = templates === (defaultTemplates as any)
      ? (defaultComponentThemes as unknown as ComponentThemes)
      : undefined,
  } = props

  // start theme-builder
  const themeBuilder = createThemeBuilder()
    .addPalettes(palettes)
    .addTemplates(templates)
    .addThemes({
      light: {
        template: 'base',
        palette: 'light',
        nonInheritedValues: extra?.light,
      },
      dark: {
        template: 'base',
        palette: 'dark',
        nonInheritedValues: extra?.dark,
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
    .addChildThemes(subThemes, {
      avoidNestingWithin: ['accent'],
    })
    .addComponentThemes(componentThemes ? getComponentThemes(componentThemes) : {}, {
      avoidNestingWithin: Object.keys(subThemes),
    })

  return {
    themeBuilder,
    themes: themeBuilder.build() as any,
  }
}

// for studio
// allows more detailed configuration, used by studio
// eventually we should merge this down into simple and have it handle what we need
export function createThemes(props: BuildThemeSuiteProps) {
  const palettes = createPalettes(props.palettes)
  return createSimpleThemeBuilder({
    palettes,
    templates: props.templates,
    componentThemes: defaultComponentThemes,
  })
}

function getSchemePalette(colors: SinglePalette): SchemePalette {
  return {
    light: colors,
    dark: colors.toReversed(),
  }
}

function getAnchors(Schemepalette: SchemePalette) {
  return Schemepalette.light.map((lcolor, index) => {
    const dcolor = Schemepalette.dark[index]
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

function coerceSimplePaletteToSchemePalette(def: Palette) {
  return Array.isArray(def) ? getSchemePalette(def) : def
}

function getThemesPalettes(props: CreateThemesProps): BuildPalettes {
  const base = coerceSimplePaletteToSchemePalette(props.base.palette)
  const accent = coerceSimplePaletteToSchemePalette(props.accent.palette)

  const baseAnchors = getAnchors(base)

  return {
    base: {
      name: 'base',
      anchors: baseAnchors,
    },
    ...(accent && {
      accent: {
        name: 'accent',
        anchors: getAnchors(accent),
      },
    }),
    ...(props.subThemes &&
      Object.fromEntries(
        Object.entries(props.subThemes).map(([key, value]) => {
          return [
            key,
            {
              name: key,
              anchors: value.palette
                ? getAnchors(coerceSimplePaletteToSchemePalette(value.palette))
                : baseAnchors,
            },
          ]
        })
      )),
  }
}

export const getComponentThemes = (components: SimpleThemesDefinition) => {
  return Object.fromEntries(
    Object.entries(components).map(([componentName, { template }]) => {
      return [
        componentName,
        {
          parent: '',
          template: template || 'base',
        },
      ]
    })
  )
}

export const defaultComponentThemes = {
  ListItem: { template: 'surface1' },
  SelectTrigger: { template: 'surface1' },
  Card: { template: 'surface1' },
  Button: { template: 'surface3' },
  Checkbox: { template: 'surface2' },
  Switch: { template: 'surface2' },
  SwitchThumb: { template: 'inverse' },
  TooltipContent: { template: 'surface2' },
  Progress: { template: 'surface1' },
  RadioGroupItem: { template: 'surface2' },
  TooltipArrow: { template: 'surface1' },
  SliderTrackActive: { template: 'surface3' },
  SliderTrack: { template: 'surface1' },
  SliderThumb: { template: 'inverse' },
  Tooltip: { template: 'inverse' },
  ProgressIndicator: { template: 'inverse' },
  Input: { template: 'surface1' },
  TextArea: { template: 'surface1' },
} satisfies SimpleThemesDefinition

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
