import {
  blueDark,
  blue,
  greenDark,
  green,
  redDark,
  red,
  yellowDark,
  yellow,
  gray,
  grayDark,
} from '@tamagui/colors'
import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import { interpolateColor, opacify } from './opacify'

// Aligned with v4 - darker grays for dark mode
const darkPalette = [
  '#050505',
  '#151515',
  '#191919',
  '#232323',
  '#282828',
  '#323232',
  '#424242',
  '#494949',
  '#545454',
  '#626262',
  '#a5a5a5',
  '#fff',
]

const lightPalette = [
  '#fff',
  '#f8f8f8',
  'hsl(0, 0%, 93%)',
  'hsl(0, 0%, 87%)',
  'hsl(0, 0%, 80%)',
  'hsl(0, 0%, 74%)',
  'hsl(0, 0%, 68%)',
  'hsl(0, 0%, 60%)',
  'hsl(0, 0%, 48%)',
  'hsl(0, 0%, 38%)',
  'hsl(0, 0%, 20%)',
  'hsl(0, 0%, 2%)',
]

/**
 * Neutral grey palette that has sufficient contrast on both white and black backgrounds.
 * All values are in the 32-68% lightness range, making them visible in any context.
 * Uses the same values for both light and dark themes.
 */

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

const neutral = {
  neutral1: neutralPalette[0]!,
  neutral2: neutralPalette[1]!,
  neutral3: neutralPalette[2]!,
  neutral4: neutralPalette[3]!,
  neutral5: neutralPalette[4]!,
  neutral6: neutralPalette[5]!,
  neutral7: neutralPalette[6]!,
  neutral8: neutralPalette[7]!,
  neutral9: neutralPalette[8]!,
  neutral10: neutralPalette[9]!,
  neutral11: neutralPalette[10]!,
  neutral12: neutralPalette[11]!,
}

// the same on both light and dark, useful for forcing white/black:
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

// highlights are lighter no matter if dark or light theme
// on light theme they are ==== background
// on dark theme === color2-4 looks good

const extraColorsDark = {
  // in between 1/2
  color1pt5: 'rgba(20,20,20)',
  color2pt5: '#222',

  // TODO: ideally just functions for alpha($color1, 0.1)
  // extra low opacities
  color01: opacify(darkPalette[darkPalette.length - 1]!, 0.1),
  color0075: opacify(darkPalette[darkPalette.length - 1]!, 0.075),
  color005: opacify(darkPalette[darkPalette.length - 1]!, 0.05),
  color0025: opacify(darkPalette[darkPalette.length - 1]!, 0.025),

  background01: opacify(darkPalette[0]!, 0.1),
  background0075: opacify(darkPalette[0]!, 0.075),
  background005: opacify(darkPalette[0]!, 0.05),
  background0025: opacify(darkPalette[0]!, 0.025),
}

const extraColorsLight = {
  // in between 1/2
  color1pt5: '#f9f9f9',
  color2pt5: '#f4f4f4',

  // extra low opacities
  color01: opacify(lightPalette[lightPalette.length - 1]!, 0.1),
  color0075: opacify(lightPalette[lightPalette.length - 1]!, 0.075),
  color005: opacify(lightPalette[lightPalette.length - 1]!, 0.05),
  color0025: opacify(lightPalette[lightPalette.length - 1]!, 0.025),

  background01: opacify(lightPalette[0]!, 0.1),
  background0075: opacify(lightPalette[0]!, 0.075),
  background005: opacify(lightPalette[0]!, 0.05),
  background0025: opacify(lightPalette[0]!, 0.025),
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

const blackColors = {
  black1: darkPalette[0]!,
  black2: darkPalette[1]!,
  black3: darkPalette[2]!,
  black4: darkPalette[3]!,
  black5: darkPalette[4]!,
  black6: darkPalette[5]!,
  black7: darkPalette[6]!,
  black8: darkPalette[7]!,
  black9: darkPalette[8]!,
  black10: darkPalette[9]!,
  black11: darkPalette[10]!,
  black12: darkPalette[11]!,
}

const whiteColors = {
  white1: lightPalette[0]!,
  white2: lightPalette[1]!,
  white3: lightPalette[2]!,
  white4: lightPalette[3]!,
  white5: lightPalette[4]!,
  white6: lightPalette[5]!,
  white7: lightPalette[6]!,
  white8: lightPalette[7]!,
  white9: lightPalette[8]!,
  white10: lightPalette[9]!,
  white11: lightPalette[10]!,
  white12: lightPalette[11]!,
}

// Default color palettes exported for customization
export { darkPalette, lightPalette }

// Default color sets exported for customization
export const defaultColors = {
  light: {
    blue,
    gray,
    green,
    neutral,
    red,
    yellow,
  },
  dark: {
    blue: blueDark,
    gray: grayDark,
    green: greenDark,
    neutral, // same for both light and dark - that's the point!
    red: redDark,
    yellow: yellowDark,
  },
}

export type ColorPalette = string[]

/** A named color set like { blue1: string, blue2: string, ... } */
export type NamedColors = Record<string, string>

/** Children theme definition - light/dark named color objects */
export type ChildTheme<T extends NamedColors = NamedColors> = {
  light: T
  dark: T
}

export type GrandChildrenThemeDefinition = {
  template: string
}

/** Default color names available in v5 themes */
export type DefaultColorName = 'blue' | 'gray' | 'green' | 'red' | 'yellow'

/** Default children themes available in v5 - accepts radix colors directly */
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

// Base extra colors type (always included)
type BaseExtraLight = typeof blackColors &
  typeof lightShadows &
  typeof whiteColors & { shadowColor: string } & typeof whiteBlack &
  typeof extraColorsLight

type BaseExtraDark = typeof blackColors &
  typeof darkShadows &
  typeof whiteColors & { shadowColor: string } & typeof whiteBlack &
  typeof extraColorsDark

export type CreateV5ThemeOptions<
  Children extends Record<string, ChildTheme> = typeof defaultChildrenThemes,
> = {
  /** Override the dark base palette (12 colors from darkest to lightest) */
  darkPalette?: ColorPalette
  /** Override the light base palette (12 colors from lightest to darkest) */
  lightPalette?: ColorPalette
  /**
   * Override children themes (color themes like blue, red, etc.)
   * Accepts radix color objects directly: { blue: { light: blue, dark: blueDark } }
   */
  childrenThemes?: Children
  /**
   * Override grandChildren themes (alt1, alt2, surface1, etc.)
   * Pass undefined or omit to use defaultGrandChildrenThemes
   */
  grandChildrenThemes?: Record<string, GrandChildrenThemeDefinition>
  /** Override component themes. Pass false to disable, or provide custom component themes. Defaults to defaultComponentThemes */
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
// Overload: no options or empty options - use defaults
export function createV5Theme(): ReturnType<
  typeof createV5ThemeImpl<typeof defaultChildrenThemes>
>
// Overload: with childrenThemes - infer from passed value
export function createV5Theme<Children extends Record<string, ChildTheme>>(
  options: CreateV5ThemeOptions<Children> & { childrenThemes: Children }
): ReturnType<typeof createV5ThemeImpl<Children>>
// Overload: without childrenThemes - use defaults
export function createV5Theme(
  options: Omit<CreateV5ThemeOptions, 'childrenThemes'>
): ReturnType<typeof createV5ThemeImpl<typeof defaultChildrenThemes>>
// Implementation
export function createV5Theme<Children extends Record<string, ChildTheme>>(
  options?: CreateV5ThemeOptions<Children>
) {
  return createV5ThemeImpl(options)
}

function createV5ThemeImpl<
  Children extends Record<string, ChildTheme> = typeof defaultChildrenThemes,
>(options: CreateV5ThemeOptions<Children> = {} as CreateV5ThemeOptions<Children>) {
  const {
    darkPalette: customDarkPalette = darkPalette,
    lightPalette: customLightPalette = lightPalette,
    childrenThemes = defaultChildrenThemes as unknown as Children,
    grandChildrenThemes = defaultGrandChildrenThemes,
    componentThemes: customComponentThemes = defaultComponentThemes,
  } = options

  // Build extra colors - spread children color objects directly (types flow naturally)
  const lightExtraBase = {
    ...blackColors,
    ...lightShadows,
    ...whiteColors,
    shadowColor: lightShadows.shadow1,
    ...whiteBlack,
    ...extraColorsLight,
  }
  const darkExtraBase = {
    ...blackColors,
    ...darkShadows,
    ...whiteColors,
    shadowColor: darkShadows.shadow1,
    ...whiteBlack,
    ...extraColorsDark,
  }

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
  type ChildrenWithPalette = Record<
    string,
    { palette: { light: string[]; dark: string[] } }
  >
  const childrenWithPalettes: ChildrenWithPalette = {
    // Always include black/white for theme generation
    black: {
      palette: { dark: Object.values(blackColors), light: Object.values(blackColors) },
    },
    white: {
      palette: { dark: Object.values(whiteColors), light: Object.values(whiteColors) },
    },
  }

  for (const [name, theme] of Object.entries(childrenThemes)) {
    childrenWithPalettes[name] = {
      palette: {
        light: Object.values(theme.light),
        dark: Object.values(theme.dark),
      },
    }
  }

  return createThemes({
    ...(customComponentThemes && { componentThemes: customComponentThemes }),

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
    getTheme: ({ theme, palette }) => {
      if (!palette || palette.length < 3) return theme

      // palette[1] is background-ish, palette[length-2] is foreground-ish
      const bgColor = palette[1]!
      const fgColor = palette[palette.length - 2]!

      return {
        ...theme,
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
