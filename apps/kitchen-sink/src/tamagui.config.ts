import { createAnimations as createAnimationsCSS } from '@tamagui/animations-css'
import { createAnimations as createAnimationsMoti } from '@tamagui/animations-moti'
import { createAnimations as createAnimationsNative } from '@tamagui/animations-react-native'
import { config } from '@tamagui/config'
import { createFont, createTamagui } from 'tamagui'

export const animationsCSS = createAnimationsCSS({
  '100ms': 'ease-in 100ms',
  bouncy: 'ease-in 200ms',
  lazy: 'ease-in 600ms',
  slow: 'ease-in 500ms',
  quick: 'ease-in 100ms',
  tooltip: 'ease-in 400ms',
})

export const animationsMoti = createAnimationsMoti({
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

export const animationsNative = createAnimationsNative({
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

const heading = createFont({
  size: {
    6: 15,
  },
  transform: {
    6: 'uppercase',
    7: 'none',
  },
  weight: {
    6: '400',
    7: '700',
  },
  color: {
    6: '$colorFocus',
    7: '$color',
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: -1,
    9: -2,
    10: -3,
    12: -4,
    14: -5,
    15: -6,
  },
  face: {
    700: { normal: 'LatoBold' },
    900: { normal: 'LatoBlack' },
  },
})

const body = createFont({
  family: 'Lato',
  size: {
    6: 15,
    7: 18,
    10: 32,
  },
  transform: {
    6: 'uppercase',
    7: 'none',
  },
  weight: {
    6: '400',
    7: '700',
  },
  color: {
    6: '$colorFocus',
    7: '$color',
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: -1,
    9: -2,
    10: -3,
    12: -4,
    14: -5,
    15: -6,
  },
  face: {
    400: { normal: 'Lato' },
    700: { normal: 'LatoBold' },
    900: { normal: 'LatoBlack' },
  },
})

const search = (typeof window !== 'undefined' && globalThis.location?.search) || ''

const tokens = {
  ...config.tokens,
  color: {
    ...config.tokens.color,
    testsomethingdifferent: '#ff0000',
  },
}

const tamaConf = createTamagui({
  ...config,
  fonts: {
    ...config.fonts,
    body,
    heading,
  },
  tokens,
  animations: search.includes('animationDriver=css')
    ? animationsCSS
    : search.includes('animationDriver=native')
    ? animationsNative
    : animationsMoti, // default moti
  themeClassNameOnRoot: false,
})

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
