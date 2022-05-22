import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { color, radius, size, space, themes, zIndex } from '@tamagui/theme-base'
import { createTamagui, createTokens } from 'tamagui'

import { animations } from './animations.reanimated'

const interFont = createInterFont()

const config = createTamagui({
  fonts: {
    heading: interFont,
    body: interFont,
  },
  animations,
  defaultTheme: 'light',
  shorthands,
  themes,
  tokens: createTokens({
    size,
    space,
    zIndex,
    color,
    radius,
  }),
  media: {
    xs: { maxWidth: 660 },
    gtXs: { minWidth: 660 + 1 },
    sm: { maxWidth: 860 },
    gtSm: { minWidth: 860 + 1 },
    md: { minWidth: 980 },
    gtMd: { minWidth: 980 + 1 },
    lg: { minWidth: 1120 },
    gtLg: { minWidth: 1120 + 1 },
    xl: { minWidth: 1280 },
  },
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
