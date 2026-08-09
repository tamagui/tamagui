import { animationsCSS } from '@tamagui/config/animations-css'
import { animationsMotion } from '@tamagui/config/animations-motion'
import { defaultConfig } from '@tamagui/config/v5-subtle'
import type { CreateTamaguiProps } from '@tamagui/core'
import { setupDev } from '@tamagui/core'
import { bodyFont, cherryBombFont, headingFont, monoFont, silkscreenFont } from './fonts'
import { media, mediaQueryDefaultActive } from './media'
import { clientThemes } from './themeMetadata'
import { themes } from './themes'

setupDev({
  visualizer: true,
})

const fonts = {
  heading: headingFont,
  body: bodyFont,
  mono: monoFont,
  silkscreen: silkscreenFont,
  cherryBomb: cherryBombFont,
}

export const animations = {
  default: animationsMotion,
  css: animationsCSS,
}

const configuredThemes =
  process.env.VITE_ENVIRONMENT === 'client'
    ? (clientThemes as unknown as typeof themes)
    : themes

export const config = {
  ...defaultConfig,
  themes: configuredThemes,
  fonts,
  animations,
  media,
  settings: {
    ...defaultConfig.settings,
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
