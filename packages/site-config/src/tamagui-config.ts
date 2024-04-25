import { shorthands } from '@tamagui/shorthands/v2'
import { tokens } from '@tamagui/themes/v3'
import { themes } from './themes'

import type { CreateTamaguiProps } from '@tamagui/core'
import { setupDev } from '@tamagui/core'

import { animations } from './animations'
import { media, mediaQueryDefaultActive } from './media'
import {
  headingFont,
  dmSansHeadingFont,
  dmSerifDisplayHeadingFont,
  nohemiFont,
  bodyFont,
  monoFont,
  silkscreenFont,
  munroFont,
  cherryBombFont,
} from './fonts'

export { animations } from './animations'

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
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
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

console.log('heyo', maybeThemes)

export const config = {
  defaultFont: 'body',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  animations,
  themes: maybeThemes,
  media,
  shorthands,
  tokens,
  mediaQueryDefaultActive,
  selectionStyles: (theme) => ({
    backgroundColor: theme.color5,
    color: theme.color11,
  }),
  settings: {
    allowedStyleValues: 'somewhat-strict-web',
    autocompleteSpecificTokens: 'except-special',
    // mediaPropOrder: true,
  },
  fonts,
} satisfies CreateTamaguiProps
