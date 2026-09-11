# The Dialog cluster is one native-driver bug, not eleven

Checkpoint for the component-correctness lane on `v3-beta`. Written so the next
session can pick this up cold.

## The finding that collapses the list

The eleven Dialog failures were tracked as two unrelated groups because they came
from two different sources: six from CI on `animated-native`, three from the
kitchen-sink `default` project. They are the same bug.

`code/kitchen-sink/playwright.config.ts:51` pins the `default` project to
`metadata: { animationDriver: 'native' }`. Nine of the eleven failures therefore
run on **one driver**:

| failure | project | driver |
| --- | --- | --- |
| `DialogFocusScope` :9 :75 :107 :167 :196 | animated-native | native |
| `DialogPointerEvents:18` | animated-native | native |
| `DialogScoped` :9 :43 | default | **native** |
| `DialogSheetAdaptResize:15` | default | **native** |
| `DialogPresenceCompletion` x2 | animated-motion | motion (separate, still open) |

The confirming detail: every failing test asserts a dialog **closes**. The two
`DialogFocusScope` tests that never close a dialog, `:150` (auto-focus on mount)
and `:242` (z-index stacking), pass on native. `DialogSheetAdaptResize`'s other
four tests pass and none of them clicks a close button.

## What actually happens

Probed the same `DialogScopedCase` across all four drivers, clicking close and
sampling the DOM for 2s:

| driver | node removed after close |
| --- | --- |
| native | **never** (still present at 2s, `data-state="closed"`, `opacity: 0`) |
| css | 200ms |
| motion | 800ms |
| reanimated | 1200ms |

So the open state flips and the opacity animates, but `AnimatePresence` never
removes the child. Playwright counts an `opacity: 0` element as visible, which is
why the assertion reads `Expected: not visible / Received: visible`.

## Cause chain

Instrumenting `useAnimations` per animated key showed the content node starts 16
animations and two never call their completion callback: `borderRadius` and
`scale`, both with `toValue: NaN`.

1. `code/core/web/src/helpers/directStyle.ts` emits into the RN style object on
   the web inline-style path (`isWeb && !flatShouldDoClasses`), which is the path
   every JS animation driver uses. Two values came through unusable:
   - `borderRadius: "4"` — an **unresolved token**. The `borderRadius` branch
     returned early with the raw value to skip the four-corner expansion, and in
     doing so skipped token resolution too. `tokensParsed.radius['4'].val === 9`,
     and the css driver renders `border-radius: 9px`.
   - `scale: "0.95"` — a **string**. The numeric coercion in the transform branch
     was gated on `!isWeb`, so web kept strings, which is right for the CSS class
     path and wrong for an inline RN style object.
2. `code/core/animations-react-native/src/createAnimations.tsx`'s `getValue`
   matched `/([-0-9]+)(deg|%|px)/`: no decimals, unit required. Both values
   became `NaN`.
3. `Animated.spring(value, { toValue: NaN })` never invokes its `start` callback,
   so the per-key completion promise never resolves.
4. `Promise.all(res.completions)` therefore never settles, `sendExitComplete()`
   is never called, and the child stays mounted forever.

Each open/close leaves a node behind, and the overlay keeps `pointer-events`
blocking, which is why `DialogPointerEvents` is in the same list.

**This was visible, not just a test artifact.** Before the fix a dialog on the
native driver rendered `border-radius: 0px` where css gave `9px`, and its scale
enter/exit did not run.

## The fix

Two files, both at the source rather than at the failure site.

`directStyle.ts`:
- transform branch (`x`/`y`/`scale`/`scaleX`/`scaleY`/`rotate`) gates numeric
  coercion on `(!isWeb || !state.flatShouldDoClasses)` instead of `!isWeb`, which
  is the idiom `emitResolved` already uses one screen up for exactly this
  distinction.
- the `borderRadius` inline-path branch routes a string through the existing
  `emitResolved` (resolve token, coerce, emit one property) instead of emitting
  raw. It still skips the expansion, so its original purpose is intact.

`createAnimations.tsx`:
- `getValue` now matches `/(-?(?:\d+\.?\d*|\.\d+))(deg|%|px)?/`: optional unit,
  fractional numbers. The old pattern also mis-read `"1.5deg"` as `5`.

Verified after the fix: node unmounts, `borderRadius: 9`, and the transform array
is `[{translateX:0},{translateY:10},{scale:0.95}]`, all numeric.

## How wide is the inline-style path

Worth knowing before judging the blast radius, because "animated components" is
not the whole answer. `getSplitStyles.tsx:345` sets
`shouldDoClasses = acceptsClassName && isWeb && !styleProps.noClass`, and
`useComponentState.ts:273` turns `noClass` on for:

- an animated component once hydrated **when the driver's output is not css**
  (so native, motion and reanimated, but not the css driver);
- `disableClassName`, or `forceStyle`;
- a component whose `staticConfig` does not accept a className;
- plus `getSplitStyles.tsx:363/581`, a raw `className` prop or a
  `passthroughClassName` from a styled frontend.

So the unresolved `borderRadius` reached motion and reanimated too, not only the
native driver. Those two did not hang, because only the native driver waits on a
per-key completion promise, but they were still handed the raw token. Whether
they rendered the wrong radius is **not yet measured**; the css-vs-native
computed-style comparison in this doc covers only native.

The plain web path is unaffected: an unanimated component accepting classNames
still goes through the class path, which resolved correctly all along.

### The audit to run when the machine is free

Render one usecase carrying many token-valued style props, load it under
`animationDriver=css` and again under `native`/`motion`/`reanimated`, and diff
`getComputedStyle` across the drivers. Any property that differs is another
value the inline path is failing to resolve. This is the same shape as the probe
that found the radius, and it is the honest way to answer "what else is wrong",
rather than reading the emit branches and guessing. `webShadowParts` and
`webTextShadowParts` are the first suspects: they resolve the token but then
`merge()` without the numeric coercion the other branches apply.

## Did anything depend on the old regex?

No, checked. `/(-?(?:\d+\.?\d*|\.\d+))(deg|%|px)?/` replaces a pattern that read
`"1.5deg"` as `5`, which is a latent bug independent of the NaN hang. A repo-wide
search for fractional degree values (positive control: the pattern matches
`"1.5deg"` and correctly ignores `"45deg"`) found three, none of them a problem:

- `tamagui.dev/.../HomeHero.tsx:119` `rotate="0.5deg"` sits inside a
  commented-out block.
- `tamagui.dev/.../DocSearch.tsx:124` is a CSS gradient string, not a style prop.
- `tamagui.dev/.../ColorPicker.tsx:277` `rotateX="0.001deg"` is live. The old
  regex read it as `1deg`. It is a static View inside a `Popover.Trigger`, so it
  most likely never reached this driver path at all.

Nothing in `code/ui`, `code/core` or `code/kitchen-sink` uses a fractional
degree, so no test encoded the broken behavior.

## The tenth instance, confirmed

`SheetSnapPointsFit.animated.test.tsx:487` is `animated-native` only and was in
the group a2949 could not attribute. Despite the filename it is a **Dialog**
test, "dialog shows as dialog on large screens", and it failed at
`await expect(dialogContent).not.toBeVisible()` after clicking a close button:
the same signature as the other nine. Predicted from reading it, then confirmed
by running it, and it passes on all four drivers after the fix.

## Validation: what the fix actually did

Ten of the eleven Dialog-cluster failures are fixed. Every one verified by
running it, not inferred.

| test | project | before | after |
| --- | --- | --- | --- |
| `DialogScoped` :9 :43 | default | fail | **pass** |
| `DialogSheetAdaptResize:15` | default | fail | **pass** |
| `DialogFocusScope` :9 :75 :107 :167 :196 | animated-native | fail | **pass** |
| `DialogPointerEvents:18` | animated-native | fail | **pass** |
| `SheetSnapPointsFit:487` | animated-native | fail | **pass** |
| `DialogPresenceCompletion` x2 | animated-motion | fail | fail (still open) |

`SheetSnapPointsFit:487` was the predicted tenth instance and it did turn out to
be one.

Animated projects: **14 failed, 782 passed**, and all 14 were already failing in
the CI baseline on `6fbe1ba2f3`: `AnimatePresenceEnterExit` x4 on native,
reanimated and motion (12) plus the two `DialogPresenceCompletion`.
`animated-css` is fully green. No new failures on any driver.

Sandbox `hydration-drivers.test.ts:73` still fails identically (`2 passed`), which
is expected: that is the separate matrix-composition defect below, untouched.

### No regressions from the gate change, proven by A/B

The full default-project run surfaced ten failures that a2949's handoff never
mentioned. That handoff's log turned out to cover only 309 test lines against
this run's 743 and contained **none** of the ten, so its silence was not
evidence. A/B'd instead, reverting both files to `bde5b72fc5^` and rebuilding:

- before: 9 of the 10 failed
- after: the same 8 failed

Both arms produced per-test results (63 and 62 lines), so neither was an aborted
run masquerading as a null result. Every one is pre-existing.
`OnLayoutStress` x6 also failed but only under four parallel projects, which is
exactly the load condition the rules here say makes it meaningless.

## Cross-driver style audit

The question was what else the inline path was silently getting wrong. Method:
the css driver keeps the class path and is the reference; render the same case
under each driver, settle, then diff `getComputedStyle` over every element.

**The audit was validated against a known positive before its null results were
trusted.** Run against the pre-fix build it reports `borderRadius` and all four
corner properties as differing on native, motion **and** reanimated; run against
the fixed build those fifteen groups are gone. So it detects this bug class, and
a2943's suspicion was right: the unresolved radius token was live on two more
drivers than the hang was, because only the native driver waits on a per-key
completion promise. 718 differences before, 703 after, and the 15 that
disappeared are exactly the radius groups.

The 703 that remain are in **both** arms, so none of them are new. They fall into
two groups:

1. **Transform representation, all three inline drivers** (231): css writes the
   individual properties (`scale: 1`, `translate: 0px`, `rotate: 0deg`,
   `transform: none`) while native, motion and reanimated compose
   `transform: matrix(...)` and leave the individual ones `none`. At rest these
   are identity values, so nothing looks wrong, but it is the same defect as
   `hydration-drivers.test.ts:73` and **the audit shows it is not motion-only**,
   which is what that test's failure on its own implied. Any test reading
   `style.translate` will misread on all three.
2. **react-native-web base styles, native only** (472): `borderTop/Right/Bottom/
   LeftColor` `rgb(0,0,0)` vs the theme's `rgb(3,7,18)`, `top/right/bottom/left`
   `0px` vs `auto`, `zIndex` `0` vs `auto`. The native driver renders a real
   react-native-web `Animated.View`, which carries RNW's own reset. Mostly
   invisible (a border color with no border width, an offset of 0 on a
   relatively positioned box), but the border color would show on anything with
   a visible border, and `zIndex: 0` creates a stacking context where `auto` does
   not. Pre-existing and structural, not token resolution.

One straggler looked worse than the rest: `color` differs on exactly one element,
`SPAN[scenario-12-target]`, `rgb(3,7,18)` on css vs `rgb(0,0,0)` on native. It is
explained below, and it is not a core bug.

## The one visible color difference: stale v5 token names in fixtures

`scenario-12` sets `color={active ? 'red10' : 'blue10'}`. Neither measured value
is blue, which is the tell. Probing the live config:

- theme key `blue10` is **absent**; `blue-500` is `rgba(43,127,255,1)` and
  `color10` is `rgba(16,24,40,1)`
- `scenario-11`'s `backgroundColor="blue10"` computes to `rgba(0,0,0,0)` on
  **both** css and native

So `blue10`/`red10` are v5-era names the v6 config does not define. The value is
dropped, and the drivers then fall back differently: the css path inherits the
theme's body color `rgb(3,7,18)`, while the native path renders a
react-native-web `DIV` carrying RNW's `css-text-146c3p1` base class, which
hardcodes black. That is the same mechanism behind group 2's border colors: RNW's
black default against the theme's value, invisible wherever `borderWidth` is 0.

**No test is passing vacuously because of this.** Every kitchen-sink test that
asserts a concrete color asserts `rgb(255,0,0)` / `rgb(0,128,0)` /
`rgb(0,0,255)`, which are plain CSS color names, never a v5 token color.

**Do not bulk-fix it.** `blue10`/`red10`/`green10`/`orange10` appear across **37**
kitchen-sink files. Renaming all of them to chase one span is exactly the churn
this campaign's rules warn against, kitchen-sink is an internal app so nothing
ships colorless, and no assertion depends on it. If anyone does want it, it is a
mechanical rename that belongs in its own commit. The one part worth escalating
is a migration question rather than a fixture one: v5 color token names silently
resolve to nothing under v6, with no warning.

## Still open

- `DialogPresenceCompletion` x2 on **motion** is the remaining one of the eleven.
  Not explained by this and untouched.
- **The transform matrix composition is the next thing to fix and it is now
  better scoped than when it was filed.** `hydration-drivers.test.ts:73` reads as
  a motion-driver bug because that is the only driver its test covers; the audit
  above shows native and reanimated compose a matrix identically. So it is one
  defect in the shared inline path, not a motion quirk, and the fix belongs
  wherever the transform array is turned into a style rather than in a driver.
  Whoever takes it should re-run the audit afterwards: the 231 transform
  differences are the acceptance criterion, and they should go to zero.

  **Run it the right way or it will look fixed when it is not.** a2965 reported
  `hydration-drivers` + `motion-hydration` + `ssr-theme` at 12 passed / 0 failed
  with `:73` not reproducing, and concluded the failure might be gone. It is not.
  `code/sandbox/playwright.config.ts:3` is
  `const mode = process.env.TEST_MODE || 'dev'`, and the config builds a **single**
  project from that: dev on port 8085, prod on 8086. A bare
  `playwright test hydration-drivers.test.ts` therefore runs the dev project only
  and never touches the project the failure lives in. With `TEST_MODE=prod` it
  fails, and the reporter labels the failing line `[prod]`.

  That makes it build-mode dependent, which is a lead rather than a nuisance:
  suspect extraction and compilation rather than the motion driver.

  **The discriminator is not finished, so do not treat "prod only" as settled.**
  One arm has run: `NODE_ENV=test bunx playwright test hydration-drivers.test.ts`
  with `TEST_MODE` unset gives `1 failed / 7 did not run`, and the failure is
  `:9` "no errors at all (includes hydration errors)" timing out at 30s. So in
  dev the file dies at its first test and **`:73` never executes**, which is a
  third possibility beyond "fails in prod, passes in dev". It also does not match
  a2965's 12 passed / 0 failed, so something differs beyond `TEST_MODE`. The
  likely confounder is server state: the dev project's `webServer` sets
  `reuseExistingServer: true`, so a warm dev server and a cold
  `bun run dev --clean` boot are not the same experiment. Run both arms cold,
  back to back, before concluding anything.
- `AnimatePresenceEnterExit` x4 on native, motion and reanimated (css passes) is
  still an opacity/enter-scheduling problem, still unexplained, and a2949's
  reasoning that the transform split cannot account for it survives this session.
- `ButtonUnstyled` not started.
- `ButtonSkin:106` fails on the **first** assertion,
  `expect(circular).toHaveCSS('height', '52px')`, receiving `20px`. Read so far,
  all of it clean, so the answer is not in these files:
  - `src/usecases/ButtonSkin.tsx:69` renders `<Button circular icon={CircleIcon}
    size="5" />`, and `src/components/Button.tsx` is a bare re-export of
    `tamagui`'s Button, so there is no local skin copy despite the test name.
  - `ui/tamagui/src/components/Button.tsx:76` `circular` sets `height`,
    `width`, `minWidth`, `maxHeight` and `maxWidth` all to
    `resolveTokenSize(props.size ?? true).frame.size`, and the `size` variant at
    :32 deliberately returns early when `props.circular` so it cannot be fighting
    it.
  - `core/size/src/index.ts:84` `resolveTokenSize("5")` reads
    `tokens.size["5"]`, which exists, so the lookup is not obviously wrong.

  `20px` is about what an icon-only frame collapses to with no height applied
  (16px icon + 2x1px border), so the shape of it is "the circular variant's
  geometry never landed" rather than "it landed with the wrong token". That is a
  runtime question now: probe the element's resolved styles and check whether the
  circular variant fired at all. Do not keep reading the variant definitions.

## Rules paid for in this session

Everything in `plans/v3-kitchen-sink-component-failures.md` still applies. Adding:

- **`@tamagui/animations-react-native` rebuilds in ~40ms** (`bun run build` in the
  package), so instrumenting the driver is a cheap loop, unlike core.
- **Comments are stripped from `dist`.** Verifying a rebuild landed by grepping
  for your comment reports a false negative. Grep for the changed *code*.
- `@tamagui/core`'s `dist/native.cjs` and `dist/test.native.cjs` inline
  `@tamagui/web`; both carried the `directStyle` change after rebuilding web then
  core, confirmed by grep.
- The driver is selected by the `animationDriver` URL search param
  (`tests/test-utils.ts:33`), so any usecase can be A/B'd across all four drivers
  in a standalone playwright script without touching the test files.
