# Streaming engine receipts — cp3-engine @ 32b9ff2a49

Base for all paired numbers: v3-beta `d48e1adc0b`, fully rebuilt detached tree
(`~/.worktrees/tamagui-cp3-spike-base`), corpus sha `af8ca010…` (matches the
checkpoint-3 receipt corpus). Claim labels per the agent contract; everything
below is RAN unless noted.

## Behavior matrix (certified at 32b9ff2a49)

- core-test web 611 passed (includes 11 streaming/tier-boundary pins in
  `baseTierFrame.web.test.tsx`), 3 skipped, 1 todo; native 310 passed,
  7 expected fails, 9 skipped.
- compiler static-tests: web 222 passed + webpack 20 passed (is_X snapshot
  refresh landed here), native 94 passed + 1 expected fail.
- tailwind: web + native suites exit 0.
- zero-runtime playwright 12/12 including Metro. (The pinned-Node size ruler
  requires Node 24; it crashes under system Node 25 — environment, not
  engine.)
- kitchen-sink: default + webkit 724 passed / 0 failed; animated css 225,
  reanimated 207, motion 223 passed. The `MenuArrowAnimatePresence` failures
  (pre-existing at bdba) were is_X-selector-based and resolve with the is_X
  sweep merge (1ec35fee13): 6/6 across css/reanimated/motion at the merged
  tip. One `SheetDragFade` css failure in the parallel run passes standalone —
  load flake. Zero known failures remain in the matrix.
- engine-owned is_X residue for a later slice: `createDesignSystem.ts` still
  targets `.is_Input`/`.is_TextArea`, so `Input.tsx` keeps those literal
  defaults until helper selectors and artifacts migrate together.
- root build 171/171; root lint + check clean.

## Timing (paired quiet-window corpus receipts, V2-normalized totals)

| state | stream vs base |
| --- | --- |
| 28a frame engine | +33% |
| bdba packed frame | +21% |
| streaming + residues (dd6997f408) | +19% |
| + raw-value slot memo (544d14b263) | 0.874 vs 0.824 |
| + literal-miss token cache (4cb61eccc8) | 0.875 vs 0.836 (raw medians within 2%) |
| + emitValue kind-table dispatch (0550022158) | alternating 2x2: stream 0.850/0.828 vs base 0.825/0.805 - parity within the ±2-3% window noise; raw totals +1.8% |

Per-lane at tip: variant 0.973–0.985 vs base 1.034–1.106 (ahead),
cond-objects ahead, style-heavy ahead; plain ~4–5 points behind, clause
~8 points behind.

## Size (checkpoint-processor ruler, exact receipt commands)

| state | gzip |
| --- | ---: |
| base d48e1adc0b | 21,729 |
| 28a | 24,463 |
| bdba | 25,083 |
| streaming + fixes | 25,532 |
| + perf caches | 25,800 |
| + kind-table dispatch (tip 0550022158) | 25,961 |

Function-level attribution and the invariant-cost decomposition live in the
milestone reports; ~1.5–2K of the delta has identified recovery paths (cursor
diet, arena trial, is_X residue), the rest prices the plan's invariants.

## Standing decision (with r4674/Nate)

Timing is flat vs base, so per the standing size-gate ruling this is a stop
condition with the numbers delivered. Options presented: (A) revised gate
timing ≥ base with size ~+2–2.5K financed by campaign wins; (B) relax the
single-scan/no-reparse invariant to delete composition machinery; (C) stop as
written. Work continues on option-A slices (correct under every option) until
ruled.
