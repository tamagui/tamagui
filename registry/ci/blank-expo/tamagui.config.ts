import { defaultConfig } from '@tamagui/config/v5'
import { createTamagui } from 'tamagui'

const config = createTamagui(defaultConfig)

type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
