import { shorthands } from '@tamagui/shorthands/v4' // v4 same as v5
import type { Shorthands } from '@tamagui/shorthands/v4'
import { themes, tokens } from '@tamagui/themes/v5'
import type { V5Themes, V5Tokens } from '@tamagui/themes/v5'
import { fonts } from './v5-fonts'
import type { V5Fonts } from './v5-fonts'
import { media } from './v5-media'
import type { V5Media } from './v5-media'
import { selectionStyles, settings } from './v5-settings'
import type { V5Settings } from './v5-settings'

export { shorthands } from '@tamagui/shorthands/v4'
// static re-exports only. the v5 theme builder (createV5Theme, adjustPalette,
// opacify, defaultChildrenThemes, ...) lives in '@tamagui/themes/v5-builder' so
// this default config entry stays free of @tamagui/theme-builder on native.
export {
  tokens,
  type V5Theme,
  type V5ThemeNames,
  type V5Themes,
  type V5Tokens,
} from '@tamagui/themes/v5'
export { createSystemFont, fonts } from './v5-fonts'
export type { V5Fonts } from './v5-fonts'
export { breakpoints, media, mediaQueryDefaultActive } from './v5-media'
export type { V5Media } from './v5-media'
export { selectionStyles, settings } from './v5-settings'
export type { V5Settings } from './v5-settings'

export type V5DefaultConfig = {
  media: V5Media
  shorthands: Shorthands
  themes: V5Themes
  tokens: V5Tokens
  fonts: V5Fonts
  selectionStyles: typeof selectionStyles
  settings: V5Settings
}

// base config without animations - users must provide their own
export const defaultConfig: V5DefaultConfig = {
  media,
  shorthands,
  themes,
  tokens,
  fonts,
  selectionStyles,
  settings,
}
