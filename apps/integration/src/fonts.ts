import { createFont } from '@tamagui/core'

export const fonts = {
  body: createFont({
    family: `Helvetica`,
    size: {
      2: 12,
      3: 14,
      4: 16,
      5: 18,
      7: 22,
      8: 26,
      9: 32,
      10: 38,
    },
    letterSpacing: {},
    weight: {
      4: '400',
    },
    lineHeight: {
      2: 15,
      3: 17,
      4: 20,
      5: 24,
      7: 29,
      8: 33,
      9: 39,
      10: 46,
    },
  }),

  heading: createFont({
    family: `Helvetica`,
    size: {
      2: 16,
      3: 20,
      4: 24,
      5: 28,
      6: 32,
      7: 40,
      8: 48,
      9: 56,
      10: 66,
    },
    letterSpacing: {},
    lineHeight: {
      2: 1.5 * 16,
      3: 1.5 * 20,
      4: 1.5 * 24,
      5: 1.5 * 28,
      6: 1.5 * 32,
      7: 1.5 * 40,
      8: 1.5 * 48,
      9: 1.5 * 56,
      10: 1.5 * 66,
    },
    transform: {
      5: 'uppercase',
      6: 'none',
    },
    weight: {
      4: '400',
      5: '700',
    },
  }),
}
