import { shorthands } from '@tamagui/shorthands/v2'
import { tokens } from '@tamagui/themes/v4'
import type { CreateTamaguiProps } from '@tamagui/web'
import { animations } from './v3-animations'

import { fonts } from './v4-fonts'
import { media, mediaQueryDefaultActive } from './v4-media'

export { shorthands } from '@tamagui/shorthands/v3'
export { tokens } from '@tamagui/themes/v3-themes'
export { fonts } from './fonts'
export { media, mediaQueryDefaultActive } from './media'
export { animations } from './v4-animations'

export { tamaguiThemes, defaultThemes } from '@tamagui/themes/v4'

export const config = {
  animations,
  media,
  shorthands,
  tokens,
  fonts,
  selectionStyles: (theme) =>
    theme.color5
      ? {
          backgroundColor: theme.color5,
          color: theme.color11,
        }
      : null,
  settings: {
    mediaQueryDefaultActive,
    defaultFont: 'body',
    fastSchemeChange: true,
    shouldAddPrefersColorThemes: true,
    allowedStyleValues: 'somewhat-strict-web',
    themeClassNameOnRoot: true,
  },
} satisfies CreateTamaguiProps
