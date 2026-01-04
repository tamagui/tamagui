import type { TamaguiBuildOptions } from 'tamagui'

export default {
  config: '../../packages/config/src/tamagui.config.ts',
  components: ['tamagui', '@my/ui'],
  importsWhitelist: ['constants.js', 'colors.js'],
  outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
  excludeReactNativeWebExports: [
    'Switch',
    'ProgressBar',
    'Picker',
    'CheckBox',
    'Touchable',
  ],
} satisfies TamaguiBuildOptions
