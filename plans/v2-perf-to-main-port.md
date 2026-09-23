# v2-perf → main port audit

`v2-perf` = `flat-styles` (tailwind / "flat styles" feature) + 99 perf commits, **83 of which
are not yet on `main`**. Goal: bring the *generally-useful, flat-styles-independent* perf work to
`main`, leave the flat-styles feature + bench/docs scaffolding behind.

Method: per-commit file-overlap with the flat-styles footprint, non-destructive `git merge-tree`
cherry-pick simulation onto `main`, and deep diff-reads of the two entangled surfaces
(`createExtractor.ts` compiler, `core/web` runtime hooks).

Key baseline facts:
- `main` already has the async-IO `useElementLayout` measurement loop (merged via `0bd6eec844`)
  **and still keeps the synchronous on-mount seed**. main's layout behavior is already correct.
- The theme/media hook files are **byte-identical** between `main` and the flat-styles base, so the
  core perf chain lands on the same baseline.

---

## ✅ DEFINITE / EASY — independent, useful, low-risk

### A. Theme/media core perf chain (headline win) — bring as one ordered batch
Pure runtime perf on `core/web` hooks, zero flat-styles dependency, covered by a bundled test.
Edit the same hooks in sequence, so apply **in this order**:

1. `9994216da8` test(core): over-render guard test (first — later commit extends it)
2. `ee93553202` perf(core/web): stabilize useThemeState/useMedia closures, one Proxy per component
3. `6688c9019a` perf(theme): drop `useId`, counter-based ids
4. `c2f06098a6` perf(core): manual subscribe (useReducer+useEffect) — ⚠ intentionally drops
   `useSyncExternalStore` tearing protection (fine for event-driven theme/media)
5. `b6cfe2f9ba` perf(theme): skip cascade-effect for leaf components (`forThemeView`)
6. `a96195d7b5` perf(media): shared getter prototype instead of Proxy (Hermes-fast)
7. `b0030550c1` perf(core): lazy theme/media subscription (skip listener setup when no tracked keys)

Validate with `code/core/core-test/themeMediaOverRender.web.test.tsx` + a build + core tests.

### B. Standalone fixes (each applies clean onto main)
- `b170336495` fix(select): SelectViewportFrame extends ThemeableStack (elevate/bordered resolve)
- `0b2fefcf39` fix(use-window-dimensions): lazy-subscribe to dodge hermes early-eval
- `f9d44efca0` fix(core): type the "safe" first-class value for safe-area style props

### C. Native getSplitStyles dead-hover skip (pure native, gated on `TAMAGUI_TARGET==='native'`)
1. `2683b7fcb1` perf(native): skip dead hover work in getSplitStyles (code hunk clean; only
   conflicted on a `plans/` docs file)
2. `d58bdf86a2` perf(native): extend dead-hover skip to group-hover media keys (after 2683)
3. `4b04b593f6` perf(native): trim leaf hooks — data-* early-skip in split loop + iOS
   NativeMenuContext skip + collapse pointer refs (no compiler-marker dependency)

---

## ⚠ MEDIUM RISK — independent but conflicts / needs care

- `40d07e1773` + `c288c5402f` — component-state `setStateShallow` hoist **+ its own regression fix**.
  MUST travel as a pair: `40d07e1773` alone introduces the motion/reanimated "enter animation stuck
  at opacity 0" bug (the wrapper-collision on `avoidReRenders`); `c288c5402f` is exactly its fix.
  Self-contained (useComponentState + types). Minor perf opt — bring both or skip both.
- `a6d058179a` fix(build): fully specify native imports — generally useful, but conflicts on main
  (`babel-plugin-fully-specified` diverged after recent build work). Needs manual port + retest.

---

## 🧩 TRICKY — independent intent, entangled on flat-styles; bundle compiler+runtime, review native behavior

- Compiler partial-flatten + `data-disable-*` hook-gating chain (native perf: skip theme/media/events
  hooks on compiler-proven-free leaves): `6adc70c158` → `f41960afa4` → `f2374c8e84`
  (+ lift the small `getGroupPseudo` parser and `styleValueHasToken` helper).
  - Sits textually on flat-styles `createExtractor.ts` edits → manual port, not cherry-pick.
  - Runtime gates are **inert no-ops until the compiler emit also lands** → bring compiler + runtime
    together or not at all.
  - `f41960afa4` has a real native behavior delta: it stops force-ignoring `data-disable-theme` on
    native (themeable/`<Theme disable-child-theme>` would start being honored on native). Review +
    test before bringing.
- `72c34f7584` perf(native): "optimize initial theme media render" — actually a **feature**: opt-in
  `themeOptimize`/`mediaOptimize: 'initial-render'` (default off), adds a second context-based path.
  Treat as a feature port, not a perf cherry-pick. Independent of flat-styles but stacked on the
  whole chain above.

---

## 🚫 DON'T BRING

- `addc6ffa97` use-element-layout: removes the synchronous on-mount layout seed → first `onLayout`
  arrives an async tick late (flicker / wrong first-frame positioning). **main is already correct
  without it.** This is the commit to *revert on v2-perf*, never to port.
- Flat-styles feature itself: `7eacc19c2c`, `c74e8bba2a`, `1d98bcc150`, `118e87993f`, `6b03f421f7`,
  `852177752b`, `491d164e35`, `a8291e8951`, `fab24f14c2`, `a683e95e77`, `de9e993c49`.
- to-tailwind: `e582d30410`, `3cba1f59a9`, `683d8b0bc5`.
- Reverted pair (net-zero): `2d556e3ee7` + `84e32eb971`.
- Bench / comparison scaffolding (not shippable): `ed4010dc9e`, `31d6803629`, `a79dd60cea`,
  `6cd957479b`, `8ee11cb492`, `d8d1c2eabb`, `2d34ab8fe9`, `2777e18ac4`, `b1856431d6`, `f09d1a214b`,
  `beeb367f10`, `8a8f870d8a`, `31f01dd473`, `874195afce`, `1f4a6cc3d0`, `589d015d53`, `c41ba343b1`,
  `d02563a80e`.
- Docs/plans, merge commits, flat-styles CI/kitchen-sink (`78fc02e70f`, `bd0c1ac7fc`, `cde8f9f929`,
  `9a264cf7c7`, `5823a742f0`, the merge commits, and the ~18 `docs:`/plans commits).

---

## Execution notes
- These are not literal `git cherry-pick`s — most carry `code/comparisons/**` + `plans/**` bench/docs
  noise in the same commit. Port the `code/core` / `code/compiler` hunks, drop the bench files.
- Suggested first PR = buckets **A + B + C** (the clean, flat-styles-free perf + fixes). Land + test,
  then decide on the MEDIUM pair and the TRICKY compiler chain separately.
