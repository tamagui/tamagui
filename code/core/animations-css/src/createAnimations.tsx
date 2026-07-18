import {
  normalizeTransition,
  getAnimatedProperties,
  hasAnimation as hasNormalizedAnimation,
  getEffectiveAnimation,
} from '@tamagui/animation-helpers'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import type {
  AnimatedNumberStrategy,
  AnimationDriver,
  UniversalAnimatedNumber,
} from '@tamagui/web'
import { transformsToString } from '@tamagui/web'
import React from 'react'
import { unstable_batchedUpdates } from 'react-dom'

// rAF-driven animated number is browser-only. read (don't call) at module scope
// so ssr never touches requestAnimationFrame.
const hasRAF = typeof requestAnimationFrame !== 'undefined'
const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())

// spring params use the same names/semantics as react-native Animated, so an
// explicit transitionConfig (stiffness/damping/mass) feels the same across
// drivers. defaults are critically damped (zeta ~1) rather than RN's bouncy
// 100/10: a css consumer that supplies no spring params gets a clean, prompt,
// non-oscillating settle instead of ringing for ~1.4s. rest-detection thresholds
// are sub-pixel by default; the sheet passes px-sized overrides.
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

const getCSSProperty = (key: string) => (TRANSFORM_KEYS.has(key) ? 'transform' : key)

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

type CSSAnimatedNumberInstance = {
  current: number
  target: number
  listeners: Set<(value: number) => void>
  styleHost: object | null
  raf: number | null
  finish: (() => void) | null
  renderTarget: () => void
  cancel: () => void
}

type CSSAnimatedNumber = UniversalAnimatedNumber<CSSAnimatedNumberInstance>

function notifyAnimatedNumber(instance: CSSAnimatedNumberInstance, value: number) {
  instance.current = value
  if (instance.listeners.size === 0) return
  unstable_batchedUpdates(() => {
    for (const listener of instance.listeners) listener(value)
  })
}

function useAnimatedNumberStyles(
  values: CSSAnimatedNumber[],
  getStyle: (...current: number[]) => any
) {
  const token = React.useRef<object>(null)
  token.current ||= {}
  const [, renderLinkedValue] = React.useReducer((value) => value + 1, 0)
  const instances = values.map((value) => value.getInstance())
  const hostValues = instances.map((instance) => {
    if (!instance.styleHost) instance.styleHost = token.current
    return instance.styleHost === token.current
  })

  React.useEffect(() => {
    const listener = () => renderLinkedValue()
    for (let index = 0; index < instances.length; index++) {
      if (!hostValues[index]) instances[index].listeners.add(listener)
    }
    return () => {
      for (const instance of instances) {
        instance.listeners.delete(listener)
        if (instance.styleHost === token.current) instance.styleHost = null
      }
    }
  }, instances)

  return getStyle(
    ...instances.map((instance, index) =>
      hostValues[index] ? instance.target : instance.current
    )
  )
}

export function createAnimations<A extends object>(animations: A): AnimationDriver<A> {
  return {
    animations,
    usePresence,
    ResetPresence,
    inputStyle: 'css',
    outputStyle: 'css',

    useAnimatedNumber(initial): CSSAnimatedNumber {
      const [, renderTarget] = React.useReducer((value) => value + 1, 0)
      const instanceRef = React.useRef<CSSAnimatedNumberInstance>(null)

      if (!instanceRef.current) {
        instanceRef.current = {
          current: initial,
          target: initial,
          listeners: new Set(),
          styleHost: null,
          raf: null,
          finish: null,
          renderTarget,
          cancel() {
            if (this.raf !== null) cancelAnimationFrame(this.raf)
            this.raf = null
            this.finish = null
          },
        }
      }

      const instance = instanceRef.current
      instance.renderTarget = renderTarget
      React.useEffect(() => () => instance.cancel(), [instance])

      return React.useMemo(
        () => ({
          getInstance() {
            return instance
          },
          getValue() {
            return instance.current
          },
          setValue(next, config = { type: 'spring' }, onFinish) {
            instance.cancel()
            const from = instance.current
            instance.target = next
            if (instance.styleHost) instance.renderTarget()

            if (
              !hasRAF ||
              config.type === 'direct' ||
              (config.type === 'timing' && config.duration === 0) ||
              from === next
            ) {
              notifyAnimatedNumber(instance, next)
              onFinish?.()
              return
            }

            // css transitions interpolate the host. js only ticks when a
            // reaction, linked style, or completion callback needs live values.
            if (instance.listeners.size === 0 && !onFinish) {
              instance.current = next
              return
            }

            instance.finish = onFinish ?? null
            const settle = () => {
              instance.raf = null
              notifyAnimatedNumber(instance, next)
              const finish = instance.finish
              instance.finish = null
              finish?.()
            }

            if (config.type === 'timing') {
              const startedAt = nowMs()
              const tick = () => {
                const progress = Math.min(1, (nowMs() - startedAt) / config.duration)
                if (progress === 1) {
                  settle()
                  return
                }
                notifyAnimatedNumber(instance, from + (next - from) * progress)
                instance.raf = requestAnimationFrame(tick)
              }
              instance.raf = requestAnimationFrame(tick)
              return
            }

            const spring = config as Extract<AnimatedNumberStrategy, { type: 'spring' }>
            const stiffness = spring.stiffness ?? SPRING_DEFAULTS.stiffness
            const damping = spring.damping ?? SPRING_DEFAULTS.damping
            const mass = spring.mass ?? SPRING_DEFAULTS.mass
            const overshootClamping =
              spring.overshootClamping ?? SPRING_DEFAULTS.overshootClamping
            const restSpeed =
              spring.restSpeedThreshold ?? SPRING_DEFAULTS.restSpeedThreshold
            const restDisplacement =
              spring.restDisplacementThreshold ??
              SPRING_DEFAULTS.restDisplacementThreshold
            const displacement = from - next
            const decayRate = damping / (2 * mass)
            const naturalFrequency = Math.sqrt(stiffness / mass)
            const startedAt = nowMs()

            const getSpringState = (elapsed: number) => {
              if (decayRate < naturalFrequency) {
                const dampedFrequency = Math.sqrt(naturalFrequency ** 2 - decayRate ** 2)
                const b = (decayRate * displacement) / dampedFrequency
                const decay = Math.exp(-decayRate * elapsed)
                const cos = Math.cos(dampedFrequency * elapsed)
                const sin = Math.sin(dampedFrequency * elapsed)
                return {
                  value: next + decay * (displacement * cos + b * sin),
                  velocity:
                    decay *
                    ((-decayRate * displacement + b * dampedFrequency) * cos +
                      (-decayRate * b - displacement * dampedFrequency) * sin),
                }
              }

              if (decayRate === naturalFrequency) {
                const b = decayRate * displacement
                const decay = Math.exp(-decayRate * elapsed)
                return {
                  value: next + (displacement + b * elapsed) * decay,
                  velocity: (b - decayRate * (displacement + b * elapsed)) * decay,
                }
              }

              const frequency = Math.sqrt(decayRate ** 2 - naturalFrequency ** 2)
              const slowRoot = -decayRate + frequency
              const fastRoot = -decayRate - frequency
              const slowCoefficient = (-fastRoot * displacement) / (slowRoot - fastRoot)
              const fastCoefficient = displacement - slowCoefficient
              return {
                value:
                  next +
                  slowCoefficient * Math.exp(slowRoot * elapsed) +
                  fastCoefficient * Math.exp(fastRoot * elapsed),
                velocity:
                  slowCoefficient * slowRoot * Math.exp(slowRoot * elapsed) +
                  fastCoefficient * fastRoot * Math.exp(fastRoot * elapsed),
              }
            }

            const tick = () => {
              const state = getSpringState((nowMs() - startedAt) / 1000)
              let { value, velocity } = state

              if (
                overshootClamping &&
                ((from < next && value > next) || (from > next && value < next))
              ) {
                value = next
                velocity = 0
              }

              if (
                Math.abs(velocity) <= restSpeed &&
                Math.abs(next - value) <= restDisplacement
              ) {
                settle()
                return
              }

              notifyAnimatedNumber(instance, value)
              instance.raf = requestAnimationFrame(tick)
            }
            instance.raf = requestAnimationFrame(tick)
          },
          stop() {
            instance.cancel()
          },
        }),
        [instance]
      )
    },

    useAnimatedNumberReaction({ value }, onValue) {
      const onValueRef = React.useRef(onValue)
      onValueRef.current = onValue
      React.useEffect(() => {
        const instance = value.getInstance() as CSSAnimatedNumberInstance
        const listener = (current: number) => onValueRef.current(current)
        instance.listeners.add(listener)
        return () => {
          instance.listeners.delete(listener)
        }
      }, [value])
    },

    useAnimatedNumberStyle(val, getStyle) {
      return useAnimatedNumberStyles([val as CSSAnimatedNumber], getStyle)
    },

    useAnimatedNumbersStyle(vals, getStyle) {
      return useAnimatedNumberStyles(vals as CSSAnimatedNumber[], getStyle)
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

      if (!isExiting) {
        lastNonExitingStyleRef.current.opacity = String(
          style?.opacity ?? props.opacity ?? 1
        )
      }

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

        // Force transition restart for interrupted exits
        // When an exit is interrupted and restarted, the element may already be at
        // the exit style, so no CSS transition fires. We need to:
        // 1. Reset to non-exit state
        // 2. Force reflow
        // 3. Re-apply exit state to trigger transition
        let rafId: number | undefined
        let disposed = false
        const wasInterrupted = exitInterruptedRef.current
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
            return animationValue
              ? `${getCSSProperty(key)} ${animationValue}${delayStr}`
              : null
          })
          .filter(Boolean)
          .join(', ')

        const getResetValue = (key: string) => {
          if (key === 'opacity') {
            return (
              lastNonExitingStyleRef.current.opacity ??
              props.opacity ??
              style?.opacity ??
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
          })
        }

        // For interrupted exits, re-enable transition and re-apply exit styles
        if (wasInterrupted) {
          rafId = requestAnimationFrame(() => {
            if (cycleId !== exitCycleIdRef.current) return
            // re-enable transition using the pre-built string
            node.style.transition = exitTransitionString
            // force reflow again
            void node.offsetHeight
            // now apply exit styles - this triggers the transition
            applyStylesToNode(node, exitStyle)
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

          return animationValue
            ? `${getCSSProperty(key)} ${animationValue}${delayStr}`
            : null
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
