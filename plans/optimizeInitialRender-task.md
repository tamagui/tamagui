# TASK: implement `optimizeInitialRender` (native theme/media "dumb mode")

You are implementing a perf feature on the `v2-perf` branch of `/Users/n8/tamagui`
(React Native + web UI lib). A manager (Claude) spec'd this after deep profiling.
Read this whole file + `plans/v2-perf-handoff.md` (esp. the top "GOAL 2026-06-22"
section) before starting. Report progress/blockers via agentbus to session
`ab-mqpfzb3k-83921` (`agentbus send ab-mqpfzb3k-83921 "..."`).

## The goal (hard, measurable)

Make the native bench scenario **`themed`** (compiled) **faster than BOTH NativeWind
and Uniwind** on the ×RN ratio. Current numbers (3-run interleaved):

| Mount ×RN | TG compiled | NativeWind | Uniwind |
|---|---|---|---|
| themed (`_withStableStyle`) | **1.85** (must beat) | 1.35 | 1.23 |

Target: `themed` compiled mount ×RN **< 1.23** (beat Uniwind, the lower bar), without
regressing `simple` (currently 0.98×, best-in-class) or any other scenario.

## The design (decided by the user — do NOT redesign)

Add TWO independent TamaguiProvider / config settings:

- **`themeOptimize?: "initial-render" | "re-render"`**
- **`mediaOptimize?: "initial-render" | "re-render"`**

Both **default to `"re-render"`** (= today's behavior, unchanged). The value names
what you optimize FOR:

- **`"re-render"`** (default) = current granular subscription mode: per-element
  listeners/signals/state so theme/media changes do cheap granular updates.
- **`"initial-render"`** = "dumb" mode: **no per-element listeners, no signals, no
  subscription state — just `useContext`.** A theme/media change does a **full
  re-render** of consumers (via a context value change). 0 listeners / 0 reducer /
  0 effect per element → cheap mount. This is the NEW fast path.

Theme and media are controlled **independently** (e.g. an app may set
`mediaOptimize="initial-render"` but keep `themeOptimize="re-render"`).

Rationale: on native, many apps never change media and only change theme on
light/dark switch, so trading granular updates for cheap mounts + occasional full
re-renders is a fair trade. Web stays dynamic → leave both `"re-render"` (default).

## Why this is the right lever (already validated by the manager — don't re-probe)

Profiling proved (via probes on a real iOS sim):
- The `_withStableStyle` **wrapper structure is essentially FREE** (memo/forwardRef/
  useContext/spread): with theme bypassed + a static style, `themed` mount ≈ `simple`
  (21ms vs 24ms).
- The **entire** themed−simple gap is **theme machinery** — split roughly half the
  `useTheme()` hook (the `useReducer`+`useEffect`+`useThemeState` subscription) and
  half the per-element `.get()` work. `themeOptimize="initial-render"` removes BOTH
  (no subscription hooks; resolve value from context directly).

## Key files

- `code/core/web/src/_withStableStyle.tsx` — the light-dynamic gear (themed elements
  fold here). The hot path. In dumb mode: read theme from context (no `useTheme()`),
  no subscription.
- `code/core/web/src/hooks/useThemeState.ts` — theme subscription system.
  `ThemeStateContext = createContext<ID>('')` (carries an ID string, not the theme).
  Module state: `states: Map<ID, ThemeState>`, `listenersByParent`, `forceUpdateThemes()`.
  **Problem for dumb mode:** the context only carries an ID; when the root theme
  switches (light→dark) the ID may not change, so `useContext` alone won't re-render.
  You likely need a context that carries something that CHANGES on theme switch (the
  ThemeState/theme object, or a version counter) so dumb consumers re-render on change.
- `code/core/web/src/hooks/useTheme.tsx` — `useTheme()` → `useThemeWithState` →
  `useThemeState` + `getThemeProxied`.
- `code/core/web/src/hooks/getThemeProxied.ts` — proxy cached per theme object;
  `.get()` does `getVariable` + `getSetting('fastSchemeChange')` + scheme checks + track.
- `code/core/web/src/hooks/useMedia.tsx` — media subscription (dumb-mode equivalent).
- `code/core/web/src/views/Theme.tsx`, `ThemeProvider.tsx`, `TamaguiProvider` — where
  theme is provided / where the new context provider goes.
- Settings type: search `code/core/web/src/types.tsx` for existing settings (e.g.
  `fastSchemeChange`, `styleMode`) and add `themeOptimize?: 'initial-render' | 're-render'`
  and `mediaOptimize?: 'initial-render' | 're-render'` (both default `'re-render'`).
  Read via `getSetting('themeOptimize')` / `getSetting('mediaOptimize')`.
- `code/core/web/src/createComponent.tsx` — the heavy path also uses theme/media; in
  dumb mode its `useThemeState`/`useMedia` should also skip subscription. (Secondary —
  get `_withStableStyle` winning first, then extend.)

## Suggested implementation order (measure after EACH step)

1. Add the `themeOptimize` + `mediaOptimize` settings (type + `getSetting`). Default `'re-render'`.
2. Add a theme context that carries the active `ThemeState` (or theme + a version)
   and **changes on theme switch**, provided at the root/Theme level. (May be able to
   change `ThemeStateContext`'s value or add a parallel context — your call, keep it
   clean, one path.)
3. In `_withStableStyle`: when `getSetting('themeOptimize') === 'initial-render'`, read
   theme from that context (no `useTheme()`, no subscription) and resolve values
   directly. Otherwise keep the current path unchanged.
4. Measure `themed` ×RN (see below). Iterate until < 1.23.
5. Extend dumb mode to `useMedia` (gated on `mediaOptimize`) and `createComponent`'s
   theme/media (gated on `themeOptimize`/`mediaOptimize`) so `rich`/`group` also
   benefit; re-measure all scenarios.

## How to build + measure (a root `bun run watch` auto-rebuilds @tamagui/web)

- After editing, confirm the dist rebuilt: `grep -c themeOptimize code/core/web/dist/esm/_withStableStyle.native.js` (wait a few s for watch).
- iOS sim with Expo Go is booted: **UDID `0B818936-F866-4EDA-A3FB-33E0674661AC`**.
- Profile (bucketed, fast, 1 app): `cd code/comparisons && PROFILE_CLEAR=1 bun profile-native.ts --compiled --udid=0B818936-F866-4EDA-A3FB-33E0674661AC themed simple`
- ×RN competitive (the real metric, all frameworks): `cd code/comparisons && BENCH_CLEAR=1 bun run-benchmarks-native.ts --scenarios=simple,themed --runs=5 --udid=0B818936-F866-4EDA-A3FB-33E0674661AC` → reads the ×RN table at the end; JSON at `output/benchmarks-native.json`.
- The `themed` bench scenario ALREADY EXISTS in all 5 native apps (added by manager):
  it's the `simple` shape with `backgroundColor="$blue5"`. It compiles to
  `_withStableStyle`. Don't re-add it.
- Note: absolute single-run ms are noisy (±10ms); trust the **×RN ratio with --runs=5**.

## Hard constraints

- `themeOptimize`/`mediaOptimize` **default `'re-render'`**; existing behavior (web +
  native without the flag) must be byte-for-byte unchanged. One code path per branch,
  no dead code.
- Theme/media reactivity must still WORK when the flag is on (just via full re-render):
  flipping light↔dark must re-render and show new colors. Verify this.
- Do NOT touch the RNGH native press path (`eventHandling.native.ts`) or anything
  about the reverted "onTouch" experiment.
- Run the relevant tests before declaring done:
  - `cd code/core/core-test && <vitest> ...themeMediaOverRender, useTheme, useMedia, _withStableStyle.native` (ask manager for exact vitest cmd if needed; note vitest renders the WEB build, so it won't exercise native dumb-mode directly — the bench/Detox is the native net).
  - The over-render safety test must still pass.
- Commit style: conventional, one line, `perf(native): ...`. Branch is `v2-perf`.
  Do NOT push or release. Commit only your own files by explicit pathspec.

## Report back

Via `agentbus send ab-mqpfzb3k-83921 "<status>"` when: (a) you have a first themed ×RN
number after step 3, (b) you hit a blocker/ambiguity, (c) themed beats both. The
manager will review diffs + may re-run benches to confirm.
