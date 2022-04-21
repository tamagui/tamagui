import { createFont } from '@tamagui/core'

const size = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  5: 15,
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

export const silkscreenFont = createFont({
  family: 'Silkscreen, Fira Code, Monaco, Consolas, Ubuntu Mono, monospace',
  size,
  lineHeight: Object.fromEntries(Object.entries(size).map(([k, v]) => [k, v * 1.5])) as typeof size,
  weight: {
    4: '300',
  },
  letterSpacing: {
    4: 0,
    5: 1,
    6: 2,
  },
})
