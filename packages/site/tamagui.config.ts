import { createFiraMonoFont } from '@tamagui/font-fira-mono'
import { createInterFont } from '@tamagui/font-inter'
import { createSilkscreenFont } from '@tamagui/font-silkscreen'
import { shorthands } from '@tamagui/shorthands'
import { color, radius, size, space, themes, zIndex } from '@tamagui/theme-base'
import { createTamagui, createTokens } from 'tamagui'

import { animations } from './constants/animations'
import { media } from './constants/media'

const silkscreenFont = createSilkscreenFont()
const interFont = createInterFont()
const firaFont = createFiraMonoFont()

const config = createTamagui({
  animations,
  defaultTheme: 'light',
  shorthands,
  themes,
  tokens: createTokens({
    font: {
      title: interFont,
      body: interFont,
      mono: firaFont,
      silkscreen: silkscreenFont,
    },
    size,
    space,
    zIndex,
    color,
    radius,
  }),
  media,
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
