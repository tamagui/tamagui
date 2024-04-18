import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui' // or '@tamagui/core'

const tamaguiConfig = createTamagui(config)

export type tamaguiConfig = typeof tamaguiConfig

declare module 'tamagui' {
  // or '@tamagui/core'
  // overrides TamaguiCustomConfig to your custom types
  // works everywhere you import `tamagui`

  interface TamaguiCustomConfig extends tamaguiConfig {}
}

export default tamaguiConfig
