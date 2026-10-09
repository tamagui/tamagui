import { animationsCSS } from '@tamagui/config/animations-css'
import { animationsMotion } from '@tamagui/config/animations-motion'
// v6-base rather than v6: `defaultConfig` carries a whole theme pack the site
// replaces with its own themes
import {
  createV6Config,
  mediaQueryDefaultActive,
  withTailwindTypeScale,
} from '@tamagui/config/v6-base'
import type { CreateTamaguiProps } from '@tamagui/core'
import { setupDev } from '@tamagui/core'
import { bodyFont, cherryBombFont, headingFont, monoFont } from './fonts'
import { clientThemes } from './themeMetadata'
import { themes } from './themes'

setupDev({
  visualizer: true,
})

export const animations = {
  default: animationsMotion,
  css: animationsCSS,
}

const configuredThemes =
  process.env.VITE_ENVIRONMENT === 'client'
    ? (clientThemes as unknown as typeof themes)
    : themes

const v6 = createV6Config({ themes: configuredThemes })

export const config = {
  ...v6,
  fonts: {
    heading: withTailwindTypeScale(headingFont),
    body: withTailwindTypeScale(bodyFont),
    mono: monoFont,
    cherryBomb: cherryBombFont,
  },
  animations,
  // a copy, since the demo media below is assigned onto it
  media: { ...v6.media },
  settings: {
    ...v6.settings,
    mediaQueryDefaultActive,
    allowedStyleValues: 'somewhat-strict-web',
    // allow both shorthands and longhand names for flexibility
    onlyAllowShorthands: false,
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
