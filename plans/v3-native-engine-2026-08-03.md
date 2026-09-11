# v3 native engine (Unistyles-style ShadowTree registry), research 2026-08-03

Context: revisiting the Feb 2026 native style registry work (PR #3916, branch
`feat/native-style-op`, precursor `native-style-optimization-prototype`) as a
fresh design for v3. Owner direction: clean re-do with the old insights, not a
rebase.

## 1. Prior art status (checked 2026-08-03)

### Our old branch (PR #3916, last commit 2026-02-17, still open)

~7k lines: `@tamagui/native-style-registry` (Nitro C++ hybrid,
`HybridTamaguiShadowRegistry.cpp`), per-theme style matrix baked into compiled
output (`__styles`/`__themes` dedup), `_TamaguiView`/`_TamaguiText` that render
once via `useInitialThemeName()` and `link()` their ShadowNode, Theme wrapping
children in `ThemeScopeProvider`, a Unistyles-style Babel wrap-all-views
plugin, kitchen-sink benches + Detox test, and two plan docs
(`plans/native-style-optimization*.md` on that branch). Verified there:
optimized components stay at 1 render while regular Tamagui hits 400+ over
theme toggles. Known warts recorded in its own progress doc: a 100ms
`setTimeout` after `setTheme` to dodge React commits stomping native-set
props, theme matrix explosion (901 -> 144 after filtering component themes),
and both ShadowTree paths (0.81+ `updateShadowTree` and manual clone/commit)
maintained.

### Unistyles (v3.3.0, 2026-07-10)

Actively maintained on Nitro (bumped nearly every release, now 0.36.1).
Notable post-Feb work that maps to problems we hit: suspended-tree support and
shadow-node registration for suspended nodes (3.2.x), scoped-theme initial
render fixes, C++ runtime storage refactor, StrictMode theme-update fixes,
transformOrigin parsing for shadow tree updates. Translation: the ShadowTree
approach works in production but has a long tail of React-lifecycle edge cases
they are still paying down.

### Uniwind + Uniwind Pro (jpudysz + Hubert Bieszczad, uniwind.dev)

Free tier: fastest Tailwind bindings for RN, MIT, JS engine, build-time style
processing, claims ~2x NativeWind. Pro (paid license): "2nd gen Unistyles C++
engine" — zero re-render ShadowTree updates for 55+ props across 20
components, className-driven Reanimated 4 animations, NATIVE THEME TRANSITIONS
(fade/blur/slide/reveal between themes, no JS), group variants propagated
through the shadow tree, native safe-area insets, shadow-tree diagnostics
tooling. Update flow: runtime detects change -> recalculate affected styles ->
C++ applies mutations to shadow nodes -> atomic single-frame update. Two
documented unsupported components (InputAccessoryView: no shadow node;
TouchableHighlight: internal React state) fall back to a subscribing hook.
Docs: docs.uniwind.dev/pro/*.md. The interesting product signal: jpudysz put
the C++ engine behind a paid license, which says both "this is the valuable
part" and "this is expensive to maintain".

### NativeWind v5 (preview)

Rewrote as CSS-first on Tailwind v4, dropped its Babel plugin for a Metro
plugin, switched animations to Reanimated CSS animations, leans on RN 0.81
StyleSheet/layout changes. No ShadowTree/zero-re-render engine; not the
architecture to copy, but confirms the Metro-plugin + build-time direction.

## 2. Module system: Nitro (decided, low confidence it matters much)

The ShadowTree work itself is raw Fabric C++ regardless of binding layer; the
module system is just the doorway JS uses to reach it. Pick by friction for a
cross-platform C++ hybrid object:

- Nitro: C++-first HybridObjects, statically compiled JSI bindings, fastest
  calls (registry link/unlink is per-mount, so call overhead is on the mount
  path and does matter at list scale). Proven for exactly this use by
  Unistyles v3 and Uniwind Pro. Our Feb branch already generated the nitrogen
  glue. Cost: a `react-native-nitro-modules` peer dep and their release
  churn (Unistyles bumps it constantly).
- TurboModules: in-core, no extra dep, but codegen + C++ TurboModule
  boilerplate is clunkier for hybrid objects; the Feb branch started here and
  migrated away for a reason.
- Expo Modules: Swift/Kotlin-first DX, no code-gen typing, wrong shape for a
  shared C++ core.

Decision: Nitro, inside an OPT-IN package (working name
`@tamagui/native-engine`) that is never required — without it installed,
compiled output runs on the JS fallback below. Target new-arch RN 0.81+ only
(`UIManager::updateShadowTree`, RN core PR #50020) to keep the C++ small;
pre-0.81 keeps the JS fallback. Do not maintain the manual clone/commit path.

## 3. Current v3 state (this branch, READ 2026-08-03)

- The parity lane has already landed the V2-style theme split in
  `code/compiler/static/src/compilerHost.ts` (~1731-1792): themed keys are
  split out of the hoisted native style and emitted through
  `_withStableStyle(native, fn, hasThemeKeys, false)` (~2121). DOM-tag native
  output still bails on themed keys (~1786).
- `_withStableStyle` (`code/core/web/src/_withStableStyle.tsx`): memo wrapper,
  `useContext(ThemeStateContext)` always, `useTheme()` when hasThemeKeys,
  `useMedia()` when hasMediaKeys. So after V2 parity, every themed flattened
  component still costs a wrapper component + context read + theme
  subscription at mount, and theme switch re-renders all of them. That is the
  V2 ceiling; the native engine's whole point is going past it.
- Theme model: `code/core/themes/types/generated.d.ts` has ~130 themes (light/
  dark x inverse/accent/brand/red/yellow/green x level2-4 nesting), NO
  component themes (the Feb branch's 901-theme explosion is already half
  solved by v3 itself). But `@tamagui/theme` still ships
  `addTheme/updateTheme/replaceTheme/mutateThemes`, so themes are NOT closed
  at build time.
- Media: `useMedia` is a JS matchMedia shim over Dimensions on native;
  media-dependent compiled output goes through `_withStableStyle`
  hasMediaKeys, subscribing per component.
- Dynamic style entries: only `opacity` survives as a native dynamic entry
  (`supportsNativeDynamicStyles`, compilerHost ~1548); everything else bails
  the whole element to the runtime path. Engine coverage multiplies with
  compiler coverage, so widening this (item 3, conditional font variants etc.)
  raises the engine's payoff too.

## 4. Design deltas vs the Feb branch (what "clean re-do" changes)

1. SHIP THEME DICTIONARIES, NOT STYLE MATRICES. The Feb branch baked a
   per-theme resolved style object into every call site (`__styles = {light:
   {...}, dark: {...}, ...}` x 130 themes, deduped by alias). Instead: the
   engine holds the theme dictionaries once (serialized from config at
   startup; `addTheme/replaceTheme` update the registry, keeping dynamic
   themes working), and each view registers only `{styleKey -> themeKey}`
   (exactly the `themedStyleKeys` map compilerHost already computes today,
   plus the hoisted static style it already emits). C++ resolves value =
   themes[current][themeKey] at swap time, with sub-theme fallback
   (dark_blue -> dark) in one place. Kills bundle bloat, kills the matrix
   explosion, keeps runtime themes, and reuses the exact artifact the parity
   lane just built.
2. NO BABEL WRAP-ALL-VIEWS PLUGIN, no inlineRCT mode. That was Unistyles-shaped
   scope creep; v3's compiler already owns the transform and emits
   `__TamaguiNativeView`. Registry linking goes into that compiled path only.
3. COMMIT HOOKS, NOT setTimeout. The Feb branch's 100ms delay after setTheme
   is the tell that React commits and registry writes race. Unistyles solves
   it with ShadowTree commit hooks + commit traits (tag registry commits,
   re-apply registry-owned props when a React commit would stomp them). This
   is THE hard correctness problem; budget most of the C++ effort here.
   Study current unistyles `ShadowTreeManager`/commit-hook code, not the Feb
   branch's.
4. SAME COMPILED OUTPUT DRIVES BOTH MODES. `_withStableStyle` stays as the
   no-engine fallback: with the engine present, the wrapper skips useTheme and
   links the registry; without it (Expo Go, old RN, web) it subscribes as
   today. One compiler output, no fork.
5. MEDIA QUERIES IN THE ENGINE FROM DAY ONE. Register breakpoint-conditional
   entries (`{styleKey -> {breakpoint: value}}`) alongside themed keys; C++
   listens to dimension changes and swaps in the same atomic commit path.
   Unistyles does this; the Feb branch never got to it (its Phase 6 was
   untouched). This also feeds hasMediaKeys instead of per-component
   Dimensions subscriptions.
6. SCOPES = THEME NESTING. Keep the Feb branch's scopeId idea (it mirrors
   Theme nesting and Unistyles' ScopedTheme), but the scope's theme resolution
   lives in C++ with the fallback chain, not half in JS.

## 5. Fit verdict and sequencing

Worth doing, as the post-beta flagship native perf feature, not as part of the
current parity push. Reasons:

- The parity lane's `_withStableStyle` split fixes the beta blocker (frozen
  theme values) everywhere with zero native code. Land and measure that
  first; it is also the fallback layer the engine needs anyway, so nothing is
  thrown away.
- The engine attacks what remains AFTER parity: per-component theme/media
  subscriptions at mount and O(themed components) re-renders on theme/media
  change, plus Uniwind-Pro-style native theme transitions as a headline
  feature. That is a different, bigger prize than the current "V3 within a few
  percent of V2" goal.
- It is a real maintenance commitment: C++ across iOS/Android build systems,
  commit-hook correctness, suspended trees, StrictMode, per-RN-version churn.
  Unistyles' 2026 changelog is a preview of the tail. Opt-in packaging keeps
  that tail off the core install.

Suggested shape when picked up: `@tamagui/native-engine` package, Nitro, RN
0.81+ new-arch only, registry API roughly `configure(themes, breakpoints)`,
`link(shadowNode, staticStyle, themedKeys, mediaKeys, scopeId)`, `setTheme`,
`setScopeTheme`, `updateTheme`, dimension listener internal. Mine PR #3916 for
the nitrogen setup, podspec/CMake, ShadowNode-from-ref extraction
(`ref.__internalInstanceHandle?.stateNode?.node`), and the kitchen-sink bench
cases (`NativeStyleBenchmark` etc.), which port almost as-is.
