import { createCherryBombFont } from '@tamagui/font-cherry-bomb'
import { createInterFont } from '@tamagui/font-inter'
import { createSilkscreenFont } from '@tamagui/font-silkscreen'
import { createGenericFont } from './createGenericFont'

export const cherryBombFont = createCherryBombFont({
  family: '"Cherry Bomb", Arial, sans-serif',
})
export const silkscreenFont = createSilkscreenFont()
export const headingFont = createInterFont(
  {
    size: {
      5: 13,
      6: 15,
      9: 30,
      10: 44,
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
      9: -0.1,
      10: -0.25,
      11: -0.5,
      12: -0.75,
      14: -1,
      15: -2,
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

export const bodyFont = createInterFont(
  {
    weight: {
      1: '400',
    },
  },
  {
    sizeSize: (size) => Math.round(size),
    sizeLineHeight: (size) => Math.round(size * 1.2 + (size >= 20 ? 12 : 8)),
  }
)

export const monoFont = createGenericFont(
  `"Berkeley Mono", "ui-monospace", "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`,
  {
    weight: {
      1: '400',
    },
    size: {
      1: 11,
      2: 12,
      3: 13,
      4: 14,
      5: 16,
      6: 18,
      7: 20,
      8: 22,
      9: 24,
      10: 32,
      11: 46,
      12: 62,
      13: 72,
      14: 92,
      15: 114,
      16: 124,
    },
  },
  {
    sizeLineHeight: (x) => x * 1.5 + 2,
  }
)
