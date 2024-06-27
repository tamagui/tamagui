import type { FillInFont, GenericFont } from '@tamagui/core'
import { createFont, isWeb } from '@tamagui/core'

export const createSilkscreenFont = <A extends GenericFont>(
  font: Partial<A> = {}
): FillInFont<A, keyof typeof size> => {
  return createFont({
    family: isWeb
      ? 'Silkscreen, Fira Code, Monaco, Consolas, Ubuntu Mono, monospace'
      : 'Silkscreen',
    size,
    lineHeight: Object.fromEntries(
      Object.entries(font.size || size).map(([k, v]) => [
        k,
        typeof v === 'number' ? Math.round(v * 1.2 + 6) : v,
      ])
    ) as typeof size,
    weight: {
      4: '300',
    },
    letterSpacing: {
      4: 1,
      5: 3,
      6: 3,
      9: -2,
      10: -3,
      12: -4,
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
