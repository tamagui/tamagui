import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from 'tamagui'

export const config = createTamagui(defaultConfig)

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
