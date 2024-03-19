import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'
import type { CreateTamaguiProps } from '@tamagui/web'

import { fonts } from './fonts'
import { media, mediaQueryDefaultActive } from './media'

export const configWithoutAnimations = {
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
