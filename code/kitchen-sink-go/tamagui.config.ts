import { defaultConfig } from '@tamagui/config/v5'
import { createTamagui } from 'tamagui'

const tamaguiConfig = createTamagui(defaultConfig)

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
