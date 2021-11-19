import * as RadixColors from '@tamagui/colors'

import { tokens } from './tokens'

export type MyTheme = typeof light
export type MyThemes = typeof themes

const lightColors = Object.fromEntries(
  Object.entries(tokens.color).filter(([k]) => !k.endsWith('Dark'))
)
const darkColors = Object.fromEntries(
  Object.entries(tokens.color)
    .filter(([k]) => k.endsWith('Dark'))
    .map(([k, v]) => [k.replace('Dark', ''), v])
)

const light = {
  bg: '#fff',
  bg2: tokens.color.gray3,
  bg3: tokens.color.gray4,
  bg4: tokens.color.gray5,
  bgTransparent: tokens.color.grayA1,
  borderColor: tokens.color.gray4,
  borderColor2: tokens.color.gray6,
  color: tokens.color.gray12,
  color2: tokens.color.gray11,
  color3: tokens.color.gray10,
  color4: tokens.color.gray6,
  shadowColor: tokens.color.grayA4,
  shadowColor2: tokens.color.grayA6,
  ...lightColors,
}

const dark = {
  bg: '#151515',
  bg2: tokens.color.gray3Dark,
  bg3: tokens.color.gray4Dark,
  bg4: tokens.color.gray5Dark,
  bgTransparent: tokens.color.grayA1Dark,
  borderColor: tokens.color.gray3Dark,
  borderColor2: tokens.color.gray4Dark,
  color: '#ddd',
  color2: tokens.color.gray11Dark,
  color3: tokens.color.gray10Dark,
  color4: tokens.color.gray6Dark,
  shadowColor: '#00000055',
  shadowColor2: '#00000099',
  ...darkColors,
}

const colorThemes: Record<string, typeof light> = {}
const colorKeys = Object.keys(RadixColors)
for (const key of colorKeys) {
  if (key.endsWith('A')) continue
  const colorName = key.replace('Dark', '')
  const colorValues = RadixColors[key]
  const isDark = key.endsWith('Dark')
  const nameKey = isDark ? key.replace('Dark', '-dark') : `${key}-light`
  const offset = isDark ? -1 : 0
  // @ts-ignore
  colorThemes[nameKey] = {
    // @ts-ignore
    color: isDark ? '#ddd' : colorValues[`${colorName}12`],
    color2: colorValues[`${colorName}11`],
    color3: colorValues[`${colorName}10`],
    color4: colorValues[`${colorName}9`],
    bg: colorValues[`${colorName}${2 + offset}`],
    bg2: colorValues[`${colorName}${3 + offset}`],
    bg3: colorValues[`${colorName}${4 + offset}`],
    bg4: colorValues[`${colorName}${5 + offset}`],
    borderColor: colorValues[`${colorName}${4 + offset}`],
    borderColor2: colorValues[`${colorName}${5 + offset}`],
  }
}

export const themes = {
  dark,
  light,
  ...colorThemes,
  'active-light': {
    ...colorThemes['blue-dark'],
    bg: tokens.color.blue9,
    bg2: tokens.color.blue10,
    bg3: tokens.color.blue11,
    bg4: tokens.color.blue12,
    color: '#fff',
    color2: '#fff',
  },
  'active-dark': {
    ...colorThemes['blue-light'],
    bg: tokens.color.blue12,
    bg2: tokens.color.blue11,
    bg3: tokens.color.blue10,
    bg4: tokens.color.blue9,
    color: '#fff',
    color2: '#fff',
  },
} as const
