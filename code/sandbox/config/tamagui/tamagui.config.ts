import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from '@tamagui/ui'
import { animationsMotion } from './animationMotion'

export const config = createTamagui({
  ...defaultConfig,
  animations: animationsMotion,
})

export type Conf = typeof config

declare module '@tamagui/ui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'other'
  }
}

export default config
