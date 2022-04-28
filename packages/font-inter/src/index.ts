import { GenericFont, createFont } from '@tamagui/core'
import { Platform } from 'react-native'

export const createInterFont = <A extends GenericFont<keyof typeof size>>(
  font: Partial<A> = {}
): A => {
  const size = {
    1: 10,
    2: 12,
    3: 14,
    4: 15,
    5: 16,
    6: 17,
    7: 21,
    8: 25,
    9: 30,
    10: 45,
    11: 58,
    12: 68,
    13: 76,
    14: 102,
    15: 124,
    16: 144,
  } as const

  return createFont({
    family:
      Platform.OS == 'web'
        ? 'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        : 'Inter',
    size,
    lineHeight: {
      1: 15,
      2: 20,
      3: 25,
      4: 27,
      5: 29,
      6: 31,
      7: 34,
      8: 38,
      9: 42,
      10: 54,
      11: 72,
      12: 80,
      13: 90,
      14: 120,
      15: 150,
      16: 170,
    },
    weight: {
      4: '300',
      7: '600',
      8: '700',
    },
    letterSpacing: {
      4: 0,
      7: 0,
      8: -1,
      9: -2,
      10: -2,
      11: -3,
      12: -4,
      13: -5,
      14: -6,
      15: -7,
    },
    ...(font as any),
  })
}
