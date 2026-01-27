# Toast v2 - Complete Redesign Plan

## Vision

Build the best toast component for React Native/Web - combining Sonner's polish and UX details with Base UI's composability, implemented in pure Tamagui style with cross-platform gesture handling.

---

## Core Principles

1. **Tamagui-first**: No CSS animations, use `useAnimatedNumber`/`useAnimatedNumberStyle` for all motion
2. **Cross-driver animations**: Works with CSS, RN Animated, Reanimated, and Motion drivers
3. **Composable API**: Base UI-style compound components for full customization
4. **Premium UX**: Sonner-level polish - resistance physics, velocity-based dismissal, smooth stacking
5. **unstyled={false} defaults**: Beautiful out-of-box styling, fully customizable with `unstyled={true}`

---

## API Design

### Imperative API (Sonner-style)

```tsx
import { toast } from '@tamagui/toast'

// basic usage
toast('Hello world')
toast.success('Saved!')
toast.error('Failed')
toast.warning('Careful')
toast.info('FYI')
toast.loading('Processing...')

// promise toasts
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed to save',
})

// with options
toast('Message', {
  description: 'More details here',
  duration: 5000,
  action: {
    label: 'Undo',
    onClick: () => undoAction(),
  },
  cancel: {
    label: 'Cancel',
    onClick: () => {},
  },
})

// custom component
toast.custom((id) => <MyCustomToast id={id} />)

// dismiss
const id = toast('Hello')
toast.dismiss(id)
toast.dismiss() // all
```

### Declarative/Composable API (Base UI-style)

```tsx
import { Toast } from '@tamagui/toast'

// provider setup
<Toast.Provider swipeDirection="right" duration={4000}>
  <App />
  <Toast.Viewport position="bottom-right" />
</Toast.Provider>

// custom toast rendering with full control
<Toast.Root>
  <Toast.Content>
    <Toast.Icon />
    <Toast.Title>Hello</Toast.Title>
    <Toast.Description>More details</Toast.Description>
    <Toast.Action altText="Undo">Undo</Toast.Action>
    <Toast.Close />
  </Toast.Content>
</Toast.Root>
```

### Standalone Toaster (Simple Setup)

```tsx
import { Toaster, toast } from '@tamagui/toast'

// minimal setup - just add Toaster anywhere
function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Button onPress={() => toast('Hello!')}>Show Toast</Button>
    </>
  )
}
```

---

## Component Architecture

```
Toast/
├── ToastProvider.tsx       # global context, settings
├── ToastViewport.tsx       # portal container, positioning
├── ToastRoot.tsx           # individual toast wrapper, AnimatePresence integration
├── ToastContent.tsx        # content container with gestures
├── ToastTitle.tsx          # styled title text
├── ToastDescription.tsx    # styled description text
├── ToastAction.tsx         # action button
├── ToastClose.tsx          # close button
├── ToastIcon.tsx           # type-based icons
├── Toaster.tsx             # all-in-one simple setup
├── ToastState.ts           # global observer for imperative API
├── useToastGesture.ts      # gesture handling hook
├── useToastAnimations.ts   # animation coordination hook
├── types.ts                # shared types
└── index.ts                # exports
```

---

## Gesture & Animation System

### Animation Strategy (Cross-Driver)

Three levels of animation, all cross-driver compatible:

1. **AnimatePresence** → enter/exit styles (enterStyle, exitStyle)
   - Used for: toast appearing/disappearing
   - Cross-driver: yes (handled by Tamagui core)

2. **transition prop** → non-interactive animations
   - Used for: stacking position changes, scale, opacity
   - Cross-driver: yes (handled by Tamagui core)
   - Example: `transition="quick"` on ToastItemFrame

3. **useAnimatedNumber/Style** → interactive animations (with gesture responder)
   - Used for: drag gestures only
   - Cross-driver: yes (driver-specific implementation)
   - Needed because: drag requires direct value updates during gesture

### Animation Driver Integration

Following Sheet's pattern for cross-driver support:

```tsx
function useToastAnimations(options: ToastAnimationOptions) {
  const { animationDriver } = useConfiguration()

  const {
    useAnimatedNumber,
    useAnimatedNumberStyle,
    useAnimatedNumberReaction
  } = animationDriver

  // animated values for drag
  const translateX = useAnimatedNumber(0)
  const translateY = useAnimatedNumber(0)
  const scale = useAnimatedNumber(1)
  const opacity = useAnimatedNumber(1)

  // animated styles derived from values
  const animatedStyle = useAnimatedNumberStyle(translateX, (x) => {
    'worklet'
    return {
      transform: [{ translateX: x }],
    }
  })

  return {
    translateX,
    translateY,
    scale,
    opacity,
    animatedStyle,
    setValue: (prop, value, config) => {
      // unified API for all drivers
    },
  }
}
```

### Gesture Handling

**Core behavior (like Sonner):**
- Drag in allowed direction: free movement
- Drag in wrong direction: resistance (sqrt curve)
- Release: velocity + distance check for dismiss
- Cancel: spring back to origin

```tsx
function useToastGesture(options: ToastGestureOptions) {
  const { swipeDirection, threshold, onDismiss, translateX, translateY } = options

  // track gesture state
  const gestureRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    isDragging: false,
  })

  const handleMove = (x: number, y: number) => {
    const deltaX = x - gestureRef.current.startX
    const deltaY = y - gestureRef.current.startY

    // apply resistance for wrong direction
    const resistedX = applyResistance(deltaX, swipeDirection)
    const resistedY = applyResistance(deltaY, swipeDirection)

    // direct update (no animation) during drag
    translateX.setValue(resistedX, { type: 'direct' })
    translateY.setValue(resistedY, { type: 'direct' })
  }

  const handleEnd = (x: number, y: number) => {
    const delta = getDelta(x, y, swipeDirection)
    const velocity = getVelocity(gestureRef.current)

    const shouldDismiss =
      Math.abs(delta) > threshold ||
      velocity > VELOCITY_THRESHOLD

    if (shouldDismiss && isCorrectDirection(delta, swipeDirection)) {
      // animate out
      const exitDistance = getExitDistance(swipeDirection)
      translateX.setValue(exitDistance.x, { type: 'spring' })
      translateY.setValue(exitDistance.y, { type: 'spring' })
      onDismiss()
    } else {
      // spring back
      translateX.setValue(0, { type: 'spring', ...SPRING_CONFIG })
      translateY.setValue(0, { type: 'spring', ...SPRING_CONFIG })
    }
  }

  return { gestureHandlers }
}
```

### Resistance Physics

Same sqrt-based resistance as Sheet:

```tsx
function applyResistance(delta: number, direction: SwipeDirection): number {
  const isAllowed = isAllowedDirection(delta, direction)

  if (isAllowed) {
    return delta // free movement
  }

  // sqrt curve for gentle resistance
  const pastBoundary = Math.abs(delta)
  const resisted = Math.sqrt(pastBoundary) * 2
  return delta > 0 ? resisted : -resisted
}
```

---

## Stacking Animation

### Visual Stacking (Collapsed Mode)

Like Sonner - toasts stack behind frontmost with scale + peek:

```tsx
const getStackStyles = (index: number, expanded: boolean, isTop: boolean) => {
  if (expanded) {
    // full offset for each toast
    return {
      y: getExpandedOffset(index),
      scale: 1,
      opacity: 1,
    }
  }

  // collapsed stacking
  const scale = 1 - index * 0.05  // each toast 5% smaller
  const peek = 10 * index          // 10px peek per toast
  const opacity = index >= MAX_VISIBLE ? 0 : index === MAX_VISIBLE - 1 ? 0.5 : 1

  return {
    y: isTop ? peek : -peek,
    scale,
    opacity,
  }
}
```

### AnimatePresence Integration

Enter/exit animations via AnimatePresence:

```tsx
<AnimatePresence>
  {toasts.map((toast, index) => (
    <Toast.Root
      key={toast.id}
      enterStyle={{
        opacity: 0,
        y: isTop ? -20 : 20,
        scale: 0.95,
      }}
      exitStyle={{
        opacity: 0,
        x: swipeDirection === 'right' ? 100 : swipeDirection === 'left' ? -100 : 0,
        y: swipeDirection === 'up' ? -50 : swipeDirection === 'down' ? 50 : 0,
        scale: 0.95,
      }}
      animation="quick"
    >
      {/* ... */}
    </Toast.Root>
  ))}
</AnimatePresence>
```

---

## Styled Components (unstyled={false} defaults)

### ToastContent

```tsx
const ToastContent = styled(YStack, {
  name: 'ToastContent',

  variants: {
    unstyled: {
      false: {
        backgroundColor: '$background',
        borderRadius: '$4',
        paddingHorizontal: '$4',
        paddingVertical: '$3',
        elevation: '$4',
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: '$borderColor',
        minWidth: 300,
        maxWidth: 400,
      },
    },

    type: {
      success: {
        borderLeftWidth: 3,
        borderLeftColor: '$green10',
      },
      error: {
        borderLeftWidth: 3,
        borderLeftColor: '$red10',
      },
      warning: {
        borderLeftWidth: 3,
        borderLeftColor: '$yellow10',
      },
      info: {
        borderLeftWidth: 3,
        borderLeftColor: '$blue10',
      },
    },
  },

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})
```

### Context for Styling

```tsx
const ToastContext = createStyledContext({
  type: 'default',
  size: '$4',
  unstyled: false,
})

// sub-components inherit context
const ToastTitle = styled(SizableText, {
  name: 'ToastTitle',
  context: ToastContext,

  variants: {
    unstyled: {
      false: {
        fontWeight: '600',
        color: '$color',
      },
    },
  },
})
```

---

## Features Checklist

### From Sonner
- [x] Imperative API (`toast()`, `toast.success()`, etc.)
- [x] Promise toasts with loading/success/error states
- [x] Stacking with scale + opacity (collapsed/expanded)
- [x] Swipe to dismiss with velocity detection
- [x] Pause on hover/interaction
- [x] Rich content (title, description, icon)
- [x] Action/cancel buttons
- [x] Auto-dismiss with configurable duration
- [x] Position variants (6 positions)
- [x] Custom JSX toasts
- [ ] Toast history API
- [ ] Keyboard focus management (hotkey to focus)
- [ ] Rich colors option

### From Base UI
- [x] Compound component API
- [x] Unstyled/headless mode
- [x] Accessibility (ARIA live regions, roles)
- [x] Swipe direction prop (single or array)
- [ ] Anchor positioning (toast at element)
- [ ] F6 keyboard navigation to viewport
- [ ] Priority levels for announcements

### Tamagui-Specific
- [x] Cross-animation-driver support
- [x] `useAnimatedNumber`/`useAnimatedNumberStyle` for all motion
- [x] AnimatePresence for enter/exit
- [x] `unstyled` variant pattern
- [x] `createStyledContext` for prop inheritance
- [x] Native toast support (burnt)
- [x] Portal rendering

### Premium UX Details
- [x] Resistance physics on wrong-direction drag
- [x] Velocity-based dismissal
- [x] Spring animations for snap-back
- [x] Smooth stacking transitions
- [x] Transform-origin awareness for scale
- [x] Gap filler for hover stability
- [ ] Haptic feedback on dismiss (native)
- [ ] Reduced motion support

---

## Implementation Order

### Phase 1: Core Foundation
1. Toast state management (observer pattern) ✅
2. Basic Toaster component ✅
3. ToastItem with basic rendering ✅
4. Enter/exit animations with AnimatePresence ✅

### Phase 2: Gesture System
1. `useDragGesture` hook with resistance ✅
2. Cross-driver animation integration ✅ (useAnimatedDragGesture + useToastAnimations)
3. Velocity-based dismissal ✅
4. Spring snap-back ✅

### Phase 3: Stacking & Polish
1. Collapsed stacking with scale/opacity ✅
2. Expanded mode on hover ✅
3. Height measurement and offset calculation ✅
4. Position variants ✅

### Phase 4: Composable API (LOW PRIORITY)
1. Toast.Provider context
2. Toast.Viewport portal
3. Toast.Root wrapper
4. Toast.Content/Title/Description/Action/Close
5. Toast.Icon
Note: Internal styled components already exist (ToastItemFrame, etc.). Can export if needed.

### Phase 5: Final Polish
1. Keyboard navigation ✅ (Escape key, Tab focus)
2. Accessibility audit ✅ (role="status", aria-live)
3. Reduced motion - TODO
4. Documentation - TODO
5. Tests ✅ (16 comprehensive tests passing)

---

## File Changes Summary

### Existing (v2-toast) - Enhance
- `Toaster.tsx` - add animation driver integration
- `ToastItem.tsx` - use `useAnimatedNumber` for drag
- `useDragGesture.ts` - integrate with animation system
- `ToastState.ts` - good as-is

### New Files
- `Toast.tsx` - compound component API wrapper
- `ToastContext.tsx` - createStyledContext setup
- `ToastRoot.tsx` - individual toast wrapper
- `ToastContent.tsx` - styled content container
- `ToastTitle.tsx` - styled title
- `ToastDescription.tsx` - styled description
- `ToastAction.tsx` - action button
- `ToastClose.tsx` - close button
- `ToastIcon.tsx` - type-based icons
- `useToastAnimations.ts` - animation coordination

---

## Notes

- Study Sheet's `SheetImplementationCustom.tsx` for animation driver integration pattern
- Study Sheet's `helpers.tsx` for resistance physics
- Study Button for `unstyled` variant + context pattern
- Study Drawer for gesture handling patterns
- Current v2-toast has good foundation - enhance rather than rewrite
- PanResponder for RN, pointer events for web (already done)
