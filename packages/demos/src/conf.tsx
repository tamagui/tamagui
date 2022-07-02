import { config } from '@tamagui/config-base'
import { InferTamaguiConfig } from '@tamagui/core'

export type Conf = InferTamaguiConfig<typeof config>

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
