import { defaultConfig } from '@tamagui/config/v6'
import { themes } from '@tamagui/config/v6'
import { createTamagui } from 'tamagui'

const tamaguiConfig = createTamagui({ ...defaultConfig, themes })

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
