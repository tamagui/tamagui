# WAAPI Mid-Flight Interruption Research

## The Bug

When using motion's `useAnimate()` and calling `animate(element, { transform: newValue })` while a previous WAAPI animation is still running, there's a visible one-frame jump to origin (0,0).

## Root Cause

Two issues in motion's `useAnimate()` path:

### 1. `DOMKeyframesResolver` is always async

`DOMKeyframesResolver` hardcodes `isAsync = true` in its constructor, deferring keyframe resolution to the next rAF frame even when no DOM measurement is needed. This creates a one-frame gap between cancelling the old WAAPI animation and starting the new one.

The `animateMini` path handles this correctly with a synchronous 3-step process (documented in `animate-elements.ts:52`): stop → read DOM → create animation. The full `animate()` path does not.

### 2. `updateMotionValue()` can't sample CSS transform strings

When `NativeAnimationExtended.stop()` is called, it runs `updateMotionValue()` which creates a renderless `JSAnimation` to estimate the mid-flight value. This doesn't work reliably for raw CSS transform strings like `"translateX(100px) translateY(50px)"`. In testing, it produces ~191px jumps (essentially starting from origin).

## Code Paths in Motion

| Path | Interruption Handling | Works? |
|------|----------------------|--------|
| `<motion.div animate={}>` | VisualElement render loop fills the async gap | Yes |
| `animateMini(element, ...)` | Sync 3-step: stop→commitStyles→read→animate | Yes |
| `animate(element, ...)` via `useAnimate()` | Async DOMKeyframesResolver + updateMotionValue estimation | **No** |

## Key Files in Motion (~/github/motion)

- `packages/motion-dom/src/animation/keyframes/DOMKeyframesResolver.ts:34` — hardcoded `isAsync = true`
- `packages/motion-dom/src/animation/keyframes/KeyframesResolver.ts:89` — `flushKeyframeResolvers()` (exported but flushes ALL resolvers globally)
- `packages/motion-dom/src/animation/NativeAnimationExtended.ts:62-93` — `updateMotionValue()` with JSAnimation sampling
- `packages/motion-dom/src/animation/NativeAnimation.ts:150-184` — `stop()` → `updateMotionValue()` or `commitStyles()`
- `packages/motion-dom/src/animation/AsyncMotionValueAnimation.ts:198-205` — `.animation` getter triggers `flushKeyframeResolvers()`
- `packages/framer-motion/src/animation/animators/waapi/animate-elements.ts:52-68` — animateMini's 3-step process with explicit WAAPI interruption comment

## Our Workaround (in createAnimations.tsx)

### Part 1: Mid-flight capture
Manually call `commitStyles()` on WAAPI animations (via `(controls as any).animations`) to bake the current rendered value into inline style. Cancel the old animation, read back the committed transform, use it as first keyframe `[committedTransform, newTarget]`.

### Part 2: Persist on completion
After animation finishes, synchronously write final transform to `node.style.transform`. Prevents flash-back when WAAPI removes the finished animation layer.

### Why it must reach into internals
- `commitStyles()` is the only way to capture the actual WAAPI-rendered value without causing reflow (unlike `getComputedStyle`)
- Motion doesn't expose the raw WAAPI `Animation` objects through its public API
- The `.animations` property on `GroupAnimationWithThen` is technically public but not typed

## What We Tried (and Failed)

### `flushKeyframeResolvers()` alone (no commitStyles)
Result: 191px jumps. Motion's `updateMotionValue()` JSAnimation estimation fails for CSS transform strings.

### `flushKeyframeResolvers()` + commitStyles
Result: Still fails. Global flush resolves ALL pending resolvers, interfering with concurrent animations.

### `frame.render()` for persist-on-completion
Result: Fails. Deferring the inline style write means if a new animation interrupts right after completion, the persisted transform isn't set yet.

### `void startedControls.state` (triggers flush via getter)
Same as `flushKeyframeResolvers()` — triggers it via `AsyncMotionValueAnimation.get animation()` getter.

## Suggested Fixes for Motion

1. **`updateMotionValue()` should use `commitStyles()`** instead of JSAnimation estimation for WAAPI animations — the WAAPI animation already has the exact mid-flight value
2. **`DOMKeyframesResolver` should be sync when no measurement needed** — if all keyframes are resolved (no `null`, no CSS variables, no unit conversion), skip the async frame
3. **Or: replicate `animateMini`'s 3-step process** in the full `animate()` path for WAAPI interruptions

## Available Public APIs (for future reference)

From `motion/react`:
- `frame` — motion's rAF-based frameloop (`frame.read`, `frame.render`, etc.)
- `flushKeyframeResolvers()` — forces sync resolution of all pending resolvers
- `cancelFrame` — cancels a scheduled frame callback
- `frameData` / `frameSteps` — frameloop state and step references
