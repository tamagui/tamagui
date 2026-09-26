# Compiler rewrite: cross-file analysis with host-bundler resolution

Research and architecture detail for `v3-evolution.md`. The master plan owns
dispatch order and acceptance. The headline is cross-file compilation, not a
parser brand.

## Outcome

Replace the Babel-traverse extractor and guessed esbuild module graph with:

- a shared ESTree/TS-ESTree element/evaluation core;
- a project-wide parsed + linked graph;
- host-bundler resolution and evaluation;
- source JSX and compiled JSX-call adapters;
- exact bailout diagnostics;
- Vite and Metro frontends first, webpack/Next afterward.

A feature branch may compare old/new engines. No user-facing `engine` toggle or
same-bundler fallback ships.

## Current cost centers

`code/compiler/static/src/extractor/createExtractor.ts` is roughly 3k lines.
Together with `extractToClassNames`, `evaluateAstNode`, and
`getStaticBindingsForScope`, the Babel-dependent extraction/evaluation surface
is roughly 4k lines.

The other problem is module loading: `bundleConfig`, `bundle`, `loadTamagui`,
`registerRequire`, and alias/path helpers build an esbuild-shaped world that can
disagree with Vite/Metro/webpack on aliases, export conditions, workspace links,
and user plugins.

These problems are separable. Fix Vite evaluation first, then replace analysis.

## Parser/analyzer candidates

### Oxc

- `oxc-parser` provides fast ESTree/typescript-eslint-shaped raw-transfer ASTs.
- The transferred AST is read-only; output uses span edits such as
  `magic-string`.
- Ecosystem gravity is strong through Rolldown/Vite 8.
- It does not expose a JS scope/link analyzer, so Tamagui must own that layer.

### Yuku

- `yuku-parser` produces mutable ESTree/TS-ESTree objects.
- `yuku-codegen` prints mutated ASTs with source maps.
- `yuku-analyzer` exposes scopes, symbols, references, and cross-file linking,
  which directly targets `getStaticBindingsForScope`.
- The API is young and the project has materially less ecosystem backing.

The parser adapter is deliberately small. The analyzer decision is made by the
fixture/benchmark packet in `v3-evolution.md`, not preference. If yuku's linker
is incomplete, use oxc plus a Tamagui-owned symbol graph. Do not fork either
tool.

## Phase 1: Vite ModuleRunner evaluation

Vite 8's environment/ModuleRunner path evaluates `tamagui.config` and component
modules through the same resolver and plugin pipeline as the app.

Implementation:

1. Create a dedicated Tamagui evaluation environment in
   `@tamagui/vite-plugin`.
2. Import config/component modules through its ModuleRunner.
3. Track module invalidation and reload static config on HMR.
4. Delete the Vite use of the homegrown esbuild loader. Keep loader code only in
   adapters that still require it; do not use it as a Vite fallback.

Proof requires a fixture where an alias + conditional export resolves
differently under the old loader and identically under app/compiler after the
change.

## Shared compiler core

### Element IR

Normalize these inputs immediately:

- JSX elements/fragments;
- automatic runtime `jsx()` / `jsxs()` calls;
- `React.createElement()` calls.

The IR records resolved component binding, ordered props/spreads, children,
source spans, and bailout reasons. Extraction logic does not care which syntax
adapter produced it.

### Project graph

A long-lived analysis service owns files, imports, scopes, definitions,
references, and content hashes. It supports:

- full cold link;
- single-file update plus affected-dependent invalidation;
- lookup of a binding through re-exports and workspace boundaries;
- imported static constants and spread objects;
- stable reason codes when a value cannot be proven static.

The host frontend supplies resolved ids. The graph never runs its own tsconfig/
Node resolution in parallel with the bundler.

### Evaluation

Static binding analysis resolves literals, object/array spreads, aliases, and
cross-file constants. Actual config/component module execution remains a
separate host-evaluation seam for computed `createTamagui` output. Analysis does
not pretend all JavaScript is statically evaluable.

### Output

Use span edits and source maps. Avoid whole-file reprints so comments,
formatting, and unrelated plugin output remain stable. Any unsupported shape
bails to untouched runtime code.

## Vite frontend

- filtered post-transform hook, after user syntax/plugins;
- accepts compiled JSX calls;
- owns analyzer service in-process;
- uses Vite `resolve` results and ModuleRunner evaluation;
- preserves virtual CSS, SSR/client sharing, HMR, and current cache behavior;
- removes the Babel Vite extractor before merge.

Proof: current static snapshots, compiled-JSX cases, monorepo alias fixture,
SSR/hydration, HMR, diagnostics, source maps, and cold/warm measurements.

## Metro frontend

Metro transforms run in isolated workers, so the graph cannot live in a
transformer singleton.

Preferred architecture:

1. `withTamagui` owns a main-process scan/link prepass using Metro's resolver.
2. The prepass writes a versioned content-hash cache atomically.
3. The Tamagui transformer composes after the user's Babel transformer.
4. Workers normalize compiled JSX and read graph entries without per-file IPC.
5. Watch changes update affected cache entries; corrupt/stale entries trigger a
   bounded rebuild, not correctness fallback.

If Metro has no correct main-process/resolver seam, stop with a minimal fixture
before choosing serializer pass or IPC. Do not guess module resolution.

Proof: custom Babel syntax, alias + conditional export, workspace package,
multiple transform workers, warm invalidation, native bundle execution, cache
recovery, and diagnostics.

## Webpack/Next

After Vite/Metro stabilize, add thin frontends that supply their resolver/
evaluation hooks to the shared core. Platform-specific adapters are expected;
separate semantic extractors are not. Delete Babel extractor dependencies once
the last supported frontend moves.

## Diagnostics contract

For each non-extracted candidate, development diagnostics identify:

- file and source span;
- component/binding;
- exact prop/import/expression that blocked proof;
- stable reason code;
- whether the bailout was local or caused by a linked dependency.

Diagnostics are opt-in/noisy tooling, not production logging. A bailout keeps
runtime behavior correct.

## Decision spike

Run yuku and oxc-based prototypes over the same cases:

1. imported token constants;
2. aliased + re-exported imports;
3. spread configs;
4. monorepo workspace binding through host-resolved ids;
5. compiled JSX input;
6. cold graph link and warm single-file invalidation;
7. source-map fidelity and memory.

Record results in `v3-evolution.md` and delete the losing spike. Yuku wins only
if every binding case is correct without a maintained fork. Otherwise oxc plus
our graph is the default.

## Non-goals

- Oxc/Rolldown/Yuku forks or custom binary distribution.
- A generic transform framework unrelated to Tamagui extraction.
- In-binary Rust/Zig framework plugins.
- Compiler correctness as a runtime requirement.
- A permanent Babel/new-engine option matrix.

## References

- `plans/v3-evolution.md` — master execution contract
- Vite 8 Environment API and ModuleRunner docs
- Rolldown plugin hook filters
- `oxc-parser`, `yuku-parser`, `yuku-codegen`, `yuku-analyzer`
- existing extractor owners under `code/compiler/static/src/extractor/`
