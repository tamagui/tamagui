import type { CreateTamaguiProps } from '@tamagui/core'
import { setupDev } from '@tamagui/core'
import { shorthands } from '@tamagui/shorthands/v2'
import { tokens } from '@tamagui/themes/v3'
import { createTamagui } from 'tamagui'
import { animations } from './animations'
import {
  bodyFont,
  cherryBombFont,
  dmSansHeadingFont,
  dmSerifDisplayHeadingFont,
  headingFont,
  monoFont,
  munroFont,
  nohemiFont,
  silkscreenFont,
} from './fonts'
import { media, mediaQueryDefaultActive } from './media'
import { themes } from './themes'

setupDev({
  visualizer: true,
})

const fonts = {
  heading: headingFont,
  headingDmSans: dmSansHeadingFont,
  headingDmSerifDisplay: dmSerifDisplayHeadingFont,
  headingNohemi: nohemiFont,
  body: bodyFont,
  mono: monoFont,
  silkscreen: silkscreenFont,
  munro: munroFont,
  cherryBomb: cherryBombFont,
}

// Converts a union of two types into an intersection
// i.e. A | B -> A & B
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

// Flattens two union types into a single type with optional values
// i.e. FlattenUnion<{ a: number, c: number } | { b: string, c: number }> = { a?: number, b?: string, c: number }
type FlattenUnion<T> = {
  [K in keyof UnionToIntersection<T>]: K extends keyof T
    ? T[K] extends any[]
      ? T[K]
      : T[K] extends object
        ? FlattenUnion<T[K]>
        : T[K]
    : UnionToIntersection<T>[K] | undefined
}

export type Theme = FlattenUnion<(typeof themes)['light']>
export type Themes = Record<keyof typeof themes, Theme>

// avoid themes only on client bundle
const maybeThemes =
  process.env.TAMAGUI_IS_SERVER || process.env.TAMAGUI_KEEP_THEMES
    ? (themes as Themes)
    : ({} as Themes)

// for some reason just re-defining these fixes a bug where negative space tokens were dropped
const fixTypescript55Bug = {
  space: tokens.space,
  size: tokens.size,
  radius: tokens.radius,
  zIndex: tokens.zIndex,
  color: tokens.color,
}

const config = {
  animations,
  themes: maybeThemes,
  media,
  shorthands,
  tokens: fixTypescript55Bug,
  settings: {
    defaultFont: 'body',
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,
    mediaQueryDefaultActive,
    selectionStyles: (theme) => ({
      backgroundColor: theme.color5,
      color: theme.color11,
    }),
    allowedStyleValues: 'somewhat-strict-web',
    autocompleteSpecificTokens: 'except-special',
    // mediaPropOrder: true,
  },
  fonts,
} satisfies CreateTamaguiProps

// for site responsive demo, we want no types here
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

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content'
  }
}

export default tamaConf
