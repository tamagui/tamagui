# Toast v2 Implementation Plan

## Overview

Revamp @tamagui/toast to v2, inspired by Sonner's excellent UX. Must be fully cross-platform using Tamagui's animation system - NO CSS cheats.

## Reference Implementations

- ~/github/sonner - primary inspiration
- ~/github/base-ui - additional patterns
- @tamagui/sheet - gesture/drag patterns, resistive pull

---

## Current Session Issues Found & Fixes

### BUGS FOUND (need fixing)

1. **Top position toasts outside frame** ✅ FIXED
   - Issue: Toasts with top position were rendering outside the container
   - Fix: Changed from hardcoded `bottom: 0` to dynamic `{...(isTop ? { top: 0 } : { bottom: 0 })}`

2. **Action buttons overlapping** ✅ FIXED
   - Issue: Cancel/Confirm buttons used ToastCloseButton (20x20px fixed) causing overlap
   - Fix: Created new ToastActionButton component with proper padding for text buttons

3. **Hover stack → leave → rest fly away, one stays** ✅ FIXED
   - Issue: When hovering stacked toasts then leaving, most toasts dismiss but one stays longer
   - Cause: pauseTimer was being called multiple times, double-counting elapsed time
   - Fix: Added `lastPauseTimeRef` guard (Sonner pattern) - only calculate elapsed time if timer was started after last pause

4. **Exit animations fly too far** ✅ FIXED
   - Issue: Toasts flew 100px on exit, too dramatic
   - Fix: Reduced to 30px for swipe, 10px for normal exit

5. **Focus outline shows on click** ✅ FIXED
   - Issue: Focus ring appeared on mouse click, should only show on keyboard
   - Fix: Changed `focusStyle` to `focusVisibleStyle`

6. **Expanded state showed ALL toasts** ✅ FIXED
   - Issue: When expanded, ALL toasts showed instead of respecting visibleToasts limit
   - Sonner behavior: visibleToasts limit applies in BOTH collapsed and expanded states
   - Fix: Changed opacity logic to hide toasts beyond visibleToasts in both states
   - Also added `pointerEvents: 'none'` for hidden toasts

### CHANGES MADE THIS SESSION

1. **visibleToasts default: 3 → 4**
2. **Fade out last visible toast** - opacity 0.5 for toast at visibleToasts-1 index
3. **Top position anchor** - dynamic top/bottom based on position
4. **ToastActionButton component** - proper text button for action/cancel
5. **Subtle exit animations** - 10px/30px instead of 100px
6. **focusVisibleStyle** - outline only on keyboard navigation

### DESIGN DECISIONS (user feedback)

1. **Keep styles minimal in core** - demo can add more styles
2. **No sonnerStyle close button** - keep it simple, inline close button is fine
3. **Use animateOnly={['transform', 'opacity']}** in examples for performance
4. **Export .Close component** - like Dialog, just wraps events without styling

---

## Style Checklist

### Container (Toaster)

- [x] position: fixed (web) / absolute (native)
- [x] z-index: 100000+ (very high)
- [x] width: 356px (TOAST_WIDTH constant)
- [x] Viewport offsets: 24px desktop
- [x] pointerEvents: 'box-none' for pass-through

### Position Variants

- [x] bottom-right: bottom + right offsets
- [x] bottom-left: bottom + left offsets
- [x] bottom-center: bottom + left 50% + translateX(-50%)
- [x] top-right: top + right offsets ✅ FIXED anchor
- [x] top-left: top + left offsets ✅ FIXED anchor
- [x] top-center: top + left 50% + translateX(-50%) ✅ FIXED anchor

### Toast Item Frame

- [x] position: absolute (within container)
- [x] left: 0, right: 0 (full width of container)
- [x] **Dynamic anchor: top:0 for top positions, bottom:0 for bottom positions** ✅ FIXED
- [x] background: $background
- [x] border-radius: $4 (8px)
- [x] paddingHorizontal: $4, paddingVertical: $3
- [x] border: 1px solid $borderColor
- [x] elevation: $4 + shadow for depth
- [x] focusable: true
- [x] **focusVisibleStyle instead of focusStyle** ✅ FIXED

### Toast Content Layout

- [x] flex row with icon, content, close button
- [x] icon: 16x16px, flex-shrink: 0
- [x] content: flex column, gap $1
- [x] title: fontWeight 600, $color, size $4
- [x] description: $color11, size $2
- [x] gap: $3 between elements

### Close Button

- [x] positioned inline (user decided against absolute overlap)
- [x] 20x20px circle
- [x] borderRadius: $10 (circular)
- [x] backgroundColor: $color5
- [x] hoverStyle: $color6
- [x] pressStyle: $color7

### Action Buttons ✅ FIXED

- [x] **New ToastActionButton component** with proper sizing
- [x] borderRadius: $2
- [x] paddingHorizontal: $2
- [x] height: 24px
- [x] primary variant for action button (dark bg, light text)
- [x] marginTop: $3 spacing
- [x] gap: $2 between buttons
- [x] justifyContent: flex-end

### Rich Colors (Type Variants)

- [x] success: $green2 background, $green6 border
- [x] error: $red2 background, $red6 border
- [x] warning: $yellow2 background, $yellow6 border
- [x] info: $blue2 background, $blue6 border
- [x] loading: default (neutral)

### Icons

- [x] success: ✓ in $green10
- [x] error: ✕ in $red10
- [x] warning: ⚠ in $yellow10
- [x] info: ℹ in $blue10
- [x] loading: ⟳ in $color11
- [x] close: ✕ in $color11

---

## Feature Checklist

### Core Toast API

- [x] toast() - basic toast
- [x] toast.success() - success type
- [x] toast.error() - error type
- [x] toast.warning() - warning type
- [x] toast.info() - info type
- [x] toast.loading() - loading type (no auto-dismiss)
- [x] toast.promise() - promise with loading/success/error states
- [x] toast.custom() - custom JSX
- [x] toast.dismiss(id) - dismiss specific toast
- [x] toast.dismiss() - dismiss all

### Toast Options

- [x] id - custom id for updating
- [x] title - main text (string or function)
- [x] description - secondary text (string or function)
- [x] duration - auto-dismiss time (default 4000ms)
- [x] icon - custom icon
- [x] action - action button with label/onClick
- [x] cancel - cancel button
- [x] dismissible - can be dismissed (default true)
- [x] onDismiss - callback when dismissed
- [x] onAutoClose - callback when auto-closed
- [x] closeButton - per-toast close button override

### Toaster Props

- [x] position - 6 positions
- [x] expand - always show expanded
- [x] **visibleToasts - max visible (default 4)** ✅ CHANGED from 3
- [x] gap - space between toasts (default 14px)
- [x] duration - default duration (4000ms)
- [x] offset - viewport padding (24px)
- [x] hotkey - keyboard shortcut (alt+T)
- [x] swipeDirection - dismiss direction ('right')
- [x] swipeThreshold - swipe distance (50px)
- [x] closeButton - show close buttons
- [x] richColors - colored backgrounds
- [x] icons - custom icons per type
- [x] theme - light/dark/system

### Stacking Behavior

- [x] Only show visibleToasts (default 4)
- [x] Scale down non-front toasts: `1 - (index * 0.05)`
- [x] Y-offset for collapsed stack: 10px per toast
- [x] Expanded state shows full offset with gaps
- [x] Front toast height applied to hidden toasts
- [x] z-index: `visibleToasts - index` (front highest)
- [x] transformOrigin: 'bottom center' for bottom, 'top center' for top
- [x] **Fade out last visible toast (opacity 0.5)** ✅ NEW

### Hover Expand ✅ COMPLETE

- [x] Expand on hover (onMouseEnter + onMouseMove)
- [x] Pause timers when expanded/hovered
- [x] Resume timers when mouse leaves
- [x] **Gap filler View to prevent flicker when mouse moves between toasts**
- [x] Collapse when only 1 toast remains
- [x] interacting state tracks pointer down/up
- [x] **Timer sync issue when leaving hover** ✅ FIXED with lastPauseTimeRef guard

### Swipe to Dismiss ✅ COMPLETE

- [x] Pointer event tracking (setPointerCapture)
- [x] Direction lock on first significant movement
- [x] Threshold-based dismiss (50px default)
- [x] Velocity-based dismiss (0.11 px/ms)
- [x] **Resistive pull in wrong direction (sqrt curve from Sheet)**
- [x] Exit animation in swipe direction
- [x] Snap back on cancel

### Enter/Exit Animations ✅ REFINED

- [x] enterStyle: opacity 0, y: ±10, scale: 0.95 (subtle)
- [x] exitStyle: opacity 0, x/y: ±30 for swipe, ±10 for normal, scale: 0.95
- [x] AnimatePresence for mount/unmount
- [x] transition: 'quick' (Tamagui animation)
- [x] Disable animation while dragging

### Keyboard Support

- [x] Escape to dismiss focused toast
- [x] Hotkey to expand toaster (alt+T)
- [x] Focus management (tabIndex, lastFocusedElementRef)

### Accessibility

- [x] role="status"
- [x] aria-live="polite"
- [x] aria-atomic
- [x] aria-label on container
- [x] tabIndex for focusable
- [x] aria-label="Close toast" on close button

---

## Test Checklist

### Basic Toast Tests ✅

- [x] shows a default toast
- [x] shows typed toasts (success, error, warning, info)
- [x] shows loading toast
- [x] shows multiple stacked toasts

### Interaction Tests ✅

- [x] dismisses all toasts
- [x] closes toast when clicking close button
- [x] keyboard escape dismisses focused toast
- [x] shows action button

### Promise Tests ✅

- [x] promise toast transitions loading -> success
- [x] promise toast shows error on rejection

### Position Tests ✅

- [x] changes position when clicking position buttons
- [x] all 6 positions verified with screenshots

### Hover Tests ✅

- [x] hover expands stacked toasts
- [x] hover pauses auto-dismiss timer
- [x] mouse leave collapses stack
- [x] **no flicker when mouse moves between toasts**

### Swipe Tests ✅

- [x] swipe right dismisses (default)
- [x] swipe threshold works
- [x] velocity-based dismiss
- [x] resistive pull in wrong direction
- [x] swipe cancel snaps back

### Interrupt Tests ✅ NEW

- [x] toast closing does not interrupt on mouse re-entry
- [x] drag gesture moves toast visually
- [x] fast swipe dismisses via velocity

---

## TODO - Remaining Work (DEADLINE: 9:00 AM DEMO VIDEO)

### TIMELINE

- **NOW - 8:20**: Fix top position bug, verify tests pass
- **8:20 - 8:35**: Write clean ToastDemo, verify on tamagui.dev /ui/toast (mobile + safe areas)
- **8:35 - 8:45**: Update docs, update version-two blog post
- **8:45 - 8:55**: Full yarn test, lint, typecheck, sub-agent review
- **8:55 - 9:00**: Clean commit, push to CI, /alert user

### CRITICAL - Before 8:20

1. [x] **Fix timer sync bug** ✅ DONE - added lastPauseTimeRef guard
2. [x] **FIX: Top position toast outside viewport** ✅ FIXED - explicitly set top/bottom to avoid conflicts
3. [x] Test action buttons after ToastActionButton fix ✅ VERIFIED - buttons render correctly

### Before 8:35 (Demo Ready)

4. [x] Write clean ToastDemo for tamagui.dev ✅ DONE - code/demos/src/ToastDemo.tsx
5. [x] Verify on yarn dev site at /ui/toast ✅ VERIFIED - page renders, toast works
6. [x] Mobile web + safe areas check (SSR safe!) ✅ FIXED - use-window-dimensions isClient guard
7. [ ] Web-only code but use conditionals for future native support

### Before 8:45 (Docs + Blog)

8. [ ] Update Toast docs - clean up (2.0.0.mdx exists but has old API docs)
9. [ ] Update version-two blog post with Toast feature/demo hero

### Before 8:55 (Testing + Review)

10. [x] yarn test - 31 toast tests passing ✅
11. [x] yarn lint, yarn typecheck ✅ - fixed biome issues, types clean
12. [ ] Sub-agent code review

### Before 9:00 (Ship It)

13. [ ] Clean commit and push to CI
14. [ ] /alert user every 30s until acknowledged

### Low Priority (Post-Demo)

- [ ] Export .Close component (Dialog pattern)
- [ ] Add animateOnly={['transform', 'opacity']} to examples
- [ ] All animation drivers tested
- [ ] SVG icons instead of text characters
- [ ] RTL support

---

## Key Formulas (from Sonner)

### Stack Scale

```
scale = 1 - (index * 0.05)
// index 0: 1.0, index 1: 0.95, index 2: 0.90
```

### Collapsed Y Offset

```
// For bottom position
stackY = isFront ? 0 : -peekAmount * index
// For top position
stackY = isFront ? 0 : peekAmount * index
```

### Expanded Y Offset

```
offset = (heightIndex * gap) + toastsHeightBefore
// For bottom: -offset
// For top: +offset
```

### Resistive Pull (from Sheet)

```typescript
function resisted(delta: number, maxResist = 25): number {
  if (delta >= 0) return delta
  const pastBoundary = Math.abs(delta)
  const resistedDistance = Math.sqrt(pastBoundary) * 2
  return -Math.min(resistedDistance, maxResist)
}
```

### Velocity Threshold

```
VELOCITY_THRESHOLD = 0.11 // px/ms
shouldDismiss = passedThreshold || velocity > VELOCITY_THRESHOLD
```

### Gap Filler (prevents hover flicker)

```typescript
// Invisible hit area above/below toast when expanded
const gapFillerHeight = expanded ? gap + 1 : 0
<View
  position="absolute"
  left={0}
  right={0}
  height={gapFillerHeight}
  pointerEvents="auto"
  {...(isTop ? { top: '100%' } : { bottom: '100%' })}
/>
```

### Opacity Fade for Limit

```typescript
// Fade out toasts as they approach visibility limit
let computedOpacity = 1
if (!expanded) {
  if (index >= visibleToasts) {
    computedOpacity = 0 // completely hidden beyond limit
  } else if (index === visibleToasts - 1) {
    computedOpacity = 0.5 // last visible toast fades
  }
}
```

---

## Files Modified

1. `/code/ui/toast/src/Toaster.tsx`
   - Container positioning with minHeight: 1
   - onMouseEnter + onMouseMove for hover expand
   - Auto-collapse when 1 toast remains
   - **visibleToasts default: 4**

2. `/code/ui/toast/src/ToastItem.tsx`
   - Stacking logic (scale, y, z-index, height, transformOrigin)
   - Gap filler View for hover flicker prevention
   - dataSet for RN Web data attribute compatibility
   - Enter/exit styles with AnimatePresence
   - **Dynamic top/bottom anchor based on position**
   - **ToastActionButton component for action/cancel**
   - **focusVisibleStyle for keyboard-only focus**
   - **Subtle exit animations (10px/30px)**
   - **Opacity fade for limit**

3. `/code/ui/toast/src/useDragGesture.ts`
   - Resistive pull with sqrt curve (Sheet pattern)
   - Direction lock on first movement
   - Velocity-based dismiss

4. `/code/kitchen-sink/tests/ToastMultiple.test.tsx`
   - Loading toast test fix (text selector vs data-type)

5. `/code/kitchen-sink/tests/ToastHover.test.tsx` - NEW
   - Hover expand tests
   - Flicker prevention tests
   - Timer pause tests

6. `/code/kitchen-sink/tests/ToastVisual.test.tsx` - NEW
   - Visual verification tests
   - Swipe tests

7. `/code/kitchen-sink/tests/ToastInterrupt.test.tsx` - NEW
   - Interrupt behavior tests
   - Drag gesture tests
   - Velocity dismiss tests

---

## Test Results Summary

**Total: 25 tests passing**

- Toast.test.tsx: 3 tests (focus management)
- ToastMultiple.test.tsx: 12 tests (core API)
- ToastHover.test.tsx: 3 tests (hover behavior)
- ToastVisual.test.tsx: 4 tests (swipe, visual)
- ToastInterrupt.test.tsx: 3 tests (interrupt, drag, velocity)

All tests pass with CSS animation driver.
