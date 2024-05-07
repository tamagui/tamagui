import { config as configOptions } from '@tamagui/site-config'
import { createTamagui } from 'tamagui'

export const tamaguiConfig = createTamagui(configOptions)

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
