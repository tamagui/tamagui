import type { TamaguiBuildOptions } from 'tamagui'

export default {
  components: ['tamagui'],
  config: './src/tamagui.config.ts',
  experimental: {
    nativeFastPath: process.env.TAMAGUI_NATIVE_FAST_PATH === '1',
  },
} satisfies TamaguiBuildOptions
