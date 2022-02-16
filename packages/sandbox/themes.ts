import { getVariableValue } from '@tamagui/core'

import { tokens } from './tokens'

const lightColors = Object.fromEntries(
  Object.entries(tokens.color).filter(([k]) => !k.endsWith('Dark'))
)
const darkColors = Object.fromEntries(
  Object.entries(tokens.color)
    .filter(([k]) => k.endsWith('Dark'))
    .map(([k, v]) => [k.replace('Dark', ''), v])
)

const whiteColors = [
  '#fff',
  '#f2f2f2',
  tokens.color.gray1,
  tokens.color.gray2,
  tokens.color.gray3,
  tokens.color.gray4,
  tokens.color.gray5,
  tokens.color.gray6,
  tokens.color.gray7,
  tokens.color.gray8,
  tokens.color.gray9,
  tokens.color.gray10,
  tokens.color.gray11,
  tokens.color.gray12,
  '#010101',
  '#000',
]

const blackColors = [...whiteColors].reverse()

console.log({
  whiteColors: whiteColors.map(getVariableValue),
  blackColors: blackColors.map(getVariableValue),
})

const getTheme =
  (isLight = true) =>
  // could allow spearate contrast control
  (str = 0) => {
    const bgBase = isLight ? whiteColors : blackColors
    const colorBase = isLight ? blackColors : whiteColors
    return {
      bg: bgBase[0 + str],
      bg2: bgBase[1 + str],
      bg3: bgBase[2 + str],
      bg4: bgBase[3 + str],
      bgTransparent: tokens.color.grayA1,
      borderColor: isLight ? colorBase[6 + str] : bgBase[2 + str],
      borderColor2: isLight ? colorBase[7 + str] : bgBase[3 + str],
      color: colorBase[0 + str],
      color2: colorBase[1 + str],
      color3: colorBase[2 + str],
      color4: colorBase[3 + str],
      shadowColor: blackColors[!isLight ? 0 : 7],
      shadowColor2: blackColors[!isLight ? 1 : 8],
      separatorColor: bgBase[4],
    }
  }

const getDarkTheme = getTheme(false)
const getLightTheme = getTheme()

const dark = {
  ...getDarkTheme(),
  ...darkColors,
}

const light = {
  ...getLightTheme(),
  ...lightColors,
}

export const themes = {
  dark,
  'dark-alt0': getDarkTheme(0),
  'dark-alt1': getDarkTheme(1),
  'dark-alt2': getDarkTheme(2),
  'dark-alt3': getDarkTheme(3),
  'dark-alt4': getDarkTheme(4),
  'dark-alt5': getDarkTheme(5),
  'dark-alt6': getDarkTheme(6),
  light,
  'light-alt0': getLightTheme(0),
  'light-alt1': getLightTheme(1),
  'light-alt2': getLightTheme(2),
  'light-alt3': getLightTheme(3),
  'light-alt4': getLightTheme(4),
  'light-alt5': getLightTheme(5),
  'light-alt6': getLightTheme(6),
} as const

export type MyTheme = typeof light
export type MyThemes = typeof themes
