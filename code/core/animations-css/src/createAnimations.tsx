import {
  normalizeTransition,
  getAnimatedProperties,
  hasAnimation as hasNormalizedAnimation,
  getEffectiveAnimation,
  getAnimationConfigsForKeys,
} from '@tamagui/animation-helpers'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import type { AnimationDriver, UniversalAnimatedNumber } from '@tamagui/web'
import { transformsToString } from '@tamagui/web'
import React, { useState } from 'react' // import { animate } from '@tamagui/cubic-bezier-animator'

const EXTRACT_MS_REGEX = /(\d+(?:\.\d+)?)\s*ms/
const EXTRACT_S_REGEX = /(\d+(?:\.\d+)?)\s*s/

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

export function createAnimations<A extends object>(animations: A): AnimationDriver<A> {
  const reactionListeners = new WeakMap<any, Set<Function>>()

  return {
    animations,
    usePresence,
    ResetPresence,
    supportsCSS: true,
    inputStyle: 'css',
    outputStyle: 'css',
    classNameAnimation: true,

    useAnimatedNumber(initial): UniversalAnimatedNumber<Function> {
      const [val, setVal] = React.useState(initial)
      const [onFinish, setOnFinish] = useState<Function | undefined>()

      useIsomorphicLayoutEffect(() => {
        if (onFinish) {
          onFinish?.()
          setOnFinish(undefined)
        }
      }, [onFinish])

      return {
        getInstance() {
          return setVal
        },
        getValue() {
          return val
        },
        setValue(next, config, onFinish) {
          setVal(next)
          setOnFinish(onFinish)
          // call reaction listeners with the new value
          const listeners = reactionListeners.get(setVal)
          if (listeners) {
            listeners.forEach((listener) => listener(next))
          }
        },
        stop() {},
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
      return getStyle(val.getValue())
    },

    useAnimations: ({ props, presence, style, componentState, stateRef }) => {
      const isEntering = !!componentState.unmounted
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]

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

      // Normalize the transition prop to a consistent format
      const normalized = normalizeTransition(props.transition)

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

        // helper to complete exit with guards
        const completeExit = () => {
          if (cycleId !== exitCycleIdRef.current) return
          if (exitCompletedRef.current) return
          exitCompletedRef.current = true
          sendExitComplete()
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
        if (wasInterrupted) {
          exitInterruptedRef.current = false
          // disable transition, reset to enter state
          node.style.transition = 'none'
          node.style.opacity = '1'
          node.style.transform = 'none'
          // force reflow
          void node.offsetHeight
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
            // re-enable transition (React's style.transition was cleared by our reset)
            // we need to rebuild it here
            const delayStr = normalized.delay ? ` ${normalized.delay}ms` : ''
            node.style.transition = keys
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
                return animationValue ? `${key} ${animationValue}${delayStr}` : null
              })
              .filter(Boolean)
              .join(', ')
            // force reflow again
            void node.offsetHeight
            // now apply exit styles - this triggers the transition
            node.style.opacity = '0'
            // apply transform from exitStyle prop if available
            const exitStyle = props.exitStyle as Record<string, unknown> | undefined
            if (exitStyle?.scale !== undefined) {
              node.style.transform = `scale(${exitStyle.scale})`
            } else if (exitStyle?.x !== undefined || exitStyle?.y !== undefined) {
              const x = exitStyle?.x ?? 0
              const y = exitStyle?.y ?? 0
              node.style.transform = `translate(${x}px, ${y}px)`
            }
            // re-enable cancel event handling now that reset is complete
            ignoreCancelEvents = false
          })
        }

        return () => {
          clearTimeout(timeoutId)
          if (rafId !== undefined) cancelAnimationFrame(rafId)
          node.removeEventListener('transitionend', onFinishAnimation)
          node.removeEventListener('transitioncancel', onCancelAnimation)
        }
      }, [sendExitComplete, isExiting])

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
