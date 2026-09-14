# Lane T — @tamagui/tailwind isolation

You are Lane T on the Tamagui V3 beta fleet. Manager is agentbus session
`a2383` — message it with `agentbus send a2383 --message '...'`.

Worktree: `/Users/n8/.worktrees/tamagui-v3-flat`, branch `v3-beta`. Never switch
branches. Never touch `/Users/n8/tamagui` (primary checkout, read-only).

## Read first

1. `plans/v3-fleet-lanes.md` — the lane contract. You are Lane T.
2. `plans/dom-tailwind-flat-values.md` — design of record. Read "Tailwind
   Tamagui", "Styling contracts", "Relationship to Tailwind", "Tailwind
   merging", "Package and export boundaries", "Type architecture", and
   "Phase 2".
3. `plans/v3-handoff-log.md` item 2 — the full history of this lane, including
   the exact protected-file handoff.

## Where this stands

Phase 2 is partly landed:

- `0f3fb09a9c` Lane A: neutral descriptor and internal entries, distinct
  frontend View/Text factories, object-only regular `styled()`, class-first
  Tailwind `styled()`, className-only Tailwind style types, candidate adaptation
  backed by `style-grammar`, web/native/type tests.
- `d16e511d81` Lane A repair: platform setup in the built internal-runtime
  entry, shipped declarations, tailwind candidates applied in authored order.
- `85d09a5503` Lane B: the official Tailwind Vite integration moved out of
  `@tamagui/vite-plugin`.

## What is left, in order

1. **Verify the Lane A repair actually closed its review findings.** The
   adversarial review returned changes required on five things: a built-ESM
   setup import elided while CJS retained it; missing tracked declarations and
   internal-subpath fallback files; incorrect last-authored ordering when a
   later candidate restates a shorthand; the internal declaration graph being
   too wide; and passthrough classes leaking into normalized `baseStyle`.
   Prove each one at runtime or with a test, not by reading the diff. Anything
   still open, fix.

2. **Global `styleMode` caller cleanup** everywhere OUTSIDE the Lane E files.
   `settings.styleMode` comes out of public types and out of every runtime
   branch you own. The frontend is selected by package, not by a global mode.

3. **Remove `tailwind-merge`** from everything you own. Note
   `@tamagui/web` imports `twMerge` unconditionally today and only calls it in
   Tailwind mode (27 KB min / 8.5 KB gzip if reachable) — that import lives in a
   Lane E file, so report it to the manager rather than editing it.

4. **Graph and type-entry isolation tests.** Prove `@tamagui/tailwind` does not
   import the `@tamagui/core` root or its inline-style frontend, prove Tailwind
   components do not instantiate the regular inline style types, and prove
   nothing Tailwind-shaped is reachable from a plain `@tamagui/core` entry.
   Record the module graphs.

## Your blocker, and how it clears

Completing the cut requires removing the `styleMode`/`tailwind-merge` path from
`getSplitStyles.tsx` and the preprocessing call from `createComponent.tsx`.
Those two files plus five siblings are exclusively owned by Lane E (a fable
agent). The exact change you need is already written down in
`plans/v3-handoff-log.md` item 2 and Lane E has it on its work list. Do not
edit those files under any circumstance. Build everything around the cut, and
ask the manager for status if you genuinely cannot proceed.

## Ownership

- `code/core/tailwind/**`
- `code/core/to-tailwind/**`
- `code/compiler/vite-plugin/**` (Tailwind seams only)
- `styleMode` callers everywhere outside the Lane E files
- graph and type-entry isolation tests

## Gates and rules

Grammar 319/319, web 770, native 409 (`cd code/core/core-test && bun run
test:web` / `test:native`), plus the tailwind package suites. Run to a log file
and read the file; never pipe a suite through head/tail/grep. Rebuild a package
after changing it (`bun run build` in its directory).

Commit each coherent item with an explicit pathspec
(`git add a b && git commit -m '...' -- a b`), one-line conventional message.
Never push, never publish, never release, never amend, never reset/stash/clean.
Append status to `plans/v3-handoff-log.md` item 2.

Work autonomously. Message the manager only for a blocker needing a decision, a
cross-lane conflict, or a completed checkpoint.
