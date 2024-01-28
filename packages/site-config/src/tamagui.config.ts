import { shorthands } from '@tamagui/shorthands'
import { tokens } from '@tamagui/themes/v2'
import { themes as themesv2 } from '@tamagui/themes/v2-themes'
import type { CreateTamaguiProps } from '@tamagui/web'
import { setupDev } from '@tamagui/web'

import { animations } from './animations'
import { media, mediaQueryDefaultActive } from './media'
import {
  headingFont,
  dmSansHeadingFont,
  dmSerifDisplayHeadingFont,
  nohemiFont,
  bodyFont,
  monoFont,
  silkscreenFont,
  munroFont,
  cherryBombFont,
} from './fonts'

export { animations } from './animations'

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

const light_tan_palette = [
  'hsla(40, 40%, 93%, 1)',
  'hsla(40, 36%, 90%, 1)',
  'hsla(38, 35%, 87%, 1)',
  'hsla(36, 34%, 84%, 1)',
  'hsla(36, 33%, 80%, 1)',
  'hsla(35, 32%, 77%, 1)',
  'hsla(35, 31%, 74%, 1)',
  'hsla(34, 30%, 70%, 1)',
  'hsla(35, 30%, 67%, 1)',
  'hsla(34, 29%, 47%, 1)',
  'hsla(35, 28%, 37%, 1)',
  'hsla(35, 27%, 20%, 1)',
]

const light_tan = {
  color1: light_tan_palette[0],
  color2: light_tan_palette[1],
  color3: light_tan_palette[2],
  color4: light_tan_palette[3],
  color5: light_tan_palette[4],
  color6: light_tan_palette[5],
  color7: light_tan_palette[6],
  color8: light_tan_palette[7],
  color9: light_tan_palette[8],
  color10: light_tan_palette[9],
  color11: light_tan_palette[10],
  color12: light_tan_palette[11],
  color: light_tan_palette[11],
  background: light_tan_palette[0],
}

const dark_tan_palette = [
  'hsla(30, 10%, 14%, 1)',
  'hsla(30, 13%, 16%, 1)',
  'hsla(31, 15%, 22%, 1)',
  'hsla(30, 18%, 25%, 1)',
  'hsla(30, 21%, 32%, 1)',
  'hsla(30, 22%, 36%, 1)',
  'hsla(30, 23%, 49%, 1)',
  'hsla(30, 24%, 50%, 1)',
  'hsla(30, 25%, 52%, 1)',
  'hsla(29, 28%, 65%, 1)',
  'hsla(34, 24%, 71%, 1)',
  'hsla(11, 16%, 74%, 1)',
]

const dark_tan = {
  color1: dark_tan_palette[0],
  color2: dark_tan_palette[1],
  color3: dark_tan_palette[2],
  color4: dark_tan_palette[3],
  color5: dark_tan_palette[4],
  color6: dark_tan_palette[5],
  color7: dark_tan_palette[6],
  color8: dark_tan_palette[7],
  color9: dark_tan_palette[8],
  color10: dark_tan_palette[9],
  color11: dark_tan_palette[10],
  color12: dark_tan_palette[11],
  color: dark_tan_palette[11],
  background: dark_tan_palette[0],
}

const themesIn = {
  ...themesv2,

  light_tan,
  dark_tan,
}

// avoid themes only on client bundle
const themes =
  process.env.TAMAGUI_IS_SERVER || process.env.TAMAGUI_KEEP_THEMES
    ? themesIn
    : ({} as typeof themesIn)

console.log('themes', themes)

export const config = {
  defaultFont: 'body',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  animations,
  themes,
  media,
  shorthands,
  tokens,
  mediaQueryDefaultActive,
  selectionStyles: (theme) => ({
    backgroundColor: theme.color5,
    color: theme.color11,
  }),
  settings: {
    allowedStyleValues: 'somewhat-strict-web',
    autocompleteSpecificTokens: 'except-special',
    // mediaPropOrder: true,
  },
  fonts,
} satisfies CreateTamaguiProps
