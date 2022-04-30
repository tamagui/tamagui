import { GenericFont, createFont } from '@tamagui/core'
import { Platform } from 'react-native'

export const createFiraMonoFont = <A extends GenericFont<keyof typeof size>>(
  font: Partial<A> = {}
): A => {
  return createFont({
    family: Platform.OS == 'web' ? 'Fira Code, Monaco, Consolas, Ubuntu Mono, monospace' : 'Fira',
    size,
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [k, v * 1.4])
    ) as typeof size,
    weight: {
      4: '300',
      6: '700',
    },
    letterSpacing: {
      4: 0,
    },

    ...(font as any),
  })
}

const size = {
  1: 10,
  2: 11,
  3: 12,
  4: 13,
  5: 14,
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
