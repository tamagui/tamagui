import { createTamagui } from 'tamagui'
import { shorthands } from '@tamagui/shorthands'
import { themes } from '@tamagui/themes'

import { animations } from './animations'
import { fonts } from './fonts'
import { media } from './media'
import { tokens } from './tokens'

const config = createTamagui({
  defaultFont: 'body',
  animations,
  shouldAddPrefersColorThemes: true,
  shorthands,
  fonts,
  themes,
  tokens,
  media,
})

type AppConfig = typeof config

// declare module 'tamagui' {
//   // overrides TamaguiCustomConfig so that custom types
//   // work everywhere `tamagui` is imported
//   interface TamaguiCustomConfig extends AppConfig {}
// }

export default config
