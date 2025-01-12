import {
  animations,
  fonts,
  media,
  selectionStyles,
  themes,
  mediaQueryDefaultActive,
  tokens,
} from '@tamagui/config/v3'
import { shorthands } from '@tamagui/shorthands/v2'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
  animations,
  themes,
  media,
  tokens,
  fonts,
  selectionStyles,
  shorthands,
  settings: {
    defaultFont: 'body',
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,
    mediaQueryDefaultActive,
    selectionStyles: (theme) => ({
      backgroundColor: theme.color5,
      color: theme.color11,
    }),
    allowedStyleValues: 'somewhat-strict-web',
    autocompleteSpecificTokens: 'except-special',
  },
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'other'
  }
}

export default config
