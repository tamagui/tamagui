# Toast v2 - Complete Redesign Plan

DO NOT RUN PLAYWRIGHT wihtou 'headless'!!!!!!!!!!!   

run `yarn watch` in the bg its faster 
run kitchen-sink:web in the bg!!!!!!! ON PORT 6666!!!!!!!!!!!!!!
- change tests to run on 6666  


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

## Developing

DO NOT RUN PLAYWRIGHT wihtou 'headless'!!!!!!!!!!!   

run `yarn watch` in the bg its faster 
run kitchen-sink:web in the bg!!!!!!! ON PORT 6666!!!!!!!!!!!!!!
- change tests to run on 6666  

The is intensively animated / interactive stuff  in the past you really struggled to get it right, you would: 

- drags would not be working or only dragging the inside, or glitchy and think its ok 
- mousemove between the toast would casue stutering animations
- complex mouse interactions like swiping one while others are open or moving mouse back over while they  close would just break 

so you need to come up with a way to test that like REALLY

i think that maybe taking short videos using playwright perhaps and doing frame analysis (like sample 30)

i tink you need to write extremely good tests as ell, and then have sub-agents just critique the tests themeslves if they are actaully testing like visually + animation + gesture deeply and well not halfway 

FINAL NOTE:

run `yarn watch` in the bg its faster 
run kitchen-sink:web in the bg!!!!!!! ON PORT 6666!!!!!!!!!!!!!!
- change tests to run on 6666  

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
  - diagonal drag direction lock prevents horizontal swipe ✓
  - resistance caps at ~25px when dragging far in wrong direction ✓
  - fast flick in wrong direction does NOT dismiss ✓
  - transform follows sqrt resistance curve during wrong-direction drag ✓
  - orphaned pointer move without pointer down is ignored ✓
  - right-click during drag triggers cancel and snaps back ✓

- Toast Stacking Drag Interactions (3 tests):
  - dragging stacked (non-front) toast works correctly ✓
  - drag one toast while another is entering does not cause glitches ✓
  - escape key during drag cancels drag and dismisses toast ✓

- Toast Timer Interactions (2 tests):
  - drag pauses auto-dismiss timer and resumes on cancel ✓
  - multiple rapid hovers do not corrupt timer state ✓

- Toast Position Swipe Directions (1 test):
  - bottom-right position allows right swipe dismissal ✓

**Sub-agent Test Critique**
Spawned sub-agent to critique test coverage. Key gaps identified and addressed:
- Direction lock mechanism (fixed + tested)
- Resistance physics boundary (tested)
- Orphaned pointer moves (tested)
- Pointer cancel handling (tested)
- Stacking + drag interactions (tested)
- Timer pause/resume during gestures (tested)

**Additional Fix: Pointer Capture Release**
- Added explicit `releasePointerCapture()` calls in `handlePointerUp` and `handlePointerCancel`
- While browsers auto-release on pointer end, explicit release is safer practice

**Final Test Summary:**
- 36 tests in Toast.test.tsx
- 13 tests in ToastMultiple.test.tsx
- 49 total tests covering gestures, stacking, timing, edge cases

---

## Notes

- Study Sheet's `SheetImplementationCustom.tsx` for animation driver integration pattern
- Study Sheet's `helpers.tsx` for resistance physics
- Study Button for `unstyled` variant + context pattern
- Study Drawer for gesture handling patterns
- Current v2-toast has good foundation - enhance rather than rewrite
- PanResponder for RN, pointer events for web (already done)
