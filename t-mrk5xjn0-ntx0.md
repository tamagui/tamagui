---
id: t-mrk5xjn0-ntx0
title: Design E5 non-Vite compiler adapter migration
status: done
assignees:
- ab-mriu55kg-47600
labels:
- E5
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
created_at: 1784004019884
updated_at: 1784004566361
field_marks:
  active_form: 1784004019884
  body: 1784004019884
  claim: 1784004019884
  evidence_summary: 1784004019884
  parent: 1784004019884
  priority: 1784004019884
  recovery_ref: 1784004019884
  status: 1784004019884
  title: 1784004019884
---
READ-ONLY E5 INVENTORY AND DESIGN

Live legacy consumers:
- webpack/Next: code/compiler/loader/src/loader.ts calls static-worker.extractToClassNames; TamaguiPlugin.ts starts and watches that worker and injects the loader; code/compiler/next-plugin/src/withTamagui.ts wraps it. Current Next rule puts tamagui-loader at the right edge, so webpack runs it before next-swc-loader. Vanilla webpack production does not inject the loader unless explicitly configured. Component roots use require.resolve rather than the webpack resolver.
- worker/sync/Babel: code/compiler/static/src/worker.ts owns createExtractor plus web/native tasks; static-worker exposes async extraction; static-sync exposes sync extraction/getBabelPlugin; babel-plugin exports it. Live configs are kitchen-sink, starters/expo-router, and comparisons/tamagui-bench-native-compiled.
- CLI/static: code/core/cli/src/build.ts directly uses createExtractor, extractToClassNames, and extractToNative. This is the real Next Turbopack path in code/tests/next-turbopack and the platform/export path in code/tests/next-webpack, plus kitchen-sink compiler fixture generation.
- Static public surface: code/compiler/static/src/exports.ts and types export createExtractor/Extractor, ExtractedResponse, extractToClassNames, extractToNative/getBabelPlugin, ExtractTagProps/Babel AST types, and the worker subpath. Vite/Metro still need static config loading and createTamaguiCompilerHost, not the legacy traversal.

One-engine implementation order:
1. Freeze the live legacy oracle before deletion: normalized fixture records with source hash, transformed output, ordered class tokens, compact CSS, stats, and runtime observations. Run live old/new comparison while adapters migrate. Cover E2 observations, E3 hard cases, babel.web 34, babel.native 22, flatten.native 7, styled 4, webAlignment 12, fonts, ssrTheme, webpack 18, CLI platform/export fixtures. Every divergence needs a named reason; compiled-call improvements and conservative native runtime bailouts are allowed only when runtime equivalence is proven.
2. Add a per-compiler WebpackCompilerFrontend in tamagui-loader using ProjectGraph -> materializeModule -> lowerModule -> LoweredModulePlan -> applyLoweredModule. Webpack supplies every identity through loaderContext.getResolve; linked files and plan dependencies go through addDependency. TamaguiPlugin owns project/config generation per Compiler and invalidates on watch. Remove static-worker from this path. Put the Tamagui loader leftmost so webpack executes user loaders and Next SWC first. Compose compiler maps with the upstream loader map. Add the CSS require as a mapped plan SourceEdit before the sole applyLoweredModule call.
3. Keep withTamagui and TamaguiPlugin public shapes, but rebuild declarations. Use webpack resolverFactory for configured component identities; stop forcing module:jsx because compiled jsx/jsxs are supported. Always install the transform when extraction is enabled, including vanilla production. Prove isolated client/server compiler instances and exact dependency invalidation.
4. Replace CLI direct extraction with a Node/esbuild-resolved project frontend over the same plan. Pre-resolve the selected file graph with tsconfig/package exports, apply one plan per target, preserve platform-file routing, output-around/restore, CSS import placement, stats and expect-optimizations. This keeps Next Turbopack supported without inventing a Turbopack extractor.
5. After E4 native lowering is final, remove the optional Babel compiler path instead of recreating a per-file resolver: delete babel-plugin/static-sync use from live configs/manifests/docs and rely on Metro E4. Babel has no bundler-owned resolver, so an independent optimizer would violate the compiler boundary. Delete static-worker after webpack no longer calls it.
6. Flip parity tests to frozen oracle data, then delete the legacy Static traversal/evaluator and its root exports/types/worker task. Keep loadTamagui/loadTamaguiFromModules/loadTamaguiSync, config watching/bundling, compilerHost, pragma/checkDeps, and nonlegacy helpers. Regenerate all declarations and reconcile manifests/lock only in the implementation lane.

Zero-deletion boundary:
- No deletion until webpack/Next and CLI use LoweredModulePlan, E4 replaces Babel native use, the full old/new corpus passes, and E2/E3 no longer import the live legacy oracle.
- Final production grep is zero for createExtractor, extractToClassNames, extractToNative, getBabelPlugin/getBabelParseDefinition, ExtractTagProps/ExtractedAttr/Ternary, static-worker, static-sync, and babel-plugin outside frozen historical fixture data.
- Static root declarations export no Babel AST types or legacy response APIs; packages/build configs/docs have no live Babel plugin references.
- Babel parser/generator/traverse remain temporarily required by bundleConfig transformAddExports and hasTopLevelAwait. If the acceptance means zero Babel dependencies in static, port those two config-loader chores to yuku/esbuild before removing the final Babel packages; do not conflate that with extractor deletion.

Fixtures and gates:
- Webpack fixture: custom syntax loader, compiled JSX, alias/workspace constant edit, duplicate spread/caller class ordering, pseudo/media/theme/group/font, animation and acceptsClassName bailouts, config HMR, stale-edge removal, pi/emoji source-map trace, CSS once, concurrent client/server compilers.
- Next site: production next build --webpack plus start/Playwright, SSR/hydration/computed CSS, alias and user webpack callback. Next 16 Turbopack remains the CLI prebuild fixture unless a separate product decision requires a Turbopack resolver frontend.
- CLI: next-turbopack unit/integration, next-webpack export/platform suites, kitchen compiler fixtures for web/native and expect-optimizations.
- Package builds: compiler-core, static, loader, next-plugin, CLI; full static-tests test:all; root typecheck and dependency/export/pack checks after declaration regeneration.

Blockers:
- E4 must reach real native-output FINAL_PASS before Babel removal.
- The compiler-core native host is intentionally conservative; legacy native optimization-count expectations require explicit parity extensions or approved runtime-bailout expectation changes.
- Next 16 scope must be explicit: current next-plugin is webpack-only; Turbopack is supported today by destructive CLI prebuild, not a Next transform hook.
- Public removal of static extraction APIs and babel/static-sync/static-worker packages is a v3 breaking change and needs release-note approval.
