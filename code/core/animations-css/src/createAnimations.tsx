import {
  normalizeTransition,
  getAnimatedProperties,
  hasAnimation as hasNormalizedAnimation,
  getEffectiveAnimation,
} from '@tamagui/animation-helpers'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import type { AnimationDriver, UniversalAnimatedNumber } from '@tamagui/web'
import { transformsToString } from '@tamagui/web'
import React, { useState } from 'react' // import { animate } from '@tamagui/cubic-bezier-animator'

/**
 * Helper function to extract duration from CSS animation string
 * Examples: "ease-in 200ms" -> 200, "cubic-bezier(0.215, 0.610, 0.355, 1.000) 400ms" -> 400
 * "ease-in 0.5s" -> 500, "slow 2s" -> 2000
 */
function extractDuration(animation: string): number {
  // Try to match milliseconds first
  const msMatch = animation.match(/(\d+(?:\.\d+)?)\s*ms/)
  if (msMatch) {
    return Number.parseInt(msMatch[1], 10)
  }

  // Try to match seconds and convert to milliseconds
  const sMatch = animation.match(/(\d+(?:\.\d+)?)\s*s/)
  if (sMatch) {
    return Math.round(Number.parseFloat(sMatch[1]) * 1000)
  }

  // Default to 300ms if no duration found
  return 300
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

        /**
         * Exit animation handling for Dialog/Modal components
         *
         * The Challenge: When users close dialogs (via Escape key or clicking outside),
         * the element can disappear from the DOM before CSS transitions finish, which causes:
         * 1. Dialogs to stick around on screen
         * 2. Event handlers to stop working
         */

        // Use timeout as primary, transition events as backup for reliable exit handling
        const animationDuration = defaultAnimation
          ? extractDuration(defaultAnimation)
          : 200
        const delay = normalized.delay ?? 0
        const fallbackTimeout = animationDuration + delay

        const timeoutId = setTimeout(() => {
          sendExitComplete?.()
        }, fallbackTimeout)

        // Listen for transition completion events as backup
        const onFinishAnimation = () => {
          clearTimeout(timeoutId)
          sendExitComplete?.()
        }

        node.addEventListener('transitionend', onFinishAnimation)
        node.addEventListener('transitioncancel', onFinishAnimation)

        return () => {
          clearTimeout(timeoutId)
          node.removeEventListener('transitionend', onFinishAnimation)
          node.removeEventListener('transitioncancel', onFinishAnimation)
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
