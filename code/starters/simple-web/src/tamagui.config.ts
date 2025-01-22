import { media, shorthands, themes, tokens } from '@tamagui/config/v4'
import { createTamagui } from '@tamagui/core'

import { animations } from './animations'
import { fonts } from './fonts'

const config = createTamagui({
  defaultFont: 'body',
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts,
  themes,
  tokens,
  media,
})

type AppConfig = typeof config

declare module 'tamagui' {
  // overrides TamaguiCustomConfig so that custom types
  // work everywhere `tamagui` is imported
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
