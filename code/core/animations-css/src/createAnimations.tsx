import {
  normalizeTransition,
  getAnimatedProperties,
  hasAnimation as hasNormalizedAnimation,
  getEffectiveAnimation,
} from '@tamagui/animation-helpers'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import type { AnimationDriver } from '@tamagui/web'
import { transformsToString } from '@tamagui/web'
import React from 'react'

import {
  useAnimatedNumber,
  useAnimatedNumberReaction,
  useAnimatedNumberStyle,
  useAnimatedNumbersStyle,
} from './animated-number'

// rAF-driven animated number is browser-only. read (don't call) at module scope
// so ssr never touches requestAnimationFrame.
const hasRAF = typeof requestAnimationFrame !== 'undefined'

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

const DURATION_REGEX = /(\d+(?:\.\d+)?)\s*(?:ms|s(?!tiffness))/

/**
 * Apply duration override to a CSS animation string
 * Replaces the existing duration with the override value
 */
function applyDurationOverride(animation: string, durationMs: number): string {
  const replaced = animation.replace(DURATION_REGEX, `${durationMs}ms`)
  return replaced === animation ? `${durationMs}ms ${animation}` : replaced
}

const CSS_TRANSFORM_PROPERTIES: Record<string, string[]> = {
  transform: ['translate', 'scale', 'rotate', 'transform'],
  x: ['translate'],
  y: ['translate'],
  scale: ['scale'],
  scaleX: ['scale'],
  scaleY: ['scale'],
  rotate: ['rotate'],
  rotateX: ['transform'],
  rotateY: ['transform'],
  rotateZ: ['transform'],
  skewX: ['transform'],
  skewY: ['transform'],
}

const getCSSProperties = (key: string) => {
  return CSS_TRANSFORM_PROPERTIES[key] || [key]
}

const hyphenatedPropertyCache: Record<string, string> = {}
const emptyProperties: string[] = []

function hyphenateProperty(property: string): string {
  if (property.startsWith('--')) return property
  return (hyphenatedPropertyCache[property] ||= property.replace(
    /[A-Z]/g,
    (letter) => `-${letter.toLowerCase()}`
  ))
}

function getLifecycleCSSProperties(keys: Set<string> | undefined): string[] {
  if (!keys?.size) return emptyProperties
  const properties = new Set<string>()
  for (const key of keys) {
    for (const property of getCSSProperties(key)) {
      properties.add(hyphenateProperty(property))
    }
  }
  return [...properties].sort()
}

function readComputedProperties(
  node: HTMLElement,
  properties: readonly string[]
): Record<string, string> {
  const computed = getComputedStyle(node)
  const values: Record<string, string> = {}
  for (const property of properties) {
    const value = computed.getPropertyValue(property)
    if (value) values[property] = value
  }
  return values
}

function applyCSSProperties(node: HTMLElement, values: Record<string, string>): void {
  for (const property in values) {
    node.style.setProperty(property, values[property])
  }
}

function clearCSSProperties(node: HTMLElement, properties: readonly string[]): void {
  for (const property of properties) {
    node.style.removeProperty(property)
  }
}

export function createAnimations<A extends object>(animations: A): AnimationDriver<A> {
  return {
    animations,
    usePresence,
    ResetPresence,
    inputStyle: 'css',
    outputStyle: 'css',

    useAnimatedNumber,
    useAnimatedNumberReaction,
    useAnimatedNumberStyle,
    useAnimatedNumbersStyle,

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
      const sendExitCompleteRef = React.useRef(sendExitComplete)
      const lastMountedStyleRef = React.useRef<Record<string, string>>({})
      sendExitCompleteRef.current = sendExitComplete

      const exitCSSProperties = getLifecycleCSSProperties(
        styleState?.programLifecycleStyleKeys?.exit
      )
      const exitCSSPropertiesSignature = exitCSSProperties.join('\0')

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
      if (justStoppedExiting) {
        exitCycleIdRef.current++
      }

      // track previous exiting state
      React.useEffect(() => {
        wasExitingRef.current = isExiting
      })

      // Snapshot the actual mounted CSS values for every property with an exit
      // clause. Most program values live in generated classes rather than the
      // inline `style` object, so computed style is the only complete source.
      // The snapshot becomes the reset point for normal and interrupted exits.
      useIsomorphicLayoutEffect(() => {
        if (isExiting) return
        const host = stateRef.current.host
        if (!host || !exitCSSProperties.length) {
          lastMountedStyleRef.current = {}
          return
        }
        const node = host as HTMLElement
        const capture = () => {
          if (stateRef.current.host !== node || wasExitingRef.current) return
          lastMountedStyleRef.current = readComputedProperties(node, exitCSSProperties)
        }

        // The first mounted layout effect can run while an enter clause is still
        // active. Capture again after that concrete transition settles so a later
        // exit restarts from the mounted value, not the enter value.
        if (justFinishedEntering) {
          void waitForAnimations(node).then(capture)
        } else {
          capture()
        }
      }, [isExiting, justFinishedEntering, exitCSSPropertiesSignature])

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

      let transition: string | undefined
      const getTransition = () => {
        if (transition !== undefined) return transition
        const delay = normalized.delay ? ` ${normalized.delay}ms` : ''
        const duration = normalized.config?.duration
        transition = keys
          .flatMap((key) => {
            const propertyAnimation = normalized.properties[key]
            let animation = defaultAnimation
            if (typeof propertyAnimation === 'string') {
              animation = animations[propertyAnimation]
            } else if (propertyAnimation?.type) {
              animation = animations[propertyAnimation.type]
            }
            if (animation && duration) {
              animation = applyDurationOverride(animation, duration)
            }
            return animation
              ? getCSSProperties(key).map(
                  (property) => `${property} ${animation}${delay}`
                )
              : []
          })
          .join(', ')
        return transition
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
        const completeExit = (finished = true) => {
          if (cycleId !== exitCycleIdRef.current) return
          if (exitCompletedRef.current) return
          exitCompletedRef.current = true
          if (exitStartedRef.current) {
            exitStartedRef.current = false
            emit('end', 'exit', finished)
          }
          sendExitCompleteRef.current?.()
        }

        // if no properties to animate (animateOnly=[]), complete immediately
        if (keys.length === 0) {
          completeExit()
          return
        }

        // React can apply the exit class in the same render batch as the
        // transition. Restart from the last mounted computed values so normal
        // and interrupted exits both produce a concrete browser transition.
        let rafId: number | undefined
        let disposed = false

        const mountedStyle = lastMountedStyleRef.current
        const canRestart =
          exitCSSProperties.length > 0 && Object.keys(mountedStyle).length > 0
        let exitTarget: Record<string, string> | undefined
        if (canRestart) {
          node.style.transition = 'none'
          // With transitions disabled, the exit classes expose their final
          // targets immediately. Capture those, then restore the mounted values.
          exitTarget = readComputedProperties(node, exitCSSProperties)
          applyCSSProperties(node, mountedStyle)
          void node.offsetHeight
          rafId = requestAnimationFrame(() => {
            if (cycleId !== exitCycleIdRef.current) return
            node.style.transition = getTransition()
            void node.offsetHeight
            applyCSSProperties(node, exitTarget!)
          })
        }

        // wait for the browser's concrete animations. this covers `all`,
        // transform aliases, delays, and concurrent WAAPI animations without
        // guessing property names or maintaining a duration timer.
        void waitForAnimations(node).then((finished) => {
          if (!disposed) completeExit(finished)
        })

        return () => {
          disposed = true
          if (rafId !== undefined) cancelAnimationFrame(rafId)
          clearCSSProperties(node, exitCSSProperties)
          // restore transition: the exit handling sets node.style.transition='none'
          // directly on the DOM (bypassing React). if exit is interrupted (e.g. same-key
          // re-entry in AnimatePresence), React won't re-apply its managed transition
          // value because it hasn't changed in the virtual DOM. clearing the inline
          // override lets React's value take effect again.
          node.style.transition = ''
        }
      }, [isExiting, exitCSSPropertiesSignature])

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

      style.transition = getTransition()

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
