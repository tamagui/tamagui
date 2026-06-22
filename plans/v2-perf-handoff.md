# v2-perf — Native Perf — Handoff Doc

Owner: Nate. Live branch: `v2-perf`.

This is a working handoff. Update the **Status** + **Next** sections as you go.

---

## 🎯 GOAL PIVOT (2026-06-21): the goal is the COMPILER, and it must BEAT NW + Uniwind

Nate's decision after working through the architecture: **runtime-within-10% is the
wrong goal** (runtime resolves arbitrary styles per render — strictly more work
than a className lookup — so it can't match NW/Uniwind; that's the cost of full
runtime dynamism, see the Architectural assessment below). **The real race is
Tamagui-COMPILED vs NativeWind vs Uniwind, and the target is to BEAT both on every
scenario.**

Why compiled can win:
- **NativeWind / Uniwind** = build-time Tailwind **stylesheet** generation +
  **runtime** `className → style` resolution (`cssInterop` for NW; a Metro plugin +
  Tailwind v4 engine + thin runtime for Uniwind). They still pay a per-element
  runtime resolution tax, just a lean one. (Uniwind is faster than NW = leaner
  runtime, not a different category. Both: class vocabulary fixed at build time,
  can't make a class from a runtime value.)
- **Tamagui compiled** (`@tamagui/babel-plugin`) = **inlines the resolved style
  object directly into the element** at build time → near-zero runtime resolution
  for the static parts. Strictly less runtime work than a className lookup → should
  beat them. Already beats NW on simple (compiled 29.3 vs NW 41.1, prior session).

**The work: get the compiled column measured and faster than NW + Uniwind on
simple/rich/group/heavy/animated.** Runtime stays "as lean as possible" (Option 1
shipped) but is no longer the 10% target.

### Bench is fixable — it was a stale Metro cache, not a real break

Both native benches were crashing on Hermes with
`ReferenceError: Property 'addEventListener' doesn't exist` (web-only code from
`createComponent.tsx:123-125`, which is DCE'd in the native build but present in
the web build). Root cause: a **stale Metro cache** captured a bundle that resolved
`@tamagui/*` to their **web** builds (`index.mjs`) — likely while `bun run watch`
had the native dist mid-rebuild. Proof: the runtime bench's first load hit a stale
1146-module bundle and crashed, but after Metro rebuilt fresh (1307 modules) it ran
fine and produced results. All of `tamagui` / `@tamagui/core` / `@tamagui/web`
DO have correct `react-native` → `index.native.js` exports; package exports are on.

**Fix = clear the Metro cache before measuring** (`expo start --clear` prewarm, or
add `--clear` to the harness `startMetro` for cold runs). The harness's silent
"TIMEOUT" on all scenarios was the stale-bundle crash poisoning the first load while
the fresh rebuild outran the per-scenario deadline. A pre-flight canary (load one
scenario, confirm a POST arrives) before a full run would catch this.

**ROOT CAUSE FOUND + FIXED (2026-06-21).** It was NOT extraction/fallback — it was an
upstream **tamagui-build** bug: the native ESM build leaves SOME relative imports
**unresolved/extensionless** (`createComponent.native.js` → `from "./config"`,
`index.native.js` → `export * from "./createComponent"`), while the web build resolves
them (`./createComponent.mjs`). Bare imports then resolve to `.mjs` (WEB) because Metro's
sourceExts order puts `.mjs` before `.native.js`. So **both** native benches were bundling
the web `@tamagui/web` (96 web `.mjs` vs 1 native module) — crashing on `addEventListener`
and, when not crashing, measuring web code on native (⇒ all prior native numbers invalid).

- **Bench workaround (committed `31f01dd473`):** `config.resolver.sourceExts = [...filter
  (e=>e!=='mjs'), 'mjs']` in both `tamagui-bench-native*/metro.config.js`. Verified: bundle
  now has 0 web `.mjs`, 103 `.native.js`, 0 bare `addEventListener`.
- **The real upstream fix** (fix tamagui-build so native imports are fully resolved) is
  documented in `docs/v2-perf-followups.md` under "🚨 CRITICAL UPSTREAM BUG". Once fixed,
  delete the bench sourceExts workaround.

### Next (for the compiled-beats-them goal)
1. Measure **compiled vs NW vs Uniwind** on all 5 scenarios, cache cleared,
   under quiet load (check `pgrep -alf run-benchmarks` + `uptime`). Establish the
   real gaps.
2. Where compiled trails, inspect the **extracted output** (`@tamagui/babel-plugin`)
   — what runtime work survives extraction (theme/media/variant fallbacks, the
   `createComponent` wrapper) that NW/Uniwind don't pay. That residual is the target.
3. Consider whether the compiled wrapper can shed more of `createComponent` for
   fully-static extracted components (the part that's safe to skip when the plugin
   proved no dynamic props).

---

## SESSION 2026-06-21 (cont.): ×RN methodology + partial-flatten win + folding limits

### Measurement: the ×RN ratio is the real metric (absolute ms is 2× noisy)

iOS-sim absolute mount ms swings ~2× run-to-run under host load (compiled rich
measured 117ms / 163ms / 273ms across runs of the *same* code). Fix (Nate's call):
`run-benchmarks-native.ts` now keeps ONE vanilla-RN metro up the whole session and
measures the RN baseline **interleaved per run** (right after each framework run,
matched host load). It reports **`×RN` = framework ÷ vanilla-RN**, which cancels the
drift. `BENCH_CLEAR=1` forces a cold metro rebuild so a freshly-built compiler is
actually applied. The profiler timer (`@tamagui/timer`) was also fixed: it routed
inter-render idle gaps into a `~gap (ignore)` bucket (the `theme-prep-uses` 300ms
"artifact" was inter-component React reconciliation being attributed to the first
marker of each render — now excluded).

### Authoritative baseline (×RN mount, --runs=5, interleaved)

| scenario | TG runtime | TG compiled | NativeWind | **Uniwind (target)** |
|---|---|---|---|---|
| simple | 4.78 | **1.02** ✅ | 1.76 | 1.26 |
| rich | 4.26 | 6.95 | 1.44 | 1.15 |
| group | 4.24 | 2.74 | 1.84 | 1.47 |
| heavy | 4.31 | 4.08 | 1.51 | 1.25 |
| animated | 3.42 | 4.18 | 1.51 | 1.19 |

Uniwind is the bar (closest to raw RN, ~1.1–1.5×). simple already wins.

### SHIPPED: partial-flatten on native deopt (commit `perf(compiler): partial-flatten…`)

In `createExtractor` `!shouldFlatten` branch (native): even when an element must stay
on the runtime path (pseudo/group/dynamic), pre-merge its **pure-static** style props
into one `style={…}` so the runtime skips its per-prop loop for them (the dominant
deopt cost on RN). Theme tokens (`$…`) + dynamic props stay **inline** (runtime
resolves them → theme/media switching unaffected); dead native `hoverStyle` dropped.
Guard: a `$`-token-string check keeps theme values out of the static object (no
hardcoding). Result (×RN mount, runs=5): **rich 6.95→3.64, heavy 4.08→2.32,
group 2.74→2.14, animated 4.18→3.51.** Validated: `flatten.native`/`babel.native`
tests pass (+2 new tests), web extract unaffected, over-render granularity test green.

### Why the rest is HARD/RISKY (do NOT fold these naively)

- **rich / animated still ~3.5× because the press/animation machinery can't be
  folded away safely.** `eventHandling.native.ts` press is battle-hardened: RNGH
  `Gesture.Manual()` + `manualActivation` for press arbitration (NestedPressExclusive
  so a pressStyle child doesn't steal a real-handler ancestor's press), Android-freeze
  workarounds, Fabric/Paper responder-claim differences, ScrollView-termination
  handling. A `Pressable`-based `_withPseudoStyle` WOULD regress these. Folding press
  faithfully means reusing this exact machinery ≈ a slim createComponent.
- **group / heavy ~2.1–2.3× is dominated by the theme-subscription mount cost**
  (`theme-prep-uses`, ~600 themed components incl. `_withStableStyle` children each
  calling `useTheme`). That IS the granular-update feature Nate said to protect.
  The outers deopt on `group=`; folding them needs cross-element analysis ("this
  group has only dead-hover descendants → drop `group=` on native") — risky (a
  missed live `$group-*-press`/spread breaks group-press).
- Skipping unused theme/media/event hooks (the `data-disable-theme` style flag,
  already wired on web) is only ~9–19% and doesn't make any scenario win.

### Follow-ups (each needs careful correctness work, not a quick change)

1. `_withPseudoStyle` press fold for press-only leaves — must REUSE
   `useEvents`/`wrapWithGestureDetector`, validate with Detox press tests.
2. Cross-element group analysis to drop dead-hover-only `group=` on native.
3. Enable `data-disable-theme`/`-media`/`-events` flags on native (compiler emits,
   createComponent gates the hook on the stable prop — pattern already proven by
   `_withStableStyle`'s `hasThemeKeys ? useTheme() : null`).

---

## Goal

Tamagui **runtime** native perf within **10%** of the best **styling library**
on every benchmark metric (simple/group/heavy/animated × mount/rerender). The
bar is **NativeWind v5 / Uniwind** — whichever is faster on each metric. The
hard problem is runtime.

**Raw React Native (`rn-bench-native`) is NOT the target — it is a reference
floor only.** Hand-written `StyleSheet` does zero per-render style/theme
resolution, so no runtime styling library (Tamagui, NativeWind, or Uniwind)
can match it; chasing raw-RN parity is chasing an impossible bar. The `rn`
column exists to show how much headroom the *whole styling-lib category* spends
vs raw RN — it is informational, never a parity goalpost. When computing the
"best framework" 10% window, **exclude the `rn` column and Tamagui's own
columns**; compare only against NativeWind v5 and Uniwind.

The compiled column already beats NW v5 by ~29% on simple, so compiled simple
is solved. The open problem is the **runtime** column.

Benchmarks: `code/comparisons/run-benchmarks-native.ts`. iOS sim via Expo Go.
Median-of-3. Reference baseline: `code/comparisons/output/benchmarks-native.json`.

Best styling-library on iOS (NW v5 median-of-3 from baseline JSON; re-check
Uniwind per-metric since it can be faster on some scenarios):
- simple   mount 41.1 / rerender 48.4
- rich     43.3 / 47.9
- group    170.6 / 173.1
- heavy    94.7 / 93.8
- animated 44.6 / 47.6

10% windows we need to land in:
- simple   ≤45 / ≤53
- rich     ≤48 / ≤53
- group    ≤188 / ≤190
- heavy    ≤104 / ≤103
- animated ≤49 / ≤52

---

## Hard Constraints

These are non-negotiable. The previous broken moonshot (commit 2d556e3ee7,
reverted at 84e32eb971) was killed because it traded granularity for raw mount
perf — exact words: "now we optimized for raw render perofrmance but at the
cost of granular re-rendering."

1. **Preserve granular re-rendering.** Only components whose tracked theme/
   media keys actually changed should re-render. Test:
   `code/core/core-test/themeMediaOverRender.web.test.tsx` — must stay green.
2. **Same-tick batching** is required (no torn frames where some components
   render with old theme and others with new in the same paint). `useReducer`
   in normal mode satisfies this. Do NOT wrap subscribers in
   `startTransition`.
3. **One path, no fallbacks.** Don't add toggle env vars to switch between
   implementations. Pick one path and replace.
4. **Rules of hooks satisfied per call-site.** Conditional skipping via flags
   like `cascadeOnChange`/`forThemeView` is fine when the flag is stable per
   call-site (each call-site passes a constant — verified for the cascade
   skip).
5. **No release without explicit user permission.** See CLAUDE.md §"Upstreaming
   vs releasing." Editing source + committing on this branch is encouraged.
   `bun publish` / `npm publish` / release script — not without a sentence
   from the user that means "publish this now."

---

## What's Already Shipped (since the revert 84e32eb971)

Commit chain on `v2-perf`:
- `9994216da8` — over-render safety test (catches the broken-moonshot regression)
- `6688c9019a` — drop `useId` from per-component theme path; counter-based ids
- `c2f06098a6` — manual `useReducer`+`useEffect` subscribe replaces
  `useSyncExternalStore` for theme+media; merged `keys`/`schemeKeys` `useRef`s
- `40d07e1773` — hoist `setStateShallow` onto `stateRef`; drop `useCallback`
- `b6cfe2f9ba` — skip cascade-effect hook for leaf components
  (`cascadeOnChange`/`forThemeView` flag — only `<Theme>` installs it)
- `a96195d7b5` — `useMedia` Proxy → shared getter-prototype (Hermes inlines
  getters; Proxy trap was interpreted)
- `a79dd60cea` — compiled-native bench column (babel-plugin extraction)
- `b0030550c1` — **lazy theme/media subscription** (Option 1): the per-component
  listener is only registered when the component actually reads a tracked theme
  key / has an enabled media context. Components that read nothing never join
  `listenersByParent`. Rules of hooks intact (hook always called; gate is inside
  the effect). **Bench-neutral on the measured mount/rerender numbers** — the
  subscription runs in a passive `useEffect`, which fires *after* the bench's
  `useLayoutEffect` measurement window (App.tsx:246) closes. Its real value is the
  unmeasured granular-theme-change case (fewer subscribers) + smaller listener
  maps. Added 3 lifecycle tests to `themeMediaOverRender.web.test.tsx`
  (dynamic-subscribe, renderVersion churn, sibling-unmount).
- `d58bdf86a2` — extend native dead-hover skip to group-hover media keys.

All preserve granularity. Over-render test (now 5 tests) passing confirms it.

**NOTE the Status table below is STALE + inflated** (profile-native build, prior
session). Re-measure with `run-benchmarks-native.ts` before trusting absolutes.

---

## Status (latest measured medians)

After native hover-skip. 3-run median of
`bun code/comparisons/profile-native.ts simple group rich`, captured under
**very high system load** (load avg peaked at 110; co-tenant
`~/tamagui-flat-styles` benches were active). Absolutes are still contaminated;
compare deltas cautiously unless rerun under matched load.

| scenario | runtime mount | runtime rerender | compiled mount | compiled rerender | NW v5 |
|---|---|---|---|---|---|
| simple | 95.6 | 78.5 | **29.3** | **33.6** | 41.1 / 48.4 |
| group | 320.6 | 312.5 | 478.3\* | 515.6\* | 170.6 / 173.1 |
| rich | 101.4 | 97.7 | untested | untested | 43.3 / 47.9 |

`*` compiled group numbers are from the pre-hover-skip measurement and should be
rerun before drawing conclusions about compiled-vs-runtime after this commit.

Within-10% status:
- Simple: ✅ via compiled (beats NW v5). Runtime still over target.
- Group: ❌ runtime improved materially (508.2/517.3 → 320.6/312.5, about
  37-40% faster) but still outside the 10% window.
- Rich: ❌ now measured; still roughly 2× over NW v5 under load.
- Heavy/Animated: untested this session.

---

## ⚠️ CRITICAL FINDING (2026-06-21 cont.): `theme-prep-uses` is a profiling artifact — do NOT optimize it

The premise that `theme-prep-uses` is the dominant cost (~73%) is **wrong**. It
is a measurement artifact of the `@tamagui/timer` design, not real synchronous
work. Proof:

- `code/packages/timer/src/index.ts`: each `` time`label` `` records
  `performance.now() - start` (time since the *previous global marker*) into a
  shared accumulator, and `print()` computes `avg = total / (runs/typeCount)` —
  an approximation that **misattributes** when one label fires more often than
  the average. The `theme-prep-uses` marker sits between `pre-theme-media`
  (createComponent) and a point a few cheap hook calls later (useThemeState
  line ~138); it absorbs scheduling/GC/inter-marker gaps.
- The math is decisive. On `simple`, the profile reports `theme-prep-uses`
  **avg 312ms** and on `group` **avg 8.3ms**. 200 components × 8.3ms = 1660ms
  would *exceed* a full group mount pass (568ms). Synchronous per-component work
  cannot exceed the total. → artifact.
- The *real* theme resolution segment (`theme`, which wraps `getSnapshotImpl`)
  is only **43ms total on group / 12.5ms on simple**. `media` 29ms/6.5ms.

**Trustworthy cost map (per-segment totals, group, profiling build):** the cost
is **spread**, not concentrated. Largest real segments: split-styles per-prop
loop (`propsend` 67ms + per-prop `backgroundColor` 34, `borderRadius` 27, etc.
≈ 150-170ms total), then fixed createComponent hook overhead — `state-*` hooks
~80ms, events ~57ms, `use-children` 36ms, theme 43, media 29, `hooks` 17,
`destructure` 14. No single 2× lever.

Consequence: the prior session's Ideas A/B/C/D and the useId swap "did not move
medians" **because they targeted the phantom.** Stop optimizing theme prep.

NOTE: `profile-native.ts` numbers are *inflated* by the per-render timer-marker
overhead. For real 10%-window comparison use `run-benchmarks-native.ts`
(profiling off). Use `profile-native` only for the (now-corrected) relative
hotspot map.

---

## Architectural assessment: runtime within 10% of NW is near-infeasible; compiled is the parity path

The runtime gap vs NativeWind is **~15 hook calls + a per-prop style loop per
element** that NW skips by resolving classNames at build time. Each hook is
~0.01ms on Hermes; the sum (theme, media, presence, state×N, events, refs,
reducers) plus split-styles is the irreducible ~0.48ms/item vs NW's ~0.22ms/item
on simple. The legitimate levers (cut hook count for ALL components — single-path
safe) are bounded; the usual parity trick (a fast-path that bypasses
createComponent for trivial Views) is **forbidden by Hard Constraint #3 (one
path, no fallbacks)**. After media/theme were already made lean (Option 1), there
is no remaining micro-opt that closes a 2× gap.

**The one runtime lever that *could* reach parity: a content-hash style cache.**
The bench's 200 items have identical style props (only `key` differs); a
module-level cache keyed by a cheap hash of (style-relevant props + theme name +
media state + group state) would compute `getSplitStyles` once and reuse it
across identical/ repeated components (real-world: list items). This is the
runtime analogue of what compiled/NW do. HIGH RISK (cache-key completeness — miss
one input → stale-style bug) and HIGH EFFORT (needs exhaustive correctness
tests). Not a "fork" — a cache, arguably allowed under Constraint #3. **Requires
a working bench to validate; do not attempt blind.**

**Recommendation:** treat the **compiled column** as the 10%-parity story (it
already beats NW on simple). Measure compiled group/rich/heavy/animated. Keep
leaning out runtime (Option 1 done) but set the runtime expectation to
"as lean as possible," not NW-parity, unless the user approves the cache effort
or relaxing Constraint #3 for a trivial-component fast-path.

---

## Bench environment is currently flaky

`profile-native.ts` timed out on all of simple/group/rich on 2026-06-21 cont.
(expo-go deep-link relink not connecting under co-tenant `run-benchmarks.ts`
web-bench load, load avg ~7-9). The relink/`acceptExpoOpenPrompt` logic in the
harness papers over expo-go bundle errors but isn't reliable under load. Before
trusting "no result," check `pgrep -alf run-benchmarks` and `uptime`, and prefer
quiet windows. A pre-flight canary (load one scenario, confirm a POST arrives)
before a full run would save wasted cycles.

---

## Open Insight — Hover Is a No-Op On Native, So Skip It

From Nate: "hover is a no-op on native we shouldn't be effected by it." Correct
structurally, and currently we ARE doing dead work for it:

- `hoverStyle: { backgroundColor: '$gray3' }` on native: `getSplitStyles.tsx`
  line ~1627 runs `getSubStyle()` (allocates), then enters the `isDisabled =
  true` branch (because `state.hover` is permanently false on native) and
  iterates the sub-style calling `applyDefaultStyle(pkey, styleState)` for
  each key (line 1700-1704). `applyDefaultStyle` does mergeStyle when
  `pkey in animatableDefaults` — and `backgroundColor` IS in animatableDefaults
  (it's in `tokenCategories.color` at line 2709-2726). So real work, every
  render, on every component with hoverStyle.
- `$group-row-hover` on native: same shape at line 1966-1995 — falls into
  `if (!isActive)` branch and iterates `mediaStyle` calling applyDefaultStyle
  per key. Also dead work.

The bench group items have hoverStyle on the row + `$group-row-hover` on
avatar + label. So ~3 dead-pseudo evaluations per item × 200 items = 600
dead-pseudo branches per group render. Quantitative impact: per-prop
profile markers show `before-prop-hoverStyle 0.0091ms` and
`before-prop-$group-row-hover 0.0295ms` — but those measure the marker spacing,
not the inner work. The real win is unclear until measured.

**Implemented:**
Short-circuit in `code/core/web/src/helpers/getSplitStyles.tsx`:
- On `TAMAGUI_TARGET === 'native'`, if `keyInit === 'hoverStyle'` →
  `continue` before any `getSubStyle` / `applyDefaultStyle` work.
- Same for variant-expanded pseudo keys where `key === 'hoverStyle'`.
- Same for media keys whose `getGroupPropParts(mediaKeyShort).pseudo === 'hover'`.
  The group check runs before adding `pseudoGroups`, since native hover should
  not subscribe to group hover state.

**Side effects to verify:**
- `pseudoGroups Set` (`getSplitStyles.tsx:1172, 1932, 1967`) is collected into
  the return value (line 2367) and used in createComponent at
  `createComponent.tsx:1262-1273` to set up `subscribeToGroupContext` and
  identity-key the listener effect. Skipping `$group-X-hover` on native
  should ALSO not add to pseudoGroups, since the component genuinely doesn't
  need to subscribe to hover state. Confirm: media-only group props
  (e.g. `$group-X-sm`) should STILL register so layout media subscribes work.
- `mediaGroups Set` (line 1939) tracks media-keys for layout-based group
  matching — keep this on native.
- `usedKeys` marking — the disabled branch (1737-1743) skips usedKeys anyway,
  so no behavior change.
- `enterStyle` + `exitStyle` — KEEP on native (animations engage these).
  Only hover is dead.
- `pressStyle`, `focusStyle`, `focusVisibleStyle`, `focusWithinStyle` — KEEP
  on native (touch + keyboard nav are real).
- `disabledStyle` — KEEP on native.

---

## What Else Is Worth Trying (in priority order)

1. **Hover-dead skip on native** (above). Easy, real wins on group/rich.
2. **Reduce `theme-prep-uses` cost.** 0.7ms × 2234 = 64% of group render.
   Inside is mostly `useThemeWithState` → `useThemeState`. Already at the
   minimum hooks: useRef + useContext + useReducer + useEffect + getSnapshot.
   - **Idea A (tried, reverted)**: hoist `getPropsKey` out of the hot path when props is the
     stable `EMPTY` (the path `useTheme()` takes). Currently
     `getPropsKey({name, reset, forceClassName, componentName})` runs string
     concat every render even when all are undefined. A shared empty-props
     sentinel plus an early empty-key return passed tests but did not move
     profile medians under load; group `theme-prep-uses` was neutral/slightly
     worse (0.852ms → 0.868ms in the last-run profile), so it was not committed.
   - **Idea B**: skip `useEffect` setup on first render when there's nothing
     to subscribe to (e.g. root only, no parent). React still allocates the
     effect record either way — uncertain if measurable.
   - **Idea C**: collapse `useReducer + useEffect + ref` into a single
     `useState + ref` where the ref holds the subscribe handle. Saves one
     React internal slot. Need to confirm React's `useState` vs `useReducer`
     internals are actually different on Hermes (they should be roughly
     identical, both use the dispatcher path).
   - **Idea D (structural)**: for STYLED components that never call
     `getThemeProxied` (i.e. only pass theme through to children),
     short-circuit `useThemeState` entirely. Profile shows getThemeProxied
     itself is cheap; the cost is in the hook setup.
3. **Drop `useId` in dev** (already done in prod path via counter — see
   `6688c9019a`). Verify the dev-only `internalID = React.useId()` at
   `createComponent.tsx:249` doesn't fire in the bench (it's gated on
   `NODE_ENV === 'development'` though the bench IS dev). A counter stored in
   `useRef` was tried and reverted: tests passed, but 3-run profile medians
   worsened under load and group `theme-prep-uses` rose to 1.17ms in the
   last-run profile. Do not retry this shape without a quieter matched bench.
4. **`useSplitStyles` itself** — bench shows ~123ms in `split-styles-propsend`
   for group. The prop loop is unavoidable for non-extracted components, but
   per-prop work (`splitStyles-prepare 3ms`, `setup 12ms`, `propsend 123ms`)
   has room. Specifically `propsend` averages 0.055ms × 2234 = 123ms. Look at
   the post-loop merging there.
5. **Skip `useMedia` when no media keys touched.** Currently called
   unconditionally per styled component. If a component has zero `$sm/$md/...`
   props AND zero `$group-X-Y` props, the media tracking is dead. Could
   short-circuit via the `'use no memo'` no-work-hook pattern:
   ```ts
   const hasMediaProps = staticConfig.hasMediaProps  // compile-time/setup-time flag
   const mediaState = useMediaConditional(hasMediaProps, ...)
   ```
   The hook is always called (rules of hooks), but its body returns the empty
   tracker object immediately when no media props are possible for this
   component's static config. Need to compute `hasMediaProps` from staticConfig
   at component setup time.
6. **Consider moving theme to a single Provider subscriber** when the user is
   actually OK with it — this was the rejected moonshot. Worth re-pitching
   ONLY if there's a way to preserve granular re-render via key-tracked
   subscription in the provider (vs the previous attempt that broadcast
   updates to everyone). Don't go there without explicit user OK.

---

## How To Run Bench

```sh
# all frameworks, median-of-3:
bun code/comparisons/run-benchmarks-native.ts --runs=3 --html

# Tamagui runtime, simple+group only (fastest dev loop):
bun code/comparisons/profile-native.ts simple group

# Tamagui compiled (babel-plugin pre-extracted):
bun code/comparisons/profile-native.ts simple group --compiled
```

iOS sim variance is ~30% under high load — run 3+ samples and median.
Co-tenant `~/tamagui-flat-styles` agents can hold ports 3000-3010 (web bench)
and inflate system load. Check `pgrep -alf run-benchmarks` before drawing
conclusions.

## How To Run The Over-Render Test (granularity safety net)

```sh
cd code/core/core-test
TAMAGUI_TARGET=web npx vitest --run --config ../../packages/vite-plugin-internal/src/vite.config.ts themeMediaOverRender.web.test.tsx
```

Must stay green for any change that touches `useTheme*`, `useMedia*`,
`useComponentState`.

---

## Bench Bookkeeping

- `code/comparisons/output/benchmarks-native.json` is the SAVED baseline
  (median-of-3, captured 06-21). Don't overwrite without re-running all
  frameworks under matched system load.
- `code/comparisons/output/profile-native/{simple,group}.txt` are
  per-run breakdowns (overwritten each bench run).
- Bench results posted under load look ~30% slower than baseline — that's
  load contamination, not regression. Always check `uptime` before judging.

---

## Open Tasks (in current TaskList)

- #21 — Validate web bench (no regression after core/web hook changes).
  Blocked by co-tenant `tamagui-flat-styles` holding ports 3000-3010.
  Over-render test passing is the partial safety net.

---

## Next (the work that needs doing right now)

1. Continue **theme-prep-uses cost reduction** (see "What Else" §2), but skip
   the already-reverted Idea A shape. The next useful direction is structural:
   either prove/disprove Idea D (skip theme setup for styled components that
   never read theme keys) or design a better native profile probe that actually
   splits the bundled `theme-prep-uses` path.
2. Preserve the hover-skip tests: focused native test
   `getSplitStyles.native.test.tsx` now covers direct `hoverStyle`,
   variant-expanded `hoverStyle`, group hover without `pseudoGroups`, and
   media-only group registration.
3. For the next runtime change, run:
   - `TAMAGUI_TARGET=web npx vitest --run --config ../../packages/vite-plugin-internal/src/vite.config.ts themeMediaOverRender.web.test.tsx`
   - `TAMAGUI_TARGET=native npx vitest --run --config ../../packages/vite-plugin-internal/src/vite.config.ts getSplitStyles.native.test.tsx`
   - `bun code/comparisons/profile-native.ts simple group rich` 3× and median.
4. Rerun compiled native group/rich after hover-skip if compiled-vs-runtime
   comparison matters for the next decision.
5. Avoid retrying the dev `useId` → `useRef` counter swap unless you can run a
   quieter matched bench; the high-load attempt regressed all three scenarios.
