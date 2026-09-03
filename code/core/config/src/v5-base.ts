import { shorthands } from '@tamagui/shorthands/v4' // v4 same as v5
import type { Shorthands } from '@tamagui/shorthands/v4'
import { themes, tokens } from '@tamagui/themes/v5'
import type { V5Themes, V5Tokens } from '@tamagui/themes/v5'
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
  selectionStyles: typeof selectionStyles
  settings: V5Settings
  sizes: typeof sizes
}

/**
 * Named control sizes on the v5 scales. v5 space is a fraction of size, so the
 * keys step unevenly: space 2 = 7px, 2-5 = 10px, 3 = 13px, 4 = 18px.
 */
export const sizes = {
  default: 'md',
  xs: { fontSize: '2', paddingX: '2', paddingY: '1-5', radius: '2' },
  sm: { fontSize: '3', paddingX: '3', paddingY: '2', radius: '3' },
  md: { fontSize: '4', paddingX: '4', paddingY: '2', radius: '4' },
  lg: { fontSize: '5', paddingX: '5', paddingY: '2-5', radius: '5' },
  xl: { fontSize: '6', paddingX: '6', paddingY: '3', radius: '6' },
} as const

// base config without animations - users must provide their own
export const defaultConfig: V5DefaultConfig = {
  media,
  shorthands,
  themes,
  tokens,
  fonts,
  sizes,
  selectionStyles,
  settings,
}
