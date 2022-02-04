import { createTamagui } from 'tamagui'

import { shorthands } from './constants/shorthands'
import { themes } from './constants/themes'
import { tokens } from './constants/tokens'

const config = createTamagui({
  defaultTheme: 'light',
  disableRootThemeClass: true,
  shorthands,
  themes,
  tokens,
  media: {
    xs: { maxWidth: 660 },
    gtXs: { minWidth: 660 + 1 },
    sm: { maxWidth: 860 },
    gtSm: { minWidth: 860 + 1 },
    md: { minWidth: 980 },
    gtMd: { minWidth: 980 + 1 },
    lg: { minWidth: 1120 },
    gtLg: { minWidth: 1120 + 1 },
    xl: { minWidth: 1280 },
    xxl: { minWidth: 1420 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
