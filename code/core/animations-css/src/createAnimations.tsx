import {
  normalizeTransition,
  getAnimatedProperties,
  hasAnimation as hasNormalizedAnimation,
  getEffectiveAnimation,
  getAnimationConfigsForKeys,
} from '@tamagui/animation-helpers'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import type {
  AnimatedNumberStrategy,
  AnimationDriver,
  UniversalAnimatedNumber,
} from '@tamagui/web'
import { transformsToString } from '@tamagui/web'
import React, { useState } from 'react' // import { animate } from '@tamagui/cubic-bezier-animator'

const EXTRACT_MS_REGEX = /(\d+(?:\.\d+)?)\s*ms/
const EXTRACT_S_REGEX = /(\d+(?:\.\d+)?)\s*s/

// rAF-driven animated number is browser-only. read (don't call) at module scope
// so ssr never touches requestAnimationFrame.
const hasRAF = typeof requestAnimationFrame !== 'undefined'
const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())

// spring params use the same names/semantics as react-native Animated, so an
// explicit transitionConfig (stiffness/damping/mass) feels the same across
// drivers. defaults are critically damped (zeta ~1) rather than RN's bouncy
// 100/10: a css consumer that supplies no spring params gets a clean, prompt,
// non-oscillating settle whose completion beats the sheet's 1s fallback timer
// instead of ringing for ~1.4s. rest-detection thresholds are sub-pixel by
// default; the sheet passes px-sized overrides.
const SPRING_DEFAULTS = {
  stiffness: 300,
  damping: 35,
  mass: 1,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
}

// resolve once all WAAPI animations on `node` finish. mirrors base-ui's
// useAnimationsFinished: resolves immediately when the browser exposes no
// animations (zero-animation elements), and re-checks after an aborted
// animation in case a property it depended on changed mid-flight and started a
// new one. falls back to immediate resolve when getAnimations is unavailable
// (ssr / older webviews). resolves `false` when animations were canceled with
// nothing left running (interruption).
function waitForAnimations(node: HTMLElement): Promise<boolean> {
  if (typeof node.getAnimations !== 'function') {
    return Promise.resolve(true)
  }
  return new Promise<boolean>((resolve) => {
    const check = () => {
      const animations = node.getAnimations()
      if (animations.length === 0) {
        resolve(true)
        return
      }
      Promise.all(animations.map((a) => a.finished))
        .then(() => resolve(true))
        .catch(() => {
          const remaining = node.getAnimations()
          if (remaining.some((a) => a.playState === 'running' || a.pending)) {
            check()
            return
          }
          resolve(false)
        })
    }
    // css transitions register as pending until the next style recalc, so give
    // the browser one frame to start them before we read getAnimations.
    if (hasRAF) {
      requestAnimationFrame(check)
    } else {
      check()
    }
  })
}

/**
 * Helper function to extract duration from CSS animation string
 * Examples: "ease-in 200ms" -> 200, "cubic-bezier(0.215, 0.610, 0.355, 1.000) 400ms" -> 400
 * "ease-in 0.5s" -> 500, "slow 2s" -> 2000
 */
function extractDuration(animation: string): number {
  // Try to match milliseconds first
  const msMatch = animation.match(EXTRACT_MS_REGEX)
  if (msMatch) {
    return Number.parseInt(msMatch[1], 10)
  }

  // Try to match seconds and convert to milliseconds
  const sMatch = animation.match(EXTRACT_S_REGEX)
  if (sMatch) {
    return Math.round(Number.parseFloat(sMatch[1]) * 1000)
  }

  // Default to 300ms if no duration found
  return 300
}

const MS_DURATION_REGEX = /(\d+(?:\.\d+)?)\s*ms/
const S_DURATION_REGEX = /(\d+(?:\.\d+)?)\s*s(?!tiffness)/

/**
 * Apply duration override to a CSS animation string
 * Replaces the existing duration with the override value
 */
function applyDurationOverride(animation: string, durationMs: number): string {
  // Replace ms duration
  const msReplaced = animation.replace(MS_DURATION_REGEX, `${durationMs}ms`)
  if (msReplaced !== animation) {
    return msReplaced
  }

  // Replace seconds duration
  const sReplaced = animation.replace(S_DURATION_REGEX, `${durationMs}ms`)
  if (sReplaced !== animation) {
    return sReplaced
  }

  // No duration found, prepend the duration
  return `${durationMs}ms ${animation}`
}

// transform keys that need special handling
const TRANSFORM_KEYS = new Set([
  'x',
  'y',
  'scale',
  'scaleX',
  'scaleY',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'skewX',
  'skewY',
])

/**
 * Build a CSS transform string from a style object containing transform properties
 */
function buildTransformString(style: Record<string, unknown> | undefined): string {
  if (!style) return ''

  const parts: string[] = []

  if (style.x !== undefined || style.y !== undefined) {
    const x = style.x ?? 0
    const y = style.y ?? 0
    parts.push(`translate(${x}px, ${y}px)`)
  }
  if (style.scale !== undefined) {
    parts.push(`scale(${style.scale})`)
  }
  if (style.scaleX !== undefined) {
    parts.push(`scaleX(${style.scaleX})`)
  }
  if (style.scaleY !== undefined) {
    parts.push(`scaleY(${style.scaleY})`)
  }
  if (style.rotate !== undefined) {
    const val = style.rotate
    const unit = typeof val === 'string' && val.includes('deg') ? '' : 'deg'
    parts.push(`rotate(${val}${unit})`)
  }
  if (style.rotateX !== undefined) {
    parts.push(`rotateX(${style.rotateX}deg)`)
  }
  if (style.rotateY !== undefined) {
    parts.push(`rotateY(${style.rotateY}deg)`)
  }
  if (style.rotateZ !== undefined) {
    parts.push(`rotateZ(${style.rotateZ}deg)`)
  }
  if (style.skewX !== undefined) {
    parts.push(`skewX(${style.skewX}deg)`)
  }
  if (style.skewY !== undefined) {
    parts.push(`skewY(${style.skewY}deg)`)
  }

  return parts.join(' ')
}

/**
 * Apply a style object to a DOM node, handling transform keys specially
 */
function applyStylesToNode(
  node: HTMLElement,
  style: Record<string, unknown> | undefined
): void {
  if (!style) return

  // collect transform values
  const transformStr = buildTransformString(style)
  if (transformStr) {
    node.style.transform = transformStr
  }

  // apply non-transform properties
  for (const key in style) {
    const value = style[key]
    if (TRANSFORM_KEYS.has(key)) continue
    if (value === undefined) continue

    if (key === 'opacity') {
      node.style.opacity = String(value)
    } else if (key === 'backgroundColor') {
      node.style.backgroundColor = String(value)
    } else if (key === 'color') {
      node.style.color = String(value)
    } else {
      // generic fallback
      node.style[key as any] = typeof value === 'number' ? `${value}px` : String(value)
    }
  }
}

// force a re-render whenever any of the given animated numbers notifies. used
// by useAnimatedNumberStyle so a consumer re-reads getValue() on every change.
function useSubscribeToAnimatedNumbers(
  reactionListeners: WeakMap<any, Set<Function>>,
  vals: UniversalAnimatedNumber<Function>[]
): void {
  const [, force] = React.useState(0)
  const instances = vals.map((v) => v.getInstance())

  React.useEffect(() => {
    const listener = () => force((n) => (n + 1) % 1_000_000)
    const queues = instances.map((instance) => {
      let queue = reactionListeners.get(instance)
      if (!queue) {
        queue = new Set<Function>()
        reactionListeners.set(instance, queue)
      }
      queue.add(listener)
      return queue
    })
    return () => {
      for (const queue of queues) queue.delete(listener)
    }
    // re-subscribe only when an underlying instance identity changes
  }, instances)
}

export function createAnimations<A extends object>(animations: A): AnimationDriver<A> {
  const reactionListeners = new WeakMap<any, Set<Function>>()

  return {
    animations,
    usePresence,
    ResetPresence,
    inputStyle: 'css',
    outputStyle: 'css',

    useAnimatedNumber(initial): UniversalAnimatedNumber<Function> {
      // val state is only a re-render trigger; valueRef is the source of truth
      const [, setVal] = React.useState(initial)
      const valueRef = React.useRef(initial)
      const rafRef = React.useRef<number | null>(null)
      const finishRef = React.useRef<(() => void) | null>(null)

      // notify JS-thread reaction listeners registered against this instance
      const notify = (value: number) => {
        const listeners = reactionListeners.get(setVal)
        if (listeners) {
          listeners.forEach((listener) => listener(value))
        }
      }

      // stop the ticker without firing completion (interruption/stop)
      const cancelTicker = () => {
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
        finishRef.current = null
      }

      return {
        getInstance() {
          return setVal
        },
        getValue() {
          return valueRef.current
        },
        setValue(next, config, onFinish) {
          // any new set supersedes a running animation; the previous onFinish
          // is dropped (not called), matching the react-native driver where an
          // interrupted spring reports finished:false and never fires onFinish
          cancelTicker()

          const strategy = config ?? { type: 'spring' as const }
          const from = valueRef.current

          // commit the target to react state. the css driver renders by
          // re-render (useAnimatedNumberStyle reads getValue), and the frame's
          // CSS transition eases the DOM from `from` to `next`. we set state ONCE
          // rather than every frame — stepping state per frame re-triggers that
          // CSS transition each render and the DOM lags hundreds of ms behind.
          valueRef.current = next
          setVal(next)

          // direct sets (sheet dragging), non-browser environments, zero-duration
          // timing, and no-op moves resolve immediately with synchronous completion
          if (
            !hasRAF ||
            strategy.type === 'direct' ||
            (strategy.type === 'timing' && strategy.duration === 0) ||
            from === next
          ) {
            notify(next)
            onFinish?.()
            return
          }

          finishRef.current = onFinish ?? null

          // drive the JS-thread listener path frame by frame and fire real
          // completion when the animation's own math settles (spring rest
          // detection / timing end), not an estimated-duration timer
          const settle = () => {
            rafRef.current = null
            notify(next)
            const done = finishRef.current
            finishRef.current = null
            done?.()
          }

          if (strategy.type === 'timing') {
            const duration = strategy.duration
            const start = nowMs()
            const tick = () => {
              const t = Math.min(1, (nowMs() - start) / duration)
              if (t >= 1) {
                settle()
                return
              }
              // linear interpolation timing path
              notify(from + (next - from) * t)
              rafRef.current = requestAnimationFrame(tick)
            }
            rafRef.current = requestAnimationFrame(tick)
            return
          }

          // spring: plain semi-implicit euler integrator with rest detection.
          // substeps at a fixed 1ms dt keep stiff springs stable at the rAF rate.
          const s = strategy as Extract<AnimatedNumberStrategy, { type: 'spring' }>
          const stiffness = s.stiffness ?? SPRING_DEFAULTS.stiffness
          const damping = s.damping ?? SPRING_DEFAULTS.damping
          const mass = s.mass ?? SPRING_DEFAULTS.mass
          const overshootClamping =
            s.overshootClamping ?? SPRING_DEFAULTS.overshootClamping
          const restSpeed = s.restSpeedThreshold ?? SPRING_DEFAULTS.restSpeedThreshold
          const restDisplacement =
            s.restDisplacementThreshold ?? SPRING_DEFAULTS.restDisplacementThreshold

          let velocity = 0
          let value = from
          let lastTime = nowMs()

          const tick = () => {
            const frameNow = nowMs()
            // cap dt so a backgrounded tab doesn't integrate one giant step
            let dt = (frameNow - lastTime) / 1000
            lastTime = frameNow
            if (dt > 0.064) dt = 0.064

            const steps = Math.max(1, Math.ceil(dt / 0.001))
            const sdt = dt / steps
            for (let i = 0; i < steps; i++) {
              const springForce = -stiffness * (value - next)
              const dampingForce = -damping * velocity
              const accel = (springForce + dampingForce) / mass
              velocity += accel * sdt
              value += velocity * sdt
            }

            if (
              overshootClamping &&
              ((from < next && value > next) || (from > next && value < next))
            ) {
              value = next
              velocity = 0
            }

            const isVelocityRest = Math.abs(velocity) <= restSpeed
            const isDisplacementRest = Math.abs(next - value) <= restDisplacement
            if (isVelocityRest && isDisplacementRest) {
              settle()
              return
            }

            notify(value)
            rafRef.current = requestAnimationFrame(tick)
          }
          rafRef.current = requestAnimationFrame(tick)
        },
        stop() {
          cancelTicker()
        },
      }
    },

    useAnimatedNumberReaction({ value }, onValue) {
      React.useEffect(() => {
        const instance = value.getInstance()
        let queue = reactionListeners.get(instance)
        if (!queue) {
          const next = new Set<Function>()
          reactionListeners.set(instance, next)
          queue = next!
        }
        queue.add(onValue)
        return () => {
          queue?.delete(onValue)
        }
      }, [])
    },

    useAnimatedNumberStyle(val, getStyle) {
      // css has no UI thread, so a consumer of an external animated number
      // (e.g. a drag-linked overlay reading Sheet.useAnimatedPosition) must
      // re-render on each value change to recompute the style. subscribe to the
      // same listener path notify() drives.
      useSubscribeToAnimatedNumbers(reactionListeners, [val])
      return getStyle(val.getValue())
    },

    useAnimatedNumbersStyle(vals, getStyle) {
      useSubscribeToAnimatedNumbers(reactionListeners, vals)
      return getStyle(...vals.map((v) => v.getValue()))
    },

    // @ts-ignore - styleState is added by createComponent
    useAnimations: ({
      props,
      presence,
      style,
      componentState,
      stateRef,
      styleState,
      onTransition,
    }: any) => {
      const isHydrating = componentState.unmounted === true
      const isEntering = !!componentState.unmounted
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]
      const onTransitionRef = React.useRef(onTransition)
      onTransitionRef.current = onTransition
      const emit = (
        phase: 'start' | 'end',
        cause: 'enter' | 'exit' | 'update',
        finished?: boolean
      ) => {
        onTransitionRef.current?.(
          phase === 'end' ? { phase, cause, finished } : { phase, cause }
        )
      }

      // Track if we just finished entering (transition from entering to not entering)
      // This is needed because the CSS transition happens on the render AFTER t_unmounted is removed
      const wasEnteringRef = React.useRef(isEntering)
      const justFinishedEntering = wasEnteringRef.current && !isEntering
      React.useEffect(() => {
        wasEnteringRef.current = isEntering
      })

      // exit cycle guards to prevent stale/duplicate completion
      const exitCycleIdRef = React.useRef(0)
      const exitCompletedRef = React.useRef(false)
      const wasExitingRef = React.useRef(false)
      const exitInterruptedRef = React.useRef(false)
      const sendExitCompleteRef = React.useRef(sendExitComplete)
      const lastNonExitingStyleRef = React.useRef<Record<string, string>>({})
      sendExitCompleteRef.current = sendExitComplete

      // onTransition lifecycle bookkeeping (independent from presence completion)
      const enterCycleIdRef = React.useRef(0)
      const enterStartedRef = React.useRef(false)
      const updateCycleIdRef = React.useRef(0)
      const updateInFlightRef = React.useRef(false)
      const prevUpdateSigRef = React.useRef<string | null>(null)
      const exitStartedRef = React.useRef(false)

      // detect transition into/out of exiting state
      const justStartedExiting = isExiting && !wasExitingRef.current
      const justStoppedExiting = !isExiting && wasExitingRef.current

      // start new exit cycle only on transition INTO exiting
      if (justStartedExiting) {
        exitCycleIdRef.current++
        exitCompletedRef.current = false
      }
      // track interruptions so we know to force-restart transitions
      if (justStoppedExiting) {
        exitCycleIdRef.current++
        exitInterruptedRef.current = true
      }

      // track previous exiting state
      React.useEffect(() => {
        wasExitingRef.current = isExiting
      })

      useIsomorphicLayoutEffect(() => {
        const host = stateRef.current.host
        if (isExiting || !host) return
        const computedStyle = getComputedStyle(host as HTMLElement)
        lastNonExitingStyleRef.current = {
          opacity: computedStyle.opacity,
        }
      })

      // use effectiveTransition computed by createComponent (single source of truth)
      const effectiveTransition = styleState?.effectiveTransition ?? props.transition

      // Normalize the transition prop to a consistent format
      const normalized = normalizeTransition(effectiveTransition)

      // Determine animation state and get effective animation
      // Use 'enter' if we're entering OR if we just finished entering (transition is happening)
      const animationState = isExiting
        ? 'exit'
        : isEntering || justFinishedEntering
          ? 'enter'
          : 'default'
      const effectiveAnimationKey = getEffectiveAnimation(normalized, animationState)
      const defaultAnimation = effectiveAnimationKey
        ? animations[effectiveAnimationKey]
        : null
      const animatedProperties = getAnimatedProperties(normalized)

      // Determine which properties to animate
      // - animateOnly prop is an exclusive filter (only animate those properties)
      // - per-property configs WITHOUT a default = only animate those specific properties
      // - per-property configs WITH a default = per-property overrides + default for rest
      const hasDefault =
        normalized.default !== null ||
        normalized.enter !== null ||
        normalized.exit !== null
      const hasPerPropertyConfigs = animatedProperties.length > 0

      let keys: string[]
      if (props.animateOnly) {
        // animateOnly is explicit filter
        keys = props.animateOnly
      } else if (hasPerPropertyConfigs && !hasDefault) {
        // object format without default: { opacity: '200ms' } = only animate opacity
        keys = animatedProperties
      } else if (hasPerPropertyConfigs && hasDefault) {
        // array format or object with default: 'all' first, then per-property overrides
        // CSS transition specificity: later declarations override earlier ones for the same property
        keys = ['all', ...animatedProperties]
      } else {
        // simple string format: 'quick' = animate all
        keys = ['all']
      }

      useIsomorphicLayoutEffect(() => {
        const host = stateRef.current.host
        if (!sendExitComplete || !isExiting || !host) return
        const node = host as HTMLElement

        // capture current cycle id for this effect
        const cycleId = exitCycleIdRef.current

        // emit exit start once per cycle
        if (!exitStartedRef.current) {
          exitStartedRef.current = true
          emit('start', 'exit')
        }

        // helper to complete exit with guards. the exit 'end' event fires
        // immediately before presence safeToRemove so users can observe exit
        // completion without reaching into presence internals.
        const completeExit = () => {
          if (cycleId !== exitCycleIdRef.current) return
          if (exitCompletedRef.current) return
          exitCompletedRef.current = true
          if (exitStartedRef.current) {
            exitStartedRef.current = false
            emit('end', 'exit', true)
          }
          sendExitCompleteRef.current?.()
        }

        // if no properties to animate (animateOnly=[]), complete immediately
        if (keys.length === 0) {
          completeExit()
          return
        }

        // Force transition restart for interrupted exits
        // When an exit is interrupted and restarted, the element may already be at
        // the exit style, so no CSS transition fires. We need to:
        // 1. Reset to non-exit state
        // 2. Force reflow
        // 3. Re-apply exit state to trigger transition
        let rafId: number | undefined
        const wasInterrupted = exitInterruptedRef.current
        // flag to ignore transitioncancel during reset (we intentionally cancel the old transition)
        let ignoreCancelEvents = wasInterrupted
        // get enter/exit styles for potential restart
        const enterStyle = props.enterStyle as Record<string, unknown> | undefined
        const exitStyle = props.exitStyle as Record<string, unknown> | undefined

        // Build the exit transition string - needed for both normal and interrupted exits
        const delayStr = normalized.delay ? ` ${normalized.delay}ms` : ''
        const durationOverride = normalized.config?.duration
        const exitTransitionString = keys
          .map((key) => {
            const propAnimation = normalized.properties[key]
            let animationValue: string | null = null
            if (typeof propAnimation === 'string') {
              animationValue = animations[propAnimation]
            } else if (
              propAnimation &&
              typeof propAnimation === 'object' &&
              propAnimation.type
            ) {
              animationValue = animations[propAnimation.type]
            } else if (defaultAnimation) {
              animationValue = defaultAnimation
            }
            if (animationValue && durationOverride) {
              animationValue = applyDurationOverride(animationValue, durationOverride)
            }
            return animationValue ? `${key} ${animationValue}${delayStr}` : null
          })
          .filter(Boolean)
          .join(', ')

        const getResetValue = (key: string) => {
          if (key === 'opacity') {
            return (
              style?.opacity ??
              props.opacity ??
              lastNonExitingStyleRef.current.opacity ??
              1
            )
          }
          if (TRANSFORM_KEYS.has(key)) {
            return key === 'scale' || key === 'scaleX' || key === 'scaleY' ? 1 : 0
          }
          return enterStyle?.[key]
        }

        if (wasInterrupted) {
          exitInterruptedRef.current = false
          // disable transition, reset to enter state
          node.style.transition = 'none'

          // reset: apply active/open state for each exit property (not enterStyle,
          // which may equal exitStyle — see comment in the normal exit path below)
          if (exitStyle) {
            const resetStyle: Record<string, unknown> = {}
            for (const key of Object.keys(exitStyle)) {
              const resetValue = getResetValue(key)
              if (resetValue !== undefined) {
                resetStyle[key] = resetValue
              }
            }
            applyStylesToNode(node, resetStyle)
          } else {
            // fallback if no exitStyle defined
            node.style.opacity = '1'
            node.style.transform = 'none'
          }

          // force reflow
          void node.offsetHeight
        } else if (exitStyle) {
          // For normal (non-interrupted) exits, we need to ensure the CSS transition is
          // processed by the browser BEFORE the exitStyle takes effect. The issue is that
          // React may have already applied exitStyle in the same render batch. To fix this:
          // 1. Disable transition and reset to non-exit state
          // 2. Force reflow so browser processes the reset
          // 3. Use RAF to ensure we're in a new frame
          // 4. Re-enable transition and apply exitStyle
          // This mirrors the interrupted exit handling approach (which also uses RAF).
          ignoreCancelEvents = true
          node.style.transition = 'none'

          // Reset to the active/open state (not enterStyle, which may equal exitStyle).
          // enterStyle is the "unmounted" initial state and can share values with exitStyle
          // (e.g., both have opacity: 0). resetting to enterStyle would mean no value change
          // when exitStyle is applied, so the CSS transition wouldn't fire.
          const resetStyle: Record<string, unknown> = {}
          for (const key of Object.keys(exitStyle)) {
            const resetValue = getResetValue(key)
            if (resetValue !== undefined) {
              resetStyle[key] = resetValue
            }
          }
          applyStylesToNode(node, resetStyle)

          // Force reflow
          void node.offsetHeight

          // Use RAF to ensure transition is applied in a new frame
          rafId = requestAnimationFrame(() => {
            if (cycleId !== exitCycleIdRef.current) return
            // Re-enable transition
            node.style.transition = exitTransitionString
            // Force reflow to ensure transition is active
            void node.offsetHeight
            // Apply exit styles - this triggers the animation
            applyStylesToNode(node, exitStyle)
            // Re-enable cancel event handling
            ignoreCancelEvents = false
          })
        }

        /**
         * Exit animation handling for Dialog/Modal components
         *
         * The Challenge: When users close dialogs (via Escape key or clicking outside),
         * the element can disappear from the DOM before CSS transitions finish, which causes:
         * 1. Dialogs to stick around on screen
         * 2. Event handlers to stop working
         *
         * Fix: Calculate the MAXIMUM duration across all animated properties, not just
         * the default. With animateOnly and per-property configs, different properties
         * can have different durations, and we need to wait for the LONGEST one.
         */

        // calculate max duration across all animated properties
        let maxDuration = defaultAnimation ? extractDuration(defaultAnimation) : 200

        // check per-property animation durations using shared helper
        const animationConfigs = getAnimationConfigsForKeys(
          normalized,
          animations as Record<string, string>,
          keys,
          defaultAnimation
        )
        for (const animationValue of animationConfigs.values()) {
          if (animationValue) {
            const duration = extractDuration(animationValue)
            if (duration > maxDuration) {
              maxDuration = duration
            }
          }
        }

        const delay = normalized.delay ?? 0
        const fallbackTimeout = maxDuration + delay

        const timeoutId = setTimeout(() => {
          completeExit()
        }, fallbackTimeout)

        // track number of transitioning properties to wait for all to finish
        // (each property fires its own transitionend event)
        const transitioningProps = new Set(keys)
        let completedCount = 0

        const onFinishAnimation = (event: TransitionEvent) => {
          // only count transitions on THIS element, not bubbled from children
          if (event.target !== node) return

          // map CSS property names to our key names
          // e.g., transitionend fires with propertyName 'transform' for scale/x/y
          const eventProp = event.propertyName
          if (transitioningProps.has(eventProp) || eventProp === 'all') {
            completedCount++
            // wait for all properties to finish
            if (completedCount >= transitioningProps.size) {
              clearTimeout(timeoutId)
              completeExit()
            }
          }
        }

        // on cancel, still complete (element is exiting and animation was interrupted)
        // the guards prevent duplicate completion if this is a stale cycle
        const onCancelAnimation = () => {
          // ignore cancel events during reset phase (we intentionally cancel the old transition)
          if (ignoreCancelEvents) return
          clearTimeout(timeoutId)
          completeExit()
        }

        node.addEventListener('transitionend', onFinishAnimation)
        node.addEventListener('transitioncancel', onCancelAnimation)

        // For interrupted exits, re-enable transition and re-apply exit styles
        // This must happen AFTER listeners are set up so we catch the transitionend
        if (wasInterrupted) {
          rafId = requestAnimationFrame(() => {
            if (cycleId !== exitCycleIdRef.current) return
            // re-enable transition using the pre-built string
            node.style.transition = exitTransitionString
            // force reflow again
            void node.offsetHeight
            // now apply exit styles - this triggers the transition
            applyStylesToNode(node, exitStyle)
            // re-enable cancel event handling now that reset is complete
            ignoreCancelEvents = false
          })
        }

        return () => {
          clearTimeout(timeoutId)
          if (rafId !== undefined) cancelAnimationFrame(rafId)
          node.removeEventListener('transitionend', onFinishAnimation)
          node.removeEventListener('transitioncancel', onCancelAnimation)
          // restore transition: the exit handling sets node.style.transition='none'
          // directly on the DOM (bypassing React). if exit is interrupted (e.g. same-key
          // re-entry in AnimatePresence), React won't re-apply its managed transition
          // value because it hasn't changed in the virtual DOM. clearing the inline
          // override lets React's value take effect again.
          node.style.transition = ''
        }
      }, [isExiting])

      // signature of the animatable style, so the update effect can detect
      // in-place style changes. the css driver applies most style values as
      // atomic classNames (not inline style), so the signature must include the
      // className map. only computed when a listener is attached.
      const styleSignature = onTransition
        ? (() => {
            const { transition: _t, ...rest } = style
            return `${JSON.stringify(styleState?.classNames ?? null)}|${JSON.stringify(rest)}`
          })()
        : ''

      // enter lifecycle: emit start when the enter transition kicks off, end
      // once every animation on the node finishes (getAnimations-based, resolves
      // immediately for zero-animation elements). the promise outlives benign
      // re-renders because it keys off the cycle id, not the effect lifetime.
      useIsomorphicLayoutEffect(() => {
        const host = stateRef.current.host
        if (!onTransitionRef.current || isExiting || !justFinishedEntering || !host) {
          return
        }
        const node = host as HTMLElement
        const cycleId = ++enterCycleIdRef.current
        enterStartedRef.current = true
        emit('start', 'enter')
        void waitForAnimations(node).then((finished) => {
          if (cycleId !== enterCycleIdRef.current || !enterStartedRef.current) return
          enterStartedRef.current = false
          emit('end', 'enter', finished)
        })
      }, [justFinishedEntering, isExiting])

      // update lifecycle: a style change while mounted (not entering or exiting).
      // a new update that supersedes an in-flight one emits end(finished:false).
      useIsomorphicLayoutEffect(() => {
        const host = stateRef.current.host
        if (
          !onTransitionRef.current ||
          isEntering ||
          justFinishedEntering ||
          isExiting ||
          !host
        ) {
          // keep the signature current so leaving enter/exit isn't seen as an update
          prevUpdateSigRef.current = styleSignature
          return
        }
        if (prevUpdateSigRef.current === null) {
          prevUpdateSigRef.current = styleSignature
          return
        }
        if (styleSignature === prevUpdateSigRef.current) return
        prevUpdateSigRef.current = styleSignature

        const node = host as HTMLElement
        if (updateInFlightRef.current) {
          emit('end', 'update', false)
        }
        updateInFlightRef.current = true
        const cycleId = ++updateCycleIdRef.current
        emit('start', 'update')
        void waitForAnimations(node).then((finished) => {
          if (cycleId !== updateCycleIdRef.current) return
          updateInFlightRef.current = false
          emit('end', 'update', finished)
        })
      }, [styleSignature, isEntering, justFinishedEntering, isExiting])

      // interruption: emit a finished:false end for an enter canceled by an exit,
      // or an exit canceled by a re-enter (before its own completion fired).
      useIsomorphicLayoutEffect(() => {
        if (justStartedExiting && enterStartedRef.current) {
          enterCycleIdRef.current++
          enterStartedRef.current = false
          emit('end', 'enter', false)
        }
        if (justStoppedExiting && exitStartedRef.current && !exitCompletedRef.current) {
          exitStartedRef.current = false
          emit('end', 'exit', false)
        }
      }, [justStartedExiting, justStoppedExiting])

      // tamagui doesnt even use animation output during hydration
      if (isHydrating) {
        return null
      }

      // Check if we have any animation to apply
      if (!hasNormalizedAnimation(normalized)) {
        return null
      }

      if (Array.isArray(style.transform)) {
        style.transform = transformsToString(style.transform)
      }

      // Build CSS transition string
      // TODO: we disabled the transform transition, because it will create issue for inverse function and animate function
      // for non layout transform properties either use animate function or find a workaround to do it with css
      const delayStr = normalized.delay ? ` ${normalized.delay}ms` : ''
      const durationOverride = normalized.config?.duration
      style.transition = keys
        .map((key) => {
          // Check for property-specific animation, fall back to default
          const propAnimation = normalized.properties[key]
          let animationValue: string | null = null

          if (typeof propAnimation === 'string') {
            animationValue = animations[propAnimation]
          } else if (
            propAnimation &&
            typeof propAnimation === 'object' &&
            propAnimation.type
          ) {
            animationValue = animations[propAnimation.type]
          } else if (defaultAnimation) {
            animationValue = defaultAnimation
          }

          // Apply global duration override if specified
          if (animationValue && durationOverride) {
            animationValue = applyDurationOverride(animationValue, durationOverride)
          }

          return animationValue ? `${key} ${animationValue}${delayStr}` : null
        })
        .filter(Boolean)
        .join(', ')

      if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
        console.info('CSS animation', {
          props,
          animations,
          normalized,
          defaultAnimation,
          style,
          isEntering,
          isExiting,
        })
      }

      return { style, className: isEntering ? 't_unmounted' : '' }
    },
  }
}

// layout animations
// useIsomorphicLayoutEffect(() => {
//   if (!host || !props.layout) {
//     return
//   }
//   // @ts-ignore
//   const boundingBox = host?.getBoundingClientRect()
//   if (isChanged(initialPositionRef.current, boundingBox)) {
//     const transform = invert(
//       host,
//       boundingBox,
//       initialPositionRef.current
//     )

//     animate({
//       from: transform,
//       to: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
//       duration: 1000,
//       onUpdate: ({ x, y, scaleX, scaleY }) => {
//         // @ts-ignore
//         host.style.transform = `translate(${x}px, ${y}px) scaleX(${scaleX}) scaleY(${scaleY})`
//         // TODO: handle childRef inverse scale
//         //   childRef.current.style.transform = `scaleX(${1 / scaleX}) scaleY(${
//         //     1 / scaleY
//         //   })`
//       },
//       // TODO: extract ease-in from string and convert/map it to a cubicBezier array
//       cubicBezier: [0, 1.38, 1, -0.41],
//     })
//   }
//   initialPositionRef.current = boundingBox
// })

// style.transition = `${keys} ${animation}${
//   props.layout ? ',width 0s, height 0s, margin 0s, padding 0s, transform' : ''
// }`

// const isChanged = (initialBox: any, finalBox: any) => {
//   // we just mounted, so we don't have complete data yet
//   if (!initialBox || !finalBox) return false

//   // deep compare the two boxes
//   return JSON.stringify(initialBox) !== JSON.stringify(finalBox)
// }

// const invert = (el, from, to) => {
//   const { x: fromX, y: fromY, width: fromWidth, height: fromHeight } = from
//   const { x, y, width, height } = to

//   const transform = {
//     x: x - fromX - (fromWidth - width) / 2,
//     y: y - fromY - (fromHeight - height) / 2,
//     scaleX: width / fromWidth,
//     scaleY: height / fromHeight,
//   }

//   el.style.transform = `
