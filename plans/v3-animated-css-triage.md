# V3 animated CSS failure triage

Baseline: 34 failures, 190 passes, and 20 skips in the `animated-css` Playwright project.

## Classification

The v2 control partitions the original 34 failures into 29 genuine regressions,
one inherited failure, and four failures from a v3-only spec. All 29 shared-spec
regressions now pass. The inherited failure does not block v3. The v3-only
dialog completion cases also pass after the shared condition-path fix, so they
do not remain as a beta limitation.

| Failure group | Count | Classification | Evidence |
| --- | ---: | --- | --- |
| `AnimationBehavior`: scale timing, per-property scale, interruption x, two default/unlisted scale cases, specified-only scale, delayed per-property scale | 7 | A: fixed V3 regression | V2 passes. V3 emits CSS `scale` and `translate`, while the driver and tests targeted only `transform`. After `6197fcf433` and the V3-aware readers, all 16 tests in the file pass with one worker and no retries. |
| `AnimationsWithMediaQueries`: five scale cases and one translate x case | 6 | A: fixed V3 regression | V2 passes. All six previously red cases pass after reading CSS `scale` and `translate`. |
| `Progress`: first paint and value-change interpolation | 2 | A: fixed V3 regression | V2 passes. The V3-aware percentage reader fixes first paint; expanding `animateOnly={['transform']}` to the flat transform properties fixes value changes. |
| `PopoverHoverableScoped`: position interpolation | 1 | A: fixed V3 regression | V2 passes. The isolated V3 case had no intermediate frames before the transform filter expansion and passes afterward. |
| `TabHoverPositionSmooth`: A to E position interpolation | 1 | A: fixed V3 regression | V2 passes. The isolated V3 case jumped 231 px before the transform filter expansion and passes afterward. |
| `TooltipToolbarRow`: fast sweep | 1 | A: fixed V3 regression | V2 passes. V3 passes after measuring individual CSS `translate`. |
| `TooltipToolbarRow`: resize recenter | 1 | B: inherited | V2 also fails this assertion, with a 113 px center delta against the less-than-3 px requirement. V3 currently passes, but the original red is not a V3 regression. |
| `AnimatePresenceEnterExit`: four enter cases | 4 | A: fixed V3 regression | V2 passes. V3 merged `enterStyle` and unsupported web `exitStyle` clauses into one program, causing the whole property to drop. Web exits now retain runtime ownership and all seven tests in the file pass. |
| `DialogPresenceCompletion`: inline/portal enter and exit | 4 | C: v3-only spec, now passing | The file does not exist on v2, so these are not part of the regression gate. The shared condition-path fix also resolved them; all five tests in the file pass. |
| `ExitTimingCheck`: tab exit retention | 1 | A: fixed V3 regression | V2 passes. Keeping web exit styles on the runtime state path restores exit retention. |
| `TooltipAnimation`: enter opacity interpolation | 1 | A: fixed V3 regression | V2 passes. The enter program now survives beside its runtime-owned exit style. |
| `TabHoverAnimation`: x animation during tab switch | 1 | A: fixed V3 regression | V2 passes. Runtime exit transforms and V3 individual translate values both apply; the reader now composes both representations. |
| `PseudoTransition`: group-hover fast enter | 1 | A: fixed V3 regression | V2 passes. Conversion now records conditional transition metadata, and conditional CSS timing overrides the inline base preset. |
| `StyledButtonVariantPseudoMerge`: three pseudo/variant merge cases | 3 | A: fixed V3 regression | V2 passes. Styled HOCs and props-only splits now leave condition objects for the inner style-owning frame. |

## V2 control

The same 12 shared affected spec files ran on `/Users/n8/tamagui` main with one
worker and no retries. The result was 69 passed, one failed, and two skipped.
The only original shared red that also failed was the tooltip-toolbar resize
recenter case. `DialogPresenceCompletion.animated.test.tsx` is absent on v2,
which accounts for all four bucket-C failures.

```sh
NODE_ENV=test TAMAGUI_TEST_ANIMATION_DRIVER=css npx playwright test tests/AnimatePresenceEnterExit.animated.test.tsx tests/AnimationBehavior.animated.test.tsx tests/AnimationsWithMediaQueries.animated.test.tsx tests/ExitTimingCheck.animated.test.ts tests/PopoverHoverableScoped.animated.test.tsx tests/Progress.animated.test.tsx tests/PseudoTransition.animated.test.tsx tests/StyledButtonVariantPseudoMerge.animated.test.tsx tests/TabHoverAnimation.animated.test.tsx tests/TabHoverPositionSmooth.animated.test.tsx tests/TooltipAnimation.animated.test.tsx tests/TooltipToolbarRow.animated.test.tsx --project=animated-css --workers=1 --retries=0
```

After the V3 fixes, the identical command on `v3-beta` passed 70 tests with two
skips. This clears all 29 bucket-A regressions. The v3-only dialog file also
passes five tests in its isolated CSS-driver run.

## PseudoTransition flake

The `exit should use base transition timing` case is a real regression with a threshold-shaped symptom. Five isolated HEAD runs failed 4/5 at the prerequisite hover assertion, with observed values `0.699646`, `0.698772`, `0.698518`, and `0.699655`. Five comparison runs against the preceding transition-wiring revision failed 2/5 at `0.699586` and `0.698685`.

Those values are the expected neighborhood for a 1000 ms transition moving opacity from 0.3 toward 1 after about 400 ms. A working 200 ms pseudo enter should already be near 1. The test threshold must not be loosened. The preserved clean rerun is:

```sh
NODE_ENV=test TAMAGUI_TEST_ANIMATION_DRIVER=css npx playwright test tests/PseudoTransition.animated.test.tsx --project=animated-css --workers=1 --retries=0 --repeat-each=5 --grep 'exit should use base transition timing'
```

After `8e8a280556`, that command passes 5/5. The complete CSS-driver file passes
seven tests with one expected skip.

## Validation commands

```sh
cd code/core/web
bun run build

cd ../../kitchen-sink
NODE_ENV=test TAMAGUI_TEST_ANIMATION_DRIVER=css npx playwright test tests/AnimatePresenceEnterExit.animated.test.tsx tests/AnimationBehavior.animated.test.tsx tests/AnimationsWithMediaQueries.animated.test.tsx tests/ExitTimingCheck.animated.test.ts tests/PopoverHoverableScoped.animated.test.tsx tests/Progress.animated.test.tsx tests/PseudoTransition.animated.test.tsx tests/StyledButtonVariantPseudoMerge.animated.test.tsx tests/TabHoverAnimation.animated.test.tsx tests/TabHoverPositionSmooth.animated.test.tsx tests/TooltipAnimation.animated.test.tsx tests/TooltipToolbarRow.animated.test.tsx --project=animated-css --workers=1 --retries=0
```

The final shared-spec V3 run passed 70 tests with two skips in 4.9 minutes.
