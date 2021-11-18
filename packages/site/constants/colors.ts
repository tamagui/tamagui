import * as Colors from '@tamagui/colors'

// nice and flat

export const light = {
  // ...Colors.amber,
  ...Colors.blue,
  // ...Colors.bronze,
  // ...Colors.brown,
  // ...Colors.crimson,
  // ...Colors.cyan,
  // ...Colors.gold,
  // ...Colors.grass,
  ...Colors.gray,
  ...Colors.grayA,
  ...Colors.green,
  ...Colors.indigo,
  // ...Colors.lime,
  // ...Colors.mauve,
  // ...Colors.mint,
  // ...Colors.olive,
  ...Colors.orange,
  ...Colors.pink,
  // ...Colors.plum,
  ...Colors.purple,
  ...Colors.red,
  // ...Colors.sage,
  // ...Colors.sand,
  // ...Colors.sky,
  // ...Colors.slate,
  // ...Colors.teal,
  // ...Colors.tomato,
  ...Colors.violet,
  ...Colors.yellow,
}

export const dark = {
  // ...Colors.amberDark,
  ...Colors.blueDark,
  // ...Colors.bronzeDark,
  // ...Colors.brownDark,
  // ...Colors.crimsonDark,
  // ...Colors.cyanDark,
  // ...Colors.goldDark,
  // ...Colors.grassDark,
  ...Colors.grayDark,
  ...Colors.grayDarkA,
  ...Colors.greenDark,
  ...Colors.indigoDark,
  // ...Colors.limeDark,
  // ...Colors.mauveDark,
  // ...Colors.mintDark,
  // ...Colors.oliveDark,
  ...Colors.orangeDark,
  ...Colors.pinkDark,
  // ...Colors.plumDark,
  ...Colors.purpleDark,
  ...Colors.redDark,
  // ...Colors.sageDark,
  // ...Colors.sandDark,
  // ...Colors.skyDark,
  // ...Colors.slateDark,
  // ...Colors.tealDark,
  // ...Colors.tomatoDark,
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
