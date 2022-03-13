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
  '#222',
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
      background: bgBase[str],
      backgroundHover: bgBase[str - 1],
      backgroundPress: bgBase[2 + str],
      backgroundFocus: bgBase[3 + str],
      backgroundTransparent: tokens.color.grayA1,
      borderColor: isLight ? colorBase[7] : bgBase[2],
      borderColorHover: isLight ? colorBase[8] : bgBase[3],
      borderColorPress: isLight ? colorBase[8] : bgBase[3],
      borderColorFocus: isLight ? colorBase[8] : bgBase[3],
      color: colorBase[0 + str],
      colorHover: colorBase[1 + str],
      colorPress: colorBase[2 + str],
      colorFocus: colorBase[3 + str],
      shadowColor: blackColors[!isLight ? 0 : 7],
      shadowColorHover: blackColors[!isLight ? 1 : 8],
      shadowColorPress: blackColors[!isLight ? 1 : 8],
      shadowColorFocus: blackColors[!isLight ? 1 : 8],
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
  'dark-alt1': getDarkTheme(1),
  'dark-alt2': getDarkTheme(2),
  'dark-alt3': getDarkTheme(3),
  'dark-alt4': getDarkTheme(4),
  'dark-alt5': getDarkTheme(5),
  'dark-alt6': getDarkTheme(6),
  light,
  'light-alt1': getLightTheme(1),
  'light-alt2': getLightTheme(2),
  'light-alt3': getLightTheme(3),
  'light-alt4': getLightTheme(4),
  'light-alt5': getLightTheme(5),
  'light-alt6': getLightTheme(6),
} as const

export type MyTheme = typeof light
export type MyThemes = typeof themes
