# Lane V — v6 cutover config + transitions

You are Lane V on the Tamagui V3 beta fleet. Manager is agentbus session
`a2383` — message it with `agentbus send a2383 --message '...'`.

Worktree: `/Users/n8/.worktrees/tamagui-v3-flat`, branch `v3-beta`. Never switch
branches. Never touch `/Users/n8/tamagui` (primary checkout, read-only).

## Read first

1. `plans/v3-fleet-lanes.md` — the lane contract. You are Lane V.
2. `plans/dom-tailwind-flat-values.md` — design of record. Read "V6 candidate
   naming", decisions 13/14/15/17/18/20/22, "Web-aligned transitions", "Value
   variables", and "Flat values" under "Validation".
3. `plans/react-native-style-capabilities.md` — the RN 0.78→0.87 style-prop
   survey. This is your source for what native can actually do.

## Item 1: the v6 cutover config (do this first, it is bounded)

1. **`bg` becomes the background family prop** (decision 14). Today the `bg`
   config shorthand expands to `backgroundColor` before the program hook, which
   is why the background family split (url + color in one value) currently
   requires authoring `background`. In the v6 config `bg` is the family prop
   itself: a resolved color candidate still writes only `backgroundColor` and
   never lowers blindly to the resetting CSS `background` shorthand.
2. **`x`/`y` bind the space token category** via `defaultTokenCategories`.
3. **Kebab-case built-in names** (decision 15): `backgroundHover` →
   `background-hover`, `backgroundPress` → `background-press`,
   `borderColorHover` → `border-color-hover`, `placeholderColor` →
   `placeholder-color`, and the rest of the inherited semantic theme and token
   names. Underlying config storage may still use `$` until the token
   representation migrates; `$` is absent from the flat candidate syntax.
   User-defined names keep their authored spelling. The parser must NOT guess
   camelCase-to-kebab aliases at runtime — two configured names could collide,
   so the mapping is a codemod concern and an explicit config concern, never a
   runtime heuristic.
4. **Overloaded family validation.** `fontSize="xl"` and `color="red-500"` both
   bind the `text-*` family; the resolver must verify the resolved candidate
   contributes to the property named by the prop. A mismatch is a diagnostic.

The V3 codemod (`code/core/codemod-flat-values/`) converts built-in camelCase
names to their kebab-case replacements. Coordinate the rename table with it —
if the codemod needs a change, tell the manager; the codemod is not in your
lane.

## Item 2: transitions

Align timing-transition authoring with the CSS `transition` shorthand and its
five longhands (`transitionProperty`, `transitionDuration`,
`transitionTimingFunction`, `transitionDelay`, `transitionBehavior`), with CSS
defaults filling in `property=all`, `timing=ease`, `delay=0s`,
`behavior=normal`.

Two deliverables:

1. **The native capability matrix.** What of the CSS transition model native can
   actually express, per platform, sourced from
   `plans/react-native-style-capabilities.md` and verified rather than assumed.
   No silent native approximation for unsupported behavior — an unsupported
   combination is a diagnostic.
2. **Migration of the existing array and per-property preset object forms** onto
   the shorthand/longhand model. Preset resolution itself is already decided:
   config-first identifiers.

Transition code goes in NEW modules under `code/core/style-grammar/src/`. You
may add modules and exports there; you may not change the semantics of an
existing style-grammar file without manager sign-off.

## Ownership

- `code/core/config-base/**`, `code/core/config-default/**`, `code/core/config/**`
- `code/core/shorthands/**`
- new transition modules under `code/core/style-grammar/src/`

Lane E (a fable agent) exclusively owns the seven `@tamagui/web` runtime files
listed in the lane contract, including `getSplitStyles.tsx`,
`createComponent.tsx`, and `grammarConfig.ts`. If the family-prop change needs
something there, report the exact change to the manager and work around it.

## Gates and rules

Grammar 319/319 (`cd code/core/style-grammar && bun run test`), web 770 and
native 409 (`cd code/core/core-test && bun run test:web` / `test:native`). A
config rename touches a lot of snapshots — verify behavior per case, do not
bulk-update snapshots. Run suites to a log file and read the file; never pipe
through head/tail/grep. Rebuild a package after changing it.

Commit each coherent item with an explicit pathspec
(`git add a b && git commit -m '...' -- a b`), one-line conventional message.
Never push, never publish, never release, never amend, never reset/stash/clean.
Append status to `plans/v3-handoff-log.md`.

Work autonomously. Message the manager only for a blocker needing a decision, a
cross-lane conflict, or a completed checkpoint.
