import type { TamaguiBuildOptions } from '@tamagui/style'

export default {
  components: ['@tamagui/style'],
  config: './tamagui.config.ts',
  outputCSS: './public/tamagui.generated.css',
} satisfies TamaguiBuildOptions
