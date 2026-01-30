# Motion Driver Tooltip Position Jump Bug

## Problem Summary

When using `animatePosition` with a shared tooltip (scope pattern) in the motion driver, rapidly moving between triggers causes the tooltip to JUMP to a wrong position (often far left or near origin) before animating back.

## Reproduction Pattern

1. Hover on rightmost button (HIRE US), wait ~1 second for tooltip to fully appear
2. Move mouse FAST to the left, briefly hitting the middle button (BENTO)
3. Within ~33ms (1 frame at 30fps), continue to the leftmost button (TAKEOUT)
4. The tooltip JUMPS to wrong position then animates back

## Video Analysis (CleanShot 2026-01-22 at 22.46.02.mp4)

- **Frame rate**: 30fps (~33ms per frame)
- **Frame 50**: User leaves the left button (TAKEOUT), moving right
- **Frame 56**: Tooltip correctly positioned below middle button (COPY-PASTE UI / BENTO), shows "Bento — Free + paid pre-made UI"
- **Frame 57**: **THE JUMP** - Tooltip jumps to wrong position overlapping the buttons, text changes to "Takeout — universal RN starter kit"
- **Jump characteristics**: ~100px UP in Y, shifted left in X, happens in exactly 1 frame

## Timing Constraints

- Total movement time: ~50-150ms for the bug to trigger
- Key factor: Brief hover on middle button (~33ms) then immediately to left button
- The bug seems to occur when animation is interrupted mid-flight by rapid position changes

## Affected Code

- `/code/core/animations-motion/src/createAnimations.tsx` - Motion driver implementation
- `/code/ui/popper/src/Popper.tsx` - PopperContent handles position with floating-ui
- `flushAnimation()` - handles animation updates
- `getDiff()` - computes what properties changed

## Files for Reproduction

- `/code/tamagui.dev/features/site/home/PromoLinksRow.tsx` - Original component with the bug
- `/code/kitchen-sink/src/usecases/TooltipPositionJumpCase.tsx` - Test case
- `/code/kitchen-sink/scripts/repro-tooltip-jump.ts` - Playwright reproduction script

## Jump Detection Criteria

- dx > 300px or dy > 300px in a single frame
- Jump from reasonable position (x > 100, y > 100) to near origin (x < 50 or y < 50)

## Previous Fix Attempts

1. Parsed matrix transform to find X/Y - broke other animations (immediate movement instead of animated)
2. Issue: Hard to distinguish between legitimate position changes and bug jumps

## Hypothesis

The motion driver's animation state gets out of sync when:

1. Animation A starts (moving to middle button position)
2. Before A completes, animation B starts (moving to left button position)
3. The animation system calculates diff from wrong base position (possibly 0,0 or stale value)
4. Result: Large jump because diff is computed against wrong starting point

## Testing Notes

- Bug is **motion-driver specific** - other drivers (css, native, reanimated) may not have this issue
- Run kitchen-sink on port 9000: `yarn start:web`
- Run tamagui.dev on port 8282: `yarn dev --port 8282` (v2 branch)
- Animation driver can be changed via URL param or config

## Playwright Reproduction Results (SUCCESS!)

Script: `/code/kitchen-sink/scripts/repro-tooltip-jump.ts`

**Attempt 2 detected 2 jumps:**

1. `(0,-4) -> (609,162)` delta:(609,166) - Tooltip appearing (expected, from initial position)
2. `(609,166) -> (106,36)` delta:(503,130) - **THE BUG!** Jump from correct position to near-origin

The second jump is the bug - tooltip goes from reasonable position (609,166) to near-origin (106,36) in one frame.

## Analysis So Far

### The Jump Pattern

- Consistent reproduction: `(609,166) -> (~127-195, ~42-65)`
- Jump goes TO LEFT and UP (toward origin direction)
- Target X (~127-195) is LESS than leftmost button X (393)
- This suggests animation is computing from WRONG starting position

### Code Flow

1. `flushAnimation()` is called when position changes
2. `getDiff()` computes changed properties (e.g., `{ x: newValue }`)
3. `animate(scope.current, diff, animationOptions)` animates element
4. Motion library reads current transform and animates TO the diff target

### Hypothesis: Transform State Corruption

When rapidly changing triggers:

1. Animation A starts: x 609 → 537 (HIRE → BENTO)
2. Before A completes, Animation B starts: x → 393 (to TAKEOUT)
3. Motion reads current transform which may be in corrupted/transitional state
4. Animation animates from wrong value causing visual jump

### Attempted Fixes

1. `controls.current.complete()` before new animation - didn't help (bundled server issue)
2. Need to verify fix actually reaches browser

### Debugging Challenge

- tamagui.dev on 8282 uses bundled code, doesn't pick up local changes
- kitchen-sink on 9000 doesn't trigger tooltips in headless mode
- Need to either fix bundling or find different test approach

## Key Discovery - Transform Jump Pattern

From Playwright reproduction, the transform jumps like this:

```
Before: matrix(1, 0, 0, 1, 609, 166)
After:  matrix(1, 0, 0, 1, 128, 43)
```

This happens in ONE FRAME, not animated. The motion library's `animate()` is supposed to animate from the current position to the target, but it's snapping instantly.

## Root Cause Analysis

The jump happens when:

1. Animation A is running (tooltip moving from trigger 1 to trigger 2)
2. Animation B starts immediately (tooltip should move from trigger 2 to trigger 3)
3. Motion's animate() gets called with just the DIFF (new target values)
4. BUT the animation starts from the WRONG position (possibly 0,0 or stale value)

Potential causes:

1. Motion library reads stale transform when animation is in flight
2. Something clears/resets the element's transform before motion reads it
3. The `controls.current.stop()` or animation interruption isn't working correctly
4. Race condition between animation frames and new animation start

## Files Involved

- `/code/core/animations-motion/src/createAnimations.tsx` - Motion driver
  - `flushAnimation()` - Called when position changes
  - `getDiff()` - Calculates what properties changed
  - `animate(scope.current, diff, animationOptions)` - Starts animation

- `/code/ui/popper/src/Popper.tsx` - PopperContent
  - `animatePosition` prop enables x/y animation
  - Passes x/y from floating-ui to the animated element

## TODO

- [x] Reliably reproduce with Playwright script (1 iteration = 1 jump)
- [ ] Verify other drivers don't have this issue
- [x] Add debug logging to trace values during jump
- [x] Test with `controls.current.stop()` before new animation (implemented)
- [ ] Consider using motion's `useMotionValue` for x/y instead of animate()
- [ ] Fix without breaking normal animations
- [ ] **FINAL STEP**: Create standalone reproduction repo and open PR on https://github.com/motiondivision/motion (n8 knows matt the author, highly responsive to thorough repros)

## FINAL FIX (in createAnimations.tsx)

The fix handles position animation interruptions by:

1. Detecting when a transform with translate is changing
2. Reading the current animated position BEFORE calling stop() (important - stop() resets it!)
3. Using keyframes to explicitly animate FROM current position TO target

```typescript
const hasTransformWithTranslate =
  typeof diff.transform === 'string' && diff.transform.includes('translate')

if (hasTransformWithTranslate && controls.current) {
  // IMPORTANT: Read transform BEFORE stopping - stop() may reset it!
  const computedStyle = getComputedStyle(node)
  const currentTransform = computedStyle.transform

  controls.current.stop()

  // set transform to captured value to prevent flicker
  node.style.transform = currentTransform
  node.offsetHeight // force reflow

  if (currentTransform && currentTransform !== 'none') {
    // extract current position from matrix(1, 0, 0, 1, tx, ty)
    const matrixMatch = currentTransform.match(
      /matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),\s*([^)]+)\)/
    )
    if (matrixMatch) {
      const currentX = parseFloat(matrixMatch[1])
      const currentY = parseFloat(matrixMatch[2])

      // build start transform from current animated position
      const startTransform = `translateX(${currentX}px) translateY(${currentY}px)`
      const targetTransform = diff.transform as string

      // use keyframes to animate from current position to target
      const keyframeDiff = { ...diff }
      keyframeDiff.transform = [startTransform, targetTransform]

      controls.current = animate(scope.current, keyframeDiff, animationOptions)
      return
    }
  }
}
```

## Key Insights

1. **Tamagui converts x/y props to CSS transform**: When you use `x={100}`, Tamagui converts it to `transform: translateX(100px)` before passing to the motion driver.

2. **motion's stop() resets the transform**: When you call `controls.current.stop()`, the element's transform may reset to `matrix(1, 0, 0, 1, 0, 0)`. You MUST read the current position BEFORE calling stop().

3. **Keyframes work for smooth interruption**: By using `transform: [startTransform, targetTransform]` as keyframes, motion knows exactly where to start from and animate to, preventing jumps.

## Motion Version

- Upgraded to motion 12.29.0 (from 12.28.1) on 2026-01-22
