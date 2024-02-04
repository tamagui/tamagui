import { shorthands } from '@tamagui/shorthands'
import { tokens } from '@tamagui/themes/v3'
import { themes } from './themes'

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

type Theme = (typeof themes)['light']
type Themes = Record<keyof typeof themes, Theme>

// avoid themes only on client bundle
const maybeThemes =
  process.env.TAMAGUI_IS_SERVER || process.env.TAMAGUI_KEEP_THEMES
    ? (themes as Themes)
    : ({} as Themes)

console.log('maybeThemes', Object.keys(maybeThemes))

export const config = {
  defaultFont: 'body',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  animations,
  themes: maybeThemes,
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
