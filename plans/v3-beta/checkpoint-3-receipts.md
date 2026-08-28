# Checkpoint 3 receipts: the rebuilt style loop

Branch: `cp3-engine`. Base: `v3-beta` at `7c9d038e7f` (RN-driver-web drop
included). This file records the assembled unit's receipts against the plan's
structural invariants (§1), behavior matrix (§10), and measurement rules (§11).
Claim labels follow the agent contract.

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
- HOC clause transport is a WeakSet-minted resolved-atom entry list; the inner
  pass replays entries straight into cursors, and displacement moves the entry
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

## Behavior matrix (§10) — RAN at `9c7a56ecfd` (rebased on the driver drop)

- core-test web 600 passed / native 308 / ios 27 / tvos 12 / androidtv 12 /
  token-provenance 7; parser agreement and flat-value programs included.
- tailwind 458 web + 275 native; style-grammar 466.
- compiler static-tests 220 + webpack 20 (identity snapshots updated once for
  the winners-only, post-normalization identity — every diff verified
  hash-only with identical rule text; reversed contribution order now yields
  the identical class as forward order).
- zero-runtime fixture builds with zero violations.
- kitchen-sink `test:web`: run in progress at this writing; result reported to
  the owner (`DriverConditionedDiscrete` now motion-driver-scoped after the
  driver drop).
- new pins: `hocClausePosition.web.test.tsx` (verified red without the fix),
  `atomicIdentityContent.web.test.tsx`, `presenceRegistration.web.test.tsx`
  (inherited), `tailwindLifecycle.web.test.tsx` (inherited).

## Size receipts (§11) — the directional gate FAILS, reported as a stop condition

Complete-artifact gzip via the checkpoint-0 ruler (same machine, Bun vite
build, `attribute-bundle-gzip --filter=__complete_artifact_only__`):

| artifact | tip `479036c39b` | branch (pre driver-drop rebase) | branch `9c7a56ecfd` |
| --- | ---: | ---: | ---: |
| processor | **21,761** | 24,815 | **24,742** |
| public `View` | pending same-run control | | 48,009 |

Attribution (marginal gzip): tip's `directStyle` + `getSplitStyles` +
`propMapper` = 10,408; the merged engine = 13,386, plus `getCSSStylesAtomic`
820 → 1,141 (slot builder) against `directStyleCSS` 1,008 → 902. The
duplication deletion paid, but the invariant-bearing machinery (compound
arena, cursors + atoms + snapshots, neutral frame + completion) costs more
than it recovered: net ≈ **+3.0K gzip** on the processor artifact.

Per §12 this is a stop condition ("the processor artifact does not fall
materially at checkpoint 3"): named to the owner with the numbers above rather
than shaved by removing behavior. The per-contribution atomic identity cache
was retired for its slot-level successor (−116). Remaining recovery candidates
are compaction, not deletion, and are estimated partial.

## Timing (§11)

Paired same-run corpus benchmark (tip vs branch on a quiet machine) pending —
the box is running the kitchen-sink suite at this writing. No timing claims
are made until that receipt exists.
