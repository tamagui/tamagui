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
  Accent = void,
  Extra extends ExtraThemeValuesByScheme = ExtraThemeValuesByScheme,
  ChildrenThemes extends SimpleThemesDefinition = SimpleThemesDefinition,
  GrandChildrenThemes extends SimpleThemesDefinition = SimpleThemesDefinition,
  ComponentThemes extends SimpleThemesDefinition = SimpleThemesDefinition,
  Templates extends BuildTemplates = typeof defaultTemplates,
> = {
  base: BaseThemeDefinition<Extra>
  accent?: Accent
  childrenThemes?: ChildrenThemes
  grandChildrenThemes?: GrandChildrenThemes
  templates?: Templates
  componentThemes?: ComponentThemes
  colorsToTheme?: (props: {
    colors: string[]
    name: string
    scheme?: 'light' | 'dark'
  }) => Record<string, string>
}

export function createThemeSuite<
  Extra extends ExtraThemeValuesByScheme,
  SubThemes extends SimpleThemesDefinition,
  ComponentThemes extends SimpleThemesDefinition,
  Accent = void,
>(props: CreateThemesProps<Accent, Extra, SubThemes, ComponentThemes>) {
  const {
    accent,
    childrenThemes,
    grandChildrenThemes,
    templates = defaultTemplates,
    componentThemes = defaultComponentThemes as unknown as any,
  } = props

  const builder = createSimpleThemeBuilder({
    extra: props.base.extra,
    componentThemes,
    palettes: createPalettes(getThemesPalettes(props)),
    templates: templates as typeof defaultTemplates,
    accentTheme: !!accent as Accent extends void ? false : true,
    childrenThemes: normalizeSubThemes(childrenThemes),
    grandChildrenThemes: normalizeSubThemes(grandChildrenThemes),
  })

  return builder.themes
}

function normalizeSubThemes<A extends SimpleThemesDefinition>(defs?: A) {
  return Object.fromEntries(
    Object.entries(defs || {}).map(([name, value]) => {
      return [
        name,
        {
          palette: name,
          template: value.template || 'base',
        },
      ]
    })
  ) as Record<keyof A, any>
}

type NamesWithChildrenNames<ParentNames extends string, ChildNames> =
  | ParentNames
  | (ChildNames extends string ? `${ParentNames}_${ChildNames}` : never)

// a simpler API surface
export function createSimpleThemeBuilder<
  Extra extends ExtraThemeValuesByScheme,
  Templates extends BuildTemplates,
  Palettes extends SimplePaletteDefinitions,
  ChildrenThemes extends Record<
    string,
    {
      template: keyof Templates extends string ? keyof Templates : never
      palette?: string
    }
  >,
  GrandChildrenThemes extends Record<
    string,
    {
      template: keyof Templates extends string ? keyof Templates : never
      palette?: string
    }
  >,
  HasAccent extends boolean,
  ComponentThemes extends SimpleThemesDefinition,
  FullTheme = {
    [ThemeKey in keyof Templates['light_base'] | keyof Extra['dark']]: string
  },
>(props: {
  palettes?: Palettes
  accentTheme?: HasAccent
  templates?: Templates
  childrenThemes?: ChildrenThemes
  grandChildrenThemes?: GrandChildrenThemes
  componentThemes?: ComponentThemes
  extra?: Extra
}): {
  themeBuilder: ThemeBuilder<any>
  themes: {
    [Key in
      | 'light'
      | 'dark'
      | (HasAccent extends true ? 'light_accent' | 'dark_accent' : never)
      | (keyof ChildrenThemes extends string
          ? `${'light' | 'dark'}_${HasAccent extends true ? `accent_` | '' : ''}${NamesWithChildrenNames<keyof ChildrenThemes, keyof GrandChildrenThemes>}`
          : never)]: FullTheme
  }
} {
  const {
    extra,
    childrenThemes = null as unknown as ChildrenThemes,
    grandChildrenThemes = null as unknown as GrandChildrenThemes,
    templates = defaultTemplates as unknown as Templates,
    palettes = defaultPalettes as unknown as Palettes,
    componentThemes = templates === (defaultTemplates as any)
      ? (defaultComponentThemes as unknown as ComponentThemes)
      : undefined,
  } = props

  // start theme-builder
  let themeBuilder = createThemeBuilder()
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

  if (childrenThemes) {
    themeBuilder = themeBuilder.addChildThemes(childrenThemes, {
      avoidNestingWithin: ['accent'],
    }) as any
  }

  if (grandChildrenThemes) {
    themeBuilder = themeBuilder.addChildThemes(grandChildrenThemes, {
      avoidNestingWithin: ['accent'],
    }) as any
  }

  if (componentThemes) {
    themeBuilder = themeBuilder.addComponentThemes(getComponentThemes(componentThemes), {
      // avoidNestingWithin: [
      //   ...Object.keys(childrenThemes || {}),
      //   ...Object.keys(grandChildrenThemes || {}),
      // ],
    })
  }

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

function getAnchors(palette: SchemePalette) {
  const maxIndex = 11
  const numItems = palette.light.length

  const anchors = palette.light.map((lcolor, index) => {
    const dcolor = palette.dark[index]
    const [lhue, lsat, llum] = parseToHsla(lcolor)
    const [dhue, dsat, dlum] = parseToHsla(dcolor)
    return {
      index: spreadIndex(maxIndex, numItems, index),
      hue: { light: lhue, dark: dhue },
      sat: { light: lsat, dark: dsat },
      lum: { light: llum, dark: dlum },
    } as const
  })

  return anchors
}

function spreadIndex(maxIndex: number, numItems: number, index: number) {
  return Math.round((index / (numItems - 1)) * maxIndex)
}

function coerceSimplePaletteToSchemePalette(def: Palette) {
  return Array.isArray(def) ? getSchemePalette(def) : def
}

function getThemesPalettes(props: CreateThemesProps<any>): BuildPalettes {
  const base = coerceSimplePaletteToSchemePalette(props.base.palette)
  const accent = props.accent
    ? coerceSimplePaletteToSchemePalette(props.accent.palette)
    : null

  const baseAnchors = getAnchors(base)

  function getSubThemesPalettes(defs: SimpleThemesDefinition) {
    return Object.fromEntries(
      Object.entries(defs).map(([key, value]) => {
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
    )
  }

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
    ...(props.childrenThemes && getSubThemesPalettes(props.childrenThemes)),
    ...(props.grandChildrenThemes && getSubThemesPalettes(props.grandChildrenThemes)),
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

      const out = [
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

      console.log(name, palette, out)

      return out
    })
  )

  return next as any
}
