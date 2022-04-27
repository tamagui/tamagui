import { GenericFont, createFont } from '@tamagui/core'
import { Platform } from 'react-native'

export const createInterFont = <A extends GenericFont>(font: Partial<A> = {}): A => {
  return createFont({
    family:
      Platform.OS == 'web'
        ? 'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        : 'Inter',
    size: {
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
      13: 82,
      14: 102,
      15: 124,
      16: 144,
    },
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
      13: 100,
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
      10: -3,
      11: -4,
      12: -5,
      13: -6,
      14: -7,
      15: -8,
    },
    ...(font as any),
  })
}
