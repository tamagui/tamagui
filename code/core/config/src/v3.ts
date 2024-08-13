import { shorthands } from '@tamagui/shorthands/v2'
import { tokens, themes as themesIn } from '@tamagui/themes/v3-themes'
import { animations } from './v3-animations'
import type { CreateTamaguiProps } from '@tamagui/web'

import { fonts } from './fonts'
import { media, mediaQueryDefaultActive } from './media'

// fix vite - react native uses global which it doesn't provide
globalThis['global'] ||= globalThis

export { animations } from './v3-animations'
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

// tree shake away themes in production
const themes =
  process.env.TAMAGUI_OPTIMIZE_THEMES === 'true' ? ({} as typeof themesIn) : themesIn

export const config = {
  animations,
  themes,
  media,
  shorthands,
  tokens,
  fonts,
  selectionStyles,
  settings: {
    mediaQueryDefaultActive,
    defaultFont: 'body',
    fastSchemeChange: true,
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,
  },
} satisfies CreateTamaguiProps
