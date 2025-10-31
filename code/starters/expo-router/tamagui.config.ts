import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from '@tamagui/ui'

export const config = createTamagui(defaultConfig)

export default config

export type Conf = typeof config

declare module '@tamagui/ui' {
  interface TamaguiCustomConfig extends Conf {}
}
