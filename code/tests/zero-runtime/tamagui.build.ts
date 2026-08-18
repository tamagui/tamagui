import type { TamaguiBuildOptions } from '@tamagui/types'

// `full` builds the same entry as ordinary compiled Tamagui. It is the "before"
// half of the styled-definition scoping probe: same lowering, no zero-mode
// reference erasure.
const isFullRuntimeProbe = process.env.TAMAGUI_ZERO_FIXTURE === 'full'

export default {
  components: ['tamagui'],
  config: './tamagui.config.ts',
  outputCSS: './.tamagui/zero/tamagui-zero.css',
  experimental: isFullRuntimeProbe
    ? {}
    : { zeroRuntime: { islands: ['src/islands/SheetIsland.tsx'] } },
} satisfies TamaguiBuildOptions
