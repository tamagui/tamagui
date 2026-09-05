import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from 'tamagui'

/**
 * The mixed-color-spelling config. One color is written four ways across theme
 * keys, and a second color is written as a name in the theme and as hex in a
 * color token, so a theme value collapses onto a token variable.
 *
 * This is the config the theme-variable collapse and the hydration premise
 * share: the collapse folds equivalent spellings onto one variable, and
 * hydration then has to agree about the value behind that variable.
 */
export const SPELLINGS = {
  background: '#1a2b3c',
  color: 'rgb(26, 43, 60)',
  borderColor: 'hsl(210, 39.5%, 16.9%)',
  placeholderColor: 'rgba(26,43,60,1)',
  // spelled as a name here and as hex in the color token below
  outlineColor: 'white',
} as const

export const config = createTamagui({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    color: { ...defaultConfig.tokens.color, pureWhite: '#ffffff' },
  },
  themes: {
    light: { ...defaultConfig.themes.light, ...SPELLINGS },
    dark: { ...defaultConfig.themes.dark, ...SPELLINGS },
  },
})

export default config

export type Conf = typeof config
