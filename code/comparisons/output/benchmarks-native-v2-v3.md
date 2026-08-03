# V2/V3 native runtime and compiler benchmark

Generated 2026-08-03T03:38:08.240Z. The JSON beside this file is authoritative and retains every warmup and sample.

| Comparison | Scenario | Metric | Left mean ± SD (ms) | Right mean ± SD (ms) | Right delta | Paired difference 95% CI (ms) | Cohen's dz |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| runtime V3 versus V2 | simple | mount | 20.35 ± 2.71 | 28.06 ± 5.42 | +37.9% | 4.06 to 11.37 | 1.34 |
| runtime V3 versus V2 | simple | update | 15.37 ± 1.45 | 21.46 ± 1.16 | +39.6% | 4.98 to 7.19 | 3.50 |
| runtime V3 versus V2 | simple | remount | 17.85 ± 1.62 | 23.31 ± 1.10 | +30.6% | 4.42 to 6.51 | 3.34 |
| runtime V3 versus V2 | themed | mount | 18.75 ± 2.51 | 26.64 ± 2.16 | +42.0% | 5.80 to 9.97 | 2.40 |
| runtime V3 versus V2 | themed | update | 16.50 ± 2.69 | 20.09 ± 0.76 | +21.8% | 1.94 to 5.25 | 1.38 |
| runtime V3 versus V2 | themed | remount | 17.49 ± 1.43 | 21.83 ± 0.72 | +24.8% | 3.22 to 5.46 | 2.46 |
| runtime V3 versus V2 | rich | mount | 36.15 ± 6.10 | 54.88 ± 6.77 | +51.8% | 12.22 to 25.25 | 1.83 |
| runtime V3 versus V2 | rich | update | 27.23 ± 1.31 | 42.52 ± 1.39 | +56.2% | 14.20 to 16.38 | 8.89 |
| runtime V3 versus V2 | rich | remount | 30.85 ± 0.59 | 47.33 ± 1.51 | +53.4% | 15.41 to 17.55 | 9.79 |
| runtime V3 versus V2 | group | mount | 82.67 ± 4.49 | 98.32 ± 4.04 | +18.9% | 13.45 to 17.85 | 4.51 |
| runtime V3 versus V2 | group | update | 35.16 ± 1.90 | 47.20 ± 2.33 | +34.2% | 9.89 to 14.19 | 3.55 |
| runtime V3 versus V2 | group | remount | 77.68 ± 3.24 | 94.76 ± 2.89 | +22.0% | 14.02 to 20.15 | 3.54 |
| runtime V3 versus V2 | heavy | mount | 46.90 ± 6.82 | 58.76 ± 8.83 | +25.3% | 7.87 to 15.85 | 1.89 |
| runtime V3 versus V2 | heavy | update | 24.10 ± 1.07 | 30.99 ± 1.21 | +28.6% | 5.83 to 7.94 | 4.15 |
| runtime V3 versus V2 | heavy | remount | 41.47 ± 1.18 | 51.32 ± 1.20 | +23.8% | 8.62 to 11.09 | 5.07 |
| runtime V3 versus V2 | component | mount | 50.30 ± 3.86 | 49.70 ± 4.23 | -1.2% | -4.43 to 3.23 | -0.10 |
| runtime V3 versus V2 | component | update | 23.61 ± 1.36 | 31.33 ± 2.73 | +32.7% | 6.24 to 9.21 | 3.30 |
| runtime V3 versus V2 | component | remount | 45.37 ± 2.78 | 45.31 ± 3.27 | -0.1% | -1.52 to 1.40 | -0.03 |
| compiled V3 versus V2 | simple | mount | 4.64 ± 0.77 | 23.94 ± 2.50 | +416.1% | 17.78 to 20.82 | 8.08 |
| compiled V3 versus V2 | simple | update | 0.74 ± 0.06 | 0.76 ± 0.31 | +2.1% | -0.16 to 0.19 | 0.06 |
| compiled V3 versus V2 | simple | remount | 4.18 ± 0.43 | 22.91 ± 0.57 | +448.6% | 18.22 to 19.26 | 22.86 |
| compiled V3 versus V2 | nested-static | mount | 6.44 ± 0.90 | 39.08 ± 3.31 | +507.1% | 30.25 to 35.04 | 8.65 |
| compiled V3 versus V2 | nested-static | update | 0.37 ± 0.09 | 0.39 ± 0.11 | +5.2% | -0.08 to 0.12 | 0.12 |
| compiled V3 versus V2 | nested-static | remount | 5.77 ± 0.42 | 34.14 ± 0.93 | +491.9% | 27.68 to 29.07 | 25.95 |
| compiled V3 versus V2 | styled-static | mount | 8.60 ± 1.15 | 12.90 ± 1.37 | +50.0% | 2.90 to 5.70 | 1.95 |
| compiled V3 versus V2 | styled-static | update | 0.33 ± 0.04 | 0.33 ± 0.05 | -0.3% | -0.04 to 0.04 | -0.02 |
| compiled V3 versus V2 | styled-static | remount | 7.34 ± 0.81 | 10.98 ± 0.49 | +49.7% | 2.96 to 4.33 | 3.37 |
| V2 compiler effect | simple | mount | 20.35 ± 2.71 | 4.64 ± 0.77 | -77.2% | -17.60 to -13.82 | -5.27 |
| V2 compiler effect | simple | update | 15.37 ± 1.45 | 0.74 ± 0.06 | -95.2% | -15.55 to -13.70 | -10.04 |
| V2 compiler effect | simple | remount | 17.85 ± 1.62 | 4.18 ± 0.43 | -76.6% | -14.73 to -12.61 | -8.22 |
| V3 compiler effect | simple | mount | 28.06 ± 5.42 | 23.94 ± 2.50 | -14.7% | -8.34 to 0.09 | -0.62 |
| V3 compiler effect | simple | update | 21.46 ± 1.16 | 0.76 ± 0.31 | -96.5% | -21.42 to -19.98 | -18.18 |
| V3 compiler effect | simple | remount | 23.31 ± 1.10 | 22.91 ± 0.57 | -1.7% | -1.27 to 0.47 | -0.29 |

## Method

- 2 warmup rounds and 12 retained rounds.
- Every round contains every framework/scenario case once in seeded randomized order.
- Runtime and compiler comparisons each use one shared versioned fixture. All four apps use Expo 55, React 19.1, React Native 0.83.2, and the same simulator.
- The V2 apps use npm 2.6.2 artifacts. The V3 apps use workspace source at da80f52af4bf7eaf8af99195371d2cff644cc7eb.
- Transport: standalone Release apps with embedded production JavaScript bundles. Hardware evidence: iOS Simulator, not a physical device.

## Limitations

- Simulator measurements include host scheduling noise and do not establish physical-device startup, memory, GPU, or energy parity.
- The mount, stable-key style update, and keyed remount timers start before React reconciliation and end in a layout effect. They include JavaScript render/reconciliation and the synchronous native commit boundary, but not the next fully drawn frame.
- V2 and V3 runtime apps use their supported token and conditional-style spelling. The shared runtime fixture keeps resolved styles, element counts, component hierarchy, React Native/Expo versions, and measurement code equivalent.
- Each runtime app executes raw-style, token, active pseudo, active group, and Button behavior gates before timing. The runner requires identical V2/V3 resolved native-style signatures.
- The compiler fixture uses byte-identical JSX with raw numeric/RGB styles. The evidence gate applies both compiler outputs and structurally asserts expected host styles plus preserved stable-key style updates.
- Compiled fixture updates change opacity on identical React Native wrappers so static Tamagui candidates remain fully eligible for both compilers. Treat compiled update as a native commit control; compiler effects come from mount, keyed remount, coverage, and output behavior.
- Compiler coverage is a representative synthetic fixture. The runtime component case exercises real Tamagui Button code, but this campaign does not claim compiler coverage for a production application corpus.
