import type { TamaguiBuildOptions } from '@tamagui/core'

export default {
  components: ['tamagui'],
  config: './config/tamagui/tamagui.config.ts',
  outputCSS: './app/tamagui.generated.css',
} satisfies TamaguiBuildOptions
