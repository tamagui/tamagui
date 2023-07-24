import { createAnimations as createAnimationsCSS } from '@tamagui/animations-css'
import { createAnimations } from '@tamagui/animations-moti'
import { config } from '@tamagui/config'
import { createTamagui } from 'tamagui'

export const animationsCSS = createAnimationsCSS({
  '100ms': 'ease-in 100ms',
  bouncy: 'ease-in 200ms',
  lazy: 'ease-in 600ms',
  slow: 'ease-in 500ms',
  quick: 'ease-in 100ms',
  tooltip: 'ease-in 400ms',
})

// test reanimated
export const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  lazy: {
    type: 'spring',
    damping: 18,
    stiffness: 50,
  },
  slow: {
    type: 'spring',
    damping: 15,
    stiffness: 40,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  tooltip: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
})

// this is used by the button test...
config.themes = {
  ...config.themes,
  light_green_Button: {
    ...config.themes.light_green_Button,
    background: 'green',
  },

  // @ts-ignore
  light_MyLabel: {
    color: 'red',
  },
}

console.warn(
  `Warning: testing reanimated driver (TODO make this a ?animations=reanimated query)`
)

const tamaConf = createTamagui({
  ...config,
  // test reanimated
  animations:
    typeof window !== 'undefined' && globalThis.location?.search.includes('driver=css')
      ? animationsCSS
      : animations,
  themeClassNameOnRoot: false,
})

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
