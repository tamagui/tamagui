import {
  blue,
  blueDark,
  gray,
  grayDark,
  green,
  greenDark,
  orange,
  orangeDark,
  pink,
  pinkDark,
  purple,
  purpleDark,
  red,
  redDark,
  yellow,
  yellowDark,
} from '@tamagui/colors'
import { createThemeSuite } from './v4-createTheme'

const colorTokens = {
  light: {
    blue,
    gray,
    green,
    orange,
    pink,
    purple,
    red,
    yellow,
  },
  dark: {
    blue: blueDark,
    gray: grayDark,
    green: greenDark,
    orange: orangeDark,
    pink: pinkDark,
    purple: purpleDark,
    red: redDark,
    yellow: yellowDark,
  },
}

const lightShadowColor = 'rgba(0,0,0,0.04)'
const lightShadowColorStrong = 'rgba(0,0,0,0.085)'
const darkShadowColor = 'rgba(0,0,0,0.2)'
const darkShadowColorStrong = 'rgba(0,0,0,0.3)'

/**
 * Default themes for the tamagui.dev site
 * If you'd like to create your own themes, use `createThemeSuite`
 */
export const tamaguiThemes = createThemeSuite({
  base: {
    palette: {
      dark: [
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
      ],
      light: [
        '#fff',
        '#f8f8f8',
        'hsl(0, 0%, 96.3%)',
        'hsl(0, 0%, 94.1%)',
        'hsl(0, 0%, 92.0%)',
        'hsl(0, 0%, 90.0%)',
        'hsl(0, 0%, 88.5%)',
        'hsl(0, 0%, 81.0%)',
        'hsl(0, 0%, 56.1%)',
        'hsl(0, 0%, 50.3%)',
        'hsl(0, 0%, 42.5%)',
        'hsl(0, 0%, 9.0%)',
      ],
    },

    // we set a bunch of colors like $red1 => $red1
    // we only want to set it on the base light/dark theme
    extra: {
      light: {
        ...colorTokens.light.blue,
        ...colorTokens.light.gray,
        ...colorTokens.light.green,
        ...colorTokens.light.orange,
        ...colorTokens.light.pink,
        ...colorTokens.light.purple,
        ...colorTokens.light.red,
        ...colorTokens.light.yellow,
        shadowColor: lightShadowColorStrong,
        shadowColorHover: lightShadowColorStrong,
        shadowColorPress: lightShadowColor,
        shadowColorFocus: lightShadowColor,
      },
      dark: {
        ...colorTokens.dark.blue,
        ...colorTokens.dark.gray,
        ...colorTokens.dark.green,
        ...colorTokens.dark.orange,
        ...colorTokens.dark.pink,
        ...colorTokens.dark.purple,
        ...colorTokens.dark.red,
        ...colorTokens.dark.yellow,
        shadowColor: darkShadowColorStrong,
        shadowColorHover: darkShadowColorStrong,
        shadowColorPress: darkShadowColor,
        shadowColorFocus: darkShadowColor,
      },
    },
  },

  childrenThemes: {
    gray: {
      palette: {
        dark: Object.values(colorTokens.dark.gray),
        light: Object.values(colorTokens.light.gray),
      },
    },
    blue: {
      palette: {
        dark: Object.values(colorTokens.dark.blue),
        light: Object.values(colorTokens.light.blue),
      },
    },
    orange: {
      palette: {
        dark: Object.values(colorTokens.dark.orange),
        light: Object.values(colorTokens.light.orange),
      },
    },
    red: {
      palette: {
        dark: Object.values(colorTokens.dark.red),
        light: Object.values(colorTokens.light.red),
      },
    },
    yellow: {
      palette: {
        dark: Object.values(colorTokens.dark.yellow),
        light: Object.values(colorTokens.light.yellow),
      },
    },
    green: {
      palette: {
        dark: Object.values(colorTokens.dark.green),
        light: Object.values(colorTokens.light.green),
      },
    },
    purple: {
      palette: {
        dark: Object.values(colorTokens.dark.purple),
        light: Object.values(colorTokens.light.purple),
      },
    },
    pink: {
      palette: {
        dark: Object.values(colorTokens.dark.pink),
        light: Object.values(colorTokens.light.pink),
      },
    },
    tan: {
      palette: {
        dark: [
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
        ],
        light: [
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
        ],
      },
    },
  },

  grandChildrenThemes: {
    alt1: {
      template: 'alt1',
    },
    alt2: {
      template: 'alt2',
    },
    surface1: {
      template: 'surface1',
    },
    surface2: {
      template: 'surface2',
    },
    surface3: {
      template: 'surface3',
    },
  },
})
