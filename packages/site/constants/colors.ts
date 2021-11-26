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
] as const

export const light = {
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
}

export const dark = {
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
}

export const darkColorsPostfixed = Object.fromEntries(
  // Dark
  Object.entries(dark).map(([k, v]) => [`${k}Dark`, v])
) as {
  [key in `${keyof typeof dark}Dark`]: string
}

export type ColorNamesLight = keyof typeof light
export type ColorNamesDark = keyof typeof dark

export const colorNamesLight = Object.keys(light) as ColorNamesLight[]
export const colorNamesDark = Object.keys(dark) as ColorNamesDark[]
