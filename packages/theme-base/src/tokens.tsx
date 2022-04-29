import { allLightColors, darkColorsPostfixed } from '@tamagui/colors'

// acknowledge you need more granularity at the smaller sizes with .5s
// prettier-ignore
export const sizeKeys = ['true', '0', '0.25', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '9', '10', '11', '12', '13', '14'] as const

// slightly more than double every 2 indices apart
export const getSizeAt = (index: number) =>
  index === 0 ? 0 : Math.round(Math.pow(1.6, index)) + Math.floor(3 * index)

export const size: {
  [key in typeof sizeKeys[any]]: number
} = Object.fromEntries(
  sizeKeys.map((key) => {
    return [key, getSizeAt(key === 'true' ? 4 : +key)]
  })
) as any

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
