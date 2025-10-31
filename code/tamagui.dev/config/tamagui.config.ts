import { createTamagui } from '@tamagui/ui'
import { config } from '@tamagui/tamagui-dev-config'

const tamaConf = createTamagui(config)

export type Conf = typeof tamaConf

declare module '@tamagui/ui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content' | 'item'
  }
}

export default tamaConf
