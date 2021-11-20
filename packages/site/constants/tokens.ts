import { createTokens } from 'tamagui'

import { darkColorsPostfixed, light } from './colors'

const space = {
  0: 0,
  1: 5,
  2: 10,
  3: 15,
  4: 20,
  5: 25,
  6: 35,
  7: 45,
  8: 60,
  9: 80,
  10: 100,
  true: 10,
  '-0': -0,
  '-1': -5,
  '-2': -10,
  '-3': -15,
  '-4': -20,
  '-5': -25,
  '-6': -35,
  '-7': -45,
  '-8': -60,
  '-9': -80,
  '-10': -100,
}

/*
 * Going to move font definitions to:
 *   font: { title: { family, size, lineHeight, letterSpace }, body: { ... }, [key: string]: { .... } }
 *
 *   further, de-normalizing would have two upsides and one downside:
 *     + ensures we share the same keys at definition
 *     + ensures types are easy to infer and always consistent
 *     - forces you to define them awkwardly
 *
 *      font: {
 *        0: { family, size, lineHeight, letterSpace }
 *        1:
 *      }
 *
 *   same with themes then too?
 *
 *     themes: {
 *       bg: { light, dark, ... },
 *       b2: { light, dark, ... }
 *     }
 *
 */

const fontSize = {
  1: 12,
  2: 14,
  3: 15,
  4: 16, // p
  5: 17, // h4
  6: 18, // h3
  7: 20,
  8: 21,
  9: 32, // h2
  10: 38, // h1
  11: 40,
  12: 55,
}

const lineHeight = {
  1: fontSize[0] * 1.4,
  2: fontSize[1] * 1.55,
  3: fontSize[2] * 1.65,
  4: fontSize[3] * 1.8,
  5: fontSize[4] * 1.85,
  6: fontSize[5] * 1.9,
  7: fontSize[6] * 1.95,
  8: fontSize[7] * 2,
  9: fontSize[8] * 2.1,
  10: fontSize[9] * 2.1,
  11: fontSize[10] * 2.4,
  12: fontSize[11] * 2.5,
}

const interFamily =
  'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

export const tokens = createTokens({
  letterSpace: {
    '-2': -2,
    '-1': -1,
    0: 0,
    1: 1,
    2: 2,
  },
  space,
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
  font: {
    title: interFamily,
    mono: 'Monospace',
    body: interFamily,
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
  size: space,
  fontSize,
  lineHeight,
})
