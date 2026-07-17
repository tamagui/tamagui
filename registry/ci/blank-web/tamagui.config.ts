import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

// a blank tamagui app's config: the stock @tamagui/config preset, nothing
// component-specific. installing a registry item must work against this alone.
const config = createTamagui(defaultConfig)

type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
