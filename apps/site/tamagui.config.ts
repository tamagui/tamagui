import { config } from '@tamagui/config-base'
import { createTamagui } from 'tamagui'

Object.assign(config.media, {
  tiny: { maxWidth: 500 },
  gtTiny: { minWidth: 500 + 1 },
  small: { maxWidth: 620 },
  gtSmall: { minWidth: 620 + 1 },
  medium: { maxWidth: 780 },
  gtMedium: { minWidth: 780 + 1 },
  large: { maxWidth: 900 },
  gtLarge: { minWidth: 900 + 1 },
})

const tamaConf = createTamagui(config)

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
