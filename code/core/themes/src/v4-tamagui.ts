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
import { objectFromEntries } from './helpers'
import { objectKeys, postfixObjKeys } from './utils'
import { createThemes } from './v4-createTheme'

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

const darkColors = {
  ...colorTokens.dark.blue,
  ...colorTokens.dark.gray,
  ...colorTokens.dark.green,
  ...colorTokens.dark.orange,
  ...colorTokens.dark.pink,
  ...colorTokens.dark.purple,
  ...colorTokens.dark.red,
  ...colorTokens.dark.yellow,
}

const lightColors = {
  ...colorTokens.light.blue,
  ...colorTokens.light.gray,
  ...colorTokens.light.green,
  ...colorTokens.light.orange,
  ...colorTokens.light.pink,
  ...colorTokens.light.purple,
  ...colorTokens.light.red,
  ...colorTokens.light.yellow,
}

const color = {
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
  ...postfixObjKeys(lightColors, 'Light'),
  ...postfixObjKeys(darkColors, 'Dark'),
}

const lightColorNames = objectKeys(colorTokens.light)
const lightPalettes = objectFromEntries(
  lightColorNames.map(
    (key, index) => [`light_${key}`, Object.values(colorTokens.light[key])] as const
  )
)

const darkColorNames = objectKeys(colorTokens.dark)
const darkPalettes = objectFromEntries(
  darkColorNames.map(
    (key, index) => [`dark_${key}`, Object.values(colorTokens.light[key])] as const
  )
)

/**
 * Default themes for the tamagui.dev site
 * If you'd like to create your own themes, use `createThemes`
 */
export const themes = createThemes({
  base: {
    dark: [color.black1, color.black12],
    light: [color.white1, color.white12],
  },
  accent: ['#ECD20A', '#424035'],
  subThemes: {
    gray: {
      dark: darkPalettes.dark_gray,
      light: lightPalettes.light_gray,
    },
    blue: {
      dark: darkPalettes.dark_blue,
      light: lightPalettes.light_blue,
    },
    orange: {
      dark: darkPalettes.dark_orange,
      light: lightPalettes.light_orange,
    },
    red: {
      dark: darkPalettes.dark_red,
      light: lightPalettes.light_red,
    },
    yellow: {
      dark: darkPalettes.dark_yellow,
      light: lightPalettes.light_yellow,
    },
    green: {
      dark: darkPalettes.dark_green,
      light: lightPalettes.light_green,
    },
    purple: {
      dark: darkPalettes.dark_purple,
      light: lightPalettes.light_purple,
    },
    pink: {
      dark: darkPalettes.dark_pink,
      light: lightPalettes.light_pink,
    },
  },
})

type x = typeof themes
type y = x['themes']['dark']

console.log('themes', themes)
