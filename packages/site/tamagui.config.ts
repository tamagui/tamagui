import { createFiraMonoFont } from '@tamagui/font-fira-mono'
import { createInterFont } from '@tamagui/font-inter'
import { createSilkscreenFont } from '@tamagui/font-silkscreen'
import { shorthands } from '@tamagui/shorthands'
import { color, radius, size, space, themes, zIndex } from '@tamagui/theme-base'
import { createTamagui, createTokens } from 'tamagui'

import { animations } from './constants/animations'
import { media } from './constants/media'

const silkscreenFont = createSilkscreenFont()
const headingFont = createInterFont({
  size: {
    6: 15,
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
    8: -1,
    9: -2,
    10: -3,
    12: -4,
    14: -5,
    15: -6,
  },
})
const bodyFont = createInterFont(
  {},
  {
    sizeSize: (size) => size * 1.1,
    sizeLineHeight: (size) => size + (size > 20 ? 9 : 14),
  }
)
const firaFont = createFiraMonoFont()

const tokens = createTokens({
  size,
  space,
  zIndex,
  color,
  radius,
})

const config = createTamagui({
  defaultTheme: 'light',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  animations,
  media,
  shorthands,
  themes,
  tokens,
  fonts: {
    heading: headingFont,
    body: bodyFont,
    mono: firaFont,
    silkscreen: silkscreenFont,
  },
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
