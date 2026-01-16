import {
  blueDark as blueDarkIn,
  blue as blueIn,
  greenDark as greenDarkIn,
  green as greenIn,
  orangeDark as orangeDarkIn,
  orange as orangeIn,
  pinkDark as pinkDarkIn,
  pink as pinkIn,
  purpleDark as purpleDarkIn,
  purple as purpleIn,
  redDark as redDarkIn,
  red as redIn,
  tealDark as tealDarkIn,
  teal as tealIn,
  yellowDark as yellowDarkIn,
  yellow as yellowIn,
  gray as grayIn,
  grayDark as grayDarkIn,
} from '@tamagui/colors'
import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import { opacify } from './opacify'

// Use Radix colors directly without saturation/lightness adjustments
const blue = blueIn
const blueDark = blueDarkIn
const green = greenIn
const greenDark = greenDarkIn
const purple = purpleIn
const purpleDark = purpleDarkIn
const red = redIn
const redDark = redDarkIn
const yellow = yellowIn
const yellowDark = yellowDarkIn
const pink = pinkIn
const pinkDark = pinkDarkIn
const orange = orangeIn
const orangeDark = orangeDarkIn
const teal = tealIn
const tealDark = tealDarkIn
const gray = grayIn
const grayDark = grayDarkIn

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

const tanLightPalette = [
  'hsla(40, 30%, 98%, 1)',
  'hsla(40, 24%, 94%, 1)',
  'hsla(38, 23%, 91%, 1)',
  'hsla(36, 20%, 90%, 1)',
  'hsla(36, 20%, 88%, 1)',
  'hsla(35, 20%, 85%, 1)',
  'hsla(35, 21%, 74%, 1)',
  'hsla(34, 20%, 70%, 1)',
  'hsla(35, 20%, 67%, 1)',
  'hsla(34, 19%, 47%, 1)',
  'hsla(35, 18%, 37%, 1)',
  'hsla(35, 17%, 20%, 1)',
]

const tanDarkPalette = [
  'hsla(30, 9%, 10%, 1)',
  'hsla(30, 10%, 12%, 1)',
  'hsla(31, 11%, 18%, 1)',
  'hsla(30, 12%, 23%, 1)',
  'hsla(30, 14%, 28%, 1)',
  'hsla(30, 16%, 33%, 1)',
  'hsla(30, 18%, 38%, 1)',
  'hsla(30, 20%, 45%, 1)',
  'hsla(30, 21%, 50%, 1)',
  'hsla(29, 22%, 58%, 1)',
  'hsla(34, 24%, 70%, 1)',
  'hsla(11, 12%, 79%, 1)',
]

const tan = {
  tan1: tanLightPalette[0]!,
  tan2: tanLightPalette[1]!,
  tan3: tanLightPalette[2]!,
  tan4: tanLightPalette[3]!,
  tan5: tanLightPalette[4]!,
  tan6: tanLightPalette[5]!,
  tan7: tanLightPalette[6]!,
  tan8: tanLightPalette[7]!,
  tan9: tanLightPalette[8]!,
  tan10: tanLightPalette[9]!,
  tan11: tanLightPalette[10]!,
  tan12: tanLightPalette[11]!,
}

const tanDark = {
  tan1: tanDarkPalette[0]!,
  tan2: tanDarkPalette[1]!,
  tan3: tanDarkPalette[2]!,
  tan4: tanDarkPalette[3]!,
  tan5: tanDarkPalette[4]!,
  tan6: tanDarkPalette[5]!,
  tan7: tanDarkPalette[6]!,
  tan8: tanDarkPalette[7]!,
  tan9: tanDarkPalette[8]!,
  tan10: tanDarkPalette[9]!,
  tan11: tanDarkPalette[10]!,
  tan12: tanDarkPalette[11]!,
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
    orange,
    pink,
    purple,
    red,
    tan,
    teal,
    yellow,
  },
  dark: {
    blue: blueDark,
    gray: grayDark,
    green: greenDark,
    neutral, // same for both light and dark - that's the point!
    orange: orangeDark,
    pink: pinkDark,
    purple: purpleDark,
    red: redDark,
    tan: tanDark,
    teal: tealDark,
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
export type DefaultColorName =
  | 'blue'
  | 'gray'
  | 'green'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'tan'
  | 'teal'
  | 'yellow'

export type ColorDefinition = { dark: ColorPalette; light: ColorPalette }

export type CreateV5ThemeOptions = {
  /** Override the dark base palette (12 colors from darkest to lightest) */
  darkPalette?: ColorPalette
  /** Override the light base palette (12 colors from lightest to darkest) */
  lightPalette?: ColorPalette
  /** Add or override color themes (e.g., { brand: { dark: [...], light: [...] } }) */
  colors?: Partial<Record<DefaultColorName, ColorDefinition>> &
    Record<string, ColorDefinition>
  /** Whether to include default color themes (blue, red, green, etc.). Defaults to true */
  includeDefaultColors?: boolean
  /** Add or override grandChildrenThemes (e.g., { alt1: { template: 'alt1' } }) */
  grandChildrenThemes?: Record<string, GrandChildrenThemeDefinition>
}

/**
 * Creates v5 themes with optional customizations.
 *
 * @example
 * Use default themes
 * const themes = createV5Theme()
 *
 * @example
 * Add a custom brand color
 * const themes = createV5Theme({
 *   colors: {
 *     brand: {
 *       light: ['#fff', '#fef', '#fdf', '#fcf', '#fbf', '#faf', '#f9f', '#f8f', '#f7f', '#f6f', '#f5f', '#f0f'],
 *       dark: ['#101', '#202', '#303', '#404', '#505', '#606', '#707', '#808', '#909', '#a0a', '#b0b', '#c0c'],
 *     },
 *   },
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
    colors = {},
    includeDefaultColors = true,
    grandChildrenThemes: customGrandChildrenThemes = {},
  } = options

  // Build childrenThemes from default colors + custom colors
  const childrenThemes: Record<string, ColorTheme> = {
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
  }

  if (includeDefaultColors) {
    Object.assign(childrenThemes, {
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
      teal: {
        palette: {
          dark: Object.values(tealDark),
          light: Object.values(teal),
        },
      },
      orange: {
        palette: {
          dark: Object.values(orangeDark),
          light: Object.values(orange),
        },
      },
      pink: {
        palette: {
          dark: Object.values(pinkDark),
          light: Object.values(pink),
        },
      },
      purple: {
        palette: {
          dark: Object.values(purpleDark),
          light: Object.values(purple),
        },
      },
      neutral: {
        palette: {
          dark: neutralPalette,
          light: neutralPalette,
        },
      },
      tan: {
        palette: {
          dark: tanDarkPalette,
          light: tanLightPalette,
        },
      },
    })
  }

  // Add custom colors (can override default ones)
  for (const [name, palette] of Object.entries(colors)) {
    childrenThemes[name] = {
      palette: {
        dark: palette.dark,
        light: palette.light,
      },
    }
  }

  return createThemes({
    componentThemes: defaultComponentThemes,

    base: {
      palette: {
        dark: customDarkPalette,
        light: customLightPalette,
      },

      extra: {
        light: {
          ...blackColors,
          ...blue,
          ...gray,
          ...green,
          ...lightShadows,
          ...neutral,
          ...orange,
          ...pink,
          ...purple,
          ...red,
          ...tan,
          ...teal,
          ...whiteColors,
          ...yellow,
          shadowColor: lightShadows.shadow1,
          ...whiteBlack,
          ...extraColorsLight,
        },
        dark: {
          ...blackColors,
          ...blueDark,
          ...darkShadows,
          ...grayDark,
          ...greenDark,
          ...neutral, // same for both light and dark
          ...orangeDark,
          ...pinkDark,
          ...purpleDark,
          ...redDark,
          ...tanDark,
          ...tealDark,
          ...whiteColors,
          ...yellowDark,
          shadowColor: darkShadows.shadow1,
          ...whiteBlack,
          ...extraColorsDark,
        },
      },
    },

    accent: {
      palette: {
        dark: customLightPalette,
        light: customDarkPalette,
      },
    },

    childrenThemes,

    grandChildrenThemes: {
      accent: {
        template: 'inverse',
      },
      alt1: { template: 'alt1' },
      alt2: { template: 'alt2' },
      surface1: { template: 'surface1' },
      surface2: { template: 'surface2' },
      surface3: { template: 'surface3' },
      ...customGrandChildrenThemes,
    },
  })
}

// Default themes using the createV5Theme function
export const themes = createV5Theme()
