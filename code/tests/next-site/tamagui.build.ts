import type { TamaguiBuildOptions } from '@tamagui/core'

const disableExtraction =
  process.env.NODE_ENV === 'development' &&
  (process.env.DISABLE_EXTRACTION ? JSON.parse(process.env.DISABLE_EXTRACTION) : true)

export default {
  config: './tamagui.config.ts',
  components: ['tamagui'],
  outputCSS: './public/tamagui.generated.css',
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
