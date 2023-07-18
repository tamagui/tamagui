import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'
import { CreateTamaguiProps } from '@tamagui/web'

import { fonts } from './fonts'
import { media, mediaQueryDefaultActive } from './media'

export * from './animations'

export const configWithoutAnimations = {
  defaultFont: 'body',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  themes,
  media,
  shorthands,
  tokens,
  fonts,
} satisfies CreateTamaguiProps

// @ts-ignore
configWithoutAnimations.selectionStyles = (theme) =>
  theme.color5
    ? {
        backgroundColor: theme.color5,
        color: theme.color11,
      }
    : null

// @ts-ignore bad types
configWithoutAnimations.mediaQueryDefaultActive = mediaQueryDefaultActive
