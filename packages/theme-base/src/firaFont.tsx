import { createFont } from '@tamagui/core'

export const firaFont = createFont({
  family: 'Fira Code, Monaco, Consolas, Ubuntu Mono, monospace',
  size: {
    1: 10,
    2: 11,
    3: 12,
    4: 13,
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
