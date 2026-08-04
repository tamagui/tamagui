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

## Probably a tenth instance

`SheetSnapPointsFit.animated.test.tsx:487` is `animated-native` only and was in
the group a2949 could not attribute. Despite the filename it is a **Dialog**
test, "dialog shows as dialog on large screens", and it fails at
`await expect(dialogContent).not.toBeVisible()` after clicking a close button:
the same signature as the other nine. INFERRED from reading the test, not yet
confirmed by running it.

## Still open

- **Full-suite validation has NOT run.** The fix is verified by runtime probe on
  `DialogScopedCase` only. The kitchen-sink `default` + four animated projects
  need a run before this can be trusted, and `code/sandbox` hydration too, since
  `directStyle.ts` is shared by every component. Blocked on a quiet window
  (a2943 called one for a2965's build timings).
- `DialogPresenceCompletion` x2 on **motion** is not explained by this and is
  untouched.
- The `hydration-drivers.test.ts:73` motion-driver matrix bug is a separate item
  and may interact with the transform coercion change above. Check it after the
  suite runs.
- `ButtonUnstyled` / `ButtonSkin` not started. `ButtonSkin` fails
  `toHaveCSS('52px')` receiving `20px` on `button-skin-circular`.

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
