# Flat Styles Branch Review (`main...flat-styles`)

## Findings (ordered by severity)

1. **`styleMode` is documented as opt-in, but runtime behavior is always on (breaking default mode).**
   - `preprocessFlatProps()` is unconditionally invoked in `getSplitStyles` with no `conf.settings.styleMode` check: `code/core/web/src/helpers/getSplitStyles.tsx:511`.
   - That means `$...` props that look like styles are transformed even when users are in default/object mode.
   - This conflicts with the explicit type/docs contract saying flat mode is opt-in: `code/core/web/src/types.tsx:1153`, `code/core/web/src/types.tsx:1910`.

2. **Flat/object coexistence is order-dependent and can silently drop styles.**
   - In preprocessing, transformed flat media writes into `result['$sm']` via merge: `code/core/web/src/helpers/getSplitStyles.tsx:256`.
   - Later, a plain object `$sm` prop does a direct overwrite (`result[key] = value`): `code/core/web/src/helpers/getSplitStyles.tsx:304`.
   - So `{ '$sm:bg': 'red', $sm: { padding: 10 } }` vs `{ $sm: { padding: 10 }, '$sm:bg': 'red' }` can produce different results. This is a correctness bug, not just a perf issue.

3. **Types are inconsistent with implementation intent and incomplete for supported syntax.**
   - The new flat types are added unconditionally to core style prop types (`StackStyle`, `TextStyle`, `GetFinalProps`): `code/core/web/src/types.tsx:2526`, `code/core/web/src/types.tsx:2550`, `code/core/web/src/types.tsx:2593`.
   - But comments say flat mode is opt-in: `code/core/web/src/types.tsx:1910`.
   - Runtime supports theme/platform modifiers (`$dark:*`, `$web:*`) via parser: `code/core/web/src/helpers/getSplitStyles.tsx:155`, `code/core/web/src/helpers/getSplitStyles.tsx:161`.
   - `WithFlatModifierProps` only models pseudo + media keys, not theme/platform modifiers: `code/core/web/src/types.tsx:1928`.

4. **Runtime recognition of “flat base props” is heuristic and narrower than declared type surface.**
   - Acceptance uses a hardcoded list in `isLikelyStyleProp()`: `code/core/web/src/helpers/getSplitStyles.tsx:311`.
   - Type layer allows `$${keyof StyleProps}` broadly: `code/core/web/src/types.tsx:1923`.
   - This creates mismatch: many type-accepted props may no-op at runtime unless they happen to be in shorthands or allowlist.

5. **Test suite quality is too permissive for a parser/rewriter feature.**
   - Many tests assert string containment in serialized class maps instead of exact semantic outputs: `code/core/core-test/flatMode.web.test.tsx:128`, `code/core/core-test/flatMode.web.test.tsx:347`.
   - Most cases are cast as `any`, reducing confidence in prop-shape/type interactions: `code/core/core-test/flatMode.web.test.tsx:20`.
   - Missing critical regressions:
     - `styleMode` disabled/default should reject/ignore flat syntax.
     - order-collision tests (`$sm` object + `$sm:*` flat in both orders).
     - unknown modifier behavior and passthrough guarantees.
     - precedence tests between object syntax and flat syntax for same target key.

6. **E2E coverage has known gaps and currently skips a broken path.**
   - Kitchen-sink test has a skipped shorthand scenario with TODO: `code/kitchen-sink/tests/FlatMode.test.tsx:87`.
   - This is exactly the class of case likely to regress as parser logic evolves.

## Testing Assessment

- I ran:
  - `bun run test:web flatMode.web.test.tsx` in `code/core/core-test` (passes).
  - `bun run test` and `bun run typecheck` in `code/tests/style-mode-flat` (passes).
- Passing status does **not** currently de-risk the highest-impact failure modes above; the tests are mostly happy-path and shape-oriented.

## Recommended Next Test Additions (before optimization work)

1. Add config-gating tests:
   - `styleMode: 'tamagui'` and default settings should not activate flat parsing.
2. Add deterministic merge tests:
   - both key orders for `$sm` object + `$sm:*` flat, and `hoverStyle` + `$hover:*`.
3. Add exact-output assertions:
   - assert final merged style/class behavior, not only key-name substring matches.
4. Add negative type tests:
   - explicitly fail unsupported modifier keys and verify theme/platform modifier typing decisions.
5. Unskip and fix kitchen-sink shorthand test, then keep it required in CI.
