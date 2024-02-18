import type { TamaguiBuildOptions } from '@tamagui/core'
import { join } from 'path'

export default {
  emitSingleCSSFile: false,
  // useReactNativeWebLite: true,
  config: './tamagui.config.ts',
  themeBuilder: {
    input: '@tamagui/themes/src/themes-new.ts',
    output: join(
      require.resolve('@tamagui/themes/src/themes-new.ts'),
      '..',
      'generated-new.ts'
    ),
  },
  outputCSS: './public/tamagui.css',
  components: ['tamagui'],
  importsWhitelist: ['constants.js', 'colors.js'],
  logTimings: true,
  // enableDynamicEvaluation: true,
  disableExtraction: process.env.NODE_ENV === 'development',
  excludeReactNativeWebExports: [
    'Switch',
    'ProgressBar',
    'Picker',
    'CheckBox',
    'Touchable',
    // need this for bento /lists
    // 'FlatList',
    'Modal',
  ],
} satisfies TamaguiBuildOptions
