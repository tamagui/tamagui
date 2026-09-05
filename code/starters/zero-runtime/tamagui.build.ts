import type { TamaguiBuildOptions } from '@tamagui/types'

/**
 * `TAMAGUI_ZERO_ISLANDS=0` builds the same app with no declared island, which
 * is the base receipt each integration has to pass before it is listed as
 * supporting zero-runtime at all. Island support is a separate qualification.
 */
const withIslands = process.env.TAMAGUI_ZERO_ISLANDS !== '0'

export default {
  components: ['tamagui'],
  config: './tamagui.config.ts',
  outputCSS: './.tamagui/zero/tamagui-zero.css',
  experimental: {
    zeroRuntime: withIslands ? { islands: ['src/islands/DetailsIsland.tsx'] } : true,
  },
} satisfies TamaguiBuildOptions
