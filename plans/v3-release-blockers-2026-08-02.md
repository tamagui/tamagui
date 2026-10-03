# V3 release blockers: bundle size and perf, analyzed 2026-08-02

Source evidence: branches `origin/validate/v3-web-flatten` (web bundle
attribution, corrected web benchmark, regression profiles; commits `8fa0e3ac53`,
`fd1cb9b187`, `90e2e8637a`) and `origin/validate/v3-native-runtime` (native
harness + `code/comparisons/output/benchmarks-native.json`). All numbers below
were read from those committed artifacts, not re-measured.

## Finding 1: web bundle is +29.3 KB gzip (+31%) over V2

Compiled arm: V3 JS 377,550 B (122,352 gzip) vs V2 283,472 B (93,098 gzip).
Runtime arm shows the same +94 KB raw / +29 KB gzip delta, so the compiler
saves essentially nothing on bundle size (377.5 KB compiled vs 376.5 KB
runtime).

Module-group attribution of the delta (rendered bytes, from
`v3-v2-web-bundle-attribution.json`):

| group | v3 | v2 | delta |
|---|---|---|---|
| @tamagui/style-grammar | 98,965 | 0 | +98,965 |
| @tamagui/web | 225,825 | 165,619 | +60,206 |
| @react-native/normalize-color | 10,816 | 0 | +10,816 |
| @tamagui/animations-css | 18,937 | 12,488 | +6,449 |
| build/runtime helpers | 5,918 | 2,329 | +3,589 |
| @tamagui/portal | 0 | 3,459 | -3,459 |

The structural cause: the new grammar/program engine was ADDED next to the old
resolution path instead of replacing it. `getSplitStyles.mjs` is still 27 KB
(byte-parity with V2), `propMapper.mjs` DOUBLED (7.4 KB to 15.2 KB), and the
new pipeline (`grammarConfig` 10.8 KB, `contributePrograms` 10.8 KB,
`evaluateAccumulatedPrograms` 10.3 KB) ships on top. Two style engines coexist
in every bundle.

Concrete platform leaks confirmed in source (v3-beta worktree):

- `code/core/web/src/helpers/alignTransitions.ts` imports and calls
  `validateNativeTransition` from `@tamagui/style-grammar` even though the web
  build's `detectNativeTransitionTarget()` (`nativeTransitionTarget.ts`)
  always returns null. This drags the entire native transition capability
  matrix (`transitionNative.mjs`, 7.4 KB rendered) into every web bundle for a
  call that can never do anything on web.
- `@tamagui/normalize-css-color/src/index.ts` wraps
  `@react-native/normalize-color` (the full RN color parser + named-color
  table, 10.8 KB) and is reached on web via
  `code/core/web/src/helpers/normalizeColor.ts` / `themes.ts`. V2 shipped none
  of this on web.
- `@tamagui/style-grammar` has `sideEffects: false` and a flat `export *`
  barrel, so everything retained is genuinely reachable from runtime imports:
  registry, every family (background, border, transform, text-decoration,
  font, geometric), valueParser, transition + transitionAlign +
  transitionLegacy + transitionNative. Whether each of those NEEDS to be
  reachable at runtime (vs compiler-only or lazily) is unexamined.

## Finding 2: compiled animated web path is ~13x slower to mount than V2

From `v3-v2-web-regression-profile.json` (paired, n=20): mount 7.59 ms vs
0.575 ms (ratio 13.2), rerender 8.04 ms vs 2.70 ms (3.0x). Cause is recorded
with compiler evidence: V3 bails on transition-bearing animated candidates
(`local/unsupported-target`, 10/14 flattened) that V2 lowered (11/14 plus 14
legacy-optimized), leaving them on the runtime path. The corrected benchmark
medians agree: animated compiled mount 7.35 ms (V3) vs 0.50 ms (V2). On every
other compiled scenario V3 matches or beats V2.

### Finding 2 root cause, traced in source

The benchmark's animated fixture is a `View` carrying `transition="bouncy"` plus
five static style props (width, height, borderRadius, backgroundColor, margin)
and two dynamic ones (opacity, scale). The bench config defines the preset as a
literal CSS timing string:

```ts
const animations = createAnimations({
  bouncy: '350ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
})
```

`code/compiler/static/src/compilerHost.ts:576` `isStaticCssTransition` accepts a
transition only when every parsed entry has `timing.type === 'css'`.
`parseTransition` (`code/core/style-grammar/src/transition.ts:336-355`) returns
`timing: { type: 'preset', name }` for a registered preset name, so a preset
never satisfies the check, and the guard at
`code/compiler/static/src/compilerHost.ts:930-941` bails the whole candidate as
`local/unsupported-target`.

Two consequences, and the second is the expensive one:

1. The transition itself stays on the runtime path.
2. The bailout returns BEFORE the partial-extraction path at
   `compilerHost.ts:959`, so the five STATIC style props are not extracted
   either. All of them resolve at runtime, on 200 elements. V2 partially
   extracted exactly these, which is why V2 mounts in 0.5 ms and V3 in 7.6 ms.

The preset value is already available to the compiler (`transitionPresetNames`
at `compilerHost.ts:573` is built from `tamaguiConfig.animations.animations`),
so a CSS-driver preset is statically resolvable into the existing, tested
static-CSS-transition lowering path. The safe test is value-shaped rather than
driver-identity-shaped: a preset whose configured value is a string parsing as a
valid CSS transition timing can be substituted; spring/object presets
(reanimated, motion) must keep bailing.

## Finding 3: uncompiled runtime web is slower where it counts

Corrected benchmark medians: simple mount 8.0 ms vs 4.65 ms (1.7x), group
14.9 ms vs 11.2 ms (1.3x). The source-mapped profile shows no single hotspot;
the cost is distributed across the framework (consistent with running the
program engine on top of, not instead of, the old path).

## Finding 4: native runtime is ~4x plain RN

From `benchmarks-native.json`: Tamagui runtime mount 78.1 ms (simple) vs React
Native 19.2 ms, NativeWind 28.5 ms, Uniwind 22.4 ms. Compiled native is
competitive (17.1 ms). The V2-vs-V3 native retained record
(`benchmarks-native-v2-v3.json`) was never committed, so V2-parity on native is
unproven.

## Workstreams

Owner: the main (Fable) session takes the hardest, engine-sensitive work.
A codex manager fans out up to 4 codex workers (effort high/xhigh) on the
bounded, non-sensitive items. Workers must NOT touch
`code/core/web/src/helpers/getSplitStyles.tsx`, `propMapper.ts`,
`createComponent.tsx`, or `code/compiler/**` — those are owned by the main
session and edits will conflict.

### Main session (not delegated)

- M1: compiler lowering for transition-bearing animated candidates (removes
  the 13x compiled-animated mount regression). Correctness-critical compiler
  feature.
- M2: dual-engine consolidation in `@tamagui/web` (propMapper doubling,
  getSplitStyles + program pipeline coexistence). This is also the main lever
  on Finding 3 and much of the +60 KB in Finding 1.
- M3: native runtime resolution cost (Finding 4), which shares a hot path
  with M2.

### Manager fan-out (bounded, measured, non-sensitive)

- W1 platform de-leak: web bundles must not include
  `@react-native/normalize-color` or `transitionNative`. Give
  `@tamagui/normalize-css-color` a small web implementation (or fork the one
  import site), and restructure `alignTransitions` so the native validation
  call is only in the native graph (the web fork already proves target is
  always null). Verify by re-running the attribution harness: both groups at 0
  rendered bytes on web.
- W2 style-grammar runtime surface audit: for each module retained in the web
  bundle (registry 10.6 KB, transformFamily 10.8 KB, transition 11.1 KB,
  resolvePayload 7.8 KB, lowerProgram 5.7 KB, backgroundFamily 5.0 KB,
  valueParser 4.3 KB, transitionLegacy, toolingDiagnostics, table,
  v6ThemeNames...), establish whether the runtime genuinely needs it or it is
  compiler/tooling-only surface leaking through the barrel. Split entry points
  so tree-shaking can drop what runtime does not use; shrink obvious data
  tables. Measured before/after with the same harness.
- W3 remaining growth: `@tamagui/animations-css` +6.4 KB and build/runtime
  helpers +3.6 KB — attribute and trim; also confirm the CSS output difference
  (V3 emits less CSS but more JS; check nothing moved from CSS into JS
  strings).
- W4 measurement + native record: keep the harness honest. Re-run
  `code/comparisons/run-benchmarks.ts` (branch `validate/v3-web-flatten`, with
  `shared/bundleAttributionPlugin.ts`) after each landed fix and record deltas;
  complete and commit the missing native V2-vs-V3 retained record per
  `code/comparisons/NATIVE_V2_V3.md` if a simulator is available.

## Constraints for all spawned work

- Branch: fixes go on `v3/bundle-slim` off `v3-beta`. Never push `main`,
  never publish or release anything.
- REVIEW: none — validation is by harness re-measurement; the user reviews the
  assembled result.
- Every claim of "bytes saved" must come from the attribution harness, not
  from file-size guesses.
