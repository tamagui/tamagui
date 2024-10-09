import { createAnimations as createAnimationsCSS } from '@tamagui/animations-css'
import { createAnimations as createAnimationsMoti } from '@tamagui/animations-moti'
import { createAnimations as createAnimationsNative } from '@tamagui/animations-react-native'
import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

export const animationsCSS = createAnimationsCSS({
  '100ms': 'ease-in 100ms',
  bouncy: 'ease-in 200ms',
  lazy: 'ease-in 600ms',
  slow: 'ease-in 500ms',
  quick: 'ease-in 100ms',
  tooltip: 'ease-in 400ms',
  medium: 'ease-in 400ms',
})

export const animationsMoti = createAnimationsMoti({
  '75ms': {
    type: 'timing',
    duration: 75,
  },
  '100ms': {
    type: 'timing',
    duration: 100,
  },
  '200ms': {
    type: 'timing',
    duration: 200,
  },
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
  medium: {
    damping: 15,
    stiffness: 120,
    mass: 1,
  },
  tooltip: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
})

export const animationsNative = createAnimationsNative({
  '75ms': {
    type: 'timing',
    duration: 75,
  },
  '100ms': {
    type: 'timing',
    duration: 100,
  },
  '200ms': {
    type: 'timing',
    duration: 200,
  },
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
  medium: {
    damping: 15,
    stiffness: 120,
    mass: 1,
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

  // @ts-ignore
  light_green_Button: {
    // @ts-ignore
    ...config.themes.light_green_Button,
    background: 'green',
  },

  // @ts-ignore
  light_MyLabel: {
    color: 'red',
  },
}

const search = (typeof window !== 'undefined' && globalThis.location?.search) || ''

const tokens = {
  ...config.tokens,
  color: {
    ...config.tokens.color,
    testsomethingdifferent: '#ff0000',
  },
  // size: {
  //   0: 10,
  // },
}

const tamaConf = createTamagui({
  ...config,
  defaultFont: undefined,
  settings: {
    defaultFont: undefined,
    allowedStyleValues: 'somewhat-strict',
    autocompleteSpecificTokens: 'except-special',
    fastSchemeChange: true,
  },
  tokens,
  animations: search.includes('animationDriver=css')
    ? animationsCSS
    : search.includes('animationDriver=native')
      ? animationsNative
      : animationsMoti, // default moti
  themeClassNameOnRoot: false,

  defaultProps: {
    Square: {
      backgroundColor: 'violet',
    },
  },
})

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'testy'
  }
}

export default tamaConf
