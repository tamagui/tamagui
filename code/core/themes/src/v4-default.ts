import { green, greenDark, red, redDark, yellow, yellowDark } from '@tamagui/colors'
import { createThemeSuite } from './v4-createTheme'

const colorTokens = {
  light: {
    green,
    red,
    yellow,
  },
  dark: {
    green: greenDark,
    red: redDark,
    yellow: yellowDark,
  },
}

const lightShadowColor = 'rgba(0,0,0,0.04)'
const lightShadowColorStrong = 'rgba(0,0,0,0.085)'
const darkShadowColor = 'rgba(0,0,0,0.2)'
const darkShadowColorStrong = 'rgba(0,0,0,0.3)'

const darkPalette = ['#050505', '#fff']
const lightPalette = ['#fff', 'hsl(0, 0%, 9.0%)']

/**
 * Default themes for the tamagui.dev site
 * If you'd like to create your own themes, use `createThemeSuite`
 */
export const defaultThemes = createThemeSuite({
  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    // we set a bunch of colors like $red1 => $red12
    // we only want to set it on the base light/dark theme not all sub-themes
    extra: {
      light: {
        ...colorTokens.light.green,
        ...colorTokens.light.red,
        ...colorTokens.light.yellow,
        shadowColor: lightShadowColorStrong,
        shadowColorHover: lightShadowColorStrong,
        shadowColorPress: lightShadowColor,
        shadowColorFocus: lightShadowColor,
      },
      dark: {
        ...colorTokens.dark.green,
        ...colorTokens.dark.red,
        ...colorTokens.dark.yellow,
        shadowColor: darkShadowColorStrong,
        shadowColorHover: darkShadowColorStrong,
        shadowColorPress: darkShadowColor,
        shadowColorFocus: darkShadowColor,
      },
    },
  },

  accent: {
    palette: {
      dark: lightPalette,
      light: darkPalette,
    },
    template: 'inverse',
  },

  childrenThemes: {
    error: {
      palette: {
        dark: Object.values(colorTokens.dark.red),
        light: Object.values(colorTokens.light.red),
      },
    },
    warning: {
      palette: {
        dark: Object.values(colorTokens.dark.yellow),
        light: Object.values(colorTokens.light.yellow),
      },
    },
    success: {
      palette: {
        dark: Object.values(colorTokens.dark.green),
        light: Object.values(colorTokens.light.green),
      },
    },
  },
})
