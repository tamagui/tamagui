import { shorthands } from '@tamagui/shorthands/v5'
import { tokens, defaultThemes } from '@tamagui/themes/v5'
import type { CreateTamaguiProps } from '@tamagui/web'
import { animations } from './v5-animations'
import { fonts } from './v5-fonts'
import { media, mediaQueryDefaultActive } from './v5-media'

export { shorthands } from '@tamagui/shorthands/v5'
export { createThemes } from '@tamagui/theme-builder'
export { tokens, defaultThemes as themes } from '@tamagui/themes/v5'
export { animations } from './v5-animations'
export { createSystemFont, fonts } from './v5-fonts'
export { breakpoints, media, mediaQueryDefaultActive } from './v5-media'

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
