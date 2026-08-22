# V2/V3 native runtime and compiler benchmark

Generated 2026-08-03T22:13:51.737Z. The JSON beside this file is authoritative and retains every warmup and sample.

> [!WARNING]
> All `tamagui-v3-compiled` cells are invalid pending re-measurement after
> `2acce54e05`. Metro workers supplied project-relative filenames while the plan
> cache was keyed by absolute realpaths, so the Release bundle missed every V3
> lowering plan and shipped the runtime path. V2 runtime, V3 runtime, and V2
> compiled cells remain valid. The internal simple-mount control shows V2
> improving from 23.98 ms runtime to 5.19 ms compiled, while V3 changed only
> from 27.49 ms to 26.45 ms. The surviving headline is runtime simple mount:
> V2 23.98 ms versus V3 27.49 ms, with a paired difference 95% CI of 2.36 to
> 4.65 ms.

| Comparison | Scenario | Metric | Left mean ± SD (ms) | Right mean ± SD (ms) | Right delta | Paired difference 95% CI (ms) | Cohen's dz |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| runtime V3 versus V2 | simple | mount | 23.98 ± 2.19 | 27.49 ± 2.83 | +14.6% | 2.36 to 4.65 | 1.14 |
| runtime V3 versus V2 | simple | update | 21.34 ± 2.14 | 23.90 ± 2.15 | +12.0% | 1.46 to 3.67 | 0.87 |
| runtime V3 versus V2 | simple | remount | 23.90 ± 1.75 | 26.93 ± 1.87 | +12.7% | 2.12 to 3.94 | 1.24 |
| runtime V3 versus V2 | themed | mount | 24.31 ± 2.59 | 26.26 ± 2.79 | +8.1% | 0.77 to 3.15 | 0.61 |
| runtime V3 versus V2 | themed | update | 22.02 ± 1.98 | 22.45 ± 1.63 | +1.9% | -0.36 to 1.22 | 0.20 |
| runtime V3 versus V2 | themed | remount | 24.25 ± 1.76 | 25.72 ± 1.74 | +6.0% | 0.65 to 2.28 | 0.67 |
| runtime V3 versus V2 | rich | mount | 43.09 ± 2.97 | 54.56 ± 4.44 | +26.6% | 9.71 to 13.24 | 2.43 |
| runtime V3 versus V2 | rich | update | 35.79 ± 2.13 | 45.99 ± 2.25 | +28.5% | 8.99 to 11.41 | 3.14 |
| runtime V3 versus V2 | rich | remount | 42.24 ± 1.93 | 53.47 ± 3.24 | +26.6% | 10.01 to 12.47 | 3.42 |
| runtime V3 versus V2 | group | mount | 109.75 ± 4.34 | 112.46 ± 5.76 | +2.5% | 0.39 to 5.03 | 0.44 |
| runtime V3 versus V2 | group | update | 49.52 ± 3.12 | 55.23 ± 3.44 | +11.5% | 4.21 to 7.20 | 1.43 |
| runtime V3 versus V2 | group | remount | 112.23 ± 6.94 | 115.34 ± 6.63 | +2.8% | -0.24 to 6.46 | 0.35 |
| runtime V3 versus V2 | heavy | mount | 60.09 ± 4.39 | 60.37 ± 2.95 | +0.5% | -1.46 to 2.04 | 0.06 |
| runtime V3 versus V2 | heavy | update | 32.79 ± 1.90 | 34.67 ± 2.23 | +5.7% | 0.92 to 2.84 | 0.73 |
| runtime V3 versus V2 | heavy | remount | 60.39 ± 3.96 | 60.82 ± 2.97 | +0.7% | -1.30 to 2.18 | 0.09 |
| runtime V3 versus V2 | component | mount | 65.30 ± 3.77 | 52.73 ± 4.85 | -19.2% | -15.14 to -10.00 | -1.82 |
| runtime V3 versus V2 | component | update | 32.83 ± 2.13 | 34.29 ± 1.33 | +4.4% | 0.58 to 2.34 | 0.62 |
| runtime V3 versus V2 | component | remount | 64.33 ± 3.08 | 52.00 ± 2.51 | -19.2% | -13.78 to -10.87 | -3.16 |
| compiled V3 versus V2 (INVALID) | simple | mount | 5.19 ± 0.67 | 26.45 ± 1.72 | +409.5% | 20.52 to 22.00 | 10.72 |
| compiled V3 versus V2 (INVALID) | simple | update | 1.04 ± 0.08 | 1.01 ± 0.05 | -2.8% | -0.06 to 0.01 | -0.32 |
| compiled V3 versus V2 (INVALID) | simple | remount | 4.92 ± 0.50 | 25.97 ± 1.41 | +428.2% | 20.54 to 21.58 | 15.17 |
| compiled V3 versus V2 (INVALID) | nested-static | mount | 8.36 ± 0.93 | 39.87 ± 1.88 | +376.8% | 30.73 to 32.27 | 15.27 |
| compiled V3 versus V2 (INVALID) | nested-static | update | 0.54 ± 0.05 | 0.49 ± 0.04 | -9.8% | -0.08 to -0.03 | -0.84 |
| compiled V3 versus V2 (INVALID) | nested-static | remount | 8.01 ± 0.59 | 40.16 ± 1.94 | +401.6% | 31.44 to 32.87 | 16.88 |
| compiled V3 versus V2 (INVALID) | styled-static | mount | 9.40 ± 1.09 | 12.98 ± 1.47 | +38.1% | 2.99 to 4.18 | 2.26 |
| compiled V3 versus V2 (INVALID) | styled-static | update | 0.48 ± 0.04 | 0.45 ± 0.04 | -5.5% | -0.05 to -0.01 | -0.48 |
| compiled V3 versus V2 (INVALID) | styled-static | remount | 9.64 ± 0.73 | 12.30 ± 0.88 | +27.6% | 2.24 to 3.08 | 2.35 |
| V2 compiler effect | simple | mount | 23.98 ± 2.19 | 5.19 ± 0.67 | -78.4% | -19.58 to -17.99 | -8.83 |
| V2 compiler effect | simple | update | 21.34 ± 2.14 | 1.04 ± 0.08 | -95.1% | -21.10 to -19.50 | -9.51 |
| V2 compiler effect | simple | remount | 23.90 ± 1.75 | 4.92 ± 0.50 | -79.4% | -19.68 to -18.28 | -10.11 |
| V3 compiler effect (INVALID) | simple | mount | 27.49 ± 2.83 | 26.45 ± 1.72 | -3.8% | -2.22 to 0.14 | -0.33 |
| V3 compiler effect (INVALID) | simple | update | 23.90 ± 2.15 | 1.01 ± 0.05 | -95.8% | -23.70 to -22.09 | -10.65 |
| V3 compiler effect (INVALID) | simple | remount | 26.93 ± 1.87 | 25.97 ± 1.41 | -3.5% | -1.71 to -0.20 | -0.47 |

## Robustness under concurrent host load

The campaign ran for three warmup rounds and 30 retained rounds because unrelated long-lived development watchers made a fully idle host unavailable. Every round shuffled all V2 and V3 cases together. The robust checks below use round-paired differences. The 20% trimmed mean drops the six lowest and six highest differences in each 30-pair cell.

| Comparison | Scenario | Metric | Ratio of means | Paired mean difference 95% CI (ms) | Paired median difference (ms) | Paired 20% trimmed difference (ms) | Median paired delta | 20% trimmed paired delta |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| runtime V3 versus V2 | simple | mount | 1.15x | 2.36 to 4.65 | 3.20 | 3.38 | +14.34% | +14.49% |
| runtime V3 versus V2 | simple | update | 1.12x | 1.46 to 3.67 | 2.92 | 2.74 | +14.25% | +13.21% |
| runtime V3 versus V2 | simple | remount | 1.13x | 2.12 to 3.94 | 2.73 | 2.85 | +11.84% | +12.14% |
| runtime V3 versus V2 | themed | mount | 1.08x | 0.77 to 3.15 | 1.51 | 1.78 | +6.89% | +7.86% |
| runtime V3 versus V2 | themed | update | 1.02x | -0.36 to 1.22 | 0.56 | 0.53 | +2.49% | +2.55% |
| runtime V3 versus V2 | themed | remount | 1.06x | 0.65 to 2.28 | 1.09 | 1.38 | +4.34% | +5.77% |
| runtime V3 versus V2 | rich | mount | 1.27x | 9.71 to 13.24 | 11.32 | 11.18 | +26.81% | +26.56% |
| runtime V3 versus V2 | rich | update | 1.29x | 8.99 to 11.41 | 10.09 | 10.05 | +27.99% | +28.37% |
| runtime V3 versus V2 | rich | remount | 1.27x | 10.01 to 12.47 | 10.50 | 10.68 | +24.35% | +25.37% |
| runtime V3 versus V2 | group | mount | 1.02x | 0.39 to 5.03 | 1.99 | 2.23 | +1.89% | +2.03% |
| runtime V3 versus V2 | group | update | 1.12x | 4.21 to 7.20 | 5.21 | 5.20 | +10.56% | +10.55% |
| runtime V3 versus V2 | group | remount | 1.03x | -0.24 to 6.46 | 2.38 | 2.81 | +2.17% | +2.54% |
| runtime V3 versus V2 | heavy | mount | 1.00x | -1.46 to 2.04 | 0.80 | 0.63 | +1.31% | +1.16% |
| runtime V3 versus V2 | heavy | update | 1.06x | 0.92 to 2.84 | 1.46 | 1.67 | +4.22% | +5.19% |
| runtime V3 versus V2 | heavy | remount | 1.01x | -1.30 to 2.18 | 0.87 | 0.45 | +1.46% | +0.82% |
| runtime V3 versus V2 | component | mount | 0.81x | -15.14 to -10.00 | -13.45 | -13.37 | -21.09% | -20.67% |
| runtime V3 versus V2 | component | update | 1.04x | 0.58 to 2.34 | 1.06 | 1.42 | +3.25% | +4.43% |
| runtime V3 versus V2 | component | remount | 0.81x | -13.78 to -10.87 | -11.68 | -11.88 | -18.64% | -18.73% |
| compiled V3 versus V2 (INVALID) | simple | mount | 5.09x | 20.52 to 22.00 | 21.03 | 21.11 | +442.02% | +427.87% |
| compiled V3 versus V2 (INVALID) | simple | update | 0.97x | -0.06 to 0.01 | -0.02 | -0.03 | -1.68% | -2.72% |
| compiled V3 versus V2 (INVALID) | simple | remount | 5.28x | 20.54 to 21.58 | 21.01 | 20.99 | +440.37% | +437.36% |
| compiled V3 versus V2 (INVALID) | nested-static | mount | 4.77x | 30.73 to 32.27 | 31.48 | 31.43 | +387.27% | +389.36% |
| compiled V3 versus V2 (INVALID) | nested-static | update | 0.90x | -0.08 to -0.03 | -0.06 | -0.05 | -10.10% | -9.61% |
| compiled V3 versus V2 (INVALID) | nested-static | remount | 5.02x | 31.44 to 32.87 | 31.62 | 31.79 | +403.76% | +402.82% |
| compiled V3 versus V2 (INVALID) | styled-static | mount | 1.38x | 2.99 to 4.18 | 3.21 | 3.45 | +36.56% | +38.39% |
| compiled V3 versus V2 (INVALID) | styled-static | update | 0.94x | -0.05 to -0.01 | -0.04 | -0.03 | -8.06% | -6.20% |
| compiled V3 versus V2 (INVALID) | styled-static | remount | 1.28x | 2.24 to 3.08 | 2.46 | 2.60 | +25.46% | +27.26% |

The mean, median, and 20% trimmed mean agree on every material V2/V3 direction in the raw observations. This statistical agreement does not restore validity to the V3 compiled arm because its Release bundle did not apply the lowering plans. The individual-arm audit found 20 leave-one-out observations at or above three standard deviations among 1,620 retained metric observations (1.23%). Those observations remain in the authoritative means and confidence intervals.

## Host-load trace

`top` captured two samples at the start, every 60 seconds, and after the runner finished. This table records the second sample at each checkpoint and every process at or above 20% CPU. The final checkpoint happened after the JSON and Markdown had already been written.

| Time (HST) | CPU idle | Processes at or above 20% CPU |
| --- | ---: | --- |
| 12:06:06 | 79.35% | Google Chrome Helper 30.1%; `tm` 20.1% |
| 12:07:08 | 46.61% | `node` 130.7%; `fseventsd` 113.5%; `kernel_task` 40.4%; WindowServer 32.3%; V2 runtime app 29.2%; Google Chrome Helper 22.2% |
| 12:08:10 | 44.95% | `node` 88.6%; WindowServer 39.0%; `Runner.Worker` 31.3%; Google Chrome Helper 28.4%; `kernel_task` 22.8% |
| 12:09:13 | 63.41% | WindowServer 53.8%; `biomesyncd` 45.2%; SpringBoard 24.3%; iTerm2 22.9%; `BiomeAgent` 22.8%; `kernel_task` 22.7% |
| 12:10:14 | 73.62% | WindowServer 30.8%; `tm` 21.3% |
| 12:11:16 | 59.71% | `tm` 90.6%; WindowServer 53.9%; `kernel_task` 26.3% |
| 12:12:18 | 58.82% | `node` 108.4%; WindowServer 33.5%; `kernel_task` 23.3%; `tm` 21.5%; `airportd` 20.6% |
| 12:13:20 | 78.76% | none |
| 12:13:52, after output | 18.61% | `node` 59.6%; WindowServer 29.4%; `kernel_task` 20.9% |

## Method

- 3 warmup rounds and 30 retained rounds.
- Every round contains every framework/scenario case once in seeded randomized order.
- Runtime and compiler comparisons each use one shared versioned fixture. All four apps use Expo 55, React 19.1, React Native 0.83.2, and the same simulator.
- The V2 apps use npm 2.6.2 artifacts. The V3 apps use workspace source at 0f510aaa6f5e9a8a043d7c24c9741966a27042d8.
- Transport: standalone Release apps with embedded production JavaScript bundles. Hardware evidence: iOS Simulator, not a physical device.

## Limitations

- Simulator measurements include host scheduling noise and do not establish physical-device startup, memory, GPU, or energy parity.
- The mount, stable-key style update, and keyed remount timers start before React reconciliation and end in a layout effect. They include JavaScript render/reconciliation and the synchronous native commit boundary, but not the next fully drawn frame.
- V2 and V3 runtime apps use their supported token and conditional-style spelling. The shared runtime fixture keeps resolved styles, element counts, component hierarchy, React Native/Expo versions, and measurement code equivalent.
- Each runtime app executes raw-style, token, active pseudo, active group, and Button behavior gates before timing. The runner requires identical V2/V3 resolved native-style signatures.
- The compiler fixture uses byte-identical JSX with raw numeric/RGB styles. The evidence gate applies both compiler outputs and structurally asserts expected host styles plus preserved stable-key style updates.
- The V3 compiler-evidence gate proved that the build generated lowering plans, but this campaign did not verify that the Release bundle consumed them. The V3 compiled arm is invalid because its Metro plan lookups missed at bundle time.
- Compiled fixture updates change opacity on identical React Native wrappers so static Tamagui candidates remain fully eligible for both compilers. Treat compiled update as a native commit control; compiler effects come from mount, keyed remount, coverage, and output behavior.
- Compiler coverage is a representative synthetic fixture. The runtime component case exercises real Tamagui Button code, but this campaign does not claim compiler coverage for a production application corpus.
