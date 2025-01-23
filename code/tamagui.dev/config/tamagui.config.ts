import { tokens } from '@tamagui/config/v3'
import type { CreateTamaguiProps } from '@tamagui/core'
import { setupDev } from '@tamagui/core'
import { shorthands } from '@tamagui/shorthands/v2'
import { tamaguiThemes } from '@tamagui/themes/v4'
import { createTamagui } from 'tamagui'
import { animations } from './animations'
import {
  bodyFont,
  cherryBombFont,
  dmSansHeadingFont,
  dmSerifDisplayHeadingFont,
  headingFont,
  monoFont,
  munroFont,
  nohemiFont,
  silkscreenFont,
} from './fonts'
// testing tsconfig paths in compiler
import { media, mediaQueryDefaultActive } from '~/config/media'

setupDev({
  visualizer: true,
})

const fonts = {
  heading: headingFont,
  headingDmSans: dmSansHeadingFont,
  headingDmSerifDisplay: dmSerifDisplayHeadingFont,
  headingNohemi: nohemiFont,
  body: bodyFont,
  mono: monoFont,
  silkscreen: silkscreenFont,
  munro: munroFont,
  cherryBomb: cherryBombFont,
}

// for some reason just re-defining these fixes a bug where negative space tokens were dropped
const fixTypescript55Bug = {
  space: tokens.space,
  size: tokens.size,
  radius: tokens.radius,
  zIndex: tokens.zIndex,
  color: tokens.color,
}

export const config = {
  fonts,
  animations,
  themes: tamaguiThemes,
  media,
  shorthands,
  tokens: fixTypescript55Bug,
  settings: {
    defaultFont: 'body',
    shouldAddPrefersColorThemes: true,
    maxDarkLightNesting: 2,
    themeClassNameOnRoot: true,
    mediaQueryDefaultActive,
    selectionStyles: (theme) => ({
      backgroundColor: theme.color5,
      color: theme.color11,
    }),
    allowedStyleValues: 'somewhat-strict-web',
    autocompleteSpecificTokens: 'except-special',
  },
} satisfies CreateTamaguiProps

// for site responsive demo, but we want no types
Object.assign(config.media, {
  tiny: { maxWidth: 500 },
  gtTiny: { minWidth: 500 + 1 },
  small: { maxWidth: 620 },
  gtSmall: { minWidth: 620 + 1 },
  medium: { maxWidth: 780 },
  gtMedium: { minWidth: 780 + 1 },
  large: { maxWidth: 900 },
  gtLarge: { minWidth: 900 + 1 },
})

const tamaConf = createTamagui(config)

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'takeoutBody' | 'content' | 'item'
  }
}

export default tamaConf
