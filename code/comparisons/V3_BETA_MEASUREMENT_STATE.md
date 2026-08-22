# V3 beta measurement state (updated 2026-08-22)

Records which retained numbers are trustworthy, which are load-caveated, and
which are known invalid, so nobody re-derives this from scattered logs.

## Trustworthy: byte measurements

Bundle output is deterministic. It does not depend on machine load, so
everything here stands regardless of how busy the box was.

### Current compiled and runtime result

At `1da76fbab4` on `v3-beta`, `metadata.dirty: true` only because of three
unrelated pre-existing untracked files:

- V3 is **9,381 gzip smaller** than V2 on compiled whole-app JS: 86,637 vs
  96,018. Tamagui-attributable gzip is 23,926 vs 33,417, a 9,491 byte
  reduction.
- Compiled CSS remains 67 gzip larger than V2: 1,107 vs 1,040.
- V3 runtime whole-app JS is 109,086 vs V2 95,669, a **+13,417 gzip** delta.
- The V2 compiled arm reproduced at 96,018 and its Tamagui chunk at 33,417.
  The React control reproduced within +3 gzip, so the run is valid.

Measured progression on the same four web arms and seed 73129:

| commit | change | compiled whole-app gzip | V3 vs V2 | change |
| --- | --- | ---: | ---: | ---: |
| baseline `84bc8edc062` | 11 of 14 candidates flattened | 111,757 | +15,739 | |
| `1c318a4cea` | flatten proven numeric and finite-literal dynamic host styles | 88,854 | -7,164 | **-22,903** |
| `4544722b64` | remove equivalent-color-spelling dedupe and its color table | 86,637 | -9,381 | **-2,217** |
| `26ee0b751a` | promote non-animatable animated styles in `directStyle` | 86,637 | -9,381 | 0 compiled, **-40 runtime** |

The color change also removes 2,162 runtime gzip. Equivalent spellings now
retain separate auto variables and declarations. A probe over `#1a2b3c`,
`rgb(26, 43, 60)`, `rgba(26,43,60,1)`, and `#1a2b3cff` produced `--t0` through
`--t3`, with each authored spelling preserved. The browser result is unchanged;
generated CSS carries the extra declarations.

### Runtime emitter audit

Rendered runtime-arm bytes at `1da76fbab4`, `metadata.dirty: true` only for the
three unrelated untracked files:

| module | V3 | V2 |
| --- | ---: | ---: |
| `directStyle.mjs` | 36,938 | 0 |
| `getSplitStyles.mjs` | 25,275 | 27,126 |
| `propMapper.mjs` | 12,540 | 7,362 |
| `variables.mjs` | 16,216 | 0 |

The module names made this look like two emitters, but the current call graph
does not contain two ordinary style emitters. Commit `12f7e0e981` replaced the
old `contributePrograms` / `evaluateAccumulatedPrograms` /
`lowerAccumulatedPrograms` backend with `directStyle`; it did not replace the
component splitter. Every ordinary host style, variant clause, and frontend
program reaches `contributeStyleValue` or its direct siblings, and
`directStyle` owns condition precedence, configured token resolution, CSS
normalization, and atomic generation.

`getSplitStyles` is 1,851 rendered bytes smaller than V2. It owns the public
splitter contract around the emitter: prop forwarding, HOC and `asChild`
behavior, variant dispatch, accepted sub-styles, context propagation, animation
handoff, parent-style merge, class assembly, and the React insertion effect.
The audit found one remaining atomic operation there: non-animatable styles
were emitted inline by `directStyle`, then promoted to an atomic class in a
second pass. `26ee0b751a` moved that decision to `directStyle` and removed the
second pass, saving 557 rendered bytes from `getSplitStyles` and 40 runtime
gzip.

Replacing the rest of `getSplitStyles` with `directStyle` cannot remove bytes
without removing those component semantics. Moving the same splitter code into
`directStyle` only changes its module name. An app with a genuinely
unflattenable Tamagui component therefore needs both the component orchestrator
and the single style emitter. Compiler specialization can remove both when it
proves a host element, which is the 22,903 gzip win above.

`propMapper` does not retain V2's configured token resolver beside the new one.
V2's roughly 240-line `getTokenForKey` and `resolveVariableValue` block moved to
`directStyle`; V3 `propMapper` hands ordinary strings to that backend and
imports its shared `getCondition`. Its growth is new behavior: conditional
variant clauses, the config-driven `Size | Space | Radius | ZIndex | Color |
Theme | Font*` resolver grammar, safe-area expansion, native `unset`, and
context/token provenance.

`variables.mjs` is also feature weight rather than a second copy of V2 theme
generation. V2 has no corresponding module. It implements config variables and
inline `<Theme>` value layers, including conditional/theme buckets, fixed-point
references, cycle handling, and native/web merged themes. It imports
`platformMatches` from `directStyle` instead of hardcoding platform precedence.

### Compiled plus global CSS output

The retained fixture can now measure the global-CSS ownership path with:

```sh
cd code/comparisons/tamagui-bench
EXTRACT=1 BENCH_OUTPUT_CSS=./generated.css \
  BUNDLE_ATTRIBUTION_FILE=/tmp/v3-css-output.json \
  bunx vite build --outDir /tmp/v3-css-output-build --emptyOutDir
```

At `1da76fbab4`, dirty only for the unrelated untracked files, the Tamagui JS
chunk is 55,227 rendered bytes and 20,807 gzip. The ordinary compiled arm is
63,776 rendered bytes and 23,926 gzip, so owning the global CSS artifact removes
3,119 Tamagui gzip. The shipped global CSS is 1,570 gzip.

Theme-related modules in the shipped JS:

| module | rendered bytes | result |
| --- | ---: | --- |
| `variables.mjs` | 16,216 | present for runtime inline theme values |
| `useThemeState.mjs` | 10,632 | present for runtime theme selection |
| `createTamagui.mjs` | 6,646 | present because the application constructs its runtime config |
| `Theme.mjs` | 4,636 | present for runtime theme scopes |
| `insertStyleRule.mjs` | 2,625 | present for runtime component/animation rules |
| `TamaguiProvider.mjs` | 2,085 | present |
| `createVariable.mjs` | 1,633 | present for runtime theme values |
| `createVariables.mjs` | 950 | present |
| `ThemeProvider.mjs` | 831 | present |
| `createDesignSystem.mjs` | 456 | generator branches stripped; small runtime setup remains |
| `themes.mjs` | 381 | present for theme names/classes |
| `getThemeCSSRules.mjs` | 0 | absent |
| `registerCSSVariable.mjs` | 0 | absent |

The CSS-generation modules are gone, while `createTamagui` and runtime theme
selection remain. Global CSS output strips theme CSS generation rather than the
runtime configuration and theme APIs.

### Superseded first pass from 2026-08-22

At `1c318a4cea` on `v3-beta`, `metadata.dirty: true` only because of three
unrelated pre-existing untracked files:

- V3 is **7,164 gzip smaller** than V2 on the compiled whole-app JS arm: 88,854
  vs 96,018.
- Tamagui-attributable gzip is 26,143 vs 33,417, a 7,274 byte reduction.
- Compiled CSS is 67 gzip larger than V2: 1,107 vs 1,040.
- The runtime arm is unchanged at +15,619 gzip. The compiled cut comes from
  compiler output and tree shaking.
- The V2 compiled arm reproduced at 96,018 and its Tamagui chunk at 33,417.
  The React control reproduced within +3 gzip, so the run is valid.

The source tree at `84bc8edc062` had drifted to **+15,739 compiled whole-app
gzip** before this work (111,757 vs the same V2 96,018). That measurement had
`metadata.dirty: true` only for the same unrelated untracked files. The
post-2026-08-15 drift includes later feature work and the
reintroduction of `normalize-css-color` by equivalent color spelling
deduplication in `registerCSSVariable`. The old +9,350 state is historical.

Whole-app gzip on the compiled bench arm, measured with all four web arms and
seed 73129:

| commit | change | whole-app gzip | V3 vs V2 | change |
| --- | --- | ---: | ---: | ---: |
| baseline `84bc8edc062` | 11 of 14 candidates flattened | 111,757 | +15,739 | |
| `1c318a4cea` | flatten proven numeric and finite-literal dynamic host styles | 88,854 | -7,164 | **-22,903** |

The compiled fixture retained exactly three runtime `View` calls before this
change: one finite color array lookup and two numeric width expressions. The
compiler now proves those narrow runtime domains and emits them as host inline
styles. It resolves each finite string candidate through the real style
resolver before accepting it, so tokens and values that would normalize or
expand still use the runtime path. Compiler stats moved from 11 flattened plus
3 partial to **14 of 14 flattened**, with zero partial and zero bailouts.

This removes the duplicated emitter stack from the compiled arm. The complete
`directStyle`, `getSplitStyles`, `createComponent`, `propMapper`,
`useComponentState`, and their dependent runtime helpers all tree-shake out.
Only 50 marginal gzip from `directStyle` remains for `platformMatches`, which
`variables.mjs` imports.

Per-module marginal gzip (`gzip(chunk) - gzip(chunk without the module)`) was
measured on the same resulting source tree at `84bc8edc062`,
`metadata.dirty: true`, with the compiler change pending. The committed
four-arm result above reproduced its whole-app bytes exactly at `1c318a4cea`.

| Δ gzip | module | judgment |
| ---: | --- | --- |
| +2,514 | `web/helpers/variables.mjs` | inline themes and configured variables; removing it removes public behavior |
| +2,249 | `@tamagui/normalize-css-color` | equivalent color spelling deduplication added after the earlier removal; deleting it changes generated CSS and needs a product decision |
| +1,940 | compiled fixture | application code, rather than Tamagui runtime |
| +876 | `animations-css/animated-number.mjs` | CSS animation behavior |
| +729 | `style-grammar/scanFlatValue.mjs` | inline theme and conditional value parsing |
| +575 | `style-grammar/valueParser.mjs` | inline theme and conditional value parsing |
| +398 | `@tamagui/core::runtime.mjs` | core setup retained by the compiled application |
| +331 | `style-grammar/states.mjs` | state grammar behavior |
| +63 | `style-grammar/stateModifiers.mjs` | state grammar behavior |
| +50 | `web/helpers/directStyle.mjs` | `platformMatches` only; the emitter itself is absent |
| -1,070 | `web/helpers/propMapper.mjs` | absent from V3 compiled output; V2 still ships it |
| -3,817 | `web/createComponent.mjs` | absent from V3 compiled output; V2 still ships it |
| -3,858 | `web/helpers/getSplitStyles.mjs` | absent from V3 compiled output; V2 still ships it |

`variables.mjs` and the remaining style grammar implement features a user
would miss. `normalize-css-color` is the only current candidate that could be
removed for another roughly 2,249 gzip, but doing so changes color equivalence
deduplication and needs Nate's decision.

Earlier investigations remain valid: Rolldown folds `isWeb` through
`directStyle`, the emitter had no isolated dead block, and the
legacy-object-syntax deletion was already included in the baseline. The native
style engine gate and color variant resolver change remain landed. The later
normalizer reintroduction supersedes the prior normalizer byte claim below.

### Historical 2026-08-15 snapshot

At `605a1659d3` on `v3-beta`, `metadata.dirty: false`, retained in
[`output/v3-v2-web-bundle-attribution.json`](./output/v3-v2-web-bundle-attribution.json):

- V3 costs **+12,052 compiled whole-app gzip** vs V2 (runtime +11,900).
- Tamagui-attributable gzip: V3 45,324, V2 33,424. Emitted JS +35,384.
- Compiled CSS is 986 bytes *smaller* than V2.
- The V2 arm (33,424 vs 33,418 twelve days earlier) and the React control
  (+2 raw bytes) both reproduce, so the run is valid and the movement is ours.

**Do not cite +9,534 or +27,096.** +9,534 was the same measurement at
`55a0c80c7c` on 2026-08-03; V3 had grown **+2,518 gzip since then**. +27,096
predated the direct-emission merge `12f7e0e981` entirely.

### Landed against that baseline

Whole-app gzip on the compiled bench arm, each step measured on the same
fixture, so these subtract from the +12,052 above:

| commit | change | whole-app gzip |
| --- | --- | ---: |
| (baseline `605a1659d3`) | | 105,032 |
| `5bc6b34d7f` | gate the native style engine out of web | 104,796 |
| `5e3b31bca9` | Color variant resolver takes any string | 104,696 |
| `359e29cc83` | stop normalizing theme colors, drop normalize-css-color from web | 102,328 |

**−2,704 gzip so far, putting the V2 delta near +9,350.** `normalize-css-color`
no longer appears in the web decomposition at all. The remaining ranking is
directStyle 5,478, variables 1,232, propMapper 1,224, animations-css 747,
style-grammar 1,058 combined, resolveSafeArea 386, core/runtime 377.

### Where the +11,900 lives

Per-module marginal gzip (`gzip(chunk) - gzip(chunk without the module)`),
from `bun code/comparisons/attribute-bundle-gzip.ts <v3out> --against=<v2out>`.
The marginals sum to 11,844 against a measured 11,900, so this decomposition is
complete to within 0.5%. Rendered (pre-minify) bytes rank modules wrong here:
`normalize-css-color` renders 7,249 bytes but is mostly a lookup table.

| Δ gzip | module | what it is |
| ---: | --- | --- |
| +5,451 | `web/helpers/directStyle.mjs` | the direct emitter, added *alongside* getSplitStyles rather than replacing it |
| +2,280 | `@tamagui/normalize-css-color` | 2,709 minified bytes of it is the CSS color-name table (theme determinism, `55980590f1`) |
| +1,326 | `web/helpers/propMapper.mjs` | variant resolvers |
| +1,228 | `web/helpers/variables.mjs` | Variables feature |
| +1,110 | `@tamagui/style-grammar` runtime | clausePrecedence 488, modifierRegistry 292, states 287, stateModifiers 43 |
| +745 | `animations-css/createAnimations.mjs` | transition prop |
| +434 | `resolveSafeArea` + `resolveSafeAreaVariable` | |
| +377 | `@tamagui/core::runtime.mjs` | |
| +268 | `web/helpers/nativeStyleEngine.mjs` | native-only, was reaching web (fixed, see below) |
| +207 | `helpers/tokenCategories.mjs` | |
| ~+900 | createTamagui, insertStyleRule, createComponent, useComponentState, others | |
| −2,900 | deleted V2 helpers | createMediaStyle 518, getTokenForKey 518, core/index 367, themeable 276, pseudoTransitions 232, getSplitStyles 197, pseudoDescriptors 182, validStyleProps 180, others |

Two things this rules out, both previously suspected:

- **`isWeb` does fold.** Rolldown constant-propagates `export const isWeb = true`
  across modules, so `!isWeb` branches in `directStyle` are already gone in a web
  build (`fontVariant` and `parseNativeTransform` do not appear in the emitted
  chunk). Only 963 of directStyle's 1,782 source lines survive. Its 17,582
  minified bytes are real web emitter work, spread evenly across `emitValue`
  (2,500), `directAtomic` (1,656), `getCondition` (1,611), and ~30 smaller
  functions. There is no dead lump to cut.
- **The legacy-object-syntax deletion is already priced in.** `96f6d5574a`
  landed 2026-08-01, before the +9,534 baseline. It bought nothing further.

What *did* regress since 2026-08-03 (rendered bytes): style-grammar's runtime
tables went 0 → 7,375 via `d2aaf8b8b4` (clause merge precedence), propMapper
+2,638, directStyle +2,514, nativeStyleEngine 0 → 1,610.

`nativeStyleEngine` reaching web was a real leak, not feature weight:
`views/Theme.tsx` called `updateNativeStyleScope` on every platform, and on web
those calls only mutate a Map no engine ever reads. Gating the effect body on
`process.env.TAMAGUI_TARGET === 'native'` drops the module entirely and measures
**−236 whole-app gzip** (105,032 → 104,796).

### Freshness trap that produced that stale number

`git checkout` and `bun install` do NOT rebuild workspace `dist` (it is
gitignored), and a turbo cache restore stamps fresh mtimes regardless of which
entry it restored. **Verify by content, never by timestamp:**
`code/core/web/dist/esm/helpers/getSplitStyles.mjs` must reference
`directStyle` and contain zero references to `contributePrograms` or
`evaluateAccumulatedPrograms`.

## Load-caveated: timing measurements

The machine carried other projects' dev servers and watch builds throughout.
Every retained timing run therefore ships an attributed load trace, and
retention required that mean, median and 20% trimmed mean agree, so no
conclusion rests on outliers. Treat the direction as sound and the absolute
values as soft.

- Web compiled animated **mount**: 13.20x → **1.42x** (V3 0.597ms vs V2
  0.420ms, paired CI +0.098 to +0.256). This replaces the old 13.2x figure.
- Web compiled animated **rerender**: 1.086x, paired CI crosses zero, so V2 and
  V3 are statistically indistinguishable.
- Web runtime simple mount: 1.233x.
- Native runtime simple mount: V3 27.49ms vs V2 23.98ms, paired CI +2.36 to
  +4.65.

Two web/native campaigns were discarded rather than published after their
outlier checks aligned with recorded load transients. Absolute values in any
run taken while idle sat below ~70% should be re-measured on a quiet machine
before being quoted publicly.

## Known invalid: native compiled cells

`output/benchmarks-native-v2-v3.json` carries `validity.status = partial`.
`tamagui-v3-compiled` is invalid; `tamagui-v2-compiled`, `tamagui-v2-runtime`
and `tamagui-v3-runtime` are valid.

Root cause: compiled plans are generated but never applied at runtime, so the
V3 compiled arm ships the runtime path. The internal control that detects this
cheaply, and which is now a permanent harness gate:

> compilation must make an arm materially faster than its own runtime arm.
> V2 shows ~5x (67.00ms runtime → 13.30ms compiled). A broken V3 shows ~1x
> (69.67ms → 76.68ms). Anything under 1.50x means the plans are not being used
> and the campaign must not run.

`2acce54e05` (metro-plugin, plan delivery) did **not** resolve it: the gate
still failed with that commit in the build and compiler evidence reporting 7/7
static and 3/3 dynamic lowered with zero bailouts. Plan generation and plan
delivery are separate layers and at least one was still wrong.

**RESOLVED 2026-08-03.** The third delivery defect: Expo Release builds bundle
via `expo export:embed`, whose Metro workers receive Babel options
(customTransformOptions engine=hermes, type, publicPath) that the metro-plugin
frontend could never see, so every plan failed its compiled-hash guard and
shipped unlowered — loudly (`metro/plan-miss: compiled-hash-mismatch`) but
only in that flow. Fixed by planning against raw source (metro-plugin cache
schema v4): workers apply plan edits to the raw module before their single
Babel pass, so Babel option divergence can no longer invalidate delivery.
Gate re-run on a quiet machine (idle >= 88% before and after): **V3 4.37x
(30.01ms runtime -> 6.87ms compiled), V2 4.70x, bar 1.50x — PASSED.** The
retained cells in `output/benchmarks-native-v2-v3.json` are still the OLD
invalid data; a full retained campaign is still required before quoting
native compiled numbers. See `plans/v3-metro-lowering-2026-08-03.md`.

## Open, owned elsewhere

- **Theme-token background dropped on native.** `bg="background"` lowers to a
  fully flattened RN `View` with no `backgroundColor` and no runtime consumer
  that could re-add it. A negative control showed forcing `bg → backgroundColor`
  drops it identically, so the v6 shorthand mapping is not the cause. Product
  direction: `background` is not web-only; it must work on native as closely to
  web as possible. Fixture assertion is correctly red; do not align it.
- **Presence lifecycle cluster.** AnimatePresence enter plus Dialog
  focus/pointer/presence fail on native, reanimated and motion while CSS
  passes. Under joint triage; do not report the Dialog and AnimatePresence
  failures as independent, the shared-cause hypothesis is untested rather than
  disproven.

## Resolved

Motion SSR hydration: the driver applied styles via raw
`Object.assign(node.style, ...)`, which silently ignores RN-format unitless
numbers, so hydrated elements lost every animatable style and rendered at 0x0.
Fixed in `0503336520`; confirmed green in CI, and the guarding test passed
unmodified rather than being adjusted to fit the fix.
