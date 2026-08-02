import { defaultConfig } from '@tamagui/config/v5'
import { animations } from '@tamagui/config/v5-css'
import { createTamagui } from 'tamagui'

const tamaConf = createTamagui({
  ...defaultConfig,
  animations,
  media: {
    ...defaultConfig.media,
    // for site responsive demo
    tiny: { maxWidth: 500 },
    gtTiny: { minWidth: 500 + 1 },
    small: { maxWidth: 620 },
    gtSmall: { minWidth: 620 + 1 },
    medium: { maxWidth: 780 },
    gtMedium: { minWidth: 780 + 1 },
    large: { maxWidth: 900 },
    gtLarge: { minWidth: 900 + 1 },
  },
})

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody'
  }
}

export default tamaConf
