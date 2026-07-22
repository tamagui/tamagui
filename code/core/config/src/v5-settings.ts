import type { CreateTamaguiProps } from '@tamagui/web'
import { mediaQueryDefaultActive } from './v5-media'

// shared by v5-base and v6-base. lives in its own module (not v5-base) so the v6
// entries can reuse the v5 settings without pulling the generated v5 themes.

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
  defaultSize: '$4',
  fastSchemeChange: true,
  shouldAddPrefersColorThemes: true,
  allowedStyleValues: 'somewhat-strict-web',
  addThemeClassName: 'html',
  onlyAllowShorthands: true,
  styleCompat: 'web',
} satisfies CreateTamaguiProps['settings']

export type V5Settings = typeof settings
