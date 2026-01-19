import { createTamagui } from 'tamagui'
import { config, animationsMotion } from '@tamagui/tamagui-dev-config'

const tamaConf = createTamagui({
  ...config,
  animations: animationsMotion,
})

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content' | 'item'
  }
}

export default tamaConf
