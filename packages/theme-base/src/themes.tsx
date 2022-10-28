import { createThemes } from '@tamagui/create-themes'

import { colorTokens } from './tokens'

export const themes = createThemes<keyof typeof colorTokens.light>({
  activeColor: 'blue',
  light: [
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
  ],
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
    '#777777',
  ],
  colorsLight: colorTokens.light,
  colorsDark: colorTokens.dark,
})
