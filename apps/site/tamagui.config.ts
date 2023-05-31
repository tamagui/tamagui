import { createAnimations } from '@tamagui/animations-react-native'
import { config } from '@tamagui/site-config'
import { createTamagui } from 'tamagui'

// for responsive demo
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

const tamaConf = createTamagui({
  ...config,
  animations: createAnimations({
    '100ms': {
      type: 'timing',
      duration: 100,
    },
    bouncy: {
      damping: 9,
      mass: 0.9,
      stiffness: 150,
    },
    lazy: {
      damping: 18,
      stiffness: 50,
    },
    slow: {
      damping: 15,
      stiffness: 40,
    },
    quick: {
      damping: 20,
      mass: 1.2,
      stiffness: 250,
    },
    tooltip: {
      damping: 10,
      mass: 0.9,
      stiffness: 100,
    },
    quicker: {
      type: 'spring',
      damping: 20,
      mass: 1,
      stiffness: 250,
    },
  }),
})

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
