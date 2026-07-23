import { createTamagui } from 'tamagui'
import { shorthands } from '@tamagui/shorthands'

import { animations } from './animations'
import { fonts } from './fonts'
import { media } from './media'
import { themes } from './themes'
import { tokens } from './tokens'

const integrationStyleMode =
  (process.env.TAMAGUI_INTEGRATION_STYLE_MODE as
    | 'tamagui'
    | 'tailwind'
    | 'tamagui-and-tailwind') || 'tamagui-and-tailwind'

const config = createTamagui({
  settings: {
    styleMode: integrationStyleMode,
  },
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
