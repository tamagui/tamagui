import { defaultConfig, themes } from '@tamagui/config/v5'
import type { CreateTamaguiProps } from '@tamagui/core'
import { setupDev } from '@tamagui/core'
import { animationsCSS } from './animations.css'
import { animationsMotion } from './animations.motion'
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

  // v5 removed component themes - restore old visual behavior via defaultProps
  // this keeps the site looking the same while demos show explicit theme usage
  // see: https://tamagui.dev/docs/core/config-v5#migrating-from-component-themes
  defaultProps: {
    Button: { theme: 'surface3' },
    Input: { theme: 'surface1' },
    Progress: { theme: 'surface1' },
    ProgressIndicator: { theme: 'accent' },
    SliderTrack: { theme: 'surface3' },
    SliderTrackActive: { theme: 'accent' },
    SliderThumb: { theme: 'accent' },
    Switch: { theme: 'surface2' },
    SwitchThumb: { theme: 'accent' },
    TextArea: { theme: 'surface1' },
    Tooltip: { theme: 'accent' },
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
