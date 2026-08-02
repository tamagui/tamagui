import { createAnimations as createAnimationsCSS } from '@tamagui/animations-css'
import { createAnimations as createAnimationsMotion } from '@tamagui/animations-motion'
import { createAnimations as createAnimationsNative } from '@tamagui/animations-react-native'
import { createAnimations as createAnimationsReanimated } from '@tamagui/animations-reanimated'
import { defaultConfig as configV5 } from '@tamagui/config/v5'
import { shorthands } from '@tamagui/config/v6'
import type { InferTamaguiConfig } from '@tamagui/web'
import { createTamagui, type TamaguiInternalConfig } from 'tamagui'
// TODO just move this into this folder
import { config as tamaguiDevConfig } from '../../packages/tamagui-dev-config/src/index'
import { themeDev } from '../../packages/tamagui-dev-config/src/theme.dev'
import { toV6Themes, type V6Themes } from '../../packages/tamagui-dev-config/src/v6Themes'
// Generated theme from v5 theme builder for testing
import { themes as generatedV5Themes } from './generatedV5Theme'

// v5 is the config generation the kitchen sink runs on: its tokens, fonts and
// media (which already spells the max-queries kebab-case) plus the V6 theme-key
// grammar applied to the v5 theme pack.
const config = {
  ...configV5,
  themes: toV6Themes(configV5.themes),
  media: {
    ...configV5.media,
    // the reduced-motion keys are not part of the v5 media set, but the media
    // drivers support them on both platforms — MotionReduceCase covers that
    motionReduce: { prefersReducedMotion: 'reduce' },
    motionSafe: { prefersReducedMotion: 'no-preference' },
  },
}

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
  bouncy: 'cubic-bezier(0.34, 1.56, 0.64, 1) 360ms',
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

  // A same-named theme value used to win. Flat values bind the color category
  // first, so customRed below deliberately loses to the configured color token.
  // @ts-ignore
  light_ColorTokenTest: {
    background: '#ffffff',
    customRed: '#00ff00',
  },
}

const search = (typeof window !== 'undefined' && globalThis.location?.search) || ''

const v5config = search.includes('v5config')
const tamav5Config = search.includes('tamav5config')
const generatedV5 = search.includes('generatedV5')

// v5 keeps colors in themes, so the color scale here is only the kitchen sink's
// own test tokens
const tokens = {
  ...config.tokens,
  color: {
    testsomethingdifferent: '#ff0000',
    customRed: '#ff0000',
    customBlue: '#0000ff',
    customGreen: '#00ff00',
  },
  // size: {
  //   0: 10,
  // },
}

// multi-driver config for testing animatedBy prop and driver selection
const animationsMultiDriver = {
  default: animationsMotion,
  css: animationsCSS,
}

const animations = search.includes('animationDriver=css')
  ? animationsCSS
  : search.includes('animationDriver=native')
    ? animationsNative
    : search.includes('animationDriver=motion')
      ? animationsMotion
      : search.includes('animationDriver=multi')
        ? animationsMultiDriver
        : animationsReanimated

/**
 * A language variant of the body font, for FontLanguageSwapCase.
 *
 * A font key of `name_language` is what `createDesignSystem` reads to emit
 * `:root .t_lang-body-ja .font_body { … }`, so this only ever applies inside a
 * `<FontLanguage body="ja">` and cannot move default rendering. The family and
 * the metrics differ from `body` on purpose: swapping the face has to carry the
 * face's own sizes and line heights with it, not just its family name.
 *
 * It sorts after `body`, which matters — the shared `.font_*, .is_View` rule is
 * built from the alphabetically first font, so a variant sorting before `body`
 * would change the font reset for every View on the page.
 */
const bodyJa = {
  ...config.fonts.body,
  family: 'KitchenSinkJA, sans-serif',
  size: { ...config.fonts.body.size, 3: 20 },
  lineHeight: { ...config.fonts.body.lineHeight, 3: 30 },
}

type Merge<Left, Right> = Omit<Left, keyof Right> & Right
type KitchenThemes = Merge<V6Themes<typeof configV5.themes>, typeof themeDev>

const themes: KitchenThemes = {
  ...config.themes,
  ...themeDev,
}

const variables = {
  caseAccent: { light: 'rgb(0, 90, 200)', dark: 'rgb(90, 90, 255)' },
  caseSurface: 'background',
  caseRadius: 4,
} as const

const defaultProps = {
  Square: {
    backgroundColor: 'violet',
  },
} as const

type KitchenConfigInput = Omit<
  typeof config,
  | 'animations'
  | 'defaultProps'
  | 'fonts'
  | 'media'
  | 'settings'
  | 'shorthands'
  | 'themes'
  | 'tokens'
  | 'variables'
> & {
  animations: typeof animations
  defaultProps: typeof defaultProps
  fonts: Merge<typeof config.fonts, { body_ja: typeof bodyJa }>
  media: typeof config.media
  settings: Merge<
    typeof config.settings,
    {
      defaultFont: 'body'
      allowedStyleValues: 'somewhat-strict'
      fastSchemeChange: true
      onlyAllowShorthands: false
    }
  >
  shorthands: typeof shorthands
  themes: KitchenThemes
  tokens: typeof tokens
  variables: typeof variables
}

const tamaConf: InferTamaguiConfig<KitchenConfigInput> =
  createTamagui<KitchenConfigInput>({
    ...config,
    fonts: {
      ...config.fonts,
      body_ja: bodyJa,
    },
    themes,
    shorthands: shorthands,
    settings: {
      ...config.settings,
      defaultFont: 'body',
      allowedStyleValues: 'somewhat-strict',
      fastSchemeChange: true,
      // the cases author with long property names as well as shorthands
      onlyAllowShorthands: false,
    },
    tokens,
    media: config.media,
    animations, // default reanimated

    // custom variables for VariablesCase (plans/variables.md)
    variables,

    defaultProps,
  })

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'testy' | 'root' | `nested-${number}`
  }
}

const activeConfig: TamaguiInternalConfig = tamav5Config
  ? createTamagui(tamaguiDevConfig)
  : generatedV5
    ? createTamagui({
        ...configV5,
        themes: toV6Themes(generatedV5Themes),
        animations,
      })
    : v5config
      ? createTamagui({
          ...configV5,
          themes: toV6Themes(configV5.themes),
          animations,
        })
      : tamaConf

export default activeConfig
