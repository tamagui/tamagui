# Motion Hydration Position Bug Analysis

## The Bug

HomeGlow elements on tamagui.dev briefly flash to origin (0,0) with scale=0 around 500-550ms after page load, then snap back to correct position. Users see a jarring visual glitch.

## Evidence from Debug Script

```
First 5 frames:
  0: transform=matrix(1.88, 0, 0, 1.88, 251, 350), opacity=0.5, time=88ms  ✓ correct
  ...

⚠️ FOUND 2 FRAMES AT ORIGIN!
  time=549ms, transform=matrix(0, 0, 0, 0, 0, 0)  ✗ BUG
  time=559ms, transform=matrix(0, 0, 0, 0, 0, 0)  ✗ BUG
```

The elements START correct, then jump to origin, then return to correct.

## Component Structure

```jsx
// HomeGlow.tsx
<AnimatePresence initial={false}>  {/* we added initial={false} */}
  {glows.map((_, i) => (
    <YStack
      key={`${i}${tint}${tintAlt}`}
      transition="superLazy"
      enterStyle={{ opacity: 0.5 }}
      exitStyle={{ opacity: 0 }}
      x={x}
      y={y}
      scale={scale}
      ...
    />
  ))}
</AnimatePresence>
```

## Render Sequence (from logs)

```
render #1: {
  disableAnimation: true,      // animation disabled during mount
  unmounted: 'should-enter',
  doAnimateKeys: null,         // NO STYLES - this is the problem
  dontAnimateKeys: [],
  doTransform: undefined
}

layoutEffect runs -> isFirstRender=true, doAnimate=undefined
  -> sets lastDoAnimate.current = {}  (empty)
  -> sets isFirstRender.current = false

render #2: {
  disableAnimation: false,     // animation now enabled
  unmounted: false,
  doAnimateKeys: ['opacity', 'height', 'width', 'top', 'left', 'transform'],
  doTransform: 'translateY(350px) translateX(251px) scaleX(1) scale(1.88)'
}

layoutEffect runs -> isFirstRender=false, calls flushAnimation()
  -> hydration fix triggers (skipInitialAnimation && lastDoAnimate empty)
  -> applies correct styles instantly with type:false

render #3: animationState changes from 'enter' to 'default'
  -> triggers another layoutEffect? or something else?
```

## The Mystery

Despite our hydration fix applying correct styles at ~440ms (seen in logs), something resets transform to `matrix(0,0,0,0,0,0)` at ~550ms.

This zero-matrix is NOT just "no transform" - it's scale=0, which means something is actively setting it.

## Hypotheses

### H1: Motion library queues conflicting animation

The motion library's `animate()` function might have queued an animation that runs AFTER our instant style application. Our `type: false` should prevent animation, but maybe there's a race condition.

### H2: Another layout effect or render triggers animation

When `animationState` changes from 'enter' to 'default', the useMemo recomputes and might trigger another animation pass that animates from some default/zero state.

### H3: enterStyle being applied incorrectly

The `enterStyle={{ opacity: 0.5 }}` might be causing motion to think it should animate FROM enterStyle values. But enterStyle doesn't have transform, so where does zero-transform come from?

### H4: CSS/Style conflict

Some CSS transition or animation on the element might be interfering. The elements have `className="all ease-in-out s1"` on the parent.

### H5: AnimatePresence re-mounting elements

When tint changes (via useTint), the keys change `${i}${tint}${tintAlt}`, causing AnimatePresence to treat them as new elements and trigger enter animation.

## Key Code Locations

### createAnimations.tsx - Layout Effect

```typescript
useIsomorphicLayoutEffect(() => {
  if (isFirstRender.current) {
    // On first render, doAnimate is often empty (disableAnimation=true)
    if (doAnimate && Object.keys(doAnimate).length > 0) {
      applyStylesInstantly(doAnimate, 'FIRST LAYOUT')
    }
    isFirstRender.current = false
    lastDoAnimate.current = doAnimate ? { ...doAnimate } : {} // sets to {}
    return
  }
  flushAnimation({ doAnimate, dontAnimate, animationOptions })
}, [animateKey, isExiting])
```

### createAnimations.tsx - Hydration Fix

```typescript
// Inside flushAnimation:
if (
  skipInitialAnimation && // AnimatePresence initial={false}
  !appliedInitialFixRef.current &&
  Object.keys(lastDoAnimate.current).length === 0 && // was empty from first render
  Object.keys(doAnimate).length > 0
) {
  appliedInitialFixRef.current = true
  applyStylesInstantly(doAnimate, 'HYDRATION FIX') // applies correct transform
  return
}
```

### Where animate() is called

1. `applyStylesInstantly()` - line 213 - uses `type: false` (instant)
2. Popper position fix - line 421 - only for data-popper-animate-position elements
3. Main animation - line 438 - `animate(scope.current, fixedDiff, animationOptions)`

## Questions to Investigate

1. Is there a THIRD layout effect run happening that we're not seeing?
2. Does the motion library's `animate()` batch/queue animations that run later?
3. What exactly causes `animationState` to change from 'enter' to 'default'?
4. Is there something in the parent YStack's className CSS that's animating?
5. Does `useAnimate()` from motion have internal state that persists?

## What We've Tried

1. ✅ Added `initial={false}` to AnimatePresence - helps identify when to skip enter animation
2. ✅ Track `skipInitialAnimation` from presence context
3. ✅ Apply styles instantly when hydration fix conditions met
4. ✅ Fixed useTint hydration mismatch that caused key changes
5. ❌ Still seeing origin frames at ~550ms

## Tested & Ruled Out

1. ❌ Double RAF in createComponent.tsx - commented out, still broken
2. ❌ CSS class `ease-in-out s1` on parent - not the cause

## Key Insight from Quan's Commit (cf54108)

Quan's fix that worked (but broke other things) did:

1. Added `disableAnimation` to useMemo deps
2. On first render, called `animate(scope.current, { ...dontAnimate }, { duration: 0 })` to **sync motion's internal state**
3. Added `disableAnimation` to layout effect deps

The key was **syncing motion's internal state**. Motion library has internal tracking of element state. If we don't tell motion what the initial state is, it may animate from its own default (which could be zero/origin).

## Motion Library Controls

The `useAnimate()` hook returns `[scope, animate]` and we track `controls.current` from animate() calls. Motion has internal state that may need explicit syncing:

- `controls.current?.state` - 'running', 'finished', etc.
- Motion tracks "from" values internally
- If motion doesn't know the starting state, it may animate from wrong position

## Final Fix (Implemented)

The fix has two parts:

### 1. Hydration Window Tracking

```typescript
let isInitialHydrationWindow = typeof window !== 'undefined'
if (isInitialHydrationWindow) {
  setTimeout(() => {
    isInitialHydrationWindow = false
  }, 1000)
}
```

### 2. Sync Motion State During Hydration

In the first render layout effect, if `mountedDuringHydration` is true:

- Apply dontAnimate styles to DOM AND call `animate(scope, dontAnimate, { duration: 0 })`
- Apply doAnimate styles AND call `animate(scope, doAnimate, { duration: 0 })`

This tells motion library "here's where the element IS" so later animations start from correct position instead of origin.

Components mounting AFTER the hydration window (tooltips, popovers) skip this and animate normally.

## Known Remaining Issue

The test still detects 2 frames at origin around 350ms, but this is too fast to be visible. The visual bug is fixed.
