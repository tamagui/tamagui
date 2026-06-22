# Executive Report — `v2-perf` branch

_Generated 2026-06-22. Companion to `v2-perf-handoff.md` (the live working doc)._

## TL;DR

The branch holds **three independent efforts**, only one of which is the active focus:

1. **Native runtime perf** (the live work, Jun 21–22) — a chain of safe, granularity-preserving optimizations to Tamagui's per-element hook cost. Real wins on the *static* path; the *dynamic* path (press/group) remains the open frontier. **Safe to keep; goal not yet met.**
2. **Tailwind / styleMode feature** (Jun 19–20, inherited from `flat-styles`) — opt-in Tailwind syntax support. **Off by default, 227 tests green, mid-flight (not yet dogfooded).**
3. **Comparisons / benchmark / conformance harness** — measurement tooling + a `/tailwind` marketing page. **Self-contained, doesn't touch shipped lib code.**

**Headline of this session:** an attempt to replace the RNGH press path with `onTouch` handlers to shave per-element cost was Detox-validated as a no-regression, then **reverted** — RNGH recognizes touches *off the JS thread* so press feels instant under load, and a mount benchmark structurally can't measure that. The one perf change kept this session (`data-disable-events`) is correct but has ~nil bench surface.

**Branch facts:** 118 first-parent commits, 2026-06-19 → 06-22 (merge-base `1932906c`), 271 files / +24,418 lines. Mix: 39 feat · 18 perf · 16 fix · 16 docs · 12 chore · 5 test · 2 reverts.

---

## Workstream 1 — Native runtime perf (the live focus)

### The decision that frames everything (goal pivot, Jun 21)
"Runtime within 10% of NativeWind" was abandoned as **architecturally infeasible** — Tamagui's runtime resolves arbitrary styles per render (strictly more work than a className lookup), so it cannot match a class-lookup engine. The new goal: **Tamagui *compiled* must beat NativeWind + Uniwind on every scenario.** Compiled inlines resolved styles at build time → near-zero runtime resolution → it *can* win. (`plans/v2-perf-handoff.md`.)

### Where the gap actually is (CORRECTED 2026-06-22 by reading NW v5 + Uniwind native runtime source)
**Not** "wrapper vs no wrapper" — an earlier framing here ("a plain competitor element is a raw RN primitive, zero hooks") was **retracted after reading the source**. NativeWind v5 (`react-native-css@3.0.7`) and Uniwind both rewrite RN's `View` at build time into a wrapper that runs hooks on *every* className element — there is no static fast-path in either. The real gap is **wrapper weight + style-resolution cost**: per static element NW pays ~5 hooks + a precompiled-stylesheet lookup, Uniwind ~3 hooks + lookup, while Tamagui's deopted leaf runs ~10+ hook slots **plus** full `getSplitStyles` open-ended prop resolution (the price of full runtime dynamism). All three re-render React on press (NW's signals only make it *surgical*, not render-free); Tamagui's RNGH recognition is the one off-thread differentiator. Tamagui has two gears — full-flatten (wins `simple`) or full `createComponent` — and no light middle gear; the competitors' always-on gear is already light. See `v2-perf-handoff.md` "Why NW/Uniwind are leaner" for the full source-cited breakdown.

### Shipped & kept (all preserve granularity; over-render safety test passes)
| Commit | Change |
|---|---|
| `b0030550c1` | **Lazy theme/media subscription** — component joins the listener map only if it reads a tracked key |
| `c2f06098a6` | Manual `useReducer`+`useEffect` replaces `useSyncExternalStore` for theme+media |
| `a96195d7b5` | `useMedia` Proxy → shared getter-prototype (Hermes inlines getters; Proxy trap was interpreted) |
| `6688c9019a` | Drop `useId` from per-component theme path (counter-based ids) |
| `b6cfe2f9ba` | Skip cascade-effect hook for leaf components (only `<Theme>` installs it) |
| `6adc70c158` | **Partial-flatten** static props on native deopt; drop dead hover |
| `f41960afa4` / `4b04b593f6` | Skip theme+media hooks on compiler-proven theme/media-free leaves; trim leaf hook count (skip `NativeMenuContext` on iOS, collapse pointer refs 3→1, early-skip `data-*`) |
| `f2374c8e84` | **`data-disable-events`** graduated hook gate — extractor proves an element has no event handlers, gates `useEvents` off. Correctness: the gate is a **compile-time constant per call-site**, so hook order stays stable per fiber (only the linter is overridden). `{...spread}` forces keeping all hooks. |

### Native dead-hover skip (`d58bdf86a2`)
Hover is a **no-op on native** — the extractor now strips hover/group-hover media keys on native deopt.

### Where we are (clean ×RN baseline, committed `benchmarks-native.json`, PROD mode)
| scenario | TG runtime | **TG compiled** | NativeWind (real bar) | Uniwind |
|---|---|---|---|---|
| simple | 4.78× | **1.02×** ✅ | 1.76× | 1.26× |
| rich | 4.26× | **3.64×** mount / 3.06× rerender | **1.44×** | 1.15× ⚠️ |
| group | 4.24× | 2.74× | **1.84×** | 1.47× ⚠️ |
| animated | 3.42× | 3.42× mount / 4.19× rerender | 1.51× | 1.19× ⚠️ |

⚠️ Uniwind **does not implement** press/group on native (its bench records static-cost only) — **NativeWind is the real bar.**
- ✅ **Compiled wins `simple` decisively** (full flatten → raw RN, beats even Uniwind).
- ❌ **Dynamic scenarios (rich/group) still 2–3× the NW bar.** This is the unmet goal.

### This session's investigations (corrections baked into the handoff doc)
- **Theme is *not* expensive** — the "theme-prep-uses" cost was a **profiling artifact**; real theme cost is ~8%. Doc corrected; do not optimize it.
- **The onTouch RNGH experiment was reverted** (`d01a44e692` → `72c861d202`). RNGH's value is off-thread recognition (a runtime property, invisible to a mount benchmark). The RNGH press path is now intentionally **left as-is** — do not re-touch it.

---

## Workstream 2 — Tailwind / styleMode feature (opt-in, mid-flight)

**What it is:** a config setting `styleMode` with three modes — `'tamagui'` (default, today's behavior), `'tailwind'` (className-only, classes→styles at runtime), `'tamagui-and-tailwind'` (both). A fourth `'flat'` mode (`$bg="red"`) is **shelved** — code retained but unreachable.

**Key decisions:**
- Tailwind is **web-runtime via `className`**, not a typed prop — converted in `getSplitStyles` (`preprocessTailwindClassName`), unknown classes preserved, recognized ones flow into the normal atomic-CSS pipeline. No hardcoded Tailwind table: it resolves against the *user's* tokens + Tailwind's ×4 scale + modifier→pseudo/media mapping.
- A separate **`@tamagui/config/v6`** carries a generated **289-color Tailwind-v4 palette** (oklch→hex rasterized via headless Chromium so RN gets exact hex), v4 radii, and `w`/`h` shorthands — so `bg-blue-500`/`rounded-lg`/`p-4` match Tailwind.
- New `@tamagui/to-tailwind` Babel transform rewrites source JSX the *other* direction (for the docs "show as Tailwind" toggle).

**Tested — 227 tests green:** 78 transform · 34 runtime class→style · 39+36+40 type-level (per-mode prop presence/absence).

**Safe vs risky:** Entirely **off unless opted in** → zero risk to existing users. **Risky/incomplete:** v6 config is exported and proven in the conformance harness but **not yet adopted by kitchen-sink or the main app** (not dogfooded); 6–7 known conversion gaps tracked openly; flat-mode dead code violates "one path" (deliberate); `/tailwind` page built but **not linked in nav**.

**Status:** functionally complete + tested for web, native validated via conformance, **opt-in, not on the default path** — ships incrementally and safely.

---

## Workstream 3 — Comparisons / benchmark / conformance

**Harnesses:** web (Vite+Playwright) and native (iOS sim via Expo Go) bench apps for **Tamagui runtime, Tamagui compiled, NativeWind v5, Uniwind, raw RN**, all running the same 5 scenarios (simple/rich/group/heavy/animated), measuring mount + re-render.

**The ×RN methodology (key maturity step, `d8d1c2eabb`):** absolute ms drift with host load, so the native runner keeps one raw-RN Metro alive and **measures vanilla RN interleaved after each framework run**, reporting **framework ÷ RN** per scenario. Plus `BENCH_CLEAR=1` (cold Metro so a fresh compiler build is actually applied) and `PROD=1` (`--no-dev --minify` for the honest shipped shape).

**Conformance (pixel-diff vs real Tailwind v4 oracle):** **web 94% (115/122), native iOS 97% (116/120)** — known-failing cases kept in the suite, not hidden. Separate manual coverage audit: Tamagui 88.3% / Tailwind 95.3% / NativeWind 87.9% / Uniwind 40.6%.

**Product vs tooling:** the `/tailwind` marketing page + `tailwind-mode.mdx` blog **ship** and consume *transcribed* numbers; everything else (runners, profilers, bench apps, coverage generator) is **internal** and self-contained — deleting it wouldn't affect published packages.

**Risky:** the public 94/97/122 conformance claims are load-bearing — but harness-validated and honest. Native bench output is **partial/mid-grind** (committed JSON has only rich+animated).

---

## Consolidated: Safe vs Risky

**Safe ✅**
- All comparisons/bench/profiler tooling (not imported by lib code).
- Tailwind/styleMode (off by default, 227 tests green).
- The shipped perf optimizations (granularity preserved; over-render test + Detox pass).
- `data-disable-*` gates (compile-time-constant gating → stable hook order).

**Risky / open ⚠️**
- **Perf goal unmet:** compiled still 2–3× the NW bar on rich/group. The real lever — graduated runtime shapes (pay-for-what-you-use), which `data-disable-*` *begins* — has ~nil bench surface so far.
- **Native press path has no vitest coverage** — vitest renders the *web* build (Vite doesn't resolve `.native.ts`). `eventHandling.native.ts` is exercised **only by Detox**. Detox is the real safety net there.
- Public conformance numbers are load-bearing (mitigated: harness-validated + honest).
- v6 Tailwind config proven in harness only, not dogfooded.
- Native bench output partial; flat-mode dead code retained.

---

## What was tested

- **Tailwind:** 227 unit/type tests (green) + conformance web 94% / native 97%.
- **Perf:** over-render safety test (5 tests, green); the onTouch change was **Detox-validated as no-regression** (`PressStyleScrollStuck`, `NestedPressExclusive`, `GroupPressTransitionMatrix` active) **before being reverted** for off-thread-feel reasons. 26 e2e files total; 4 have a skipped describe (`PressStyleNative`/`GroupPressNative` flaky-skipped).
- **Not run:** full native bench refresh (partial JSON), `StyleValidation` Playwright (28, needs dev server), full kitchen-sink web suite.

---

## Where we are (uncommitted working tree)

Mostly bench artifacts, plus **two real source changes to review:**
- `code/core/use-element-layout/src/index.tsx` — **in-progress web refactor** (+91/−74): extracts an `emitLayoutIfChanged` helper, reworks `registerLayoutNode`, `DOMRect`→`DOMRectReadOnly`. **Needs review + test before commit** (web layout measurement, not native).
- New `rn-bench-native/` app (the raw-RN baseline) + its `package.json` workspace entry + bench `App.tsx` tweaks — committable together as bench scaffolding.

### Bottom line
The branch is in a **healthy, honest state**: a complete opt-in feature, a solid measurement suite, and a perf grind that has banked the safe static-path wins and correctly identified the dynamic-path wrapper tax as the remaining frontier. The most important outcome of this session was **negative knowledge held correctly** — the RNGH press path stays untouched because its value is off-thread feel, not mount cost. Nothing on the default path is destabilized; the open work is the graduated-runtime-shapes direction to make press/group pay-for-what-you-use.
