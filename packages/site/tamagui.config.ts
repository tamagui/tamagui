import { createTamagui } from 'tamagui'

import { shorthands } from './constants/shorthands'
import { themes } from './constants/themes'
import { tokens } from './constants/tokens'

const config = createTamagui({
  defaultTheme: 'light',
  shorthands,
  themes,
  tokens,
  // defaultProps: {
  //   Button: {
  //     scaleIcon: 2,
  //   },
  // },
  // mediaScale: {
  //   horizontal: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  //   vertical: ['short', 'tall'],
  // },
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 860 },
    md: { maxWidth: 980 },
    lg: { maxWidth: 1120 },
    xl: { maxWidth: 1280 },
    xxl: { maxWidth: 1420 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 860 + 1 },
    gtMd: { minWidth: 980 + 1 },
    gtLg: { minWidth: 1120 + 1 },
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
