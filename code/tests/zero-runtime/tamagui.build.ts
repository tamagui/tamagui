import type { TamaguiBuildOptions } from '@tamagui/types'

const fixture = process.env.TAMAGUI_ZERO_FIXTURE

// `full` builds the same entry as ordinary compiled Tamagui with no owned
// artifact. It is the "before" half of the styled-definition scoping probe:
// same lowering, no zero-mode reference erasure.
//
// `global` is the compiled-global-CSS tier: ordinary compiled Tamagui plus an
// owned outputCSS artifact, from which the build derives TAMAGUI_DID_OUTPUT_CSS.
// It writes to its own path so a zero build and a global build never decide
// what the other's assertions read.
const isFullRuntimeProbe = fixture === 'full'
const isGlobalCSSTier = fixture?.startsWith('global') === true

export default {
  components: ['tamagui'],
  config: './tamagui.config.ts',
  ...(isFullRuntimeProbe
    ? { experimental: {} }
    : isGlobalCSSTier
      ? {
          outputCSS: './.tamagui/global/tamagui-global.css',
          experimental: {},
        }
      : {
          outputCSS: './.tamagui/zero/tamagui-zero.css',
          experimental: { zeroRuntime: { islands: ['src/islands/SheetIsland.tsx'] } },
        }),
} satisfies TamaguiBuildOptions
