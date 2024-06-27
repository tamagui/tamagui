import { config as configBase } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

export const config = createTamagui(configBase)

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
