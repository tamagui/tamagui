import { createTheme } from '@tamagui/core'

import { tokens } from './testConstants'

const lightColors = Object.fromEntries(
  Object.entries(tokens.color).filter(([k]) => !k.endsWith('Dark'))
)
const darkColors = Object.fromEntries(
  Object.entries(tokens.color)
    .filter(([k]) => k.endsWith('Dark'))
    .map(([k, v]) => [k.replace('Dark', ''), v])
)

const base = createTheme({
  bg: '#ffffff',
  bg2: tokens.color.gray3,
  bg3: tokens.color.gray5,
  bg4: tokens.color.gray7,
  borderColor: tokens.color.gray6,
  borderColor2: tokens.color.gray8,
  color: tokens.color.gray12,
  color2: tokens.color.gray11,
  color3: tokens.color.gray10,
  color4: tokens.color.gray9,
  shadowColor: tokens.color.grayA9,
  shadowColor2: tokens.color.grayA11,
})

type BaseTheme = typeof base

const light: BaseTheme = {
  ...base,
  ...lightColors,
}

const dark: BaseTheme = {
  bg: tokens.color.gray1Dark,
  bg2: tokens.color.gray3Dark,
  bg3: tokens.color.gray5Dark,
  bg4: tokens.color.gray7Dark,
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

export const themes = {
  dark,
  light,
} as const
