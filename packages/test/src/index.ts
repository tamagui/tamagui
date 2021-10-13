import { createTamagui } from '@tamagui/core'

import { shorthands, tokens } from './testConstants'
import { themes } from './testThemes'

const config = createTamagui({
  defaultTheme: 'light',
  disableRootThemeClass: true,
  shorthands,
  themes,
  tokens,
  media: {
    xs: { maxWidth: 660 },
    notXs: { minWidth: 660 + 1 },
    sm: { maxWidth: 860 },
    notSm: { minWidth: 860 + 1 },
    md: { minWidth: 980 },
    notMd: { minWidth: 980 + 1 },
    lg: { minWidth: 1120 },
    notLg: { minWidth: 1120 + 1 },
    xl: { minWidth: 1280 },
    notXl: { minWidth: 1280 + 1 },
    xxl: { minWidth: 1420 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
})

type OurConfig = typeof config

declare module '@tamagui/core' {
  export interface TamaguiCustomConfig extends OurConfig {}
}

export default config
