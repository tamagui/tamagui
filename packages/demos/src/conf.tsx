import { config } from '@tamagui/config-base'
import { InferTamaguiConfig } from '@tamagui/core'

export { config } from '@tamagui/config-base'

export type Conf = InferTamaguiConfig<typeof config>

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
