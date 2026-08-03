import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from 'tamagui'

// registry items are source-level component definitions and use portable
// longhand styles that do not depend on a consumer's shorthand table.
const config = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },
})

type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
