import { shorthands } from '@tamagui/shorthands/v4'
import { tokens, defaultThemes } from '@tamagui/themes/v4'
import type { CreateTamaguiProps } from '@tamagui/web'
import { animations } from './v3-animations'
import { fonts } from './v4-fonts'
import { media, mediaQueryDefaultActive } from './v4-media'

export { shorthands } from '@tamagui/shorthands/v4'
export { createThemes } from '@tamagui/theme-builder'
export { tamaguiThemes, tokens } from '@tamagui/themes/v4'
export { animations } from './v4-animations'
export { createSystemFont, fonts } from './v4-fonts'
export { breakpoints, media, mediaQueryDefaultActive } from './v4-media'
export { defaultThemes as themes } from '@tamagui/themes/v4'

// Configuration:

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
  themeClassNameOnRoot: true,
  onlyAllowShorthands: true,
  // allow two inverses (tooltips, etc)
  // TODO on inverse theme changes
  maxDarkLightNesting: 2,
} satisfies CreateTamaguiProps['settings']

export const defaultConfig = {
  animations,
  media,
  shorthands,
  themes: defaultThemes,
  tokens,
  fonts,
  selectionStyles,
  settings,
} satisfies CreateTamaguiProps
