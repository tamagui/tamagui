# Lead: v3 moved position onto individual CSS properties, drivers and tests have not all followed

v3 writes position and transform to the **individual** CSS properties
(`translate`, `rotate`, `scale`) rather than composing a single `transform`
matrix. Two failures are confirmed instances of things that still assume the old
composed form, in opposite directions. A larger cluster of animated-driver
failures *might* share a cause with them, and this doc is explicit about which
ones have been checked and which have not.

**Do not assume one root cause covers the cluster.** The evidence below already
splits it into at least three groups, and one candidate that looked like a
perfect match turned out not to be.

## Confirmed instance 1: a test reading the wrong property (fixed)

`code/kitchen-sink/tests/TooltipStaticClobber.animated.test.tsx` sampled the
tooltip's x with:

```js
const m = new DOMMatrixReadOnly(getComputedStyle(el).transform)
rec.push({ x: m.e, id: el.__recId })
```

v3 puts that position in `translate`, so the recorder read a constant and
reported teleport-sized jumps. It failed on `animated-css` (maxJump 949.5) and
`animated-reanimated` (120.5 / 241.1) while passing on `animated-motion`.

Fixed by using the reader the sibling `TooltipToolbarRow.animated.test.tsx`
already had:

```js
const style = getComputedStyle(el)
const x =
  style.translate !== 'none'
    ? Number.parseFloat(style.translate)
    : style.transform === 'none'
      ? 0
      : new DOMMatrixReadOnly(style.transform).e
```

Green on css, reanimated, and motion afterwards; native skips by design.

This is the worked precedent. It is a **test-side** defect: the runtime was
right, the measurement was wrong.

## Confirmed instance 2: a driver emitting the wrong form (open)

`code/sandbox/tests/hydration-drivers.test.ts:73`, "Hydration - motion driver >
transform styles render correctly before and after hydration", in the
`v3-ssr-hydration` CI job. Expected vs received:

```
- Expected                                                        + Received
-   "rotate": "5deg",                                             +   "rotate": "none",
-   "scale": "1.1",                                               +   "scale": "none",
-   "transform": "none",                                          +   "transform": "matrix(1.09581, 0.0958713, -0.0958713, 1.09581, 50, 20)",
-   "translate": "50px 20px",                                     +   "translate": "none",
```

This is the mirror image of instance 1 and it is **runtime-side**: the test
correctly expects individual properties, and the motion driver composes a matrix
instead. `1 failed | 12 passed` in that job, so it is a specific driver path, not
a wholesale break.

This is the highest-value thing in this doc. Start here.

## The animated-driver cluster, with verification status

From the CI run on `6fbe1ba2f3` (PR #4155, `integration-tests` shards). Drivers
matter: which ones a failure appears on is itself evidence.

| failure | drivers | shares the transform cause? |
| --- | --- | --- |
| `TabHoverAnimation:202` x animation fires during tab switch | reanimated only | **NO, checked** |
| `AnimatePresenceEnterExit` :46 :84 :98 :112 | motion, native, reanimated (css passes) | **unlikely, see below** |
| `DialogFocusScope` :9 :75 :107 :167 :196 | native only | not checked, probably unrelated |
| `DialogPointerEvents:18` | native only | not checked, probably unrelated |
| `SheetSnapPointsFit:487` | native only | not checked, probably unrelated |
| `DialogPresenceCompletion:49` inline + portal | motion only | not checked |

**`TabHoverAnimation:202` is ruled out, and this is the important negative
result.** It looked like a perfect match: it fails with
`expect(hasMovement).toBe(true)` receiving `false`, which is exactly the "reads a
constant, sees no movement" symptom of instance 1. But its reader is **already
correct** — lines 68-72 and 182-186 read `style.translate` first and fall back to
the transform matrix, the same shape as the fix above. So the test is measuring
properly and reanimated genuinely is not moving x. That is a real driver failure,
possibly related to instance 2, but it is not the same defect.

**`AnimatePresenceEnterExit` is probably a different problem.** Its assertion is
`expect(midOpacity).toBeLessThan(1)` — it fails because opacity is already 1
partway through the enter, meaning no intermediate frames. Opacity is not a
transform property, so the property split does not obviously explain it. Note it
passes on `animated-css` and fails on all three JS drivers, which points at
enter-animation scheduling rather than at how transforms are written.

**The native-only group** (`DialogFocusScope` x5, `DialogPointerEvents`,
`SheetSnapPointsFit`) is seven failures on one driver, covering focus trapping,
pointer pass-through, and adapt-to-dialog layout. Nothing about those is
transform-shaped. Treat as its own investigation.

## Latent risk worth auditing, not currently failing

Thirteen kitchen-sink test files read `transform` and never `translate`:

```
AnimationBehavior.animated  ClickDuringEnter.animated  ExitStyleNewKey
HeightMediaQueryOverride    MotionLinkedBenchmark.animated
PopoverClickDuringEnter.animated  PopoverScopedPositionGlitch.animated
RawAnimatedValue            PublicAnimatedNumber.animated
SheetAnimation.animated     Toast  TooltipPositionJump.animated
TooltipRapidSwitch.animated
```

All of these currently pass. That is not the same as being correct: a test that
reads the wrong property can pass vacuously, the way the tooltip suite's
`ids.size` assertion kept passing while its jump assertion measured nothing real.
Worth a pass to confirm each is either measuring an element v3 still writes
`transform` on, or would actually fail if its animation broke. Do not "fix" them
in bulk without that check.

## How to run these

```sh
cd code/kitchen-sink
NODE_ENV=test TAMAGUI_TEST_ANIMATION_DRIVER=<driver> \
  npx playwright test --project=animated-<driver> --reporter=list tests/<file>
# driver: css | reanimated | motion | native
```

SSR hydration:

```sh
cd code/sandbox
TEST_MODE=prod NODE_ENV=test bunx playwright test hydration-drivers.test.ts
```

Read `plans/v3-kitchen-sink-component-failures.md` before running anything: it
covers the port-9000 dev-server trap, the fact that `@tamagui/core` ships bundled
dist inlining `@tamagui/web` so a filtered rebuild measures stale code, and why
`OnLayoutStress` must never be judged under load.
