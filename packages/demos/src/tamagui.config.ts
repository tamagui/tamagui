import { config } from '@tamagui/config'
import { InferTamaguiConfig } from '@tamagui/core'

export { config } from '@tamagui/config'
export default config

export type Conf = InferTamaguiConfig<typeof config>

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
