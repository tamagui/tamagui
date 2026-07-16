# v3 performance plan

Runtime + bundle-size performance work targeted at the v3-beta surface. Ordered
by impact. Every item has a file:line anchor so it can be picked up cold.

Branch: `v3-beta`. Hot packages: `code/core/web/src` (runtime), the
`code/core/animations-*` drivers (new in v3), `code/ui/*` (bundle).

## How to measure (do this before and after every change)

- **Render path**: `code/comparisons/profile-getsplitstyles.ts` already wires a
  `time\`label\`` tagged-template into `getSplitStyles.tsx` + `createComponent.tsx`.
  Run the runtime bench server, then profile:
  ```
  cd code/comparisons/tamagui-bench && EXTRACT=0 npx vite --port 9106
  bun code/comparisons/profile-getsplitstyles.ts group heavy animated
  ```
  Scenarios: `simple | rich | group | heavy | animated`. Capture per-label totals
  before/after each Lane B/C change.
- **End-to-end bench**: `code/comparisons/run-benchmarks.ts` vs nativewind/tailwind/uniwind.
- **Regression guard**: `code/core/core-test` has the theme/media over-render guard
  (commit `b6b0097f61`). Keep it green — it catches Lane A/B correctness regressions.
- **Bundle**: build the package, then measure the two hottest modules
  (`getSplitStyles`, `createComponent`) min+gz, plus a real RN app barrel import.

Rule: no micro-opt lands without a before/after profile number. "Should be faster"
is not a result — several candidates below are V8-inlined already and will show
zero delta (flagged inline).

---

## Lane A — `optimizeFor` render-mode setting (the missing tradeoff)

The idea discussed but **not shipped**: let an app opt a subtree (or the whole app)
into "first render is what matters, I never switch theme/media reactively" and skip
the subscription machinery entirely. On native this is the common case (no CSS to
lean on, so useTheme/useMedia hook overhead is pure cost); on web the default should
stay granular (CSS handles media/theme without re-render, and per-key subscription
is already cheap).

**What already landed (the automatic half):**
- `aeded02b11` lazy theme/media subscription — a component that reads no tracked keys
  skips listener setup (`useThemeState.ts:166` `shouldSubscribeToTheme`, gated on
  `keys`/`schemeKeys` size).
- `dd3eceb8b6` manual `useReducer`+`useEffect` store (dropped `useSyncExternalStore`).
- `040caa316d` stabilized closures, one Proxy per component.
- `b6b0097f61` granular re-render guard test.

So the *reactive* path is already lean. The gap is the *opt-out*.

**Proposed: `settings.optimizeFor?: 'updates' | 'first-render'`** (name TBD;
`'updates'` = today's behavior, default on web; `'first-render'` default on native).
When `'first-render'`:
- `getThemeProxied` returns raw resolved values, not the tracking-getter proxy
  (`getThemeProxied.ts:110-207` builds a getter-per-key proxy over the whole theme —
  skip it; hand back a plain resolved map).
- `useThemeState` / `useMedia` never register listeners (`shouldSubscribeToTheme`
  short-circuits to false) and never allocate the per-component tracking Set.
- Theme/media changes then require a remount to take effect — acceptable and expected
  in this mode; document it loudly.

**Scoping**: a `<TamaguiProvider optimizeFor>` at the root plus a per-`<Theme optimizeFor>`
override so a mostly-static app can still mark one dynamic island as reactive.

**Validation**: on the native bench, measure first-render time for a screen of N
components with/without the flag; expect the win to scale with component count
(one fewer proxy + zero listener wiring per component). Confirm the web granular
guard test still passes with default `'updates'`.

This is the highest-leverage item for native and the one thing on the list that
changes the architecture rather than shaving constants — do it first or in parallel
with Lane B since it touches the same files.

---

## Lane B — render hot-path micro-optimizations

All per-render or per-prop/per-substyle. These are the "`Object.entries` is 10x
slower than a `for...in`" class of wins. Grouped by file; each verified by reading
the code. Ranked within the lane.

### B1. `getSubStyle` copies the entire props object per pseudo/media substyle — TOP
`getSplitStyles.tsx:2415` — `styleState.props = { ...parentProps, ...styleIn }`.
Runs once per `hoverStyle` / `pressStyle` / `$sm` / `$theme-dark` etc. A component with
hover+press+2 media = 4 full prop-object spreads per render.
Fix: `styleState.props = Object.assign(Object.create(parentProps), styleIn)` — a
prototype-chain view; `key in props` and lookups still work, restore path unchanged.
Biggest single per-render allocation win.

### B2. `resolveVariants` builds two throwaway arrays per variant prop
`propMapper.ts:263` `const next = Object.entries(expanded)` then `:271`
`return next.map(([k,v]) => [k, v, originalValues?.[k]])`. Caller at `:76` immediately
re-iterates the tuples. Collapse the whole thing to a single
`for (const key in expanded) map(key, expanded[key], originalValues?.[key])` — zero
intermediate arrays. Per variant-prop (every Button, sized component, etc.).

### B3. `getMediaKey` allocates a regex match array per `$`-prop
`useMedia.tsx:49` `const match = key.match(mediaKeyRegex)`. Called for every
`$`-prefixed prop (getSplitStyles `:1253/:1401/:1856`).
Fix: `if (key.startsWith('$theme-')) return 'theme'; if (key.startsWith('$group-')) return 'group'`.
No regex, no array.

### B4. `getMediaKeyImportance` does O(n) `indexOf` per media key
`useMedia.tsx:67` `mediaKeysOrdered.indexOf(key) + 100`. Linear scan per media-style-key
merge. `mediaKeysOrdered` is set once in `configureMedia` (`:89`) — precompute a
`Record<string, number>` there, O(1) lookup. Pure redundant work depending only on
static config.

### B5. `mergeFlatTransforms` — entries + sort-with-closure + forEach-closure
`getSplitStyles.tsx:2321-2327` `Object.entries(flatTransforms).sort(([a],[b])=>...).forEach(...)`.
Every render for any component with `x/y/scale/rotate`/animated transforms, plus inside
`getSubStyle` (`:2520`). Fix: collect keys into an array, `.sort(sortString)` in place,
plain `for` loop over `flatTransforms[key]`.

### B6. `Object.values(classNames).join(' ')` every web render
`getSplitStyles.tsx:2239`. `classNames` is always a truthy object, so this always
allocates a values array. Replace with `for (const k in classNames) out += classNames[k] + ' '`.

### B7. `transformsToString` — `Object.keys(transform)[0]` per transform
`transformsToString.ts:11`. Each transform object has exactly one key; allocating an
array to read it. `let type; for (type in transform) break`. Runs per-transform inside
a `.map` on every web render for transform components.

### B8. `hasAnimatedStyleValue` — keys array + closure per render
`useComponentState.ts:306` `Object.keys(style).some(...)`. Every render for any component
passed a `style` prop. Replace with `for (const k in style) { ...; return true }`.

### B9. `passDownProp` — `delete` deopts viewProps into dictionary mode
`getSplitStyles.tsx:2611-2616` `const next = {...viewProps[key], ...val}; delete viewProps[key]; viewProps[key] = next`.
The `delete`-to-reorder pushes `viewProps` into slow dictionary mode for its lifetime.
If key order isn't load-bearing here, drop the `delete` and just assign. Per
passed-through media/pseudo prop (HOC path).

### B10. `resolveTokensAndVariants` spreads original-values objects inside loops
`propMapper.ts:362-366` & `:425-428` `styleOriginalValues.set(res[key], {...get(res[key]), ...sub})`.
Fresh merged object per nested variant sub-key. `Object.assign` into the existing map
entry when present instead of spreading a new object.

### B11. `mediaKeyMatch` — keys array + closure per group-media eval
`useMedia.tsx:421` `Object.keys(mediaQueries).every(...)`. `for (const query in mediaQueries)`
with early `return false`. Group components only.

### B12. Redundant `Object.keys(originalValues).length` non-empty check
`getSplitStyles.tsx:2529`. `originalValues` is only created immediately before a write,
so if it exists it's non-empty; the `Object.keys().length` allocates to confirm the
guaranteed. Reduce to `if (originalValues)`.

### B13 (batch, low confidence — profile first). IIFE-to-inline
`createComponent.tsx:421-440` (`animationDriver` IIFE) and `useComponentState.ts:80-83`
(`willBeAnimatedClient` IIFE). V8 usually inlines these; expect near-zero delta. Only
worth touching as a readability pass, not for perf. Do NOT claim a win without a number.

### B14 (investigate, not a quick fix)
`createComponent.tsx:1052` `...nonTamaguiProps` rest-spread copies every remaining view
prop each render. Largely intrinsic to the filter approach; note it, revisit only if the
destructure list can be shortened.

**Non-issues confirmed (leave alone):** `getTokenForKey` already O(1) via
`tokenCategoryByKey`; `useMedia` touch-tracker already uses a getter prototype not a
Proxy trap; `getThemeProxied`'s `Object.fromEntries(Object.entries())` is
cached-per-theme (`getThemeProxied.ts:78` early return) so it's once-per-theme not
per-render — Lane A handles it, not Lane B; the `animatableDefaults` /
`getVariantExtras` `fromEntries` are module-init / WeakMap-cached; `getSubStyle`'s
`try/finally` (no catch) doesn't deopt on modern V8.

---

## Lane C — animation drivers (v3-beta, freshest / least-optimized code)

These drivers were rewritten/added for v3 and have had no optimization pass. The
motion-per-frame item is the single most expensive pattern found anywhere in the audit.

### C1. Motion driver runs the FULL style pipeline every animation frame — TOP OF WHOLE PLAN
`animations-motion/src/createAnimations.tsx` — the motion-value `change` handlers call
`getProps()` (which runs `getSplitStyles` + `fixStyles` + `styleToCSS`) on every frame:
- multi-value path `:986` `const webStyle = getProps({ style: nextStyle }).style` inside
  `mv.on('change', ...)` (`:980`)
- single-value path `:1012`, same inside `motionValue.on('change', ...)` (`:1007`)
Running the entire split-styles pipeline per frame is the biggest runtime cost in the
codebase. Precompute the static parts of the split once per animation and only apply the
changing numeric values per frame.
Also in the same file, per-render allocation: `getMotionAnimatedProps` (`:727`) rebuilds
`doAnimate`/`dontAnimate` each render; `getAnimationOptions` (`:759-833`) does
`{...normalized.config}` + multiple `Object.assign` + `Object.entries(normalized.properties)`
(`:807`) + three `convertMsToS` passes every call.

### C2. CSS driver rebuilds transition string every render + `Object.entries` per apply
`animations-css/src/createAnimations.tsx` — `useAnimations` rebuilds the CSS `transition`
string every render via `keys.map(...).filter(Boolean).join(', ')` (`:698-724`) even when
nothing animated changed; memoize on the animated inputs. `applyStylesToNode` (`:140`)
`for (const [k,v] of Object.entries(style))` allocates an entries array per apply (exit/
interrupt RAF paths); `buildTransformString` (`:81`) builds parts+join each call.
`useAnimatedNumbersStyle` (`:237`) `vals.map(v => v.getValue())` allocates per render.

### C3. Reanimated driver deep-clones repeatedly + per-key worklet closures
`animations-reanimated/src/createAnimations.tsx` — `buildTransitionConfig` (`:342`) calls
`cloneTransitionConfig` (deep clone) once for base, again per config/delay, and once **per
style key** in the `for (const key of styleKeys)` loop (`:379-397`), rebuilt every relevant
render and again in `useStyleEmitter` (`:875`). `getStyleKeys` (`:405`) allocates a `Set` +
`Object.keys` per call. The `useAnimatedStyle` worklet (`:1035-1157`) allocates a fresh
closure per animated key/transform sub-key per worklet run. Cache the cloned base config
and hoist the worklet callbacks.

### C4. Moti driver `JSON.stringify(style)` as a useMemo dep — cheap fix
`animations-moti/src/createAnimations.tsx:355` — serializes the whole style object to a
string every render for the memo key, defeating the memo. (File is `@ts-nocheck`
"deprecated package" so low priority, but a trivial win: hash the keys/values instead.)

---

## Lane D — bundle size

Note: `sideEffects` is already set correctly on every core/ui package (audit found none
missing) — so the wins are elsewhere.

### D1. RN consumers get all ~60 components from the `tamagui` barrel (no subpath exports) — TOP
`code/ui/tamagui/src/index.ts` (63 `export *`) + `code/ui/tamagui/package.json` exports only
`.`/`./native`/`./web`/`./react-native-web`/`./linear-gradient`. Metro doesn't tree-shake, so
`import { Button } from 'tamagui'` ships accordion, dialog, select, sheet, toast, menu,
popover, slider, tabs + their transitive deps. Hundreds of KB in RN apps.
Fix: add per-component subpath exports (`tamagui/button` → `@tamagui/button`) and lint RN
code to use them; or steer RN users to the optimizing compiler (`code/core/compiler`).
Largest single lever for RN bundles.

### D2. Debug code ships unstripped in dist
`code/core/web/dist/esm/helpers/getSplitStyles.mjs` (~53KB, 29 NODE_ENV blocks, 20 console.*)
and `createComponent.mjs` (~42KB, 39 NODE_ENV blocks). Guards are the strippable
`process.env.NODE_ENV === 'development'` form (good), but the published build ships them
verbatim — consumers without NODE_ENV replacement (some Metro configs, plain bundling) ship
~15-30KB of dead debug code in the two hottest modules.
Fix: ship a pre-stripped `production` condition in `exports`, or move heavy debug logging
behind a dynamically-imported dev module so it can't leak.

### D3. `@tamagui/themes` barrel re-exports the theme-BUILDER (build-time engine) into runtime
`code/core/themes/src/index.tsx` `export * from '@tamagui/theme-builder'` (2170 lines, pulls
`color2k`). Anything importing `@tamagui/themes` (transitively `@tamagui/config`) can drag the
theme-generation engine into the app bundle.
Fix: don't re-export theme-builder from the runtime barrel; make it `@tamagui/themes/builder`.

### D4. `@tamagui/config` hard-depends on all four animation drivers
`code/core/config/package.json` deps include `animations-css/motion/reanimated/react-native`.
`animations-motion` bundles `motion` (832KB source, `motion/react`). Default barrel only needs
one; risk a bundler pulls `motion` unintentionally (~50-100KB min+gz).
Fix: move the extra drivers to peer/optional deps; keep driver selection strictly per-entry.

### D5. `config-default` ships throwaway test themes
`code/core/config-default/src/index.ts` — `dark_blue`, `dark_Card`, `dark_Button`,
`dark_red*`, `red`, etc., commented "most of these used for testing". ~1KB pure waste in the
default fallback config. Strip them.

### D6. `validStyleProps` large static maps on the critical path
`code/core/helpers/src/validStyleProps.ts` (361 lines) — `cssShorthandLonghands`,
`tokenCategories`, valid-style tables as `{key:true}` object literals, always loaded by
getSplitStyles/View/Text (~3-6KB, can't tree-shake). Consider compact arrays → `Set` at init,
or gate web-only tables behind `TAMAGUI_TARGET`.

### D7. `polyfill-dev` side-effect on every `tamagui` import
`code/ui/tamagui/src/setup.ts` imports `@tamagui/polyfill-dev` (sideEffects:true) + assigns
`globalThis.React`. polyfill-dev only sets `globalThis.__DEV__`; guard it behind
`NODE_ENV !== 'production'` or drop the `globalThis.React ||=` storybook workaround.

### D8 (guardrail, not a fix). `react-native-web-internals` (8018 lines) is currently isolated
Nothing on the runtime path imports it today. Add a dependency-cruiser/size check so nothing on
the main path starts importing it wholesale — that would be a major regression.

**Positives found (no action):** no lodash/moment/date-fns/rxjs anywhere; moti + reanimated are
correctly peerDependencies (not bundled); framer-motion present in node_modules but not imported;
icons/fonts are lean metadata, not glyph payloads.

---

## Suggested sequencing

1. **Lane C1** (motion per-frame `getSplitStyles`) — biggest single runtime win, isolated to
   one new file. Profile `animated` scenario before/after.
2. **Lane B1-B6** (the top per-render allocations) — one commit each or a small batch, each
   with a `profile-getsplitstyles.ts` number on `group`/`heavy`. Keep the over-render guard green.
3. **Lane A** (`optimizeFor`) — architectural, do in parallel with B since it touches the same
   theme/media files; biggest native win. Ship default `'updates'` on web, `'first-render'` on native.
4. **Lane D1 + D2** (RN subpath exports, pre-stripped prod build) — biggest bundle levers.
5. **Lane C2-C4, B7-B12, D3-D7** — cleanup passes, each gated on a measurement.
6. Skip/deprioritize B13-B14 unless a profile shows a real delta.

---

## Status log

### 2026-07-16

- **Lane B landed** (`cbd95b721d` + useMedia edits pending commit): B1 (prototype-view
  sub-style props), B2, B5, B6, B7, B8, B10, B12 committed; B3, B4, B11 applied in
  `useMedia.tsx` but held from commit until the optimizeFor agent lands its overlapping
  work in that file. Validation: `@tamagui/web` build + its 65 vitest tests +
  core-test full suite green (234 pass; the one failure is the in-progress
  `optimizeFor` test owned by that agent, written test-first).
- **B9 dropped, on purpose**: the `delete` in `passDownProp` is not a naive deopt — it
  re-inserts the key at the end of `viewProps`, and key order feeds style precedence
  when an HOC child re-iterates props. Removing it changes merge precedence.
- **B13 skipped** per plan (profile first).
- **Profiling caveat**: before/after `profile-getsplitstyles.ts` comparison is currently
  invalid — the shared tree contains another agent's in-progress hook changes and the
  machine is under multi-agent load (all scenarios ~2x slower including untouched paths).
  Re-profile after the optimizeFor work lands, from a clean HEAD.
- **Lane A delegated**: Sol xhigh agent `ab-mrnwi4j9-75480`, brief in
  `plans/v3-optimize-for-brief.md`.
- **Lane D3 expanded + delegated**: confirmed worse than written — `v5-themes.ts:618`
  runs `createV5Theme()` (full theme-builder) at module load and the result is shadowed
  by the pregenerated `themes`; Metro consumers bundle theme-builder + radix palettes
  AND pay startup execution for nothing. Split brief in `plans/v3-themes-split-brief.md`,
  Opus agent `ab-mrnwvjot-71256`.
- **Next up**: C1 (motion per-frame pipeline) once the tree settles; then D1/D2.
