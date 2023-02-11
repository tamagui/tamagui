import { config } from '@tamagui/config-base'
import { createTamagui } from '@tamagui/web'

const tamaConf = createTamagui(config)

export type Conf = typeof tamaConf

declare module '@tamagui/web' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
