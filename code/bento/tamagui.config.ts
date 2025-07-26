import { defaultConfig } from '@tamagui/config/v4'
import { config } from '@tamagui/config/v3'
import { createTamagui } from '@tamagui/core'
import { themes } from './theme'

const appConfig = createTamagui({
  ...config,
  themes: {
    ...config.themes,
    ...themes,
  },
  media: {
    ...defaultConfig.media,
    ...config.media,
  },
})

export type AppConfig = typeof appConfig

declare module '@tamagui/ui' {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}

  interface TypeOverride {
    groupNames(): 'window' | 'listitem' | 'item'
  }
}

export default appConfig
