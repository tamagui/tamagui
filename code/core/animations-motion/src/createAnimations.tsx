import { getEffectiveAnimation, normalizeTransition } from '@tamagui/animation-helpers'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import {
  type AnimatedNumberStrategy,
  type AnimationDriver,
  fixStyles,
  getConfig,
  getSplitStyles,
  hooks,
  styleToCSS,
  Text,
  TransitionProp,
  type UniversalAnimatedNumber,
  useComposedRefs,
  useIsomorphicLayoutEffect,
  useThemeWithState,
  View,
} from '@tamagui/web'
import {
  type AnimationOptions,
  type AnimationPlaybackControlsWithThen,
  type MotionValue,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
  type ValueTransition,
} from 'motion/react'
import React, {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type MotionAnimatedNumber = MotionValue<number>
type AnimationConfig = ValueTransition

type MotionAnimatedNumberStyle = {
  getStyle: (cur: number) => Record<string, unknown>
  motionValue: MotionValue<number>
}

/**
 * Animation options with optional default and per-property configs.
 * This extends AnimationOptions to support the default key.
 */
type TransitionAnimationOptions = AnimationOptions & {
  default?: ValueTransition
  [propertyName: string]: ValueTransition | undefined
}

const MotionValueStrategy = new WeakMap<MotionValue, AnimatedNumberStrategy>()

// regex to detect non-position transform operations (scale, rotate, skew, matrix, perspective)
// used to identify position-only transforms for the popper animation fix
const nonPositionTransformRe = /scale|rotate|skew|matrix|perspective/

type AnimationProps = {
  doAnimate?: Record<string, unknown>
  dontAnimate?: Record<string, unknown>
  animationOptions?: AnimationOptions
}

// track if we're still in the initial hydration phase
// TODO didnt realize claude took the wrong one here - this should uust be isComponentHydrating ideally
// but this is fine for beta motion driver rc.0 fix in rc.1

export function createAnimations<A extends Record<string, AnimationConfig>>(
  animations: A
): AnimationDriver<A> {
  let isHydratingGlobal: boolean | undefined
  const hydratingComponents = new Set<Function>()

  return {
    // this is only used by Sheet basically for now to pass result of useAnimatedStyle to
    View: MotionView,
    Text: MotionText,
    isReactNative: false,
    supportsCSS: true,
    inputStyle: 'css',
    outputStyle: 'inline',
    avoidReRenders: true,
    animations,
    usePresence,
    ResetPresence,

    onMount() {
      isHydratingGlobal = false
      hydratingComponents.forEach((cb) => cb())
    },

    useAnimations: (animationProps) => {
      if (isHydratingGlobal === undefined && !getConfig().settings.disableSSR) {
        isHydratingGlobal = true
      }

      const { props, style, componentState, stateRef, useStyleEmitter, presence } =
        animationProps

      const animationKey = Array.isArray(props.transition)
        ? props.transition[0]
        : props.transition

      const isComponentHydrating = componentState.unmounted === true
      const isMounting = componentState.unmounted === 'should-enter'
      const isEntering = !!componentState.unmounted
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]

      // Track if we just finished entering (transition from entering to not entering)
      const wasEnteringRef = useRef(isEntering)
      const justFinishedEntering = wasEnteringRef.current && !isEntering
      useEffect(() => {
        wasEnteringRef.current = isEntering
      })

      // Determine animation state for enter/exit transitions
      // Use 'enter' if we're mounting OR if we just finished entering
      const animationState: 'enter' | 'exit' | 'default' = isExiting
        ? 'exit'
        : isMounting || justFinishedEntering
          ? 'enter'
          : 'default'

      // Disable animation during hydration AND during mounting (should-enter phase)
      // This prevents the "flying across the page" effect on initial render
      const disableAnimation = isComponentHydrating || isMounting || !animationKey

      const isFirstRender = useRef(true)
      const [scope, animate] = useAnimate()
      const lastDoAnimate = useRef<Record<string, unknown> | null>(null)
      const controls = useRef<AnimationPlaybackControlsWithThen | null>(null)
      const styleKey = JSON.stringify(style)

      // exit cycle guards to prevent stale/duplicate completion
      const exitCycleIdRef = useRef(0)
      const pendingExitCountsRef = useRef<Map<string, number>>(new Map())
      const exitCompletedRef = useRef(false)
      const wasExitingRef = useRef(false)
      const completionScheduledRef = useRef(false)

      // detect transition into exiting state
      const justStartedExiting = isExiting && !wasExitingRef.current
      const justStoppedExiting = !isExiting && wasExitingRef.current

      // start new exit cycle only on transition INTO exiting
      if (justStartedExiting) {
        exitCycleIdRef.current++
        pendingExitCountsRef.current.clear()
        exitCompletedRef.current = false
        completionScheduledRef.current = false
      }
      // invalidate pending callbacks when exit is canceled/interrupted
      if (justStoppedExiting) {
        exitCycleIdRef.current++
        pendingExitCountsRef.current.clear()
        completionScheduledRef.current = false
      }

      // helper to mark a key as done - uses macrotask deferral for robust timing
      const markExitKeyDone = (key: string, cycleId: number) => {
        if (cycleId !== exitCycleIdRef.current) return
        if (exitCompletedRef.current) return

        const pending = pendingExitCountsRef.current
        const currentCount = pending.get(key) ?? 0
        if (currentCount <= 1) {
          pending.delete(key)
        } else {
          pending.set(key, currentCount - 1)
        }

        // defer completion check by one macrotask to handle async state/effects/scheduler
        if (pending.size === 0 && !completionScheduledRef.current) {
          completionScheduledRef.current = true
          setTimeout(() => {
            // re-check after macrotask in case new animations were registered
            if (
              cycleId === exitCycleIdRef.current &&
              !exitCompletedRef.current &&
              pendingExitCountsRef.current.size === 0
            ) {
              exitCompletedRef.current = true
              sendExitComplete?.()
            }
            completionScheduledRef.current = false
          }, 0)
        }
      }

      // track previous exiting state
      useEffect(() => {
        wasExitingRef.current = isExiting
      })

      // until fully stable allow debugging in prod to help debugging prod issues
      const shouldDebug =
        // process.env.NODE_ENV === 'development' &&
        props['debug'] && props['debug'] !== 'profile'

      const {
        dontAnimate = {},
        doAnimate,
        animationOptions,
      } = useMemo(() => {
        const motionAnimationState = getMotionAnimatedProps(
          props as any,
          style,
          disableAnimation,
          animationState
        )
        return motionAnimationState
      }, [isExiting, animationKey, styleKey, animationState, disableAnimation])

      const id = useId()
      const debugId = process.env.NODE_ENV === 'development' ? id : ''
      const lastAnimateAt = useRef(0)
      const disposed = useRef(false)
      const [firstRenderStyle] = useState(style)

      // avoid first render returning wrong styles - always render all, after that we can just mutate
      const lastDontAnimate = useRef<Record<string, unknown> | null>(firstRenderStyle)
      const [isHydrating, setIsHydrating] = useState(isHydratingGlobal)

      useLayoutEffect(() => {
        if (isHydratingGlobal) {
          hydratingComponents.add(() => {
            setIsHydrating(false)
          })
        }
        return () => {
          disposed.current = true
        }
      }, [])

      const flushAnimation = ({
        doAnimate = {},
        animationOptions = {},
        dontAnimate,
      }: AnimationProps) => {
        // track whether THIS flush starts a new animation (vs using stale controls)
        let startedControls: AnimationPlaybackControlsWithThen | null = null

        try {
          const node = stateRef.current.host

          // on first render, reset stale animation refs - they can persist if component
          // instance is reused (e.g. AnimatePresence keepChildrenMounted)
          if (isFirstRender.current) {
            lastDontAnimate.current = null
            lastDoAnimate.current = null
          }

          if (shouldDebug) {
            console.groupCollapsed(
              `[motion] ${debugId} 🌊 animate (${JSON.stringify(getDiff(lastDoAnimate.current, doAnimate), null, 2)})`
            )
            console.info({
              props,
              componentState,
              doAnimate,
              dontAnimate,
              animationOptions,
              animationProps,
              lastDoAnimate: { ...lastDoAnimate.current },
              lastDontAnimate: { ...lastDontAnimate.current },
              isExiting,
              style,
              node,
            })
            console.groupCollapsed(`trace >`)
            console.trace()
            console.groupEnd()
            console.groupEnd()
          }

          if (!(node instanceof HTMLElement)) {
            return
          }

          // handle case where dontAnimate changes
          // we just set it onto animate + set options to not actually animate
          const prevDont = lastDontAnimate.current
          if (dontAnimate) {
            if (prevDont) {
              // Pass doAnimate as preserve to prevent clearing styles that moved to doAnimate
              removeRemovedStyles(prevDont, dontAnimate, node, doAnimate)
              const changed = getDiff(prevDont, dontAnimate)
              if (changed) {
                Object.assign(node.style, changed as any)
              }
            } else {
              // First time - apply directly without diff check
              Object.assign(node.style, dontAnimate as any)
            }
          }

          if (doAnimate) {
            // bugfix: going from non-animated to animated in motion -
            // motion batches things so the above removal can happen a frame before causing flickering
            // we see this with tooltips, this is not an ideal solution though, ideally we can remove/update
            // in the same batch/frame as motion
            // Also sync motion's internal state for properties moving from dontAnimate to doAnimate
            if (prevDont) {
              const movedToAnimate: Record<string, unknown> = {}
              for (const key in prevDont) {
                if (key in doAnimate) {
                  node.style[key] = prevDont[key]
                  movedToAnimate[key] = prevDont[key]
                  // Also update lastDoAnimate to include the previous value
                  // This prevents animating from undefined to the current value
                  // when a property transitions from dontAnimate to doAnimate
                  if (lastDoAnimate.current) {
                    lastDoAnimate.current[key] = prevDont[key]
                  }
                }
              }
              // Sync motion's internal state for moved properties
              if (Object.keys(movedToAnimate).length > 0) {
                const fixed = fixTransparentColors({ ...movedToAnimate }, null, doAnimate)
                animate(scope.current, fixed, { duration: 0 })
              }
            }

            const lastAnimated = lastDoAnimate.current
            if (lastAnimated) {
              // Pass dontAnimate as third arg to prevent clearing styles that moved to dontAnimate
              removeRemovedStyles(lastAnimated, doAnimate, node, dontAnimate)
            }

            const diff = getDiff(lastDoAnimate.current, doAnimate)
            if (diff) {
              // FIX: Handle animation interruption for position-only animations
              // Only apply this fix when:
              // 1. There's a running animation
              // 2. The transform change is POSITION-ONLY (just translate, no scale/rotate/skew)
              // 3. animatePosition is being used (Popper/Tooltip pattern)
              // This fixes tooltip position jumping without breaking AnimatePresence scale/rotate animations
              // NOTE: We check for animatePosition to avoid this fix causing jitter
              // on components like the TAMAGUI logo dot indicator which also use translate-only transforms

              const isRunning =
                /**
                 * TypeError: Cannot read properties of undefined (reading 'state')
                 * at GroupAnimationWithThen.getAll (http://localhost:8081/node_modules/.vite/deps/@tamagui_config_v5-motion.js?v=d717d926:2374:30)
                 * at get state (http://localhost:8081/node_modules/.vite/deps/@tamagui_config_v5-motion.js?v=d717d926:2403:17)
                 * at flushAnimation (http://localhost:8081/node_modules/.vite/deps/@tamagui_config_v5-motion.js?v=d717d926:9686:49)
                 **/
                // @ts-expect-error it is there, and for some crazy reason in ~/chat pretty often i get errors ^
                controls.current?.animations?.length === 0
                  ? false
                  : controls.current?.state === 'running'
              const targetTransform =
                typeof diff.transform === 'string' ? diff.transform : null

              // only apply position fix for translate-only transforms
              const isPositionOnlyTransform =
                targetTransform &&
                targetTransform.includes('translate') &&
                !nonPositionTransformRe.test(targetTransform)

              // Position fix for Popper/Tooltip elements with animatePosition.
              // Only apply when:
              // 1. Animation is actively running
              // 2. Transform is position-only (translate without scale/rotate/etc)
              // 3. Element has data-popper-animate-position attribute (set by Popper when
              //    animatePosition is true)
              //
              // The issue: when a Popper animation is interrupted mid-flight, motion's
              // animate() may start from wrong position causing jumps to origin.
              //
              // Why check data-popper-animate-position: This attribute is ONLY set on Popper
              // elements that explicitly use animatePosition. Regular
              // components like the logo Circle don't have this attribute, so they won't
              // get this fix applied (which would cause jitter due to getComputedStyle
              // overhead on rapid updates).

              // check if this is a Popper element with animated position
              const isPopperElement = node.hasAttribute('data-popper-animate-position')

              // also apply fix for AnimatePresence children that just finished entering
              // this fixes roving tabs indicator jumping when rapidly switching
              const isEnteringPresenceChild = presence && justFinishedEntering

              if (
                isRunning &&
                controls.current &&
                isPositionOnlyTransform &&
                (isPopperElement || isEnteringPresenceChild)
              ) {
                const currentTransform = getComputedStyle(node).transform

                if (currentTransform && currentTransform !== 'none') {
                  const matrixMatch = currentTransform.match(
                    /matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),\s*([^)]+)\)/
                  )

                  if (matrixMatch) {
                    // stop animation and preserve current position
                    controls.current.stop()
                    node.style.transform = currentTransform

                    // animate from current matrix position to target
                    const currentX = Number.parseFloat(matrixMatch[1])
                    const currentY = Number.parseFloat(matrixMatch[2])
                    const keyframeDiff = {
                      ...diff,
                      transform: [
                        `translateX(${currentX}px) translateY(${currentY}px)`,
                        targetTransform,
                      ],
                    }

                    startedControls = animate(
                      scope.current,
                      keyframeDiff,
                      animationOptions
                    )
                    controls.current = startedControls
                    lastAnimateAt.current = Date.now()
                    lastDontAnimate.current = dontAnimate ? { ...dontAnimate } : {}
                    lastDoAnimate.current = doAnimate ? { ...doAnimate } : {}
                    return
                  }
                }
              }

              // IMPORTANT: Spread to create mutable copy - style objects may be frozen
              // fix transparent colors to use rgba for motion.dev compatibility
              const fixedDiff = fixTransparentColors(
                { ...diff },
                lastDoAnimate.current,
                doAnimate
              )

              startedControls = animate(scope.current, fixedDiff, animationOptions)
              controls.current = startedControls
              lastAnimateAt.current = Date.now()
            }
          }

          // IMPORTANT: Spread to create mutable copies - objects may be frozen
          lastDontAnimate.current = dontAnimate ? { ...dontAnimate } : {}
          lastDoAnimate.current = doAnimate ? { ...doAnimate } : {}
        } finally {
          if (isExiting && sendExitComplete) {
            const cycleId = exitCycleIdRef.current

            // only track completion if we actually started an animation in THIS flush
            if (startedControls) {
              // register keys for this specific animation
              const exitKeys = doAnimate ? Object.keys(doAnimate) : []
              for (const key of exitKeys) {
                pendingExitCountsRef.current.set(
                  key,
                  (pendingExitCountsRef.current.get(key) ?? 0) + 1
                )
              }

              // wait on the animation we just started, not a stale reference
              startedControls.finished
                .then(() => {
                  for (const key of exitKeys) {
                    markExitKeyDone(key, cycleId)
                  }
                })
                .catch(() => {
                  // animation was canceled, still complete
                  for (const key of exitKeys) {
                    markExitKeyDone(key, cycleId)
                  }
                })
            } else if (
              pendingExitCountsRef.current.size === 0 &&
              !exitCompletedRef.current &&
              !completionScheduledRef.current
            ) {
              // no animation started and no pending keys - defer by macrotask
              completionScheduledRef.current = true
              setTimeout(() => {
                if (
                  cycleId === exitCycleIdRef.current &&
                  !exitCompletedRef.current &&
                  pendingExitCountsRef.current.size === 0
                ) {
                  exitCompletedRef.current = true
                  sendExitComplete()
                }
                completionScheduledRef.current = false
              }, 0)
            }
          }
        }
      }

      useStyleEmitter?.((nextStyle, effectiveTransition) => {
        // effectiveTransition is computed in createComponent based on entering/exiting pseudo states
        const animationProps = getMotionAnimatedProps(
          props as any,
          nextStyle,
          disableAnimation,
          animationState,
          effectiveTransition
        )

        flushAnimation(animationProps)
      })

      useIsomorphicLayoutEffect(() => {
        if (isFirstRender.current) {
          isFirstRender.current = false

          // during hydration, use full sync logic to prevent flash
          // doing this - will fix some of the enter (accordion) glitches but breaks animatepresence
          //  isHydrating || (isMounting && !isEntering)
          if (isHydrating) {
            const node = stateRef.current.host

            if (node instanceof HTMLElement) {
              // IMPORTANT: On first render, we need to:
              // 1. Apply dontAnimate styles to the DOM (enterStyle values like scale(0))
              // 2. Tell motion about these styles so it knows the starting state
              // This ensures AnimatePresence enter animations work correctly.

              if (dontAnimate) {
                // Apply initial styles to DOM
                Object.assign(node.style, dontAnimate as any)

                // Tell motion about the initial state by animating instantly to dontAnimate
                // This syncs motion's internal state with what's actually on the DOM
                // IMPORTANT: Spread to create mutable copy - React/Tamagui style objects may be frozen
                const fixedDont = fixTransparentColors(
                  { ...dontAnimate },
                  null,
                  doAnimate
                )
                animate(scope.current, fixedDont, { duration: 0 })
              }

              // If there are styles to animate, set them up (but animation is disabled on first render)
              if (doAnimate && Object.keys(doAnimate).length > 0) {
                // IMPORTANT: Spread to create mutable copy - objects may be frozen
                lastDoAnimate.current = { ...doAnimate }
                const fixedDo = fixTransparentColors({ ...doAnimate }, dontAnimate)
                animate(scope.current, fixedDo, { duration: 0 })
              } else {
                // doAnimate is empty, so track dontAnimate as the initial animated state
                // This way on next render, getDiff will detect the change
                // IMPORTANT: Spread to create mutable copy - objects may be frozen
                lastDoAnimate.current = dontAnimate ? { ...dontAnimate } : {}
              }
            }

            // IMPORTANT: Spread to create mutable copy - objects may be frozen
            lastDontAnimate.current = dontAnimate ? { ...dontAnimate } : {}
            lastAnimateAt.current = Date.now()
            return
          }

          // after hydration, use simpler logic
          lastDontAnimate.current = dontAnimate ? { ...dontAnimate } : {}
          lastDoAnimate.current = doAnimate ? { ...doAnimate } : {}
          return
        }

        // don't ever queue on a render
        flushAnimation({
          doAnimate,
          dontAnimate,
          animationOptions,
        })
      }, [styleKey, isExiting, disableAnimation])

      if (shouldDebug) {
        console.groupCollapsed(`[motion] 🌊 render`)
        console.info({
          style,
          doAnimate,
          dontAnimate,
          styleKey,
          scope,
          animationOptions,
          isExiting,
          isFirstRender: isFirstRender.current,
          animationProps,
        })
        console.groupEnd()
      }

      return {
        // we never change this, after first render on
        style: firstRenderStyle,
        ref: scope,
        render: 'div',
      }
    },

    useAnimatedNumber(initial): UniversalAnimatedNumber<MotionAnimatedNumber> {
      const motionValue = useMotionValue(initial)

      return React.useMemo(
        () => ({
          getInstance() {
            return motionValue
          },
          getValue() {
            return motionValue.get()
          },
          setValue(next, config = { type: 'spring' }, onFinish) {
            if (config.type === 'direct') {
              MotionValueStrategy.set(motionValue, {
                type: 'direct',
              })
              motionValue.set(next)
              onFinish?.()
            } else {
              MotionValueStrategy.set(motionValue, config)

              if (onFinish) {
                const unsubscribe = motionValue.on('change', (value) => {
                  if (Math.abs(value - next) < 0.01) {
                    unsubscribe()
                    onFinish()
                  }
                })
              }

              motionValue.set(next)
              // Motion doesn't have a direct onFinish callback, so we simulate it
            }
          },
          stop() {
            motionValue.stop()
          },
        }),
        [motionValue]
      )
    },

    useAnimatedNumberReaction({ value }, onValue) {
      const instance = value.getInstance() as MotionValue<number>
      useMotionValueEvent(instance, 'change', onValue)
    },

    useAnimatedNumberStyle(val, getStyleProp) {
      const motionValue = val.getInstance() as MotionValue<number>
      const getStyleRef = useRef<typeof getStyleProp>(getStyleProp)

      // we need to change useAnimatedNumberStyle to have dep args to be concurrent safe
      getStyleRef.current = getStyleProp

      // never changes
      return useMemo(() => {
        return {
          getStyle: (cur) => {
            return getStyleRef.current(cur)
          },
          motionValue,
        } satisfies MotionAnimatedNumberStyle
      }, [])
    },
  }

  function getMotionAnimatedProps(
    props: { transition?: TransitionProp | null; animateOnly?: string[] },
    style: Record<string, unknown>,
    disable: boolean,
    animationState: 'enter' | 'exit' | 'default' = 'default',
    transitionOverride?: TransitionProp | null
  ): AnimationProps {
    if (disable) {
      return {
        dontAnimate: style,
      }
    }

    const animationOptions = getAnimationOptions(
      transitionOverride ?? props.transition ?? null,
      animationState
    )

    let dontAnimate: Record<string, unknown> | undefined
    let doAnimate: Record<string, unknown> | undefined

    const animateOnly = props.animateOnly as string[] | undefined
    for (const key in style) {
      const value = style[key]
      if (disableAnimationProps.has(key) || (animateOnly && !animateOnly.includes(key))) {
        dontAnimate ||= {}
        dontAnimate[key] = value
      } else {
        doAnimate ||= {}
        doAnimate[key] = value
      }
    }

    return {
      dontAnimate,
      doAnimate,
      animationOptions,
    }
  }

  function getAnimationOptions(
    transitionProp: TransitionProp | null,
    animationState: 'enter' | 'exit' | 'default' = 'default'
  ): TransitionAnimationOptions {
    const normalized = normalizeTransition(transitionProp)

    // Get the effective animation key based on enter/exit/default state
    const effectiveKey = getEffectiveAnimation(normalized, animationState)

    // Copy global config overrides (will be converted by convertMsToS at the end)
    const globalConfigOverride: Record<string, unknown> | undefined = normalized.config
      ? { ...normalized.config }
      : undefined

    // If no animation defined, return empty config
    // but check for inline config too (e.g., transition={{ duration: 1 }})
    if (
      !effectiveKey &&
      Object.keys(normalized.properties).length === 0 &&
      !globalConfigOverride
    ) {
      return {}
    }

    const defaultConfig = effectiveKey ? withInferredType(animations[effectiveKey]) : null

    // NOTE: delay and duration are in ms here; convertMsToS will handle conversion at the end
    const delay = normalized.delay

    // Build the animation options
    // Framer Motion's animate() expects default config at the TOP LEVEL, not nested under 'default'
    // Per-property configs can be nested under property names like { scale: { duration: 1 } }
    const result: TransitionAnimationOptions = {}

    // Apply base config from preset at top level (this is what animate() reads as default)
    if (defaultConfig) {
      Object.assign(result, defaultConfig)
    }

    // Apply global spring config overrides at top level
    // If we only have inline config (no preset), infer the type
    if (globalConfigOverride) {
      Object.assign(result, globalConfigOverride)
      // infer type if not set and this looks like timing-based (has duration, no spring params)
      if (
        result.type === undefined &&
        result.duration !== undefined &&
        result.damping === undefined &&
        result.stiffness === undefined &&
        result.mass === undefined
      ) {
        result.type = 'tween'
      }
    }

    // Apply delay at top level
    if (delay) {
      result.delay = delay
    }

    // Also set the 'default' key for backwards compatibility with per-property fallback logic
    if (defaultConfig || globalConfigOverride || delay) {
      result.default = {
        ...defaultConfig,
        ...globalConfigOverride,
        ...(delay ? { delay } : null),
      }
    }

    // Add property-specific animations
    for (const [propName, animationNameOrConfig] of Object.entries(
      normalized.properties
    )) {
      if (typeof animationNameOrConfig === 'string') {
        result[propName] = withInferredType(animations[animationNameOrConfig])
      } else if (animationNameOrConfig && typeof animationNameOrConfig === 'object') {
        const baseConfig = animationNameOrConfig.type
          ? withInferredType(animations[animationNameOrConfig.type])
          : defaultConfig

        // @ts-expect-error
        result[propName] = {
          ...baseConfig,
          ...animationNameOrConfig,
        }
      }
    }

    // we standardize to ms across drivers, motion expects s
    // convert top-level config (what animate() reads directly)
    convertMsToS(result as ValueTransition)
    // also convert default and per-property configs
    convertMsToS(result.default)
    for (const key in result) {
      if (key !== 'default' && typeof result[key] === 'object') {
        convertMsToS(result[key])
      }
    }

    return result
  }
}

// infer type from config shape if not explicitly set, always returns a copy
function withInferredType(config: AnimationConfig | undefined): AnimationConfig {
  if (!config) {
    return { type: 'spring' }
  }
  const isTimingBased =
    config.duration !== undefined &&
    config.damping === undefined &&
    config.stiffness === undefined &&
    config.mass === undefined
  return { type: isTimingBased ? 'tween' : 'spring', ...config }
}

// convert timing values from ms to s (motion expects seconds)
// delay applies to all animation types; duration applies to tweens
function convertMsToS(config: ValueTransition | undefined) {
  if (!config) return
  // delay applies to all animation types
  if (typeof config.delay === 'number') config.delay = config.delay / 1000
  // duration applies to tweens - either explicit type='tween' or implicit
  // (has duration but no spring params = timing-based animation)
  if (typeof config.duration === 'number') {
    const isTimingBased =
      config.type === 'tween' ||
      (config.type === undefined &&
        config.damping === undefined &&
        config.stiffness === undefined &&
        config.mass === undefined)
    if (isTimingBased) {
      config.duration = config.duration / 1000
    }
  }
}

function removeRemovedStyles(
  prev: object,
  next: object,
  node: HTMLElement,
  dontClearIfIn?: object
) {
  for (const key in prev) {
    if (!(key in next)) {
      // Don't clear if the style is now in dontAnimate (moved from animated to non-animated)
      if (dontClearIfIn && key in dontClearIfIn) {
        continue
      }
      node.style[key] = ''
    }
  }
}

// sort of temporary
const disableAnimationProps = new Set<string>([
  'alignContent',
  'alignItems',
  'aspectRatio',
  'backdropFilter',
  'boxSizing',
  'contain',
  'containerType',
  'display',
  'flexBasis',
  'flexDirection',
  'flexGrow',
  'flexShrink',
  'fontFamily',
  'justifyContent',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'overflow',
  'overflowX',
  'overflowY',
  'pointerEvents',
  'position',
  'textWrap',
  'transformOrigin',
  'userSelect',
  'WebkitBackdropFilter',
  'zIndex',
])

const MotionView = createMotionView('div')
const MotionText = createMotionView('span')

function createMotionView(defaultTag: string) {
  // return forwardRef((props: any, ref) => {
  //   console.info('rendering?', props)
  //   const Element = motion[props.render || defaultTag]
  //   return <Element ref={ref} {...props} />
  // })
  const isText = defaultTag === 'span'

  const Component = forwardRef((propsIn: any, ref) => {
    const { forwardedRef, animation, render = defaultTag, style, ...propsRest } = propsIn
    const [scope, animate] = useAnimate()
    const hostRef = useRef<HTMLElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref, hostRef, scope)

    const stateRef = useRef<any>(null)
    if (!stateRef.current) {
      stateRef.current = {
        get host() {
          return hostRef.current
        },
      }
    }

    const [_, state] = useThemeWithState({})

    const styles = Array.isArray(style) ? style : [style]

    // we can assume just one animatedStyle max for now
    const [animatedStyle, nonAnimatedStyles] = (() => {
      return [
        styles.find((x) => x.getStyle) as MotionAnimatedNumberStyle | undefined,
        styles.filter((x) => !x.getStyle),
      ] as const
    })()

    function getProps(props: any) {
      const out = getSplitStyles(
        props,
        isText ? Text.staticConfig : View.staticConfig,
        state?.theme,
        state?.name,
        {
          unmounted: false,
        },
        {
          isAnimated: false,
          noClass: true,
          // noMergeStyle: true,
          resolveValues: 'auto',
        }
      )

      if (!out) {
        return {}
      }

      // we can definitely get rid of this here
      if (out.viewProps.style) {
        fixStyles(out.viewProps.style)
        styleToCSS(out.viewProps.style)
      }

      return out.viewProps
    }

    const props = getProps({ ...propsRest, style: nonAnimatedStyles })
    const Element = render || 'div'
    const transformedProps = hooks.usePropsTransform?.(render, props, stateRef, false)

    useEffect(() => {
      if (!animatedStyle) return

      return animatedStyle.motionValue.on('change', (value) => {
        const nextStyle = animatedStyle.getStyle(value)
        const animationConfig = MotionValueStrategy.get(animatedStyle.motionValue)
        const node = hostRef.current

        const webStyle = getProps({ style: nextStyle }).style

        if (webStyle && node instanceof HTMLElement) {
          const motionAnimationConfig =
            animationConfig?.type === 'timing'
              ? {
                  type: 'tween',
                  duration: (animationConfig?.duration || 0) / 1000,
                }
              : animationConfig?.type === 'direct'
                ? { type: 'tween', duration: 0 }
                : {
                    type: 'spring',
                    ...(animationConfig as any),
                  }

          animate(node, webStyle as any, motionAnimationConfig)
        }
      })
    }, [animatedStyle])

    return <Element {...transformedProps} ref={composedRefs} />
  })

  Component['acceptRenderProp'] = true

  return Component
}

function getDiff<T extends Record<string, unknown>>(
  previous: T | null,
  next: T
): Record<string, unknown> | null {
  if (!previous) {
    return next
  }

  let diff: Record<string, unknown> | null = null
  for (const key in next) {
    if (next[key] !== previous[key]) {
      diff ||= {}
      diff[key] = next[key]
    }
  }
  return diff
}

// motion.dev can't animate to "transparent" - convert it to rgba
// try to extract RGB from previous or next value for smooth color transitions
function fixTransparentColors(
  diff: Record<string, unknown>,
  previous: Record<string, unknown> | null,
  next?: Record<string, unknown> | null
): Record<string, unknown> {
  let result = diff
  for (const key in diff) {
    if (diff[key] === 'transparent') {
      let fixed = 'rgba(0, 0, 0, 0)'
      // try previous value first, then next value
      const candidates = [previous?.[key], next?.[key]]
      for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate !== 'transparent') {
          // match rgba(r, g, b, a) or rgb(r, g, b)
          const rgbaMatch = candidate.match(/^rgba?\(([^,]+),\s*([^,]+),\s*([^,)]+)/)
          if (rgbaMatch) {
            fixed = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, 0)`
            break
          }
        }
      }
      if (result === diff) {
        result = { ...diff }
      }
      result[key] = fixed
    }
  }
  return result
}
