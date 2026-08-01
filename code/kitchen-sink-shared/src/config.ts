import { defaultConfig } from '@tamagui/config/v5'
import { themes } from '@tamagui/config/v6'
import { animations } from '@tamagui/config/v5-rn'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
  ...defaultConfig,
  themes,
  animations,
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
