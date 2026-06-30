import { shorthands } from '@tamagui/shorthands/v6'
import type { Shorthands } from '@tamagui/shorthands/v6'
import { themes, tokens } from '@tamagui/themes/v5'
import type { V5Themes, V5Tokens } from '@tamagui/themes/v5'
import type { CreateTamaguiProps } from '@tamagui/web'

import { fonts } from './v5-fonts'
import type { V5Fonts } from './v5-fonts'
import { media, mediaQueryDefaultActive } from './v6-media'
import type { V6Media } from './v6-media'

export { shorthands } from '@tamagui/shorthands/v6'
export { createThemes } from '@tamagui/theme-builder'
export {
  adjustPalette,
  adjustPalettes,
  createV5Theme,
  defaultChildrenThemes,
  defaultDarkPalette,
  defaultLightPalette,
  hslToString,
  interpolateColor,
  opacify,
  parseHSL,
  tokens,
  type AdjustFn,
  type HSL,
  type PaletteAdjustments,
  type V5Theme,
  type V5ThemeNames,
} from '@tamagui/themes/v5'
export { createSystemFont, fonts } from './v5-fonts'
export type { V5Fonts }
export { breakpoints, media, mediaQueryDefaultActive } from './v6-media'
export type { V6Media }

export type V6Themes = V5Themes
export type V6Tokens = V5Tokens

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
  styleCompat: 'react-native',
} satisfies CreateTamaguiProps['settings']

export type V6Settings = typeof settings

export type V6DefaultConfig = {
  media: V6Media
  shorthands: Shorthands
  themes: V6Themes
  tokens: V6Tokens
  fonts: V5Fonts
  selectionStyles: typeof selectionStyles
  settings: V6Settings
}

export const defaultConfig: V6DefaultConfig = {
  media,
  shorthands,
  themes,
  tokens,
  fonts,
  selectionStyles,
  settings,
}
