import { createInterFont } from '@tamagui/font-inter'
import { createFont } from 'tamagui'

const heading = createInterFont(
  {
    size: {
      5: 13,
      6: 15,
      9: 32,
      10: 48,
    },
    transform: {
      6: 'uppercase',
      7: 'none',
    },
    weight: {
      6: '400',
      7: '700',
    },
    color: {
      6: '$colorFocus',
      7: '$color',
    },
    letterSpacing: {
      5: 2,
      6: 1,
      7: 0,
      8: 0,
      9: -1,
      10: -1.5,
      12: -2,
      14: -3,
      15: -4,
    },
    // for native
    face: {
      700: { normal: 'InterBold' },
      800: { normal: 'InterBold' },
      900: { normal: 'InterBold' },
    },
  },
  { sizeLineHeight: (size) => Math.round(size * 1.1 + (size < 30 ? 10 : 5)) }
)

const body = createInterFont(
  {
    weight: {
      1: '400',
      7: '600',
    },
  },
  {
    sizeSize: (size) => Math.round(size),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size >= 12 ? 10 : 4)),
  }
)

const perfectlyNineties = createFont({
  family: '"Perfectly Nineties", "Times New Roman", serif',
  size: {
    4: 18,
    5: 24,
    6: 30,
    7: 38,
    8: 48,
    9: 58,
    10: 68,
  },
  weight: {
    0: '400',
  },
  letterSpacing: {
    0: 0,
  },
})

const mono = createFont({
  ...body,
  family: 'monospace',
})

export const fonts = {
  heading,
  body,
  mono,
  perfectlyNineties,
}
