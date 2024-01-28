import { shorthands } from '@tamagui/shorthands'
import { tokens } from '@tamagui/themes/v2'
import { themes } from '@tamagui/themes/v2-themes'
import type { CreateTamaguiProps } from '@tamagui/web'

import { fonts } from './fonts'
import { media, mediaQueryDefaultActive } from './media'

export const config = {
  defaultFont: 'body',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  themes,
  media,
  shorthands,
  tokens,
  fonts,
  mediaQueryDefaultActive: mediaQueryDefaultActive,
  selectionStyles: (theme) =>
    theme.color5
      ? {
          backgroundColor: theme.color5,
          color: theme.color11,
        }
      : null,
} satisfies CreateTamaguiProps
