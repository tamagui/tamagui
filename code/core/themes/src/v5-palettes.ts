import {
  blue,
  blueDark,
  gray,
  grayDark,
  green,
  greenDark,
  red,
  redDark,
  yellow,
  yellowDark,
} from '@tamagui/colors'

// Base palettes (12 colors each)
export const darkPalette = [
  '#050505',
  '#151515',
  '#191919',
  '#232323',
  '#282828',
  '#323232',
  '#424242',
  '#494949',
  '#545454',
  '#626262',
  '#a5a5a5',
  '#fff',
]

export const lightPalette = [
  '#fff',
  '#f8f8f8',
  'hsl(0, 0%, 93%)',
  'hsl(0, 0%, 87%)',
  'hsl(0, 0%, 80%)',
  'hsl(0, 0%, 74%)',
  'hsl(0, 0%, 68%)',
  'hsl(0, 0%, 60%)',
  'hsl(0, 0%, 48%)',
  'hsl(0, 0%, 38%)',
  'hsl(0, 0%, 20%)',
  'hsl(0, 0%, 2%)',
]

/**
 * Neutral grey palette with sufficient contrast on both white and black backgrounds.
 * Uses the same values for both light and dark themes.
 */
export const neutralPalette = [
  'hsl(0, 0%, 68%)',
  'hsl(0, 0%, 65%)',
  'hsl(0, 0%, 62%)',
  'hsl(0, 0%, 59%)',
  'hsl(0, 0%, 56%)',
  'hsl(0, 0%, 53%)',
  'hsl(0, 0%, 50%)',
  'hsl(0, 0%, 47%)',
  'hsl(0, 0%, 44%)',
  'hsl(0, 0%, 41%)',
  'hsl(0, 0%, 38%)',
  'hsl(0, 0%, 32%)',
]

// White/black with opacity variants (same on both light and dark)
export const whiteBlack = {
  white: 'rgba(255,255,255,1)',
  white0: 'rgba(255,255,255,0)',
  white02: 'rgba(255,255,255,0.2)',
  white04: 'rgba(255,255,255,0.4)',
  white06: 'rgba(255,255,255,0.6)',
  white08: 'rgba(255,255,255,0.8)',
  black: 'rgba(0,0,0,1)',
  black0: 'rgba(0,0,0,0)',
  black02: 'rgba(0,0,0,0.2)',
  black04: 'rgba(0,0,0,0.4)',
  black06: 'rgba(0,0,0,0.6)',
  black08: 'rgba(0,0,0,0.8)',
}

export const darkShadows = {
  shadow1: 'rgba(0,0,0,0.1)',
  shadow2: 'rgba(0,0,0,0.18)',
  shadow3: 'rgba(0,0,0,0.25)',
  shadow4: 'rgba(0,0,0,0.4)',
  shadow5: 'rgba(0,0,0,0.55)',
  shadow6: 'rgba(0,0,0,0.66)',
}

export const lightShadows = {
  shadow1: 'rgba(0,0,0,0.025)',
  shadow2: 'rgba(0,0,0,0.04)',
  shadow3: 'rgba(0,0,0,0.06)',
  shadow4: 'rgba(0,0,0,0.095)',
  shadow5: 'rgba(0,0,0,0.195)',
  shadow6: 'rgba(0,0,0,0.3)',
}

// Named palette colors (for base.extra)
export const blackColors = {
  black1: darkPalette[0]!,
  black2: darkPalette[1]!,
  black3: darkPalette[2]!,
  black4: darkPalette[3]!,
  black5: darkPalette[4]!,
  black6: darkPalette[5]!,
  black7: darkPalette[6]!,
  black8: darkPalette[7]!,
  black9: darkPalette[8]!,
  black10: darkPalette[9]!,
  black11: darkPalette[10]!,
  black12: darkPalette[11]!,
}

export const whiteColors = {
  white1: lightPalette[0]!,
  white2: lightPalette[1]!,
  white3: lightPalette[2]!,
  white4: lightPalette[3]!,
  white5: lightPalette[4]!,
  white6: lightPalette[5]!,
  white7: lightPalette[6]!,
  white8: lightPalette[7]!,
  white9: lightPalette[8]!,
  white10: lightPalette[9]!,
  white11: lightPalette[10]!,
  white12: lightPalette[11]!,
}

export const neutral = {
  neutral1: neutralPalette[0]!,
  neutral2: neutralPalette[1]!,
  neutral3: neutralPalette[2]!,
  neutral4: neutralPalette[3]!,
  neutral5: neutralPalette[4]!,
  neutral6: neutralPalette[5]!,
  neutral7: neutralPalette[6]!,
  neutral8: neutralPalette[7]!,
  neutral9: neutralPalette[8]!,
  neutral10: neutralPalette[9]!,
  neutral11: neutralPalette[10]!,
  neutral12: neutralPalette[11]!,
}

// Legacy palettes object (used by themes-new.ts, templates.tsx)
export const palettes = {
  dark: darkPalette,
  light: lightPalette,
  dark_blue: Object.values(blueDark),
  light_blue: Object.values(blue),
  dark_gray: Object.values(grayDark),
  light_gray: Object.values(gray),
  dark_green: Object.values(greenDark),
  light_green: Object.values(green),
  dark_red: Object.values(redDark),
  light_red: Object.values(red),
  dark_yellow: Object.values(yellowDark),
  light_yellow: Object.values(yellow),
}
