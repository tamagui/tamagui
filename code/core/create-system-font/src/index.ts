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

// the whole ramp from one equation. each step is a little bigger than the one
// before it, 8% at the UI sizes easing up to 19% at the display sizes, because
// small text wants about a point between steps and big text wants a proportion.
// the tables this replaced had cliffs: web went 30 to 40 from size 9 to 10, a
// 33% step sitting between two 15% ones, and native jumped 25% from 2 to 3.
export type SystemFontScale = Record<
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16,
  number
>

const ramp = (start: number): SystemFontScale => {
  const out: Record<number, number> = {}
  let px = start
  for (let i = 1; i <= 16; i++) {
    out[i] = Math.round(px)
    px *= Math.min(1.19, 1.05 + i * 0.019)
  }
  return out as SystemFontScale
}

// 11 12 13 14 16 18 21 25 30 36 42 50 60 71 85 101
export const webSystemFontSizes: SystemFontScale = ramp(11)

// 13 14 15 17 19 22 25 30 35 42 50 60 71 84 100 119
export const nativeSystemFontSizes: SystemFontScale = ramp(13)

export const defaultSystemFontSizes: SystemFontScale = isNative
  ? nativeSystemFontSizes
  : webSystemFontSizes

// eases from about 1.6x at label sizes to 1.35x at display sizes. native runs
// tighter because its text box has no half leading above the cap line
export const defaultSystemFontLineHeight = (size: number): number =>
  isNative ? Math.round(size * 1.2 + 4) : Math.round(size * 1.35 + 3)

// the v5 config pins these so upgrading the package does not resize a v5 app
export const v5WebSystemFontSizes = {
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

export const v5NativeSystemFontSizes = {
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

export const v5SystemFontSizes:
  | typeof v5NativeSystemFontSizes
  | typeof v5WebSystemFontSizes = isNative
  ? v5NativeSystemFontSizes
  : v5WebSystemFontSizes

export const v5SystemFontLineHeight = (size: number): number => {
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
