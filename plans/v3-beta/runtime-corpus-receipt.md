# Runtime style pass: v3 versus v2 on the harvested corpus

Date: 2026-09-01. Tree: v3-beta at `86585b406b` plus the two engine rounds
below (committed with this receipt). Harness:
`code/comparisons/benchmark-get-split-styles.ts`, v2 control `tamagui@2.6.2`
from `code/comparisons/v2-control`, Bun 1.3.14, 21 rounds, 3 warmups, both
arms interleaved in the same process. The machine was shared with five other
agents, so absolute ns/op are inflated; the v3/v2 ratio is the number that
survives that.

## The benchmark was wrong before today

The previous numbers in `GET_SPLIT_STYLES_BENCHMARK.md` (now in the
comparison repo) ran the v3 arm through the core-test harness, which calls
`getSplitStyles` in the compiler's static mode (`isStatic` collects
`rulesToInsert` for every class) and then parses the generated CSS to expose
class properties. A render never does either. **RAN**: that path was roughly a
fifth of v3's sampled time and reported v3 at 1.2x slower than v2 in total.
The harness now replays the runtime call shape (`86585b406b`).

A second error hid in the v2 control: under Bun, `createRequire` from
`v2-control/package.json` resolved `@tamagui/web` to the workspace v3 build.
**RAN**: a CPU profile of that "v2" arm showed `code/core/web/dist/cjs`
frames with v3-only function names. The control must be loaded by explicit
file path and asserted to be a 2.x build (the comparison worker owns that
fix).

## Result, runtime call shape, real 2.6.2 control

| scenario | elements | v3 ns/op | v2 ns/op | v3/v2 |
| --- | ---: | ---: | ---: | ---: |
| plain props | 6,745 | 2,435 | 3,584 | 0.68x |
| clause strings | 625 | 9,269 | 7,567 | 1.22x |
| conditional objects | 14 | 6,439 | 5,017 | 1.28x |
| variant props | 1,674 | 3,871 | 4,784 | 0.81x |
| shorthand-heavy | 345 | 5,957 | 7,648 | 0.78x |
| style-prop-heavy | 540 | 11,868 | 13,430 | 0.88x |
| total corpus | 8,948 | 3,453 | 4,396 | 0.79x |

Before the two engine rounds below, the same fair harness read 0.79x total,
1.33x clause strings, 1.35x conditional objects (11 rounds). Phase 2 of the
variant redesign (`0c6d678977`) had already taken variant props from ~1.7x to
~0.8x; a pre-phase-2 worktree measured 1.71x on that row against the same
control.

## What the v3 profile says (clause-string scenario, v3 arm only)

Self time by function, `bun --cpu-prof` over the corpus replay: the pass
itself (`getSplitStyles` body 8%, `contributeProp` 7%), the CSS record and
emission chain (`buildAtomicSlotCSS` 7%, `completeResolvedStyles` 7%,
`registerAtomicSlot` 5%, `flushDirectStyles` 5%, `writeStyleRecord` 4%,
`updateRules` 4%), value resolution (`configuredValue` 7%, `emitValue` 4%,
`styleSlot` 4%, `propertyKind` 3%, `normalizeValueWithProperty` 3%), source
layering (`ownsSourceLayer` 5%), and the clause machinery
(`walkConditionalValue` 3%, `resolveConditionModifier` 3%, `parseFlatValue`
2%, `conditionFromKey` 2%). Line ticks put most of `writeStyleRecord`,
`ownsSourceLayer`, and `flushDirectStyles` on writes into fresh per-pass
objects with dynamic keys (hidden-class churn), and most of `styleSlot`,
`webStyleProperty`, and the `fontProperty` test in `configuredValue` on
string tests that only depend on the property name.

## Engine rounds landed

1. Per-property classifications memoized once per process (`styleSlot`,
   `webStyleProperty`, the font-property test), the atomic identity cache
   keyed in two levels (no per-pass concatenation and hashing of one long
   key), and an append instead of a splice when a CSS entry lands last.
2. The per-pass `flatSlots`, `flatPropertyLayers`, and `flatAtomics` records
   are `Map`s instead of objects with dynamic keys.

Outputs are identical (the replay checksum did not move), core web (594)
and native (311) suites and the compiler web suite (246) pass, and the
styled-view fixture grew 127 gzip bytes (baseline re-recorded).

## Tried and reverted

- Condition templates across passes (`2f50d46c04`, reverted): committed
  conditions built once per config revision and class mode, activated per
  pass. **RAN** ABBA on a quiet machine (80% idle, 15 rounds each): clause
  strings 1.13 / 1.06 with templates against 1.13 / 1.12 without, conditional
  objects 1.30 / 1.30 against 1.29 / 1.33, total 0.80 / 0.78 against 0.77 /
  0.79. The per-pass condition build is not where the clause cost is; the
  record and CSS emission chain is. It also cost 258 gzip bytes. One trap for
  whoever retries it: the packed precedence value is wider than 32 bits, so a
  bitwise clear of the active bit on the committed value truncates it.

## Follow-ups, ranked by the profile

- Prop classification per component: `contributeProp` runs eight hash
  lookups per prop (shorthands, defaults, skip props, validity, variants,
  context keys, text props) that are all static per `styleStaticConfig`.
- Node measures the SSR shape of rule insertion: with no `document`,
  `shouldInsertStyleRules` never sees an insertion, so `flushDirectStyles`
  and `updateRules` run on every pass. A browser pays that once per class.
