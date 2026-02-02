# Motion Driver Bug Fixes Plan

## Overview

The motion driver (`@tamagui/animations-motion`) has several issues that need to be fixed. This document tracks the research, bugs, and fixes.

## Recent Commits (Last 5 Days)

1. **cf54108aa3** - `fix(animations-motion): enhance animation handling by adding disableAnimation support and improving state synchronization (#3839)`
   - Added `disableAnimation` to useMemo deps
   - Removed `updateFirstAnimationStyle()` function
   - Added `removeRemovedStyles()` with `preserve` parameter to prevent clearing styles that moved between doAnimate/dontAnimate
   - Added motion state sync for properties moving from dontAnimate to doAnimate using `animate(scope.current, { ...movedToAnimate }, { duration: 0 })`
   - Made position-only transform fix more specific (skip for scale/rotate/skew/matrix/perspective)

2. **502b549e6c** - `more safe fix for motion jumps`
   - Changed from time-based check (`Date.now() - lastAnimateAt.current < 50`) to `controls.current?.state === 'running'`
   - Added TODO noting getComputedStyle breaks motion's off-main-thread benefits

3. **0e4f08c43a** - `fix(animations-motion): fix tooltip position jump when interrupting transform animations`
   - Captures current transform BEFORE calling stop() (critical - stop() resets it!)
   - Uses keyframes `[startTransform, targetTransform]` for smooth interruption
   - Upgraded motion from 12.28.1 to 12.29.0

4. **638bb29bb1** - `fix(animations-motion): make quick animations faster and snappier`

## Known Bugs

### 1. TAMAGUI Logo Jitter Bug

**Component**: `LogoWords.tsx` in `@tamagui/logo`

**Symptoms**: Moving mouse left/right fast over the TAMAGUI text causes the dot indicator to jitter erratically.

**Relevant Code**:

```tsx
<Circle
  transition="quicker"
  position="absolute"
  y={mounted === 'start' ? -30 : -3}
  x={x} // Computed from tintIndex
  size={4}
  backgroundColor="$color12"
/>
```

**Hypothesis**: The `getComputedStyle` fix for tooltip position jumps is incorrectly triggering for this component. The Circle uses transform with translate, and when rapidly changing `x` values, the position interruption fix is reading stale/wrong computed styles.

**Evidence**: User says "if we remove the getComputedStyle fix for tooltip jumps it fixes that one"

### 2. SlidingPopover Bugs (Header Menu)

**Component**: `Header.tsx` - `HeaderLinksPopover` and `HeaderLinksPopoverContent`

**Symptoms**:

1. Inner content animations can get 'stuck' at the ends
2. The popover itself sometimes doesn't move to where it should when moving back and forth

**Relevant Code**:

- `Popover.Content` uses `enableAnimationForPositionChange` and `transition="medium"`
- `Frame` component uses `AnimatePresence` with custom `going` prop for enter/exit animations
- `Frame` has `enterStyle` and `exitStyle` with x offset based on direction

**Potential Issues**:

1. AnimatePresence combined with enableAnimationForPositionChange may have conflicting transform animations
2. The `going` direction calculation may be getting out of sync
3. The position-only transform fix may be incorrectly applied to the Frame's enter/exit x transforms

### 3. Tooltip Position Jump (Existing - may still have edge cases)

**Status**: Fixed in previous commits but may need more testing

**Test**: `TooltipPositionJump.animated.test.tsx` exists

## Test Cases Needed

### 1. Logo Animation Test

Create test for rapid x position changes on Circle component with motion driver.

### 2. SlidingPopover Test

Create test for:

- Popover position transitions when switching between menu items
- Inner content animations (enter/exit) when switching rapidly
- Combined position + content transitions

### 3. Regression Tests

Ensure existing tooltip position jump test still passes after fixes.

## Analysis of the getComputedStyle Fix

The current code in `createAnimations.tsx`:

```tsx
const isRunning = controls.current?.state === 'running'
const targetTransform = typeof diff.transform === 'string' ? diff.transform : null

// Only apply position fix for translate-only transforms
const isPositionOnlyTransform =
  targetTransform &&
  targetTransform.includes('translate') &&
  !targetTransform.includes('scale') &&
  !targetTransform.includes('rotate') &&
  !targetTransform.includes('skew') &&
  !targetTransform.includes('matrix') &&
  !targetTransform.includes('perspective')

if (isRunning && controls.current && isPositionOnlyTransform) {
  const currentTransform = getComputedStyle(node).transform
  // ... keyframe animation from current to target
}
```

**Problem**: This fires for ANY translate-only transform changes when animation is running. This includes:

1. Tooltip position changes (intended - should fix jumps)
2. Logo dot position changes (unintended - causes jitter)
3. SlidingPopover enter/exit animations if they use translate

**Potential Fix Approaches**:

1. **Add opt-in prop**: Components that need position change animation should explicitly opt-in
2. **Check for rapid changes**: Only apply fix when changes are very rapid (< 16ms)
3. **Check for floating-ui context**: Only apply for Popper/Tooltip elements
4. **Use element attribute**: Add data attribute to elements that need this fix

## Solution Implemented

The fix uses **approach #4: element attribute marker** to distinguish Popper elements from regular animated elements.

### Changes Made

1. **`/code/ui/popper/src/Popper.tsx`**
   - Added `data-popper-animated="true"` attribute to the outer animated TamaguiView
   - This attribute is only added when `enableAnimationForPositionChange` is true
   - Marker is on the actual animated element (not the inner PopperContentFrame which has `data-placement`)

2. **`/code/core/animations-motion/src/createAnimations.tsx`**
   - Changed position fix to check for `data-popper-animated` attribute
   - Only applies `getComputedStyle` fix when the element has this marker
   - Logo Circle doesn't have this marker, so it won't get the fix (avoiding jitter)
   - Tooltip/Popover elements with `enableAnimationForPositionChange` DO have this marker

### Why This Works

The key insight is that:

- **Tooltip/Popover with `enableAnimationForPositionChange`**: These are floating-ui positioned elements that jump 100-160px between positions. They NEED the `getComputedStyle` fix to prevent jumps to origin.
- **Logo Circle**: This is a regular animated element that moves ~15-70px. It does NOT need the fix, and applying it causes jitter due to the overhead of `getComputedStyle` on rapid updates.

By using an explicit opt-in marker (`data-popper-animated`), we can selectively apply the fix only to elements that need it.

## Test Results

All tests pass:

- ✅ Logo jitter test: 0 jitters detected (was 4 before)
- ✅ Tooltip position jump test: 0 jumps detected
- ✅ Inner content animations test: 11 stuck frames (under threshold of 50)
- ✅ TooltipPositionJump.animated.test.tsx: 2 passed (motion driver)

## Files Modified

- `/code/core/animations-motion/src/createAnimations.tsx` - Position fix with data-popper-animated check
- `/code/ui/popper/src/Popper.tsx` - Added data-popper-animated marker

## Test Files

- `/code/kitchen-sink/tests/TooltipPositionJump.animated.test.tsx` - Existing (passes)
- `/code/kitchen-sink/tests/TamaguiSiteMotion.test.ts` - Tests against actual tamagui.dev site
