import type { TamaguiBuildOptions } from '@tamagui/core'

export default {
  components: ['@tamagui/core'],
  config: './tamagui.config.ts',
  outputCSS: './public/tamagui.css',
} satisfies TamaguiBuildOptions
