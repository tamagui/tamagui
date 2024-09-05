import type { GenericFont } from '@tamagui/web'
import { createFont } from '@tamagui/web'

export const createGluspFont = <A extends GenericFont>(font: Partial<A> = {}): A => {
  return createFont({
    family: 'Glusp',
    size,
    lineHeight: Object.fromEntries(
      Object.entries(font.size || size).map(([k, v]) => [
        k,
        typeof v === 'number' ? v * 1.2 + 6 : v,
      ])
    ) as typeof size,
    weight: {
      4: '400',
    },
    ...(font as any),
  })
}

const size = {
  1: 3 * 11,
  2: 3 * 12,
  3: 3 * 13,
  4: 3 * 14,
  5: 3 * 15,
  6: 3 * 16,
  7: 3 * 18,
  8: 3 * 21,
  9: 3 * 28,
  10: 3 * 42,
  11: 3 * 52,
  12: 3 * 62,
  13: 3 * 72,
  14: 3 * 92,
  15: 3 * 114,
  16: 3 * 124,
} as const
