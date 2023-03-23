import { config as configType } from '@tamagui/config'
import { config } from '@tamagui/config/reanimated'
import { createTamagui } from 'tamagui'

// doing tricks to get types right
const tamaConf = createTamagui(config as typeof configType)

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
