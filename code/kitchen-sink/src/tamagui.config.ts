import { createAnimations as createAnimationsCSS } from '@tamagui/animations-css'
import { createAnimations as createAnimationsMotion } from '@tamagui/animations-motion'
import { createAnimations as createAnimationsNative } from '@tamagui/animations-react-native'
import { createAnimations as createAnimationsReanimated } from '@tamagui/animations-reanimated'
import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from '@tamagui/core'
import type { InferTamaguiConfig } from '@tamagui/web'
import { themeDev, type TamaguiThemes } from './themes/theme.dev'

// the kitchen sink runs on the shipped default config so the cases exercise
// exactly what users get: v6 tokens, fonts, media, shorthands and settings.
const media = {
  ...defaultConfig.media,
  // the reduced-motion keys are not part of the shipped media set, but the
  // media drivers support them on both platforms — MotionReduceCase covers that
  motionReduce: { prefersReducedMotion: 'reduce' },
  motionSafe: { prefersReducedMotion: 'no-preference' },
} as const

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

// the shipped palette plus the cases' own fixture colors. v6 keeps colors in
// tokens (the Tailwind palette), so these sit alongside rather than replacing it.
const tokens = {
  ...defaultConfig.tokens,
  color: {
    ...defaultConfig.tokens.color,
    testsomethingdifferent: '#ff0000',
    customRed: '#ff0000',
    customBlue: '#0000ff',
    customGreen: '#00ff00',
  },
}

// multi-driver config for testing animatedBy prop and driver selection
const animationsMultiDriver = {
  default: animationsMotion,
  css: animationsCSS,
}

// the driver is the one thing the test harness picks per run, via ?animationDriver=.
// it only swaps which driver object the same config carries — unlike a whole
// alternate config, it cannot desync from what the compiler extracted.
const search = (typeof window !== 'undefined' && globalThis.location?.search) || ''

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
  ...defaultConfig.fonts.body,
  family: 'KitchenSinkJA, sans-serif',
  size: { ...defaultConfig.fonts.body.size, 3: 20 },
  lineHeight: { ...defaultConfig.fonts.body.lineHeight, 3: 30 },
}

type Merge<Left, Right> = Omit<Left, keyof Right> & Right

// deliberately partial themes the cases assert against. themeDev defines
// neither name, so these land whole rather than merging into a generated theme.
const fixtureThemes = {
  light_MyLabel: {
    color: 'red',
  },
  // A same-named theme value used to win. Flat values bind the color category
  // first, so customRed here deliberately loses to the configured color token.
  light_ColorTokenTest: {
    background: '#ffffff',
    customRed: '#00ff00',
  },
}

type KitchenThemes = TamaguiThemes & typeof fixtureThemes

const themes: KitchenThemes = {
  ...defaultConfig.themes,
  ...themeDev,
  ...fixtureThemes,
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
  typeof defaultConfig,
  'fonts' | 'media' | 'settings' | 'themes' | 'tokens'
> & {
  animations: typeof animations
  defaultProps: typeof defaultProps
  fonts: Merge<typeof defaultConfig.fonts, { body_ja: typeof bodyJa }>
  media: typeof media
  settings: Merge<
    typeof defaultConfig.settings,
    {
      defaultFont: 'body'
      allowedStyleValues: 'somewhat-strict'
      fastSchemeChange: true
      onlyAllowShorthands: false
    }
  >
  themes: KitchenThemes
  tokens: typeof tokens
  variables: typeof variables
}

const tamaConf: InferTamaguiConfig<KitchenConfigInput> =
  createTamagui<KitchenConfigInput>({
    ...defaultConfig,
    fonts: {
      ...defaultConfig.fonts,
      body_ja: bodyJa,
    },
    themes,
    settings: {
      ...defaultConfig.settings,
      defaultFont: 'body',
      allowedStyleValues: 'somewhat-strict',
      fastSchemeChange: true,
      // the cases author with long property names as well as shorthands
      onlyAllowShorthands: false,
    },
    tokens,
    media,
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

export default tamaConf
