# Checkpoint 3 receipts: the rebuilt style loop

Branch: `cp3-engine`. Base: pushed `v3-beta` at
`d48e1adc0b41113779e9cf059691b0dec99182af`. Measured source tip:
`78c78495d07a36af9ef164daca3be727db89d886`. This file records the assembled
unit's receipts against the plan's structural invariants (§1), behavior matrix
(§10), and measurement rules (§11). Claim labels follow the agent contract.

## What the unit is

- One pass owns styling: `directStyle.ts` and `propMapper.ts` are deleted;
  their emission, variant resolution, and clause handling live in
  `getSplitStyles.tsx`, consumed by all three hosts (createComponent, useProps,
  the compiler via `static-resolve`).
- The scanner closes each payload segment before the next clause's first
  modifier event, so a single pooled `ConditionCursor` per scan accumulates
  identity, precedence, activity, selector and wrapper state incrementally.
  Nothing re-walks a chain span; `resolveClauseChain` and the condition module
  arrays are gone. Composition (compound Cartesian products, parent×child
  nesting, HOC transport) replays resolved atoms; no generated condition text
  is ever reparsed.
- Contributions land in a neutral output frame: per-property slots keyed by
  exact condition identity. One completion serializes it — CSS slots build
  their atomic class once from winning content ordered by precedence and
  normalized first (identical final rules are one class, whatever order or
  spelling produced them), inline slots resolve one winner by condition
  precedence and last write. The platform-pseudo path is now just choosing the
  inline policy at completion.
- Compound matching consumes the ordinary scanner's events into the
  `Float64Array` arena (epoch + watermark); matched conditional branches store
  condition snapshots released with the arena.
- The lifecycle prepass is deleted: enter/platform-pseudo discovery happens in
  the pass, `finalizeStyleFlags` completes the hook protocol after it, and
  presence registers deferred at a fixed hook position. An HOC's first frame
  starts mounted (it can never enter), so its pass does not resolve enter
  clauses as active.
- Frontend class strings feed the same cursor via per-candidate class plans;
  the frontend-program channel and `preprocessProps` are deleted.
- HOC clause transport is a flat variable-width array. Each clause is stored as
  value, key, atom count, then atom kind, rank, and name fields. The inner pass
  replays those fields straight into cursors, and displacement moves the entry
  to the outer contribution's authored position (pinned by
  `hocClausePosition.web.test.tsx`).

## Invariants (§1), read against the assembled code

| # | invariant | status |
| --- | --- | --- |
| 1 | one character loop per authored string per pass | **HOLDS** for flat values, object keys, class candidates. RAN a scanner-instrumented probe: a compound-fed variant value (`tone="idle hover:active"` with a compound on `tone`) scans exactly once; `finishCompoundEdges` scans only values the ordinary path never scanned (exact variant matches). The displaced-styled-default decision no longer probes values: program-ness compiles at definition, plain displaced defaults weak-inject from the prop's own scan discovery. |
| 2 | one conditional-object discriminator | HOLDS as one rule (`default` key, else first key resolves); expressed in `classifyConditionalObject` and inlined in `contributeStyleObject` where the probe would otherwise double-read the first key. |
| 3 | one transform accumulator | HOLDS: `transformAccumulator.ts` is the only system; the CSS path folds it into the transform slot at completion. |
| 4 | no sort/split/join/`Array.includes`/regex/`Object.keys` on the render path | HOLDS in `getSplitStyles.tsx` (grep-clean). `normalizeValueWithProperty`'s px-string regex survives at completion time (pre-existing; per-winner, not per-clause). |
| 5 | no per-clause heap record; condition state call-stack local | HOLDS: cursors are pooled, watermark-released, and cleared on release (strings and atom arrays truncate). Compound branch snapshots are arena payload, released with the arena. Frame entries are output-frame state, not condition state. |
| 6 | `directStyle.ts` does not exist | HOLDS. |
| 7 | component styling does not import `propMapper` | HOLDS (deleted). |
| 8 | one contribution entry point; no frontend-program or variant-clause channel | HOLDS: `contributeValue` is the sink; frontends hand class plans, variants stream in place, HOC transport replays atoms into the same sink. |
| 9 | output completion never re-reads an authored prop | HOLDS: completion walks slots only. |
| 10 | strict compiled mode has no style-engine spans | carried by cp4's pins; the compiled artifact stubs `completeFrameCSS`, so every entry routes inline under `TAMAGUI_DID_OUTPUT_CSS`. |
| 11 | forward pass reads no render-invariant inside the per-prop loop | mostly holds via checkpoint-2b hoists; not re-audited line-by-line this checkpoint. |
| 12 | style pass callable outside React render | HOLDS (compiler host + zero-runtime fixture exercise it). |
| 13 | no `TAMAGUI_TARGET`-orphaned computation | spot-checked; no new instances added. |

Notes for the reviewer: per-modifier vocabulary lookup still slices the
modifier text — the hash lookup needs the string, and the slice IS the atom's
canonical name, reused for replay and dedupe. Atom arrays exist on native too:
they are the composition/dedupe representation, bounded at depth ≤ 6, pooled,
and cleared on release.

## Review findings and dispositions

- **TESTED** - passThrough skipped lifecycle finalization before the fix. The
  behavioral probe observed a scheduled initial-frame update and another
  render. Both component hosts now finalize flags even when split styles return
  null, and all four passThrough hook-order tests pass.
- **TESTED** - lifecycle state was mutable React state, while `forceStyle`
  received a copy. A failing probe showed that the initial unmounted state did
  not persist. The initial frame is now render-derived, and a stable ref-backed
  setter consumes it without mutating React state.
- **TESTED** - unprepared compound configuration previously took the same path
  as a prepared component with no compounds. The former now throws; the latter
  remains valid.
- **TESTED** - three conditional-object callers repeated the first-key
  traversal done by the discriminator. They now reuse the first cursor.
- **TESTED** - HOC transport allocated one object and three arrays per clause,
  and its atom comparison was quadratic. The component render path now uses the
  flat transport described above and canonical-key replacement.
- **TESTED** - frontend behavior tests targeted
  `preprocessTailwindClassName`, although production consumes `getClassPlan`.
  Tests now exercise the real class-plan and splitter paths. The old export,
  generated declarations, and frontend-program channel are gone. A real native
  parent-group probe also exposed a provider gate on raw `props.group`; it now
  uses the resolved group name, and the three native parent-capability tests
  pass.
- **TESTED** - a config swap at revision zero returned the old 600px media rule
  after installing a 900px config. Atomic cache ownership now synchronizes on
  config identity and revision, and the same probe returns 900px.
- **TESTED** - `usePresence` registration must widen after a late false-to-true
  render. The integration test proves that behavior, so the effect intentionally
  remains without a dependency array.
- **RAN** - stale comments in touched files were corrected. No unrelated
  `v5-color-scales` declaration was touched.

## Behavior matrix (§10), RAN at `78c78495d0`

- core-test: web 604 passed, 3 skipped, 1 todo; native 310 passed, 7 expected
  failures, 9 skipped; token provenance 7 passed, 1 skipped; iOS 27 passed;
  tvOS 12 passed; Android TV 12 passed.
- Tailwind: web 455 passed with no type errors; native 275 passed.
- compiler static tests: web 222 passed, 2 skipped; native 94 passed and 1
  expected failure; webpack 20 passed.
- kitchen-sink: default plus WebKit 724 passed, 5 skipped; animated CSS 228
  passed, 21 skipped; Reanimated 209 passed, 40 skipped; Motion 225 passed, 24
  skipped. The three named extra WebKit projects passed 21 of 21. The named
  StyledContextTokens, SelectSkin, ListItem, ActiveStateBackground,
  SheetWebKeyboard, PopoverHoverable, and hocClausePosition canaries are covered
  by these runs.
- zero-runtime Playwright passed 12 of 12, including Metro. Its pinned-Node
  size ruler failed the +0 thresholds described below, with zero compiler or
  forbidden-module violations.
- the five-file production SSR hydration job passed 18 of 18.
- root build passed 171 of 171 tasks. Root formatting/lint and all root checks
  passed; lint retained five pre-existing warnings.

## Size receipts (§11) — the directional gate FAILS, reported as a stop condition

Complete-artifact gzip via the checkpoint-0 ruler, paired same-machine
back-to-back builds from fully rebuilt detached trees:

| artifact | base `d48e1adc0b` | source tip `78c78495d0` | delta |
| --- | ---: | ---: | ---: |
| processor | **21,729** | **24,823** | **+3,094 (+14.24%)** |

Exact commands, run once from each tree's `code/comparisons/tamagui-bench`, then
from the matching repository root:

```sh
NODE_ENV=production TAMAGUI_TARGET=web VITE_CONFIG_NATIVE_IGNORE_WARNING=true bunx vite build --mode checkpoint-processor --sourcemap --outDir <tree-output> --emptyOutDir
bun code/comparisons/attribute-bundle-gzip.ts <tree-output> --filter=__complete_artifact_only__
```

The fixture SHA-256 was
`06be6fca4b74efd0d98869f3c87a6c69863e5727e7ac6c2c1f8aaba3d0a38c4a`.
Both builds used `NODE_ENV=production`, `TAMAGUI_TARGET=web`, Vite 8.2.2, and
Vite's default Oxc production minifier. The host was arm64 macOS 26.5.1
(25F80), Darwin 25.5.0, Bun 1.3.14.

The pinned Node 24.16.0 zero-runtime ruler also failed its +0 thresholds. Its
largest growth was island JavaScript: Vite +3,337 bytes, Next webpack +3,402
bytes, and Metro web +3,192 bytes gzip. The non-island changes were 18 to 22
bytes in the rows that failed. Compiler violations and forbidden modules stayed
at zero. The baseline was not updated.

Per §12 this remains a named stop condition awaiting the owner's residual
ruling; behavior was not shaved to move the number.

## Timing (§11)

The existing checkpoint-0 benchmark paired workspace V3 with installed Tamagui
2.6.2 in every round, alternating which version ran first. Base and source-tip
runs were back-to-back from the same two fully rebuilt detached trees.

Exact commands in each tree:

```sh
bun code/comparisons/generate-get-split-styles-prop-corpus.ts
NODE_ENV=production TAMAGUI_TARGET=web bun code/comparisons/benchmark-get-split-styles.ts --label=<tree-label> --output=<tree-output.json>
```

The generated corpus SHA-256 was
`af8ca0108efa759e4045864dab74a32797b070af6f227e4433d33eb466fd3d61`:
8,947 elements and 22,915 static attributes. Seed was `0x5e1757a1`; each run
used 3 warmups, 11 measured rounds, and at least 20,000 operations per scenario.
The runtime was Bun 1.3.14, reporting Node v24.3.0, on arm64 macOS.

| clause-string timing | base `d48e1adc0b` | source tip `78c78495d0` | delta |
| --- | ---: | ---: | ---: |
| V3 median ns/op (sample SD) | 14,078.2 (1,987.5) | 15,760.9 (7,047.0) | +1,682.8 (+11.95%) |
| paired V2 median ns/op (sample SD) | 11,048.4 (2,148.4) | 8,521.2 (8,890.3) | host control |
| V3/V2 ratio of medians | 1.274x | 1.850x | **+45.16% normalized** |
| median paired-round ratio (ratio SD) | 1.179x (0.165) | 1.459x (0.291) | +23.69% |

Dispersion was high in the source-tip run, and the paired V2 control moved in
the faster direction. Both normalization methods still show regression. The
timing gate therefore fails. Together with processor growth and the pinned
zero-runtime size failures, this preserves the checkpoint stop condition. No
behavior was shaved and no baseline, threshold, timeout, or assertion changed.
