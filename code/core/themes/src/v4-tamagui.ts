import * as Colors from '@tamagui/colors'
import { createThemeSuite } from './v4-createTheme'

/**
 * Default themes for the tamagui.dev site
 * If you'd like to create your own themes, use `createThemeSuite`
 */

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
]

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
}

const themes = createThemeSuite({
  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    // for values we don't want being inherited onto sub-themes
    extra: {
      light: {
        ...Colors.blue,
        ...Colors.gray,
        ...Colors.green,
        ...Colors.orange,
        ...Colors.pink,
        ...Colors.purple,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.blueDark,
        ...Colors.grayDark,
        ...Colors.greenDark,
        ...Colors.orangeDark,
        ...Colors.pinkDark,
        ...Colors.purpleDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  // this creates an accent theme, and an accent
  accent: {
    palette: {
      dark: [lightPalette[0], lightPalette[3], lightPalette[11]],
      light: [darkPalette[0], darkPalette[3], darkPalette[11]],
    },
  },

  childrenThemes: {
    gray: {
      palette: {
        dark: Object.values(Colors.grayDark),
        light: Object.values(Colors.gray),
      },
    },
    blue: {
      palette: {
        dark: Object.values(Colors.blueDark),
        light: Object.values(Colors.blue),
      },
    },
    orange: {
      palette: {
        dark: Object.values(Colors.orangeDark),
        light: Object.values(Colors.orange),
      },
    },
    red: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },
    yellow: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },
    green: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
    purple: {
      palette: {
        dark: Object.values(Colors.purpleDark),
        light: Object.values(Colors.purple),
      },
    },
    pink: {
      palette: {
        dark: Object.values(Colors.pinkDark),
        light: Object.values(Colors.pink),
      },
    },
    tan: {
      palette: {
        light: [
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
        dark: [
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

export type TamaguiThemes = typeof themes

// avoid themes only on client bundle
export const tamaguiThemes: TamaguiThemes =
  process.env.TAMAGUI_IS_SERVER ||
  process.env.TAMAGUI_KEEP_THEMES ||
  process.env.NODE_ENV === 'development'
    ? (themes as any)
    : ({} as any)
