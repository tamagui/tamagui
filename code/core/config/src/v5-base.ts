import { shorthands } from '@tamagui/shorthands/v4' // v4 same as v5
import type { Shorthands } from '@tamagui/shorthands/v4'
import { themes, tokens } from '@tamagui/themes/v5'
import type { V5Themes, V5Tokens } from '@tamagui/themes/v5'
import type { CreateTamaguiProps } from '@tamagui/web'
import { fonts } from './v5-fonts'
import type { V5Fonts } from './v5-fonts'
import { media, mediaQueryDefaultActive } from './v5-media'
import type { V5Media } from './v5-media'

export { shorthands } from '@tamagui/shorthands/v4'
export { createThemes } from '@tamagui/theme-builder'
export {
  adjustPalette,
  adjustPalettes,
  createV5Theme,
  defaultChildrenThemes,
  defaultDarkPalette,
  defaultLightPalette,
  hslToString,
  // helpers
  interpolateColor,
  opacify,
  parseHSL,
  tokens,
  type AdjustFn,
  // types
  type HSL,
  type PaletteAdjustments,
  type V5Theme,
  type V5ThemeNames,
  type V5Themes,
  type V5Tokens,
} from '@tamagui/themes/v5'
export { createSystemFont, fonts } from './v5-fonts'
export type { V5Fonts } from './v5-fonts'
export { breakpoints, media, mediaQueryDefaultActive } from './v5-media'
export type { V5Media } from './v5-media'

export const selectionStyles = (theme) =>
  theme.color5
    ? {
        backgroundColor: theme.color5,
        color: theme.color11,
      }
    : null

export const settings = {
  mediaQueryDefaultActive,
  defaultFont: 'body',
  fastSchemeChange: true,
  shouldAddPrefersColorThemes: true,
  allowedStyleValues: 'somewhat-strict-web',
  addThemeClassName: 'html',
  onlyAllowShorthands: true,
  styleCompat: 'web',
} satisfies CreateTamaguiProps['settings']

export type V5Settings = typeof settings

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
