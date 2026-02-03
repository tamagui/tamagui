# Native Gesture Handler Integration for Sheet

## Problem Statement

Sheet + Sheet.ScrollView gesture coordination on native iOS has fundamental limitations because Tamagui uses React Native's built-in `PanResponder`, while iOS's `UIScrollView` gesture recognizers fire BEFORE the RN responder system can claim the gesture.

This causes:

- Minor scroll "flicker" when starting to drag down from scroll top
- Imperfect handoff between scroll and sheet drag gestures
- Impossible to achieve native-quality feel

### Expected Behavior (Native Quality)

1. When at top snap point, swipe up → naturally scroll content
2. Swipe down → bounces back at top (rubber band effect)
3. If scrolled down and drag down → scroll to top, THEN SEAMLESSLY hand off to dragging sheet down
4. If dragging up and hit sheet top → SEAMLESSLY continue scrolling naturally

This is what gorhom/bottom-sheet and react-native-actions-sheet achieve using `react-native-gesture-handler`.

## Reference Implementations

### 1. react-native-actions-sheet (~/github/react-native-actions-sheet)

**Key Patterns:**

```tsx
// Gesture.Pan() with refs for coordination
Gesture.Pan()
  .withRef(panGestureRef)
  .onChange(event => onChange(...))
  .runOnJS(true)
  .activeOffsetY([-5, 5])
  .failOffsetX([-5, 5])
  .onEnd(onEnd)
```

**blockPan flag pattern** - Simple boolean to control gesture routing:

```tsx
let blockPan = false

// In onChange:
// 1. Sheet not fully open, swiping up: scrollable(false); blockPan = false → allow panning
// 2. Sheet fully open, swiping up: scrollable(true); blockPan = true → allow scrolling
// 3. Sheet not fully open, swiping down: depends on nodeIsScrolling
// 4. Sheet fully open, swiping down with scroll offset: hand off when scrollY=0

if (blockPan) return // Exit early
```

**scrollable() function** - Enable/disable scroll and restore positions:

```tsx
function scrollable(value: boolean) {
  for (let node of draggableNodes.current) {
    if (Platform.OS === 'ios') {
      scrollRef.scrollTo({ x: 0, y: offsets[i], animated: false })
    } else if (Platform.OS === 'android') {
      scrollRef?.setNativeProps({ scrollEnabled: value })
    }
  }
}
```

### 2. gorhom/bottom-sheet (~/github/react-native-bottom-sheet)

**Key Patterns:**

**simultaneousHandlers for gesture coordination:**

```tsx
// In createBottomSheetScrollableComponent.tsx
const scrollableGesture = useMemo(
  () =>
    draggableGesture
      ? Gesture.Native()
          .simultaneousWithExternalGesture(draggableGesture)
          .shouldCancelWhenOutside(false)
      : undefined,
  [draggableGesture]
)
```

**Context-based gesture state:**

```tsx
// GestureHandlersProvider creates content and handle pan gestures
const contentPanGestureHandler = useGestureHandler(
  GESTURE_SOURCE.CONTENT,
  animatedContentGestureState,
  ...
);

const handlePanGestureHandler = useGestureHandler(
  GESTURE_SOURCE.HANDLE,
  animatedHandleGestureState,
  ...
);
```

**Worklet-based gesture handlers (useGestureEventsHandlersDefault):**

```tsx
const handleOnChange = useCallback(
  function handleOnChange(source, { translationY }) {
    'worklet';
    // Lock scrollable position when scrolled
    if (animatedScrollableState.get().contentOffsetY > 0) {
      context.value = { ...context.value, isScrollablePositionLocked: true };
    }

    // Negative offset subtraction for smooth handoff
    const negativeScrollableContentOffset =
      (context.value.initialPosition === highestSnapPoint &&
        source === GESTURE_SOURCE.CONTENT)
        ? animatedScrollableState.get().contentOffsetY * -1
        : 0;

    // Accumulated position with scroll offset
    const accumulatedDraggedPosition = draggedPosition + negativeScrollableContentOffset;

    // Unlock when reaching highest point
    if (context.value.isScrollablePositionLocked &&
        animatedPosition.value === highestSnapPoint) {
      context.value = { ...context.value, isScrollablePositionLocked: false };
    }
  },
  [...]
);
```

## Implementation Plan

### Phase 1: Setup Infrastructure (Following Teleport Pattern)

**Files to create:**

- `code/ui/sheet/src/setupGestureHandler.ts` - Setup function
- `code/ui/sheet/src/gestureState.ts` - Global state for RNGH availability
- `code/ui/sheet/src/GestureSheetContext.tsx` - Context for gesture refs

**Pattern (following @tamagui/portal):**

```tsx
// setupGestureHandler.ts
export type GestureHandlerState = {
  enabled: boolean
  GestureDetector: typeof GestureDetector | null
  Gesture: typeof Gesture | null
  // Note: We DON'T require Reanimated - use Tamagui's animation driver
}

let state: GestureHandlerState = { enabled: false, GestureDetector: null, Gesture: null }

export function setupGestureHandler(config: {
  GestureDetector: typeof GestureDetector
  Gesture: typeof Gesture
}): void {
  const g = globalThis as any
  if (g.__tamagui_gesture_handler_setup) return
  g.__tamagui_gesture_handler_setup = true

  state = {
    enabled: true,
    GestureDetector: config.GestureDetector,
    Gesture: config.Gesture,
  }
}

export function getGestureHandlerState(): GestureHandlerState {
  return state
}

export function isGestureHandlerEnabled(): boolean {
  return state.enabled
}
```

### Phase 2: Conditional Gesture Handling in Sheet

**Modify SheetImplementationCustom.tsx:**

```tsx
import { isGestureHandlerEnabled, getGestureHandlerState } from './gestureState'

// In component:
const gestureHandlerEnabled = isGestureHandlerEnabled()

// Create PanResponder OR GestureDetector based on availability
const panGesture = React.useMemo(() => {
  if (gestureHandlerEnabled) {
    return createGestureHandlerPan(/* ... */)
  }
  return createPanResponder(/* ... current implementation */)
}, [gestureHandlerEnabled, /* ... */])

// Render with conditional wrapper
{gestureHandlerEnabled ? (
  <GestureDetectorWrapper gesture={panGesture}>
    <AnimatedView ...>{/* content */}</AnimatedView>
  </GestureDetectorWrapper>
) : (
  <AnimatedView {...panResponder?.panHandlers} ...>{/* content */}</AnimatedView>
)}
```

### Phase 3: Sheet.ScrollView with simultaneousHandlers

**Modify SheetScrollView.tsx:**

```tsx
import { isGestureHandlerEnabled, getGestureHandlerState } from './gestureState'

// Get the sheet's pan gesture ref from context
const { panGestureRef } = useSheetGestureContext()

// Create simultaneous gesture for ScrollView
const scrollableGesture = React.useMemo(() => {
  if (!isGestureHandlerEnabled() || !panGestureRef) return null
  const { Gesture } = getGestureHandlerState()
  return Gesture.Native()
    .simultaneousWithExternalGesture(panGestureRef)
    .shouldCancelWhenOutside(false)
}, [panGestureRef])

// Wrap ScrollView with GestureDetector when available
return scrollableGesture ? (
  <GestureDetector gesture={scrollableGesture}>
    <ScrollView {...props} />
  </GestureDetector>
) : (
  <ScrollView {...props}>{/* current implementation */}</ScrollView>
)
```

### Phase 4: Implement blockPan Pattern

**Add to SheetContext/scrollBridge:**

```tsx
// Extend scrollBridge with gesture coordination state
scrollBridge.blockPan = false
scrollBridge.isScrollablePositionLocked = false
scrollBridge.initialPosition = 0
scrollBridge.contentOffsetY = 0

// In gesture onChange handler:
function onChange(absoluteX, absoluteY, translationY) {
  const isFullOpen = getCurrentPosition() === positions[0]
  const isSwipingDown = prevDeltaY < translationY
  const nodeIsScrolling = scrollBridge.y > 0

  // Decision tree (from actions-sheet):
  if (!isFullOpen && !isSwipingDown) {
    // Sheet not fully open, swiping up → allow panning
    scrollable(false)
    scrollBridge.blockPan = false
  } else if (isFullOpen && !isSwipingDown) {
    // Sheet fully open, swiping up → allow scrolling only
    scrollable(true)
    scrollBridge.blockPan = true
  } else if (!isFullOpen && isSwipingDown) {
    // Sheet not fully open, swiping down → depends on scroll state
    if (nodeIsScrolling) {
      scrollable(true)
      scrollBridge.blockPan = true
    } else {
      scrollable(false)
      scrollBridge.blockPan = false
    }
  } else if (isFullOpen && isSwipingDown) {
    // Sheet fully open, swiping down → hand off at scrollY=0
    if (nodeIsScrolling) {
      scrollable(true)
      scrollBridge.blockPan = true
    } else {
      scrollable(false)
      scrollBridge.blockPan = false
    }
  }

  if (scrollBridge.blockPan) return

  // Continue with sheet position update...
}
```

### Phase 5: Export Public API

**Update package.json exports:**

```json
{
  "exports": {
    ".": {
      /* existing */
    },
    "./setup-gesture-handler": {
      "react-native": {
        "types": "./types/setupGestureHandler.d.ts",
        "module": "./dist/esm/setupGestureHandler.js",
        "import": "./dist/esm/setupGestureHandler.js",
        "require": "./dist/cjs/setupGestureHandler.js"
      }
    }
  }
}
```

**Documentation for users:**

```tsx
// In app entry point (index.js or App.tsx)
import { setupGestureHandler } from '@tamagui/sheet/setup-gesture-handler'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'

// Call once at startup
setupGestureHandler({ Gesture, GestureDetector })

// Wrap app with GestureHandlerRootView (user's responsibility)
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <YourApp />
    </GestureHandlerRootView>
  )
}
```

## File Changes Summary

### New Files

1. `code/ui/sheet/src/setupGestureHandler.ts` - Setup function and state
2. `code/ui/sheet/src/gestureState.ts` - Global state management
3. `code/ui/sheet/src/GestureSheetContext.tsx` - Context for gesture refs
4. `code/ui/sheet/src/createGestureHandlerPan.ts` - RNGH-based pan gesture creation
5. `code/ui/sheet/src/GestureDetectorWrapper.tsx` - Conditional wrapper component

### Modified Files

1. `code/ui/sheet/src/SheetImplementationCustom.tsx` - Conditional gesture handling
2. `code/ui/sheet/src/SheetScrollView.tsx` - simultaneousHandlers integration
3. `code/ui/sheet/src/SheetContext.tsx` - Extended scrollBridge interface
4. `code/ui/sheet/package.json` - Export setup-gesture-handler

### Test Files

1. `code/kitchen-sink/tests/SheetGestureHandler.test.tsx` - New E2E tests for RNGH path
2. `code/kitchen-sink/src/usecases/SheetScrollableDrag.tsx` - Update for testing

## Testing Strategy

### TDD Approach

1. **First, write failing tests for the expected behavior:**
   - Test: "drag down from scrolled position hands off seamlessly"
   - Test: "drag up to sheet top continues into scrolling"
   - Test: "no flicker on direction change"

2. **Run tests on iOS simulator/device:**
   - This is iOS-specific behavior
   - Use Detox for native E2E testing
   - Playwright can verify web fallback still works

3. **Test matrix:**
   - With RNGH setup: Full native quality
   - Without RNGH setup: Current PanResponder behavior (regression test)
   - Web: Should use PanResponder (unchanged)

### Key Test Cases

```tsx
describe('Sheet with RNGH', () => {
  beforeAll(() => {
    setupGestureHandler({ Gesture, GestureDetector })
  })

  it('scrolls content when at top snap point and swiping up', async () => {
    // Open sheet at 85% snap point
    // Swipe up on content area
    // Verify content scrolls (scrollY increases)
    // Verify sheet position unchanged
  })

  it('drags sheet down when at top snap point with scrollY=0', async () => {
    // Open sheet at 85% snap point
    // Swipe down on content area
    // Verify sheet position decreases
    // Verify content doesn't scroll
  })

  it('seamlessly hands off from scroll to sheet drag', async () => {
    // Open sheet, scroll content down
    // Start dragging up (scrolling)
    // When scrollY reaches 0, continue motion
    // Verify sheet starts moving up without interruption
  })

  it('seamlessly hands off from sheet drag to scroll', async () => {
    // Open sheet at lower snap point
    // Drag up until hitting top snap point
    // Continue upward motion
    // Verify content starts scrolling without interruption
  })
})
```

## Notes

### Why Not Use Reanimated?

- Tamagui has its own animation driver system
- Don't want to force Reanimated as a dependency
- `Gesture.Pan()` with `runOnJS(true)` works fine for our use case
- The key is `simultaneousWithExternalGesture`, not worklets

### Fallback Behavior

When `setupGestureHandler()` is NOT called:

- Sheet uses current `PanResponder` implementation
- Minor iOS limitations remain (as documented in next.md)
- Web always uses PanResponder (fine for web)
- No breaking changes

### Package Dependencies

**Optional peer dependency:**

```json
{
  "peerDependencies": {
    "react-native-gesture-handler": ">=2.0.0"
  },
  "peerDependenciesMeta": {
    "react-native-gesture-handler": {
      "optional": true
    }
  }
}
```

## Progress Tracking

- [x] Study teleport/portal pattern
- [x] Study react-native-actions-sheet implementation
- [x] Study gorhom/bottom-sheet implementation
- [x] Create implementation plan (this document)
- [x] Create setupGestureHandler infrastructure (platform-specific files)
- [x] Add platform-specific hooks: useGestureHandlerPan.tsx/native.tsx
- [x] Add platform-specific wrapper: GestureDetectorWrapper.tsx/native.tsx
- [x] Add platform-specific state: gestureState.ts/native.ts
- [ ] **Refactor setup to auto-detect RNGH** (like teleport pattern - no args needed)
- [ ] Add RNGH as optional peer dependency in package.json
- [ ] Add setup-gesture-handler export to package.json
- [ ] Integrate hook into SheetImplementationCustom
- [ ] Implement Sheet.ScrollView with simultaneousHandlers
- [ ] Implement blockPan pattern for handoff
- [ ] Write TDD tests
- [ ] Test on iOS simulator/device
- [ ] Update documentation
- [ ] Run full test suite

## Current Status (Iteration 3)

Core implementation complete:

- `gestureState.ts` - global state for RNGH availability (no native deps)
- `setupGestureHandler.ts` - auto-detects RNGH via require() (like teleport pattern)
- `useGestureHandlerPan.tsx` - pan gesture hook with blockPan logic
- `GestureDetectorWrapper.tsx` - conditional wrapper component
- `GestureSheetContext.tsx` - context for sharing gesture ref with ScrollView
- `SheetImplementationCustom.tsx` - integrated gesture handler with fallback to PanResponder
- `SheetScrollView.tsx` - simultaneousWithExternalGesture for native coordination
- `package.json` - added `setup-gesture-handler` export and optional peer dep

Kitchen sink setup:

- Added `setupGestureHandler()` call in `App.native.tsx`

**Next step**: Test on iOS simulator to verify behavior:

1. Dragging sheet should NOT cause scroll
2. Scrolling content should NOT cause sheet drag
3. Handoff at scroll top should be seamless
