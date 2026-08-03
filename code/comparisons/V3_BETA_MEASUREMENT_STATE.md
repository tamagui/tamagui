# V3 beta measurement state (2026-08-03)

Written at machine-move time. Records which retained numbers are trustworthy,
which are load-caveated, and which are known invalid, so nobody re-derives this
from scattered logs.

## Trustworthy: byte measurements

Bundle output is deterministic. It does not depend on machine load, so
everything here stands regardless of how busy the box was.

- V3 costs **+9,534 compiled whole-app gzip** vs V2 (runtime +9,409).
  Measured on the combined tree at `55a0c80c7c` (post-V6 + v3-engine),
  `metadata.dirty: false`.
- Tamagui-attributable gzip: V3 42,827, V2 33,418.
- Two independent controls reproduce the earlier retained record byte for byte:
  the V2 arm at 33,418, and the React control at 466,060 V3 / 465,924 V2.
  Neither should move, because no commit in this range touches V2 or React.
  If either moves in a future run, suspect the run, not the tree.
- Classifier audit resolved 478 module entries with 0 mismatches; all 26
  "other" entries are enumerated.
- V3 emits 106 Tamagui modules vs V2's 100; `directStyle` is 34,960 rendered
  bytes per V3 mode.

**This supersedes the previously retained +27,096 gzip figure**, which was
measured against built `dist` that predated the direct-emission merge
`12f7e0e981`. Do not cite +27,096.

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
still fails with that commit in the build and compiler evidence reporting 7/7
static and 3/3 dynamic lowered with zero bailouts. Plan generation and plan
delivery are separate layers and at least one is still wrong.

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
