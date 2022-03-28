import * as Colors from '@tamagui/colors'

// nice and flat

export const colorNames = [
  'blue',
  'gray',
  'green',
  'indigo',
  'orange',
  'pink',
  'purple',
  'red',
  'violet',
  'yellow',
  'teal',
] as const

export const allLightColors = {
  ...Colors.blue,
  ...Colors.gray,
  ...Colors.grayA,
  ...Colors.green,
  ...Colors.indigo,
  ...Colors.orange,
  ...Colors.pink,
  ...Colors.purple,
  ...Colors.red,
  ...Colors.violet,
  ...Colors.yellow,
  ...Colors.teal,
}

export const allDarkColors = {
  ...Colors.blueDark,
  ...Colors.grayDark,
  ...Colors.grayDarkA,
  ...Colors.greenDark,
  ...Colors.indigoDark,
  ...Colors.orangeDark,
  ...Colors.pinkDark,
  ...Colors.purpleDark,
  ...Colors.redDark,
  ...Colors.violetDark,
  ...Colors.yellowDark,
  ...Colors.tealDark,
}

export const darkColorsPostfixed = Object.fromEntries(
  // Dark
  Object.entries(allDarkColors).map(([k, v]) => [`${k}Dark`, v])
) as {
  [key in `${keyof typeof allDarkColors}Dark`]: string
}

export type ColorNamesLight = keyof typeof allLightColors
export type ColorNamesDark = keyof typeof allDarkColors

export const colorNamesLight = Object.keys(allLightColors) as ColorNamesLight[]
export const colorNamesDark = Object.keys(allDarkColors) as ColorNamesDark[]
