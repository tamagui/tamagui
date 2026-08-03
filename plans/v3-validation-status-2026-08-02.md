# V3 validation status — 2026-08-02

## Decision

V3 is **not release-ready** on the validated evidence.

The current branch has substantial compiler and React Strict DOM progress, but release approval is blocked by:

1. a repeatable web regression when a transition-bearing candidate remains on the runtime path;
2. about 29 KB gzip of additional JavaScript in the minimal V3 web product;
3. a compiler-disabled simple-mount regression in the retained web sample;
4. nominal native V3 regressions in 16/18 runtime metrics and all six compiled mount/remount metrics, about 15% larger recorded raw native bundles, and no fair broad cross-version production-app compiler corpus;
5. React Strict DOM differences that prevent a full package/API/protocol meet-or-exceed claim; and
6. the draft V3 pull request's merge conflict and failing/skipped release checks.

This report distinguishes direct observations from causal conclusions. In particular, the real tamagui.dev snapshots use different source revisions and are not an apples-to-apples optimizer experiment. The byte-identical synthetic workloads are the controlled V2/V3 comparisons.

## Reference revisions

- V3 product under test: `3c4941255e983e14734e7baa86e4e40758b18a6b` plus the fixes and validation artifacts integrated by this campaign.
- V2 product: stable/main `2.6.2`, Git revision `1c8cc029cd`, with exact registry lockfile integrity recorded in the fixtures.
- React Strict DOM reference: canonical `react/react-strict-dom` version `0.0.55`, commit `c877f5c19b141e25c089d993b4cc584e669b6e39` dated 2026-06-23. The legacy `facebook/react-strict-dom` URL redirects to that repository.

## Web optimizer and flattening

### Real tamagui.dev source snapshots

| Snapshot                    | Selected source      | Found | Flattened | Runtime | Flatten rate |
| --------------------------- | -------------------- | ----: | --------: | ------: | -----------: |
| V2/main + Bento `06163a598` | homepage-owned paths |   251 |       195 |      56 |       77.69% |
| V3 + Bento `53b809899`      | homepage-owned paths |   277 |       225 |      52 |       81.23% |

The observed V3 slice is +3.54 percentage points and has four fewer runtime candidates, but this must not be reported as a causal optimizer improvement. The selector is only `app/(site)/index.tsx` plus `features/site/home/**`, not the transitive rendered homepage/Bento graph. Those selected paths changed by 434 insertions and 581 deletions between the product revisions.

V3's complete production site build found 2,564 candidates, flattened 2,073, partially lowered 13, and left 491 non-flat including partials: 80.85% fully flattened. The V3 homepage-owned slice's 52 bailouts are led by unsupported targets (20), dynamic style values (16), and unsafe spreads (16), with two unresolved bindings also recorded. The site-wide artifact does not embed a source revision, so those totals are recorded campaign results rather than independently source-bound evidence.

### Controlled compiler/runtime workload

The controlled web workload has byte-identical V2/V3 source and config:

- workload SHA-256 `56dd6ba8bb07f9ee8537096f8ab7a98f6f822c94b35bfbcf9ed33356e0a22c99`;
- source SHA-256 `4bbf2de845876f99203484ee6ef4c1cdf22543407441b4b1494c07ba47b3ae9e`;
- config SHA-256 `cc2569cc5a30c5df8ae3fca81451ebfbd0f9dceb9eff31911fa4f61f485e6324`;
- production builds and previews only;
- Chromium 145 on one Apple M5 machine;
- seed 73129, two warmups and 20 retained samples per cell, 440 trials total; and
- independently randomized framework/scenario order in each round.

The final behavior gate proves exact V2/V3 styles and host counts in all four arms and preserves the same DOM node across each update. The transition case observes start, intermediate, and final opacity/scale values and retains its transition/layout semantics.

### Web timing results

Ratios below are V3/V2 means. Differences are paired V3 − V2 milliseconds with 95% t intervals. “Update” is a same-node update, not a remount.

| Mode / scenario               | Mount ratio; paired difference [95% CI] | Update ratio; paired difference [95% CI] |
| ----------------------------- | --------------------------------------- | ---------------------------------------- |
| compiled / simple             | 1.186×; +0.080 [-0.060, +0.220]         | 1.074×; +0.110 [-0.201, +0.421]          |
| compiled / rich               | 0.989×; -0.005 [-0.158, +0.148]         | 0.693×; -0.740 [-1.437, -0.043]          |
| compiled / group              | 0.801×; -0.260 [-0.616, +0.096]         | 0.741×; -1.190 [-2.271, -0.109]          |
| compiled / heavy              | 0.802×; -1.000 [-2.047, +0.046]         | 0.825×; -0.710 [-1.399, -0.021]          |
| compiled / transition-bearing | **13.200×; +7.015 [+5.601, +8.429]**    | **2.983×; +5.345 [+3.974, +6.716]**      |
| runtime / simple              | **1.486×; +2.565 [+0.924, +4.206]**     | 1.097×; +0.140 [-0.062, +0.342]          |
| runtime / rich                | 0.973×; -0.295 [-2.557, +1.967]         | 0.643×; -0.740 [-1.105, -0.375]          |
| runtime / group               | 1.183×; +2.480 [-1.080, +6.040]         | 0.954×; -0.435 [-3.030, +2.160]          |
| runtime / heavy               | 0.890×; -1.205 [-3.637, +1.227]         | 0.888×; -0.800 [-1.648, +0.048]          |
| runtime / transition-bearing  | 1.154×; +1.075 [-0.699, +2.849]         | 0.919×; -0.660 [-2.208, +0.888]          |

The 20 cells use unadjusted intervals from one seed/machine/browser. Marginal non-crossing intervals are nominal signals, not general performance wins after multiple-comparison correction.

The strongest result is the compiled transition-bearing regression. V3 fully flattens 10/14 candidates and leaves the transition-bearing `View` on the runtime path with `local/unsupported-target`; V2 flattens 11/14. The whole-profile source map records 96.244 ms of V3 self time in `@tamagui/web` and 12.535 ms in `@tamagui/animations-css`, versus zero in those V2 module groups. Together with 10/14 versus 11/14 flattening, that is consistent with runtime-path cost, but it neither isolates the one bailout as the cause nor attributes samples to a specific node; roughly 4.10-4.29 seconds in each profile remains browser/unmapped. This is not an animation-frame-rate or smoothness measurement.

The compiler-disabled simple mount is also slower in the retained sample. Its profile does not isolate one dominant V3 hotspot; mapped cost is distributed across framework, element-layout, fixture, React, and scheduler work. Other compiler-disabled scenarios are mixed or inconclusive, so the evidence does not support the blanket statement that all V3 runtime rendering is slower.

### Web artifacts

For the minimal controlled product:

| Mode     | V3 − V2 raw JS | V3 − V2 gzip JS | V3 − V2 raw CSS | V3 − V2 gzip CSS | Total gzip delta |
| -------- | -------------: | --------------: | --------------: | ---------------: | ---------------: |
| compiled |      +94,078 B |       +29,254 B |        -1,012 B |           -126 B |    **+29,128 B** |
| runtime  |      +94,939 B |       +29,261 B |            -6 B |              0 B |    **+29,261 B** |

Pre-minification rendered-module lengths point qualitatively to the V3 `@tamagui/style-grammar` and `@tamagui/web` surface. They do not allocate the compressed-byte delta to individual packages. These are current-product comparisons: the workspace manifests still report `2.5.1`, while the registry V2 fixture is `2.6.2`; they are not an isolated experiment on one architectural change.

An earlier web benchmark artifact used different configs and measured remounts. It is discarded and superseded by the byte-identical, same-node artifacts described above.

## Native optimizer and runtime

The controlled native campaign used four clean, source-bound standalone Release apps built from native branch commit `da80f52af4bf7eaf8af99195371d2cff644cc7eb` on one iPhone 17 Pro simulator (iOS 26.4) on an Apple M5 host. All 35 distinct harness/app files covered by its 50 recorded hash entries remain byte-identical on the integrated branch; this does not mean `da80f52` is an ancestor of the integration commit. It ran seed 73129, two warmup rounds, and 12 retained rounds. Each round shuffled all 18 framework/scenario cells once: 252 total dispatches, comprising 36 warmup and 216 retained trials. The runner accepted no retries or manual semantic confirmations. The recorded clean flag and build IDs bind the fixture/harness/app inputs, not every workspace package or generated `dist` implementation.

Every runtime arm first passed equivalent raw-style, token, active pseudo, active group, and real `Button` behavior gates. The V2 and V3 resolved native-style signatures were identical. The compiled fixture was byte-identical across versions; the verifier applied both compiler outputs and checked the expected host styles, stable-key updates, source hashes, and production build identities.

Ratios below are V3/V2 means. Differences are paired V3 - V2 milliseconds with 95% t intervals. Mount and remount results are the useful compiler comparison; compiled updates deliberately change opacity on identical React Native wrappers so that every static Tamagui candidate remains compiler-eligible.

| Mode / scenario          | Mount ratio; paired difference [95% CI] | Update ratio; paired difference [95% CI] | Remount ratio; paired difference [95% CI] |
| ------------------------ | --------------------------------------- | ---------------------------------------- | ----------------------------------------- |
| runtime / simple         | **1.379x; +7.712 [+4.058, +11.367]**    | **1.396x; +6.088 [+4.983, +7.194]**      | **1.306x; +5.465 [+4.424, +6.505]**       |
| runtime / themed         | **1.420x; +7.885 [+5.799, +9.971]**     | **1.218x; +3.595 [+1.944, +5.245]**      | **1.248x; +4.339 [+3.220, +5.459]**       |
| runtime / rich           | **1.518x; +18.731 [+12.217, +25.246]**  | **1.562x; +15.291 [+14.198, +16.383]**   | **1.534x; +16.480 [+15.411, +17.549]**    |
| runtime / group          | **1.189x; +15.649 [+13.446, +17.853]**  | **1.342x; +12.040 [+9.885, +14.194]**    | **1.220x; +17.086 [+14.020, +20.151]**    |
| runtime / heavy          | **1.253x; +11.862 [+7.871, +15.852]**   | **1.286x; +6.885 [+5.832, +7.939]**      | **1.238x; +9.853 [+8.618, +11.087]**      |
| runtime / component      | 0.988x; -0.601 [-4.429, +3.227]         | **1.327x; +7.726 [+6.237, +9.215]**      | 0.999x; -0.063 [-1.522, +1.395]           |
| compiled / simple        | **5.161x; +19.298 [+17.780, +20.815]**  | 1.021x; +0.016 [-0.163, +0.195]          | **5.486x; +18.737 [+18.216, +19.258]**    |
| compiled / nested static | **6.071x; +32.646 [+30.248, +35.044]**  | 1.052x; +0.019 [-0.084, +0.123]          | **5.919x; +28.370 [+27.676, +29.065]**    |
| compiled / styled static | **1.500x; +4.301 [+2.900, +5.701]**     | 0.997x; -0.001 [-0.039, +0.037]          | **1.497x; +3.645 [+2.958, +4.333]**       |

The artifact contains 33 paired effects in total. They are unadjusted nominal 95% intervals from 12 pairs, one seed, one Apple M5 host, and one iOS Simulator, so they are descriptive evidence rather than cross-device population guarantees.

V3 is therefore slower in 16/18 retained runtime intervals; only component mount/remount are inconclusive. The V3 compiled paths have similar wrapper-only update cost, but all six compiled mount/remount intervals are slower, from about 1.50x for styled static through 6.07x for nested static. No cross-version native interval favors V3. On the simple fixture, V2 compilation reduces mount by 77.2% and remount by 76.6%; the corresponding V3 effects are only 14.7% and 1.7%, and both V3 intervals cross zero. Within the deliberately separate control paths, V3's compiled wrapper update is 0.0354x its runtime update, with a paired difference of -20.699 ms [-21.422, -19.975]. This is a release-blocking native regression, not optimizer parity.

The native JSON records larger uncompressed embedded `main.jsbundle` artifacts: runtime V3 is 3,180,469 bytes versus V2's 2,767,187 (+413,282 bytes, +14.9351%); compiled V3 is 3,174,330 versus 2,762,331 (+411,999 bytes, +14.9149%). It also records each SHA-256, but the `.app` bundle files were no longer present for the final independent rehash. These are report-recorded raw Release-bundle sizes, not gzip, startup, memory, or over-the-air download measurements.

The native measurement boundary is warm-process React work from the state change through `useLayoutEffect`, including JavaScript style resolution, reconciliation, and the synchronous native commit. It does not measure startup, the next displayed frame, GPU rendering, memory, energy, or a physical device.

Native compiler coverage must be labeled by corpus size, not rendered repetition count. The exact cross-version static corpus has seven V3 candidate sites versus six candidates recognized by V2; both flatten 100% of their recognized sites, with V3 additionally recognizing one local styled usage. The separate three-site dynamic corpus exposed three `local/dynamic-style-value` opacity bailouts. The native-only opacity partial-extraction fix now lowers all three, preserves static host styles and expressions, keeps all three host identities stable, and updates opacity from 1.0 to 0.8. This is an opacity-only compiler fix, not general dynamic-style coverage.

A clean production Kitchen Sink iOS export provides broader V3-only evidence. Metro bundled 4,222 modules. The V3 compiler cache contains 2,656 module entries and records 2,140 candidates across the dependency graph, of which 1,582 were lowered/flattened and 558 bailed: 73.93%. Restricting the denominator to 176 files under `code/kitchen-sink/src` gives 1,359/1,770 flattened and 411 bailed: 76.78%. Its 427 diagnostics are 326 unsupported targets, 75 dynamic style values, 14 unsafe style spreads, seven unresolved bindings, and five unresolved imports; multiple diagnostics can belong to one bailed candidate.

There is no honest broad V2 percentage for that same app. The checked-in Kitchen Sink config imports the V3-only `@tamagui/config/v6` export, which pinned V2 2.6.2 does not provide. The attempted V2 load fails before transformation with `ERR_PACKAGE_PATH_NOT_EXPORTED`; swapping in a V2 config would change the app semantics and cease to be byte-identical. Accordingly, the seven-site/six-recognized controlled corpus is the only fair native cross-version optimizer comparison in this campaign, while 76.78% is a broader V3 health measure rather than a V3-versus-V2 result.

## React Strict DOM coverage

### What was compared and actually executed

The pinned official repository inventory contains 19 executable source files and 304 explicit declarations: 302 active plus two skipped. Three Flow type-test files and one manual platform fixture are inventoried separately.

The official code itself was installed and executed; the matrix records:

- `react-strict-dom`: 19/19 suites, 896 passed, two skipped, 711 snapshots;
- `postcss-react-strict-dom`: one suite, four passed, four snapshots, after building the package required by the intentionally script-free install; and
- total realized upstream execution: 900 passed, two skipped, 715 snapshots.

The local focused campaign records 364 passing tests and two skipped tests across DOM web/types, compiler, style grammar, native/web renderers, webpack, and one real Kitchen Sink Playwright case, plus six affected package builds. The two local skips are the existing animation-prop cases in `componentProps.native.test.tsx`. Upstream's 902 realized cases and the local count are not numerically comparable because upstream projects, parameterization, and snapshots expand source declarations differently.

### Coverage verdict

After independent review corrected the manual platform-app overclaim, the 19 matrix-classified feature rows are:

- 11 equivalent;
- two stronger;
- six intentional differences; and
- zero partial rows inside the declared Tamagui-authored capability scope.

The stronger rows are the strict semantic TypeScript/content-model surface and the source-local diagnostics/compatibility ledger.

The six deliberate differences are material for a full meet-or-exceed claim:

1. no StyleX `css.create`/`props`/`keyframes` object protocol or React Strict DOM runtime dependency;
2. TamaguiProvider/Theme/Variables/useMedia instead of an RSD-shaped native ThemeProvider API;
3. serializable Tamagui value programs instead of CSS Typed OM/StyleX objects;
4. compiler-returned ordered CSS instead of the RSD PostCSS artifact protocol;
5. Tamagui Slot/asChild instead of RSD's native render-function compat API; and
6. a representative five-tag automated platform fixture rather than coverage equivalent to the upstream 922-line manual app with 37 distinct semantic tags.

Therefore Tamagui now has substantial scoped authored-capability conformance, but it **does not yet meet or exceed the complete React Strict DOM package/API/protocol surface**. Official suites ran against RSD and local suites ran against Tamagui; there is no case-level differential adapter that runs the official cases against Tamagui, and device-specific visual fidelity remains untested. The matrix lacks a local Tamagui commit/dirty identity and raw test logs, so its execution totals are recorded results rather than independently source-bound reruns. It is a reproducible category/file mapping, not a substitution for a differential suite.

Confirmed fixes delivered by this audit include standalone `style()` lowering and ordered composition, web pseudo/media/theme clauses, native semantic/default/accessibility/input/image/event lowering, live native theme/media/interaction/inheritance behavior, DOM-shaped native ref lifecycle and cleanup, broader mouse/scroll mappings, literal JSX/createElement inheritance, and correct native runtime/type resolution through all three `./dom` package aliases.

## Pull request state

The existing V3 beta pull request is [#4124](https://github.com/tamagui/tamagui/pull/4124), `v3-beta` into `main`, at `3c4941255e983e14734e7baa86e4e40758b18a6b`. At the 2026-08-02 refresh it remains a draft with `CONFLICTING` / `DIRTY` merge state. Failing checks are iOS Detox shards 1/4 and 4/4, Android Detox, integration shards 1/3 and 3/3, and the Railway deployment status. The V3 SSR hydration and bundle-delta checks are skipped. This validation campaign does not reinterpret those failures as passing release evidence.

## Release gates

V3 should not be approved until all of the following are resolved or explicitly accepted by the release owner:

- lower transition-bearing compiled candidates safely, or explicitly accept and budget the measured regression;
- reduce or explicitly accept the roughly 29 KB gzip minimal-product delta;
- resolve or explicitly accept the compiler-disabled simple-mount regression;
- fix or explicitly accept the source-bound native runtime/compiled regressions and roughly 15% raw bundle increase;
- define a version-neutral production-app corpus if a broad cross-version native flattening percentage is required; the current Kitchen Sink config is V3-only;
- decide whether the six React Strict DOM differences are accepted architecture or must be implemented for the requested full meet/exceed target;
- add case-level differential and broader platform/device coverage if full React Strict DOM compatibility is the requirement; and
- restore the V3 pull request to a mergeable state with required release checks enabled and green.

## Durable evidence

- `code/comparisons/output/v3-homepage-compiler-stats.json`
- `code/comparisons/output/main-homepage-compiler-stats.json`
- `code/comparisons/output/v3-site-compiler-stats.json`
- `code/comparisons/output/v3-v2-web-behavior-conformance.json`
- `code/comparisons/output/v3-v2-web-benchmarks.json`
- `code/comparisons/output/v3-v2-web-benchmarks.html`
- `code/comparisons/output/v3-v2-web-bundle-attribution.json`
- `code/comparisons/output/v3-v2-web-regression-profile.json`
- `code/comparisons/NATIVE_V2_V3.md`
- `code/comparisons/output/benchmarks-native-v2-v3.json`
- `code/comparisons/output/benchmarks-native-v2-v3.md`
- `code/comparisons/output/benchmarks-native-v2-v3-effects.md`
- `code/comparisons/output/v3-native-compiler-evidence.json`
- `code/comparisons/output/v3-native-kitchen-sink-compiler-corpus.json`
- `code/comparisons/output/v3-native-v2-broad-compiler-blocker.json`
- `code/core/dom/strict-dom-parity.json`
