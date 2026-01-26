import type { FillInFont, GenericFont } from '@tamagui/core'
import { createFont, getVariableValue } from '@tamagui/core'

const isWeb = process.env.TAMAGUI_TARGET === 'web'
const isNative = process.env.TAMAGUI_TARGET === 'native'

// web sizes
const webSizes = {
  1: 12,
  2: 13,
  3: 14,
  4: 15,
  true: 15,
  5: 16,
  6: 18,
  7: 22,
  8: 26,
  9: 30,
  10: 40,
  11: 46,
  12: 52,
  13: 60,
  14: 70,
  15: 85,
  16: 100,
} as const

// native sizes aligned with iOS HIG (SF Pro)
// 4/true = body (17pt), 3 = subheadline (15pt), 2 = caption (12pt)
const nativeSizes = {
  1: 11,
  2: 12,
  3: 15,
  4: 17,
  true: 17,
  5: 20,
  6: 22,
  7: 24,
  8: 28,
  9: 32,
  10: 40,
  11: 46,
  12: 52,
  13: 60,
  14: 70,
  15: 85,
  16: 100,
} as const

const defaultSizes = isNative ? nativeSizes : webSizes

// line height: native ~125% per iOS HIG, web ~160%
const defaultLineHeight = (size: number) =>
  Math.round(isNative ? size * 1.25 : size * 1.05 + 8)

export const createSystemFont = <A extends GenericFont>({
  font = {},
  sizeLineHeight = defaultLineHeight,
  sizeSize = (size) => Math.round(size),
}: {
  font?: Partial<A>
  sizeLineHeight?: (fontSize: number) => number
  sizeSize?: (size: number) => number
} = {}): FillInFont<A, keyof typeof webSizes> => {
  // merge to allow individual overrides
  const size = Object.fromEntries(
    Object.entries({
      ...defaultSizes,
      ...font.size,
    }).map(([k, v]) => [k, sizeSize(+v)])
  )
  return createFont({
    family: isWeb
      ? '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'System',
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [k, sizeLineHeight(getVariableValue(v))])
    ),
    weight: {
      1: '400',
    },
    letterSpacing: {
      4: 0,
    },
    ...(font as any),
    size,
  })
}

// heading line height: native ~120%, web original
const headingLineHeight = (size: number) =>
  Math.round(isNative ? size * 1.2 : size * 1.12 + 5)

export const fonts = {
  body: createSystemFont(),
  heading: createSystemFont({
    sizeLineHeight: headingLineHeight,
  }),
}
