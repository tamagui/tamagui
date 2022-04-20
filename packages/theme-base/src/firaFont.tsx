import { createFont } from '@tamagui/core'

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
}

export const firaFont = createFont({
  family: 'Fira Code, Monaco, Consolas, Ubuntu Mono, monospace',
  size,
  lineHeight: Object.fromEntries(
    Object.entries(size).map(([k, v]) => [k, v * 1.75])
  ) as typeof size,
  weight: {
    4: '300',
    6: '700',
  },
  letterSpacing: {
    4: 0,
  },
})
