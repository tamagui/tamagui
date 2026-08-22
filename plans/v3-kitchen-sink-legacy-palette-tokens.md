# The kitchen sink still authors v5 palette tokens, and they render as nothing

Found 2026-08-04 while attributing the red iOS Detox shards.

## What happens

V5 palette-step names such as `blue10`, `red10` and `gray11` do not exist in the
v6 config. Its color tokens are Tailwind names (`blue-600`, `gray-500`), and the
only numbered names are theme keys (`color1` through `color11`). An unmigrated
palette name therefore resolves to nothing, and the two platforms disagree about
what that means:

- **Web:** the property is dropped. Measured on `PressStyleNative` under the
  reanimated driver, `backgroundColor: 'blue10 press:red10'` computed to
  `rgba(0, 0, 0, 0)`. No error, no warning.
- **Native:** reanimated rejects it. Detox run `30948627664` logged
  `ERROR [ReanimatedError: [Reanimated] Invalid color value: "blue10"]`
  immediately before `PressStyleNative.noRngh` failed its `beforeAll` launch
  hook at the 180 second timeout, with the app never answering the
  `color-test-pressable` element query.

This is the same silent-failure class the upgrade guide warns testers about. The
new part is that our own fixture suite is full of it.

## Why it matters for the device gate

Five of the seven red iOS Detox suite families had unmigrated tokens in the exact
fixture they launch:

| suite | fixture | asserted color? |
| --- | --- | --- |
| `PressStyleNative.noRngh` | `PressStyleNative` | yes, `isBlueish` / `isReddish` |
| `GroupPressTransitionMatrix` | `GroupPressTransitionMatrix` | yes |
| `NativeMixedDriver` | `NativeMixedDriverCase` | yes, `isBlueish` |
| `PressStyleScrollStuck` | `PressStyleScrollStuck` | text only |
| sheet keyboard cases | `SheetKeyboardFitContentCase` | text only |

A test asserting "should show blue background at rest" cannot pass against a
transparent element, on any platform, regardless of whether the driver throws.

`Accordion` and `PointerEvents` have no legacy tokens; their failures have some
other cause. The `Accordion` one was already diagnosed as a view-matcher miss in
`plans/v3-android-verdict-a8d156b150.md`.

## Fixed

Commit `5bbe5fae23` migrates those five fixtures:

| was | is | rendered value |
| --- | --- | --- |
| `blue10` | `blue-600` | `rgb(21, 93, 252)` |
| `red10` | `red-600` | `rgb(231, 0, 11)` |
| `green10` | `green-600` | `rgb(0, 166, 62)` |
| `gray11` | `color10` | `rgb(16, 24, 40)` |

Each replacement was checked against the assertion helper that reads it in
`code/kitchen-sink/e2e/utils/colors.ts`, not just eyeballed. `isBlueish` requires
`b > 60 && b > r && b > g`; `blue-600` gives 252, 21, 93. `isReddish` requires
`r > 60 && r > b && r > g`; `red-600` gives 231, 11, 0. `isGreenish` requires
`g > 60 && g > r && g > b`; `green-600` gives 166, 0, 62. `green-600` also has to
fail `isBlueish` for `NativeMixedDriver`'s `!isBlueish(expandedColor)` assertion,
and it does, because its blue channel of 62 is below its green channel of 166.

### Second pass: `gray2` wedged GroupPressTransitionMatrix

The first pass migrated this fixture's children and left `gray2` on both parent
frames and `gray4` on the release target. `FrameAnim` carries `transition:
'quick'`, so its background goes through reanimated, and Detox run `30956520834`
logged `ERROR [ReanimatedError: [Reanimated] Invalid color value: "gray2"]` at
23:02:39, immediately followed by "Run loop Main Run Loop is awake" every ten
seconds until the `beforeAll` hook hit its 180 second timeout. All five tests
then reported at 1 to 20 ms each, which reads like five assertion failures and is
really one app that never became idle. It failed the same way on the retry.

So the native consequence of an unmigrated token depends on what draws it. On a
static component it paints nothing. On a reanimated-driven one it throws, spins
the main run loop, and takes down every test in the file.

`gray2` maps to `gray-100` and `gray4` to `gray-200`. Under the v6 config those
resolve to `#f3f4f6` and `#e5e7eb`; `gray2` stays the raw string `gray2`, which
is what reanimated rejects. Neither frame color is asserted by the suite, which
only checks child colors and `release-target` existence.

`gray11` maps to `color10` rather than a fixed gray token because `color10` is
what the already-migrated fixtures use for secondary text, 34 sites to
`color11`'s 24, and because a theme key follows dark mode.

Measured before and after on the same page: `PressStyleNative`'s pressable went
from `rgba(0, 0, 0, 0)` to `rgb(21, 93, 252)`. `GroupPressTransitionMatrix` and
`NativeMixedDriverCase` now paint their blue and green. The device verdict is the
branch Detox run; the web probe only proves the token resolves.

## Not fixed

**38 files and 208 sites still author v5 palette names.** Most are latent:
whatever they color is not asserted, or their suite does not run on a driver that
throws. A site on a reanimated-driven component is not latent, though, and does
not merely paint transparent. See the `gray2` entry below. Largest offenders:

| file | sites |
| --- | --- |
| `AnimationComprehensiveCase.tsx` | 53 |
| `ExitCompletionCase.tsx` | 15 |
| `HeightMediaQueryOverrideCase.tsx` | 9 |
| `SheetKeyboardDragCase.tsx` | 8 |
| `ComplexVariants.tsx` | 7 |
| `PlaceholderTextColor.tsx` | 6 |
| `GroupPressNative.tsx` | 6 |
| `AnimationValueLoggingCase.tsx` | 6 |

Find them all with:

```sh
grep -rlE "['\"](blue|red|green|gray|purple|orange|pink|teal|yellow)[0-9]{1,2}\b" \
  code/kitchen-sink/src/usecases/*.tsx
```

The pattern above used to read `(9|10|11|12)`, which is what let the second
`GroupPressTransitionMatrix` failure through. Low steps are exactly as invalid as
high ones: `gray2` and `gray4` do not exist in v6 either.

This was left for a separate pass on purpose. Each site needs a judgement the
codemod explicitly declines to make, since it cannot pick the intended
replacement, and a fixture that currently passes with a transparent element could
change behavior once it actually paints. Do it as its own change with a Detox run
attached, not folded into unrelated work.

The same sweep should cover `code/kitchen-sink/e2e/utils/colors.ts`, whose doc
comments still say "for blue10" and "in dark themes color4 can be a darker blue".
