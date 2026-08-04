# Enter animations do not run on any JS driver, only css

Six failures, one cause. Found while chasing the last unexplained Dialog failure.

## Measured

`AnimatePresenceEnterExitCase`, scenario 01, opacity sampled every 50ms right
after the trigger:

| driver | opacity samples | intermediate frames |
| --- | --- | --- |
| css | `0, 0.003, 0.044, 0.123, 0.230, 0.356, 0.512, 0.680, 0.931, 1` | **7** |
| motion | `0, 1, 1, 1, …` | **0** |
| native | `1, 1, 1, …` (never even starts at 0) | **0** |
| reanimated | `1, 1, 1, …` | **0** |

`DialogPresenceCompletionCase`, a Dialog.Content authored `transition="1000ms"`,
opacity sampled every 100ms:

| driver | opacity over 1.4s | animating? |
| --- | --- | --- |
| css | `0, 0.13, 0.28, 0.42, 0.55, 0.67, 0.77, 0.87, 0.94, 0.98, 1` | yes |
| motion | `0, 1, 1, …` | **no** |

So an authored 1000ms enter completes instantly on the JS drivers. Only the css
driver animates an enter at all.

## What that explains

- `AnimatePresenceEnterExit` :46 :84 :98 :112 on **motion, native and
  reanimated**, css passing. Its assertion is literally
  `expect(midOpacity).toBeLessThan(1)`, so zero intermediate frames is exactly
  the failure.
- `DialogPresenceCompletion` :49 x2 on **motion**. Instrumenting the motion
  driver's two enter paths showed it takes the `immediate-no-diff` branch and
  emits enter start and end together at 30ms, against a 1000ms authored
  transition. **That branch is not wrong about what it sees**: there genuinely is
  no animation to wait for. It is reporting the absence honestly, and the defect
  is upstream of it.

That is 6 of the failures in this campaign, and it is a visible product bug
rather than a test artifact: every enter transition (dialogs, popovers, toasts,
anything under AnimatePresence) is instant on three of the four drivers.

a2949 reached the edge of this early on and called it "enter-animation
scheduling on the JS drivers", explicitly ruling out the transform-property
split as the cause. That reading holds, and this measures it.

## Where it is not

- Not the native driver's exit hang. That was NaN completion targets and is
  fixed; this is the enter side and affects all three JS drivers equally.
- Not the transform matrix. That turned out to be a test race and an accepted
  representational difference.
- Not `DialogPresenceCompletion`'s own driver bookkeeping. The
  `immediate-no-diff` branch is a symptom reporting the truth.

## Next step for whoever takes it

The discriminating detail is that **native and reanimated never show opacity 0
at all** while **motion does show 0 and then jumps**. Motion applies the enter
style and fails to animate away from it; the other two appear not to apply the
enter style at all. Same visible outcome, possibly two mechanisms, so check both
rather than assuming one fix covers all three.

Reproduce with no test harness:

    ?theme=light&animationDriver=motion&test=AnimatePresenceEnterExitCase

click `enter-exit-01-trigger` and sample
`getComputedStyle(el).opacity` on `enter-exit-01-target`. Swap the driver in the
URL for the comparison; css is the known-good arm.
