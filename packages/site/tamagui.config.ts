import { createNotoFont } from '@takeout/font-noto-emoji'
import { createInterFont } from '@tamagui/font-inter'
import { createSilkscreenFont } from '@tamagui/font-silkscreen'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/theme-base'
import { createTamagui } from 'tamagui'

import { animations } from './constants/animations'
import { media } from './constants/media'
import { createGenericFont } from './lib/createGenericFont'

const notoFont = createNotoFont()
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
    10: -2,
    12: -3,
    14: -4,
    15: -5,
  },
})
const bodyFont = createInterFont(
  {},
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
  }
)
const monoFont = createGenericFont(
  `"ui-monospace", "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`
)

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
    noto: notoFont as any,
    heading: headingFont,
    body: bodyFont,
    mono: monoFont,
    silkscreen: silkscreenFont,
  },
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
