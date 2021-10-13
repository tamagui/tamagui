import * as RadixColors from '@radix-ui/colors'

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
  bg2: tokens.color.gray2,
  bg3: tokens.color.gray4,
  bg4: tokens.color.gray5,
  bgTransparent: tokens.color.grayA1,
  borderColor: tokens.color.gray4,
  borderColor2: tokens.color.gray6,
  color: tokens.color.gray12,
  color2: tokens.color.gray11,
  color3: tokens.color.gray10,
  color4: tokens.color.gray9,
  shadowColor: tokens.color.grayA4,
  shadowColor2: tokens.color.grayA6,
  ...lightColors,
}

const dark = {
  bg: '#171717',
  bg2: tokens.color.gray2Dark,
  bg3: tokens.color.gray3Dark,
  bg4: tokens.color.gray4Dark,
  bgTransparent: tokens.color.grayA1Dark,
  borderColor: tokens.color.gray3Dark,
  borderColor2: tokens.color.gray4Dark,
  color: '#ddd',
  color2: tokens.color.gray11Dark,
  color3: tokens.color.gray10Dark,
  color4: tokens.color.gray9Dark,
  shadowColor: tokens.color.grayA9Dark,
  shadowColor2: tokens.color.grayA11Dark,
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
  // @ts-ignore
  colorThemes[nameKey] = {
    color: colorValues[`${colorName}12`],
    color2: colorValues[`${colorName}11`],
    color3: colorValues[`${colorName}10`],
    color4: colorValues[`${colorName}9`],
    bg: colorValues[`${colorName}2`],
    bg2: colorValues[`${colorName}3`],
    bg3: colorValues[`${colorName}4`],
    bg4: colorValues[`${colorName}5`],
    borderColor: colorValues[`${colorName}2`],
  }
}

export const themes = {
  dark,
  light,
  ...colorThemes,
  'active-light': colorThemes['pink-light'],
  'active-dark': colorThemes['pink-dark'],
} as const
