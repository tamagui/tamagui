import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

const tamaConf = createTamagui(config)

export default tamaConf

type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'group'
  }
}
