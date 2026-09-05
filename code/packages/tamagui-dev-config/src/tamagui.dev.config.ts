import { animationsCSS } from '@tamagui/config/animations-css'
import { animationsMotion } from '@tamagui/config/animations-motion'
// the pieces of the v5 default config the site keeps, each from its narrowest
// entry point. `@tamagui/config/v5-subtle` re-exports a whole theme pack, and
// `defaultConfig` holds another, so touching either ships ~250kb of theme values
// to the browser that the `themes:` line below then replaces.
import {
  selectionStyles,
  settings as defaultSettings,
  sizes,
} from '@tamagui/config/settings'
import type { CreateTamaguiProps } from '@tamagui/core'
import { setupDev } from '@tamagui/core'
import { shorthands } from '@tamagui/shorthands/v4'
import { tokens } from '@tamagui/themes/v5'
import { bodyFont, cherryBombFont, headingFont, monoFont } from './fonts'
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
  shorthands,
  tokens,
  selectionStyles,
  sizes,
  themes: configuredThemes,
  fonts,
  animations,
  media,
  settings: {
    ...defaultSettings,
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
