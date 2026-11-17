---
id: t-ms78ohxt-1c8k0
title: Repair Tailwind isolation Lane A blockers
status: done
labels:
- blocker
- tailwind
- v3
priority: 3
backend: git
sessions:
- a2332
commits:
- d16e511d81
- d16e511d81b
created_at: 1785399358673
updated_at: 1785408217898
field_marks:
  active_form: 1785399358673
  body: 1785399358673
  claim: 1785399358673
  evidence_summary: 1785399358673
  parent: 1785399358673
  priority: 1785399358673
  recovery_ref: 1785399358673
  status: 1785399358673
  title: 1785399358673
---
DONE at commit d16e511d81 (41 files, branch v3-beta). Every actionable Lane A finding
from /tmp/v3-tailwind-lane-a-review.md is repaired. No protected file, Lane B path,
bun.lock, generated CSS, or handoff-log edit.

## B1 — built ESM setup parity
`core/src/internal-runtime.tsx` re-exports the platform-aware `TamaguiProvider`/
`createTamagui` from `./runtime` (a real retained binding, and semantically right: the
old `export *` handed out `@tamagui/web`'s versions, without the RN media driver), plus
`"**/runtime.*"` in core's `sideEffects` so downstream tree shaking keeps the module.
Root cause of the pruning was `tamagui-build`'s `pruneUnusedImports`, which drops a bare
side-effect import when `sideEffects` declares JS pure.

Guarded behaviorally by `code/core/tailwind/src/__tests__/internalRuntimeArtifact.test.ts`,
which runs the built ESM and CJS entries in node and asserts `setupHooks` installed
`getBaseViews`/`setElementProps`/`usePropsTransform`. Before: ESM `[]`, CJS 3 hooks.
After: 3/3 both. esbuild metafile proof: `dist/esm/runtime.mjs` is now an input of a
minified browser bundle that imports only `createFrontendViews`.

Uncovered while fixing it: `getBaseViews.native.ts` used `require('react-native')`, so
once the ESM native artifact actually evaluated `runtime` it threw "require is not
defined". Now a namespace import; the CJS builds compile it back to a require, so metro
is unchanged. The tailwind native suite previously passed only because setup never ran.

## B2 — declarations, fallbacks, and a resolution bug
Built and committed `code/core/core/types/{internal-runtime,runtime}.d.ts`,
`code/core/web/types/{internal-runtime,internalRuntimeTypes,helpers/styleFrontend}.d.ts`,
the regenerated `types.d.ts` that was missing `styleFrontend`, and the 5 non-vite
`code/core/tailwind/types/*.d.ts` (built after Lane B landed 85d09a5503;
`types/vite.d.ts` untouched).

Added `internal-runtime/` subpath fallback directories for core and web. They are ESM
re-exports of the `.mjs` / `.native.js` artifact rather than the existing CJS
`Object.assign` pattern, because a CJS `index.js` makes esbuild-class bundlers resolve
the directory and downgrade the whole shared-runtime graph to `dist/cjs` (measured; the
pre-existing `inject-styles/` dir has the same hazard). A nested `package.json` would
also have fixed it, but `code/core/**/*` is a workspace glob so it would have become a
package and forced a bun.lock change.

The real reason the package gate failed was also a resolution bug: root tsconfig's
`"@tamagui/*" -> "./code/core/*"` wildcard made `@tamagui/core/internal-runtime` resolve
to a non-typed path, so every imported type silently became `any` and the whole Tailwind
type surface was vacuous (`padding` reported present, every `@ts-expect-error` unused).
Added explicit `paths` entries for the two internal-runtime subpaths, matching the
existing `@tamagui/colors/legacy` precedent. Also excluded `*.native.*` from
`tailwind/tsconfig.test.json` so the web run stops typechecking native tests under web
module resolution.

## B3 — authored ordering
`candidate.ts` appends through `setInAuthoredOrder` (delete-then-set) instead of
re-assigning, which kept a restated shorthand at its FIRST insertion position. Same rule
applied to `preprocessFlatProps`' scalar writes. 5 web + 5 native behavioral tests across
`p`/`px`, `p`/`pt`, `m`/`mx`, `rounded`/`rounded-t`, `border`/`border-x`, plus one
class-after-ordinary-prop case. Verified all 5 fail with the fix reverted.

## M1 — narrow internal graph
The descriptor contract in `helpers/styleFrontend.ts` is now self-contained
(`StyleFrontendConfig` derived from style-grammar's `GrammarSourceConfig`, plus
`FrontendStaticConfig` / `FrontendComponent`): `tsc --listFiles` on it reports exactly one
module under `code/core/web/src`, down from `types.tsx` + `CSSColorNames` +
`RNExclusiveTypes`. `createFrontendViews`/`createFrontendStyled` now return
`FrontendComponent` instead of `TamaguiComponent`, and the internal type entry dropped
`StaticConfig`, `StaticConfigPublic`, `StylableComponent`, `GenericVariantDefinitions`,
`VariantSpreadFunction`, and `TamaguiInternalConfig`. Tailwind imports none of them now.

The residual is documented in both docblocks instead of the previous false claim: the four
non-style component prop / element types still resolve through `types.tsx`, and the emitted
`internal-runtime.d.ts` still reaches the web type barrel via `createFrontendStyled ->
styled.d.ts`. Closing the module-level gate needs `types.tsx` split so the
config/plumbing half is not colocated with `StackStyle`/`TextStyle`; that stays with Lane
C's `scripts/v3-frontend-isolation.test.ts`.

## m1 / m4
`normalizeStaticConfig` partitions the class base into styles-only `baseStyle` plus a new
`StaticConfig.passthroughClassName` (2 tests). Only tailwind's own tests call it today
(`createComponent` has not been cut over), so there is no behavior change.
m4: removed the dead second `normalizedStaticConfigCache.set`; added `../constants` to
`tailwind/tsconfig.json` references; added the missing core negative (`styled(View,
'p-4')` and the 3-arg form rejected) to `styledV3.test-d.ts`; added `jsx.test-d.tsx` with
JSX-shaped positive/negative cases and a real `ref`. Left the
`gestureHandlerFreeze.native.test.tsx` cross-lane touch alone (reverting is equally
cross-lane and it is harmless).

## Validation (all green after the final rebuild of web/core/tailwind)
- `code/core/style-grammar`: 319 passed
- `code/core/web` `test:web`: 90 passed, no type errors
- `code/core/tailwind` `test:web`: 67 passed, no type errors; `test:native`: 13 passed
- `code/core/core-test` `test:native`: 411 passed / 7 expected fail / 11 skipped
- `code/core/core-test` `test:web`: 771 passed / 1 skipped / 1 todo
- built ESM and CJS internal-runtime probes: 3/3 hooks installed
- `scripts/check-package-exports-web-alignment.mjs`: only the 2 pre-existing
  `code/ui/tamagui` issues
- `bun run check:references`: clean

## Not done, deliberately
- M2/M3 handoff notes need `plans/v3-handoff-log.md`, which was off-limits. Content below.
- M4 `./vite` closure is Lane B/C.
- m2 build-only dependencies stay as the pre-agreed manifest; moving them needs bun.lock.

## For the log owner / reserving agent
1. Two preprocessed markers exist: `STYLE_FRONTEND_PREPROCESSED`
   (`helpers/styleFrontend.ts`) vs `getSplitStyles`' private `STYLE_MODE_PREPROCESSED`.
   Until unified, descriptor-preprocessed props are tokenized twice.
2. `getSplitStyles.tsx:1556-1570` still gates `flushForwardStylesToClasses()` and
   `shouldDoClasses = false` on the global mode, so under package selection the
   documented last-wins order between passthrough classes and later Tamagui
   contributions is lost. The string-concat branch is the desired final behavior; the
   flush is what goes missing. No current test sees it.
3. The cut must prepend the new `staticConfig.passthroughClassName` to the rendered
   className.
4. Remaining isolation debt: split `types.tsx` for the declaration gate.
