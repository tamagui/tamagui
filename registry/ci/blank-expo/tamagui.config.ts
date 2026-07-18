import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

const config = createTamagui(defaultConfig)

type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
