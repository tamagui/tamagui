import type { TamaguiBuildOptions } from '@tamagui/core'

const disableExtraction =
  process.env.NODE_ENV === 'development' &&
  (process.env.DISABLE_EXTRACTION ? JSON.parse(process.env.DISABLE_EXTRACTION) : true)

export default {
  /**
   * these two probably are all you need!
   **/
  config: './tamagui.config.ts',
  components: ['tamagui'],

  /**
   * these are mostly not necessary except for advanced cases:
   **/
  importsWhitelist: ['constants.js', 'colors.js'],
  disableExtraction,

  excludeReactNativeWebExports: [
    'Switch',
    'ProgressBar',
    'Picker',
    'CheckBox',
    'Touchable',
    'Modal',
  ],
} satisfies TamaguiBuildOptions
