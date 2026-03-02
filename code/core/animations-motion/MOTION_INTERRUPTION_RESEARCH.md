# Motion.dev WAAPI Mid-Flight Interruption Research

**Research date:** 2026-03-01
**Motion repo:** `~/github/motion` at commit `8f6ad46d8` (v12.29.2)
**Tamagui animations-motion:** v2.0.0-rc.21, depends on `motion ^12.34.2`

---

## Executive Summary

**Motion.dev DOES handle WAAPI mid-flight interruption natively** — and has done so since `framer-motion@11.0.17` (released 2024-03-20). The mechanism is deeply baked into the library's architecture. The Tamagui workaround in `createAnimations.tsx` (lines 333–405) is redundant for standard WAAPI-accelerated properties (`opacity`, `transform`, `clipPath`, `filter`), and **partially incorrect** in its reasoning: it manually does `commitStyles()` + `cancel()` + constructs a keyframe array, which is exactly what motion already does internally — but motion's version also correctly samples velocity for smooth spring continuation.

---

## 1. How Motion Handles Interruption: The Complete Code Path

### Step 1: `animate(element, diff, options)` is called

Tamagui calls `animate(scope.current, fixedDiff, animationOptions)` in `flushAnimation()`. This goes through:

```
createScopedAnimate() -> scopedAnimate() -> animateSubject() -> animateTarget()
```

(`packages/framer-motion/src/animation/animate/index.ts` and `subject.ts`)

### Step 2: `animateTarget()` calls `value.start()` for each property

In `packages/motion-dom/src/animation/interfaces/visual-element-target.ts`, for each CSS property being animated, it gets (or creates) a `MotionValue` and calls:

```ts
value.start(animateMotionValue(key, value, valueTarget, valueTransition, visualElement, isHandoff))
```

### Step 3: `MotionValue.start()` always stops the previous animation first

In `packages/motion-dom/src/value/index.ts` (lines 421–436):

```ts
start(startAnimation: StartAnimation) {
    this.stop()   // <-- stops the running animation BEFORE starting the new one
    // ...
    this.animation = startAnimation(resolve)
}
```

`this.stop()` calls `animation.stop()` on whatever `AsyncMotionValueAnimation` (or `NativeAnimationExtended`) is currently running.

### Step 4: `NativeAnimation.stop()` commits styles before cancelling

In `packages/motion-dom/src/animation/NativeAnimation.ts` (lines 150–166):

```ts
stop() {
    if (this.isStopped) return
    this.isStopped = true
    const { state } = this

    if (state === "idle" || state === "finished") {
        return
    }

    if (this.updateMotionValue) {
        this.updateMotionValue()  // <-- NativeAnimationExtended overrides this
    } else {
        this.commitStyles()       // <-- commits mid-flight values to inline style
    }

    if (!this.isPseudoElement) this.cancel()
}
```

The comment in the source code (lines 167–178) is explicit:

```ts
/**
 * WAAPI doesn't natively have any interruption capabilities.
 *
 * In this method, we commit styles back to the DOM before cancelling
 * the animation.
 *
 * This is designed to be overridden by NativeAnimationExtended, which
 * will create a renderless JS animation and sample it twice to calculate
 * its current value, "previous" value, and therefore allow
 * Motion to also correctly calculate velocity for any subsequent animation
 * while deferring the commit until the next animation frame.
 */
protected commitStyles() {
    if (!this.isPseudoElement) {
        this.animation.commitStyles?.()
    }
}
```

### Step 5: `NativeAnimationExtended.updateMotionValue()` does the smart sampling

`NativeAnimationExtended` (in `packages/motion-dom/src/animation/NativeAnimationExtended.ts`) **overrides** `updateMotionValue()`. Instead of just calling `commitStyles()`, it:

1. Creates a **renderless** `JSAnimation` with the same animation parameters (keyframes, easing, duration, type, etc.)
2. Samples the JS animation at the current wall-clock elapsed time **twice** (at `sampleTime - delta` and `sampleTime`)
3. Calls `motionValue.setWithVelocity(prev, current, delta)` — this sets the MotionValue to the current animated value AND encodes velocity from the two samples
4. The MotionValue now has the correct mid-flight position AND correct velocity

```ts
updateMotionValue(value?: T) {
    const { motionValue, onUpdate, onComplete, element, ...options } = this.options

    if (!motionValue) return

    if (value !== undefined) {
        motionValue.set(value)
        return
    }

    const sampleAnimation = new JSAnimation({
        ...options,
        autoplay: false,
    })

    const sampleTime = Math.max(sampleDelta, time.now() - this.startTime)
    const delta = clamp(0, sampleDelta, sampleTime - sampleDelta)

    motionValue.setWithVelocity(
        sampleAnimation.sample(Math.max(0, sampleTime - delta)).value,
        sampleAnimation.sample(sampleTime).value,
        delta
    )

    sampleAnimation.stop()
}
```

### Step 6: The new animation starts from the current mid-flight position

Back in `animateMotionValue()` (`packages/motion-dom/src/animation/interfaces/motion-value.ts`):

```ts
const options: ValueAnimationOptions = {
    keyframes: Array.isArray(target) ? target : [null, target],  // null = "read current"
    velocity: value.getVelocity(),   // <-- uses the velocity set by setWithVelocity()
    // ...
}
```

Then `KeyframesResolver.readKeyframes()` resolves the `null` first keyframe:

```ts
if (unresolvedKeyframes[0] === null) {
    const currentValue = motionValue?.get()   // <-- reads the mid-flight committed value
    if (currentValue !== undefined) {
        unresolvedKeyframes[0] = currentValue
    }
    // ...
}
```

So the new animation runs `[currentMidFlightValue, ..., targetValue]` with the correct velocity, giving smooth spring continuation.

---

## 2. Specific Commits for Interruption Handling

| Version | Date | What was fixed |
|---------|------|----------------|
| `framer-motion@8.1.8` | 2023-01-05 | Sampling of animations with delay/repeat settings when interrupting WAAPI animations |
| `framer-motion@11.0.2` | 2024-01-23 | Fixed velocity calculations when interrupting WAAPI animations |
| `framer-motion@11.0.17` | 2024-03-20 | **"Interruption of WAAPI animations now animates from correct value"** — PR #2575 `fix/waapi-interrupt` |
| `framer-motion@11.0.21` | 2024-03-26 | Fixed interrupting WAAPI **spring** animations specifically (needed to preserve `type`, `ease`, `times` in the resolved object for correct sampling) — commit `db77156de` |
| `motion@12.24.11` | 2026-01-07 | Fixed transform animation **jumping under CPU load** when rapidly interrupting — added `startedAt` wall-clock timestamp to `NativeAnimationExtended`, uses `time.now()` instead of WAAPI's `currentTime` for sampling — commit `b6841817b` (Claude-generated) |

The key PR that established the core fix is `#2575` (merged as commit `3c45b2f79`). The code was later refactored from `AcceleratedAnimation.ts` in framer-motion to the `NativeAnimation`/`NativeAnimationExtended` split in `motion-dom`.

---

## 3. What the Tamagui Workaround Does (and Why It's Redundant)

The workaround in `createAnimations.tsx` lines 333–405:

```ts
// WAAPI mid-flight transform interruption workaround
// [extensive comment explaining the problem and fix]

if (isRunning && refs.current.controls && fixedDiff.transform && (isPopperElement || isEnteringPresenceChild)) {
    const anims = (refs.current.controls as any).animations
    if (anims) {
        for (const anim of anims) {
            try {
                const raw = anim?.animation ?? anim
                raw?.commitStyles?.()  // manually commits styles
            } catch {}
        }
    }
    refs.current.controls.cancel()          // cancels the old animation
    const committedTransform = node.style.transform  // reads committed value
    if (committedTransform) {
        fixedDiff.transform = [committedTransform, fixedDiff.transform]  // builds keyframe array
    }
}
```

**This is doing manually what motion already does internally when `animate()` is called on an element that has a running motion-driven animation.** The issue is:

1. The workaround reads the committed style from `node.style.transform` after `commitStyles()` — this gets the CSS string representation, which may differ from what motion's MotionValue tracks internally
2. It constructs a keyframe array `[committedValue, targetValue]` — motion's resolver does this automatically when `null` is the first keyframe
3. It does NOT sample velocity, so spring animations lose their velocity on interruption — motion's `NativeAnimationExtended.updateMotionValue()` correctly captures velocity via double-sampling

**Why the workaround comment says motion doesn't handle this:**

The comment was written when the workaround was introduced. At that time, motion's handling may have been insufficient for the **specific Tamagui usage pattern**: Tamagui calls `animate(htmlElement, {transform: ...}, options)` using `useAnimate()`'s scope rather than using `motion.div` with variant props. This path goes through `animateTarget` which uses per-property `MotionValue` objects tracked in the VisualElement's store.

The key question is: does the VisualElement persist across calls? If `createDOMVisualElement` is called on the same element on each `animate()` call, it reuses the same VisualElement (due to `visualElementStore` WeakMap check at line 137 of `subject.ts`). This means the MotionValues ARE persistent across animation calls, so motion's interruption handling DOES apply.

**Conclusion:** The workaround is redundant for motion >= 11.0.17 (or >= 11.0.21 for springs).

---

## 4. Important Caveat: The `useAnimate()` API Path

There is one subtlety specific to Tamagui's usage. Tamagui uses `useAnimate()` which returns a `scope` and calls `animate(scope.current, ...)`. When `scope.current` is an `HTMLElement`:

- `animateSubject()` calls `resolveSubjects()` to get the element
- Checks if a VisualElement exists in `visualElementStore` for this element
- If not, creates one via `createDOMVisualElement(element)`
- Then calls `animateTarget()` which iterates each property and calls `value.start()`

The `visualElementStore` is a WeakMap keyed by element, so the same VisualElement (and its per-property MotionValues) are reused across calls to `animate(element, ...)`. **This means motion's interruption mechanism does fully apply here.**

However, there is a timing subtlety: `AsyncMotionValueAnimation` resolves keyframes asynchronously (schedules to the next frame via `frame.read`). If `animate()` is called again before keyframes are resolved, the first animation's `keyframeResolver` is cancelled and the second animation takes over. In this case there is no mid-flight value to commit (the old animation never actually started WAAPI), so no jump occurs anyway.

---

## 5. The CPU-Load Fix (12.24.11+)

The commit `b6841817b` (January 7, 2026) specifically fixes the case where:
- The main thread is blocked (CPU load)
- WAAPI's `currentTime` lags behind real elapsed time
- When interruption sampling uses `currentTime`, it samples the wrong point in the animation
- The element appears to jump to an incorrect position

The fix adds `this.startedAt = time.now()` when the animation starts, then uses `time.now() - this.startedAt` (wall-clock elapsed time) instead of WAAPI's `currentTime` for the sampling calculation.

This was released in `motion@12.24.11`. The Tamagui package depends on `motion ^12.34.2`, which includes this fix.

---

## 6. Recommendation

### Should the workaround be removed?

**Yes, the workaround can be removed for the `transform` property case.** Motion handles this correctly for all WAAPI-accelerated values (`transform`, `opacity`, `clipPath`, `filter`) as long as:

1. `motion >= 11.0.21` is used (for spring type animations, needed the extra `type/ease/times` preservation in resolved object)
2. The element's VisualElement persists between calls (it does, via `visualElementStore`)

The current Tamagui package depends on `motion ^12.34.2`, which is well past both fix points.

### What motion does better than the workaround

Motion's native handling is superior to the Tamagui workaround in two key ways:

1. **Velocity preservation:** Motion's `NativeAnimationExtended.updateMotionValue()` double-samples the JS equivalent of the animation to calculate velocity, which gets passed as `velocity: value.getVelocity()` to the next animation. This enables smooth spring continuation that respects the current motion direction and speed. The Tamagui workaround does NOT preserve velocity.

2. **Value precision:** Motion reads the value from its internal MotionValue (which tracks the exact animated value) rather than parsing `node.style.transform` back from a CSS string. This avoids potential floating-point conversion issues.

### What to keep

The workaround's **Part 2** (persisting the final transform after animation completes) is a separate concern from interruption:

```ts
// part 2: persist final transform after animation completes
if (isPopperElement && !isCurrentlyExiting && fixedDiff.transform) {
    startedControls.finished.then(() => {
        if (node.isConnected) {
            node.style.transform = target
        }
    })
}
```

This addresses the WAAPI `fill: "both"` and the fact that when motion finishes a WAAPI animation, it calls `cancel()` and sets the final value via `setStyle()`. Verify this is still needed by checking if motion's `onfinish` handler in `NativeAnimation` already covers this case (it does call `setStyle(element, name, keyframe)` at line 112 of `NativeAnimation.ts`). **Part 2 may also be removable** if motion's `onfinish` handler correctly commits the final value.

### Migration path

To remove the workaround:
1. Delete lines 333–431 of `createAnimations.tsx` (the entire workaround block, both Part 1 and Part 2)
2. The `animate(scope.current, fixedDiff, animationOptions)` call remains as-is
3. Test with the existing animation tests: `TabHoverPositionSmooth.animated.test.tsx`, `TooltipPositionJump.animated.test.tsx`, `PopoverAnimatePosition.animated.test.tsx`, `PopoverHoverable.test.tsx`
4. Pay particular attention to rapid hover switching scenarios under CPU load (these were fixed in 12.24.11)

### Upstream fix needed?

No upstream fix is needed. Motion already handles this correctly. The mechanism is:
- `NativeAnimation.stop()` commits styles (via `commitStyles()`) or samples velocity (via `NativeAnimationExtended.updateMotionValue()`)
- `MotionValue.start()` always stops the current animation before starting the new one
- `KeyframesResolver.readKeyframes()` uses `motionValue.get()` as the starting keyframe when the first keyframe is `null`
- Velocity from `motionValue.getVelocity()` is passed to the new animation via `animateMotionValue()`

This complete chain ensures smooth mid-flight interruption with correct position AND velocity.

---

## 7. Relevant Files in motion-dom

- `packages/motion-dom/src/animation/NativeAnimation.ts` — base WAAPI wrapper, `stop()` with `commitStyles()`
- `packages/motion-dom/src/animation/NativeAnimationExtended.ts` — extended version with double-sampling for velocity
- `packages/motion-dom/src/animation/AsyncMotionValueAnimation.ts` — async wrapper that creates `NativeAnimationExtended` or `JSAnimation`
- `packages/motion-dom/src/value/index.ts` — `MotionValue.start()` which calls `this.stop()` before starting
- `packages/motion-dom/src/animation/interfaces/motion-value.ts` — `animateMotionValue()` which sets `velocity: value.getVelocity()` and uses `[null, target]` as keyframes
- `packages/motion-dom/src/animation/keyframes/KeyframesResolver.ts` — resolves `null` first keyframe from `motionValue.get()`
- `packages/motion-dom/src/animation/interfaces/visual-element-target.ts` — `animateTarget()` which iterates properties and calls `value.start()`
- `packages/framer-motion/src/animation/animate/subject.ts` — `animateSubject()` which routes to `animateTarget()` for DOM elements
