import type { GenericFont } from '@tamagui/web'
import { createFont } from '@tamagui/web'

const genericFontSizes = {
  1: 10,
  2: 11,
  3: 12,
  4: 14,
  5: 15,
  6: 16,
  7: 20,
  8: 22,
  9: 30,
  10: 42,
  11: 52,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 124,
} as const

export function createGenericFont<A extends GenericFont<keyof typeof genericFontSizes>>(
  family: string,
  font: Partial<A> = {},
  {
    sizeLineHeight = (val) => val * 1.35,
  }: {
    sizeLineHeight?: (val: number) => number
  } = {}
): A {
  const size = font.size || genericFontSizes
  return createFont({
    family,
    size,
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [k, sizeLineHeight(+v)])
    ) as typeof size,
    weight: { 0: '300' },
    letterSpacing: { 4: 0 },
    ...(font as any),
  })
}
