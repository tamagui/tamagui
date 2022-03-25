import { themes, tokens } from '@tamagui/theme-base'
import { createTamagui } from 'tamagui'

import { animations } from './constants/animations'
import { shorthands } from './constants/shorthands'

const config = createTamagui({
  animations,
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
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
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
