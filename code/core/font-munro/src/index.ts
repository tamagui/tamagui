import type { GenericFont } from '@tamagui/core'
import { createFont, isWeb } from '@tamagui/core'

export const createMunroFont = <A extends GenericFont>(font: Partial<A> = {}): A => {
  return createFont({
    family: isWeb
      ? 'Munro, Munro-fallback, "Fira Code", Monaco, Consolas, "Ubuntu Mono", monospace'
      : 'Munro',
    size,
    lineHeight: Object.fromEntries(
      Object.entries(font.size || size).map(([k, v]) => [
        k,
        typeof v === 'number' ? Math.round(v * 1.2 + 6) : v,
      ])
    ) as typeof size,
    weight: {
      4: '400',
    },
    ...(font as any),
  })
}

const size = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  5: 15,
  6: 16,
  7: 18,
  8: 21,
  9: 28,
  10: 42,
  11: 52,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 124,
} as const
