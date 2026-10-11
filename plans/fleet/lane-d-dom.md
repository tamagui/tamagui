# Lane D — the Tamagui DOM contract

You are Lane D on the Tamagui V3 beta fleet. Manager is agentbus session
`a2383` — message it with `agentbus send a2383 --message '...'`.

Worktree: `/Users/n8/.worktrees/tamagui-v3-flat`, branch `v3-beta`. Never switch
branches. Never touch `/Users/n8/tamagui` (primary checkout, read-only).

## Read first

1. `plans/v3-fleet-lanes.md` — the lane contract. You are Lane D.
2. `plans/dom-tailwind-flat-values.md` — design of record. Read "Product shape",
   "Styling contracts", "Tamagui DOM contract" in full, "Compiler contract",
   "Package and export boundaries", "Type architecture", "Phase 3", "Phase 4",
   and the "DOM", "Types", "Bundles" and "Native runtime performance" parts of
   "Validation".
3. `plans/dom-mode.md` if it exists — prior work in this area.

This is the largest remaining lane and the most design-sensitive one outside the
hot path. React Strict DOM is the semantic reference and conformance oracle, not
a runtime dependency: no RSD runtime, no StyleX runtime or compiled-object
protocol may enter either bundle.

## Phase 3: prove DOM lowering

1. Member-expression recognition for imported `html.div`, with import
   provenance — an unrelated `html` object must be rejected.
2. Prove JSX, `jsx`/`jsxs`, and `createElement` normalization.
3. Rewrite a web fixture to literal semantic tags.
4. Rewrite a native fixture to placeholder DOM primitives.
5. Wrap direct literal text at compile time.
6. Prove one unsupported-prop diagnostic and one invalid-nesting diagnostic.
7. Verify no RSD or StyleX code enters either bundle.

## Phase 4: implement the DOM contract

1. Check in the tag, attribute, event, native-backing, and compatibility tables.
   These are the source of truth for the whole lane — write them first.
2. Generate explicit prop interfaces from those tables.
3. Implement the minimum native semantic primitives.
4. Expose regular-Tamagui `html` from core.
5. Expose Tailwind `html` from `@tamagui/tailwind` (coordinate with Lane T
   through the manager; that package is theirs).
6. Add `tamagui/dom` and `@tamagui/core/dom`.
7. Implement `style()` on the same style-definition grammar as `styled()`, with
   the component argument removed. One style handle per call — not a namespace
   of named sub-objects.
8. Add the missing-compiler failures: on native the compiler is required (tag
   classification, primitive injection, literal text wrapping are build-time
   structural rewrites) and a missing compiler is an explicit build failure.
   Standalone `tamagui/dom` with `style()` is compile-only on both platforms.
   There is no runtime child scan on native in any mode.

On web, `html.*` from regular Tamagui renders the literal tag at runtime like
any Tamagui component, with the compiler as the usual optimizer.

## Validation

Follow the plan's matrix. One shared source fixture covers semantic structure,
headings and text; direct literal text inside a View-backed tag; dynamic invalid
text staying an error; theme and inherited text styles; button and anchor
interaction; image accessibility; input/textarea/select where supported; focus,
keyboard, pointer and accessibility events; refs within the documented subset;
and an unsupported-feature diagnostic. Compare supported behavior against a
pinned official RSD fixture and record every difference in the compatibility
table.

Native DOM is sensitive to per-element overhead — RSD PR #512 got ~5% from
changes that look locally trivial. Treat every hook, callback ref, wrapper
object, style array, default-prop object, context read and tag-specific polyfill
on the generic native host path as a measured cost. Do not create or attach a
callback ref when no ref was passed. Optional behavior must not allocate or
subscribe when its prop is absent. Bundle size alone cannot approve a native
DOM-path change — record the benchmark command, runtime, sample size, variance,
and before/after numbers.

## Open design items you own

- The minimum native DOM ref API (design item 8).
- How `style()` conditionally composes multiple handles while preserving
  whole-program replacement (design item 6).

Write these into `plans/v3-handoff-log.md` as proposals. The plan marks them
open; pick one path and record why, and flag to the manager if it looks like a
decision the user should make.

## Ownership

- new `code/core/dom/**` and the `tamagui/dom` + `@tamagui/core/dom` entries
- `code/core/web/src/dom/**` (new directory only)
- new DOM modules under `code/compiler/static/src/dom*`
- generated strict DOM prop interfaces and their conformance tables

Lane E (fable) exclusively owns the seven `@tamagui/web` runtime files in the
lane contract. Lane S (codex) owns the rest of `code/compiler/static/src/**`.
Lane T (codex) owns `code/core/tailwind/**`. For any change in those, report the
exact edit to the manager and work around it. Keep hook edits in shared plugin
files minimal and commit them immediately so the collision window stays small.

## Gates and rules

Grammar 319/319, web 770, native 409 (`cd code/core/core-test && bun run
test:web` / `test:native`). Run to a log file and read the file; never pipe a
suite through head/tail/grep. Rebuild a package after changing it.

Commit each coherent item with an explicit pathspec
(`git add a b && git commit -m '...' -- a b`), one-line conventional message.
Never push, never publish, never release, never amend, never reset/stash/clean.
Append status to `plans/v3-handoff-log.md` item 3.

This lane is big. Work through it in order, land the tables first, and tell the
manager when you have a coherent checkpoint so a reviewer can be pointed at it.
Work autonomously otherwise.
