# V2/V3 native runtime and compiler benchmark

This harness compares Tamagui 2.6.2, the package version on current V2 `main`, and the V3 workspace through two separate native paths:

- the runtime apps use `createElement` and no compiler plugin, which exercises unflattened runtime style resolution and real Tamagui `Button` components;
- the compiled apps feed byte-identical static JSX to the V2 Babel native extractor and V3 Metro lowering pipeline.

All four apps use the same checked-in fixture configuration, Expo 55.0.28, React 19.1.0, React Native 0.83.2, native module set, item counts, measurement boundary, and iOS simulator. The retained report includes raw warmups and samples, dispersion, paired confidence intervals, effect sizes, package integrity, source blobs, and embedded Release bundle hashes.

Standalone Release apps with embedded production JavaScript bundles are the evidence path. Expo Go remains available only for harness development and is labeled separately by the runner.

## Prepare Release apps

Install repository dependencies and the two isolated V2 dependency trees:

```sh
bun install --frozen-lockfile

cd code/comparisons/tamagui-v2-bench-native
npm ci --legacy-peer-deps --workspaces=false

cd ../tamagui-v2-bench-native-compiled
npm ci --legacy-peer-deps --workspaces=false
```

Generate all four native projects. The `ios` directories are ignored because Expo reproduces them from the checked-in app configuration:

```sh
cd code/comparisons/tamagui-bench-native
npx expo prebuild --platform ios --clean

cd ../tamagui-v2-bench-native
npm exec expo -- prebuild --platform ios --clean

cd ../tamagui-bench-native-compiled
npx expo prebuild --platform ios --clean

cd ../tamagui-v2-bench-native-compiled
npm exec expo -- prebuild --platform ios --clean
```

Build, install, and launch every app in Release configuration on one explicit simulator:

```sh
EXPO_PUBLIC_NATIVE_BENCH_BUILD_ID="$(bun code/comparisons/native-bench-build-id.ts --framework=tamagui-v3-runtime)" \
xcodebuildmcp simulator build-and-run \
  --workspace-path code/comparisons/tamagui-bench-native/ios/tamaguibenchnative.xcworkspace \
  --scheme tamaguibenchnative \
  --configuration Release \
  --derived-data-path code/comparisons/.native-release/v3-runtime \
  --simulator-id <UDID>

EXPO_PUBLIC_NATIVE_BENCH_BUILD_ID="$(bun code/comparisons/native-bench-build-id.ts --framework=tamagui-v2-runtime)" \
xcodebuildmcp simulator build-and-run \
  --workspace-path code/comparisons/tamagui-v2-bench-native/ios/tamaguiv2benchnative.xcworkspace \
  --scheme tamaguiv2benchnative \
  --configuration Release \
  --derived-data-path code/comparisons/.native-release/v2-runtime \
  --simulator-id <UDID>

EXPO_PUBLIC_NATIVE_BENCH_BUILD_ID="$(bun code/comparisons/native-bench-build-id.ts --framework=tamagui-v3-compiled)" \
TAMAGUI_DEBUG_FILE=native-compiled-bench xcodebuildmcp simulator build-and-run \
  --workspace-path code/comparisons/tamagui-bench-native-compiled/ios/tamaguibenchnativecompiled.xcworkspace \
  --scheme tamaguibenchnativecompiled \
  --configuration Release \
  --derived-data-path code/comparisons/.native-release/v3-compiled \
  --simulator-id <UDID>

EXPO_PUBLIC_NATIVE_BENCH_BUILD_ID="$(bun code/comparisons/native-bench-build-id.ts --framework=tamagui-v2-compiled)" \
TAMAGUI_DEBUG_FILE=native-compiled-bench xcodebuildmcp simulator build-and-run \
  --workspace-path code/comparisons/tamagui-v2-bench-native-compiled/ios/tamaguiv2benchnativecompiled.xcworkspace \
  --scheme tamaguiv2benchnativecompiled \
  --configuration Release \
  --derived-data-path code/comparisons/.native-release/v2-compiled \
  --simulator-id <UDID>
```

The build ID is a SHA-256 digest over the clean Git commit and the exact fixture,
configuration, wrapper, Metro/Babel, package, and runner files for that arm. Every app
returns its embedded ID with each result, and the runner independently recomputes and
checks it before accepting a timing. Rebuild all four arms after any source commit.

Prove that both compiler pipelines transformed the checked-in compiler corpora. This command checks the static timed fixture plus a separate byte-identical dynamic corpus with revision-dependent opacity on two Tamagui Views and one local styled component. It matches V2 Babel output and V3 content-addressed Metro plans to raw-source and pre-lowering Babel hashes, applies the V3 edit plans, and structurally asserts expected native host styles and dynamic expressions:

```sh
node code/comparisons/verify-native-compiler-output.cjs \
  --output=/tmp/tamagui-native-compiler-evidence.json
```

Run the benchmark from a committed, clean source tree:

```sh
bun code/comparisons/run-native-v2-v3.ts \
  --udid=<UDID> \
  --samples=12 \
  --warmups=2 \
  --seed=73129 \
  --compiler-evidence=/tmp/tamagui-native-compiler-evidence.json
```

Before retained sampling, the same command can exercise all four installed apps with one randomized warmup round and no retained output:

```sh
bun code/comparisons/run-native-v2-v3.ts \
  --smoke \
  --udid=<UDID> \
  --seed=73129 \
  --scenarios=simple \
  --compiler-evidence=/tmp/tamagui-native-compiler-evidence.json
```

The command writes `output/benchmarks-native-v2-v3.json` and a Markdown summary beside it. The JSON records every trial and its randomized sequence plus source, package lock, npm integrity, installed dependency, host, simulator, tool, compiler, and production bundle metadata.

## Final source-bound campaign

The committed final campaign was sampled from clean source commit
`da80f52af4bf7eaf8af99195371d2cff644cc7eb` on
`validate/v3-native-runtime`. It used seed `73129`, two complete warmup rounds,
and 12 retained rounds. One seeded PRNG shuffled all 18 framework/scenario cells
independently in every round, producing 36 warmup and 216 retained observations.
Independent validation replayed all 14 shuffled orders and recomputed all 54
cell statistics and 33 paired effects from the raw observations.

The host was an Apple M5 running macOS 26.5.1 (25F80), Darwin 25.5.0 arm64.
Builds used Xcode 26.4 (17E192) and Apple clang 21.0.0
(`clang-2100.0.123.102`). The timing runner recorded Bun 1.3.10,
`process.version` v24.3.0, and xcodebuildmcp 2.3.0. The single target was an
iPhone 17 Pro iOS Simulator, iOS 26.4 (23E244), UDID
`A5ED797B-EFC1-4261-A328-6FF79E9B68FF`.

Every retained result returned one of these source-bound IDs, and the runner
hashed the installed embedded `main.jsbundle` before accepting output:

| Arm         | Build ID                                                           | Bundle bytes | Bundle SHA-256                                                     |
| ----------- | ------------------------------------------------------------------ | -----------: | ------------------------------------------------------------------ |
| V2 runtime  | `3a1d4afae276f82127718891ec78e795a5329525d31d1e30568ea2ba42a7e2a8` |    2,767,187 | `e1e9d11f2b62d8fd6ca2b4273865d6cc553daa6c4eab5d1a520a0ddab6fadaf4` |
| V3 runtime  | `373fd6fc27c6ac2942f142774f4960fc96ff00c57992da21a904bbabecca697a` |    3,180,469 | `a7fdb485879b0a46a36f38d8cf28101ebcf09c0e81392b77a4a58203c5d7e962` |
| V2 compiled | `63906533a4265cb913f9b001e6b51534368e0ee09616ac127234537e632452ea` |    2,762,331 | `f6b9a46cced80effa6292f4b77e629828d42c3a22e6081f7d69c24fd7798e609` |
| V3 compiled | `6e714056a88c8966ed78ad88dcc6d99dbec338df6c0d023010158f19f3ff2e04` |    3,174,330 | `73294da67a448bee070ff23ee0cb48f56340228aaa52bf5ff3a61929aaba251d` |

The authoritative [raw JSON](./output/benchmarks-native-v2-v3.json) has SHA-256
`78354c231a142de17149bb9a8e1b88c7a2d4e83728d59f3e7b63958624be2f5b`.
The unchanged [generated summary](./output/benchmarks-native-v2-v3.md) has
SHA-256 `83b484f1990eb7c04a124fe7cd0e74926e101249f0cb862ee30c760f0cf59bd1`.
The [derived effects table](./output/benchmarks-native-v2-v3-effects.md) reports
every right/left ratio of means and every round-paired right-minus-left 95%
confidence interval. Positive differences are slower because each metric is a
duration.

All four clean Release arms passed the warmup-only smoke with the same runtime
behavior signature. The final smoke and retained campaign encountered no iOS
confirmation dialog. The deterministic fallback, if a dispatch stalled, was to
inspect SpringBoard once and tap only an exact `Open` confirmation. Deep-link
transport and any such confirmation occur before the app begins its timer, so
they are outside the measured interval.

## What it measures

Each measurement starts immediately before a fixture state change and ends in `useLayoutEffect`. `mount` creates the tree, `update` keeps every key stable while changing an equivalent style value, and `remount` replaces the keyed children. These metrics include JavaScript rendering, Tamagui style resolution or compiled output, React reconciliation, and the synchronous native commit boundary. They exclude the next fully drawn frame, process startup, memory, GPU work, and energy use.

Every warmup and retained round runs all framework and scenario combinations once in seeded randomized order. V2 and V3 share one raw token, theme, font, and media configuration. The unflattened runtime fixture uses each version's supported token and conditional-style spelling, precomputed before timed work, while preserving the same resolved values and component hierarchy. Timed interaction clauses use native-supported press and group-press paths in both versions; hover and group-hover are excluded. Every runtime app first executes a parity gate for raw styles, tokens, an active disabled pseudo, an active parent group, and a nonempty real Button static configuration. The shared signature omits the version-specific Button component name (`Button` in V2 and `ButtonFrame` in V3). The component-style gate resolves through `Button.Frame`, while the timed component case still renders the real `Button`. The harness rejects results unless V2 and V3 return the same resolved native-style signature.

The compiler fixture is separate from the runtime fixture. V2 uses `@tamagui/babel-plugin@2.6.2`; its build timing line reports found, optimized, and flattened nodes. V3 publishes content-addressed Metro plans whose raw source hashes and pre-lowering Metro Babel hashes can be matched independently before the plans are applied. The evidence script parses both lowered outputs and checks the expected native host styles.

The timed static fixture changes opacity on identical React Native wrappers so all static Tamagui candidates remain valid compiler coverage. Compiler `update` is therefore a native commit control; compiler effects are interpreted from `mount`, `remount`, lowering coverage, and output behavior. The separate dynamic corpus directly changes Tamagui opacity. Its compiler integration test retains the previous 3-bail negative control and executes the fixed V3 output to prove three host identities stay stable while opacity changes from 1 to 0.8 and static styles remain. Both compiled Release bundles receive independent SHA-256 hashes.

No timed fixture imports `react-test-renderer`. The timed host tree and resolved
style shape are not directly inspected: doing so would add observer work and a
different renderer to the timed product. Compiler structure checks and runtime
behavior/style gates run separately outside the measured interval.

## Broader native compiler corpus

A separate clean production export exercised the actual Kitchen Sink iOS Metro
dependency graph at the same source commit:

```sh
cd code/kitchen-sink
NODE_ENV=production EXPO_NO_TELEMETRY=1 npx expo export \
  --platform ios \
  --output-dir /tmp/v3-native-final-da80f52-kitchen-sink-export \
  --clear \
  --max-workers 4
```

Metro bundled 4,222 modules. The V3 content-addressed compiler cache contained
2,656 source-fresh entries, including 177 entries in the Kitchen Sink project
scope (the project `index.js` plus 176 entries under `code/kitchen-sink/src`)
and 157 entries under `src/usecases`. The cache found 2,140 candidates, lowered
and flattened 1,582, styled 1,479, and safely bailed 558. Kitchen Sink source
accounted for 1,770 found, 1,359 lowered/flattened, and 411 bailed candidates;
146 use-case entries contained candidates.

At the Metro wrapper layer, the full cache recorded 563
`metro/transform-failed` and 27 `metro/resolve-failed` diagnostics. The
underlying Kitchen Sink source plans preserve the actionable breakdown:
326 `local/unsupported-target`, 75 `local/dynamic-style-value`,
14 `local/unsafe-style-spread`, seven `linked/unresolved-binding`, and five
`linked/unresolved-import` diagnostics. These 427 diagnostics account for the
411 safe candidate bailouts plus graph-link diagnostics that are not candidate
bailouts. The production export still completed and emitted a 9,038,661-byte
Hermes bundle with SHA-256
`d92e2240af56dd6393da4aa900be3973aceeefe3362eed4dc3bd5ed8a1fe8327`.

The [broader-corpus evidence](./output/v3-native-kitchen-sink-compiler-corpus.json)
contains every candidate module, aggregate and per-scope counts, diagnostic
messages/counts, all cache descriptor/blob/source/plan validation counts, the
manifest generation and hash, export hashes, and the resolved built compiler
dependency-chain hashes. Its SHA-256 is
`d46b52ba967ca9f2fb3922bab5e933aab6ce411526e131ee33dd1e992ee2f5e7`.

A byte-identical broad pinned-V2 comparison is technically blocked before
transformation. Kitchen Sink imports `@tamagui/config/v6` and
`@tamagui/config/v6-base`, but pinned `@tamagui/config@2.6.2` exports only
through `v5-*`; both pinned resolver attempts fail with
`ERR_PACKAGE_PATH_NOT_EXPORTED`. Resolving through the workspace would give the
V2 Babel plugin V3 config/component metadata. Replacing the config would change
tokens, themes, fonts, media, shorthands, settings, variables, default props,
and resolved component metadata. Neither is a byte-identical pinned-V2
comparison. The exact package/source hashes and resolver errors are in the
[blocker evidence](./output/v3-native-v2-broad-compiler-blocker.json), SHA-256
`6908548d5c46c2a9bb56004a35b4d62182787762d5db60a4f053126d26818785`.

The checked-in neutral static and dynamic micro-corpora therefore remain the
only fair cross-version compiler controls: V2 optimized/flattened 6/6 static
and 2/2 dynamic candidates, while V3 lowered/flattened 7/7 static and 3/3
dynamic candidates with zero bailouts. They are synthetic controls, not
real-app coverage. Their [compiler evidence](./output/v3-native-compiler-evidence.json)
has SHA-256
`cd9591a50e4f39a54a860b36153075bb01433c2231963e35d73e84e79e0209ac`.

## Limitations

- V2 runs registry artifacts at version 2.6.2. The report records both the `v2.6.2` tag commit and the exact `origin/main` commit observed at run time because `main` can advance after a package is published.
- This is one controlled iOS Simulator campaign on one Apple M5 host. It does not establish physical-device or population-wide performance, startup, memory, GPU, or energy parity.
- The layout-effect boundary includes the synchronous native commit, but it is earlier than the next fully drawn frame.
- Static JSX coverage is intentionally a separate compiler corpus. The runtime fixture uses `createElement` so the compiler cannot silently influence the unflattened measurements.
- The V3 Kitchen Sink production export is broad real-app graph evidence, but it is not a behavior test of every route. It is not presented as cross-version coverage because pinned V2 cannot load the byte-identical V6 configuration.
