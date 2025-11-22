import { defaultConfig } from '@tamagui/config/v4'
import type { CreateTamaguiProps } from '@tamagui/core'
import { setupDev } from '@tamagui/core'
import { animations } from './animations'
import { bodyFont, cherryBombFont, headingFont, monoFont, silkscreenFont } from './fonts'
import { media, mediaQueryDefaultActive } from './media'
import { themeDev } from './theme.dev'

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

// Use v4 config as base and override with our customizations
export const config = {
  ...defaultConfig,
  fonts,
  animations,
  themes: themeDev,
  media,
  // v4 has shorthands built-in, no need to import
  settings: {
    ...defaultConfig.settings,
    defaultFont: 'body',
    shouldAddPrefersColorThemes: true,
    maxDarkLightNesting: 2,
    themeClassNameOnRoot: true,
    disableRootThemeClass: true,
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
