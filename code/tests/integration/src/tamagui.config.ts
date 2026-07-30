import { createTamagui } from 'tamagui'
import { shorthands } from '@tamagui/shorthands'

import { animations } from './animations'
import { fonts } from './fonts'
import { media } from './media'
import { themes } from './themes'
import { tokens } from './tokens'

const config = createTamagui({
  // TRANSITIONAL: the Vite integration and the component packages already select the
  // Tailwind frontend by import, but `getSplitStyles`/`createComponent` still read this
  // global setting to tokenize a call-site `className`. It comes out with the reserved
  // two-file descriptor cut.
  settings: {
    styleMode: 'tamagui-and-tailwind',
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
