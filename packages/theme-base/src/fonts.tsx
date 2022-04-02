import { createFont } from '@tamagui/core'

export const interFont = createFont({
  family:
    'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  size: {
    1: 10,
    2: 12,
    3: 14,
    4: 15,
    5: 17,
    6: 18,
    7: 22,
    8: 24,
    9: 34,
    10: 48,
    11: 62,
    12: 76,
  },
  lineHeight: {
    1: 15,
    2: 20,
    3: 23,
    4: 26,
    5: 27,
    6: 30,
    7: 36,
    8: 40,
    9: 46,
    10: 53,
    11: 75,
    12: 84,
  },
  weight: {
    4: '300',
    7: '600',
    8: '700',
  },
  letterSpacing: {
    4: 0,
    7: -1,
    9: -2,
    10: -3,
    12: -4,
  },
})

export const monoFont = createFont({
  family: 'Monospace',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 15,
    6: 16,
    7: 17,
  },
  lineHeight: {
    1: 15,
    2: 18,
    3: 19,
    4: 20,
    5: 22,
    6: 24,
  },
  weight: {
    4: '300',
    6: '700',
  },
  letterSpacing: {
    4: 0,
  },
})
