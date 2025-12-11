import { shorthands } from '@tamagui/shorthands/v5'
import { themes, tokens } from '@tamagui/themes/v5'
import type { CreateTamaguiProps } from '@tamagui/web'
import { animations } from './v5-animations'
import { fonts } from './v5-fonts'
import { media, mediaQueryDefaultActive } from './v5-media'

export { shorthands } from '@tamagui/shorthands/v5'
export { createThemes } from '@tamagui/theme-builder'
export { themes, tokens } from '@tamagui/themes/v5'
export { animations } from './v5-animations'
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
  // allow two inverses (tooltips, etc)
  // TODO on inverse theme changes
  maxDarkLightNesting: 2,
  styleCompat: 'react-native',
} satisfies CreateTamaguiProps['settings']

export const defaultConfig = {
  animations,
  media,
  shorthands,
  themes,
  tokens,
  fonts,
  selectionStyles,
  settings,
} satisfies CreateTamaguiProps
