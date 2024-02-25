import type { TamaguiBuildOptions } from '@tamagui/core'
import { join } from 'path'

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
  disableExtraction: process.env.NODE_ENV === 'development',
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
