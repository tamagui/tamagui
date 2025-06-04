import type { TamaguiBuildOptions } from '@tamagui/core'
import { join } from 'node:path'

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
  outputCSS: './public/tamagui.css',
  importsWhitelist: ['constants.js', 'colors.js'],
  disableExtraction,
  themeBuilder: {
    input: '@tamagui/themes/src/themes-new.ts',
    output: join(
      require.resolve('@tamagui/themes/src/themes-new.ts'),
      '..',
      'generated-new.ts'
    ),
  },

  excludeReactNativeWebExports: [
    'Switch',
    'ProgressBar',
    'Picker',
    'CheckBox',
    'Touchable',
    'Modal',
  ],
} satisfies TamaguiBuildOptions
