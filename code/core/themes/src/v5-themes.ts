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

/** Converts a palette array to a named color object (e.g., [color] -> { colorName1: color, colorName2: ... }) */
function paletteToColorObject(name: string, palette: string[]): Record<string, string> {
  return Object.fromEntries(palette.map((color, i) => [`${name}${i + 1}`, color]))
}

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

export type ColorTheme = {
  palette: {
    dark: ColorPalette
    light: ColorPalette
  }
}

export type GrandChildrenThemeDefinition = {
  template: string
}

/** Default color names available in v5 themes */
export type DefaultColorName = 'blue' | 'gray' | 'green' | 'red' | 'yellow'

export type ColorDefinition = { dark: ColorPalette; light: ColorPalette }

/** Default children themes available in v5 */
export const defaultChildrenThemes = {
  black: {
    palette: {
      dark: Object.values(blackColors),
      light: Object.values(blackColors),
    },
  },
  white: {
    palette: {
      dark: Object.values(whiteColors),
      light: Object.values(whiteColors),
    },
  },
  gray: {
    palette: {
      dark: Object.values(grayDark),
      light: Object.values(gray),
    },
  },
  blue: {
    palette: {
      dark: Object.values(blueDark),
      light: Object.values(blue),
    },
  },
  red: {
    palette: {
      dark: Object.values(redDark),
      light: Object.values(red),
    },
  },
  yellow: {
    palette: {
      dark: Object.values(yellowDark),
      light: Object.values(yellow),
    },
  },
  green: {
    palette: {
      dark: Object.values(greenDark),
      light: Object.values(green),
    },
  },
  neutral: {
    palette: {
      dark: neutralPalette,
      light: neutralPalette,
    },
  },
} satisfies Record<string, ColorTheme>

/** Default grandchildren themes available in v5 */
export const defaultGrandChildrenThemes = {
  accent: { template: 'inverse' },
  alt1: { template: 'alt1' },
  alt2: { template: 'alt2' },
  surface1: { template: 'surface1' },
  surface2: { template: 'surface2' },
  surface3: { template: 'surface3' },
} satisfies Record<string, GrandChildrenThemeDefinition>

export type CreateV5ThemeOptions = {
  /** Override the dark base palette (12 colors from darkest to lightest) */
  darkPalette?: ColorPalette
  /** Override the light base palette (12 colors from lightest to darkest) */
  lightPalette?: ColorPalette
  /**
   * Override children themes (color themes like blue, red, etc.)
   * Pass undefined or omit to use defaultChildrenThemes
   * @example Use only a subset of colors
   * { blue: defaultChildrenThemes.blue, brand: { palette: { dark: [...], light: [...] } } }
   */
  childrenThemes?: Record<string, ColorTheme>
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
 * Custom children themes with brand color
 * const themes = createV5Theme({
 *   childrenThemes: {
 *     ...defaultChildrenThemes,
 *     brand: {
 *       palette: {
 *         light: ['#fff', '#fef', ...],
 *         dark: ['#101', '#202', ...],
 *       },
 *     },
 *   },
 * })
 *
 * @example
 * Minimal - no color themes
 * const themes = createV5Theme({
 *   childrenThemes: {},
 * })
 *
 * @example
 * Override base palettes
 * const themes = createV5Theme({
 *   lightPalette: ['#fff', '#fafafa', ...],
 *   darkPalette: ['#000', '#111', ...],
 * })
 */
export function createV5Theme(options: CreateV5ThemeOptions = {}) {
  const {
    darkPalette: customDarkPalette = darkPalette,
    lightPalette: customLightPalette = lightPalette,
    childrenThemes = defaultChildrenThemes,
    grandChildrenThemes = defaultGrandChildrenThemes,
    componentThemes: customComponentThemes = defaultComponentThemes,
  } = options

  // Auto-generate extra colors from childrenThemes
  const lightExtra: Record<string, string> = {
    ...blackColors,
    ...lightShadows,
    ...whiteColors,
    shadowColor: lightShadows.shadow1,
    ...whiteBlack,
    ...extraColorsLight,
  }
  const darkExtra: Record<string, string> = {
    ...blackColors,
    ...darkShadows,
    ...whiteColors,
    shadowColor: darkShadows.shadow1,
    ...whiteBlack,
    ...extraColorsDark,
  }

  // Add named colors from each children theme (e.g., blue1-blue12 from blue palette)
  for (const [name, theme] of Object.entries(childrenThemes)) {
    // Skip black/white as they're already in base colors
    if (name === 'black' || name === 'white') continue
    if (theme.palette.light) {
      Object.assign(lightExtra, paletteToColorObject(name, theme.palette.light))
    }
    if (theme.palette.dark) {
      Object.assign(darkExtra, paletteToColorObject(name, theme.palette.dark))
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

    childrenThemes,

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
