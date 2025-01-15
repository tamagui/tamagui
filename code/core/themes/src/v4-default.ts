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

const white = {
  white1: '#fff',
  white2: '#f8f8f8',
  white3: 'hsl(0, 0%, 96.3%)',
  white4: 'hsl(0, 0%, 94.1%)',
  white5: 'hsl(0, 0%, 92.0%)',
  white6: 'hsl(0, 0%, 90.0%)',
  white7: 'hsl(0, 0%, 88.5%)',
  white8: 'hsl(0, 0%, 81.0%)',
  white9: 'hsl(0, 0%, 56.1%)',
  white10: 'hsl(0, 0%, 50.3%)',
  white11: 'hsl(0, 0%, 42.5%)',
  white12: 'hsl(0, 0%, 9.0%)',
}

const black = {
  black1: '#050505',
  black2: '#151515',
  black3: '#191919',
  black4: '#232323',
  black5: '#282828',
  black6: '#323232',
  black7: '#424242',
  black8: '#494949',
  black9: '#545454',
  black10: '#626262',
  black11: '#a5a5a5',
  black12: '#fff',
}

const lightShadowColor = 'rgba(0,0,0,0.04)'
const lightShadowColorStrong = 'rgba(0,0,0,0.085)'
const darkShadowColor = 'rgba(0,0,0,0.2)'
const darkShadowColorStrong = 'rgba(0,0,0,0.3)'

const nonInherited = {
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
}

/**
 * Default themes for the tamagui.dev site
 * If you'd like to create your own themes, use `createThemeSuite`
 */
const baseThemes = createThemeSuite({
  base: {
    palette: {
      dark: Object.values(black),
      light: Object.values(white),
    },

    extra: {
      dark: nonInherited.dark,
      light: nonInherited.light,
    },
  },

  accent: {
    palette: ['#ECD20A', '#424035'],
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
  },

  grandChildrenThemes: {
    alt1: {
      template: 'surface1',
    },
    alt2: {
      template: 'surface2',
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

const light_tan_palette = [
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

const light_tan = {
  color1: light_tan_palette[0],
  color2: light_tan_palette[1],
  color3: light_tan_palette[2],
  color4: light_tan_palette[3],
  color5: light_tan_palette[4],
  color6: light_tan_palette[5],
  color7: light_tan_palette[6],
  color8: light_tan_palette[7],
  color9: light_tan_palette[8],
  color10: light_tan_palette[9],
  color11: light_tan_palette[10],
  color12: light_tan_palette[11],
  color: light_tan_palette[11],
  background: light_tan_palette[0],
}

const dark_tan_palette = [
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

const dark_tan = {
  color1: dark_tan_palette[0],
  color2: dark_tan_palette[1],
  color3: dark_tan_palette[2],
  color4: dark_tan_palette[3],
  color5: dark_tan_palette[4],
  color6: dark_tan_palette[5],
  color7: dark_tan_palette[6],
  color8: dark_tan_palette[7],
  color9: dark_tan_palette[8],
  color10: dark_tan_palette[9],
  color11: dark_tan_palette[10],
  color12: dark_tan_palette[11],
  color: dark_tan_palette[11],
  background: dark_tan_palette[0],
}

export const tamaguiThemes = {
  ...baseThemes,
  dark_tan,
  light_tan,
}

console.log('dark_Button', tamaguiThemes)
