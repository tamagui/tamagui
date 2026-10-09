import type { TamaguiBuildOptions } from '@tamagui/core'

export default {
  components: ['@tamagui/core'],
  config: './tamagui.config.ts',
  outputCSS: './public/tamagui.generated.css',
} satisfies TamaguiBuildOptions
