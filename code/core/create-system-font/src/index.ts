import type { FillInFont, GenericFont } from '@tamagui/core'
import { createFont, getVariableValue } from '@tamagui/core'

type SystemFontSizes = Record<string | number, number>
type SystemFontKeys<Sizes extends SystemFontSizes> = keyof Sizes & (string | number)

type CreateSystemFontOptions<A extends GenericFont, Sizes extends SystemFontSizes> = {
  font?: Partial<A>
  sizes?: Sizes
  sizeLineHeight?: (fontSize: number) => number
  sizeSize?: (size: number) => number
  family?: string
  weight?: GenericFont['weight']
  letterSpacing?: GenericFont['letterSpacing']
}

const isWeb = process.env.TAMAGUI_TARGET === 'web'
const isNative = process.env.TAMAGUI_TARGET === 'native'

export const systemFontFamily = {
  web: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  native: 'System',
} as const

export const webSystemFontSizes = {
  1: 12,
  2: 13,
  3: 14,
  4: 15,
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

export const nativeSystemFontSizes = {
  1: 11,
  2: 12,
  3: 15,
  4: 17,
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

export const defaultSystemFontSizes:
  | typeof nativeSystemFontSizes
  | typeof webSystemFontSizes = isNative ? nativeSystemFontSizes : webSystemFontSizes

export const defaultSystemFontLineHeight = (size: number): number => {
  if (isNative) return Math.round(size + 5)
  const ratio = 1.5 - Math.max(0, (size - 20) * 0.004)
  return Math.round(size * ratio)
}

export const createSystemFont = <
  A extends GenericFont,
  Sizes extends SystemFontSizes = typeof webSystemFontSizes,
>(
  options: CreateSystemFontOptions<A, Sizes> = {}
): FillInFont<A, SystemFontKeys<Sizes>> => {
  const {
    sizeLineHeight = defaultSystemFontLineHeight,
    sizeSize = (size) => Math.round(size),
    family = isWeb ? systemFontFamily.web : systemFontFamily.native,
    weight = {
      1: '400',
    },
    letterSpacing = {
      4: 0,
    },
  } = options
  const font = options.font
  const sizes = options.sizes ?? defaultSystemFontSizes
  const fontSizes = font?.size ?? {}

  const size = Object.fromEntries(
    Object.entries({
      ...sizes,
      ...fontSizes,
    }).map(([key, value]) => [key, sizeSize(+value)])
  )

  return createFont({
    family,
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([key, value]) => [
        key,
        sizeLineHeight(getVariableValue(value)),
      ])
    ),
    weight,
    letterSpacing,
    ...(font as any),
    size,
  }) as FillInFont<A, SystemFontKeys<Sizes>>
}
