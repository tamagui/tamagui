# tamagui Sheet ↔ virtualized list adapter

Goal: let consumers drop a virtualized list (`@legendapp/list`'s `LegendList`,
`FlashList`, RN `FlatList`/`SectionList`) inside a `Sheet.Frame` and get the
same drag-to-snap / scroll-handoff coordination that `Sheet.ScrollView`
already provides.

## why this matters

Today the choices are:

- **`Sheet.ScrollView`** — coordinates with the sheet pan via the internal
  `scrollBridge`. Scroll locks when the sheet wants to drag, and a pull-down
  at `scrollY === 0` becomes a sheet pan. Non-virtualized only.
- **A virtualized list inside `Sheet.Frame`** — works visually, but the
  inner list claims every vertical gesture, so the sheet never drags. The
  sootbean-mobile `PersistentSheet` running `LegendList` is the canonical
  symptom: the user can scroll chat, but can't drag the sheet between
  snap points unless they grab the (non-existent) handle area.

Symptom seen in `~/soot/templates/sootbean-mobile/interface/sheet/PersistentSheet.tsx`:
the file's own block comment claims a `GestureDetectorWrapper` with
`activeOffsetY([-10, 10])` is wired up. There is no such wrapper. The
mitigation we shipped — swap `LegendList` for a flat `Sheet.ScrollView` —
solves drag but loses virtualization, which won't hold once threads grow
past a few hundred messages.

## prior art: `@gorhom/bottom-sheet`

`@gorhom/bottom-sheet` solves this with `createBottomSheetScrollableComponent`
(see `components/bottomSheetScrollable/createBottomSheetScrollableComponent.tsx`).
The shape is:

```ts
const BottomSheetFlatList = createBottomSheetScrollableComponent(
  SCROLLABLE_TYPE.FLATLIST,
  AnimatedFlatList,
)
```

A higher-order component that, regardless of the underlying scrollable:

1. Pulls a `BottomSheetDraggableContext` (the sheet's pan gesture) from React
   context and composes a `Gesture.Native().simultaneousWithExternalGesture(draggableGesture)`
   so the two gestures coexist instead of one cancelling the other.
2. Wraps `onScroll` in a reanimated `useAnimatedScrollHandler` that updates a
   shared `scrollableContentOffsetY` and obeys an `animatedScrollableStatus`
   flag (`LOCKED` / `UNLOCKED`). When `LOCKED` it calls `scrollTo(scrollableRef, 0, lockPosition, false)`
   from a worklet to forcibly clamp the inner scroll.
3. Plumbs `scrollableRef` via `useAnimatedRef` so the worklet-side
   `scrollTo` can target it without a React round-trip.
4. Sets `decelerationRate` via `useAnimatedProps` based on lock status, so
   the list stops momentum when the sheet seizes the gesture.

The state machine: `useScrollEventsHandlersDefault` decides — when sheet is
not in `EXTENDED` / `FILL_PARENT` state and inner `scrollY > 0`, lock the
position; once `scrollY === 0` and the user keeps pulling, the sheet pan
takes over (handled by the sheet's own pan gesture, which is now
simultaneous with the list's native scroll).

## prior art: tamagui's own `SheetScrollView`

`code/ui/sheet/src/SheetScrollView.tsx` already implements 90% of the same
machinery in plain RN, just hand-rolled instead of worklet-driven:

- `scrollBridge` on `SheetContext` is the equivalent of gorhom's
  `animatedScrollableStatus` (the lock signal) plus `scrollableContentOffsetY`
  (the current offset).
- `setScrollEnabled(false, lockY)` writes `scrollBridge.scrollLockY = lockY`;
  the inner `onScroll` handler then `scrollTo`s back to `scrollLockY` if the
  list drifts.
- When RNGH is enabled, the RNGH ScrollView path adds
  `simultaneousHandlers={[panGestureRef]}` — same idea as gorhom's
  `simultaneousWithExternalGesture`.

So tamagui already owns the right primitives; what it doesn't expose is a
hook to plug a non-`ScrollView` scrollable into them.

## proposed shape

Add a `useSheetScrollGesture()` hook plus a `createSheetScrollableComponent()`
HOC, both exported from `@tamagui/sheet`. Consumers either:

```tsx
// path A: pre-wrapped components (mirrors gorhom)
import { Sheet, SheetFlatList, SheetSectionList, createSheetScrollable } from 'tamagui'

const SheetLegendList = createSheetScrollable(LegendList)

<Sheet.Frame>
  <SheetLegendList data={messages} renderItem={…} />
</Sheet.Frame>
```

```tsx
// path B: BYO list — useful for libraries we don't want to dep on
import { Sheet, useSheetScrollGesture } from 'tamagui'

function ChatList() {
  const { ref, onScroll, simultaneousHandlers, scrollEventThrottle } =
    useSheetScrollGesture()
  return (
    <LegendList
      ref={ref}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      simultaneousHandlers={simultaneousHandlers}
      …
    />
  )
}
```

### hook contract

`useSheetScrollGesture()` reads `SheetContext.scrollBridge` + `GestureSheetContext.panGestureRef`
and returns:

| field | purpose |
| --- | --- |
| `ref` | call sites attach to the list; internal `scrollTo` for force-lock |
| `onScroll` | wraps `scrollBridge.y` update + `scrollLockY` enforcement, then calls the user's `onScroll` |
| `simultaneousHandlers` | `[panGestureRef]` when RNGH is enabled; `undefined` otherwise (caller can spread harmlessly) |
| `scrollEventThrottle` | `1` (matches `SheetScrollView`) |
| `bounces` | `false` (otherwise iOS rubber-band fights the sheet pan) |
| `keyboardShouldPersistTaps` | `'always'` parity with `SheetScrollView` |
| `onLayout` | reports `parentHeight` to the bridge so `hasScrollableContent` is accurate |
| `onContentSizeChange` | reports content height the same way |

The hook MUST also mount an effect that registers `scrollBridge.setHasScrollView(true)` /
`scrollBridge.setScrollEnabled = …` / `scrollBridge.forceScrollTo = …` on
mount and clears them on unmount, exactly like `SheetScrollView` does
today. That keeps the sheet aware that a scrollable is present and lets
its pan logic invoke the lock from the outside.

### HOC contract

`createSheetScrollable(Component)` is sugar:

```ts
export function createSheetScrollable<T extends React.ComponentType<any>>(
  Component: T,
): T {
  return forwardRef((props, ref) => {
    const gestureProps = useSheetScrollGesture()
    return (
      <Component
        {...gestureProps}
        {...props}
        ref={composeRefs(gestureProps.ref, ref)}
        onScroll={composeScrollHandlers(gestureProps.onScroll, props.onScroll)}
      />
    )
  }) as T
}
```

The HOC trusts the wrapped list to accept the standard scrollview prop set.
Libraries that pass props through (LegendList, FlashList, FlatList,
SectionList, Animated.FlatList, etc.) all do. Anything that doesn't is an
explicit non-target — those callers use the `useSheetScrollGesture` hook
directly.

### ship as a separate entry

Ship the adapters as `@tamagui/sheet/scrollable` so the `react-native-gesture-handler`
fallback (already optional in tamagui sheet) doesn't get pulled into web bundles
just because someone imports `Sheet`.

## reanimated upgrade path (optional, follow-up)

The current `SheetScrollView` does its lock enforcement on the JS thread.
That's good enough up to ~120Hz and matches what we've shipped, but it
costs one JS turn per scroll event during lock. Gorhom does it inside a
worklet. The adapter should not require reanimated, but if the consumer
opts in (passes `worklet: true` to the hook) the lock branch should run
via `useAnimatedScrollHandler` + `scrollTo` from a worklet, matching
gorhom's path. Gate this behind a peer-dep check so non-reanimated
consumers don't pay.

## migration

Existing `Sheet.ScrollView` callers don't change. Internally, refactor
`SheetScrollView.tsx` to call `useSheetScrollGesture()` so we have one
implementation of the lock contract, and the HOC + hook + `Sheet.ScrollView`
share it. The fallback (`isWeb` plain ScrollView with
`useSheetScrollViewGestures` for pointer events) stays — `useSheetScrollGesture`
detects the env and returns the right shape per platform.

## acceptance criteria

1. `<SheetFlatList>` and `<SheetLegendList>` in a `snapPointsMode="percent"`
   sheet snap between points when dragged from the inside of the list, even
   when the list is mid-scroll.
2. With the list scrolled past offset 0, pulling down inside the list does
   not move the sheet — only the list moves until offset hits 0, then the
   sheet takes over.
3. With the list at offset 0, a downward pull dismisses the sheet.
4. Throwing the list (momentum scroll) and then releasing does not leak
   into a sheet pan after the inertia stops.
5. The existing `Sheet.ScrollView` behavior is byte-equivalent.
6. The web fallback uses pointer-event coordination (no RNGH) and the
   adapter still works for `FlatList` (which falls back to RN
   ScrollView on web via `react-native-web`).
7. `bun check` passes; the sheet's existing tests + a new
   `SheetFlatList`/`SheetLegendList` test exercise drag + snap.

## non-goals

- Replacing gorhom for projects that already use it. This is for
  consumers who picked tamagui's `Sheet` and just want their list to
  drag-cooperate.
- Implementing horizontal pan-handoff. The lock state machine assumes a
  vertical sheet; horizontal lists inside vertical sheets work today
  because they don't compete with the sheet's pan axis.
