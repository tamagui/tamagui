import { animationsCSS } from '@tamagui/config/v5-css'
import { animationsMotion } from '@tamagui/config/v5-motion'
import { defaultConfig } from '@tamagui/config/v5-subtle'
import type { CreateTamaguiProps } from '@tamagui/core'
import { setupDev } from '@tamagui/core'
import { createV5Theme, subtleChildrenThemes } from '@tamagui/themes/v5-subtle-builder'
import { bodyFont, cherryBombFont, headingFont, monoFont, silkscreenFont } from './fonts'
import { media, mediaQueryDefaultActive } from './media'
import { clientThemes } from './themeMetadata'
import { toV6Themes } from '@tamagui/config/v6-base'

// only generate the accent themes the site actually uses: red/green/blue/gray/yellow
// (the @tamagui/logo tint family). dropping orange/pink/purple/teal/neutral roughly
// halves the render-blocking theme css. note: dropping an accent also removes its
// color tokens (--pink10 etc.), so all pink/purple/orange/teal/neutral usages are
// collapsed to kept colors across the site. component themes are kept (they dedupe to
// surfaces in css and the site shows them off). theme values are stripped on the
// client below and hydrated from css, while names remain for deterministic SSR.
const { gray, blue, red, yellow, green } = subtleChildrenThemes
const themes = toV6Themes(
  createV5Theme({
    childrenThemes: { gray, blue, red, yellow, green },
  })
)

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

// Preserve the site's established scales while emitting its custom themes in
// the sole V3 built-in namespace.
export const config = {
  ...defaultConfig,
  themes:
    process.env.VITE_ENVIRONMENT === 'client'
      ? (clientThemes as unknown as typeof themes)
      : themes,
  fonts,
  animations,
  media,
  settings: {
    ...defaultConfig.settings,
    mediaQueryDefaultActive,
    allowedStyleValues: 'somewhat-strict-web',
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
