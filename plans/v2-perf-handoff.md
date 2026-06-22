# v2-perf — Native Runtime Within 10% Of Best — Handoff Doc

Owner: Nate. Live branch: `v2-perf` (23 commits ahead of `flat-styles`).

This is a working handoff. Update the **Status** + **Next** sections as you go.
The Goal + Constraints sections are durable.

---

## Goal

Tamagui **runtime** native perf within **10%** of the best framework on every
benchmark metric (simple/group/heavy/animated × mount/rerender). Compiled
column should easily land within 20% of perfectly optimized RN for simple
cases (already does — beats NW v5 by ~29% on simple). The hard problem is
runtime.

Benchmarks: `code/comparisons/run-benchmarks-native.ts`. iOS sim via Expo Go.
Median-of-3. Reference baseline: `code/comparisons/output/benchmarks-native.json`.

Best-of-frameworks on iOS (NW v5 median-of-3 from baseline JSON):
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

All preserve granularity. Over-render test passing confirms it.

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

**Profile breakdown** (`code/comparisons/output/profile-native/group.txt`):
latest profile file is from the third run (not the median) and still shows
`theme-prep-uses` dominating: 0.852ms per component × 1319 samples =
**1124ms of 1542ms total (73%)**. This includes time-marker overhead
(only in dev/profile builds); production bench will be lower but the relative
gap should match.

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
