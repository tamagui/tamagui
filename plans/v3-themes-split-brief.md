# Task brief: split @tamagui/themes builder from static themes (v3-beta)

Branch: `v3-beta`, work in this checkout (`/Users/n8/tamagui`), no worktree.
Other agents are active here. Stage/commit ONLY files you author, with
explicit pathspecs (`git add a b && git commit -m "..." -- a b`). Never
`git reset` / `stash` / `checkout .`. Do not push or release. Do NOT touch
`code/core/web/src/hooks/*` or `code/core/web/src/types.tsx` (another agent
owns those right now).

## Problem (verified)

`@tamagui/themes/v5` (`code/core/themes/src/v5.tsx`) re-exports:

- `themes` from `./generated-v5` (static, ~10KB — this is what wins publicly)
- `createThemes` from `@tamagui/theme-builder`
- `v5Templates` (imports a const from theme-builder)
- `* from './v5-themes'` — which imports 20 radix palettes from
  `@tamagui/colors`, imports the theme-builder, and at line 618 RUNS
  `export const themes = createV5Theme()` at module load

Because ESM star-export conflicts are shadowed by the explicit named export,
that runtime-built `themes` is dead weight: never reachable from the public
entry. On web, tree-shaking (sideEffects: false) usually saves you. On native,
Metro does no tree-shaking: every app importing `@tamagui/config/v5` or `/v6`
(both do `export * from '@tamagui/themes/v5'`) bundles the full theme-builder
(~300KB dist) + the color palettes, AND pays theme-builder execution at app
startup for a result that gets thrown away.

## Goal

Default entries become static-only; builder moves behind a dedicated subpath.
v3-beta is a breaking release, so moving exports is fine — but keep it
discoverable and document it.

1. `@tamagui/themes/v5`, `/v5-subtle` (and check `/v3`, `/v4` for the same
   pattern — fix them the same way if cheap): export ONLY generated themes,
   types, tokens. Zero imports (even transitive) of `@tamagui/theme-builder`
   and `@tamagui/colors`. Verify with `grep` over the built dist entry's
   import graph.
2. New subpath `@tamagui/themes/v5-builder` (mirror for v5-subtle if needed):
   everything currently in `v5-themes.ts` (createV5Theme, defaultChildrenThemes,
   adjustPalettes, palettes, opacify/interpolateColor, V5_BG_OFFSET,
   v5ComponentThemes, v5GrandchildrenThemes, ...) plus the `createThemes` and
   `v5Templates` re-exports. Add the exports-map entry in
   `code/core/themes/package.json` following the existing pattern exactly
   (types / react-native / browser / module / import / require / default).
   Check how `tamagui-build` discovers entries (look at other multi-entry
   packages) so the new entry actually builds.
3. Remove the module-load side effect: `v5-themes.ts:618`
   `export const themes = createV5Theme()` moves to a new generation-only
   input file (e.g. `src/v5-themes.generate.ts` that imports createV5Theme and
   exports `themes = createV5Theme()`), and update the `generate:v5` script in
   `code/core/themes/package.json` to point at it. The generate CLI
   (`code/core/generate-themes/src/generate-themes.ts:30`) accepts a `themes`
   named export. Same treatment for `v5-themes-subtle.ts` if it has the same
   side effect. Keep the type sanity checks (lines 620-626) working — move
   them to the generate file or a type test.
4. Update `@tamagui/config` (`code/core/config/src/v5.ts`, `v5-base.ts`,
   `v6.ts`, `v6-base.ts`, `v5-subtle.ts`, `config.ts`, `index.tsx`): default
   entries re-export only the static themes/tokens/types. Builder re-exports
   (`createV5Theme` etc.) either disappear from config (users import
   `@tamagui/themes/v5-builder` directly) or get their own
   `@tamagui/config/v5-builder` subpath — pick whichever keeps the diff
   smaller; do NOT keep them in the default entries.
5. Update internal consumers that import builder APIs from the old paths:
   - `code/kitchen-sink/src/generatedV5Theme.ts`
   - `code/packages/tamagui-dev-config/src/tamagui.dev.config.ts`
   - `code/tamagui.dev/features/studio/api/generateThemeBuilderCode.ts` (+ its
     test) — note: this file GENERATES import statements for users; update the
     emitted import paths too.
   - `code/core/themes/tests/v5-themes.test.ts`
   - grep the whole repo for `@tamagui/themes/v5` and `from '@tamagui/config/v5'`
     usages of the moved names to catch the rest (docs under
     code/tamagui.dev/data too — update code samples that import createV5Theme).

## Validation (required, in order)

1. `cd code/core/themes && bun run build` then `cd ../config && bun run build`.
2. `cd code/core/themes && bun run generate` — then `git diff` on
   `src/generated-v5.ts` / `src/generated-v5-subtle.ts` must be EMPTY
   (byte-identical regeneration proves the split changed nothing).
3. Prove the win: from a scratch script, resolve the module graph of the built
   `dist/esm/v5.mjs` (follow relative + package imports) and show theme-builder
   and @tamagui/colors are absent; show they were present before (git stash NOT
   allowed — use `git show HEAD:...` for the before state).
4. Typecheck/build the updated consumers (kitchen-sink typecheck,
   tamagui-dev-config build, studio test file's suite).
5. `cd code/core/core-test && bun run test:web` still green (except the known
   in-progress failure in `themeMediaOverRender.web.test.tsx` "first-render
   optimization mode" which belongs to another agent — ignore only that one).

## Handoff

Commit on `v3-beta`, one-line conventional message, explicit pathspecs. Then
one compact agentbus message to your manager (session `ab-mrjsawij-54337`):
outcome, files changed, the before/after import-graph proof, honest gaps.
