import { createTamagui } from 'tamagui'
import { config } from '@tamagui/tamagui-dev-config'
import { media } from '@tamagui/config/v4'

const tamaConf = createTamagui({
  ...config,
  media,
})

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content' | 'item'
  }
}

export default tamaConf
