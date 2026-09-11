# Lane S — decision-24 compiled static fast path

You are Lane S on the Tamagui V3 beta fleet. Manager is agentbus session
`a2383` — message it with `agentbus send a2383 --message '...'`.

Worktree: `/Users/n8/.worktrees/tamagui-v3-flat`, branch `v3-beta`. Never switch
branches. Never touch `/Users/n8/tamagui` (primary checkout, read-only).

## Read first

1. `plans/v3-fleet-lanes.md` — the lane contract. You are Lane S.
2. `plans/dom-tailwind-flat-values.md` — design of record. Read decision 24, the
   "Phase 5" section, "The engine contraction" (for the decision-24 status
   paragraph), "Hot-path code rules", and the "Compiler" part of "Validation".

## The objective

Decision 24: when every contribution to an element is statically known, the
compiler emits a plain element and skips the runtime component path entirely.
Closing the rendering-cost gap to plain CSS is a stated deliverable, not an
optimization afterthought.

The mechanism already holds through the shared pipeline with no
extractor-specific program code: the extractor calls the same `getSplitStyles`,
so `<View width={10} backgroundColor="red hover:blue" />` compiles to a literal
`<div className="is_View _w-10px _bc-…">` with the program block in the
extracted CSS, and a converted `hoverStyle` object compiles to the IDENTICAL
program class as its flat spelling. That class identity across spellings and
across the compile/runtime boundary is pinned in
`code/compiler/static-tests/tests/flatValues.web.test.tsx` — keep it pinned.

## Your job: drive the bailout rate down

The standing metric lives at
`code/compiler/static-tests/tests/bailoutMetric.web.test.tsx`, run with
`BAILOUT_METRIC=1`. It reads the compiler's own `LoweredModuleStats` over every
kitchen-sink usecase.

Baseline, 2026-07-29: 248 usecases, 0 compile failures, 2,556 candidate
elements, 2,033 lowered, 2,020 flattened to plain elements, 523 bailed — a
**20.5% bailout rate**.

Work the categories, largest first:

1. Re-run the metric and get a per-reason breakdown of the 523 bailouts. If the
   stats do not already carry a reason code per bailed element, add one — you
   cannot drive a number down without knowing what it is made of. Report the
   breakdown to the manager before you start fixing.
2. Fix the categories in descending order of count. Every fix must keep class
   identity and compiled/runtime parity; a bailout eliminated by producing
   different output than the runtime would produce is a bug, not a win.
3. Re-run the metric after each landed category and record the new number in
   `plans/v3-handoff-log.md`. The number is the deliverable; assertions about it
   are not.
4. Extend the webpack end-to-end render snapshots so real DOM output stays
   proven for each newly flattened category.

Some bailout categories will trace back to the runtime value engine rather than
the extractor. Those belong to Lane E (a fable agent owns
`code/core/web/src/helpers/getSplitStyles.tsx` and its six siblings). Do not
edit those files. Report the exact needed change to the manager instead, and
keep working the categories you can own.

## Ownership

- `code/compiler/static/src/**`
- `code/compiler/static-tests/tests/**`

Lane D (an opus agent) will add DOM modules under
`code/compiler/static/src/dom*`. Coordinate through the manager before touching
any shared plugin file.

## Gates and rules

Grammar 319/319 (`cd code/core/style-grammar && bun run test`), web 770 and
native 409 (`cd code/core/core-test && bun run test:web` / `test:native`), plus
the static-tests suite. Run to a log file and read the file; never pipe a suite
through head/tail/grep.

Commit each coherent item with an explicit pathspec
(`git add a b && git commit -m '...' -- a b`), one-line conventional message.
Never push, never publish, never release, never amend, never reset/stash/clean.

Work autonomously. Message the manager only for a blocker needing a decision, a
cross-lane conflict, or a completed checkpoint.
