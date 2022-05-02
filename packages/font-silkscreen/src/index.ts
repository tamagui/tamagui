import { GenericFont, createFont } from '@tamagui/core'
import { Platform } from 'react-native'

export const createSilkscreenFont = <A extends GenericFont<keyof typeof size>>(
  font: Partial<A> = {}
): A => {
  return createFont({
    family:
      Platform.OS == 'web'
        ? 'Silkscreen, Fira Code, Monaco, Consolas, Ubuntu Mono, monospace'
        : 'Silkscreen',
    size,
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [k, v * 1.1 + 12])
    ) as typeof size,
    weight: {
      4: '300',
    },
    letterSpacing: {
      4: 0,
      5: 1,
      6: 2,
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
