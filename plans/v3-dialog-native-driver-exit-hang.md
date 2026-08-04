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
