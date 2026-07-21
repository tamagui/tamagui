import { defaultConfig } from '@tamagui/config/v5'
import { animationsReactNative } from '@tamagui/config/v5-rn'
import { createTamagui } from 'tamagui'

const config = createTamagui({
  ...defaultConfig,
  animations: animationsReactNative,
})

type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}

  interface TypeOverride {
    groupNames(): 'card' | 'inner'
  }
}

export default config
