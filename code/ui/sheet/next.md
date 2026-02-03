# Sheet ScrollView Gesture Handoff - Next Steps

## Current Limitation

The Sheet + ScrollView gesture coordination on native iOS has limitations because Tamagui uses React Native's built-in `PanResponder`, while iOS's `UIScrollView` gesture recognizers fire BEFORE the RN responder system can claim the gesture.

This causes:

- Minor scroll "flicker" when starting to drag down from scroll top
- Imperfect handoff between scroll and sheet drag gestures

## Ideal Solution: react-native-gesture-handler Integration

Both `gorhom/bottom-sheet` and `react-native-actions-sheet` solve this by using `react-native-gesture-handler` which provides:

1. **`simultaneousHandlers`** - allows coordinating multiple gesture recognizers
2. **`GestureDetector`** with worklets - can check conditions and decide who handles gesture before it starts
3. **Native gesture coordination** - works at the iOS/Android gesture recognizer level, not the JS responder level

## Proposed API

```tsx
import { setupGestureHandler } from '@tamagui/sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// Call once at app startup (optional - falls back to PanResponder)
setupGestureHandler({
  // Pass the gesture handler module so we don't add it as a hard dependency
  GestureDetector: require('react-native-gesture-handler').GestureDetector,
  Gesture: require('react-native-gesture-handler').Gesture,
})

// Then wrap app
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <YourApp />
    </GestureHandlerRootView>
  )
}
```

## Implementation Notes

If `setupGestureHandler()` is called:

- Use `GestureDetector` with `Gesture.Pan()` instead of `PanResponder`
- Use `simultaneousHandlers` to coordinate with ScrollView's gesture
- Implement `blockPan` flag pattern from actions-sheet for smooth handoff

If not called:

- Fall back to current `PanResponder` implementation
- Accept the minor limitations on native

## References

- gorhom/bottom-sheet: Uses Reanimated worklets + gesture handler
- react-native-actions-sheet: Uses `blockPan` flag pattern with gesture handler
- Both are MIT licensed and can be used as reference

## Files to Modify

- `SheetImplementationCustom.tsx` - Replace PanResponder with GestureDetector
- `SheetScrollView.tsx` - Use `useScrollHandlers()` pattern from actions-sheet
- Add `setupGestureHandler.ts` for optional gesture handler registration

## Test Case

There's a test case at `code/kitchen-sink/src/usecases/SheetScrollableDrag.tsx` that demonstrates the bug and can be used to verify fixes. It's not exported in the main navigation but can be accessed directly for testing.

## Attempted Fixes

1. **Native scroll enable/disable based on pane position** - Tried disabling scroll when sheet is not at top position, but this completely broke scrolling because the initial pane position values aren't set correctly on mount.

2. **PaneY change listeners** - Added `onPaneYChange`/`setPaneY` to ScrollBridge to notify ScrollView of position changes during drag, but the fundamental issue remains that iOS UIScrollView gesture recognizers fire before RN's responder system.

The core issue is architectural: React Native's PanResponder cannot coordinate with iOS's native UIScrollView gesture recognizers at the right level. The only real solution is `react-native-gesture-handler` integration.
