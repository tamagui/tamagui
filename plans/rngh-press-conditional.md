# Plan: Conditional RNGH Press Handling

## Goal

Use RNGH for press events when `@tamagui/native/setup-gesture-handler` has been called, otherwise fall back to RN's `usePressability`. Avoid re-parenting by tracking `hasEverHadPressEvents` in stateRef.

## Key Points

1. **`runOnJS(true)`** is required on Tap/LongPress gestures for React callbacks to work
2. **`Gesture.Exclusive(longPress, tap)`** ensures only one fires based on timing
3. **Inline require** `usePressability` only when RNGH is not enabled (avoids RN internal dep when not needed)
4. **Track `hasEverHadPressEvents`** in stateRef to maintain consistent tree structure

## Changes

### 1. `code/core/web/src/types.tsx`

Add to `TamaguiComponentStateRef` (around line 535):

```typescript
export type TamaguiComponentStateRef = {
  // ... existing fields ...
  hasEverHadPressEvents?: boolean  // <-- add this
}
```

### 2. `code/core/web/src/eventHandling.native.ts`

```typescript
import React from 'react'
import { composeEventHandlers } from '@tamagui/helpers'
import { getGestureHandler } from '@tamagui/native'
import type { TamaguiComponentStateRef } from './types'

// web events not used on native
export function getWebEvents() {
  return {}
}

const dontComposePressabilityKeys: Record<string, boolean> = {
  onBlur: true,
  onFocus: true,
}

export function usePressHandling(
  events: any,
  viewProps: any,
  stateRef: { current: TamaguiComponentStateRef }
) {
  const hasPressEvents =
    events?.onPress || events?.onPressIn || events?.onPressOut || events?.onLongPress

  const gh = getGestureHandler()

  // track if we ever had press events to avoid re-parenting
  if (hasPressEvents) {
    stateRef.current.hasEverHadPressEvents = true
  }

  if (gh.isEnabled && hasPressEvents) {
    // RNGH path - return gesture for wrapping
    return gh.createPressGesture({
      onPressIn: events.onPressIn,
      onPressOut: events.onPressOut,
      onPress: events.onPress,
      onLongPress: events.onLongPress,
      delayLongPress: events.delayLongPress,
      hitSlop: viewProps.hitSlop,
    })
  }

  if (hasPressEvents) {
    // fallback - inline require usePressability only when needed
    const usePressability =
      require('react-native/Libraries/Pressability/usePressability').default
    const pressability = usePressability(events)

    if (pressability) {
      if (viewProps.hitSlop) {
        events.hitSlop = viewProps.hitSlop
      }
      for (const key in pressability) {
        const og = viewProps[key]
        const val = pressability[key]
        viewProps[key] =
          og && !dontComposePressabilityKeys[key] ? composeEventHandlers(og, val) : val
      }
    }
  }

  return null
}

export function wrapWithGestureDetector(
  content: any,
  gesture: any,
  stateRef: { current: TamaguiComponentStateRef }
) {
  const gh = getGestureHandler()
  const { GestureDetector, Gesture } = gh.state

  // avoid re-parenting: if we ever had press events, always wrap
  const shouldWrap = stateRef.current.hasEverHadPressEvents

  if (!GestureDetector || !shouldWrap) {
    return content
  }

  // use actual gesture or no-op Manual gesture to maintain tree structure
  const gestureToUse = gesture || Gesture?.Manual()

  if (!gestureToUse) {
    return content
  }

  return React.createElement(GestureDetector, { gesture: gestureToUse }, content)
}
```

## How It Works

1. **User Setup** (optional):
   ```typescript
   // app entry
   import '@tamagui/native/setup-gesture-handler'
   import { GestureHandlerRootView } from 'react-native-gesture-handler'
   ```

2. **At Runtime**:
   - `usePressHandling` checks `getGestureHandler().isEnabled`
   - If RNGH enabled: creates press gesture via `createPressGesture()`, returns it
   - If RNGH not enabled: inline requires `usePressability`, mutates viewProps, returns null

3. **Wrapping**:
   - `wrapWithGestureDetector` checks `hasEverHadPressEvents`
   - If component ever had press events, wraps with GestureDetector
   - Uses actual gesture or `Gesture.Manual()` no-op to maintain tree structure
   - If never had press events, returns content unwrapped

## Gesture Callback Flow

| User Action | Callback | RNGH Event |
|-------------|----------|------------|
| Touch down | `onPressIn` | Tap's `onBegin` |
| Quick release (< 500ms) | `onPress` + `onPressOut` | Tap's `onEnd` + `onFinalize` |
| Hold 500ms+ | `onLongPress` + `onPressOut` | LongPress's `onStart` + `onFinalize` |

## Testing

1. Run existing Detox tests with RNGH enabled
2. Run `PressStyleNative.noRngh.test.ts` to verify fallback path
3. Test press style changes work with both paths
