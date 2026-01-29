import { shorthands } from '@tamagui/shorthands/v4' // v4 same as v5
import { themes, tokens } from '@tamagui/themes/v5'
import type { CreateTamaguiProps } from '@tamagui/web'
import { fonts } from './v5-fonts'
import { media, mediaQueryDefaultActive } from './v5-media'

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
} from '@tamagui/themes/v5'
export { createSystemFont, fonts } from './v5-fonts'
export { breakpoints, media, mediaQueryDefaultActive } from './v5-media'

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

// base config without animations - users must provide their own
export const defaultConfig = {
  media,
  shorthands,
  themes,
  tokens,
  fonts,
  selectionStyles,
  settings,
} satisfies Omit<CreateTamaguiProps, 'animations'>
