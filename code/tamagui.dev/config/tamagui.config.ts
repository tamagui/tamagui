import type { InferTamaguiConfig } from '@tamagui/web'
import { createTamagui } from 'tamagui'
import { config } from '@tamagui/tamagui-dev-config'

// annotated so the inferred type stays nameable from this file: without it tsc
// reaches for tamagui-dev-config's internal v6Themes path and calls it unportable
const tamaConf: InferTamaguiConfig<typeof config> = createTamagui(config)

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content' | 'item'
  }
}

export default tamaConf
