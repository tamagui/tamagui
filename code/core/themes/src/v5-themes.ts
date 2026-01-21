import {
  blue,
  blueDark,
  gray,
  grayDark,
  green,
  greenDark,
  red,
  redDark,
  yellow,
  yellowDark,
} from '@tamagui/colors'
import { createThemes } from '@tamagui/theme-builder'
import { interpolateColor, opacify } from './opacify'
import { v5Templates } from './v5-templates'

export const defaultComponentThemes = {
  ListItem: { template: 'surface1' },
  SelectItem: { template: 'surface1' },
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
  SliderTrackActive: { template: 'surface2' },
  SliderTrack: { template: 'inverse' },
  SliderThumb: { template: 'inverse' },
  Tooltip: { template: 'inverse' },
  ProgressIndicator: { template: 'inverse' },
  Input: { template: 'surface1' },
  TextArea: { template: 'surface1' },
} as const

/** Generate named colors from a palette: ['#fff', ...] -> { name1: '#fff', name2: ... } */
function paletteToNamedColors<N extends string>(name: N, palette: readonly string[]) {
  return Object.fromEntries(palette.map((color, i) => [`${name}${i + 1}`, color])) as {
    [K in `${N}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`]: string
  }
}

// Base palettes
const darkPalette = [
  '#050505',
  '#151515',
  '#191919',
  '#232323',
  '#333',
  '#444',
  '#666',
  '#777',
  '#858585',
  '#aaa',
  '#ccc',
  '#ffffff',
]

const lightPalette = [
  '#fff',
  '#f8f8f8',
  'hsl(0, 0%, 93%)',
  'hsl(0, 0%, 87%)',
  'hsl(0, 0%, 80%)',
  'hsl(0, 0%, 70%)',
  'hsl(0, 0%, 59%)',
  'hsl(0, 0%, 45%)',
  'hsl(0, 0%, 30%)',
  'hsl(0, 0%, 20%)',
  'hsl(0, 0%, 12%)',
  'hsl(0, 0%, 2%)',
]

/** Neutral grey - sufficient contrast on both white and black backgrounds */
const neutralPalette = [
  'hsl(0, 0%, 68%)',
  'hsl(0, 0%, 65%)',
  'hsl(0, 0%, 62%)',
  'hsl(0, 0%, 59%)',
  'hsl(0, 0%, 56%)',
  'hsl(0, 0%, 53%)',
  'hsl(0, 0%, 50%)',
  'hsl(0, 0%, 47%)',
  'hsl(0, 0%, 44%)',
  'hsl(0, 0%, 41%)',
  'hsl(0, 0%, 38%)',
  'hsl(0, 0%, 32%)',
]

// Generate neutral colors from palette (used in defaultChildrenThemes)
const neutral = paletteToNamedColors('neutral', neutralPalette)

// Constants for forcing white/black with opacity variants
const whiteBlack = {
  white: 'rgba(255,255,255,1)',
  white0: 'rgba(255,255,255,0)',
  white02: 'rgba(255,255,255,0.2)',
  white04: 'rgba(255,255,255,0.4)',
  white06: 'rgba(255,255,255,0.6)',
  white08: 'rgba(255,255,255,0.8)',
  black: 'rgba(0,0,0,1)',
  black0: 'rgba(0,0,0,0)',
  black02: 'rgba(0,0,0,0.2)',
  black04: 'rgba(0,0,0,0.4)',
  black06: 'rgba(0,0,0,0.6)',
  black08: 'rgba(0,0,0,0.8)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.1)',
  shadow2: 'rgba(0,0,0,0.18)',
  shadow3: 'rgba(0,0,0,0.25)',
  shadow4: 'rgba(0,0,0,0.4)',
  shadow5: 'rgba(0,0,0,0.55)',
  shadow6: 'rgba(0,0,0,0.66)',
}

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.025)',
  shadow2: 'rgba(0,0,0,0.04)',
  shadow3: 'rgba(0,0,0,0.06)',
  shadow4: 'rgba(0,0,0,0.095)',
  shadow5: 'rgba(0,0,0,0.195)',
  shadow6: 'rgba(0,0,0,0.3)',
}

// Export palettes for customization
export { darkPalette as defaultDarkPalette, lightPalette as defaultLightPalette }

// Internal types
type NamedColors = Record<string, string>
type ChildTheme<T extends NamedColors = NamedColors> = { light: T; dark: T }
type GrandChildrenThemeDefinition = { template: string }

/** Default children themes - accepts radix colors directly */
export const defaultChildrenThemes = {
  gray: { light: gray, dark: grayDark },
  blue: { light: blue, dark: blueDark },
  red: { light: red, dark: redDark },
  yellow: { light: yellow, dark: yellowDark },
  green: { light: green, dark: greenDark },
  neutral: { light: neutral, dark: neutral },
}

/** Default grandchildren themes available in v5 */
export const defaultGrandChildrenThemes = {
  accent: { template: 'inverse' },
  // simplified and removed:
  // alt1: { template: 'alt1' },
  // alt2: { template: 'alt2' },
  // surface1: { template: 'surface1' },
  // surface2: { template: 'surface2' },
  // surface3: { template: 'surface3' },
} satisfies Record<string, GrandChildrenThemeDefinition>

/** Union of all color values from children themes (for light or dark) */
type ChildrenColors<
  T extends Record<string, ChildTheme>,
  Mode extends 'light' | 'dark',
> = {
  [K in keyof T]: T[K][Mode]
}[keyof T]

/** Merge all color objects from children into one type */
type MergedChildrenColors<
  T extends Record<string, ChildTheme>,
  Mode extends 'light' | 'dark',
> = UnionToIntersection<ChildrenColors<T, Mode>>

// Helper to convert union to intersection
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

// Named color types for black/white (generated from palettes in createV5Theme)
type BlackColors = ReturnType<typeof paletteToNamedColors<'black'>>
type WhiteColors = ReturnType<typeof paletteToNamedColors<'white'>>

// Base extra colors type (always included) - getTheme computes opacity/interpolation colors
type BaseExtraCommon = BlackColors & WhiteColors & typeof whiteBlack
type BaseExtraLight = BaseExtraCommon & typeof lightShadows & { shadowColor: string }
type BaseExtraDark = BaseExtraCommon & typeof darkShadows & { shadowColor: string }

export type CreateV5ThemeOptions<
  Children extends Record<string, ChildTheme> = typeof defaultChildrenThemes,
  GrandChildren extends Record<
    string,
    GrandChildrenThemeDefinition
  > = typeof defaultGrandChildrenThemes,
> = {
  /** Override the dark base palette (12 colors from darkest to lightest) */
  darkPalette?: string[]
  /** Override the light base palette (12 colors from lightest to darkest) */
  lightPalette?: string[]
  /**
   * Override children themes (color themes like blue, red, etc.)
   * Accepts radix color objects directly: { blue: { light: blue, dark: blueDark } }
   */
  childrenThemes?: Children
  /**
   * Override grandChildren themes (alt1, alt2, surface1, etc.)
   * Pass undefined or omit to use defaultGrandChildrenThemes
   */
  grandChildrenThemes?: GrandChildren
  /**
   * @deprecated component themes are no longer recommended - configure component styles directly via themes or component defaultProps instead
   */
  componentThemes?: false | Parameters<typeof createThemes>[0]['componentThemes']
}

/**
 * Creates v5 themes with optional customizations.
 *
 * @example
 * Use default themes
 * const themes = createV5Theme()
 *
 * @example
 * Custom children themes with brand color (accepts radix colors directly)
 * const themes = createV5Theme({
 *   childrenThemes: {
 *     ...defaultChildrenThemes,
 *     brand: { light: brandLight, dark: brandDark },
 *   },
 * })
 *
 * @example
 * Minimal - no color themes
 * const themes = createV5Theme({
 *   childrenThemes: {},
 * })
 */
export function createV5Theme<
  Children extends Record<string, ChildTheme> = typeof defaultChildrenThemes,
  GrandChildren extends Record<
    string,
    GrandChildrenThemeDefinition
  > = typeof defaultGrandChildrenThemes,
>(
  options: CreateV5ThemeOptions<Children, GrandChildren> = {} as CreateV5ThemeOptions<
    Children,
    GrandChildren
  >
) {
  const {
    darkPalette: customDarkPalette = darkPalette,
    lightPalette: customLightPalette = lightPalette,
    childrenThemes = defaultChildrenThemes as unknown as Children,
    grandChildrenThemes = defaultGrandChildrenThemes as unknown as GrandChildren,
    componentThemes: customComponentThemes = defaultComponentThemes,
  } = options

  // Generate black/white named colors from palettes
  const blackColors = paletteToNamedColors('black', customDarkPalette)
  const whiteColors = paletteToNamedColors('white', customLightPalette)

  // Build extra colors - spread children color objects directly (types flow naturally)
  // Note: opacity/interpolation colors (color01, background01, etc.) are computed by getTheme
  const extraBase = {
    ...blackColors,
    ...whiteColors,
    ...whiteBlack,
  }
  const lightExtraBase = {
    ...extraBase,
    ...lightShadows,
    shadowColor: lightShadows.shadow1,
  }
  const darkExtraBase = { ...extraBase, ...darkShadows, shadowColor: darkShadows.shadow1 }

  // Spread all children colors into extra - types flow from Children generic
  type LightExtra = BaseExtraLight & MergedChildrenColors<Children, 'light'>
  type DarkExtra = BaseExtraDark & MergedChildrenColors<Children, 'dark'>

  const lightExtra = { ...lightExtraBase } as LightExtra
  const darkExtra = { ...darkExtraBase } as DarkExtra

  for (const theme of Object.values(childrenThemes)) {
    if (theme.light) Object.assign(lightExtra, theme.light)
    if (theme.dark) Object.assign(darkExtra, theme.dark)
  }

  // Convert children to palette format for createThemes, adding black/white internally
  type PaletteEntry = { palette: { light: string[]; dark: string[] } }
  type ChildrenWithPalettes = { [K in keyof Children | 'black' | 'white']: PaletteEntry }

  const childrenWithPalettes = {
    // Always include black/white for theme generation
    black: {
      palette: { dark: Object.values(blackColors), light: Object.values(blackColors) },
    },
    white: {
      palette: { dark: Object.values(whiteColors), light: Object.values(whiteColors) },
    },
    ...(Object.fromEntries(
      Object.entries(childrenThemes).map(([name, theme]) => [
        name,
        {
          palette: {
            light: Object.values(theme.light),
            dark: Object.values(theme.dark),
          },
        },
      ])
    ) as { [K in keyof Children]: PaletteEntry }),
  } as ChildrenWithPalettes

  return createThemes({
    // componentThemes: false disables them, undefined/truthy values enable them
    componentThemes: customComponentThemes,

    templates: v5Templates,

    base: {
      palette: {
        dark: customDarkPalette,
        light: customLightPalette,
      },

      extra: {
        light: lightExtra,
        dark: darkExtra,
      },
    },

    accent: {
      palette: {
        dark: customLightPalette,
        light: customDarkPalette,
      },
    },

    childrenThemes: childrenWithPalettes,

    grandChildrenThemes,

    // Add computed colors to ALL themes based on each theme's palette
    getTheme: ({ palette }) => {
      if (!palette || palette.length < 3) {
        throw new Error(`invalid palette: ${JSON.stringify(palette)}`)
      }

      // palette[1] is background-ish, palette[length-2] is foreground-ish
      const bgColor = palette[1]!
      const fgColor = palette[palette.length - 2]!

      return {
        // In-between shades
        color0pt5: interpolateColor(bgColor, palette[2]!, 0.5),
        color1pt5: interpolateColor(palette[1]!, palette[2]!, 0.5),
        color2pt5: interpolateColor(palette[2]!, palette[3]!, 0.5),
        // Opacity variants of foreground color
        color01: opacify(fgColor, 0.1),
        color0075: opacify(fgColor, 0.075),
        color005: opacify(fgColor, 0.05),
        color0025: opacify(fgColor, 0.025),
        color002: opacify(fgColor, 0.02),
        color001: opacify(fgColor, 0.01),
        // Opacity variants of background color
        background01: opacify(bgColor, 0.1),
        background0075: opacify(bgColor, 0.075),
        background005: opacify(bgColor, 0.05),
        background0025: opacify(bgColor, 0.025),
        background002: opacify(bgColor, 0.02),
        background001: opacify(bgColor, 0.01),
      }
    },
  })
}

// Default themes using the createV5Theme function
export const themes = createV5Theme()

// type sanity checks - these should not cause type errors:
themes.dark.background0075
themes.dark.background
themes.dark.accent1
