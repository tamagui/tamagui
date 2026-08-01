# V3 animated CSS failure triage

Baseline: 34 failures, 190 passes, and 20 skips in the `animated-css` Playwright project.

## Classification

All 34 failures are V3 regressions. None are inherited behavior and none are proven threshold noise.

| Failure group | Count | Classification | Evidence |
| --- | ---: | --- | --- |
| `AnimationBehavior`: scale timing, per-property scale, interruption x, two default/unlisted scale cases, specified-only scale, delayed per-property scale | 7 | V3 transform representation and transition regression | V3 emits CSS `scale` and `translate`, while the driver and tests targeted only `transform`. After `6197fcf433` and the V3-aware readers, all 16 tests in the file pass with one worker and no retries. |
| `AnimationsWithMediaQueries`: five scale cases and one translate x case | 6 | V3 transform representation regression | All six previously red cases pass with one worker and no retries after reading CSS `scale`/`translate`. |
| `Progress`: first paint and value-change interpolation | 2 | V3 transform representation and filter regression | First paint passes with the V3-aware percentage translate reader. Value changes pass after public `animateOnly={['transform']}` expands to `translate`, `scale`, `rotate`, and legacy `transform`. |
| `PopoverHoverableScoped`: position interpolation | 1 | V3 transform filter regression | The isolated case had 0 intermediate frames before the filter expansion and passes afterward. |
| `TabHoverPositionSmooth`: A to E position interpolation | 1 | V3 transform filter regression | The isolated case jumped 231 px before the filter expansion and passes afterward. |
| `TooltipToolbarRow`: resize recenter and fast sweep | 2 | V3 transform measurement regression | Both cases pass with one worker and no retries after measuring CSS `translate`. |
| `AnimatePresenceEnterExit`: four enter cases | 4 | V3 legacy condition program regression | `enterStyle` is converted at the `getSplitStyles` loop entry. The rendered element does not retain the clause-only opacity program, so opacity is 1 on every sampled frame. The converter was introduced after `v2.5.1`. |
| `DialogPresenceCompletion`: inline/portal enter and exit | 4 | V3 legacy condition program regression | Browser animation promises see no retained enter/exit animation and completion fires immediately. This shares the missing `enterStyle`/`exitStyle` program path. |
| `ExitTimingCheck`: tab exit retention | 1 | V3 legacy condition program regression | The exiting element is removed without the expected retained exit program. |
| `TooltipAnimation`: enter opacity interpolation | 1 | V3 legacy condition program regression | The enter element exists but opacity is already 1 at the intermediate sample. The adjacent V3-aware translate reader passes. |
| `TabHoverAnimation`: x animation during tab switch | 1 | V3 legacy condition program regression | Correct `translate` measurement and transform-family transition targeting still yield only zero-valued frames. The x value lives solely in variant-generated `enterStyle`/`exitStyle`. |
| `PseudoTransition`: group-hover fast enter | 1 | V3 legacy condition metadata regression | Conversion consumes `$group-*` before `getSubStyle` records `pseudoTransitions`, so the 1000 ms base timing remains active instead of the 200 ms group timing. |
| `StyledButtonVariantPseudoMerge`: three pseudo/variant merge cases | 3 | V3 legacy condition program regression | Variant-expanded `pressStyle` programs do not reach the rendered styled/HOC button. The background remains the base color; the V3 scale assertion must read CSS `scale`. |

The legacy condition converter landed in `28dce09fc7` on 2026-07-29. The comparison tag `v2.5.1` is `66ec2bcd55` from 2026-07-22, so the shared condition-program root is not inherited pre-V3 behavior.

## PseudoTransition flake

The `exit should use base transition timing` case is a real regression with a threshold-shaped symptom. Five isolated HEAD runs failed 4/5 at the prerequisite hover assertion, with observed values `0.699646`, `0.698772`, `0.698518`, and `0.699655`. Five comparison runs against the preceding transition-wiring revision failed 2/5 at `0.699586` and `0.698685`.

Those values are the expected neighborhood for a 1000 ms transition moving opacity from 0.3 toward 1 after about 400 ms. A working 200 ms pseudo enter should already be near 1. The test threshold must not be loosened. The preserved clean rerun is:

```sh
NODE_ENV=test TAMAGUI_TEST_ANIMATION_DRIVER=css npx playwright test tests/PseudoTransition.animated.test.tsx --project=animated-css --workers=1 --retries=0 --repeat-each=5 --grep 'exit should use base transition timing'
```

## Validation commands

```sh
cd code/core/animations-css
bun run build

cd ../../kitchen-sink
NODE_ENV=test TAMAGUI_TEST_ANIMATION_DRIVER=css npx playwright test tests/AnimationBehavior.animated.test.tsx --project=animated-css --workers=1 --retries=0
```

The first isolated integration run passed 16/16 in 4.4 minutes. A second one-worker run passed all six media-query cases, both tooltip-toolbar cases, the Progress first-paint case, and the tooltip translate case. After expanding the `transform` filter, the previously failing Progress value update and both popover position cases passed.
