import { animationsCSS } from '@tamagui/config/v5-css'
import { animationsMotion } from '@tamagui/config/v5-motion'
import { defaultConfig, themes } from '@tamagui/config/v5-subtle'
import type { CreateTamaguiProps } from '@tamagui/core'
import { setupDev } from '@tamagui/core'
import { bodyFont, cherryBombFont, headingFont, monoFont, silkscreenFont } from './fonts'
import { media, mediaQueryDefaultActive } from './media'

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

// Use v5 config as base, but with tamagui.dev custom themes
export const config = {
  ...defaultConfig,
  themes: process.env.VITE_ENVIRONMENT === 'client' ? ({} as typeof themes) : themes,
  fonts,
  animations: {
    default: animationsMotion,
    css: animationsCSS,
  },
  media,
  settings: {
    ...defaultConfig.settings,
    defaultFont: 'body',
    shouldAddPrefersColorThemes: true,
    mediaQueryDefaultActive,
    selectionStyles: (theme) => ({
      backgroundColor: theme.color5,
      color: theme.color11,
    }),
    allowedStyleValues: 'somewhat-strict-web',
    autocompleteSpecificTokens: 'except-special',
    // Allow both shorthands and longhand names for flexibility
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
