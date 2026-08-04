# v3 metro lowering delivery, 2026-08-03 (deep-engine lane checkpoint)

Branch `v3/engine-native-parity` (worktree `/Users/n8/.worktrees/v3-engine-native`),
based on `v3-beta` at `4ac01cd6e7`. Coordinator a2943. Items from
`plans/v3-engine-status-2026-08-03.md`: #1 (compiled-native gate discrepancy)
and #2 (theme values inlined), plus #3 (conditional font variants) from the brief.

## Item 1 RESOLVED: the 0.91x gate and the 19-marker receipt were BOTH true

They tested different build flows. READ, reproduced deterministically on this
machine at this tree:

- The prior agent's receipt used `Metro.loadConfig` + `runBuild` directly. In
  that flow the frontend's approximated Babel options happen to match the
  workers', hashes match, plans apply: 19 markers, zero plan-miss. True.
- The W-B benchmark's Release apps embed their bundle via `expo export:embed`
  (what the Xcode "Bundle React Native code and images" phase runs). In that
  flow EVERY project source file missed with `compiled-hash-mismatch` and
  shipped unlowered, so the V3 compiled arm ran the runtime path: 0.91x. Also
  true. Quoted from my build log:

  ```
  [@tamagui/metro-plugin] metro/plan-miss: Lowering plan lookup missed for
  /Users/n8/.worktrees/v3-engine-native/code/comparisons/shared/native-compiled-bench.tsx
  (compiled-hash-mismatch: worker 135e9b7794ac vs plan 0bc248e7a239); module ships unlowered
  ```

Root cause (READ via an instrumented dump of both Babel invocations in one
build; same srcHash, different options): Metro workers under expo receive
`customTransformOptions: {engine: 'hermes', routerRoot}`, `type: 'module'`,
`publicPath: '/assets?export_path=/assets'`, `minify`, `nonInlinedRequires`,
etc. The metro-plugin frontend approximated worker options in `#babelArgs`
from what `getTransformOptions` exposes, which is only `{dev, hot, platform}`
plus the user transform result. The hermes engine target alone changes output
(worker keeps arrow functions, frontend transpiled them), so the plan cache's
compiled-hash guard rejected every plan. This is the THIRD delivery defect,
distinct from the relative-filename miss (`2acce54e05`) and the
platform-ambiguous config bundle cache.

Also learned: `__TamaguiNativeView` is a local identifier, so grepping a
MINIFIED Release bundle for it false-negatives even on perfectly lowered
output. The minify-surviving sentinel is the hoisted style object, e.g.
`{width:20,height:20,backgroundColor:"rgb(99,102,241)",...}` from the bench
fixture's simple scenario.

## The fix (LANDED on this branch, commit a134e2c99e, pushed)

Plans are now generated against RAW module source and workers apply the edits
to `args.src` BEFORE their single user-Babel pass. The requirement that two
independent Babel invocations produce identical bytes is gone entirely, which
kills the whole defect class rather than chasing expo's option surface.
compiler-core already lowers raw TSX natively (see
`static-tests/tests/e3-lowerer.web.test.ts`), so this aligns Metro with the
compiler's native mode.

Changes, all in `code/compiler/metro-plugin` plus the evidence tool:

- `frontend.ts`: `#compileRecord` feeds raw source to the ProjectGraph
  (`input.source = source`); the user-Babel compile is kept only for import
  scanning. `compiledHash` removed from records.
- `compilerCache.ts`: schema v4 (old v3 dirs become unreachable, not merely
  stale, because the manifest path embeds the version). Entries and
  descriptors carry `sourceHash` only; `read(moduleId, rawSource)` guards on
  raw source hash; blob validation requires `plan.sourceHash === sourceHash`.
- `transformer.ts`: reads the cache BEFORE compiling, applies the plan to
  `args.src`, then runs user Babel once over the lowered source. Plan-miss
  warnings are narrowed to plan-eligible files (compiler source ext, not under
  node_modules, exists on disk) so bundler-injected polyfills and virtual
  modules stop producing noise. The relative-filename resolution from
  `2acce54e05` is retained. It is NOT dead code: workers still receive
  project-relative filenames and the cache is still keyed by absolute
  realpaths (the regression test covers it).
- `lowering.ts`: `applyMetroCompilerPlan` now applies edits to raw src,
  compiles the lowered source with the user transformer, and remaps AST
  locations back to original coordinates through a SINGLE trace map (the old
  double-map composition is gone).
- `verify-native-compiler-output.cjs`: reads the v4 cache dir (version taken
  from the metro-plugin dist, not hardcoded), drops the "re-derive the
  frontend's Babel approximation" step, applies plan edits to the raw corpus,
  and reports `planMatchesRawSourceHash` instead of `compiledHash` fields.
  NOTE: not yet executed end to end (needs the V2 arms' npm installs); run it
  as part of Release gate prep.
- Tests: `frontend.test.ts` reads the cache with raw source and adds the
  discriminating regression: a worker with DIFFERENT Babel options
  (`experimentalImportSupport: false`, so the fixture user plugin emits 33
  instead of 44) still gets a cache hit and applied plan. 4/4 metro-plugin
  tests pass. Monorepo typecheck passes (run
  `PATH="$PWD/node_modules/.bin:$PATH" ./scripts/typecheck.sh`; bare `tsc` on
  this machine is an ancient global and fails on @types/node).

### Coordinator premise challenges, resolved

1. Monorepo symlinks: `metroResolver.resolve()` calls
   `realpathSync(result.filePath)` BEFORE the `includes('node_modules')`
   external test, so symlinked workspace packages resolve into the graph.
   READ: the ios/v3 manifest from the failing run held 441 entries, 223 under
   `code/ui` and 206 under `code/core` (mostly `dist/esm/*.native.js`).
   External (real node_modules) stays out by design; provenance for external
   component modules works through `componentModules` resolved ids.
2. Cache key: platform is path-scoped (`<cacheRoot>/<platform>/v4/`), the
   manifest carries `optionsHash` over `{dev, hot, platform, entryFiles,
   transform}` plus `projectGeneration` (compiler package versions, config
   CSS, component modules, target, disablePartialExtraction). Engine/hermes
   deliberately does NOT need to be in the key anymore: Babel runs downstream
   of edit application, so the plan is independent of Babel options. Raw
   sourceHash guards each entry.

### Repro commands (acceptance flow, per a2943: export:embed, never runBuild)

```sh
cd code/comparisons/tamagui-bench-native-compiled
trash node_modules/.cache/tamagui; trash "$TMPDIR/metro-cache"
NODE_ENV=production CI=1 EXPO_NO_TELEMETRY=1 EXPO_PUBLIC_NATIVE_BENCH_BUILD_ID=probe \
npx expo export:embed --platform ios --dev false --minify false \
  --entry-file index.js --bundle-output /tmp/main.jsbundle \
  --assets-dest /tmp/assets --reset-cache
```

Then: `grep -c 'plan-miss' <build log>` must be 0, and the bundle must contain
the hoisted fixture style (`grep -c '"rgb(99,102,241)"' main.jsbundle` >= 1;
with `--minify false` also `grep -c __TamaguiNativeView` which was 20).

- Negative control (pre-fix code, READ): same command at `4ac01cd6e7` produced
  plan-miss `compiled-hash-mismatch` for native-compiled-bench.tsx, App.tsx,
  tamagui.config.ts, native-tamagui-config.ts and only 4 stray markers.
- Post-fix (READ): zero plan-miss, 20 `__TamaguiNativeView`, 15
  `__TamaguiNativeStyle*` hoisted styles, 13 `_withStableStyle`. The minified
  variant (drop `--minify false`) also ships the lowered fixture (style object
  survives minification; the identifier does not, see sentinel note above).
- Build logs from this session lived in the session scratchpad
  (`embed-nomin/`, `embed-fixed/`, `embed-min/` under
  `/private/tmp/claude-501/-Users-n8--worktrees-v3-engine-native/327cb1de-*/scratchpad`);
  they are session-temporary, so rerun the commands above rather than hunting
  for them.

### Web answer for a2943

Metro-web (expo web / Metro with `platform === 'web'`) shared the same
two-Babel-runs assumption and is fixed by the same change (same code path,
platform-scoped cache). The vite path applies lowering in-process without a
worker/hash split, so it never had this defect.

## T7 web benchmark validity (checked 2026-08-03, at a2943's request)

The campaign plan's T7 numbers (v3 compiled beats v2.4.6 compiled: group 19.3
vs 43.8, heavy 18.8 vs 24.9, animated 15.8 vs 21.5) are NOT invalidated by the
Metro delivery defect.

- Build flow (READ from `code/comparisons/output/benchmarks.json` metadata and
  `run-benchmarks.ts` / `tamagui-bench/vite.config.ts`): T7 ran 2026-07-19 on
  branch `v3/t7-benchmarks` at `398b93155b`, clean tree, production VITE
  builds; the v3 compiled arm used `@tamagui/vite-plugin` with `EXTRACT=1`.
  Vite applies lowering in-process with no worker/hash split, so the
  two-Babel-runs assumption that broke Metro delivery does not exist in that
  path.
- Internal control (READ from the retained JSON): v3 compiled vs v3 runtime
  mount means are 0.54 vs 9.18 (17x) on simple, 19.3 vs 48.1 (2.5x) on group,
  18.8 vs 30.6 (1.6x) on heavy, 15.8 vs 18.9 (1.2x) on animated. A
  broken-delivery arm reads ~1x against its own runtime (the native scar was
  0.91x), so the compiled arm demonstrably shipped lowered output.
- The v2 column in that run really was 2.4.6 (the harness's current source
  says 2.6.2; that arm was upgraded later, so do not cross-quote today's
  harness against T7's retained numbers).
- Standing caveat unchanged: T7 timings share the same machine-load softness
  as every retained timing (absolute values soft, direction sound). That
  caveat predates and is independent of the delivery defect.

## What is left on this lane

1. NOT DONE: re-run the W-B compiler-effectiveness gate (Release apps on the
   simulator, `run-native-v2-v3.ts --smoke`) to confirm V3 compiled clears the
   1.5x bar now that delivery works. Needs: prebuild + Release builds of the 4
   bench apps (V2 arms need their npm installs), `verify-native-compiler-output.cjs`
   for `--compiler-evidence`, simulator `25D3F3D4-10A1-46A0-88D0-5853D69159D3`
   (iPhone 16, iOS 26.5, recreated by a2943). TIMING RULE: message a2943 for a
   quiet machine window BEFORE taking any timing number; the 0.91x scar came
   from a 35%-idle machine.
2. Item 2 (theme values inlined into compiled native output): design settled,
   implementation NOT STARTED, no files touched yet. Replicate V2
   `extractToNative` (reference unpacked at the session scratchpad from
   `npm pack @tamagui/static@2` -> `package/src/extractor/extractToNative.ts`;
   re-pack if gone, it is v2.6.3). Mechanics mapped so far:
   - V2 splits `$`-prefixed values (`splitThemeStyles`), emits
     `theme.<key>.get()` inside `_withStableStyle(Component, (theme,
     _expressions) => [...], hasThemeKeys, hasMediaKeys)`, plain styles go to a
     StyleSheet.
   - v3 `_withStableStyle` (`code/core/web/src/_withStableStyle.tsx`) already
     supports `hasThemeKeys` + `useTheme()`; the compiler simply never passes
     it (compilerHost.ts ~2049 emits the wrapper with no flags).
   - The inlining mechanism: `resolveValues: 'except-theme'`
     (compilerHost.ts:1125) is a no-op because `resolveVariableValue`
     (`code/core/web/src/helpers/resolveVariableValue.ts`) has no
     'except-theme' branch; on native every Variable falls through to
     `valOrVar.val` (line 28). Theme lookups happen in `tokenVariable`
     (`code/core/web/src/helpers/directStyle.ts` ~392-438, theme fallback
     paths at 423-426 and 432-437); that is where provenance is known and
     where except-theme must keep the value symbolic. Other resolution sites:
     directStyle.ts:473 and :1046, propMapper.ts:101 and :336.
   - Then compilerHost native emission (`nativeStyle` at ~1732,
     `isSerializableNativeStyle` gate, static path at ~2057, dynamic path at
     ~1987) splits themed keys out of the JSON style and emits them as theme
     getter expressions with `hasThemeKeys: true`. The domTag native path
     (~1751) needs the same treatment.
3. Item 3 (conditional font variants, `local/dynamic-style-value`): NOT
   STARTED. Mechanism located: `supportsNativeDynamicStyles`
   (compilerHost.ts ~1548-1555) only admits `opacity` as a dynamic entry, and
   the whole element bails at ~1562 otherwise; V2 lowered ternaries per-branch
   (see the `case 'ternary'` handling in V2 extractToNative). Lower priority
   than 1 and 2.
4. Housekeeping: `plans/v3-engine-status-2026-08-03.md` item 1 and
   `code/comparisons/V3_BETA_MEASUREMENT_STATE.md` "compiled plans generated
   but never applied" should be updated to point here once the gate rerun
   lands real numbers.

## Landing state

- `a134e2c99e` is committed on `v3/engine-native-parity` and pushed. It is NOT
  yet on `v3-beta` (that worktree belongs to another lane; the sync lane is
  landing an 82-commit main sync into it). a2943 sequences the merge per
  decision 7 (one branch, everything lands on v3-beta).
- The two build-regenerated files that show modified in this worktree
  (`code/core/themes/types/generated.d.ts`, `code/tamagui.dev/tamagui.generated.css`)
  are NOT mine; do not commit them from this lane.
