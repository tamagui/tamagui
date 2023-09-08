import { config as configOptions } from '@tamagui/config'
import { createTamagui } from '@tamagui/core'

export const config = createTamagui(configOptions)

export type Conf = typeof config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
