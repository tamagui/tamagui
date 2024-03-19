import { shorthands } from '@tamagui/shorthands/v2'
import { tokens, themes } from '@tamagui/themes/v3-themes'
import { animations } from './animations'
import type { CreateTamaguiProps } from '@tamagui/web'

import { fonts } from './fonts'
import { media, mediaQueryDefaultActive } from './media'

// fix vite - react native uses global which it doesn't provide
globalThis['global'] ||= globalThis

export { animationsReactNative } from './animationsReactNative'
export { animationsCSS } from './animationsCSS'

export { animations } from './animations'
export { tokens, themes } from '@tamagui/themes/v3-themes'
export { shorthands } from '@tamagui/shorthands/v2'
export { fonts } from './fonts'
export { media, mediaQueryDefaultActive } from './media'

export const selectionStyles = (theme) =>
  theme.color5
    ? {
        backgroundColor: theme.color5,
        color: theme.color11,
      }
    : null

export const config = {
  animations,
  defaultFont: 'body',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  themes,
  media,
  shorthands,
  tokens,
  fonts,
  mediaQueryDefaultActive: mediaQueryDefaultActive,
  selectionStyles,
} satisfies CreateTamaguiProps
