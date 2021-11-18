import * as RadixColors from '@tamagui/colors'

import { tokens } from './testConstants'

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
  bg: '#ffffff',
  bg2: tokens.color.gray3,
  bg3: tokens.color.gray5,
  bg4: tokens.color.gray7,
  bgTransparent: tokens.color.grayA1,
  borderColor: tokens.color.gray6,
  borderColor2: tokens.color.gray8,
  color: tokens.color.gray12,
  color2: tokens.color.gray11,
  color3: tokens.color.gray10,
  color4: tokens.color.gray9,
  shadowColor: tokens.color.grayA9,
  shadowColor2: tokens.color.grayA11,
  ...lightColors,
}

const dark = {
  bg: tokens.color.gray1Dark,
  bg2: tokens.color.gray3Dark,
  bg3: tokens.color.gray5Dark,
  bg4: tokens.color.gray7Dark,
  bgTransparent: tokens.color.grayA1Dark,
  borderColor: tokens.color.gray6Dark,
  borderColor2: tokens.color.gray8Dark,
  color: tokens.color.gray12Dark,
  color2: tokens.color.gray11Dark,
  color3: tokens.color.gray10Dark,
  color4: tokens.color.gray9Dark,
  shadowColor: tokens.color.grayA9Dark,
  shadowColor2: tokens.color.grayA11Dark,
  ...darkColors,
}

const colorThemes = {}
const colorKeys = Object.keys(RadixColors)
for (const key of colorKeys) {
  if (key.endsWith('A')) continue
  const colorName = key.replace('Dark', '')
  const colorValues = RadixColors[key]
  if (key.endsWith('Dark')) {
    colorThemes[`${key.replace('Dark', '-dark')}`] = {
      color: colorValues[`${colorName}1`],
      color2: colorValues[`${colorName}2`],
      color3: colorValues[`${colorName}3`],
      color4: colorValues[`${colorName}4`],
      bg: colorValues[`${colorName}12`],
      bg2: colorValues[`${colorName}11`],
      bg3: colorValues[`${colorName}10`],
      bg4: colorValues[`${colorName}9`],
      borderColor: colorValues[`${colorName}8`],
    }
  } else {
    colorThemes[`${key}-light`] = {
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
}

export const themes = {
  dark,
  light,
  ...colorThemes,
  'active-light': colorThemes['pink-light'],
  'active-dark': colorThemes['pink-dark'],
} as const
