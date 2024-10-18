import { config as configOptions } from '@tamagui/config/v3'
import { createTamagui } from '@tamagui/core'

export const config = createTamagui({
  ...configOptions,
  settings: {
    ...configOptions.settings,
    fastSchemeChange: true,
    // avoids CSS bloat so long as you don't need nesting of dark/light themes
    maxDarkLightNesting: 2,
  },
})

export type Conf = typeof config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
