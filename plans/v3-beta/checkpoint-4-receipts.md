# Checkpoint 4 web artifact receipts

Date: 2026-08-27

Commit measured before the checkpoint commit: `84ab651a353a3b4f5a72b4efd860601d4db7a2fc`

## Artifact contract

`TAMAGUI_DID_OUTPUT_CSS=1` selects the compiled CSS artifact. Values the compiler cannot prove stay inline. The artifact omits atomic CSS generation, CSS insertion, runtime theme CSS generation, and `parseValue`.

The zero-runtime measurement reads emitted JavaScript and checks these signatures:

- style processor positive control: `a flat value clause supports at most`
- atomic CSS generation: transform default rules
- CSS insertion: `TAMAGUI_STYLE_INSERT`
- runtime theme CSS generation: `tvar_`
- `parseValue`: its registered-modifier diagnostic

Strict pages require all five families to be absent. Full-runtime islands require the style processor positive control to be present and the other four families to be absent.

## Production fixture builds

**TESTED** `cd code/starters/zero-runtime && fnm exec --using=24.16.0 node scripts/measure.mjs --update-baseline`

Passed the emitted-content contract for Vite, Next webpack, and Metro web. The updated production gzip baselines are:

| Bundler | Base JS | Island page JS | Island chunk JS | Base CSS | Island CSS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Vite | 60,053 | 61,000 | 90,801 | 2,701 | 2,705 |
| Next webpack | 141,019 | 142,055 | 90,615 | 2,701 | 2,705 |
| Metro web | 62,066 | 62,837 | 363,719 | 2,701 | 2,839 |

**TESTED** `cd code/starters/zero-runtime && fnm exec --using=24.16.0 bun run test`

Passed 12 Playwright tests across Vite, Next webpack, and Metro web. The island test supplies an unknown-at-compile-time width and verifies `137px` inline before hover and `147px` inline on hover.

## Strict and public View chunks

**TESTED** `cd code/comparisons/tamagui-bench && EXTRACT=1 BUNDLE_ATTRIBUTION_FILE=/tmp/cp4-strict-final-attr.json fnm exec --using=24.16.0 npx vite build --mode size --outDir /tmp/cp4-strict-final --emptyOutDir`

The production strict Tamagui chunk was 49.78 kB raw and 19.06 kB gzip. Emitted JavaScript and attribution contained zero occurrences of `directStyle`, `getSplitStyles`, `createComponent`, `propMapper`, `platformMatches`, `valueParser`, and `parseValue`. The five zero-runtime artifact signatures were also absent.

**TESTED** `cd code/comparisons/tamagui-bench && EXTRACT=1 BUNDLE_ATTRIBUTION_FILE=/tmp/cp4-public-final-attr.json fnm exec --using=24.16.0 npx vite build --mode checkpoint-public-view --outDir /tmp/cp4-public-final --emptyOutDir`

The production public View attribution contained zero occurrences of `valueParser` and `parseValue`. Its emitted JavaScript contained no `parseValue` diagnostic signature.

## Package and workspace gates

**TESTED** `cd code/core/core-test && fnm exec --using=24.16.0 bun run test`

Passed the native, provenance, web, iOS, Android TV, and tvOS matrices. The web matrix passed 601 tests.

**TESTED** `cd code/compiler/static-tests && fnm exec --using=24.16.0 bun run test`

Passed 23 Vitest files with 220 tests, plus the webpack suite with 20 tests. One file and two tests remained intentionally skipped.

**TESTED** `cd code/compiler/metro-plugin && bun run test:web -- frontend.test.ts`

Passed six tests, including AST assertions that enforcing Metro zero builds inline both `TAMAGUI_RUNTIME=zero` and `TAMAGUI_DID_OUTPUT_CSS=1`.

**TESTED** `fnm exec --using=24.16.0 bun run lint`

Passed formatting and lint. Five existing warnings remain outside this checkpoint.

**TESTED** `fnm exec --using=24.16.0 bun run check`

Passed dependency, unused dependency, Tamagui dependency, reference, path mapping, standalone DOM type, and LSP pin checks.

## Plan discrepancies verified in code and built output

- Before this checkpoint, compiled CSS Vite output still contained CSS insertion, atomic CSS generation, and runtime theme CSS signatures. Existing `TAMAGUI_DID_OUTPUT_CSS` branches did not specialize the whole client artifact.
- Metro only inlined `TAMAGUI_RUNTIME`. Its dependency modules retained live `TAMAGUI_DID_OUTPUT_CSS` reads, so every forbidden family and `parseValue` survived the island build.
- Metro pulled `parseValue` into the View graph because config v6 modules imported two theme-name constants from the style grammar tooling entry. Exporting those constants from the runtime entry removes the tooling parser graph.
- Splitting compiled CSS helpers exposed a CommonJS circular dependency between `getSplitStyles` and `useSplitStyles` in Metro. Direct hook imports remove the cycle.
- Moving `platformMatches` to constants exposed two native tests whose partial constants mocks omitted the platform API. The mocks now declare the platform behavior they exercise.

The native lowering remains guarded by `process.env.TAMAGUI_TARGET`. The `@tamagui/static` build still uses `--keep-env-target`.
