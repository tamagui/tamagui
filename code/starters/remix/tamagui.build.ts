import type { TamaguiBuildOptions } from '@tamagui/core'

export default {
  components: ['tamagui'],
  config: 'tamagui.config.ts',
  useReactNativeWebLite: 'without-animated',
  outputCSS: './app/tamagui.css',
} satisfies TamaguiBuildOptions
