import type { TamaguiBuildOptions } from 'tamagui'

export default {
  components: ['tamagui'],
  config: './config/tamagui.config.ts',
  outputCSS: './tamagui.css',
} satisfies TamaguiBuildOptions
