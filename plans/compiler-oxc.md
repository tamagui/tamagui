# Compiler rewrite: oxc parsing + real-bundler evaluation

Research plan, July 2026. Goal: replace the Babel-based extractor's two
weaknesses (speed, and resolving modules with its own esbuild pipeline instead
of the user's actual bundler) using the now-stable oxc/rolldown ecosystem.
Ships as an opt-in engine next to the babel path; no fork of oxc or rolldown.

## Ecosystem status (verified July 2026)

- **Rolldown 1.0 stable** (May 7, 2026), plugin API locked under semver.
  **Vite 8 stable** (March 2026) uses it as the default bundler.
- **oxc raw transfer**: zero-copy Rust→JS AST handoff, shipped for oxlint JS
  plugins (alpha March 2026, 100% of ESLint's 33k rule tests, 4.8x-16x
  real-world lint speedups) and exposed in the `oxc-parser` npm package.
  Requires Node >= 22. The AST is ESTree/typescript-eslint shaped, read-only,
  so transforms are span-based (magic-string), never mutate-and-print.
- **No plugin API for the oxc transformer itself** and none on the roadmap.
  Custom transforms in-binary are Rust-only and closed to third parties: the
  Rolldown team pulled their own Rust React Compiler integration over binary
  size (socket.dev writeup), and Evan You ruled out framework-specific native
  code in the binary. A napi Rust plugin is possible but still up to ~50%
  slower than in-binary due to AST passing, per rolldown's own docs.
- **Conclusion: no fork.** The blessed extension point is a Rolldown/Vite JS
  plugin with hook filters (declared id/code filters keep the plugin off the
  hot path for non-matching modules). Forking oxc buys in-binary speed at the
  cost of shipping a custom bundler binary and rebasing against an AST that
  churns every release. Everything we need is reachable from JS.

## Current code (code/compiler/, ~10k lines in static)

Two separable problems:

1. **The extractor** (`static/src/extractor/createExtractor.ts` ~3k lines +
   `extractToClassNames.ts`, `evaluateAstNode.ts`,
   `getStaticBindingsForScope.ts`, ~4.5k total): babel-traverse based. This is
   the "slow because babel" part.
2. **The homegrown module loader** (`bundleConfig.ts`, `bundle.ts`,
   `loadTamagui.ts`, `registerRequire.ts`, `esbuildTsconfigPaths.ts`, ~2.1k
   lines): bundles the user's tamagui.config + components with its own
   esbuild pipeline and proxied react-native. This is the "guessing at
   bundling" part and the top source of resolution bugs.

Key insight: the fixes are independent, and the loader fix is smaller and
higher value.

## Phase 1: ModuleRunner evaluation (do first, standalone win)

Vite's Environment API + ModuleRunner (standard in Vite 8,
`moduleRunner.import(url)`) evaluates modules through the user's actual vite
plugin pipeline and resolution. In `@tamagui/vite-plugin`, replace the
`loadTamagui`/esbuild bundling path with a ModuleRunner in a dedicated
environment that imports `tamagui.config.ts` and component modules exactly as
the app resolves them.

- Kills the "compiler resolved a different file than the bundler" bug class.
- Benefits the existing babel extractor immediately; no extractor changes.
- The esbuild loader stays only for metro/webpack/next paths (they have no
  ModuleRunner equivalent), scoped per-bundler rather than as a fallback
  within vite.
- Validate: kitchen-sink + static-tests, plus a repro case with aliased/
  conditional-export resolution that the esbuild path currently gets wrong.

## Phase 2: oxc extractor as an opt-in engine

New engine behind a vite-plugin option (e.g. `engine: 'oxc'`), babel path
stays default until parity.

- Parse with `oxc-parser` (raw transfer, Node 22+ floor for the opt-in).
- Port the JSX flattening + partial evaluator (`evaluateAstNode`,
  `getStaticBindingsForScope`, scope tracking that babel's `path.evaluate`
  gave us) onto the ESTree AST.
- Output via magic-string span edits (extraction is naturally span-shaped:
  replace JSX attributes/elements, hoist generated CSS).
- Rolldown/vite JS plugin with hook filters so only JSX/TSX modules pay.
- Parity harness: `code/compiler/static-tests` snapshots run against both
  engines; diff must be empty (or knowingly better) before default-flip.

## Phase 3: flip the default for vite users

Major version: `engine: 'oxc'` becomes default on Vite 8+. Babel engine
remains the metro/webpack/next engine, so it is demoted rather than deleted.

## Alternative engine: yuku (evaluated hands-on 2026-07-12)

yuku-toolchain/yuku — a Zig JS/TS toolchain (cloned at ~/github/yuku, tested
from npm on darwin-arm64). Three packages matter here, all verified working:

- **yuku-parser**: ESTree/TS-ESTree AST, same shape as oxc-parser, full
  jsx/tsx support (`lang: 'tsx'`). Claims 3-10x faster than npm alternatives
  (self-reported). Crucially the AST is **plain mutable JS objects**, where
  oxc raw transfer is read-only.
- **yuku-codegen**: prints a (mutated) AST back to source with Source Map V3.
  Verified: parse → mutate JSXIdentifier → print round-trips. A real
  mutate-and-print pipeline exists here; with oxc only span-edit
  (magic-string) is possible.
- **yuku-analyzer**: scopes, symbols, resolved references, and cross-file
  module linking in one native pass (`addFile/link/definitionOf/referencesOf`).
  This maps directly onto the extractor's hairiest code
  (`getStaticBindingsForScope` + scope tracking, the ~4.5k-line part): partial
  evaluation needs exactly "resolve this identifier to its defining constant,
  possibly in another file". oxc exposes no analyzer to JS; with oxc we
  hand-port babel's scope logic. Claims ~15x over eslint-scope/babel-traverse.
  API is young — a quick `definitionOf` probe returned a stub-ish result, so
  it needs a real spike, not trust.

Risks vs oxc: single maintainer (arshad-yaseen) vs voidzero's funded team;
v0.6.x pre-1.0 (though npm releases are frequent, binaries shipped for
darwin-arm64 and friends); Zig source (contributing/debugging skillset);
benchmarks self-reported. oxc wins on ecosystem gravity (rolldown/vite 8 ship
it); yuku wins on API completeness for OUR problem (analyzer + codegen +
mutable AST are all things oxc deliberately does not expose to JS).

Plan impact: **write the new extractor against the shared ESTree/TS-ESTree
AST shape and keep the parser swappable** — `engine: 'oxc' | 'yuku'` is then a
one-module difference. The genuinely differentiating decision is scope
resolution: spike yuku-analyzer against 3-4 real getStaticBindingsForScope
cases (imported token constants, aliased imports, spread configs) and
benchmark cold+warm before committing either way. If the analyzer holds up,
the phase-2 port shrinks substantially.

Owner direction (2026-07-12): purpose-built for tamagui is fine (no generic
transform framework); the priority is **cross-file compilation** — that is the
capability the current extractor lacks and the analyzer provides.

### Cross-file architecture: one analysis service, two bundler frontends

The analyzer's addFile/link model is bundler-agnostic; the design that serves
both vite and metro is a **project-wide analysis service**: a long-lived
yuku-analyzer instance owning the parsed+linked project graph, queried by the
extractor during transforms, invalidated per-file on change (watch/HMR).

- **Vite**: straightforward — the plugin owns the service in-process;
  transform hooks query it; ModuleRunner still evaluates tamagui.config
  (analysis answers "what does this identifier statically resolve to";
  evaluation stays only for genuinely computed values like createTamagui
  output — the analyzer removes MANY evaluation needs but not that one).
- **Metro is the hard constraint**: transforms run in isolated worker
  processes with no shared state. Cross-file analysis therefore cannot live in
  the transformer. Options, in preference order: (1) pre-pass in the plugin
  main process (scan + link the project once — Zig parse makes whole-project
  cold-start cheap) writing a content-hash-keyed on-disk cache that workers
  read; (2) serializer-phase pass (post-transform, limits what can be
  rewritten); (3) an IPC service workers query (adds latency per file).
  Uniwind/nativewind's registry generation is precedent for (1).

### Real-world robustness (owner priority): weird syntax, aliases, monorepos

Three design rules that keep this out of the tar pit:

1. **Accept compiled JSX as input.** Normalize both source JSX and
   jsx-runtime output (`jsx(View, {...})` / `jsxs` / `createElement`) into one
   internal representation early in the extractor. Then the plugin can run
   LAST (vite `enforce: 'post'`; metro transformer composed after the user's
   babel chain), after whatever macros/plugins/custom syntax the app uses —
   their weirdness is already lowered to plain calls by the time we look.
   The call form is more canonical than JSX anyway (no whitespace/fragment/
   spread-attr syntax variance).
2. **Never resolve modules ourselves.** Custom tsconfig paths, aliases,
   conditions, monorepo workspace links: delegate resolution to the host
   bundler in both frontends (vite `this.resolve()` feeding the analyzer's
   file graph; metro's resolver for the pre-pass). The analyzer links the
   graph the bundler actually built, not one we guessed. This is the same
   principle as ModuleRunner for config evaluation and it deletes the entire
   "compiler resolved differently than the bundler" bug class.
3. **Bailout is the contract, diagnostics are the feature.** The extractor is
   an optimizer, never a correctness requirement: anything it can't statically
   understand falls back to tamagui's full runtime, so weird code means less
   optimization, never breakage. What turns robustness from a tar pit into a
   feature is visibility: a per-file "why didn't this extract" diagnostic mode
   so users (and we) can see exactly which prop/import blocked extraction
   instead of silently paying runtime cost.

## Non-goals

- No in-binary oxc transform, no oxc/rolldown fork, no custom binary distribution.
- No Rust napi rewrite of the extractor: measured benefit over a filtered JS
  plugin is small (parse was the babel tax; evaluation logic is easier to
  keep correct in TS) and the maintenance cost is large.

## References

- https://voidzero.dev/posts/announcing-rolldown-1-0
- https://vite.dev/blog/announcing-vite8
- https://oxc.rs/blog/2026-03-11-oxlint-js-plugins-alpha (raw transfer)
- https://www.npmjs.com/package/oxc-parser
- https://vite.dev/guide/api-environment.html, https://vite.dev/changes/ssr-using-modulerunner
- https://rolldown.rs/apis/plugin-api (hook filters)
- https://socket.dev/blog/rolldown-pulls-rust-react-compiler-integration
- https://github.com/yuku-toolchain/yuku (source at ~/github/yuku; npm: yuku-parser, yuku-codegen, yuku-analyzer)
- https://yuku.fyi (docs)
