# v2-perf Follow-ups — Shipped

Sprint round following `v2-perf-shipped.md`. Four parallel tracks plus a fresh comparison-bench resample. Two tracks landed clean, one landed partial (3-of-5 fixes in scope), one is research-only pending bench wiring. All on branch `v2-perf`, not pushed.

## TL;DR

- **flat-modifier extraction** — shipped (1d98bcc150). Compiler now extracts the prop form `$group-row-hover:bg="red"` the same way it extracts the block form `$group-row-hover={{ bg: 'red' }}`. Closes the syntax gap for users who write the flat-modifier form. Zero runtime behavior change; bench numbers unmoved because the bench already uses block form.
- **native compiler under-folds** — partial (118e87993f). Fixed 3 silent-correctness bugs where `hoverStyle`, `$theme-*`, and `$group-*` block-form props were being serialized into the RN StyleSheet under their literal keys (RN ignores → styles never applied). Two confirmed already-correct on probe (`$sm`/`$md`/`$gtMd`, `$platform-*`). Two larger architectural fixes (pre-extracted pseudo sheet + styled() base-style skip) deferred — they need new core/web runtime helpers.
- **comparison bench resample** — Group hover compiled mount **19.6ms**, confirming the 396→20 win from last round. Tamagui compiled now beats NativeWind v5 by 2.8x on group-hover and ties Tailwind. Heavy mount slightly drifted (40.2 vs claimed 36) — within run-to-run noise on a contended machine.
- **native bench Tamagui column is runtime-only.** All of this round's compiler wins (flat-mod extraction, hoverStyle deopt, $theme/$group correctness) are invisible until `@tamagui/babel-plugin` is wired into the bench's metro config. This is the single highest-leverage follow-up.
- **vxrn upstream** — issue filing was authorized in the orchestrator brief but no track in this round produced a vxrn-side fix to file. Carrying forward.

## Web comparison bench (3-run avg, 500 components / 150 heavy, min+max dropped)

| Scenario | Tamagui (compiled) | Tamagui (runtime, 200x) | Tailwind CSS | Inline (baseline) | NativeWind v5 | Uniwind |
|---|---|---|---|---|---|---|
| **Mount (ms)** | | | | | | |
| Simple (static props) | **6.8** (0.9x) | 18.4 (2.6x) | 7.1 (1.0x) | 7.2 (1.0x) | 19.1 (2.7x) | n/a (timeout) |
| Rich (pseudo states) | **5.3** (0.9x) | 21.1 (3.5x) | 5.9 (1.0x) | 6.1 (1.0x) | 12.9 (2.1x) | n/a |
| Group hover | **19.6** (0.9x) | skip | 18.2 (0.9x) | 20.7 (1.0x) | 54.1 (2.6x) | n/a |
| Heavy page (150) | 40.2 (3.6x) | skip | 12.3 (1.1x) | 11.1 (1.0x) | 36.3 (3.3x) | n/a |
| Animated (spring) | 35.2 (5.8x) | 14.6 (2.4x) | 6.5 (1.1x) | 6.1 (1.0x) | 13.7 (2.2x) | n/a |
| **Re-render (ms)** | | | | | | |
| Simple | 9.2 (1.2x) | 14.2 (1.9x) | 7.9 (1.0x) | 7.6 (1.0x) | 16.0 (2.1x) | n/a |
| Rich | 9.7 (1.2x) | 18.7 (2.3x) | 6.6 (0.8x) | 8.0 (1.0x) | 14.5 (1.8x) | n/a |
| Group hover | 32.3 (1.5x) | skip | 20.3 (0.9x) | 22.1 (1.0x) | 34.6 (1.6x) | n/a |
| Heavy page (150) | 33.9 (3.0x) | skip | 11.8 (1.0x) | 11.4 (1.0x) | 29.3 (2.6x) | n/a |
| Animated (spring) | 38.2 (5.8x) | 14.2 (2.2x) | 6.6 (1.0x) | 6.6 (1.0x) | 14.2 (2.2x) | n/a |

### Tamagui compiled mount vs prior baselines

| Scenario | Pre-v2-perf | Post-v2-perf (last round, claimed) | This round | Δ vs pre | Δ vs last round |
|---|---|---|---|---|---|
| Simple | 7.2 | ~7 | 6.8 | -5.6% | -2.9% |
| Group | 396 | ~20 | 19.6 | **-95.1%** | -2.0% |
| Heavy | 149 | ~36 | 40.2 | -73.0% | **+11.7%** |
| Animated | 35.5 | ~37 | 35.2 | -0.8% | -4.9% |
| Rich | 7.2 | n/a | 5.3 | -26.4% | n/a |

Headlines:

1. **v2-perf web wins are durable.** Group is locked in at ~20ms (parity with Tailwind 18.2, beats NativeWind v5 54.1 by 2.8x, beats Inline 20.7).
2. **Heavy mount drifted +11.7%** versus the last round's claimed 36ms. Plausible contention: `tamagui-build:watch` PID 23622 was active, a parallel agent occupied the shared dev-server port. Re-run on a quiet machine before treating as regression. Heavy rerender stable at 33.9ms (3.0x Inline).
3. **Animated remains the open bench gap** — compiled mount 5.8x Inline, compiled rerender 5.8x Inline, runtime-200x sitting at 14.6/14.2 so the spring driver is scaling linearly past 200x. That says we're paying a constant per-mount setup cost that gets multiplied. Next sprint target.
4. **Uniwind silently dropped from the printed table** because its animated-rerender locator hit playwright's 180s wait. The HTML report nukes the whole column instead of one row — risk of misreading as "Uniwind has no web." Bench harness needs a per-scenario timeout (see Next up).
5. **Coverage matrix unchanged this run** — Tamagui 88.3% (86 full + 15 partial + 38 web-only + 10 none) vs NativeWind 87.9%. Tamagui edges ahead. Uniwind 40.6%.

Files: `code/comparisons/output/benchmarks.html`, `/tmp/web-bench.log`.

## Native comparison bench

3-run median, 200/60 components, iOS sim via Expo Go. **Tamagui (compiled) column is NOT implemented** — `run-benchmarks-native.ts:55` explicitly defers it pending `@tamagui/babel-plugin` wired into metro. So this entire native table is runtime-only for Tamagui.

| Scenario | Tamagui (runtime) | NativeWind v5 | Uniwind |
|---|---|---|---|
| **Mount (ms)** | | | |
| Simple | 83.3 | 41.1 | 49.0 |
| Rich | 136.1 | 43.3 | 44.5 |
| Group hover | 389.9 | 170.6 | 182.3 |
| Heavy (60) | 214.6 | 94.7 | 97.6 |
| Animated | 112.6 | 44.6 | 45.3 |
| **Re-render (ms)** | | | |
| Simple | 85.4 | 48.4 | 50.4 |
| Rich | 135.7 | 47.9 | 45.9 |
| Group hover | 413.8 | 173.1 | 187.3 |
| Heavy (60) | 224.5 | 93.8 | 101.9 |
| Animated | 112.8 | 47.6 | 48.5 |

Caveats:
- Tailwind / Inline have no native equivalents (web-only — correct).
- Uniwind only completed 2 of 3 runs (silent exit between run #2 animated and run #3); 2-run mean used. Tamagui + NativeWind have full 3-run median.
- Tamagui run #1 simple was a cold-cache outlier (127ms vs 81/83); median-of-3 correctly drops it.
- This run is uniformly ~30-55% slower than the prior 1-run baseline (Simple 62.5→83.3, Group 264→390, Heavy 138→215, etc.). Likely: `tamagui-build:watch` was active, sim contended with conformance/Expo Go sessions, prior baseline was fresh-boot. Relative ordering (Tamagui ~3-4x NativeWind/Uniwind on native runtime) holds.

Files: `code/comparisons/output/benchmarks-native.html`, `code/comparisons/output/benchmarks-native.json`, `/tmp/native-bench3.log`.

**Gating work to unblock the compiled column** is below in Next up.

## Per-track outcomes

### 1. flat-modifier extraction — shipped

Compiler now extracts the JSX prop form `$group-row-hover:bg="red"` and `$theme-dark:color="white"` the same way it extracts the block form. Babel parses these as `JSXNamespacedName` (namespace=`$group-row-hover`, name=`bg`), and the extractor's main loop at `code/compiler/static/src/extractor/createExtractor.ts:1318-1320` bailed when `attribute.name.name` wasn't a string — flat-modifier attrs hit the inlined fallback and never reached the `$group-*` / `$theme-*` extraction added in 7eacc19c2c. Fix: new helper `rewriteFlatModifierAttrs(openingElement)` at `createExtractor.ts:118-220` walks the openingElement attributes, finds JSXNamespacedName attrs whose namespace starts with `$`, and rewrites them into JSXIdentifier block-form attrs, merging multiple flat attrs on the same namespace into one block (preserving order). Called once per JSXElement at `createExtractor.ts:1028`, before the `ogAttributes` snapshot, so the bail-and-restore path naturally keeps the rewritten shape. 3 new tests at `code/compiler/static-tests/tests/babel.web.test.tsx:881-961` (canonical prop names — see follow-up #2 below for the shorthand gap). Full babel.web suite + web test suite green. Compile-time only; zero runtime behavior change. Commit **1d98bcc150**.

Bench impact: not separately measured because the bench app already uses block form throughout (`tamagui-bench/src/index.tsx:91/98/137/145/159`). Closes the syntax gap.

Track-local follow-ups:
- Extend `parseFlatModifierProp` at `code/core/web/src/helpers/getSplitStyles.tsx:131-216` to handle `$group-<name>-<pseudo>` (currently returns null at :210-212 with the comment "skip groups, they're more complex"). This is the runtime-side equivalent of this PR's compile-time fix — needed for `styleMode: 'tailwind'` users who want `className="group-hover:bg-red"`.
- Shorthand expansion inside synthesized `$group-*` block-form objects: `$group-row-hover={{ bg: 'red' }}` emits `bg: red` in atomic CSS instead of resolving `bg`→`background-color`. Verify whether this also affects authored block-form (likely does) — if so, fix in extractMediaStyle.ts / buildClassName.ts to resolve shorthands inside the inner style object before atomic emission.
- Bench `--runs=3` rerun once the parallel ~/tamagui-flat-styles worktree's dev-server PIDs (11647/47876/50532/59408) clear — first attempt produced empty output due to port contention.

### 2. native compiler under-folds — partial

Probed the 5 listed under-folds against fresh extractor output. **3 turned out to be silent correctness bugs, not perf misses:** `hoverStyle`, `$theme-*`, and `$group-*` block-form props were each serializing into the RN StyleSheet under their literal keys (`"hoverStyle"`, `"$theme-dark"`, `"$group-row-hover"`), which RN treats as unknown style props — the styles never applied at runtime. Fixed by mirroring the existing `pressStyle`/`focusStyle` deopt: added `hoverStyle` to the native deopt list at `code/compiler/static/src/extractor/createExtractor.ts:1135-1149`, and added a `$theme-*` / `$group-*` prefix check next to the existing deopt-pass at `:2543-2557` so they preserve as inline JSX props for the runtime to handle. Probed and confirmed fix #3 (media queries `$sm`/`$md`/`$gtMd`) and fix #5 (`$platform-*`) **already work today** — existing snapshots in babel.native.test.tsx cover `$md`/`$gtMd`, and the probe verified `$platform-ios`/`-android` correctly inline for runtime while matching-platform variants flatten. 3 targeted tests + snapshots added asserting the broken sheet-key serialization no longer appears and the props remain on the JSX. All 26 native tests pass (18 existing + 3 new + 5 flatten); 53 web tests pass. Commit **118e87993f** — kept clean to my 3 files via plumbing-based commit (co-tenant work in createExtractor.ts left intact in the working tree, not swept in). Did NOT ship the bigger architectural fixes:
- Fix #1: pre-extracted pseudo sheet row + new `_withPseudoStyle` runtime component with gesture listeners — needs new core/web runtime helpers that don't exist yet.
- Fix #2: `styled()` definition pre-extraction with runtime base-style skip — same gap.
- Fix #4: `$theme-*` via `_expressions` ternary — needs runtime theme-name observability in `_withStableStyle`; the deopt-pass fix in this commit takes the safer runtime path.

Native bench harness not yet wired (parallel track, see #4) so deltas unmeasured. Expected impact: any RN component using `hoverStyle` / `$theme-*` / `$group-*` block-form props in compiled output now actually applies those styles. **This is a correctness fix that was masquerading as a perf miss.**

Track-local follow-ups:
- Implement `_withPseudoStyle` runtime helper in `@tamagui/core` so compiled pseudo-style sheets can be looked up by row and merged with gesture state (current path emits an entire react component re-render to toggle one row).
- Implement `styled()` definition pre-extraction — currently every `styled(View, { ... })` call re-runs `getSplitStyles` on the base style at every mount of every downstream usage. Needs a runtime hook to accept a pre-built base sheet by id and skip the split.

### 3. comparison bench resample — shipped

See web + native sections above. Bench harness re-ran 3 runs with min/max drop for web, 3-run median for native. Confirmed last round's compiled web wins (Group 19.6, Simple 6.8, Rich 5.3). Surfaced 5 follow-up items already integrated into Next up.

Track-local follow-ups:
- Per-scenario timeout in `run-benchmarks.ts` instead of dropping a whole framework when one row times out.
- Investigate the silent native-bench exit between Uniwind run #2 animated and run #3 (no traceback in `/tmp/native-bench3.log`).
- Re-run web bench on a quiet machine to settle the Heavy +11.7% drift.

### 4. native compiler-column wiring — not started (gating)

The native bench's `run-benchmarks-native.ts:55` carries the explicit comment "A compiled-native column requires wiring @tamagui/babel-plugin into metro; deferred." This is the single largest leverage point for native: every compiler fix shipped this round (flat-mod extraction in #1, hoverStyle/`$theme-*`/`$group-*` deopt-correctness in #2, plus last round's `$group-*` / `$theme-*` CSS extraction) is *invisible* in the native bench until this lands. Tamagui-runtime sitting at ~3-4x NativeWind/Uniwind on native is **runtime-only**, not the number a downstream app actually ships with.

## vxrn upstream

No vxrn-side fix surfaced from this round's tracks. The orchestrator brief authorized issue filing upstream ("yes upstream it") but no track produced a concrete vxrn issue to file. Carrying the authorization forward to the next round.

## Next up — honest gap list

Ordered roughly by leverage.

1. **Wire `@tamagui/babel-plugin` into the native bench's metro config.** Unblocks a Tamagui (compiled) column on native. Without this, every compiler win from this and prior rounds is invisible to the bench, and the native 3-4x gap is misleading because it measures runtime-only. Roughly: tamagui-bench-native's `metro.config.js` needs to import the babel plugin, the bench's babel.config.js needs it in `plugins`, and the harness needs a `cap` switch (or a second tamagui column) to mount the compiled output.
2. **Animated bench gap.** Compiled mount 35.2ms (5.8x Inline) and rerender 38.2ms (5.8x Inline). Runtime-200x at 14.6/14.2 says spring driver setup is a constant per-component cost being multiplied. Profile the animation driver setup path in createComponent / useAnimatedProps.
3. **Heavy mount drift (40.2 vs 36).** Re-run on a quiet machine; if it persists, profile what changed since the last sprint. Most likely culprit: a regression in createMediaStyle cache hit rate (`code/core/web/src/helpers/getSplitStyles.tsx:1784`) or theme prep when 150 components mount in a tight loop.
4. **Bench harness hardening.** Per-scenario playwright timeout instead of dropping a framework. Stop silently nuking the Uniwind column from the HTML. Surface partial-run state in the table header.
5. **Native bench harness reliability.** Silent exit between Uniwind run #2 and #3. Add traceback capture + explicit framework completion accounting.
6. **Runtime parser group-modifier support** (track #1 follow-up). `parseFlatModifierProp` returns null for `group-*:`. Closes the tw-mode className gap for users on `styleMode: 'tailwind'`.
7. **Shorthand expansion in synthesized `$group-*` blocks** (track #1 follow-up). Likely also affects authored block form.
8. **`styled()` base-style pre-extraction + `_withPseudoStyle` runtime** (track #2 follow-ups). These are the two architectural under-folds deferred — both need new core/web runtime helpers. Highest leverage for downstream apps that lean on `styled()` heavily.
9. **Kitchen-sink E2E sweep** — not run this round. The compiler changes in tracks #1 + #2 mutate AST output in new shapes; should run `bun run test:web` from `code/kitchen-sink` against at least the default + css drivers to confirm no integration-test regressions.
10. **Bench publish to CF Pages** — still deferred from last round. Bench HTML output is reviewable only locally; publishing makes it shareable + comparable over time.
11. **vxrn upstream slot** — authorization carried forward, no concrete issue surfaced this round.

## Commits in this round (v2-perf, not pushed)

- **1d98bcc150** — `feat(compiler): extract flat-modifier prop syntax ($group-row-hover:bg) into CSS`
- **118e87993f** — native under-folds: hoverStyle deopt + `$theme-*`/`$group-*` block-form deopt-pass + tests

Branch is now 10 ahead of `flat-styles`. Per CLAUDE.md, did NOT push.
