import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from 'tamagui'

// v6 (tailwind-compatible) + pure tailwind mode — same config as the web tamagui leg.
const tamaguiConfig = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    styleMode: 'tailwind',
  },
})

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
