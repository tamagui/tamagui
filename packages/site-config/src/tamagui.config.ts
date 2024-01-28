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

const light_tan = {
  color1: 'rgba(252, 244, 227, 1)',
  color2: 'rgba(249, 237, 213, 1)',
  color3: 'rgba(246, 229, 199, 1)',
  color4: 'rgba(243, 221, 186, 1)',
  color5: 'rgba(240, 213, 172, 1)',
  color6: 'rgba(237, 205, 158, 1)',
  color7: 'rgba(234, 197, 144, 1)',
  color8: 'rgba(231, 189, 131, 1)',
  color9: 'rgba(228, 182, 117, 1)',
  color10: 'rgba(205, 154, 90, 1)',
  color11: 'rgba(152, 106, 40, 1)',
  color12: '#000',
  backgroundHover: 'rgba(246, 229, 199, 0.8)',
  backgroundFocus: 'rgba(240, 213, 172, 0.8)',
  backgroundPress: 'rgba(234, 197, 144, 0.8)',
  colorHover: 'rgba(222, 166, 90, 0.8)',
  colorFocus: 'rgba(225, 174, 103, 0.8)',
  colorPress: 'rgba(228, 182, 117, 0.8)',
  borderHover: 'rgba(237, 205, 158, 0.8)',
  borderFocus: 'rgba(231, 189, 131, 0.8)',
  borderPress: 'rgba(225, 174, 103, 0.8)',
  shadowHover: 'rgba(222, 166, 90, 0.4)',
  shadowFocus: 'rgba(225, 174, 103, 0.4)',
  shadowPress: 'rgba(228, 182, 117, 0.4)',
  outlineColor: 'rgba(219, 158, 76, 1)',
  backgroundTransparent: 'rgba(252, 244, 227, 0)',
}

const dark_tan = {
  color1: 'rgba(55, 43, 31, 1)',
  color2: 'rgba(61, 48, 35, 1)',
  color3: 'rgba(68, 54, 39, 1)',
  color4: 'rgba(74, 59, 43, 1)',
  color5: 'rgba(80, 64, 47, 1)',
  color6: 'rgba(86, 69, 51, 1)',
  color7: 'rgba(93, 74, 55, 1)',
  color8: 'rgba(99, 79, 59, 1)',
  color9: 'rgba(105, 84, 63, 1)',
  color10: 'rgba(112, 89, 67, 1)',
  color11: 'rgba(222, 166, 90, 1)',
  color12: 'rgba(242, 200, 190, 1)',
  backgroundHover: 'rgba(68, 54, 39, 0.8)',
  backgroundFocus: 'rgba(80, 64, 47, 0.8)',
  backgroundPress: 'rgba(93, 74, 55, 0.8)',
  colorHover: 'rgba(118, 94, 71, 0.8)',
  colorFocus: 'rgba(112, 89, 67, 0.8)',
  colorPress: 'rgba(105, 84, 63, 0.8)',
  borderHover: 'rgba(86, 69, 51, 0.8)',
  borderFocus: 'rgba(99, 79, 59, 0.8)',
  borderPress: 'rgba(112, 89, 67, 0.8)',
  shadowHover: 'rgba(118, 94, 71, 0.4)',
  shadowFocus: 'rgba(112, 89, 67, 0.4)',
  shadowPress: 'rgba(105, 84, 63, 0.4)',
  outlineColor: 'rgba(124, 99, 75, 1)',
  backgroundTransparent: 'rgba(55, 43, 31, 0)',
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
