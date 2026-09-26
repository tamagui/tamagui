import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui, isClient } from 'tamagui'

/**
 * the compiled-global-CSS form used by applications that keep theme values out
 * of the client config. build-time evaluation owns the complete themes and
 * writes them to outputCSS. browser evaluation passes an empty object and must
 * rebuild those values from the artifact already loaded into the document.
 */
const inputThemes = isClient
  ? {}
  : {
      light: {
        ...defaultConfig.themes.light,
        background: '#123456',
        color: '#abcdef',
      },
      dark: {
        ...defaultConfig.themes.dark,
        background: '#654321',
        color: '#fedcba',
      },
    }

export const inputThemeNameCount = Object.keys(inputThemes).length
export const inputThemeValueCount = Object.values(inputThemes).reduce(
  (count, theme) => count + Object.keys(theme).length,
  0
)

export const config = createTamagui({
  ...defaultConfig,
  themes: inputThemes,
})

export default config

export type Conf = typeof config
