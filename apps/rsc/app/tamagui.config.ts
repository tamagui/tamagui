import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

const tamaConf = createTamagui({
  ...config,
  settings: {
    serverComponents: true,
    // TODO
  } as any,
})

export type Conf = typeof tamaConf

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
