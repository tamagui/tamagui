import type { TamaguiBuildOptions } from '@tamagui/core'

export default {
  components: ['@my/ui'],
  config: './tamagui.config.ts',
  outputCSS: './public/tamagui.generated.css',
} satisfies TamaguiBuildOptions
