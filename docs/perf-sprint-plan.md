# Tamagui Perf + Coverage Sprint Plan

## Summary

Coverage-gap-closure phase landed 9-of-9 tracks (no blocks): Tamagui moved from 79 utilities to roughly 88 on the cross-platform full+partial axis, lifting it further ahead of NativeWind v5 (74) and Uniwind (51). Bench infra now ships a 6th column — **Tamagui (runtime, 200x)** — running off the same `tamagui-bench` app at `EXTRACT=0` on port 9106, so the runtime baseline that the compiler bails to is finally measurable side-by-side with the compiled column. Profiler reference (`time\`...\``) is wired through `createComponent`, `getSplitStyles`, and `useThemeState`, dev-only, gated by `globalThis.time`, with an in-bench harness that auto-prints after the last render in a batch. Hard evidence on the runtime side: **~76-80% of dev-render time on the group/heavy deopt scenarios is the theme-hook chain (`useThemeWithState` → `useThemeState` → `useContext`) running once per Tamagui component, even when no `$`-token is touched.** The remaining hot bucket is `prop-media-classes-loop` building byte-identical CSS for every render. On the compiler side, the gating change that unlocks the `$group-*-hover` deopt is a single tighten in `createExtractor.ts:1531-1541` plus a parent-container CSS emit at `:1099-1115` — projected to drop group-hover from 396ms to ~20-30ms and heavy from 149ms to ~35-55ms, putting Tamagui at-or-near Tailwind parity on every web scenario.

## Coverage (what shipped this run)

All 9 tracks succeeded. None blocked.

| id | status | what changed | data.ts updated? |
|---|---|---|---|
| `tw_opacity_modifier` | shipped | `getSplitStyles.tsx` tw-mode parser handles `bg-blue-500/50` opacity suffixes; strips trailing `/N`, validates base, re-attaches so existing `getTokenForKey` opacity-modifier path applies it (color-mix on web, rgba on native) | yes (partial → full) |
| `safe-as-value` | shipped | Added `safe` as first-class inset/padding/margin value via `resolveSafeArea.ts` + `.native.ts` + wiring in `propMapper.ts`. Web emits `env(safe-area-inset-*)`; native reads `@tamagui/native/setup-safe-area`. Multi-edge props expand per-side. 5 unit tests + `SafeAreaValue` kitchen-sink usecase | yes (none → full) |
| `media-keys-motion` | shipped | `$motionReduce` / `$motionSafe` media keys built in. Web via existing matchMedia pipeline; native `NativeMediaQueryList` subscribes to `AccessibilityInfo.isReduceMotionEnabled` + `reduceMotionChanged`. Registered in `@tamagui/config` with `mediaQueryDefaultActive` for mobile-first SSR | yes (none → full) |
| `object-fit-image-forwarding` | shipped | `createImage.tsx` writes `objectFit`/`objectPosition` into style on native (RN 0.76+ reads `style.objectFit` natively). `expandStyle` already auto-maps `objectFit→resizeMode` for any styled component on native, so `data.ts` was understating coverage. `ImageObjectFit` kitchen-sink usecase added | yes (web-only → full / partial) |
| `text-overflow-ellipsis-native` | shipped | `$textOverflow="ellipsis"` maps to `numberOfLines={1}` + `ellipsizeMode="tail"` on Text on native. Excluded from `webPropsToSkip.native.ts`; mapping in `getSplitStyles` next to `userSelect→selectable`. `??=` lets explicit user props win | yes (web-only → partial) |
| `visibility-hidden-native` | shipped | `expandStyle.ts` native branch: `hidden` → `[['opacity',0],['pointerEvents','none']]`, other values stripped. `visibility: true` added to `nonAnimatableViewProps`. `VisibilityCase` smoke test asserts no presses reach hidden box | yes (web-only → partial) |
| `caret-color-cross-platform` | shipped | `@tamagui/input` `Input.native.tsx` intercepts `$caretColor` and forwards to RN TextInput `cursorColor` (Android) + `selectionColor` (iOS+Android). Same fix to v1 Input. Caller-provided `cursorColor`/`selectionColor` still wins | yes (web-only → partial) |
| `visually-hidden-primitive` | shipped | `@tamagui/visually-hidden` upgraded from opacity-hack to canonical Radix-style sr-only block: `position:absolute` + 1x1 + `clip-path:inset(50%)` + `whiteSpace:nowrap`, plus correct a11y props (web `aria-hidden=false`; native `accessible={true}`; Android `importantForAccessibility="yes"`) | yes (none → partial) |
| (9th) infra: runtime bench column | shipped | `tamagui-bench` URL-driven counts via `?scale=200&skip=group,heavy`; new bench entry in `run-benchmarks.ts` on port 9106 with `EXTRACT=0`. NaN-safe averaging emits `skip` cells | n/a |

No blocked tracks. The only honest cap: the runtime variant skips `group` + `heavy` at scale=200 because playwright's 180s `waitForSelector` ceiling is exceeded by per-render `getSplitStyles` on 3-4 components-per-item with `$group-*-hover` props. Compiled variant still runs all five at 500. Ratios for present scenarios are unaffected.

## Profiling findings (hard evidence)

Runtime bench at `?scale=50`, profiler injected via `globalThis.time` in `page.addInitScript`. Totals are summed across all components × mount+rerender.

### Top hotspots — getSplitStyles (group hover scenario, 356 runs)

| Rank | Span | Total ms | % | Where |
|---|---|---:|---:|---|
| 1 | theme hook chain (measured at `pre-theme-media` in `createComponent.tsx:673`) | 343.4 | 76% | `useThemeWithState` → 2x `useRef` (`useTheme.tsx:27-28`) → `useThemeState` → `useContext(ThemeStateContext)` (`useThemeState.ts:66`). Runs every render of every Tamagui component. |
| 2 | `prop-media-classes-loop` | 71.3 | 16% | `getSplitStyles.tsx:1607-1631`: per-prop `createMediaStyle(...)` (`createMediaStyle.ts:54`) + `addStyleToInsertRules` (`getSplitStyles.tsx:2540`) → `shouldInsertStyleRules` → `updateRules` + template-string `fullKey` construction |
| 3 | `use-children` | 15.0 | 3% | `React.createElement(elementType, viewProps, ...)` at `createComponent.tsx:1601` |
| 4 | `group-context` | 2.7 | 0.6% | `<GroupContext.Provider value={allGroupContexts}>` allocation (`createComponent.tsx:1659`) |
| 5 | `propsend-getCSSStylesAtomic` | 2.5 | 0.5% | `getSplitStyles.tsx:1996` — base-style atomization at end of prop loop |

### Top hotspots — getSplitStyles (heavy page scenario, 346 runs)

| Rank | Span | Total ms | % |
|---|---|---:|---:|
| 1 | theme hook chain | 294.9 | 80% |
| 2 | `prop-media-classes-loop` | 37.9 | 10% |
| 3 | `use-children` | 10.5 | 3% |
| 4 | `propsend-getCSSStylesAtomic` | 2.5 | 0.7% |
| 5 | `group-context` + `events-hooks` (tie) | 2.2 / 1.5 | 0.6% |

Heavy has 7 Tamagui Views per card vs 3 per row in group, so theme-hook-chain runs ~7x per row, but per-prop media loop has fewer per-component group-hover props than the simpler row.

### Key observation

**Tamagui pays ~1ms per component per render before `getSplitStyles` even starts, almost all in the theme hook chain.** That dominates the deopt gap to NativeWind/Tailwind. The `getSplitStyles` work that scales with `$group-*-hover` props is concentrated in `prop-media-classes-loop`, which runs every render and produces byte-identical CSS — the identifier is already content-hashed (`getCSSStylesAtomic.ts:78 simpleHash`), so cache-lookup short-circuit is feasible.

### Hook-by-hook static-skip analysis (per render of a plain `<View>`)

Outer hooks in `createComponent.tsx`:

| Hook | Always pays | Static-skip condition |
|---|---|---|
| `React.useId()` (L249) | dev only | already skipped in prod |
| `useContext(staticConfig.context)` (L285) | only if `context:` declared | already skipped for raw View |
| `useContext(ComponentContext)` (L289) | yes | needed for `inText` + animation driver. Make ref-eq cached read (~free) |
| `useContext(NativeMenuContext)` (L297) | native only | branchable |
| `useEffect` dev visualizer (L336) | dev only | dead in prod |
| `useContext(GroupContext)` (L398) | yes | **skippable** if styled() can prove no `$group-*` prop reachable and `'group' in props` is false |
| `useComponentState` (L424) | yes | inner: `useDidFinishSSR` + `useIsClientOnly` (both `useSyncExternalStore`), `useRef`, conditional `usePresence`, `useState`, `useCreateShallowSetState`. **Skip `useState`** entirely if statically no pseudo state, no hover/focus events, no animation, no `disabled`. Skip SSR hooks if `ssrSafe: true` (no className-strategy switch) |
| `useIsomorphicLayoutEffect` (L461, L498) | conditional | already gated; could hoist into animated-path |
| `useMemo(allGroupContexts)` (L509) | yes | already early-returns when no `groupName` |
| **`useThemeWithState`** (L675) | yes | **biggest skip target.** Inner: 2x `useRef`, `useThemeState` (`useContext` + `useId` + `useCallback(subscribe)` + `useSyncExternalStore` + `useIsomorphicLayoutEffect`), `getThemeProxied`. Skippable if styled() can prove no reachable token-resolving prop (no `$`-prefix value in any variant/default/inline prop, no `$theme-*` pseudo, no `transition`) |
| `useMedia` (L682) | yes | inner: `useRef` + `useSyncExternalStore`. Skippable if no `$sm/$md/...` prop reachable |
| `useSplitStyles` (L709) | yes | non-skippable when styles need resolution |
| `useAnimations` (L1083) | conditional | already gated |
| `usePointerEvents` (L1171) | web no-op | fine |
| 4x `useIsomorphicLayoutEffect` (L1194/1225/1258/1277) | mixed | last 3 ship in prod |
| `useEvents` (L1518) | native only | RNGH gestures |

For a `<View width={20} height={20} background="rgb(...)" />` on web in prod: ~14 hook calls, 3 of them expensive (`useComponentState`, `useThemeWithState`, `useMedia`). Static-skip cuts that to ~6 cheap calls.

## Compiler roadmap (the biggest wins)

### CSS-only variant extraction (the user's flagged moonshot)

The single highest-leverage compiler change: lift the `$group-*` / `$theme-*` inline-prop kill at `createExtractor.ts:1531-1541` and emit the equivalent CSS at compile time.

**Concrete spec:**

1. **Lift the `$group-*` / `$theme-*` inline kill.** `createExtractor.ts:1531-1541` currently routes any `$group-…` or `$theme-…` prop to `deoptProps` and bails. Replace with: extract the prop value into the atomic-CSS pipeline using the existing `createMediaStyle` helper (`code/core/web/src/helpers/createMediaStyle.ts:54-167`) which **already emits correct group CSS** at runtime — reuse it from compile time. Pass the parsed `{name, pseudo, media}` from `getGroupPropParts.ts`.
2. **Emit parent-container CSS at static time.** `createComponent.tsx:1099-1115` writes the runtime parent-container CSS; move that into the compile-time emit at `extractToClassNames.ts:189-237` so the parent `group="row"` literal becomes a static `container-name: row; container-type: inline-size;` rule, not a runtime register.
3. **Remove the `BailOptimizationError` throw.** `extractToClassNames.ts:197-202` currently throws on `$group-` keys — delete; route through the new emit path.
4. **Untilmeasured deopt.** If the parent (or one we're flattening with a `group=` attribute) has `untilMeasured`, deopt the children that target this group. The warning at `createComponent.tsx:1121` already flags this is narrow.
5. **Dynamic `group=` deopt for v1.** When `group={someProp}` is dynamic, keep current runtime path. The 80% case is static `group="row"` literals.

**Tests to add** (`code/compiler/static-tests/tests/babel.web.test.tsx`): invert tests at 391-460 (currently assert bail) to assert extraction. Add `group= with untilMeasured prop does NOT extract child group styles`.

**Expected bench impact (web, 500 items):**

| Scenario | Now | After fix | Why |
|---|---|---|---|
| Simple mount | 7.2 ms | ~7.2 ms (no change) | already fully flattens |
| Rich (pseudo) | already good | already good | hoverStyle/pressStyle already CSS on web |
| **Group hover** | **396 ms (19.4x)** | **20-30 ms** | every child becomes plain `<div>` with static className; no runtime groupContext, no useStyle hooks. Near-parity with Tailwind (18 ms), beats NativeWind (52 ms) |
| **Heavy page (150)** | **149 ms (13.6x)** | **35-55 ms** | group-hover is the dominant deopt today. `backgroundColor={color}` and `hoverStyle` already extract. 3-4x improvement |
| Animated spring | 35.5 ms | 30-35 ms | `animation=` must remain deopted; tiny win possible. Genuine animation-runtime overhead, out of scope |

**Risk + migration:** Real `$group-` usage in source (not types/dist) is concentrated in bench + kitchen-sink + core runtime. UI library packages don't actively use `$group-` in src — only generated `.d.ts`. Consumer apps using `$group-` see identical visual behaviour; just emitted at build time. Single risk = `untilMeasured` interaction (covered by deopt above).

### Implementation order

1. Land lift of `$group-*`/`$theme-*` gates (`createExtractor.ts:1531-1541`) + parent container CSS emit (`extractToClassNames.ts:189-237`). Unlocks bench scenarios that use inline `$group-X-hover:` attrs.
2. Invert tests in `babel.web.test.tsx`.
3. Re-run bench.
4. Land styled() variant pre-extraction (broader longer-tail win for real apps).

### Native compiler under-folds

`extractToNative.ts` shares `createExtractor.parse(...)` with web but **never sets `extractStyledDefinitions: true`** (`extractToClassNames.ts:108` for the contrast) and bails earlier on more props. The native runtime payload for a fully-flattenable tag is competitive (a `React.memo` wrapper indexing into a `StyleSheet`), but the gate to reach that path is too strict.

**Top 5 under-folded props:**

1. **Pseudo states (`hoverStyle`/`pressStyle`/`focusStyle`/`disabledStyle`)** — `createExtractor.ts:1095-1103` adds them to `deoptProps` when `!isTargetingHTML`; reinforced at `:2338-2342`; also skipped in styled-pass at `:719-724`. Fix: emit pseudo block as another row in the same `StyleSheet.create(...)`, add a thin `_withPseudoStyle(Component, {base, hover, press})` helper that owns gesture listeners and switches `style={[a, hovered && b, pressed && c]}`. `Pressable` already does this. Build-time half is trivial — just remove from `deoptProps` on native and route to a separate sheet row. Expected impact: largest single native deopt; 3-5x reduction on rich-mount.
2. **`styled(...)` definitions never pre-extracted on native** — `extractToNative.ts:148-189` never passes `extractStyledDefinitions: true`. Fix: pre-extract into same `__sheet` `StyleSheet.create(...)`. Runtime `styled` wrapper checks "do I have a precomputed sheet row?" — if yes skip `getSplitStyles` for base style, only merge runtime overrides. Reuse existing `onStyledDefinitionRule` callback.
3. **Media queries (`$sm`, `$gtMd`)** — `isValidStyleKey` returns false on native (`createExtractor.ts:335-337`); never seen as styles by extractor. The `_expressions` path at `extractToNative.ts:298-300, 386-399` CAN preserve them, but only after the tag passes the flatten gate — which it almost never does once a media prop is present. Fix: include media keys in `isValidStyleKey` on native and route through `_expressions`.
4. **`$theme-*` styles** — `createExtractor.ts:1535` inlines the prop and aborts flatten on native. Fix: emit as theme-conditional `_expressions` entry, mirroring the web `createMediaStyle(..., 'theme', ...)` path at `extractToClassNames.ts:206-218`.
5. **`$platform-ios/android/...`** — `createExtractor.ts:1567-1577` keeps these inline. Compile-time platform is fully known on native too. Fix: fold into `_expressions` or drop at build for non-matching platforms.

**Native bench harness plan:** add a Detox or Maestro-driven mount/rerender harness in `code/comparisons/tamagui-bench-native/`, run the 5 scenarios at 200 items, capture frame timings via `Performance.now()` from inside the bench app, and emit JSON the same shape as the web harness so the same renderer in `run-benchmarks.ts` can consume both. Initial target: iOS sim only; Android adds matrix complexity, defer.

### Other compiler ideas surfaced

- **CSS-only styled() variant classification.** When a variant's branches all resolve to extractable atomic styles (no `theme.get()`, no dynamic expressions), the variant becomes pure CSS classes keyed on prop value. Long-tail real-app win, after the group-hover fix lands.
- **Default-props folding when theme is involved.** `extractToNative.ts:1929-1934` sets `shouldFlatten = false` and re-inlines theme. Could fold the non-theme defaults and keep only theme keys runtime.

## Runtime moonshot — variant-split (Lane B)

### Restated design

Split `createComponent` into two component types at `styled()` time, chosen by static-skip analysis of the staticConfig:

- **Lean variant** — used when staticConfig proves: no reachable `$`-token (no theme dep), no reachable `$sm/$md/...` (no media dep), no pseudo state, no animation, no `'group' in defaultProps`, no `$theme-*` pseudo. This variant **skips** `useThemeWithState`, `useMedia`, and the `useState` inside `useComponentState`. Single shallow `useContext(ComponentContext)` for inText/animationDriver, single `useSplitStyles` for the inline props. ~6 hooks total instead of ~14.
- **Full variant** — current path. Used when any of the above conditions can't be statically proven.

Identity-stable hook count per component instance — selected once at `styled()` time, frozen on the StaticConfig.

### Prototype scope (smallest experiment to prove the win)

- Add a `lean: true` flag to `StaticConfig` (set from `styled()` analyzer).
- In `createComponent.tsx`, branch at module top into `createLeanComponent` vs `createFullComponent`.
- `createLeanComponent` is a fresh ~50-line function: `useContext(ComponentContext)` + `useSplitStyles` + `createElement`. No `useThemeWithState`, no `useMedia`, no `useComponentState`.
- Force-enable on the bench's simple-mount scenario (`tamagui-bench/src/index.tsx`) by hardcoding `lean: true` on the `View` used there.
- Measure runtime simple-mount: target sub-200x cost ratio at scale=200.

### Hydration analysis

Lean variant is `ssrSafe` by construction (no className-strategy switch, no animation, no pseudo) — `useDidFinishSSR`/`useIsClientOnly` are skippable. Server render and client render produce identical output. SSR risk = zero.

### Go/no-go criteria

- **Go**: lean variant reduces simple-mount + rich-mount runtime cost by ≥40% in the bench, with zero hydration mismatch warnings in dev, with all existing kitchen-sink tests still passing.
- **No-go**: any hook-count instability per instance (React errors), any SSR mismatch on a Tamagui Provider config, or <20% measured win (in which case the static-skip analysis is too narrow).

## Bench publish plan

- **Repo location**: `code/comparisons/` (already exists). HTML report at `code/comparisons/output/benchmarks.html` written by `run-benchmarks.ts --html`.
- **Deploy target**: Cloudflare Pages. The tamagui.dev infra already has a CF account; create a sub-project `tamagui-bench` pointed at `code/comparisons/output/`.
- **CI hook**: add a GH Actions workflow `bench.yml` that runs on PR + on main: `cd code/comparisons && bun run-benchmarks.ts --runs=3 --html`, then `wrangler pages deploy code/comparisons/output --project-name=tamagui-bench`. Cache the per-bench `node_modules` to keep run time reasonable. Average of 3 runs to stabilize.
- **Screenshot-friendly page**: the HTML renderer needs a polished layout — fixed-width table, all 6 columns visible without scroll at 1440px, color-coded ratio cells (green <2x, yellow 2-5x, red >5x), explicit "skip" cell rendering, a header block with run date, commit SHA, browser, and animation driver. Add an `og-image.png` capture of the page (puppeteer headless screenshot of `output/benchmarks.html`) so social shares show the bench inline.

## Sprint ordering (what to do next, in order)

Ranked by (expected benchmark impact) / (engineering cost). Numbers in parens are projected web bench changes vs current.

1. **CSS-only variant extraction — lift `$group-*` / `$theme-*` gates** (group hover 396ms → 20-30ms, heavy 149ms → 35-55ms). Cost: ~2 days. File:line spec in §Compiler. The single biggest measurable bench delta available.
2. **Runtime lean-variant prototype (Lane B)** (simple mount runtime ~17.6ms → ~9-10ms, rich similar). Cost: ~3 days. Validates the static-skip hook analysis. If go-criteria met, this is the path to drop compiler dependence for the 80%-case styled() component.
3. **Pseudo states on native — un-deopt `hoverStyle`/`pressStyle`/`focusStyle`/`disabledStyle`** (native rich-mount 3-5x reduction once the native bench exists). Cost: ~2 days. Single biggest native compiler win.
4. **createMediaStyle cache by identifier** — `Map<identifier|media|nega, MediaStyleObject>` keyed lookup at `createMediaStyle.ts:54`, hit from `getSplitStyles.tsx:1607-1631`. 50-70% off `prop-media-classes-loop` = ~35-50ms off group, ~20ms off heavy. Cost: ~half a day.
5. **Native bench harness** in `code/comparisons/tamagui-bench-native/`. Cost: ~2 days. Unblocks #3 visibility and all future native work.
6. **Bench publish (CF Pages + CI)**. Cost: ~1 day. Required to make the wins visible externally and prevent regressions in CI.
7. **styled() definitions pre-extracted on native** — pass `extractStyledDefinitions: true` in `extractToNative.ts:148-189` and write rows into `__sheet`. Cost: ~3 days. Longer tail, broader real-app benefit.
8. **CSS-only styled() variant classification on web**. Cost: ~3 days. Broader styled()-using app benefit but doesn't move bench numbers since the bench mostly uses inline props.

**Defer:**

- `useThemeWithState` fast-path (O1 from profile report) — superseded by Lane B prototype. If Lane B doesn't ship, revisit.
- Animation-runtime overhead. The 4.9x animated-spring gap is genuine driver work, out of scope.

## Open questions / risks

- **Dynamic `group={someProp}` semantics.** v1 keeps the runtime path. If consumers expect a static name and `someProp` resolves to a literal at build time, we miss extraction. Worth a one-pass propagation in babel before deciding to deopt.
- **Container-name collisions across files.** `container-name: row` in one file leaks into others with `group="row"`. Spec is fine because that's the existing runtime behaviour — but worth a kitchen-sink test asserting cross-file group naming.
- **`untilMeasured` interaction.** The deopt is identified, but the test isn't written yet — add as part of Track 1.
- **Lean-variant SSR.** Lean is `ssrSafe` by construction but a Tamagui Provider that switches themes mid-tree must NOT be inside a lean subtree. Need a build-time guard at `styled()` time: if any ancestor styled definition declares `theme: ...`, force `lean: false` for descendants. Otherwise hydration is silent breakage.
- **Native compiler tests.** No native compiler test fixture exists today equivalent to `babel.web.test.tsx`. Native work needs that scaffolding first or it's all-runtime-validated.
- **CF Pages bench publishing budget.** 3-run bench at 5 scenarios × 6 columns is ~5 minutes of CI per push. Cache the dev-server warmup state in CI to keep it under 4 minutes; otherwise main-branch pushes start backing up.
- **Profiler dead-code-elimination in prod.** All `time\`...\`` calls are gated `process.env.NODE_ENV === 'development' && time` so they DCE in prod — but the `globalThis.time` indirection means a bundler that doesn't fold the constant `process.env.NODE_ENV` check (e.g. an unconfigured Rollup) will keep the calls. Document in the bench README.
- **Bench scale=200 vs scale=500 honesty.** The runtime column at 200 isn't directly comparable to compiled at 500 — the ratio column makes this obvious but a casual reader of the table will miss it. Renderer needs a clear "n=" annotation per column.
