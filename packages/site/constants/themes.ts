import * as RadixColors from '@tamagui/colors'

import { colorNames } from './colors'
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
  bg4: tokens.color.gray6,
  bgTransparent: tokens.color.grayA1,
  borderColor: tokens.color.gray4,
  borderColor2: tokens.color.gray6,
  colorBright: '#000',
  color: tokens.color.gray12,
  color2: tokens.color.gray11,
  color3: tokens.color.gray10,
  color4: tokens.color.gray6,
  shadowColor: tokens.color.grayA6,
  shadowColor2: tokens.color.grayA8,
  separatorColor: tokens.color.grayA8,
  ...lightColors,
}

const dark = {
  bg: '#171717',
  bg2: tokens.color.gray4Dark,
  bg3: tokens.color.gray7Dark,
  bg4: tokens.color.gray9Dark,
  bgTransparent: tokens.color.grayA1Dark,
  borderColor: tokens.color.gray3Dark,
  borderColor2: tokens.color.gray4Dark,
  color: '#fff',
  colorBright: '#fff',
  color2: '#f2f2f2',
  color3: tokens.color.gray10Dark,
  color4: tokens.color.gray6Dark,
  shadowColor: tokens.color.grayA7,
  shadowColor2: tokens.color.grayA9,
  separatorColor: tokens.color.grayA8Dark,
  ...darkColors,
}

const colorThemes: Record<typeof colorNames[number], typeof light> = {} as any
for (const key of colorNames) {
  for (const scheme of ['light', 'dark']) {
    const isDark = scheme === 'dark'
    const colorKey = isDark ? `${key}Dark` : key
    const colorValues = RadixColors[colorKey]
    const offset = isDark ? -1 : 0
    colorThemes[`${key}-${scheme}`] = {
      color: isDark ? '#ddd' : colorValues[`${key}12`],
      color2: isDark ? dark.color2 : light.color2,
      color3: colorValues[`${key}11`],
      color4: colorValues[`${key}10`],
      bg: colorValues[`${key}${2 + offset}`],
      bg2: colorValues[`${key}${3 + offset}`],
      bg3: colorValues[`${key}${4 + offset}`],
      bg4: colorValues[`${key}${5 + offset}`],
      bgTransparent: colorValues[`${key}${1 + offset}`],
      borderColor: colorValues[`${key}${4 + offset}`],
      borderColor2: colorValues[`${key}${5 + offset}`],
      shadowColor: isDark ? dark.shadowColor : light.shadowColor,
    }
  }
}

export const themes = {
  dark,
  light,
  ...colorThemes,
  'active-light': {
    ...colorThemes['blue-dark'],
    bg: tokens.color.blue1,
    bg2: tokens.color.blue3,
    bg3: tokens.color.blue3,
    bg4: tokens.color.blue5,
    color: tokens.color.blue10,
    color2: tokens.color.blue11,
  },
  'active-dark': {
    ...colorThemes['blue-light'],
    bg: tokens.color.blue12,
    bg2: tokens.color.blue12,
    bg3: tokens.color.blue12,
    bg4: tokens.color.blue10,
    color: tokens.color.blue1,
    color2: tokens.color.blue2,
  },
} as const
