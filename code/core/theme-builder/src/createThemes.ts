import { parseToHsla } from 'color2k'
import type { Template } from '@tamagui/create-theme'
import { defaultComponentThemes } from './defaultComponentThemes'
import { defaultTemplates } from './defaultTemplates'
import { getThemeSuitePalettes, PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes'
import { createThemeBuilder, type ThemeBuilder } from './ThemeBuilder'
import type { BuildPalettes, BuildTemplates } from './types'

/**
 * GrandChildren theme nesting logic implementation:
 *  - IF palette is set: treat as palette theme (don't nest into accent family)
 *  - IF only template: nest into color children, but avoid base themes (light, dark)
 *    to prevent conflicts with top-level accent theme
 */

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

export type SimpleThemesDefinition = Record<string, SimpleThemeDefinition>
type SimplePaletteDefinitions = Record<string, string[]>

type SinglePalette = string[]
type SchemePalette = { light: SinglePalette; dark: SinglePalette }
type Palette = SinglePalette | SchemePalette

/** Props for getTheme callback */
export type GetThemeProps = {
  name: string
  theme: Record<string, string>
  scheme?: 'light' | 'dark'
  parentName: string
  parentNames: string[]
  level: number
  palette?: string[]
  template?: Template
}

export type CreateThemesProps<
  Accent extends BaseThemeDefinition<Extra> | undefined = undefined,
  GrandChildrenThemes extends SimpleThemesDefinition | undefined = undefined,
  Extra extends ExtraThemeValuesByScheme = ExtraThemeValuesByScheme,
  ChildrenThemes extends SimpleThemesDefinition = SimpleThemesDefinition,
  ComponentThemes extends SimpleThemesDefinition | false = SimpleThemesDefinition,
  Templates extends BuildTemplates = typeof defaultTemplates,
  GetThemeReturn extends Record<string, string | number> = Record<string, string>,
> = {
  base: BaseThemeDefinition<Extra>
  accent?: Accent
  childrenThemes?: ChildrenThemes
  grandChildrenThemes?: GrandChildrenThemes
  templates?: Templates
  componentThemes?: ComponentThemes
  getTheme?: (props: GetThemeProps) => GetThemeReturn
}

// Overload 1: With getTheme callback - infers return type
export function createThemes<
  Extra extends ExtraThemeValuesByScheme,
  SubThemes extends SimpleThemesDefinition,
  ComponentThemes extends SimpleThemesDefinition | false,
  GrandChildrenThemes extends SimpleThemesDefinition | undefined,
  Accent extends BaseThemeDefinition<Extra> | undefined,
  Templates extends BuildTemplates,
  GetThemeReturn extends Record<string, string | number>,
>(
  props: CreateThemesProps<
    Accent,
    GrandChildrenThemes,
    Extra,
    SubThemes,
    ComponentThemes,
    Templates,
    GetThemeReturn
  > & {
    getTheme: (props: GetThemeProps) => GetThemeReturn
  }
): ReturnType<
  typeof createSimpleThemeBuilder<
    Extra,
    typeof defaultTemplates,
    SimplePaletteDefinitions,
    { [K in keyof SubThemes]: { template: string; palette?: string } },
    GrandChildrenThemes extends undefined
      ? undefined
      : Record<keyof GrandChildrenThemes, any>,
    Accent extends undefined ? false : true,
    ComponentThemes,
    GetThemeReturn
  >
>['themes']

// Overload 2: Without getTheme callback - standard return type
export function createThemes<
  Extra extends ExtraThemeValuesByScheme = ExtraThemeValuesByScheme,
  SubThemes extends SimpleThemesDefinition = SimpleThemesDefinition,
  ComponentThemes extends SimpleThemesDefinition | false = SimpleThemesDefinition,
  GrandChildrenThemes extends SimpleThemesDefinition | undefined = undefined,
  Accent extends BaseThemeDefinition<Extra> | undefined = undefined,
  Templates extends BuildTemplates = typeof defaultTemplates,
>(
  props: CreateThemesProps<
    Accent,
    GrandChildrenThemes,
    Extra,
    SubThemes,
    ComponentThemes,
    Templates
  > & {
    getTheme?: undefined
  }
): ReturnType<
  typeof createSimpleThemeBuilder<
    Extra,
    typeof defaultTemplates,
    SimplePaletteDefinitions,
    { [K in keyof SubThemes]: { template: string; palette?: string } },
    GrandChildrenThemes extends undefined
      ? undefined
      : Record<keyof GrandChildrenThemes, any>,
    Accent extends undefined ? false : true,
    ComponentThemes,
    Record<string, string>
  >
>['themes']

// Implementation
export function createThemes<
  Extra extends ExtraThemeValuesByScheme = ExtraThemeValuesByScheme,
  SubThemes extends SimpleThemesDefinition = SimpleThemesDefinition,
  ComponentThemes extends SimpleThemesDefinition | false = SimpleThemesDefinition,
  GrandChildrenThemes extends SimpleThemesDefinition | undefined = undefined,
  Accent extends BaseThemeDefinition<Extra> | undefined = undefined,
  Templates extends BuildTemplates = typeof defaultTemplates,
  GetThemeReturn extends Record<string, string | number> = Record<string, string>,
>(
  props: CreateThemesProps<
    Accent,
    GrandChildrenThemes,
    Extra,
    SubThemes,
    ComponentThemes,
    Templates,
    GetThemeReturn
  >
) {
  const {
    accent,
    childrenThemes,
    grandChildrenThemes,
    templates = defaultTemplates,
    componentThemes,
    getTheme,
  } = props

  const builder = createSimpleThemeBuilder<
    Extra,
    typeof defaultTemplates,
    SimplePaletteDefinitions,
    { [K in keyof SubThemes]: { template: string; palette?: string } },
    GrandChildrenThemes extends undefined
      ? undefined
      : Record<keyof GrandChildrenThemes, any>,
    Accent extends undefined ? false : true,
    ComponentThemes,
    GetThemeReturn
  >({
    extra: props.base.extra,
    accentExtra: accent?.extra,
    componentThemes,
    palettes: createPalettes(getThemesPalettes(props as any)),
    templates: templates as typeof defaultTemplates,
    accentTheme: !!accent as Accent extends undefined ? false : true,
    childrenThemes: normalizeSubThemes(childrenThemes),
    grandChildrenThemes: (grandChildrenThemes
      ? normalizeSubThemes(grandChildrenThemes)
      : undefined) as GrandChildrenThemes extends undefined
      ? undefined
      : Record<keyof GrandChildrenThemes, any>,
    getTheme: getTheme as any,
  })

  lastBuilder = builder.themeBuilder

  return builder.themes
}

let lastBuilder: ThemeBuilder | null = null

export const getLastBuilder = () => lastBuilder

function normalizeSubThemes<A extends SimpleThemesDefinition>(defs?: A) {
  return Object.fromEntries(
    Object.entries(defs || {}).map(([name, value]) => {
      const hasPalette = value.palette !== undefined

      return [
        name,
        {
          // Only add palette if the definition has one, otherwise theme is template-only
          ...(hasPalette ? { palette: name } : {}),
          template: value.template || 'base',
        },
      ]
    })
  ) as Record<keyof A, any>
}

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
      template: string
      palette?: string
    }
  >,
  GrandChildrenThemes extends
    | undefined
    | Record<
        string,
        {
          template: string
          palette?: string
        }
      >,
  HasAccent extends boolean = false,
  ComponentThemes extends SimpleThemesDefinition | false = false,
  GetThemeReturn extends Record<string, string | number> = Record<string, string>,
  FullTheme extends Record<string, string | number> = {
    [ThemeKey in
      | keyof Templates['light_base']
      | keyof Extra['dark']
      | (HasAccent extends true
          ? `accent${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`
          : never)]: string
  },
  ThemeNames extends string =
    | 'light'
    | 'dark'
    | (HasAccent extends true ? 'light_accent' | 'dark_accent' : never)
    | (keyof ChildrenThemes extends string
        ? `${'light' | 'dark'}_${GrandChildrenThemes extends undefined
            ? keyof ChildrenThemes
            : NamesWithChildrenNames<keyof ChildrenThemes, keyof GrandChildrenThemes>}`
        : never),
>(props: {
  palettes?: Palettes
  accentTheme?: HasAccent
  templates?: Templates
  childrenThemes?: ChildrenThemes
  grandChildrenThemes?: GrandChildrenThemes
  componentThemes?: ComponentThemes
  extra?: Extra
  accentExtra?: Extra
  getTheme?: (props: GetThemeProps) => GetThemeReturn
}): {
  themeBuilder: ThemeBuilder<any>
  themes: Record<ThemeNames, FullTheme & GetThemeReturn>
} {
  const {
    getTheme,
    extra,
    accentExtra,
    childrenThemes = null as unknown as ChildrenThemes,
    grandChildrenThemes = null as unknown as GrandChildrenThemes,
    templates = defaultTemplates as unknown as Templates,
    palettes = defaultPalettes as unknown as Palettes,
    accentTheme,
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
        nonInheritedValues: {
          ...extra?.light,
          ...(accentTheme &&
            palettes.light_accent && {
              accent1: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 0],
              accent2: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 1],
              accent3: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 2],
              accent4: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 3],
              accent5: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 4],
              accent6: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 5],
              accent7: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 6],
              accent8: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 7],
              accent9: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 8],
              accent10: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 9],
              accent11: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 10],
              accent12: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 11],
            }),
        },
      },
      dark: {
        template: 'base',
        palette: 'dark',
        nonInheritedValues: {
          ...extra?.dark,
          ...(accentTheme &&
            palettes.dark_accent && {
              accent1: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 0],
              accent2: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 1],
              accent3: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 2],
              accent4: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 3],
              accent5: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 4],
              accent6: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 5],
              accent7: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 6],
              accent8: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 7],
              accent9: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 8],
              accent10: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 9],
              accent11: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 10],
              accent12: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 11],
            }),
        },
      },
    })

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

  // Add top-level accent AFTER grandChildren
  // Avoid nesting within color children (blue, red, etc.) so grandChildren accent can handle those
  if (palettes.light_accent) {
    themeBuilder = themeBuilder.addChildThemes(
      {
        accent: [
          {
            parent: 'light',
            template: 'base',
            palette: 'light_accent',
            nonInheritedValues: accentExtra?.light,
          },
          {
            parent: 'dark',
            template: 'base',
            palette: 'dark_accent',
            nonInheritedValues: accentExtra?.dark,
          },
        ],
      },
      {
        avoidNestingWithin: Object.keys(childrenThemes || {}),
      }
    ) as any
  }

  if (componentThemes) {
    themeBuilder = themeBuilder.addComponentThemes(getComponentThemes(componentThemes), {
      avoidNestingWithin: [
        // ...Object.keys(childrenThemes || {}),
        ...Object.keys(grandChildrenThemes || {}),
      ],
    })
  }

  if (getTheme) {
    themeBuilder = themeBuilder.getTheme(getTheme as any) as any
  }

  return {
    themeBuilder: themeBuilder as any,
    themes: themeBuilder.build() as any,
  }
}

function getSchemePalette(colors: SinglePalette): SchemePalette {
  return {
    light: colors,
    dark: [...colors].reverse(),
  }
}

function getAnchors(palette: SchemePalette) {
  const maxIndex = 11
  const numItems = palette.light.length

  const anchors = palette.light.map((lcolor, index) => {
    const dcolor = palette.dark[index]
    const [lhue, lsat, llum, lalpha] = parseToHsla(lcolor)
    const [dhue, dsat, dlum, dalpha] = parseToHsla(dcolor)

    return {
      index: spreadIndex(maxIndex, numItems, index),
      hue: { light: lhue, dark: dhue },
      sat: { light: lsat, dark: dsat },
      lum: { light: llum, dark: dlum },
      alpha: { light: lalpha, dark: dalpha },
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

function getThemesPalettes(props: CreateThemesProps<any, any>): BuildPalettes {
  const base = coerceSimplePaletteToSchemePalette(props.base.palette)
  const accent = props.accent
    ? coerceSimplePaletteToSchemePalette(props.accent.palette)
    : null

  const baseAnchors = getAnchors(base)

  function getSubThemesPalettes(defs: SimpleThemesDefinition, isGrandChildren = false) {
    return Object.fromEntries(
      Object.entries(defs)
        .map(([key, value]) => {
          // For grandChildren accent without custom palette: skip it entirely
          // It will inherit from parent in the theme builder
          if (isGrandChildren && key === 'accent' && !value.palette) {
            return null
          }

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
        .filter(Boolean) as [string, any][]
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
    ...(props.childrenThemes && getSubThemesPalettes(props.childrenThemes, false)),
    ...(props.grandChildrenThemes &&
      getSubThemesPalettes(props.grandChildrenThemes, true)),
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

export function createPalettes(palettes: BuildPalettes): SimplePaletteDefinitions {
  const accentPalettes = palettes.accent ? getThemeSuitePalettes(palettes.accent) : null
  const basePalettes = getThemeSuitePalettes(palettes.base)

  const next = Object.fromEntries(
    Object.entries(palettes).flatMap(([name, palette]) => {
      const palettes = getThemeSuitePalettes(palette)
      const isAccent = name.startsWith('accent')
      const oppositePalettes = isAccent ? basePalettes : accentPalettes || basePalettes

      if (!oppositePalettes) {
        return []
      }

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

      return out
    })
  )

  return next as any
}
