# V3 beta web benchmark receipt

This record retains the controlled V3 versus V2 web comparison used for the V3
beta cut. The timing receipt contains 30 retained rounds after 3 warmup rounds,
with framework and scenario order reshuffled independently in every round using
seed `73129`.

## Source and commands

READ: the measured tree was clean commit
`55a0c80c7ca3911be484f1efbe7983f7b3967474`. It combines post-V6
`1e156ee3ff03d2da0f2803cf8e5b6ae7b9a69ed5` with v3-engine tip
`a9a034173536f4a7434c65167fcd16afeaf171bc`. The receipt records
`metadata.dirty: false`, byte-identical V3 and V2 fixture sources and configs,
and workload hash `56dd6ba8bb07f9ee8537096f8ab7a98f6f822c94b35bfbcf9ed33356e0a22c99`.

The root packages were rebuilt with `bun run build:force`. READ: Turbo reported
167 successful tasks and 0 cached tasks. The retained timing command was:

```sh
bun code/comparisons/run-benchmarks.ts --frameworks=tamagui-v3-compiled,tamagui-v3-runtime,tamagui-v2-compiled,tamagui-v2-runtime --samples=30 --warmups=3 --seed=73129 --bundle-attribution=/tmp/v3-wa-retained-bundle-attribution.json --output=/tmp/v3-wa-retained-web-benchmarks.json
```

Temporary output paths were used, and the generated receipt records
`metadata.dirty: false`. The generated JSON and HTML were then copied to
`v3-v2-web-benchmarks.json` and
`v3-v2-web-benchmarks.html` in this directory.

The deterministic bundle receipt used:

```sh
bun code/comparisons/run-benchmarks.ts --build-only --frameworks=tamagui-v3-compiled,tamagui-v3-runtime,tamagui-v2-compiled,tamagui-v2-runtime --seed=73129 --bundle-attribution=/tmp/v3-wa-combined-web-bundle-attribution.json
```

The production behavior gate used the same four arms and seed with
`--behavior-validation=/tmp/v3-wa-retained-web-behavior-conformance.json`.
READ: all five scenarios passed in all four arms, and the retained gate records
`comparable: true` and `metadata.dirty: false`.

## Bundle result

READ: the combined-tree production bundles are:

| Mode | Metric | V3 | V2 | V3 minus V2 |
| --- | --- | ---: | ---: | ---: |
| compiled | emitted JS | 311,767 | 283,397 | +28,370 |
| compiled | whole-app JS gzip | 103,687 | 94,153 | +9,534 |
| compiled | Tamagui-attributable gzip | 42,827 | 33,418 | +9,409 |
| compiled | emitted CSS | 3,441 | 4,427 | -986 |
| runtime | emitted JS | 310,372 | 281,483 | +28,889 |
| runtime | whole-app JS gzip | 103,220 | 93,811 | +9,409 |
| runtime | Tamagui-attributable gzip | 42,827 | 33,418 | +9,409 |
| runtime | emitted CSS | 0 | 0 | 0 |

READ: the retained pre-direct-emission compiled deltas were +86,116 emitted JS,
+27,096 whole-app gzip, and +27,146 Tamagui-attributable gzip. The combined
tree therefore places the compiled whole-app delta at +9,534 bytes.

READ: the React, react-dom, and scheduler rendered-byte control is 466,060 in
V3 and 465,924 in V2. The isolated minified React-control chunks are 182,423 and
182,421 raw bytes. Their gzip sizes are 57,105 and 57,091 in compiled mode, and
57,105 and 57,108 in runtime mode.

READ: the classification audit independently resolved all 478 emitted module
entries by owning package and found 0 group mismatches. V3 emits 106
Tamagui-attributable modules per mode versus 100 in V2. `directStyle.mjs` is
classified under `@tamagui/web` in both V3 modes and contributes 34,960 rendered
bytes. All 26 entries in the `other` group are enumerated in
`v3-v2-web-bundle-classification-audit.json`.

READ: the compiled arm found and lowered all 14 candidates, flattened 11,
partially lowered 3, and bailed out 0.

## Priority timing cells

All times are milliseconds. Paired confidence intervals apply to the V3 minus
V2 difference within each retained round.

READ: compiled animated mount changed from the stale record's 7.590 ms V3
versus 0.575 ms V2, or 13.200x, to 0.597 ms versus 0.420 ms, or 1.421x. The
retained paired difference is +0.177 ms with 95% CI `[0.098, 0.256]`. Per-cell
medians are 0.550 and 0.400 ms, 20% trimmed means are 0.578 and 0.406 ms, and
the leave-one-out 3 SD outlier counts are 1 and 0.

READ: compiled animated rerender is 1.893 ms V3 versus 1.743 ms V2, or 1.086x.
The paired difference is +0.150 ms with 95% CI `[-0.096, 0.396]`. Medians are
1.800 and 1.550 ms, trimmed means are 1.778 and 1.683 ms, and outlier counts are
1 and 1.

READ: runtime simple mount is 5.707 ms V3 versus 4.630 ms V2, or 1.233x. The
paired difference is +1.077 ms with 95% CI `[0.111, 2.042]`. Medians are 5.300
and 3.950 ms, trimmed means are 5.433 and 4.117 ms, and outlier counts are 1
and 2.

## Full timing and robust-estimator table

Each slash-separated value is V3 / V2. The trimmed column removes six values
from each tail of each 30-sample cell. The outlier column uses a leave-one-out
3 SD test defined in `v3-v2-web-robust-stats.json`.

| Mode | Scenario | Metric | Mean V3 / V2 | Paired difference and 95% CI | Mean ratio | Median V3 / V2 | 20% trimmed V3 / V2 | Outliers V3 / V2 |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| compiled | simple | mount | 0.367 / 0.393 | -0.027 [-0.097, 0.043] | 0.932x | 0.400 / 0.400 | 0.361 / 0.383 | 0 / 0 |
| compiled | simple | rerender | 1.037 / 1.207 | -0.170 [-0.360, 0.020] | 0.859x | 0.950 / 1.100 | 0.967 / 1.128 | 1 / 1 |
| compiled | rich | mount | 0.413 / 0.403 | +0.010 [-0.052, 0.072] | 1.025x | 0.400 / 0.400 | 0.417 / 0.406 | 0 / 1 |
| compiled | rich | rerender | 1.197 / 1.867 | -0.670 [-0.876, -0.464] | 0.641x | 1.150 / 1.850 | 1.161 / 1.867 | 1 / 1 |
| compiled | group | mount | 0.790 / 0.853 | -0.063 [-0.177, 0.051] | 0.926x | 0.700 / 0.800 | 0.733 / 0.767 | 2 / 0 |
| compiled | group | rerender | 2.500 / 3.300 | -0.800 [-1.227, -0.373] | 0.758x | 2.100 / 2.800 | 2.289 / 2.922 | 1 / 1 |
| compiled | heavy | mount | 3.280 / 4.130 | -0.850 [-1.416, -0.284] | 0.794x | 3.250 / 3.850 | 3.194 / 3.844 | 1 / 2 |
| compiled | heavy | rerender | 2.557 / 3.180 | -0.623 [-0.997, -0.250] | 0.804x | 2.200 / 2.850 | 2.333 / 2.950 | 2 / 1 |
| compiled | animated | mount | 0.597 / 0.420 | +0.177 [0.098, 0.256] | 1.421x | 0.550 / 0.400 | 0.578 / 0.406 | 1 / 0 |
| compiled | animated | rerender | 1.893 / 1.743 | +0.150 [-0.096, 0.396] | 1.086x | 1.800 / 1.550 | 1.778 / 1.683 | 1 / 1 |
| runtime | simple | mount | 5.707 / 4.630 | +1.077 [0.111, 2.042] | 1.233x | 5.300 / 3.950 | 5.433 / 4.117 | 1 / 2 |
| runtime | simple | rerender | 0.993 / 1.193 | -0.200 [-0.412, 0.012] | 0.832x | 1.000 / 1.100 | 0.989 / 1.072 | 0 / 1 |
| runtime | rich | mount | 9.033 / 7.200 | +1.833 [1.086, 2.581] | 1.255x | 8.400 / 6.750 | 8.561 / 6.789 | 1 / 1 |
| runtime | rich | rerender | 1.170 / 1.600 | -0.430 [-0.551, -0.309] | 0.731x | 1.200 / 1.400 | 1.144 / 1.522 | 1 / 1 |
| runtime | group | mount | 13.460 / 10.533 | +2.927 [1.540, 4.313] | 1.278x | 12.900 / 9.050 | 12.739 / 9.644 | 1 / 1 |
| runtime | group | rerender | 8.280 / 8.243 | +0.037 [-0.723, 0.796] | 1.004x | 7.750 / 7.700 | 7.822 / 7.600 | 1 / 1 |
| runtime | heavy | mount | 9.230 / 7.010 | +2.220 [1.290, 3.150] | 1.317x | 8.200 / 6.300 | 8.517 / 6.528 | 1 / 1 |
| runtime | heavy | rerender | 6.600 / 5.833 | +0.767 [0.119, 1.414] | 1.131x | 6.150 / 5.500 | 6.128 / 5.472 | 1 / 1 |
| runtime | animated | mount | 6.710 / 6.497 | +0.213 [-0.460, 0.887] | 1.033x | 6.400 / 5.800 | 6.461 / 6.011 | 1 / 1 |
| runtime | animated | rerender | 7.310 / 7.900 | -0.590 [-1.441, 0.261] | 0.925x | 6.950 / 7.300 | 6.806 / 7.494 | 1 / 1 |

READ: mean, median, and 20% trimmed mean agree on the V3-versus-V2 direction
in every cell. The compiled simple mount and compiled rich mount medians tie;
their mean and trimmed differences are small and their paired confidence
intervals cross zero. INFERRED: the retained conclusions do not depend on the
leave-one-out outliers because the three estimators agree at the stated
precision.

## Machine-load disclosure

READ: the attributed trace contains 11 snapshots from the start through the end
of the run. System idle ranged from 61.87% to 83.90%, with a 73.55% mean. The
trace captured an external `Onejs:dev` process at 101.8% CPU and another
session's Metro build at 105.3% CPU. No causal attribution from either process
to an individual benchmark sample is claimed.

`v3-v2-web-load-trace.json` retains each CPU snapshot and its top processes with
explicit workload attribution. Full command arguments were reduced to workload
categories before retention. READ: the retained trace contains categories and
executable names, with no command arguments.
