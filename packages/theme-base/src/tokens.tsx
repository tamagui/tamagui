import { createTokens } from '@tamagui/core'

import { allLightColors, darkColorsPostfixed } from './colors'
import { interFont, monoFont } from './fonts'

const size = {
  true: 10, // for space boolean true
  '0.5': 1,
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
  11: 85,
  12: 100,
}

const space = {
  ...size,
  ...Object.fromEntries(Object.entries(size).map(([k, v]) => [`-${k}`, -v])),
}

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
    ...allLightColors,
    ...darkColorsPostfixed,
  },
  radius: {
    0: 0,
    1: 3,
    2: 5,
    3: 7,
    4: 9,
    5: 10,
    6: 12,
    7: 16,
    8: 20,
    9: 30,
  },
})
