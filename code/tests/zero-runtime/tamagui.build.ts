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
// `rules-full` is the full-driver half of the three-artifact animation
// measurement: the same authored rule module, ordinary compiled Tamagui, so
// createAnimations and the component animation path stay reachable.
//
// `dom-client` and `dom-tables` are the DOM demotion receipts: both are regular
// full-runtime web clients, and the second one adds the value import of
// @tamagui/dom that proves the absence check on the first one can fail.
const isFullRuntimeProbe =
  fixture === 'full' ||
  fixture === 'rules-full' ||
  fixture === 'dom-client' ||
  fixture === 'dom-tables'
const isGlobalCSSTier = fixture?.startsWith('global') === true

// The rule fixtures build one authored module at a time, with no island, so the
// enforce and report builds see the identical input and can be compared. `rules`
// enforces; `rules-report` runs the same analysis and exits successfully.
const isRuleFixture = fixture?.startsWith('rules') === true

export default {
  components: ['tamagui'],
  config:
    fixture === 'rules-motion' ? './tamagui.motion.config.ts' : './tamagui.config.ts',
  ...(isFullRuntimeProbe
    ? { experimental: {} }
    : isGlobalCSSTier
      ? {
          outputCSS: './.tamagui/global/tamagui-global.css',
          experimental: {},
        }
      : isRuleFixture
        ? // `report` keeps the full runtime and owns no artifact, so it sets no
          // outputCSS: the compiled-global tier is a separate feature and would
          // otherwise require these entries to import an artifact they do not own
          fixture === 'rules-report'
          ? { experimental: { zeroRuntime: 'report' as const } }
          : {
              outputCSS: './.tamagui/zero/tamagui-zero.css',
              experimental: { zeroRuntime: true },
            }
        : {
            outputCSS: './.tamagui/zero/tamagui-zero.css',
            experimental: { zeroRuntime: { islands: ['src/islands/SheetIsland.tsx'] } },
          }),
} satisfies TamaguiBuildOptions
