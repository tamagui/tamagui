import {
  blue,
  blueDark,
  gray,
  grayA,
  grayDark,
  grayDarkA,
  green,
  greenDark,
  orange,
  orangeDark,
  pink,
  pinkDark,
  purple,
  purpleDark,
  red,
  redDark,
  teal,
  tealDark,
  violet,
  violetDark,
  yellow,
  yellowDark,
} from '@tamagui/colors'
import { Variable, createTokens, createVariables } from '@tamagui/core'

// acknowledge you need more granularity with .5s
const sizeKeys = [
  'true',
  '0',
  '0.25',
  '0.5',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '3.5',
  '4',
  '4.5',
  '5',
  '5.5',
  '6',
  '6.5',
  '7',
  '7.5',
  '8',
  '8.5',
  '9',
  '9.5',
  '10',
  '11',
  '12',
  '13',
  '14',
] as const

// slightly more than double every 2 indices apart
const getSizeAt = (index: number) =>
  index === 0 ? 0 : Math.round(Math.pow(1.6, index)) + Math.floor(3 * index)

const size: {
  [key in typeof sizeKeys[any]]: number
} = Object.fromEntries(
  sizeKeys.map((key) => {
    return [key, getSizeAt(key === 'true' ? 4 : +key)]
  })
) as any

type Sizes = typeof size
type SizeKeys = keyof Sizes

const spaces = Object.entries(size).map(([k, v]) => [k, Math.round(v * 0.75)])
const spacesNegative = spaces.map(([k, v]) => [`-${k}`, -v])

const space: {
  [Key in `-${SizeKeys}` | SizeKeys]: Key extends keyof Sizes ? Sizes[Key] : number
} = {
  ...Object.fromEntries(spaces),
  ...Object.fromEntries(spacesNegative),
} as any

const zIndex = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
}

export const colorTokens = createVariables({
  light: {
    blue,
    gray,
    grayA,
    green,
    orange,
    pink,
    purple,
    red,
    violet,
    yellow,
    teal,
  },
  dark: {
    blue: blueDark,
    gray: grayDark,
    grayA: grayDarkA,
    green: greenDark,
    orange: orangeDark,
    pink: pinkDark,
    purple: purpleDark,
    red: redDark,
    violet: violetDark,
    yellow: yellowDark,
    teal: tealDark,
  },
})

export const darkColors = darkPostfix({
  ...colorTokens.dark.blue,
  ...colorTokens.dark.gray,
  ...colorTokens.dark.grayA,
  ...colorTokens.dark.green,
  ...colorTokens.dark.orange,
  ...colorTokens.dark.pink,
  ...colorTokens.dark.purple,
  ...colorTokens.dark.red,
  ...colorTokens.dark.violet,
  ...colorTokens.dark.yellow,
  ...colorTokens.dark.teal,
})

export const lightColors = {
  ...colorTokens.light.blue,
  ...colorTokens.light.gray,
  ...colorTokens.light.grayA,
  ...colorTokens.light.green,
  ...colorTokens.light.orange,
  ...colorTokens.light.pink,
  ...colorTokens.light.purple,
  ...colorTokens.light.red,
  ...colorTokens.light.violet,
  ...colorTokens.light.yellow,
  ...colorTokens.light.teal,
}

const allColors = {
  ...lightColors,
  ...darkColors,
}

function darkPostfix<A extends { [key: string]: Variable<string> }>(
  obj: A
): {
  [Key in `${keyof A extends string ? keyof A : never}Dark`]: Variable<string>
} {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [`${k}Dark`, v])) as any
}

const radius = {
  0: 0,
  1: 3,
  2: 5,
  3: 7,
  4: 9,
  5: 10,
  6: 16,
  7: 19,
  8: 22,
  9: 26,
  10: 34,
  11: 42,
  12: 50,
}

export const tokens = createTokens({
  color: allColors,
  radius,
  zIndex,
  space,
  size,
})
