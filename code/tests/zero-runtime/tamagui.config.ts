import { animationsCSS } from '@tamagui/config/animations-css'
import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from 'tamagui'

// CSS animation driver only: zero-runtime rule 5.
export const config = createTamagui({ ...defaultConfig, animations: animationsCSS })

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
