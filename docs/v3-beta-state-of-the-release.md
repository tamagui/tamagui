# Tamagui v3 beta — state of the release

Written 2026-07-19 against branch `v3-beta`. This is the top-to-bottom picture:
what changed, what was decided and why, what you should check yourself, what the
performance numbers actually say, and what is still open.

Scale: **435 commits** on `v3-beta` past `main`, 2,194 files, +149k/-40k lines.

---

## 1. The one-paragraph version

v3 replaces the v1/v2 "styled components with a compat layer" model with a
three-layer contract: `@tamagui/ui` holds unstyled behavior, `tamagui` holds the
default styled skins, and the shadcn registry emits copy-paste components
generated from those same skin files. The v1 Button and the imperative Toast are
gone, `ThemeableStack` is gone and replaced by a copied `Surface` fixture, and
compiled runtime performance on the workloads that matter is meaningfully faster
than v2.4.6. CI on `v3-beta` is green across Checks, Registry, Maestro, and Detox
on both iOS and Android.

The honest counterweight: bundle-size budgets were specified but never enforced,
the native benchmark covers 2 of 6 scenarios with no v2 column at all, and the
bento migration is finished but only partly proven at runtime.

---

## 2. Decisions made

These were settled during the campaign. Several were yours; they are recorded
here so the reasoning survives.

**Packaging.** `tamagui` keeps behavior primitives as the main export; styled
skins live at subpaths inside `tamagui` (`tamagui/unstyled`, plus per-component
subpaths); `@tamagui/ui` is the unstyled home. A separately drafted
`@tamagui/kit` package was dropped and is not planned.

**Remove the v1 compat surfaces rather than keep shimming them.** The retained v1
Button and the v1 imperative Toast are deleted. This is what made the primary
`Button` and `Toast` export names available to the v3 components, and it is the
single largest source of breaking changes below.

**Surface is a copied fixture, not a framework hook.** A user-owned copied
`Surface` skin reads conventional variables (`$surfaceBorder`, `$focusRingColor`,
`$disabledOpacity`, `$pressScale`, easings) through the shipped `<Variables>`
primitive. Behavior components never read them.

**Nothing on by default.** A bare `<Surface>` renders no chrome and no
interaction styling. Every facet is opt-in. Facet names are all adjectives:
`filled` / `outlined` / `elevated` / `rounded` / `interactive`, with interaction
collapsed into a single facet.

**Benchmarks last.** Gate 4 was deliberately deprioritized to the end of the
campaign rather than run continuously.

**Batched merges into `v3-beta`.** Worker branches validate on their own PRs in
parallel; `v3-beta` takes batched merges of already-green branches, so the ~45
minute full matrix is paid once per batch. Post-merge `v3-beta` runs are
confirmations, not gates.

**One Toast, and it ships in `tamagui`** (decided and implemented 2026-07-19,
this session). There is no longer a `@tamagui/toast/v2` subpath and no separate
"Toast v2" docs page. Rationale: the only reason toast was ever a separate
install was that it forced a native dependency (`burnt`). It no longer does —
`burnt` is resolved lazily through `@tamagui/native`, so toasts render as in-app
views everywhere by default and native OS toasts are strictly opt-in. The
package still exists as the unstyled behavior layer, exactly like
`@tamagui/dialog` or `@tamagui/sheet`, but `import { toast, Toaster } from
'tamagui'` needs no extra install.

---

## 3. Breaking changes

The full migration guide is `code/tamagui.dev/data/docs/guides/how-to-upgrade.mdx`
(18 numbered steps). Baseline assumptions: the v2 web-standard prop model, Config
v5, React 19, React Native 0.81+, TypeScript 5+.

Condensed:

1. **Packages removed:** `@tamagui/babel-plugin` (use vite-plugin / metro-plugin
   / `tamagui build`), `@tamagui/sizable-context` (→ `@tamagui/size`),
   `@tamagui/static-sync`, `@tamagui/static-worker`.
2. **Sheet:** `Sheet.Frame` splits into `Sheet.Container` (layout) +
   `Sheet.Background` (visuals). There is a codemod:
   `node ./node_modules/tamagui/scripts/codemods/sheet-frame-to-container.js`.
   `Sheet.Overlay` must now be a direct child of `Sheet`.
3. **Removed props/aliases** (14 of them): `focusable`→`tabIndex`,
   `fullscreen`→explicit `position`+`inset`, `themeInverse`→`theme="inverse"`,
   `.styleable()`→ordinary composition, `inlineWhenUnflattened`→delete,
   `forceRemoveScrollEnabled`→`disableRemoveScroll` (**note the inverted
   intent**), `@tamagui/animations-moti`→`@tamagui/animations-reanimated`.
4. **`$true` token keys are gone.** Pass the token it aliased (`$4` in the
   default config). A component's visual `size` is its own styled variant, not a
   global token, so this swap does not change rendered component size.
5. **Runtime token stepping removed** from `@tamagui/get-token`
   (`stepTokenUpOrDown`, `getTokenRelative`, the options argument to
   `getSize`/`getSpace`/`getRadius`).
6. **Exact font sizes:** `fontSize={17}` keeps the platform default line-height
   path; `fontSize="17px"` is exact pixels.
7. **FocusScope** renders a `display: contents` wrapper and **function-as-children
   is removed**. New `noFocus` prop, web-only.
8. **Dialog / Popover / Select share one Adapt handoff model.** Adapted sheet
   content stays mounted until the sheet finishes hiding. `Dialog.Content` drops
   its no-op `size` variant; non-modal `Dialog.Content` no longer enables
   RemoveScroll.
9. **Select: keep `name`.** Earlier guidance said to delete it; that was wrong
   and is retracted in the guide with a notice. Removing it drops the hidden form
   inputs and breaks form submission. `autoComplete` is removed from the root.
10. **Themed icons size through the font scale**, not the space/size scale, and
    no longer accept media or pseudo props (they no longer run full style
    resolution). Wrap them in a styled frame instead.
11. **ScrollView has its own web implementation** and no longer routes through
    react-native-web. Unsupported: momentum scroll events, `snapTo*`,
    `keyboardDismissMode`.
12. **`onDidAnimate` is gone**, replaced by typed `onTransition` (`{ phase, cause,
    finished? }`) firing at start and end of enter, exit and update. **The sheet
    no longer fades itself** and there is no baked-in overlay fade.
    `disableTransparencyHide` → `disableHideWhenClosed`.
13. **`$backgroundActive` theme token removed.** Checkbox/Switch checked states,
    Tabs active tab and ToggleGroup active toggle defaulted to it and had been
    silently doing nothing since it was removed; they now default to
    `$backgroundPress`.
14. Optional: Tailwind mode via `settings.styleMode`.
15. **`createTamagui` defaultProps deprecated.** Replacements: styling defaults →
    `variables`; default look → edit your copied component; prop propagation →
    `createStyledContext`.
16. **Imperative Toast removed.** `ToastProvider`+`ToastViewport` → `<Toaster />`;
    `useToastController().show(t, opts)` → `toast(t, { description: opts.message })`;
    `.hide()` → `toast.dismiss()`; `useToastState()` → `useToasts()`. `toast()` is
    global, no provider needed around callers.
17. **`ThemeableStack` and `SizableStack` removed** from `@tamagui/stacks`.
    `bordered` → `borderWidth: 1` + `borderColor: '$borderColor'`; `elevate` → the
    base `elevation` prop; `circular` → `borderRadius: 100_000`. For
    panels/wells/toolbars, copy the Surface fixture (`npx shadcn add surface`).
18. A verification checklist, plus a v1→v3 appendix (apply v1→v2 first). CLI
    helpers exist: `npx tamagui migrate --from v2` / `--from v1`.

---

## 4. Bugs found and fixed that nobody was looking for

These were not on any list. Each is worth knowing because each was invisible
until something forced it into the open.

### 4.1 The compiler emitted nondeterministic output (the big one)

`bundleConfig()` wrote the web and native bundles to the **same paths**
(`.tamagui/tamagui.config.cjs`). Those bundles are not interchangeable —
`bundle.ts` inlines `process.env.TAMAGUI_TARGET` as a literal via esbuild
`define`. A reuse check then skipped rebuilding when the output file was **less
than 3 seconds old**. So when two `tamagui build` invocations landed within 3s,
the web pass found the native pass's file "fresh" and loaded the **native**
bundle as the web config.

Native variables are `variable: ''`, so every CSS-variable-backed class
collapsed: `_gap-c-space-4` → `_gap-`, `_col-color12` → `_col-`. Web-only
`_pos-relative` / `_ws-normal` defaults vanished entirely.

This is a cache keyed on **elapsed time** over a **platform-ambiguous path**,
which is why isolated runs never reproduced it (40/40 clean standalone) while the
vitest suite (7 builds back-to-back sharing one `.tamagui`) failed ~25%.

Fixed by platform-scoping the paths. Same 30 cold runs: **7/30 failures → 0/30**,
byte-identical output.

Three things fell out of this:
- **A real behavioral bug**: native `pointerEvents="none"` was being deleted,
  because the native pass had been running with web semantics. Pointer events
  were not actually being disabled on native.
- The earlier "class ordering is cosmetic" framing was **wrong**. Classes were
  dropped and variable references emptied. That is a visual break.
- It retroactively explains a chain of wrong conclusions across several PRs,
  including one bisect that blamed an unrelated change and reverted it. That
  revert was undone.

**Why this matters for reading everything else:** nearly every green result
produced before this fix came from a build that could silently drop classes a
quarter of the time. That is the strongest argument that stopping to understand
the flake was worth the hours it cost.

### 4.2 Native Toast never rendered

`withStaticProperties` does `Object.assign(component, staticProps)` — it mutates
in place. The Toast skin composed straight onto the imported behavior component,
so `ToastBehavior.List` *became* the skin's `ToastList`, and that function reads
`.List` at render time, i.e. itself.

Native-only, because on web `tamagui` and `@tamagui/toast` resolve to separate
ESM instances so the mutation landed on a different object; on native both
resolve through one CJS instance.

Confirmed by runtime instrumentation rather than inference, and verified fixed on
the iOS simulator against the exact assertion that had failed 3/3 in CI.

This footgun fired **three separate times** in this campaign (Toast, four sibling
skins, and bento's radio skin, which hit infinite recursion and killed the
browser renderer). There is now a test for it, `SkinIsolation.web.test.tsx`,
rather than a comment.

### 4.3 Adjacent text children were not joined, and numbers were never wrapped

Your catch. `<Button>increment {name}</Button>` rendered as sibling text nodes:
visible gap, `ellipsis` and wrapping applied per fragment instead of across the
string, and assistive tech saw fragments rather than one label. Separately, the
check was `typeof child === 'string'`, so `<Button>Count: {5}</Button>` leaked a
raw number into the frame and threw "Text strings must be rendered within a
`<Text>` component" on native.

Both fixed. No snapshot changes were required, so compiled output of real screens
is unaffected. iOS had been hiding this by merging fragments into a single
accessibility element; only Android's stricter matcher told the truth.

### 4.4 `Dialog.Adapt` was dropped by the skin-isolation fix

Found and fixed in this session. The fix for 4.2's sibling case composed each
skin onto a fresh root, which means every static the behavior root exposed has to
be re-listed by hand. `Dialog.Adapt` was missed, which broke every
`<Dialog.Adapt>` call site in the repo and in user code.

The interesting part is that the isolation test did not catch it, because that
test also enumerated parts by hand. It now derives the expectation from the
behavior component itself, so a part cannot silently go missing from a skin
again. Verified by reverting the fix and watching the test fail, then restoring.

### 4.5 `accessibilityLabel` leaked to the DOM

`ToastComposable.tsx` forwarded `accessibilityLabel` to a DOM node, so React
logged "React does not recognize the `accessibilityLabel` prop on a DOM element"
for every toast on web. One-line fix, but it was console noise in every consumer
app.

### 4.6 Flat group syntax silently produced no styles

`$group-name-hover:prop` bailed in `parseFlatModifierProp` and produced no styles
at all, while spamming per-render dev warnings in Tailwind mode. Fixed with a
regression test.

---

## 5. Performance

### 5.1 Web, compiled, production builds

Apple M2, Bun 1.3.14, headless Chromium 145, 200 items / 60 heavy, 10 samples,
shuffled ordering, seed 72002. Raw retained samples in
`code/comparisons/output/benchmarks.json`.

**Mount (ms, mean of 10):**

| framework | simple | rich | group | heavy | animated |
|---|---:|---:|---:|---:|---:|
| **v3 (compiled)** | 0.54 | 0.54 | **19.30** | **18.83** | **15.84** |
| v3 (runtime) | 9.18 | 20.80 | 48.10 | 30.62 | 18.89 |
| **v2.4.6 (compiled)** | 0.47 | 0.51 | 43.81 | 24.85 | 21.49 |
| Tailwind 3.4.19 | 0.70 | 0.79 | 1.28 | 0.95 | 0.75 |
| Inline (React 19) | 1.02 | 1.60 | 2.55 | 2.02 | 1.30 |
| NativeWind v5 | 2.27 | 1.44 | 7.14 | 4.15 | 2.37 |

**Re-render (ms, mean of 10):**

| framework | simple | rich | group | heavy | animated |
|---|---:|---:|---:|---:|---:|
| **v3 (compiled)** | 2.98 | 4.46 | **29.75** | **24.57** | **20.27** |
| v3 (runtime) | 11.48 | 25.05 | 53.45 | 30.59 | 22.00 |
| **v2.4.6 (compiled)** | 2.94 | 4.16 | 49.02 | 26.30 | 22.91 |
| Tailwind | 3.36 | 2.92 | 8.12 | 3.87 | 3.94 |
| Inline | 2.75 | 3.49 | 7.86 | 5.23 | 2.87 |

**Read this as:** v3 compiled beats v2.4.6 compiled where it matters — group
mount **2.27x** faster, heavy **1.32x**, animated **1.36x**, group re-render
**1.65x**. Simple and rich are a wash (0.54 vs 0.47).

**And also as:** group mount is still **15x** Tailwind and **7.6x** inline. That
gap is pre-existing and is what Gate 4 exists to attack. v3 narrowed the gap to
v2; it did not close the gap to the field.

### 5.2 `optimizeFor` — the one architectural change

`settings.optimizeFor?: 'updates' | 'first-render'`, defaulting to `updates` on
web and `first-render` on native. First-render mode keeps theme/media reactive
through coarse subscriptions while skipping theme key tracking, the media
touched-key tracker, granular snapshot comparisons, and the createComponent
tracking setup.

| scenario | updates | first-render | delta |
|---|---:|---:|---:|
| simple | 4.70 ms | 3.83 ms | **-18.6%** |
| rich | 5.10 ms | 3.54 ms | **-30.6%** |
| heavy | 1.88 ms | 1.40 ms | **-25.5%** |

**Worth your attention:** this changes native defaults. If a native screen
depends on fine-grained theme reactivity mid-session, `first-render` is the mode
it now gets by default.

### 5.3 Hot-path work

The largest single allocation win: `getSubStyle` was doing
`styleState.props = { ...parentProps, ...styleIn }` per `hoverStyle` /
`pressStyle` / `$sm` / `$theme-dark`. A component with hover + press + 2 media
paid **4 full prop-object spreads per render**. Replaced with a prototype-chain
view.

One assumption was measured and found wrong: the plan believed the Motion driver
ran the full style pipeline every animation frame. Measured, the per-`setValue`
conversion costs **~7µs/call**, not a hotspot even at gesture rates. No rewrite
happened. The real duplication was a per-**render** full-props `getSplitStyles` in
MotionView at ~90µs per animated component per render, now memoized.

**Do not panic on dev profiler totals.** Dev-mode profiles are ~2.2x higher
post-merge (heavy 345 → 753 ms), but that is dev-only overhead: dev guards,
warning spam through the vite websocket, a larger dev graph. A pure-pipeline A/B
against a pre-merge worktree gave `getSplitStyles` pre ~90-96µs vs post
~87-102µs, i.e. no production regression.

### 5.4 Native performance is thinly measured

Only 2 of 6 scenarios were measured, and **there is no v2.4.6 native column at
all**:

| Scenario | v3 runtime | v3 compiled | NativeWind v5 | Uniwind | React Native |
|---|---:|---:|---:|---:|---:|
| Simple, mount | 78.1 | **17.1** | 28.5 | 22.4 | 19.2 |
| Themed, mount | 73.6 | **33.1** | 32.5 | 31.7 | 24.2 |
| Simple, re-render | 60.3 | **18.2** | 26.7 | 24.2 | 17.7 |
| Themed, re-render | 59.1 | **23.9** | 26.5 | 25.9 | 18.2 |

Compiled beats NativeWind and Uniwind on simple mount/re-render and is roughly at
parity with plain React Native. Rich, group, heavy and animated are all "not
measured". **The "v3 beats v2" claim is web-only.**

---

## 6. Things you should check

Ordered by how likely they are to bite.

1. **Sheet screens, especially fit sheets and scrollable content.** The
   Frame→Container+Background split plus the removal of the built-in fade is the
   most invasive visual change in the release. Two separate bugs already came out
   of sheet skin geometry (`padding:$5` and `flex:1` corrupting keyboard-lift and
   collapsing fit-mode scrollview).
2. **Active states after the `$backgroundActive` removal** — Checkbox, Switch,
   Tabs, ToggleGroup. These had been silently rendering nothing for the active
   state; now they default to `$backgroundPress`. That means they will *change
   appearance*, and the change is the fix.
3. **Anything using `onDidAnimate` or `onAnimationComplete`.** Both are replaced.
   A missed call site fails silently rather than loudly.
4. **Dialog/Popover/Select at Adapt breakpoints**, since the three now share one
   handoff model.
5. **Native pointer events.** `pointerEvents="none"` was genuinely broken on
   native before the compiler fix. If you had a workaround for that, it is now a
   double-negative.
6. **Native theme reactivity**, given the `first-render` default (§5.2).
7. **Bento.** Fixed but only partly proven — see §7.

---

## 7. Known gaps and open items

**Bento is fixed but not fully proven.** Checkbox and RadioGroup are runtime
verified. But `@tamagui/toast` is imported bare in 10 bento files, pulling a
stale rc.4 copy with its own singleton store, and it is not reachable from any
showcase route, so it compiles with no evidence that it works. Bento's `v3`
branch merges to bento main **together with** the tamagui.dev cutover, since
bento main must keep building against tamagui 2.4.x until prod flips. The
bento-complete site prod build is a **release gate**, not a merge gate.

**Bundle budgets were specified but never enforced.** This is the one Gate 4
sub-item that did not ship. `.github/scripts/compare-webpack-stats.mjs` only
emits a warning when gzip grows, and exits successfully. The integration test has
coarse absolute caps (60 KB CSS gzip, 500 KB JS gzip) and nothing else. Known
open findings behind that gate:
- `tamagui`'s index has 63 `export *` and Metro does not tree-shake, so
  `import { Button } from 'tamagui'` ships accordion, dialog, select, sheet,
  toast, menu, popover, slider and tabs — hundreds of KB in RN apps. Partially
  addressed by the v3 per-component subpaths, not recorded as closed.
- `getSplitStyles.mjs` ships ~53 KB with 29 `NODE_ENV` blocks and 20 `console.*`;
  `createComponent.mjs` ~42 KB with 39. Consumers without NODE_ENV replacement
  carry ~15-30 KB of dead debug code in the two hottest modules.
- `@tamagui/web` imports `twMerge` unconditionally and calls it only in Tailwind
  mode (27 KB min / 8.5 KB gzip if reachable).

**Two native CI items carried forward:**
1. `AdaptLiveSlotSpike` test 2 is flaky on Android. It merged green, but its
   first attempt failed on a full 10s timeout and passed only on retry. Recorded
   as a soft green rather than quietly accepted.
2. **Flakes that pass on retry retain no artifacts**, which is why (1) could not
   be diagnosed. Android log retention is failure-only. This is a prerequisite
   for fixing (1), not a nice-to-have.

**37 deliberately-skipped native tests** across `PressStyleNative`,
`SheetKeyboardDrag` and `SheetDragResist`, with identical counts on `main`.
Pre-existing and deliberate (SheetDragResist's are documented Detox `swipe()`
limitations), not silent CI skipping. The audit removed a dead SafeArea suite;
the rest were left. `PressStyleNative` (11 tests) and `GroupPressNative` (5) are
the two worth revisiting — note that `noRngh` is **not** duplicate coverage, it
is the responder-fallback half, so deleting the RNGH twin would leave the default
press path uncovered.

**An unfixed driver fragility:** a variant block on a `styled()` wrapper around an
animated node crashes the native Animated driver's interpolation. Worked around
by keeping v2-compat variants on the animated behavior frames. The driver itself
is unfixed.

**An unexplained Android result**, deliberately not "fixed" from first
principles: Android reported an element as 0% visible while the failure
screenshot shows it on screen and clear of the nav bar. Worked around with a
per-platform scroll anchor and documented in-code as needing a view-hierarchy
dump rather than reasoning.

---

## 8. CI reading traps (these cost real time)

**"Android Detox Tests" is SKIPPED on PR runs.** The job is gated on
`github.ref` being `main`, `v*`, or `rn82`. A `pull_request` run's ref is
`refs/pull/<n>/merge`, so Android only executes on the **push-triggered** run for
the branch. This is deliberate, and it is **not** the same as the greenwashing
bug that v3 fixed — there, Android reported success without being exercised.

**GitHub Actions branch globs: `*` does not match `/`.** So `v3-beta` matches
`v*` and gets push runs, but `v3/t12-v1-removal-surface` does **not** and never
got a push run at all. That is why the entire component contract was merged on
iOS + Maestro evidence alone, and why the first Android run it ever had was
post-merge.

Rule adopted: do not merge a native-affecting PR on the PR rollup alone.
Enumerate per SHA and read the `event=push` one.

**Concurrency cancels expensive runs.** Everything on `v3-beta` shares the
concurrency group with `cancel-in-progress: true`. Small doc pushes killed
expensive macOS/emulator runs three times. Batch pushes, or push while a run is
still queued.

---

## 9. What is left before release

1. **Explicit publish approval.** Nothing publishes automatically, and nothing
   should.
2. **Bento `v3` merges alongside the tamagui.dev cutover**, as a pair.
3. **The v2 track is separate.** `v2-animations-reliable` (#4142) targets `main`
   and must go green before any v2.4.x release. It is intentionally not folded
   into `v3-beta`.
4. Optional but recommended: land the bundle budget gate before calling it
   final, since §7 says the machinery exists and simply does not fail.

---

## 10. Where things live

- Campaign plan and audit trail: `plans/v3-beta-campaign-plan.md`
- The review that started it: `docs/reviews/v3-beta-review-2026-07-17.md`
- Migration guide: `code/tamagui.dev/data/docs/guides/how-to-upgrade.mdx`
- Benchmark raw samples: `code/comparisons/output/benchmarks.json`
- Perf lane detail: `plans/v3-perf.md`
- Skin isolation contract test: `code/ui/components-test/SkinIsolation.web.test.tsx`
