# Plan: RNGH Press Handling via @tamagui/native

## Goal
Replace RN's JS-thread Pressability with RNGH's native-thread gestures. Use the new `@tamagui/native` getter pattern. Keep web logic separate and smart about avoiding re-parenting.

## Architecture

```
@tamagui/native
├── gestureState.ts          # getGestureHandler().isEnabled, .state, .set(), .createPressGesture()
├── setup-gesture-handler.ts # calls getGestureHandler().set({ enabled: true, Gesture, GestureDetector })

@tamagui/web (createComponent lives here)
├── createComponent.tsx      # imports from ./eventHandling
├── eventHandling.ts         # web: getWebEvents, state tracking, DOM events
└── eventHandling.native.ts  # native: uses getGestureHandler(), wraps with GestureDetector

@tamagui/core
└── index.tsx                # setupHooks - simplified, eventHandling handles divergence
```

## Key Changes

### 1. Add `createPressGesture` to `@tamagui/native/gestureState.ts`

```typescript
export function getGestureHandler() {
  return {
    get isEnabled() {
      return getGlobalState().enabled
    },
    get state() {
      return getGlobalState()
    },
    set(updates: Partial<GestureState>) {
      const state = getGlobalState()
      Object.assign(state, updates)
    },

    // new: create press gesture if RNGH available
    createPressGesture(config: {
      onPressIn?: (e: any) => void
      onPressOut?: (e: any) => void
      onPress?: (e: any) => void
      onLongPress?: (e: any) => void
      delayLongPress?: number
      hitSlop?: any
    }) {
      const { Gesture } = getGlobalState()
      if (!Gesture) return null

      const tap = Gesture.Tap()
        .onBegin((e: any) => config.onPressIn?.(e))
        .onEnd((e: any) => config.onPress?.(e))
        .onFinalize((e: any) => config.onPressOut?.(e))

      if (config.hitSlop) tap.hitSlop(config.hitSlop)

      if (!config.onLongPress) return tap

      const longPress = Gesture.LongPress()
        .minDuration(config.delayLongPress ?? 500)
        .onStart((e: any) => config.onLongPress?.(e))
        .onFinalize((e: any) => config.onPressOut?.(e))

      if (config.hitSlop) longPress.hitSlop(config.hitSlop)

      return Gesture.Exclusive(longPress, tap)
    }
  }
}
```

### 2. Create `code/core/web/src/eventHandling.ts` (web version)

```typescript
// web event handling - maps RN-style events to DOM events
import type { TamaguiComponentEvents, WebOnlyPressEvents } from './interfaces/TamaguiComponentEvents'

type EventKeys = keyof (TamaguiComponentEvents & WebOnlyPressEvents)
type EventLikeObject = { [key in EventKeys]?: any }

export function getWebEvents<E extends EventLikeObject>(events: E, webStyle = true) {
  return {
    onMouseEnter: events.onMouseEnter,
    onMouseLeave: events.onMouseLeave,
    [webStyle ? 'onClick' : 'onPress']: events.onPress,
    onMouseDown: events.onPressIn,
    onMouseUp: events.onPressOut,
    onTouchStart: events.onPressIn,
    onTouchEnd: events.onPressOut,
    onFocus: events.onFocus,
    onBlur: events.onBlur,
  }
}

// web doesn't need wrapping - events go directly on element
export function wrapWithGestureDetector(content: any, _gesture: any) {
  return content
}

export function usePressHandling() {
  // no-op on web, events attached via getWebEvents
  return null
}
```

### 3. Create `code/core/web/src/eventHandling.native.ts`

```typescript
import React, { useRef } from 'react'
import { getGestureHandler } from '@tamagui/native'
import { composeEventHandlers } from '@tamagui/helpers'

// fallback to RN's pressability
const usePressability = require('react-native/Libraries/Pressability/usePressability').default

export function getWebEvents() {
  // not used on native
  return {}
}

// track if we've ever attached events to avoid re-parenting
const gestureRefs = new WeakMap<object, { hasEverWrapped: boolean }>()

export function usePressHandling(
  events: any,
  viewProps: any,
  stateRef: { current: any }
) {
  const gh = getGestureHandler()
  const gestureRef = useRef<any>(null)

  // track if we've ever wrapped to avoid re-parenting
  if (!gestureRefs.has(stateRef)) {
    gestureRefs.set(stateRef, { hasEverWrapped: false })
  }
  const tracking = gestureRefs.get(stateRef)!

  const hasPressEvents = events?.onPress || events?.onPressIn || events?.onPressOut || events?.onLongPress

  if (gh.isEnabled && hasPressEvents) {
    // use RNGH
    gestureRef.current = gh.createPressGesture({
      onPressIn: events.onPressIn,
      onPressOut: events.onPressOut,
      onPress: events.onPress,
      onLongPress: events.onLongPress,
      delayLongPress: events.delayLongPress,
      hitSlop: viewProps.hitSlop,
    })
    tracking.hasEverWrapped = true
  } else if (hasPressEvents) {
    // fallback to usePressability
    const pressability = usePressability(events)
    if (pressability) {
      for (const key in pressability) {
        const og = viewProps[key]
        const val = pressability[key]
        viewProps[key] = og ? composeEventHandlers(og, val) : val
      }
    }
  }

  return gestureRef.current
}

export function wrapWithGestureDetector(content: any, gesture: any, hasEverWrapped: boolean) {
  const gh = getGestureHandler()
  const { GestureDetector } = gh.state

  // avoid re-parenting: if we've ever wrapped, always wrap (even if gesture is null)
  if (!GestureDetector || (!gesture && !hasEverWrapped)) {
    return content
  }

  // wrap with GestureDetector - use identity gesture if null to maintain tree structure
  if (!gesture) {
    // keep wrapper but with no-op gesture to avoid re-parenting
    const { Gesture } = gh.state
    gesture = Gesture.Manual()
  }

  return React.createElement(GestureDetector, { gesture }, content)
}
```

### 4. Update `createComponent.tsx`

Replace inline `getWebEvents` with import, use `usePressHandling` in the hooks flow:

```typescript
import { getWebEvents, usePressHandling, wrapWithGestureDetector } from './eventHandling'

// In the component, after events object is created:

// Line ~1300 - web events attachment stays same
if (process.env.TAMAGUI_TARGET === 'web' && events && !isReactNative) {
  Object.assign(viewProps, getWebEvents(events))
}

// Line ~1311 - native events via hook
const pressGesture = usePressHandling(events, viewProps, stateRef)

// Later, in useChildren or where content is created:
// Line ~1378 area
content = React.createElement(elementType, viewProps, content)

// wrap if needed (native only, web is no-op)
content = wrapWithGestureDetector(
  content,
  pressGesture,
  stateRef.current.hasEverWrappedGesture
)
```

### 5. Simplify `core/core/src/index.tsx` setupHooks

The `useEvents` hook can be simplified since eventHandling.native.ts handles it:

```typescript
setupHooks({
  // ... other hooks stay same ...

  useEvents(viewProps, events, splitStyles, setStateShallow, staticConfig) {
    if (process.env.TAMAGUI_TARGET === 'native') {
      // focus/blur still needed
      if (events?.onFocus) viewProps['onFocus'] = events.onFocus
      if (events?.onBlur) viewProps['onBlur'] = events.onBlur

      // input special case stays
      if (staticConfig.isInput && events) {
        // ... existing input handling ...
      }

      // press handling now in eventHandling.native.ts via usePressHandling
      // no more usePressability here
    }
  },

  useChildren(elementType, children, viewProps) {
    // ... existing optimization logic ...
    // GestureDetector wrapping handled by wrapWithGestureDetector in createComponent
  },
})
```

## User Setup

```typescript
// App entry
import '@tamagui/native/setup-gesture-handler'  // calls getGestureHandler().set(...)
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <YourApp />
    </GestureHandlerRootView>
  )
}
```

## Benefits

1. **Clean separation** - web and native logic in separate files
2. **No internal props** - no `__rnghGesture`, uses getter pattern
3. **Avoid re-parenting** - tracks `hasEverWrapped` like web does with `shouldAttach`
4. **Opt-in** - falls back to usePressability if setup not called
5. **Follows existing pattern** - same as portal setup

## Files Summary

| File | Action |
|------|--------|
| `@tamagui/native/gestureState.ts` | Add `createPressGesture` method |
| `code/core/web/src/eventHandling.ts` | Create (web version) |
| `code/core/web/src/eventHandling.native.ts` | Create (native version) |
| `code/core/web/src/createComponent.tsx` | Import from eventHandling, remove inline getWebEvents |
| `code/core/core/src/index.tsx` | Simplify useEvents hook |
