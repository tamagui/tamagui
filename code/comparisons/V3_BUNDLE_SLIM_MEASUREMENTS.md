# V3 bundle-slim measurement record

This record covers W4 on `validate/v3-bundle-slim-measure`. All byte claims below
come from `code/comparisons/run-benchmarks.ts`. The native section preserves the
failed W4 smoke and adds the later source-bound retained campaign.

## Source and harness

- The measurement branch integrated local V3 beta `21cd04` in merge commit
  `5eeda99b2c4d6b3f12fba18f564c53c8e5b95a81`.
- The initial attribution harness was preserved across that merge. Its file hashes
  were `4b38cc...` for `run-benchmarks.ts` and `304c20...` for
  `bundleAttributionPlugin.ts`.
- `8d4d422ae7` corrected comparison-only module classification so workspace UI
  packages such as portal and z-index are not counted as build/runtime helpers.
- W1 source commit `7e3c37dbfb` was applied as `8c10171c8d`.
- W3 source commits `bb256a06a9` and `f29eb8ddcb` were applied as
  `a91c396802` and `c6f51feb59`.
- W2 source commit `c98507593f` was applied as `7bac95dc1f`.
- `9f94e9fdbe` through `a7e08c19e9` added measured gzip decomposition. The
  production build places Tamagui-attributable modules in an explicit Rollup chunk,
  minifies that chunk, and gzips its emitted code. This is a direct measurement.
  It is not derived from rendered-byte share.

The Tamagui-attributable chunk includes `tamagui`, `@tamagui/*`, workspace
`core/packages/ui` dist modules, and `@react-native/normalize-color` when it is
pulled by the Tamagui runtime. It excludes fixture and shared benchmark code,
React, react-dom, scheduler, Vite helpers, and other dependencies.

## Retained web commands

The original pre-fix full run was executed from clean commit `5eeda99b2c`:

```sh
bun code/comparisons/run-benchmarks.ts --frameworks=tamagui-v3-compiled,tamagui-v3-runtime,tamagui-v2-compiled,tamagui-v2-runtime --samples=20 --warmups=2 --seed=73129 --bundle-attribution=/tmp/v3-bundle-slim-pre-fix-enable.json --output=code/comparisons/output/v3-bundle-slim-pre-fix-web-benchmarks.json
```

Its log is `/tmp/v3-bundle-w4-pre-fix-web.log`. The JSON and HTML were retained
in `9fa3f4a244`. Its timing values predate the machine-wide lock rule and are not
valid timing evidence. Its deterministic bundle-size output remains valid.

Each W1, W3, and W2 checkpoint used this build-only command, changing only the
output filename:

```sh
bun code/comparisons/run-benchmarks.ts --build-only --frameworks=tamagui-v3-compiled,tamagui-v3-runtime,tamagui-v2-compiled,tamagui-v2-runtime --seed=73129 --bundle-attribution=<output-path>
```

The retained checkpoint commits are `96caa1e63e` for corrected pre-fix,
`8dc6be4b73` for post-W1, `4971269eb5` for post-W3, and `d94adecefe` for the
initial assembled report.

The measured-gzip pre-fix report ran from clean commit `3a864e62f8`:

```sh
bun code/comparisons/run-benchmarks.ts --build-only --frameworks=tamagui-v3-compiled,tamagui-v3-runtime,tamagui-v2-compiled,tamagui-v2-runtime --seed=73129 --bundle-attribution=/Users/n8/.worktrees/v3-bundle-slim-w4/code/comparisons/output/v3-bundle-slim-pre-fix-web-bundle-attribution.json
```

The assembled report used the identical command from clean commit `036701cf2a`,
with output `v3-bundle-slim-assembled-web-bundle-attribution.json`. Logs are
`/tmp/v3-bundle-w4-pre-fix-measured-gzip.log` and
`/tmp/v3-bundle-w4-assembled-measured-gzip.log`. Both reports record
`metadata.dirty: false` and are retained by `87c2411736`.

## Benchmark lock

Timing runs acquire and release `/tmp/tamagui-bench.lock` through
`shared/benchmarkLock.ts`. Build-only bundle attribution does not take the lock.
The lock records the owning session ID alongside its process ID so a future
liveness check can disambiguate a recycled process ID. Until then, PID reuse
fails safe by refusing to reclaim the lock.

## Web results

The assembled fixes changed the decomposed production builds as follows:

| Mode | Metric | Pre-fix V3 | Assembled V3 | Change |
| --- | ---: | ---: | ---: | ---: |
| compiled | emitted JS | 377,514 | 369,513 | -8,001 |
| compiled | whole-app JS gzip | 123,308 | 121,249 | -2,059 |
| compiled | Tamagui-attributable gzip | 62,623 | 60,564 | -2,059 |
| compiled | emitted CSS | 3,415 | 3,415 | 0 |
| runtime | emitted JS | 376,436 | 368,435 | -8,001 |
| runtime | whole-app JS gzip | 123,017 | 120,957 | -2,060 |
| runtime | Tamagui-attributable gzip | 62,623 | 60,564 | -2,059 |
| runtime | emitted CSS | 0 | 0 | 0 |

Final distance from V2 is +86,116 emitted JS and +27,096 whole-app gzip for
compiled, and +86,952 emitted JS and +27,146 whole-app gzip for runtime.
Tamagui-attributable gzip remains +27,146 in both modes. Compiled CSS is 1,012
bytes smaller than V2.

The React control is effectively constant: React, react-dom, and scheduler render
466,060 bytes in V3 and 465,924 in V2, a 136-byte or 0.029% difference. Their
isolated minified chunk differs by 2 raw bytes. Gzip differs by +14 bytes in the
compiled comparison and -3 bytes in runtime.

Under the original single-chunk harness, W1 removed 7,185 emitted JS bytes and
1,806 compiled gzip bytes. W3 then removed 640 JS bytes and 141 gzip bytes. W2
removed another 190 JS bytes and 41 gzip bytes. CSS did not change. The post-W2
style-grammar change removed `clauseCapability.mjs` (650 rendered bytes), added
`clauseSources.mjs` (383 rendered bytes), and reduced `registry.mjs` by 120 bytes.

## Native retained status

### Failed W4 smoke

Native work used clean branch `validate/v3-native-retained-w4` at
`b5e6a63a0b50d0e54aec54459a9efd54164a07ec`. That comparison-only commit fixes
the runtime parity gate to validate Button passthrough props from the hook result
where both native arms actually return them.

All four Release apps were rebuilt with XcodeBuildMCP on simulator
`3C03FA2F-D68F-4537-A939-3B14A75A9BA7`. Their build IDs were:

- V3 runtime: `c1e7f91227a660ce5881b0ed98e039642667287d5eb4577e2d4d8e27bf647465`
- V2 runtime: `51f51aa38f64336cc54c49d73bbf2e17d117e5c645925e310b4c9828c20f138e`
- V3 compiled: `5ce966400bf7ca8fd55a54ad581a77c342a3bcd2857fb6cb804d0f5147225f9f`
- V2 compiled: `95cb2934903cfa04e099c33c0a4f555fdb0582bc8c2e9cdecd68e6ce09d20297`

Compiler evidence succeeded with this command:

```sh
node code/comparisons/verify-native-compiler-output.cjs --output=/tmp/tamagui-native-compiler-evidence-final.json
```

The locked smoke command was:

```sh
bun code/comparisons/run-native-v2-v3.ts --smoke --udid=3C03FA2F-D68F-4537-A939-3B14A75A9BA7 --seed=73129 --scenarios=simple --compiler-evidence=/tmp/tamagui-native-compiler-evidence-final.json
```

It failed with:

```text
error: timed out waiting for tamagui-v2-runtime/simple/warmup-0-0
```

The exact log is `/tmp/v3-bundle-w4-native-smoke-final.log`. A temporary
comparison-only UI probe then read the V2 active-group candidate as
`{"backgroundColor":"#60a5fa"}` instead of the required active value
`#2563eb`; see `/tmp/v3-bundle-w4-native-v2-group-style-probe-ui.txt`. The probe
was reverted and the branch was clean. That run produced no retained native
timing output.

The mismatch came from the comparison fixture. The failed fixture used V2's
scalar `$group-row-hover:backgroundColor` spelling and activated hover in the
synthetic group context. The corrected native fixture uses the supported
object-valued `$group-row-press` clause and activates press in both arms. This
keeps the gate strict while driving a native-supported state.

### Current retained campaign

The later campaign used clean source commit
`0f510aaa6f5e9a8a043d7c24c9741966a27042d8` on
`validate/v3-native-retained-wb`. The supported object-valued group-press fixture
passed the parity gate in both runtime arms with `backgroundColor: #2563eb`.
The smoke also passed all four Release apps before retained sampling.

The Release build identities were:

- V3 runtime: `d709f3586b9a9bbd498936a622cbc7046df7fec5eb67840c62f887c81a0aedf1`
- V2 runtime: `63c2d0844b7dab818948da58fe3c4cbd2c5693ae503983d6a6a820f7d4edaf03`
- V3 compiled: `39ae80ab12373a259a7fbccb641be9b9d5f72c17f3ac7363fa60d875eb8a5390`
- V2 compiled: `e4dc8550e2cc1c870295a7cec0d8202ac67706f0b250ede559349771973bed3e`

Fresh compiler evidence had SHA-256
`7ae5d942b02e587c054449c3292930bb0aba204cae4a6f39b83004c361e9b519`.
V2 optimized and flattened all six static and both recognized dynamic
candidates. V3 lowered and flattened all seven static and three dynamic
candidates with zero bailouts.

The retained command ran the full default scenario set with seed `73129`, three
warmup rounds, and 30 retained rounds:

```sh
bun code/comparisons/run-native-v2-v3.ts --udid=3C03FA2F-D68F-4537-A939-3B14A75A9BA7 --seed=73129 --warmups=3 --samples=30 --compiler-evidence=/tmp/tamagui-native-compiler-evidence-final.json
```

Every round shuffled all 18 V2 and V3 framework/scenario cells together. The
run retained 540 timed trials on an iOS 18.6 iPhone 16 Pro Simulator and wrote
[`output/benchmarks-native-v2-v3.json`](./output/benchmarks-native-v2-v3.json),
whose SHA-256 is
`c759666e9e3d5bc2eb9c181e49355b409d333d940de1de719b4460a03fffc895`.
The JSON records `sourceDirtyBeforeOutput: false`.

| Comparison | Scenario | Metric | V2 mean ± SD (ms) | V3 mean ± SD (ms) | V3/V2 | Paired difference 95% CI (ms) |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| runtime | simple | mount | 23.98 ± 2.19 | 27.49 ± 2.83 | 1.15x | 2.36 to 4.65 |
| runtime | simple | update | 21.34 ± 2.14 | 23.90 ± 2.15 | 1.12x | 1.46 to 3.67 |
| runtime | simple | remount | 23.90 ± 1.75 | 26.93 ± 1.87 | 1.13x | 2.12 to 3.94 |
| compiled | simple | mount | 5.19 ± 0.67 | 26.45 ± 1.72 | 5.09x | 20.52 to 22.00 |
| compiled | simple | remount | 4.92 ± 0.50 | 25.97 ± 1.41 | 5.28x | 20.54 to 21.58 |
| compiled | nested-static | mount | 8.36 ± 0.93 | 39.87 ± 1.88 | 4.77x | 30.73 to 32.27 |
| compiled | nested-static | remount | 8.01 ± 0.59 | 40.16 ± 1.94 | 5.02x | 31.44 to 32.87 |
| compiled | styled-static | mount | 9.40 ± 1.09 | 12.98 ± 1.47 | 1.38x | 2.99 to 4.18 |
| compiled | styled-static | remount | 9.64 ± 0.73 | 12.30 ± 0.88 | 1.28x | 2.24 to 3.08 |

Concurrent development watchers made a fully idle host unavailable. The run
therefore retained the process-attributed load trace and used paired median and
20% trimmed-mean checks in addition to the reported means. The audit found 20
leave-one-out observations at or above three standard deviations among 1,620
retained metric observations. The paired mean, median, and trimmed mean agreed
on every material V2/V3 direction. The complete robust table and all nine load
checkpoints are in
[`output/benchmarks-native-v2-v3.md`](./output/benchmarks-native-v2-v3.md).

Compared with the prior 12-sample record at `da80f52af4`, the compiled mount
ratios changed from 5.16x to 5.09x for simple, 6.07x to 4.77x for
nested-static, and 1.50x to 1.38x for styled-static. The remount ratios changed
from 5.49x to 5.28x, 5.92x to 5.02x, and 1.50x to 1.28x. The post-fix campaign
narrowed every retained compiled mount and remount gap, but did not close them.
The current source contains changes beyond the prewarm/reuse commits, so this is
a before/after record rather than an isolated causal estimate for either fix.
