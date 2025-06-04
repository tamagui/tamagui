import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig,
    allowedStyleValues: 'somewhat-strict-web',
  },
})

export type TamaguiConfig = typeof tamaguiConfig

declare module '@tamagui/web' {
  // overrides TamaguiCustomConfig so your custom types
  interface TamaguiCustomConfig extends TamaguiConfig {}
}

export default tamaguiConfig
