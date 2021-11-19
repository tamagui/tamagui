import { createTamagui, createTokens } from 'tamagui'

export const tokens = createTokens({
  letterSpace: {
    0: 0,
    1: 1,
    2: 2,
  },
  space: {
    0: 0,
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    true: 10,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
  },
  font: {
    title: 'Mono',
    body: 'Monospace',
  },
  color: {},
  radius: {
    0: 0,
    1: 3,
    2: 5,
    3: 10,
    4: 15,
  },
  size: {
    0: 0,
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    true: 10,
  },
  fontSize: {
    1: 12,
    2: 14,
    3: 15,
    4: 16,
  },
  lineHeight: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
  },
})

const config = createTamagui({
  defaultTheme: 'light',
  themes: {
    light: {
      bg: '#fff',
      bg2: '#eee',
      color: '#000',
      color2: '#111',
      borderColor: '#111',
    },
    dark: {
      color: '#fff',
      color2: '#eee',
      bg: '#000',
      bg2: '#111',
      borderColor: '#111',
    },
  },
  tokens,
  media: {
    xs: { maxWidth: 660 },
    gtXs: { minWidth: 660 + 1 },
    sm: { maxWidth: 860 },
    gtSm: { minWidth: 860 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
})

module.exports = config
