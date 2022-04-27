import { allLightColors, darkColorsPostfixed } from './colors'

export const size = {
  true: 20, // for space boolean true
  0: 0,
  '0.5': 2,
  1: 6,
  2: 10,
  3: 15,
  4: 20,
  5: 25,
  6: 30,
  7: 40,
  8: 50,
  9: 65,
  10: 75,
  11: 85,
  12: 100,
} as const

type Sizes = typeof size
type SizeKeys = keyof Sizes

export const space: {
  [Key in `-${SizeKeys}` | SizeKeys]: Key extends keyof Sizes ? Sizes[Key] : number
} = {
  ...size,
  ...Object.fromEntries(Object.entries(size).map(([k, v]) => [`-${k}`, -v])),
} as any

export const zIndex = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500,
}

export const color = {
  ...allLightColors,
  ...darkColorsPostfixed,
}

export const radius = {
  0: 0,
  1: 3,
  2: 5,
  3: 7,
  4: 9,
  5: 10,
  6: 12,
  7: 16,
  8: 20,
  9: 30,
}
