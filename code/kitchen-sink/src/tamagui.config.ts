import { createAnimations as createAnimationsCSS } from '@tamagui/animations-css'
import { createAnimations as createAnimationsMotion } from '@tamagui/animations-motion'
import { createAnimations as createAnimationsNative } from '@tamagui/animations-react-native'
import { createAnimations as createAnimationsReanimated } from '@tamagui/animations-reanimated'
import { config } from '@tamagui/config/v3'
import { defaultConfig as configV4, shorthands } from '@tamagui/config/v4'
import { defaultConfig } from '@tamagui/config/v5'
import { tamaguiThemes } from '@tamagui/themes/v4'
import { createTamagui, type CreateTamaguiProps } from 'tamagui'
// TODO just move this into this folder
import { config as tamaguiDevConfig } from '../../packages/tamagui-dev-config/src/index'
import { themeDev } from '../../packages/tamagui-dev-config/src/theme.dev'
// Generated theme from v5 theme builder for testing
import { themes as generatedV5Themes } from './generatedV5Theme'

export const animationsCSS = createAnimationsCSS({
  '0ms': '0ms linear',
  '30ms': '30ms linear',
  '50ms': '50ms linear',
  '75ms': '75ms linear',
  '100ms': '100ms ease-out',
  '200ms': '200ms linear',
  '250ms': '250ms ease-out',
  '300ms': '300ms ease-out',
  '400ms': '400ms ease-out',
  '500ms': '500ms ease-out',
  '1000ms': '1000ms ease-out',
  // ultra-slow for testing animation smoothness
  '5000ms': '5000ms linear',
  bouncy: 'ease-in 200ms',
  lazy: 'ease-in 600ms',
  slow: 'ease-in 500ms',
  quick: 'ease-in 100ms',
  quicker: 'cubic-bezier(0.215, 0.610, 0.355, 1.000) 300ms',
  quickest: 'ease-in 50ms',
  tooltip: 'ease-in 400ms',
  medium: 'ease-in 400ms',
})

export const animationsMotion = createAnimationsMotion({
  '0ms': {
    duration: 0,
  },
  '30ms': {
    duration: 30,
  },
  '50ms': {
    duration: 50,
  },
  '75ms': {
    duration: 75,
  },
  '100ms': {
    duration: 100,
  },
  '200ms': {
    duration: 200,
  },
  '250ms': {
    duration: 250,
  },
  '300ms': {
    duration: 300,
  },
  '400ms': {
    duration: 400,
  },
  '500ms': {
    duration: 500,
  },
  '1000ms': {
    duration: 1000,
  },
  // ultra-slow for testing animation smoothness
  '5000ms': {
    duration: 5000,
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
  quicker: {
    type: 'spring',
    damping: 20,
    mass: 1,
    stiffness: 300,
  },
  quickest: {
    type: 'spring',
    damping: 14,
    mass: 0.1,
    stiffness: 380,
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
  '0ms': {
    type: 'timing',
    duration: 0,
  },
  '30ms': {
    type: 'timing',
    duration: 30,
  },
  '50ms': {
    type: 'timing',
    duration: 50,
  },
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
  '250ms': {
    type: 'timing',
    duration: 250,
  },
  '300ms': {
    type: 'timing',
    duration: 300,
  },
  '400ms': {
    type: 'timing',
    duration: 400,
  },
  '500ms': {
    type: 'timing',
    duration: 500,
  },
  '1000ms': {
    type: 'timing',
    duration: 1000,
  },
  // ultra-slow for testing animation smoothness
  '5000ms': {
    type: 'timing',
    duration: 5000,
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
  quicker: {
    type: 'spring',
    damping: 20,
    mass: 1,
    stiffness: 300,
  },
  quickest: {
    type: 'spring',
    damping: 14,
    mass: 0.1,
    stiffness: 380,
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

export const animationsReanimated = createAnimationsReanimated({
  '0ms': {
    type: 'timing',
    duration: 0,
  },
  '30ms': {
    type: 'timing',
    duration: 30,
  },
  '50ms': {
    type: 'timing',
    duration: 50,
  },
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
  '250ms': {
    type: 'timing',
    duration: 250,
  },
  '300ms': {
    type: 'timing',
    duration: 300,
  },
  '400ms': {
    type: 'timing',
    duration: 400,
  },
  '500ms': {
    type: 'timing',
    duration: 500,
  },
  '1000ms': {
    type: 'timing',
    duration: 1000,
  },
  // ultra-slow for testing animation smoothness
  '5000ms': {
    type: 'timing',
    duration: 5000,
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
  quicker: {
    type: 'spring',
    damping: 20,
    mass: 1,
    stiffness: 300,
  },
  quickest: {
    type: 'spring',
    damping: 14,
    mass: 0.1,
    stiffness: 380,
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

  // Test theme for Issue #3620: color tokens should be fallbacks, not overrides
  // This theme overrides customRed to be green, to verify theme values take precedence
  // @ts-ignore
  light_ColorTokenTest: {
    background: '#ffffff',
    customRed: '#00ff00', // Override the color token (which is #ff0000) with green
  },
}

const search = (typeof window !== 'undefined' && globalThis.location?.search) || ''

const useV4Themes = search.includes('v4theme=true')
const v5config = search.includes('v5config')
const tamav5Config = search.includes('tamav5config')
const generatedV5 = search.includes('generatedV5')

const tokens = {
  ...config.tokens,
  color: {
    ...config.tokens.color,
    testsomethingdifferent: '#ff0000',
    customRed: '#ff0000',
    customBlue: '#0000ff',
    customGreen: '#00ff00',
  },
  // size: {
  //   0: 10,
  // },
}

const animations = search.includes('animationDriver=css')
  ? animationsCSS
  : search.includes('animationDriver=native')
    ? animationsNative
    : search.includes('animationDriver=motion')
      ? animationsMotion
      : animationsReanimated

const tamaConf = createTamagui({
  ...config,
  // Use v4 themes when ?v4theme=true is in the URL
  themes: useV4Themes
    ? tamaguiThemes
    : {
        ...config.themes,
        ...themeDev,
      },
  shorthands: shorthands,
  settings: {
    defaultFont: '$body',
    allowedStyleValues: 'somewhat-strict',
    autocompleteSpecificTokens: 'except-special',
    fastSchemeChange: true,
  },
  tokens,
  media: {
    ...configV4.media, // adds max queries
    ...config.media,
  },
  animations, // default reanimated

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

export default tamav5Config
  ? createTamagui(tamaguiDevConfig)
  : generatedV5
    ? createTamagui({ ...defaultConfig, themes: generatedV5Themes, animations })
    : v5config
      ? createTamagui({ ...defaultConfig, animations })
      : tamaConf
