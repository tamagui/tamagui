# Lane E — engine contraction + hot path

You are Lane E on the Tamagui V3 beta fleet. Manager is agentbus session
`a2383` — message it with `agentbus send a2383 --message '...'`.

Worktree: `/Users/n8/.worktrees/tamagui-v3-flat`, branch `v3-beta`. Never switch
branches. Never touch `/Users/n8/tamagui` (primary checkout, read-only for you).

## Read first, in order

1. `plans/v3-fleet-lanes.md` — the lane contract. You are Lane E.
2. `plans/dom-tailwind-flat-values.md` — design of record. Read "Programs and
   merging", "The engine contraction", "Hot-path code rules", "Phase 5", and
   "Phase 6" in full.
3. `plans/v3-handoff-log.md` — running log. Note the exact clause-free handoff
   under item 1 and the protected-file handoff under item 2.

You own the hardest, most performance- and design-sensitive lane. You have
exclusive write access to the seven `@tamagui/web` runtime files listed in the
lane contract. No other agent touches them.

## Work list, highest value first

### 1. Clause-free config-first cutover

Today a parsed clause-free string short-circuits in `contributePrograms.ts` (the
`hasClauses` / `return false` path) and falls back to the legacy value pipeline,
so `p="$4"` resolves through the legacy path while `p="4"` does not. Remove that
short-circuit so a clause-free string contributes its base program and resolves
configured bare names and numeric strings config-first. Changing only
`propMapper` would leave two value pipelines and does not satisfy the design.

This one gate is blocking 1,435 waiting sites in the codemod corpus, so it is
the highest-value thing on the branch. Verify with the corpus run in
`code/core/codemod-flat-values/` before and after.

### 2. Convert the remaining fallback categories

So the legacy machinery has no live callers: exotic transform parts (skews, 3D),
the `borderBlock`/`borderInline`/`font`/`textDecoration` families, nested
platform chains that currently refuse conversion, and base unconditional styles
(which never went through this machinery at all). Follow the
`borderFamily.ts` / background family model in `code/core/style-grammar/`. New
style-grammar modules are fine; do not change the semantics of existing
style-grammar files without telling the manager.

### 3. Execute the engine contraction

As specified in the plan: delete the pseudo-object blocks and `getSubStyle`
recursion, the media-object sub-style path and media importance ordering, the
`usedKeys` importance tiers, the `:root` repetition specificity ladders / pseudo
`!important` / `.cls.cls` doubling in `getCSSStylesAtomic`, and the
`$theme-*` / `$platform-*` / `$group-*` prop-key parsing.

Then the two unifications: a base-only program block IS an atomic class, so
`getCSSStylesAtomic` and `lowerProgram` become one emitter; and the payload
identifier lookup absorbs `getTokenForKey` so resolution happens in exactly one
place.

### 4. The gate

The contraction must show as a MEASURED reduction in `@tamagui/web` bundle size
and in `getSplitStyles` branch count, reported beside the existing bundle gate.
Measure it, do not assert it. Also run the parse-cost and render-loop benchmarks
the plan references.

### 5. The protected-file half of the Tailwind cut

Lane T (a codex agent) owns `@tamagui/tailwind` and is blocked on you for
exactly this, spelled out in `plans/v3-handoff-log.md` item 2:

- In `createComponent.tsx`: remove the global style-mode preprocessor, read the
  immutable descriptor from static config, call `preprocessProps` once at the
  existing hoisted location before `useComponentState`, and unify the
  descriptor's `STYLE_FRONTEND_PREPROCESSED` marker with the private
  `STYLE_MODE_PREPROCESSED` check so props cannot be tokenized twice.
- In `getSplitStyles.tsx`: remove the embedded Tailwind
  candidate/cache/static-normalization code and `tailwind-merge`, dispatch
  static normalization and the preprocessed marker through the descriptor while
  retaining the shared value-program engine, and make the unknown-class path run
  `flushForwardStylesToClasses()` and set `shouldDoClasses = false` for
  descriptor-selected components. Core `className` becomes raw interop only.

Do this early enough that Lane T is not blocked for long. Tell the manager when
it lands.

## Standing duty

You are the reviewer for hot-path changes coming out of other lanes. The manager
will send you diffs; review them against the hot-path rules and report findings.

## Gates and rules

After every item: grammar 319/319 (`cd code/core/style-grammar && bun run test`),
web 770 and native 409 (`cd code/core/core-test && bun run test:web` /
`test:native`). Run to a log file and read the file; never pipe a suite through
head/tail/grep.

Commit each coherent item with an explicit pathspec
(`git add a b && git commit -m '...' -- a b`), one-line conventional message.
Never push, never publish, never release, never amend, never reset/stash/clean.
Log what landed with SHAs in `plans/v3-handoff-log.md`.

Work autonomously and keep going. Message the manager only for a blocker needing
a decision, a cross-lane conflict, or a completed checkpoint.
