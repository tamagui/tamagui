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
import { darkPalette, lightPalette, neutralPalette } from './v5-palettes'

export type ColorPalette = string[]

export type ColorTheme = {
  palette: {
    dark: ColorPalette
    light: ColorPalette
  }
}

/** Creates named color object from a 12-color palette array */
function paletteToNamedColors<Name extends string>(
  name: Name,
  palette: ColorPalette
): Record<`${Name}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`, string> {
  return {
    [`${name}1`]: palette[0]!,
    [`${name}2`]: palette[1]!,
    [`${name}3`]: palette[2]!,
    [`${name}4`]: palette[3]!,
    [`${name}5`]: palette[4]!,
    [`${name}6`]: palette[5]!,
    [`${name}7`]: palette[6]!,
    [`${name}8`]: palette[7]!,
    [`${name}9`]: palette[8]!,
    [`${name}10`]: palette[9]!,
    [`${name}11`]: palette[10]!,
    [`${name}12`]: palette[11]!,
  } as Record<`${Name}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`, string>
}

/**
 * Default color themes for v5.
 * Each theme has a light and dark palette variant.
 */
export const defaultColorThemes = {
  black: {
    palette: {
      dark: Object.values(darkPalette),
      light: Object.values(darkPalette),
    },
  },
  white: {
    palette: {
      dark: Object.values(lightPalette),
      light: Object.values(lightPalette),
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
}

export type DefaultColorThemes = typeof defaultColorThemes

/**
 * Generates the extra colors for base theme from color themes.
 * This ensures base.extra contains named colors (blue1-12, red1-12, etc.)
 * for all provided color themes.
 */
export function colorThemesToExtra<T extends Record<string, ColorTheme>>(
  colorThemes: T,
  scheme: 'light' | 'dark'
): Record<string, string> {
  const extra: Record<string, string> = {}

  for (const [name, theme] of Object.entries(colorThemes)) {
    const palette = scheme === 'light' ? theme.palette.light : theme.palette.dark
    const namedColors = paletteToNamedColors(name, palette)
    Object.assign(extra, namedColors)
  }

  return extra
}
