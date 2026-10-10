# V3 fleet — lane ownership contract

Manager session: `a2383` (opus). Updated 2026-07-30.

Six agents share ONE checkout: `/Users/n8/.worktrees/tamagui-v3-flat`, branch
`v3-beta`. File ownership below is exclusive and absolute. If your task needs a
change in someone else's lane, do NOT edit it: message the manager
(`agentbus send a2383 --message "..."`) with the exact change you need and work
around it meanwhile.

## Lanes

### Lane E — engine contraction + hot path (fable, high)

Exclusive owner of the seven `@tamagui/web` runtime files, plus anything else
in `code/core/web/src/helpers/` the contraction touches:

- `code/core/web/src/helpers/getSplitStyles.tsx`
- `code/core/web/src/createComponent.tsx`
- `code/core/web/src/helpers/contributePrograms.ts`
- `code/core/web/src/helpers/lowerAccumulatedPrograms.ts`
- `code/core/web/src/helpers/evaluateAccumulatedPrograms.ts`
- `code/core/web/src/helpers/grammarConfig.ts`
- `code/core/web/src/helpers/getCSSStylesAtomic.tsx`
- `code/core/web/src/helpers/propMapper.ts` (added 2026-07-30: the clause-free
  cutover lands in value resolution, so it needs one author)

Owns: clause-free config-first cutover, remaining fallback-category conversion,
physical deletion of the legacy condition machinery, the bundle/branch-count
gate, and the protected-file half of the Tailwind cut. Also the standing
reviewer for any hot-path change coming out of another lane.

### Lane S — decision-24 static fast path (codex, xhigh)

- `code/compiler/static/src/**` (flat-value extraction and flattening)
- `code/compiler/static-tests/tests/**`

Owns: driving the standing bailout rate (20.5% at 2026-07-29) down, keeping
class identity across the compile/runtime boundary, and the flattened-element
output path.

### Lane T — @tamagui/tailwind isolation (codex, high)

- `code/core/tailwind/**`
- `code/core/to-tailwind/**`
- `code/compiler/vite-plugin/**` (Tailwind seams only)
- `styleMode` caller cleanup everywhere OUTSIDE the Lane E files
- graph and type-entry isolation tests

### Lane V — v6 cutover config + transitions (codex, high)

- `code/core/config-base/**`, `code/core/config-default/**`, `code/core/config/**`
- `code/core/shorthands/**`
- transition work as NEW modules under `code/core/style-grammar/src/`

### Lane D — DOM contract (opus, xhigh)

- new `code/core/dom/**` and the `tamagui/dom` + `@tamagui/core/dom` entries
- `code/core/web/src/dom/**` (new directory only)
- new DOM modules under `code/compiler/static/src/dom*` (coordinate with Lane S
  before touching any shared plugin file)
- generated strict DOM prop interfaces and their conformance tables

### Lane R — review (opus, xhigh)

No write ownership except `docs/reviews/**`. Adversarially reviews Lanes S, T,
V. Findings go back to the owning lane, never applied directly.

## Shared, append-only

`code/core/style-grammar/`: any lane may ADD new modules and new exports. Nobody
changes the semantics of an existing file without manager sign-off.

`plans/v3-handoff-log.md`: append status under your item. Keep edits small and
immediate so they do not conflict.

## Rules for everyone

- Commit with explicit pathspecs only: `git add a b && git commit -m "..." -- a b`.
  One coherent item per commit, one-line conventional message.
- Never `git reset` / `stash` / `checkout .` / `restore .` / `clean`, never
  `--amend`, never rebase in this checkout. Never switch branches.
- Never push. The manager pushes. Never publish, release, or dispatch a release
  workflow.
- `code/tamagui.dev/tamagui.generated.css` is modified by an unrelated session.
  Leave it alone; never stage it.
- Tests go to a log file (`> /tmp/<name>.log 2>&1`), then read the file. Never
  pipe a suite through head/tail/grep.
- No global `bun run watch` at repo root — build the package you changed
  (`bun run build` in its directory).
- Hot-path rules in `plans/dom-tailwind-flat-values.md` ("Hot-path code rules")
  apply to anything under the render path. Performance claims are measured,
  never asserted.
- No string-existence tests. Integration-style tests following existing patterns.
- GitHub API budget is ~60/hr shared. Avoid `gh`; never `gh run watch`.
- Message the manager only for: a blocker needing a decision, a cross-lane
  conflict, or a completed checkpoint. No progress chatter.

Gates, from the worktree root:

Baselines measured by the manager at `e43e37c917` on 2026-07-30 — use these, not
the older numbers in `plans/v3-handoff.md`:

- grammar: `cd code/core/style-grammar && bun run test` — 319 passed / 16 files
- web: `cd code/core/core-test && bun run test:web` — 771 passed, 1 skipped,
  1 todo / 55 files
- native: `cd code/core/core-test && bun run test:native` — 411 passed,
  7 expected fail, 11 skipped / 21 files
- static-tests: `tests/*.web.test.tsx` — 104 passed, 2 skipped / 12 files;
  webpack — 18 passed
- codemod corpus: `code/core/codemod-flat-values/`

## The decision-24 metric is a tuple, not a rate

Gate on `found / lowered / flattened / styled / bailed`, never on the
percentage. Three ways the rate improves while nothing gets better:

- `found` only increments when `host.resolveComponent` returns non-null, so
  narrowing component recognition shrinks numerator and denominator together.
  `found` must never decrease.
- Decision 24 is the plain-element fast path, which is `flattened`, a subset of
  `lowered` (2016 of 2029 today). Raising `lowered` without raising `flattened`
  delivers nothing.
- `compilerHost.ts` `canLowerDynamicStyleProp` is a return-true-to-improve-the-
  number switch suppressing the `lower.ts` dynamic-style-value bailout. Widening
  it needs output tests and real DOM snapshots, never a metric delta.
