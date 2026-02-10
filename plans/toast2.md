# Toast v2 - Complete Redesign Plan

DO NOT RUN PLAYWRIGHT wihtou 'headless'!!!!!!!!!!!   

run `yarn watch` in the bg its faster 
run kitchen-sink:web in the bg!!!!!!! ON PORT 7979!!!!!!!!!!!!!!
- change tests to run on 7979  


## Vision

Build the best toast component for React Native/Web - combining Sonner's polish and UX details with Base UI's composability, implemented in pure Tamagui style with cross-platform gesture handling.

---

## Core Principles

1. **Tamagui-first**: No CSS animations, use `useAnimatedNumber`/`useAnimatedNumberStyle` for interactive + animations
2. **Cross-driver animations**: Works with CSS, RN Animated, Reanimated, and Motion drivers
3. **Composable API**: Base UI-style compound components for full customization
4. **Premium UX**: Sonner-level polish - resistance physics, velocity-based dismissal, smooth stacking
5. **unstyled={false} defaults**: Beautiful out-of-box styling, fully customizable with `unstyled={true}`

---

## FEEDBACK FROM LAST ITERATION

ok i updateed things - 7979 is your port now

  my feedback: the drag is dragging the inner text and content but not the outer frame

  - release after drag needs to be smooth you need a velocity of release matching veolicty of exit animation test
  - if i drag it a bit and let go and its closer to stayin in, it should go back to rest and use spring if possible for spring dfrivers
  - etner toast seem behind the exiting ones should be above (test TDD)
  - resistive drag should work in all directions (TDD) except exit direction
  - exit direction should be configurable but default to "edge" aka the edge its on, so if it comes up from bottom i drag down to hide (TDD)
  - other options should be horizontal, vertical, down, up, left, right
  - exit animations not working i think, sort of but opacity is not smooth

  for animations - you should define new ULTRA slow aninmations for use only in kitchen sink - 5000ms on each driver
  - that way you can do REAL tests where you ACTUALLY capture FOUR points of measurement and ENSURE ITS SMOOTH


---

## Developing

DO NOT RUN PLAYWRIGHT wihtou 'headless'!!!!!!!!!!!   

run `yarn watch` in the bg its faster 
run kitchen-sink:web in the bg!!!!!!! ON PORT 7979!!!!!!!!!!!!!!
- change tests to run on 7979  

The is intensively animated / interactive stuff  in the past you really struggled to get it right, you would: 

- drags would not be working or only dragging the inside, or glitchy and think its ok 
- mousemove between the toast would casue stutering animations
- complex mouse interactions like swiping one while others are open or moving mouse back over while they  close would just break 

so you need to come up with a way to test that like REALLY

i think that maybe taking short videos using playwright perhaps and doing frame analysis (like sample 30)

i tink you need to write extremely good tests as ell, and then have sub-agents just critique the tests themeslves if they are actaully testing like visually + animation + gesture deeply and well not halfway 

FINAL NOTE:

run `yarn watch` in the bg its faster 
run kitchen-sink:web in the bg!!!!!!! ON PORT 7979!!!!!!!!!!!!!!
- change tests to run on 7979  

please dont interrupt me  - if kitchen sink tests are fialing maybe it did get stuck

- rebase against origin/v2 every so often to be sure youre up to date 

- IF YOU THINK YOU ARE DONE - TIME TO REVIEW YOUR TESTS AND HAVE
A SUB-AGENT CRITIQUE YOUR TESTS

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

Following Sheet's pattern for cross-driver support of animations that need to be granularyl changed in reaction to drags:

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
        // TODO instead o fusnig hardcode just set size: '$true' here and add a size variant, tjen getSize() + shift - see other example in codebase
        // this lets peple BYO tokens (clor ones like $backougrnd are ok)
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

## Progress Log

### 2026-01-27

**Bug Fix: Direction Lock in Pointer Up Handler**
- Found bug via new test: diagonal drags starting vertical were still dismissing horizontal toasts
- Fixed `handlePointerUp` in `useAnimatedDragGesture.ts` to check `lockedDirectionRef` before allowing dismiss
- Added `isLockedToWrongAxis` check that prevents horizontal dismissal when locked to Y axis (and vice versa)

**Tests Added (36 total in Toast.test.tsx, 13 in ToastMultiple.test.tsx = 49 total)**

New test categories added:
- Toast Gesture Physics (6 tests):
  - diagonal drag direction lock prevents horizontal swipe (needs validation)
  - resistance caps at ~25px when dragging far in wrong direction (needs validation)
  - fast flick in wrong direction does NOT dismiss (needs validation)
  - transform follows sqrt resistance curve during wrong-direction drag (needs validation)
  - orphaned pointer move without pointer down is ignored (needs validation)
  - right-click during drag triggers cancel and snaps back (needs validation)

- Toast Stacking Drag Interactions (3 tests):
  - dragging stacked (non-front) toast works correctly (needs validation)
  - drag one toast while another is entering does not cause glitches (needs validation)
  - escape key during drag cancels drag and dismisses toast (needs validation)

- Toast Timer Interactions (2 tests):
  - drag pauses auto-dismiss timer and resumes on cancel (needs validation)
  - multiple rapid hovers do not corrupt timer state (needs validation)

- Toast Position Swipe Directions (1 test):
  - bottom-right position allows right swipe dismissal (needs validation)

**Sub-agent Test Critique**
Spawned sub-agent to critique test coverage. Key gaps identified and addressed:
- Direction lock mechanism (fixed, needs validation)
- Resistance physics boundary (needs validation)
- Orphaned pointer moves (needs validation)
- Pointer cancel handling (needs validation)
- Stacking + drag interactions (needs validation)
- Timer pause/resume during gestures (needs validation)

**Additional Fix: Pointer Capture Release**
- Added explicit `releasePointerCapture()` calls in `handlePointerUp` and `handlePointerCancel`
- While browsers auto-release on pointer end, explicit release is safer practice

**Test Summary:**
- 36 tests in Toast.test.tsx
- 13 tests in ToastMultiple.test.tsx
- 49 total tests covering gestures, stacking, timing, edge cases (all need manual validation)

### 2026-01-27 (continued)

**Bug Fix: Entering toasts behind exiting toasts**
- Issue: New toasts appeared behind exiting toasts during animation
- Root cause: Z-index was computed without considering `removed` state
- Change: Added `removed ? 0 : visibleToasts - index + 1` for z-index calculation
- Theory: Exiting toasts should get z-index 0, so entering toasts appear above them
- Added test but needs manual validation

**Bug Fix: Drag only moving content, not outer frame**
- Issue: Dragging was moving text/content but the background/border stayed in place
- Root cause: DragWrapper was inside ToastItemFrame; drag transform only applied to content
- Change: Restructured component hierarchy:
  - New `ToastPositionWrapper` handles absolute positioning and stacking animations
  - `DragWrapper` now wraps `ToastItemFrame` entirely
  - `ToastItemFrame` only contains visual styling (background, border, shadow)
- Theory: drag transform should now move the entire visual toast including styling
- NEEDS MANUAL VALIDATION

**Ultra-slow 5000ms animation added**
- Added 5000ms animation to all drivers (CSS, Motion, Native, Reanimated)
- Available for testing animation smoothness by sampling multiple points

**Test Summary (Updated):**
- 37 tests in Toast.test.tsx (added z-index test)
- 13 tests in ToastMultiple.test.tsx
- 50 total tests (need manual validation with each driver)

### 2026-01-27 (continued - interactions polish)

**Feature: All-direction drag with resistance when collapsed (Sonner-like)**
- Intended: When collapsed, allow drag in all directions with resistance except exit direction
- This should create the satisfying "rubber band" feel in all directions
- When expanded, still use direction locking to prevent accidental scrolls
- NEEDS MANUAL VALIDATION

**Feature: Opacity fade during swipe exit**
- Added fadeOut parameter to animateSpring for smooth opacity animation during swipe dismiss
- Exit animation should fade opacity based on progress toward target position
- NEEDS MANUAL VALIDATION - exit opacity may still be choppy

**Feature: Sonner-style focus ring**
- Changed from outline to box-shadow for focus-visible styling
- `boxShadow: '0 4px 12px $shadowColor, 0 0 0 2px $color8'`

**Feature: Immediate toast repositioning on swipe dismiss**
- Removed height from heights array immediately when swipe dismiss starts
- Remaining toasts should reposition immediately instead of waiting for exit animation
- NEEDS MANUAL VALIDATION

**Bug Fix: Test helpers updated for new component hierarchy**
- getDragTransformX now looks for parent element (DragWrapper is parent of ToastItemFrame)
- z-index test now looks at grandparent (ToastPositionWrapper)
- Added getDragTransform helper for both X and Y values

**Test update:**
- Changed "diagonal drag locks direction" test to "collapsed mode allows all-direction drag"
- Tests now verify the new all-direction resistance behavior

**Bug Fix: Hover cooldown during repositioning**
- Added 300ms cooldown after toast removal to ignore hover events
- Prevents toasts from expanding when they reposition into mouse cursor

**Bug Fix: Shadow styling**
- boxShadow string with tokens doesn't interpolate
- Changed to proper shadow props: shadowColor, shadowOffset, shadowOpacity, shadowRadius

### TODO / Known Issues

- [ ] Top-right position: can't pull left with resistance when expanded - attempted fix, needs validation
- [ ] Mixed height toasts don't position correctly in stack - attempted fix (heightBeforeMe), needs validation
- [ ] swipeDirection 'auto' option to auto-detect based on edge position - implemented, needs validation
- [ ] Exit animations may not be smooth - needs investigation
- [ ] Drag may still only move inner content not outer frame - needs validation
- [ ] Stacking z-index during enter/exit - needs validation
- [ ] Velocity-based exit animation - needs validation
- [ ] All animation drivers need testing (CSS, RN, Reanimated, Motion)

### 2026-01-27 (continued - mixed height fix)

**Bug Fix: Mixed height toast positioning**
- Issue: Toasts with different heights (e.g., with description vs simple) overlapped when expanded
- Root cause: Y position calculation used heights array index which didn't match visual order
- Fix: Added `heightBeforeMe` prop calculated in Toaster by summing heights of preceding toasts
- Now each toast's expanded Y position is based on actual heights of toasts above it
- Gap between expanded toasts is consistent (12px) regardless of height differences

### 2026-01-27 (continued - velocity-based exit)

**Feature: Auto swipe direction**
- Added `'auto'` to SwipeDirection type
- When `swipeDirection='auto'` (now the default), the dismiss direction is auto-detected based on position:
  - left/right positions → swipe toward that horizontal edge (left/right)
  - center positions → swipe toward the vertical edge (up for top, down for bottom)
- Helper function `resolveSwipeDirection()` converts 'auto' to actual direction
- This makes the toast feel natural - always swipe toward the nearest edge to dismiss
- Added test for all 6 positions

**Feature: Velocity-based exit animation**
- Issue: Swipe dismiss felt disconnected - drag ended abruptly, then AnimatePresence handled exit separately
- AnimatePresence doesn't support initialVelocity, so couldn't carry momentum
- Solution: Use `animateOut` from useToastAnimations instead of relying on AnimatePresence exitStyle for position
- Now the gesture velocity is passed through to the spring animation for smooth momentum continuation

**Implementation changes:**
- `useAnimatedDragGesture.onDismiss` now passes velocity (px/ms) as second parameter
- `useToastAnimations.animateOut` accepts optional velocity and uses it as initial spring velocity
- `animateSpring` (CSS driver) now supports `initialVelocityX/Y` config options
- `ToastItem.onDismiss` uses `animateOut(direction, velocity, callback)` then removes toast after animation
- `exitStyle` simplified: for swipe dismisses, only handles opacity fade (position handled by drag transform)

**Test timing updates:**
- Changed waitForTimeout from 500ms to 800ms for tests involving swipe dismiss
- Spring exit animation takes longer than previous instant removal + AnimatePresence transition

---

## Notes

- Study Sheet's `SheetImplementationCustom.tsx` for animation driver integration pattern
- Study Sheet's `helpers.tsx` for resistance physics
- Study Button for `unstyled` variant + context pattern
- Study Drawer for gesture handling patterns
- Current v2-toast has good foundation - enhance rather than rewrite
- PanResponder for RN, pointer events for web (already done)
