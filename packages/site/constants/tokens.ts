import { createFont, createTokens } from 'tamagui'

import { darkColorsPostfixed, light } from './colors'

const size = {
  0: 2,
  1: 6,
  2: 10,
  3: 15,
  4: 20,
  5: 25,
  6: 30,
  7: 40,
  8: 50,
  9: 65,
  10: 75,
  true: 10,
}

const space = {
  ...size,
  '-0': -0,
  '-1': -5,
  '-2': -10,
  '-3': -15,
  '-4': -20,
  '-5': -25,
  '-6': -30,
  '-7': -40,
  '-8': -50,
  '-9': -75,
  '-10': -100,
}

const interFont = createFont({
  family:
    'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  size: {
    1: 10,
    2: 12,
    3: 14,
    4: 15,
    5: 17,
    6: 18,
    7: 24,
    8: 29,
    9: 38,
    10: 44,
    11: 68,
    12: 76,
  },
  lineHeight: {
    1: 15,
    2: 20,
    3: 23,
    4: 25,
    5: 30,
    6: 31,
    7: 35,
    8: 42,
    9: 48,
    10: 56,
    11: 75,
    12: 88,
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

const monoFont = createFont({
  family: 'Monospace',
  size: {
    1: 10,
    2: 11,
    3: 12,
    4: 13,
    5: 16,
    6: 18,
  },
  lineHeight: {
    1: 15,
    2: 20,
    3: 22,
    4: 23,
    5: 24,
    6: 26,
  },
  weight: {
    4: '300',
    6: '700',
  },
  letterSpacing: {
    4: 0,
  },
})

export const tokens = createTokens({
  size,
  space,
  font: {
    title: interFont,
    body: interFont,
    mono: monoFont,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
  color: {
    ...light,
    ...darkColorsPostfixed,
  },
  radius: {
    0: 0,
    1: 3,
    2: 5,
    3: 10,
    4: 15,
    5: 20,
  },
})
