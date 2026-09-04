import type { CreateTamaguiProps } from '@tamagui/web'
import { mediaQueryDefaultActive } from './media'

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
  fastSchemeChange: true,
  shouldAddPrefersColorThemes: true,
  allowedStyleValues: 'somewhat-strict-web',
  addThemeClassName: 'html',
  onlyAllowShorthands: true,
  styleCompat: 'web',
} satisfies CreateTamaguiProps['settings']

export type Settings = typeof settings

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
