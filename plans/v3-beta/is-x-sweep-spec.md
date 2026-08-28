# is_X non-engine sweep (Codex worker spec)

Owner decision (Nate, relayed 2026-08-28): fully kill displayName-derived
`is_X` className generation. The ENGINE-side removal (getSplitStyles /
createComponent emission) belongs to r6416 and lands inside the size-delete
slices on `cp3-engine`. This spec covers the NON-ENGINE surfaces a worker can
pre-sweep in parallel. Work on `cp3-engine`, push as you go.

## Hard boundary

Do NOT touch:
- `code/core/web/src/helpers/*` and `code/core/web/src/createComponent.tsx`
  (r6416 is editing them)
- `code/comparisons/*` corpora/benchmarks

## 1. Runtime selector migration (do first)

Every runtime selector that matches an `is_<Name>` class moves to a stable
attribute the component already renders, or gains one:

- inventory: `grep -rn "is_[A-Z]" code/kitchen-sink code/ui code/tamagui.dev
  --include="*.ts*"` minus engine files. Known: kitchen-sink tests use
  `is_SheetContainer` (~12 uses), `is_SliderTrack`, `is_ToggleGroupItem`.
- replacement policy: prefer an existing `data-testid`; else add a
  `testID` to the component instance in the fixture; for ui-package
  INTERNAL selectors (css that targets is_X), replace per Nate's design with
  ordinary className defaults declared in `styled()` — e.g.
  `styled(View, { name: 'SheetContainer', className: 'tm-sheet-container' })`
  style opt-in classes, NOT generated names.
- each migrated selector keeps its test meaning: run the affected kitchen-sink
  test file after each file's migration.

## 2. Snapshot inventory (report only, do not update)

List every compiler/static snapshot whose expected output contains `is_`:
`grep -rln "is_[A-Z]" code/compiler/static-tests/tests/__snapshots__` plus
inline snapshots in `tests/*.tsx`. Report the file list and count. Do NOT
regenerate snapshots — they change only when the engine-side removal lands
(r6416 signals that), then regeneration is one commit with the removal SHA in
its message.

Known already-red (pre-existing at bdba800925): babel.web.test.tsx 3
snapshots, webpack.test.tsx 3 tests expecting `is_MySizableText` — these
resolve with the engine-side removal, leave them red.

## 3. core View/Text literal defaults (decide + report)

Nate allowed `is_View` / `is_Text` to survive as LITERAL defaults if truly
required. Find what actually depends on them (`grep -rn "is_View\|is_Text"`
outside engine + snapshots), report the dependents, and recommend keep-or-drop
per dependent. Make no change without reporting first.

## Validation

Per touched package: its own test script. Whole-repo: root `bun run lint` and
`bun run check` before every push. Kitchen-sink: run the specific migrated
test files (full matrix not required; r6416 runs it with the engine slice).

## Report

One message to r4680 when done: files changed, selector inventory
before/after, snapshot inventory, is_View/is_Text dependents + recommendation,
validation results, push SHA. REVIEW: none - folded into the engine slice's
final review by r4674.
