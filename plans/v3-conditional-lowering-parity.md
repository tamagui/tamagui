# v3 conditional lowering: reach v2 parity, then pass it

Status: proposal, 2026-08-26. Evidence from the takeout v3 migration
(`~/soot/docs/research/takeout-tamagui-v3-review-2026-08-27.md`) and from
reading the compiler on `v3-beta` at `87def49316`.

## Why

Takeout's migration measured, per platform (web / iOS):

- `local/dynamic-style-value`: 37 / 70 bailouts
- `local/unsafe-style-spread`: 29 / 27 bailouts

Those two codes are the app-authored share of unflattened candidates (the rest
is `unsupported-target`, which is component capability, not expression power).
v2's extractor handled most of these shapes: it partially evaluated spreads,
nested conditionals, and logical expressions, falling back to a node `vm` eval
with import resolution. Real apps write inline conditionals; telling them to
restructure into variants is backwards. The compiler should get stronger, not
the app more ceremonial.

## What v3 already has (better foundations than v2)

- A real interpreter over the linked project graph
  (`compiler-core/src/evaluate.ts`): literals, template literals, member,
  binary, logical, conditional expressions, cross-module constant resolution
  with dependency tracking. Safer than v2's `vm` approach and cacheable.
- Per-branch conditional lowering on BOTH platforms
  (`static/src/compilerHost.ts`, "V2-parity per-branch lowering"): a ternary
  whose branches evaluate statically resolves each branch through the full
  style pipeline (cross-key effects like fontFamily changing lineHeight are
  captured); only the test expression survives to the output. Guards are
  strict and correct: a branch that changes non-style viewProps or removes
  keys bails.

## The actual gaps

1. **Branch recovery only handles one top-level `ConditionalExpression`**
   (`evaluateConditionalExpression` in `compiler-core/src/evaluate.ts:496`).
   Not recovered today:
   - logical forms: `active && 'red'`, `color ?? 'gray'`
   - nested ternaries: `a ? x : b ? y : z` (the alternate fails plain
     evaluation, so the whole recovery returns null)
2. **Web allows exactly one conditional per element**
   (`compilerHost.ts:1787` "several would need a shared class").
   iOS has no such limit in the per-branch style-array path, which is part of
   why iOS shows 70 dynamic-style-value bailouts to web's 37 — the branch
   values themselves fail evaluation more often on the shared components.
3. **Any non-static spread bails the element** (`unsafe-style-spread`,
   `lower.ts:176`). v2 resolved spread objects when the spread value itself
   evaluated statically, preserving duplicate-prop precedence by merging at
   compile time.

## Plan, staged so each lands alone

### stage 1: widen branch recovery (biggest win per line)

Extend `evaluateConditionalExpression` into `evaluateBranches`, returning a
small decision tree instead of a pair:

- `LogicalExpression`: `test && value` -> branches `value` / absent;
  `test || value`, `test ?? value` -> `testValue` / `value` (the test's value
  side needs the test to evaluate OR to survive as the emitted expression;
  when the test also fails evaluation, keep the current bailout).
- Nested `ConditionalExpression` in either branch, recursively, with a depth
  cap (3 is plenty; beyond it, bail with the current diagnostic).

Lowerings consume the tree: native emits nested selects in the style array
expression; web emits one class per leaf with the same test expressions the
source wrote. The existing per-branch resolution guards apply per leaf
unchanged.

### stage 2: several conditionals per element

The web "shared class" limit is a code-emission problem, not a semantics one.
Emit per-prop conditional classes (each conditional owns disjoint style keys —
already enforced by the `conditionalKeys` collision check on native, port it to
web) instead of one class for the whole element. Keys colliding across two
conditionals stay a bailout, same diagnostic as native's "Multiple conditionals
contribute {key}".

### stage 3: evaluable spreads

When a spread's value evaluates statically through the interpreter (a local
style object, an imported constant object), merge it into the prop list at its
source position and lower as if the props were written inline. Precedence is
positional and therefore exact. Anything else keeps `unsafe-style-spread`.
This alone addresses ~29/27 bailouts in takeout.

### stage 4 (past v2): linked-graph call evaluation, opt-in

v2's `vm` eval could run helper functions; v3's interpreter deliberately does
not call functions. A bounded version: evaluate calls whose callee resolves in
the linked graph to a pure expression function (single return statement,
arguments all evaluated). Opt-in via compiler option first. This is the only
stage with real risk; it ships last and separately.

## Verification

- The differential oracle in `code/tests/zero-runtime` (rules fixtures,
  compiled vs runtime) is the harness these changes must run under; add rule
  modules per stage: logical forms, nested ternary, two conditionals on one
  element, static spread merge.
- Takeout is the live corpus: re-run its compiler stats
  (`TAMAGUI_COMPILER_STATS_FILE` web, metro plan cache native) before/after
  each stage and record the bailout deltas in this file.

## Non-goals

- Evaluating runtime-only values (props, state, theme objects at runtime).
  A conditional TEST never needs to evaluate; only branch VALUES do.
- Loosening the per-branch guards (viewProps drift, key removal). They are
  what makes per-branch lowering safe; every stage keeps them.
