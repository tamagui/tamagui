# v3 animation API: public hooks, onTransition, and de-styling animated internals

2026-07-14. Addendum lane to `plans/v3-evolution.md` (lane H). That file remains
the acceptance contract; this file adds the animation-surface contracts that C2
(Sheet) and C4 (component sweep) need but do not yet specify. Where this file
assigns work to C2/C4, those packets absorb it.

Motivation: v3 removes framework-owned styles, so components stop shipping
their own fades and users need first-class ways to drive those effects
themselves. Today the driver hooks exist internally but are not exported, there
is no transition lifecycle callback (`onDidAnimate` is untyped and enter-only),
and Sheet keeps its animated position private while also toggling opacity on
the frame and shipping opacity on the Handle.

## Current state (verified 2026-07-14)

- `AnimationDriver` (`code/core/web/src/types.tsx:3343`) already defines
  `useAnimatedNumber`, `useAnimatedNumberStyle`, `useAnimatedNumbersStyle`
  (optional), `useAnimatedNumberReaction`, `usePresence`, `ResetPresence`.
  All five drivers (css, react-native, moti, reanimated, motion) implement all
  of them. The only consumer path is `useConfiguration().animationDriver`;
  nothing is exported as a standalone hook from `tamagui`/`@tamagui/core`.
- Lifecycle today: component prop `onDidAnimate?: () => void`
  (`types.tsx:2595`), typed `any` inside `UseAnimationHook`
  (`types.tsx:3393`), fired only on enter completion, driver support uneven.
  Imperative completion exists as `setValue(next, config, onFinished)`.
  Exit completion exists only via presence `safeToRemove`/`onExitComplete`.
- Sheet (`code/ui/sheet/src/SheetImplementationCustom.tsx`): one animated
  number for translateY (`:360`), local to the file; mirrored to JS via
  `at.current` and `scrollBridge.paneY`, never published on `SheetContext`.
  Opacity is separate React state (`:970`) set to 0 after close, with a 1000ms
  `opacityFallbackTimer` (`:374`) because completion callbacks are unreliable
  on the css driver. `shouldHideParentSheet` also forces opacity 0 (`:1047`).
- Sheet.Overlay (`Sheet.tsx:59`) has no baked fade and no drag linkage; it
  renders in an `AnimatePresence` layer gated on `open` (`:1011`). Its only
  opinionated styles are the `unstyled: false` skin block (`$background`,
  inset, zIndex). Handle ships `opacity: 0.5`, hover `0.7`, and an
  open-variant opacity 1/0 (`Sheet.tsx:24-44`).
- CSS driver `useAnimatedNumber`
  (`code/core/animations-css/src/createAnimations.tsx:167`) is not a real
  animation: `setValue` sets React state instantly and fakes completion with
  an estimated-duration `setTimeout`. This is the source of the Sheet fallback
  timer. `types.tsx:3298` carries the matching TODO.
- Motion driver `useAnimatedNumberStyle` returns a
  `{ getStyle, motionValue }` object consumed by its custom component rather
  than a style, and spring/timing `setValue` jumps the motion value while the
  visible animation runs on the DOM element.
- Popper forces `opacity: hide ? 0 : 1` pre-positioning (`Popper.tsx:805`,
  arrow `:990`). That is mechanical (unpositioned content must not flash) and
  stays, but it must never win over user opacity after positioning.

## Locked contracts

### H-1: public animation hooks

`@tamagui/core` (and `tamagui`) export real hooks that resolve the configured
driver internally:

```tsx
import {
  useAnimationDriver,      // resolved driver from context/config, throws helpfully on stub
  useAnimatedNumber,       // (initial: number) => UniversalAnimatedNumber
  useAnimatedNumberStyle,  // (value, worklet getStyle) => style for the style prop
  useAnimatedNumbersStyle, // multiple values, one style
  useAnimatedNumberReaction, // JS-thread observer
  usePresence,
  useIsPresent,
  ResetPresence,
} from 'tamagui'
```

Rules:

1. The wrappers are one-line delegations to `useConfiguration().animationDriver`.
   No second implementation, no fallback driver. If the driver is the stub
   (`isStub`), throw in development with the exact `createTamagui` fix.
2. `useAnimatedNumbersStyle` becomes required on `AnimationDriver`. Every
   driver already implements it; delete the `?`.
3. `UniversalAnimatedNumber`, `AnimatedNumberStrategy`, and the hook types are
   documented public API, not internals. The docs state the driver-stability
   rule: the resolved driver must not change identity mid-lifecycle (relevant
   only with `animatedBy` multi-driver setups).
4. Sheet, Toast, and any other internal consumer migrate to the public
   wrappers so first-party code exercises the same surface users get.

### H-2: `onTransition` lifecycle

One typed lifecycle prop on every animated component, named to match the v3
`transition` prop. Deliberately a single callback, because `onTransitionStart`/
`onTransitionEnd` collide with the React DOM event props on web:

```tsx
type TransitionEvent = {
  phase: 'start' | 'end'
  cause: 'enter' | 'exit' | 'update' // update = style change while mounted
  finished?: boolean                 // on 'end': false when interrupted
}

<View transition="quick" onTransition={(e) => { ... }} />
```

Rules:

1. `UseAnimationHook` receives a typed `onTransition` emitter; the untyped
   `onDidAnimate?: any` plumbing and the `onDidAnimate` component prop are
   deleted (v3 is the breaking window). Dialog's internal
   `reporter.onEnterComplete` use migrates to the same emitter.
2. Driver mapping: motion uses its animation controls promise; css uses its
   existing enter-completion detection plus `transitionend`/`transitioncancel`
   aggregation for updates; react-native/moti/reanimated emit start when the
   animation is kicked off and end from their finished callbacks. A driver may
   coalesce multi-property updates into one start/end pair per batch; it may
   not skip the end event.
3. Exit end must fire before or with presence `safeToRemove` so users can
   observe exit completion without reaching into presence internals.
4. Sheet replaces its bespoke `onAnimationComplete` prop and controller field
   with the same shape: `onTransition?: (e: { phase; cause: 'open' | 'close'
   | 'snap'; position: number; finished?: boolean }) => void`. Existing
   internal Dialog/Adapt handoff moves to it. `onPositionChange` stays.

### H-3: Sheet publishes its animated position

The live position becomes public, wired through `SheetContext`:

```tsx
const { value, screenSize, frameSize, snapOffsets, minY } =
  Sheet.useAnimatedPosition()

// drag-linked overlay fade, runs on the UI thread where the driver supports it
const style = useAnimatedNumberStyle(value, (y) => {
  'worklet'
  return { opacity: 1 - y / screenSize }
})
```

Rules:

1. `value` is the exact `UniversalAnimatedNumber` driving the frame translateY
   (px from screen top). No second synced value, no polling mirror.
2. `snapOffsets` are the resolved px positions matching `snapPoints` order;
   `minY` is the top-most position. These plus `screenSize`/`frameSize` are
   enough to compute any progress mapping inside a `getStyle` worklet; we do
   not ship a derived progress value, we ship the recipe in docs and the
   canonical skin.
3. The hook throws outside `Sheet` scope with a clear message.
4. Toast's swipe values are a follow-up with the same pattern; note it, do not
   build it in this lane.

### H-4: Sheet never touches opacity

1. Delete the `opacity` React state, the `opacityFallbackTimer`, and the
   `opacity` merge on the frame. Fully-closed hiding uses `display: 'none'`
   (supported on web and native) applied from the close-complete transition
   event; `shouldHideParentSheet` uses the same mechanism. `pointerEvents`
   gating stays. `unmountChildrenWhenHidden` keys off the same closed flag.
2. The fallback timer's reason to exist is the css driver's fake completion;
   H-6 fixes that at the source. No replacement timer.
3. Handle opacity (base 0.5, hover 0.7, open-variant 1/0) moves to the
   canonical copied skin under C2. The behavior Handle ships zero opacity
   rules.
4. The hidden max-content measurement probe keeps its non-visual hiding; it is
   a probe, not a style opinion.

### H-5: overlay fades are user code, shown both ways

Overlay/Background/Handle aesthetics leave the behavior packages per C2/C4.
The canonical Sheet skin and docs show the two supported fade patterns:

```tsx
// 1. presence fade: animates on open/close only
<Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }}
  opacity={0.5} transition="quick" />

// 2. drag-linked fade: tracks the finger
const SheetBackdrop = () => {
  const { value, screenSize } = Sheet.useAnimatedPosition()
  const style = useAnimatedNumberStyle(value, (y) => {
    'worklet'
    return { opacity: Math.max(0, 0.5 * (1 - y / screenSize)) }
  })
  return <Sheet.Overlay style={style} />
}
```

Dialog/Popover/Tooltip/Toast already leave fades to enter/exit styles; their
remaining `$background`/shadow/size defaults are C4 work and out of scope here.
Popper's pre-positioning `opacity: 0` stays but is scoped so it cannot
override user opacity once positioned.

## Work packets

### H0: export the hooks

Owner surfaces: `code/core/web/src/index.ts`, new
`code/core/web/src/hooks/useAnimationDriver.ts` (plus the thin hook wrappers),
`types.tsx` (`useAnimatedNumbersStyle` required), driver packages only if a
signature drifts.

Acceptance: `import { useAnimatedNumber } from 'tamagui'` works and animates a
number on all five drivers in kitchen-sink; stub driver throws the helpful
error; Sheet and Toast consume the wrappers; type exports documented.

Resource class: light.

### H1: onTransition across drivers

Owner surfaces: `types.tsx`, all five `createAnimations.tsx`, `createComponent`
plumbing, `Dialog.tsx` migration, removal of `onDidAnimate`.

Acceptance: a kitchen-sink case asserts start/end for enter, update, and exit
on every driver (`.animated.test.tsx`, all four animated projects), including
`finished: false` on interruption; grep shows zero `onDidAnimate`; exit end
ordering vs `safeToRemove` covered by test.

Resource class: medium, one animated browser lane.

### H2: Sheet position + opacity removal

Owner surfaces: `SheetImplementationCustom.tsx`, `useSheetProviderProps.tsx`,
`SheetContext.tsx`, `types.tsx` (sheet types), `Sheet.tsx` (Handle/Overlay
style relocation lands with the C2 skin), sheet `onTransition`.

Acceptance: `Sheet.useAnimatedPosition` drives a drag-linked overlay fade in a
kitchen-sink case on css, motion, and one native driver; grep of sheet src
shows no `opacity` writes outside the measurement probe; existing sheet
drag/snap/keyboard/scroll tests stay green; closed sheets are display-none
with no 1s timer; `onAnimationComplete` is gone and the Dialog/Adapt handoff
uses sheet `onTransition`.

Resource class: heavy validation, serialize with C2.

### H3: real css-driver animated number

Owner surfaces: `code/core/animations-css/src/createAnimations.tsx` only.

Implementation: back `setValue` spring/timing with a rAF ticker driving the
existing listener/state path, real completion callbacks, `stop()` cancels the
ticker. Delete the estimated-duration `setTimeout`. Springs use the same
parameter names as the shared `AnimatedNumberStrategy`.

Acceptance: sheet open/close on the css driver fires completion exactly once
with no fallback timer; the H1 kitchen-sink case passes on css; dragging still
uses `direct` sets with no regression in the sheet tests.

Resource class: medium.

### H4: docs and canonical examples

Owner surfaces: animation docs page, sheet docs, the C2 canonical skin
fixture, kitchen-sink demo.

Acceptance: docs cover the hook family, `onTransition`, and both overlay fade
patterns with runnable kitchen-sink counterparts; the canonical sheet skin
uses only public APIs.

Resource class: light.

Order: H0 -> H1 -> (H2 with C2, H3 in parallel) -> H4. H2 must not start
before B2's `transition` rename is merged in the target branch, since the
sheet prop surface changes in both.

## Amendments applied to v3-evolution.md

- C2 acceptance additionally requires: sheet source contains no opacity
  control, the animated position is public via `Sheet.useAnimatedPosition`,
  and the canonical skin demonstrates a drag-linked overlay fade.
- References gain this file.
