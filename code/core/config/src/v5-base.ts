import { shorthands } from '@tamagui/shorthands/v4' // v4 same as v5
import type { Shorthands } from '@tamagui/shorthands/v4'
import { themes, tokens } from '@tamagui/themes/v5'
import type { V5Themes, V5Tokens } from '@tamagui/themes/v5'
import type { GenericSizing } from '@tamagui/web'
import { fonts } from './v5-fonts'
import type { V5Fonts } from './v5-fonts'
import { media } from './media'
import type { Media as V5Media } from './media'
import { selectionStyles, settings } from './settings'
import type { Settings as V5Settings } from './settings'

export { shorthands } from '@tamagui/shorthands/v4'
// static re-exports only, so this compatibility config stays free of the
// retired v5 theme builder on native.
export {
  tokens,
  type V5Theme,
  type V5ThemeNames,
  type V5Themes,
  type V5Tokens,
} from '@tamagui/themes/v5'
export { createSystemFont, fonts } from './v5-fonts'
export type { V5Fonts } from './v5-fonts'
export { breakpoints, media, mediaQueryDefaultActive } from './media'
export type { Media as V5Media } from './media'
export { selectionStyles, settings } from './settings'
export type { Settings as V5Settings } from './settings'

export type V5DefaultConfig = {
  media: V5Media
  shorthands: Shorthands
  themes: V5Themes
  tokens: V5Tokens
  fonts: V5Fonts
  settings: V5Settings
  sizing: GenericSizing
}

// v5's numeric scales cannot derive the ladder, so each rung points text,
// padding and radius at v5 keys and pins the frozen geometry: v5 buttons
// keep their heights while their text and spacing go v5-native
export const defaultSizing = {
  default: 'md',
  sizes: {
    xs: {
      fontSize: '1',
      controlFontSize: '1',
      paddingInline: '2',
      paddingBlock: '1-5',
      gap: '1-5',
      radius: '1',
      px: { height: 24, icon: 12, square: 17 },
    },
    sm: {
      fontSize: '3',
      controlFontSize: '3',
      paddingInline: '3',
      paddingBlock: '2',
      gap: '2',
      radius: '2',
      px: { height: 32, icon: 16, square: 20 },
    },
    md: {
      fontSize: '3',
      controlFontSize: '3',
      paddingInline: '3-5',
      paddingBlock: '2',
      gap: '2',
      radius: '2',
      px: { height: 36, icon: 16, square: 22 },
    },
    lg: {
      fontSize: '5',
      controlFontSize: '5',
      paddingInline: '5',
      paddingBlock: '2',
      gap: '2',
      radius: '2',
      px: { height: 40, icon: 16, square: 25 },
    },
    xl: {
      fontSize: '6',
      controlFontSize: '6',
      paddingInline: '6',
      paddingBlock: '2-5',
      gap: '2-5',
      radius: '3',
      px: { height: 48, icon: 20, square: 28 },
    },
  },
} as const satisfies GenericSizing

// base config without animations - users must provide their own
export const defaultConfig: V5DefaultConfig = {
  media,
  shorthands,
  themes,
  tokens,
  fonts,
  settings,
  sizing: defaultSizing,
}
