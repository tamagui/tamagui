import {
  GeneratedThemes,
  createThemeFromPalette,
  createThemes,
} from '@tamagui/create-themes'

import { colorTokens } from './tokens'

type LightColorSets = typeof colorTokens.light

type ColorNames = keyof LightColorSets
type ColorShades = keyof UnionToIntersection<LightColorSets[keyof LightColorSets]>

const light = [
  '#fff',
  '#f4f4f4',
  'hsl(0, 0%, 99.0%)',
  'hsl(0, 0%, 97.3%)',
  'hsl(0, 0%, 95.1%)',
  'hsl(0, 0%, 93.0%)',
  'hsl(0, 0%, 90.9%)',
  'hsl(0, 0%, 88.7%)',
  'hsl(0, 0%, 85.8%)',
  'hsl(0, 0%, 78.0%)',
  'hsl(0, 0%, 56.1%)',
  'hsl(0, 0%, 52.3%)',
  'hsl(0, 0%, 43.5%)',
  'hsl(0, 0%, 9.0%)',
]

export const themes: GeneratedThemes<ColorNames, ColorShades> = createThemes({
  activeColor: 'blue',
  light,
  dark: [
    '#111111',
    '#151515',
    '#191919',
    '#232323',
    '#282828',
    '#323232',
    '#383838',
    '#424242',
    '#494949',
    '#545454',
    '#626262',
    '#a5a5a5',
  ],
  colorsLight: colorTokens.light,
  colorsDark: colorTokens.dark,
})

const testNewLight = createThemeFromPalette(light, {
  backgroundStrong: 0,
  background: 2,
  backgroundHover: 3,
  backgroundPress: 4,
  backgroundFocus: 5,
  backgroundTransparent: 'rgba(255,255,255,0)',
  color: -1,
  colorHover: -2,
  colorPress: -3,
  colorFocus: -4,
  shadowColor: -2,
  shadowColorHover: -3,
  shadowColorPress: -4,
  shadowColorFocus: -5,
  borderColor: 3,
  borderColorHover: 4,
  borderColorPress: 5,
  borderColorFocus: 6,
  placeholderColor: -4,
  color1: 0,
  color2: 1,
  color3: 2,
  color4: 3,
  color5: 4,
  color6: 5,
  color7: 6,
  color8: 7,
  color9: 8,
  color10: 9,
  color11: 10,
  color12: 11,
})

console.log('vs', testNewLight, themes.light)

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never
