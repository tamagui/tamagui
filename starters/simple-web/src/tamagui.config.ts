import { createTamagui } from '@tamagui/core'
import { shorthands } from '@tamagui/shorthands'

import { themes } from './themes'
import { tokens } from './tokens'
import { fonts } from './fonts'
import { media } from './media'
import { animations } from './animations'

const config = createTamagui({
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts,
  themes,
  tokens,
  media
})

type AppConfig = typeof config;

declare module "tamagui" {
  // overrides TamaguiCustomConfig so that custom types
  // work everywhere `tamagui` is imported
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
