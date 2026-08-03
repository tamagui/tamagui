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
xcodebuildmcp simulator build-and-run \
  --workspace-path code/comparisons/tamagui-bench-native/ios/tamaguibenchnative.xcworkspace \
  --scheme tamaguibenchnative \
  --configuration Release \
  --derived-data-path code/comparisons/.native-release/v3-runtime \
  --simulator-id <UDID>

xcodebuildmcp simulator build-and-run \
  --workspace-path code/comparisons/tamagui-v2-bench-native/ios/tamaguiv2benchnative.xcworkspace \
  --scheme tamaguiv2benchnative \
  --configuration Release \
  --derived-data-path code/comparisons/.native-release/v2-runtime \
  --simulator-id <UDID>

TAMAGUI_DEBUG_FILE=native-compiled-bench xcodebuildmcp simulator build-and-run \
  --workspace-path code/comparisons/tamagui-bench-native-compiled/ios/tamaguibenchnativecompiled.xcworkspace \
  --scheme tamaguibenchnativecompiled \
  --configuration Release \
  --derived-data-path code/comparisons/.native-release/v3-compiled \
  --simulator-id <UDID>

TAMAGUI_DEBUG_FILE=native-compiled-bench xcodebuildmcp simulator build-and-run \
  --workspace-path code/comparisons/tamagui-v2-bench-native-compiled/ios/tamaguiv2benchnativecompiled.xcworkspace \
  --scheme tamaguiv2benchnativecompiled \
  --configuration Release \
  --derived-data-path code/comparisons/.native-release/v2-compiled \
  --simulator-id <UDID>
```

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

## What it measures

Each measurement starts immediately before a fixture state change and ends in `useLayoutEffect`. `mount` creates the tree, `update` keeps every key stable while changing an equivalent style value, and `remount` replaces the keyed children. These metrics include JavaScript rendering, Tamagui style resolution or compiled output, React reconciliation, and the synchronous native commit boundary. They exclude the next fully drawn frame, process startup, memory, GPU work, and energy use.

Every warmup and retained round runs all framework and scenario combinations once in seeded randomized order. V2 and V3 share one raw token, theme, font, and media configuration. The unflattened runtime fixture uses each version's supported token and conditional-style spelling, precomputed before timed work, while preserving the same resolved values and component hierarchy. Every runtime app first executes a parity gate for raw styles, tokens, an active disabled pseudo, an active parent group, and the real Button static configuration. The harness rejects results unless V2 and V3 return the same resolved native-style signature.

The compiler fixture is separate from the runtime fixture. V2 uses `@tamagui/babel-plugin@2.6.2`; its build timing line reports found, optimized, and flattened nodes. V3 publishes content-addressed Metro plans whose raw source hashes and pre-lowering Metro Babel hashes can be matched independently before the plans are applied. The evidence script parses both lowered outputs and checks the expected native host styles.

The timed static fixture changes opacity on identical React Native wrappers so all static Tamagui candidates remain valid compiler coverage. Compiler `update` is therefore a native commit control; compiler effects are interpreted from `mount`, `remount`, lowering coverage, and output behavior. The separate dynamic corpus directly changes Tamagui opacity. Its compiler integration test retains the previous 3-bail negative control and executes the fixed V3 output to prove three host identities stay stable while opacity changes from 1 to 0.8 and static styles remain. Both compiled Release bundles receive independent SHA-256 hashes.

## Limitations

- V2 runs registry artifacts at version 2.6.2. The report records both the `v2.6.2` tag commit and the exact `origin/main` commit observed at run time because `main` can advance after a package is published.
- Simulator measurements include host scheduling noise and do not establish physical-device startup, memory, GPU, or energy parity.
- The layout-effect boundary includes the synchronous native commit, but it is earlier than the next fully drawn frame.
- Static JSX coverage is intentionally a separate compiler corpus. The runtime fixture uses `createElement` so the compiler cannot silently influence the unflattened measurements.
- Compiler coverage is a representative synthetic fixture with direct `View` and local styled-component cases. Existing kitchen-sink compiler cases use V3-only syntax and configuration, so they are not reported as a fair cross-version production-app corpus.
