---
id: t-mrk12yoo-21u50
title: Preflight E3 shared lowerer and Vite compiler frontend
status: done
assignees:
- ab-mrjwbgya-11820
labels:
- E3
- preflight
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mrjwbgya-11820
created_at: 1783995874584
updated_at: 1784007503274
field_marks:
  active_form: 1783995874584
  body: 1783995874584
  claim: 1783995874584
  evidence_summary: 1783995874584
  parent: 1783995874584
  priority: 1783995874584
  recovery_ref: 1783995874584
  status: 1783995874584
  title: 1783995874584
---
# E3 read-only preflight: shared lowerer and Vite frontend

## Verdict

`@tamagui/compiler-core` currently stops at normalized element IR, partial evaluation, graph invalidation, and diagnostics. It has no Tamagui semantic lowerer, emitted code/CSS/native plan, or source-map owner. E4 therefore caches analysis and inserts a `runtime-preserved` marker, while Vite still calls the legacy Babel extractor. E3 must establish one transactional lowerer and output contract in compiler-core before Vite switches and before E4 can replace its marker.

The implementation order is: extend component/styled provenance in the shared IR, add the real shared materialization/lowering/edit pipeline, give Vite a post-transform graph frontend over that pipeline, freeze the output contract, then hand the same plan to E4 for Metro AST/map replay.

## Exact existing owners

Shared compiler-core:

- `code/compiler/compiler-core/src/contracts.ts`: `HostModuleInput`, `HostResolvedImport`, `ResolvedModuleId`, `SourceSpan`, `SymbolResolver`.
- `src/ir.ts`: `ElementIR`, `ElementEntryIR`, `ElementComponentIR`, complete versus incomplete candidates.
- `src/normalize.ts`: `normalizeElements` for JSX, `jsx`/`jsxs`, and `createElement`.
- `src/evaluate.ts`: `evaluateExpression` and dependency collection.
- `src/graph.ts`: `ProjectGraph`, `moduleContentHash`, binding resolution, cached normalized elements, exact dependency/dependent invalidation.
- `src/diagnostics.ts`: the stable local and linked bailout vocabulary.
- `src/yuku.ts`: the sole analyzer adapter.

Vite:

- `code/compiler/vite-plugin/src/plugin.ts`: plugin composition, pre-transform extraction, global JS/CSS cache, pending-promise dedupe, virtual `.tamagui.css`, client/SSR split, HMR/config reload, RNW and D0 Tailwind integration.
- `src/loadTamagui.ts`: Vite ModuleRunner config/component evaluation, config dependencies/generation, `Static.createExtractor()`, `getExtractor()`, and `extractToClassNames()`.

E4 Metro, which remains a separate active ownership lane:

- `code/compiler/metro-plugin/src/frontend.ts`: post-user-Babel graph construction plus private `evaluationValue`, `materializeValue`, `materializeEntry`, and `materializeElement` analysis publication.
- `src/compilerCache.ts`: schema-v1 content-addressed cache storing analysis/bailouts.
- `src/transformer.ts`: worker-side compiled-hash validation and cached-analysis consumption.
- `src/analysisMarker.ts`: placeholder `runtime-preserved` output.
- `src/babel.ts`: current generated analysis input with `sourceMaps: false`.
- `src/metroResolver.ts` and `src/transformOptions.ts`: Metro resolution and main-process scan integration.

## Missing IR required before lowering

`ElementComponentIR` retains a definition but loses the immediate import origin. That fails for configured components treated as external and for Vite aliases, conditional exports, optimized IDs, and re-exports. Add canonical provenance containing at least `specifier`, `importedName`, `resolvedId`, and `external`, while retaining the canonical definition for linked local components. Static-component registry keys must be canonical resolved module ID plus export name, rather than only source `moduleName`.

The graph also needs an explicit `StyledDefinitionIR` or equivalent component-definition graph for statically analyzable local `styled(base, baseClass?, options)` calls and re-exports. It must preserve base component, static config, variants/defaults/compound variants, and definition span. Functional or dynamic configs, unsupported member/namespace forms, and unresolved bases receive an exact per-element runtime bailout. Compiler code must never execute application modules to discover these definitions.

E4's current private materialization moves to compiler-core as a typed `materializeModule(graph, id)` result. Vite and Metro must consume the same materialized candidate model.

## Real shared lowerer ownership

Add the following compiler-core owners:

- `src/materialize.ts`: converts graph IR/evaluation into a JSON-safe module model with canonical component and dependency identity.
- `src/lower.ts`: owns candidate recognition, ordered prop/spread semantics, static-config/variant/default/compound-variant handling, target selection, transactional bailout decisions, web CSS/native plans, and module stats.
- `src/output.ts`: validates sorted non-overlapping span edits and applies them with one MagicString-style path.
- `src/sourceMap.ts` if map composition helpers do not fit in `output.ts`: high-resolution maps and trace helpers.
- exports from `src/index.ts`, plus regenerated declarations.

The algorithm and decisions live in compiler-core. A narrow `@tamagui/static` semantic adapter may supply the loaded component/static-config registry and stable style primitives such as `propMapper`, `normalizeStaticConfigStyles`, default/context lookup, atomic CSS/media helpers, and native style planning. It must not own an alternate traversal, fallback engine, or bundler-specific lowering path. Vite and Metro instantiate the same host and call the same core `lowerModule()`.

Recommended JSON-safe plan/output contract:

```ts
type SourceEdit = {
  start: number
  end: number
  content: string
  origin: SourceSpan
}

type LoweredModulePlan = {
  version: number
  id: ResolvedModuleId
  target: 'web' | 'native'
  inputHash: string
  edits: SourceEdit[]
  css: string
  diagnostics: CompilerDiagnostic[]
  dependencies: ResolvedModuleId[]
  stats: { found: number; lowered: number; flattened: number; styled: number; bailed: number }
}

type LoweredModule = LoweredModulePlan & {
  changed: boolean
  code: string
  map: RawSourceMap | null
}
```

`lowerModule({ graph, id, project, target, options })` returns the serializable plan. `applyLoweredModule(source, id, plan)` is the only text-edit/map implementation and returns code plus map. E4 can cache the plan; Vite can apply it immediately. Cache identity includes module/graph content hashes, canonical dependency hashes, config/static-registry generation, target, and lowerer version.

## Output, bailout, and diagnostic contract

- Ordinary non-Tamagui elements are skipped silently.
- A recognized candidate lowers only when its entire style-bearing shape is proven safe.
- Lower each candidate transactionally. Edits, CSS rules, imports, and hoists accumulate in a candidate-local buffer and commit together. A bailout commits none of them.
- `element.complete === false`, unknown component/static config, unresolved style-bearing expressions, unsafe spreads/order, unsupported styled definitions/targets, host failures, or overlapping edits preserve that whole element byte-for-byte.
- One bailed candidate does not prevent independent siblings from lowering.
- Dynamic non-style props, events, refs, accessibility props, and children can remain as original source slices when style precedence is still provably safe.
- An unevaluated spread bails because style and duplicate-prop precedence are unknown.
- Conditional styles lower only when both style branches are statically valid and the runtime test can stay in generated code. Otherwise preserve the candidate.
- Duplicate prop order, spread order, caller `className`, pseudo/media/theme/group rules, font classes, acceptsClassName, animation deopts, and host/component class order must match runtime.
- Fatal parse/graph/config infrastructure errors may fail the build. Normal proof failures return runtime-preserved code with a stable diagnostic.
- No fallback call into the legacy extractor is permitted.

Keep the current diagnostic structure and stable codes. Add stable codes only for unresolved component config, dynamic style value/spread, unsupported styled definition/target, style-resolution failure, and overlapping edits. Every candidate diagnostic carries exact UTF-16 span and dependency ID, plus component/import/prop where available. Diagnostics remain opt-in developer output.

## Source-map contract

- All spans are UTF-16, inclusive start and exclusive end, into the exact source supplied to compiler-core after user transforms.
- Apply sorted edits with high-resolution mappings, `source: id`, and embedded `sourcesContent`.
- The lowerer map targets its immediate post-user-transform input. Vite composes it with preceding user-plugin maps.
- All appended client CSS/Tailwind imports flow through the same mapped edit path. The current `map: null` append path must disappear.
- An unchanged bailout returns no transform result unless an environment-specific import edit is still required.
- Source-map fixtures must trace an edited component/prop anchor and an untouched sentinel, including a UTF-16 fixture containing `π` and `🙂`.
- Whole-file Babel/Yuku regeneration is outside the contract because it destabilizes unrelated code and comments.

Metro cannot consume a returned map alone. Metro later generates maps from Babel AST locations. E4 must run user Babel with a map, lower the generated source, compose maps, then either parse lowered code and remap AST node locations or replay structured edits against the Babel AST with correct locations. Import edits need explicit location coverage. Current `sourceMaps: false` and a metadata marker do not satisfy this contract; that correction belongs to E4 after the core contract freezes.

## Vite frontend contract

Add `code/compiler/vite-plugin/src/compilerFrontend.ts` as a long-lived service per Vite environment/plugin instance:

```ts
createViteCompilerService({ environment, resolve, load, getProjectInfo }) => ({
  updateModule,
  removeModule,
  compile,
  invalidateProject,
  close,
})
```

Required behavior:

- Change the Tamagui extraction transform from `enforce: pre`/pre order to a filtered post transform after user syntax transforms.
- Cover `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, and `.cts`, including already compiled `jsx`/`jsxs`/`createElement`; use a cheap lexical prefilter before parsing.
- Resolve all static imports/exports using Vite `this.resolve(specifier, importer, { skipSelf: true })` or the equivalent environment plugin-container resolver.
- Load dependency source through a user-transform-only Vite path with a Tamagui skip guard so frontend recursion cannot invoke itself. Guard cycles with an in-progress set.
- Canonicalize Vite IDs/queries before graph insertion, and maintain separate graphs per environment because client and SSR resolver conditions can differ.
- Update dependencies before lowering importers. Invalidate exactly `ProjectGraph.affectedBy(changedId)` plus corresponding JS output and virtual CSS.
- Delete stale `cssMap` entries when a module changes from CSS output to no CSS.
- Preserve pending-promise dedupe, bounded cache behavior, config/component generation tracking, D0 Tailwind integration, virtual CSS naming, client-only CSS import, SSR import suppression, and existing full reload for config/component evaluation changes.
- Share client/SSR base lowering only when source, graph/dependency hashes, config generation, target, and lowerer version all match. Apply environment-specific import edits separately.
- Correct `disableExtraction` handling: boolean disables globally; a string array applies per matching file. It remains the optimizer opt-out. There is no public engine selector and E3 must not add one.

`loadTamagui.ts` keeps ModuleRunner setup, `loadTamaguiFromModules`, config/component dependency invalidation/generation, and `getPragmaOptions`. It exposes `getProjectInfo()` plus canonical resolved component-module/export registry data. It removes extractor state, `getExtractor()`, `Static.createExtractor()`, `extractToClassNames()`, and extractor-specific resets.

## Exact old extractor deletion boundary

E3 deletes only the Vite call path:

- `code/compiler/vite-plugin/src/loadTamagui.ts`: `Extractor`/`ExtractedResponse` types, extractor state, `getExtractor`, loader `extractToClassNames`, and related resets.
- `code/compiler/vite-plugin/src/plugin.ts`: `ExtractedResponse` import and `tamaguiLoader.extractToClassNames()` branch.
- regenerated Vite declarations, plus new compiler-core/frontend declarations.
- package/reference additions for `@tamagui/compiler-core` and the edit/map dependency only after the manifest/lock lane is released.

`@tamagui/static` stays as the project/config loader and narrow lowering-host adapter. The following legacy implementation remains through E5 because webpack, Next, Babel, CLI, static workers/sync, and parity tests still call it:

- `createExtractor.ts`: 3,046 lines.
- `extractToClassNames.ts`: 741 lines.
- `extractToNative.ts`: 489 lines.
- `getStaticBindingsForScope.ts`: 237 lines.
- `evaluateAstNode.ts`: 136 lines.
- Total selected legacy engine surface: 4,649 lines.

`e2-parity.web.test.ts` keeps the old path as an acceptance oracle until the new supported output matches. E3 must not delete E4's `analysisMarker`; E4 deletes it after consuming the shared plan and proving native output/maps. Exact grep found no public old/new `engine` switch. Old analyzer options used by unconverted webpack/Next/Babel adapters remain until E5.

## Fixtures required

Compiler-core focused fixtures:

- Identical semantics for source JSX, compiled `jsx`/`jsxs`, and `createElement`.
- Canonical direct import, alias, conditional export, workspace re-export, and local statically analyzable `styled()` definitions.
- Static configs, variants, defaults, compound variants, pseudo/media/theme/group values.
- Imported/re-exported constants and ordered spreads/duplicate props/className precedence.
- One unsafe candidate stays byte-identical and emits no CSS while an independent sibling lowers.
- Explicit dynamic/functional styled-definition bailout.
- Web CSS and native plans from the same materialized IR.
- Nested edit normalization and overlap rejection.
- Exact diagnostics and UTF-16/chained source-map traces.

Vite fixtures:

- Add focused `vite-plugin/test/compilerFrontend.test.ts`; retain `loadTamagui.test.ts` for ModuleRunner/config behavior.
- Reuse the module-runner aliases, conditional exports, and workspace configuration.
- Add source JSX plus compiled `.js` fixtures for `jsx`, `jsxs`, and `createElement`, including a preceding fake syntax plugin to prove post ordering.
- Use an actual Tamagui static-component registry and imported token/style constants.
- Assert emitted code, virtual CSS, CSS removal/re-add, leaf HMR invalidating only dependents, config/static-component invalidation, client/SSR parity, and no SSR virtual CSS import.
- Snapshot exact diagnostic code/span/import/binding/prop and trace edited/unchanged source-map locations.
- Integration must assert real computed extracted styles, SSR plus hydration, compiled JSX, HMR, production CSS/runtime, and an extracted Vite application. Kitchen-sink's Tamagui Vite plugin is currently commented out, so it is not present E3 proof. Use the existing integration fixture and an active sandbox/explicit focused fixture.

E4 handoff fixtures after E3 freezes:

- Consume the exact shared plan and bump cache schema.
- Replace fake-local-`View`/marker-only proof with a real Tamagui component and native output assertion.
- Cover alias, custom Babel, workspace component, two workers, cache corruption, exact invalidation/diagnostic, edited and unchanged source-map traces, and one native runtime execution.

## Serialized future gates

Do not start these until E4 and manifest/lock ownership is released. Suggested order:

1. Compiler-core build/unit/type/declaration gate.
   `cd code/compiler/compiler-core && bun run build`
2. Analyzer evidence after implementation, noting that evidence writes JSON.
   `cd code/compiler/analyzer-spike && bun run check && bun run evidence`
3. Focused static web parity/corpus.
   `cd code/compiler/static-tests && bun run test:run:web -- tests/e2-parity.web.test.ts tests/babel.web.test.tsx tests/styled.web.test.tsx tests/extract.web.test.tsx tests/concatClassName.web.test.tsx tests/ssrThemeRepro.web.test.tsx tests/webAlignment.web.test.tsx tests/fonts.web.test.tsx`
4. Vite frontend/loader plus declarations.
   `cd code/compiler/vite-plugin && bunx vitest --run --config vite.test.config.ts test/compilerFrontend.test.ts test/loadTamagui.test.ts && bun run build`
5. Alone in the heavy lane, run existing serial Vite dev/HMR/production/SSR integration and the focused extracted browser fixture.
   `cd code/tests/integration && bun run test`
6. Freeze the core plan, hand it to E4, then build Metro and run focused frontend/cache/native execution gates without overlapping browser work.
7. Record cold graph/link/lower median/p95/RSS, warm unchanged hit, and one-leaf edit p50/p95. Warm p95 target is at most 50 ms; report cold results against the E1/current Vite baseline rather than inventing a new threshold.
8. Regenerate compiler-core, Vite, and later Metro declarations. Finish with scoped `git diff --check`.

Final exact acceptance greps:

- zero `createExtractor|extractToClassNames|ExtractedResponse|Extractor` in Vite authored source/generated declarations.
- zero public `engine` selector and zero fallback-engine branches.
- zero Babel/Yuku/Vite/Metro types imported into the lowerer output contract.
- after E4 finishes, zero `analysis-marker|runtime-preserved` source/declaration path.

## Coordination state

E4 owns its Metro implementation files, the heavy lane, and current manifest/lock coordination. E3 implementation must preserve the integrated D0 Tailwind work in Vite and must not edit Metro until an explicit handoff. The shared lowerer/output contract must freeze before E4 changes its cache/worker boundary.

This preflight was read-only. No repository files, builds, tests, installs, lockfile operations, or generated output were changed.
