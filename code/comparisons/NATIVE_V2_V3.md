# V2/V3 native runtime and compiler benchmark

This harness compares Tamagui 2.6.2, the package version on current V2 `main`, and the V3 workspace through two separate native paths:

- the runtime apps use `createElement` and no compiler plugin, which exercises unflattened runtime style resolution and real Tamagui `Button` components;
- the compiled apps feed byte-identical static JSX to the V2 Babel native extractor and V3 Metro lowering pipeline.

All four apps use the same checked-in fixture configuration, Expo 57.0.15, React 19.2.3, React Native 0.86.2, native module set, item counts, measurement boundary, and iOS simulator. The retained report includes raw warmups and samples, dispersion, paired confidence intervals, effect sizes, package integrity, source blobs, and embedded Release bundle hashes.

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
  --warmups=3 \
  --scenarios=simple \
  --compiler-evidence=/tmp/tamagui-native-compiler-evidence.json
```

Every Release run that selects a compiled scenario must include `simple`.
After the warmups and before any retained sampling, the runner compares each
version's simple-mount runtime mean with its compiled mean. Both V2 and V3 must
show at least a 1.5x compiled speedup. A failure stops the campaign before it
writes retained output; a pass is recorded in
`metadata.compilerEffectivenessGate`.

The command writes `output/benchmarks-native-v2-v3.json` and a Markdown summary beside it. The JSON records every trial and its randomized sequence plus source, package lock, npm integrity, installed dependency, host, simulator, tool, compiler, and production bundle metadata.

## Final source-bound campaign

The committed final campaign was sampled from clean source commit
`0f510aaa6f5e9a8a043d7c24c9741966a27042d8` on
`validate/v3-native-retained-wb`. It used seed `73129`, three complete warmup
rounds, and 30 retained rounds. One seeded PRNG shuffled all 18
framework/scenario cells independently in every round, producing 54 warmup and
540 retained observations. The JSON records `sourceDirtyBeforeOutput: false`.

The host was an Apple M3 Max running macOS 26.5.1 (25F80), Darwin 25.5.0 arm64.
Builds used Xcode 26.4 (17E192) and Apple clang 21.0.0
(`clang-2100.0.123.102`). The timing runner recorded Bun 1.3.9,
`process.version` v24.3.0, and xcodebuildmcp 2.3.0. The single target was a
Tamagui Perf iPhone 16 Pro iOS Simulator, iOS 18.6 (22G86), UDID
`3C03FA2F-D68F-4537-A939-3B14A75A9BA7`.

Every retained result returned one of these source-bound IDs, and the runner
hashed the installed embedded `main.jsbundle` before accepting output:

| Arm         | Build ID                                                           | Bundle bytes | Bundle SHA-256                                                     |
| ----------- | ------------------------------------------------------------------ | -----------: | ------------------------------------------------------------------ |
| V2 runtime  | `63c2d0844b7dab818948da58fe3c4cbd2c5693ae503983d6a6a820f7d4edaf03` |    2,767,190 | `788837ea78ff3c89159b8017e4dccb3f8519c25b5fd5dc36fc0e7c40ea018a48` |
| V3 runtime  | `d709f3586b9a9bbd498936a622cbc7046df7fec5eb67840c62f887c81a0aedf1` |    2,969,934 | `fb73fb0c78ff5391f1b0658ad94036df8b5c038c17c35356725a7f80f77a48c0` |
| V2 compiled | `e4dc8550e2cc1c870295a7cec0d8202ac67706f0b250ede559349771973bed3e` |    2,762,318 | `ec16dd47cb8585925422565b8dc0c92a55bc5f373bf2733409bf1e1a5e8421b8` |
| V3 compiled (INVALID) | `39ae80ab12373a259a7fbccb641be9b9d5f72c17f3ac7363fa60d875eb8a5390` |    2,963,725 | `82a4324e80d63bcb7e8956732162b5db7b16ec084d478f25b0b4387f9ddd4c6d` |

This campaign is partially valid. The V3 compiled Release bundle did not apply
its cached Metro lowering plans. Metro workers supplied project-relative
filenames while the plan cache was keyed by absolute realpaths, so every lookup
missed and this arm shipped the runtime path. All `tamagui-v3-compiled` cells
and comparisons involving that arm are INVALID pending re-measurement after
`2acce54e05`. V2 runtime, V3 runtime, and V2 compiled remain valid because the
runtime arms do not use the compiler plugin and V2 uses its Babel extractor.

The authoritative [raw JSON](./output/benchmarks-native-v2-v3.json) has SHA-256
`71aa4f53960f9b2620bd394b6634213bd6d8d988069549977174ee8da4b4f0ac`.
The [generated and robustness-enriched summary](./output/benchmarks-native-v2-v3.md)
has SHA-256 `15edf573e4d93405df9c5a9f20d5e41f0bf8c2214651c9f2acec006aa045eb0b`.
The [derived effects table](./output/benchmarks-native-v2-v3-effects.md) reports
every right/left ratio of means and every round-paired right-minus-left 95%
confidence interval. Positive differences are slower because each metric is a
duration.

The V3 compiled ratios in this record cannot answer whether prewarm/reuse closed
the earlier gap. They describe an unlowered bundle and are retained only for
forensic comparison. The surviving headline is runtime simple mount: V2
23.98 ms versus V3 27.49 ms, with a paired right-minus-left 95% confidence
interval of 2.36 to 4.65 ms.

Concurrent development watchers prevented a fully idle host. The retained run
therefore increased to 30 samples and recorded process-attributed `top` samples
at the start, every 60 seconds, and after completion. Retained checkpoints
ranged from 44.95% to 78.76% idle. The individual-arm audit found 20
leave-one-out observations at or above three standard deviations among 1,620
retained metric observations. Paired means, medians, and 20% trimmed means agree
on every material V2/V3 direction in the raw observations. This robustness does
not validate the V3 compiled arm. The complete robust table and load trace are
in the generated summary.

All four installed Release apps passed the warmup-only behavior smoke with the
same runtime signature. That smoke did not verify that the V3 compiled bundle
consumed its lowering plans. The final smoke and retained campaign encountered
no iOS confirmation dialog. The deterministic fallback, if a dispatch stalled,
was to inspect SpringBoard once and tap only an exact `Open` confirmation.
Deep-link transport and any such confirmation occur before the app begins its
timer, so they are outside the measured interval.

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
