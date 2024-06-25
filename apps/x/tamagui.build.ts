import type { TamaguiBuildOptions } from 'tamagui'

export default {
  components: ['tamagui'],
  config: './src/tamagui.config.ts',
  outputCSS: './tamagui.css',
} satisfies TamaguiBuildOptions
