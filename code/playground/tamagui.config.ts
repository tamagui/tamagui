import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'
import { themes } from './themes'

export const config = createTamagui({
  ...defaultConfig,
  themes,
})

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
