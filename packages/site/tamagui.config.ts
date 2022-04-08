import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/theme-base'
import { createTamagui } from 'tamagui'

import { animations } from './constants/animations'
import { media } from './constants/media'

const config = createTamagui({
  animations,
  defaultTheme: 'light',
  shorthands,
  themes,
  tokens,
  media,
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
