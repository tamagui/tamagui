import { GenericFont, createFont } from '@tamagui/core'
import { Platform } from 'react-native'

export const createInterFont = <A extends GenericFont<keyof typeof size>>(
  font: Partial<A> = {}
): A => {
  return createFont({
    family:
      Platform.OS == 'web'
        ? 'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        : 'Inter',
    size,
    lineHeight: Object.fromEntries(
      Object.entries(font.size || size).map(([k, v]) => [k, v * 1.1 + 8])
    ),
    weight: {
      4: '300',
    },
    letterSpacing: {
      4: 0,
    },
    ...(font as any),
  })
}

const size = {
  1: 10,
  2: 12,
  3: 14,
  4: 15,
  5: 16,
  6: 17,
  7: 21,
  8: 26,
  9: 32,
  10: 45,
  11: 58,
  12: 64,
  13: 76,
  14: 102,
  15: 124,
  16: 144,
} as const
