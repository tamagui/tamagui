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
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

const isServer = typeof window === 'undefined'

// SSR-safe wrapper: framer-motion's useAnimate imports its own React copy in
// Vite SSR bundles which causes "Invalid hook call" errors. during SSR we
// don't need animations so we return a no-op scope/animate pair.
function useAnimateSSRSafe() {
  if (isServer) {
    return [useRef(null), (() => {}) as any] as ReturnType<typeof useAnimate>
  }
  return useAnimate()
}

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

type AnimationProps = {
  doAnimate?: Record<string, unknown>
  dontAnimate?: Record<string, unknown>
  animationOptions?: AnimationOptions
}

// internal refs consolidated into a single object
type MotionRefs = {
  isFirstRender: boolean
  lastDoAnimate: Record<string, unknown> | null
  lastDontAnimate: Record<string, unknown> | null
  controls: AnimationPlaybackControlsWithThen | null
  lastAnimateAt: number
  disposed: boolean
  wasExiting: boolean
  isExiting: boolean
  sendExitComplete: (() => void) | null | undefined
  animationState: 'enter' | 'exit' | 'default'
  frozenExitTarget: Record<string, unknown> | null
  exitCompleteScheduled: boolean
  wasEntering: boolean
}

export function createAnimations<A extends Record<string, AnimationConfig>>(
  animations: A
): AnimationDriver<A> {
  let isHydratingGlobal: boolean | undefined
  const hydratingComponents = new Set<Function>()

  return {
    View: MotionView,
    Text: MotionText,
    isReactNative: false,
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

      // single consolidated ref with lazy init
      const refs = useRef<MotionRefs>(null!)
      if (!refs.current) {
        refs.current = {
          isFirstRender: true,
          lastDoAnimate: null,
          lastDontAnimate: null,
          controls: null,
          lastAnimateAt: 0,
          disposed: false,
          wasExiting: false,
          isExiting: false,
          sendExitComplete: undefined,
          animationState: 'default',
          frozenExitTarget: null,
          exitCompleteScheduled: false,
          wasEntering: false,
        }
      }

      // track entering state transitions
      const justFinishedEntering = refs.current.wasEntering && !isEntering
      useEffect(() => {
        refs.current.wasEntering = isEntering
      })

      // determine animation state for enter/exit transitions
      const animationState: 'enter' | 'exit' | 'default' = isExiting
        ? 'exit'
        : isMounting || justFinishedEntering
          ? 'enter'
          : 'default'

      // disable animation during hydration and mounting (prevents "flying across the page")
      const disableAnimation = isComponentHydrating || isMounting || !animationKey

      const [scope, animate] = useAnimateSSRSafe()

      // sync ref values for reliable access from callbacks
      refs.current.isExiting = isExiting
      refs.current.sendExitComplete = sendExitComplete
      refs.current.animationState = animationState

      // detect transition into exiting state
      const justStartedExiting = isExiting && !refs.current.wasExiting
      const justStoppedExiting = !isExiting && refs.current.wasExiting

      // freeze exit animation target so direction changes don't reverse mid-exit
      if (justStartedExiting || justStoppedExiting) {
        refs.current.frozenExitTarget = null
        refs.current.exitCompleteScheduled = false
      }

      // track previous exiting state
      useEffect(() => {
        refs.current.wasExiting = isExiting
      })

      const {
        dontAnimate = {},
        doAnimate,
        animationOptions,
      } = getMotionAnimatedProps(props as any, style, disableAnimation, animationState)

      const [firstRenderStyle] = useState(style)

      // avoid first render returning wrong styles - always render all, after that we can just mutate
      if (refs.current.isFirstRender) {
        refs.current.lastDontAnimate = firstRenderStyle
      }
      const [isHydrating, setIsHydrating] = useState(isHydratingGlobal)

      useLayoutEffect(() => {
        if (isHydratingGlobal) {
          hydratingComponents.add(() => {
            setIsHydrating(false)
          })
        }
        return () => {
          refs.current.disposed = true
        }
      }, [])

      const flushAnimation = ({
        doAnimate: doAnimateRaw = {},
        animationOptions: passedOptions = {},
        dontAnimate,
      }: AnimationProps) => {
        // track whether THIS flush starts a new animation (vs using stale controls)
        let startedControls: AnimationPlaybackControlsWithThen | null = null

        // read current state from refs (closure variables can be stale)
        const isCurrentlyExiting = refs.current.isExiting
        const currentSendExitComplete = refs.current.sendExitComplete

        // freeze exit target: once the first exit animation starts, subsequent
        // renders (e.g. direction change) should not reverse the exit animation.
        let doAnimate = doAnimateRaw
        if (isCurrentlyExiting && refs.current.frozenExitTarget) {
          doAnimate = refs.current.frozenExitTarget
        }

        // only recompute animation options for exit animations to avoid stale state.
        const animationOptions =
          isCurrentlyExiting && currentSendExitComplete
            ? getAnimationOptions(props.transition ?? null, 'exit')
            : passedOptions

        try {
          const node = stateRef.current.host

          // on first render, reset stale animation refs - they can persist if component
          // instance is reused (e.g. AnimatePresence keepChildrenMounted)
          if (refs.current.isFirstRender) {
            refs.current.lastDontAnimate = null
            refs.current.lastDoAnimate = null
          }

          if (process.env.NODE_ENV === 'development') {
            if (props['debug'] && props['debug'] !== 'profile') {
              console.groupCollapsed(
                `[motion] animate (${JSON.stringify(getDiff(refs.current.lastDoAnimate, doAnimate), null, 2)})`
              )
              console.info({
                props,
                componentState,
                doAnimate,
                dontAnimate,
                animationOptions,
                animationProps,
                lastDoAnimate: { ...refs.current.lastDoAnimate },
                lastDontAnimate: { ...refs.current.lastDontAnimate },
                isExiting,
                style,
                node,
              })
              console.groupCollapsed(`trace >`)
              console.trace()
              console.groupEnd()
              console.groupEnd()
            }
          }

          if (!(node instanceof HTMLElement)) {
            return
          }

          // handle case where dontAnimate changes
          const prevDont = refs.current.lastDontAnimate
          if (dontAnimate) {
            if (prevDont) {
              removeRemovedStyles(prevDont, dontAnimate, node, doAnimate)
              const changed = getDiff(prevDont, dontAnimate)
              if (changed) {
                Object.assign(node.style, changed as any)
              }
            } else {
              Object.assign(node.style, dontAnimate as any)
            }
          }

          if (doAnimate) {
            // when a property moves from dontAnimate to doAnimate, preserve
            // the current inline style value so WAAPI starts from the right place
            if (prevDont) {
              for (const key in prevDont) {
                if (key in doAnimate) {
                  node.style[key] = prevDont[key]
                  if (refs.current.lastDoAnimate) {
                    refs.current.lastDoAnimate[key] = prevDont[key]
                  }
                }
              }
            }

            const lastAnimated = refs.current.lastDoAnimate
            if (lastAnimated) {
              removeRemovedStyles(lastAnimated, doAnimate, node, dontAnimate)
            }

            const diff = getDiff(refs.current.lastDoAnimate, doAnimate)

            if (diff) {
              // capture frozen exit target on first exit diff
              if (isCurrentlyExiting && !refs.current.frozenExitTarget) {
                refs.current.frozenExitTarget = { ...doAnimate }
              }

              // capture mid-flight values so we can provide explicit [from, to]
              // keyframes to WAAPI, ensuring smooth interpolation from the
              // current visual state.
              //
              // only stop() during exit — for non-exit cases, WAAPI
              // naturally replaces only conflicting property animations,
              // letting non-conflicting ones (like an in-flight enter
              // opacity animation) continue to completion.
              const isPopperPosition = node.hasAttribute('data-popper-animate-position')
              let midFlightValues: Record<string, string> | null = null
              if (refs.current.controls) {
                try {
                  const computed = getComputedStyle(node)
                  midFlightValues = {}
                  for (const key in diff) {
                    const val = (computed as any)[key]
                    if (val !== undefined && val !== '') {
                      midFlightValues[key] = val
                    }
                  }
                } catch {
                  // getComputedStyle can fail on detached nodes
                }

                if (isCurrentlyExiting) {
                  refs.current.controls.stop()
                }

                // write mid-flight values to inline so the 1-frame gap
                // (while motion resolves keyframes) shows the correct
                // position instead of stale inline styles
                if (midFlightValues) {
                  for (const key in midFlightValues) {
                    ;(node.style as any)[key] = midFlightValues[key]
                  }
                }

                // for popper position elements, cancel WAAPI animations
                // directly so motion.dev's internal stop() sees "idle" state
                // and skips commitStyles. without this, commitStyles writes
                // a mid-flight transform that's visible for 1 frame before
                // the new animation starts, causing a flash toward (0,0).
                if (isPopperPosition) {
                  const anims = node.getAnimations()
                  for (const anim of anims) {
                    anim.cancel()
                  }
                }
              }

              const fixedDiff = fixTransparentColors(
                diff,
                refs.current.lastDoAnimate,
                doAnimate
              )

              // provide explicit [from, to] keyframe for transforms during
              // mid-flight interruption so motion starts from the right place
              if (midFlightValues?.transform && fixedDiff.transform) {
                fixedDiff.transform = [midFlightValues.transform, fixedDiff.transform]
              }

              startedControls = animate(scope.current, fixedDiff, animationOptions)
              refs.current.controls = startedControls
              refs.current.lastAnimateAt = Date.now()
            }
          }

          refs.current.lastDontAnimate = dontAnimate ? { ...dontAnimate } : {}
          refs.current.lastDoAnimate = doAnimate ? { ...doAnimate } : {}
        } finally {
          // exit completion: notify AnimatePresence when exit animation finishes
          if (isCurrentlyExiting && currentSendExitComplete) {
            if (startedControls) {
              // new animation started — attach completion handler
              refs.current.exitCompleteScheduled = true
              startedControls.finished
                .then(() => {
                  // guard: only complete if still exiting (prevents stale promise
                  // from calling sendExitComplete after a re-entry cancels the exit)
                  if (refs.current.isExiting) {
                    currentSendExitComplete()
                  }
                })
                .catch(() => {
                  if (refs.current.isExiting) {
                    currentSendExitComplete()
                  }
                })
            } else if (!refs.current.exitCompleteScheduled) {
              // no animation started AND none previously scheduled (e.g. diff=null
              // on re-render mid-exit because frozenExitTarget matches lastDoAnimate)
              // — complete immediately only if we've never started an exit animation
              currentSendExitComplete()
            }
            // else: exit animation already scheduled via a previous flush,
            // its .finished promise will call sendExitComplete when done
          }
        }
      }

      useStyleEmitter?.((nextStyle, effectiveTransition) => {
        const animationProps = getMotionAnimatedProps(
          props as any,
          nextStyle,
          disableAnimation,
          refs.current.animationState,
          effectiveTransition
        )

        flushAnimation(animationProps)
      })

      useIsomorphicLayoutEffect(() => {
        if (refs.current.isFirstRender) {
          refs.current.isFirstRender = false

          // during hydration, skip inline style writes entirely — SSR CSS
          // already has the correct values. writing them again as inline
          // styles triggers browser style recalc that causes visible font
          // flashes (fontWeight, fontSize, letterSpacing, lineHeight).
          // we only need to track refs for future animation diffing.
          if (isHydrating) {
            if (doAnimate && Object.keys(doAnimate).length > 0) {
              refs.current.lastDoAnimate = { ...doAnimate }
            } else {
              refs.current.lastDoAnimate = dontAnimate ? { ...dontAnimate } : {}
            }

            refs.current.lastDontAnimate = dontAnimate ? { ...dontAnimate } : {}
            refs.current.lastAnimateAt = Date.now()
            return
          }

          // after hydration, use simpler logic
          refs.current.lastDontAnimate = dontAnimate ? { ...dontAnimate } : {}
          refs.current.lastDoAnimate = doAnimate ? { ...doAnimate } : {}
          return
        }

        flushAnimation({
          doAnimate,
          dontAnimate,
          animationOptions,
        })
      }, [style, isExiting, disableAnimation])

      if (process.env.NODE_ENV === 'development') {
        if (props['debug'] && props['debug'] !== 'profile') {
          console.groupCollapsed(`[motion] render`)
          console.info({
            style,
            doAnimate,
            dontAnimate,
            scope,
            animationOptions,
            isExiting,
            isFirstRender: refs.current.isFirstRender,
            animationProps,
          })
          console.groupEnd()
        }
      }

      return {
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

    let effectiveKey = getEffectiveAnimation(normalized, animationState)

    // fallback: if we have enter/exit defined but state is 'default' and no default key,
    // use enter timing as fallback to avoid empty animation options
    if (!effectiveKey && animationState === 'default') {
      effectiveKey = normalized.enter || normalized.exit || null
    }

    const globalConfigOverride: Record<string, unknown> | undefined = normalized.config
      ? { ...normalized.config }
      : undefined

    if (
      !effectiveKey &&
      Object.keys(normalized.properties).length === 0 &&
      !globalConfigOverride
    ) {
      return {}
    }

    const defaultConfig = effectiveKey ? withInferredType(animations[effectiveKey]) : null

    const delay = normalized.delay

    // framer motion's animate() expects default config at the TOP LEVEL
    const result: TransitionAnimationOptions = {}

    if (defaultConfig) {
      Object.assign(result, defaultConfig)
    }

    if (globalConfigOverride) {
      Object.assign(result, globalConfigOverride)
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

    if (delay) {
      result.delay = delay
    }

    if (defaultConfig || globalConfigOverride || delay) {
      result.default = {
        ...defaultConfig,
        ...globalConfigOverride,
        ...(delay ? { delay } : null),
      }
    }

    for (const [propName, animationNameOrConfig] of Object.entries(
      normalized.properties
    )) {
      if (typeof animationNameOrConfig === 'string') {
        result[propName] = withInferredType(animations[animationNameOrConfig])
      } else if (animationNameOrConfig && typeof animationNameOrConfig === 'object') {
        const baseConfig = animationNameOrConfig.type
          ? withInferredType(animations[animationNameOrConfig.type])
          : defaultConfig

        result[propName] = {
          ...baseConfig,
          ...animationNameOrConfig,
        } as ValueTransition
      }
    }

    // we standardize to ms across drivers, motion expects s
    convertMsToS(result as ValueTransition)
    convertMsToS(result.default)
    for (const key in result) {
      if (key !== 'default' && typeof result[key] === 'object') {
        convertMsToS(result[key])
      }
    }

    return result
  }
}

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

function convertMsToS(config: ValueTransition | undefined) {
  if (!config) return
  if (typeof config.delay === 'number') config.delay = config.delay / 1000
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
      if (dontClearIfIn && key in dontClearIfIn) {
        continue
      }
      node.style[key] = ''
    }
  }
}

// truly non-animatable CSS properties (discrete, keyword-based, no interpolation)
// properties like margin, maxHeight, zIndex, etc are animatable and intentionally excluded
export const disableAnimationProps: Set<string> = new Set<string>([
  'alignContent',
  'alignItems',
  'boxSizing',
  'contain',
  'containerType',
  'display',
  'flexBasis',
  'flexDirection',
  'fontFamily',
  'justifyContent',
  'overflow',
  'overflowX',
  'overflowY',
  'pointerEvents',
  'position',
  'textWrap',
  'userSelect',
])

const MotionView = createMotionView('div')
const MotionText = createMotionView('span')

function createMotionView(defaultTag: string) {
  const isText = defaultTag === 'span'

  const Component = forwardRef((propsIn: any, ref) => {
    const { forwardedRef, animation, render = defaultTag, style, ...propsRest } = propsIn
    const [scope, animate] = useAnimateSSRSafe()
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

    const [animatedStyle, nonAnimatedStyles] = (() => {
      let animatedStyle: MotionAnimatedNumberStyle | undefined
      const nonAnimatedStyles: typeof styles = []
      for (const style of styles) {
        if (style.getStyle) {
          animatedStyle = style as MotionAnimatedNumberStyle
        } else {
          nonAnimatedStyles.push(style)
        }
      }
      return [animatedStyle, nonAnimatedStyles] as const
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
          resolveValues: 'auto',
        }
      )

      if (!out) {
        return {}
      }

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
      const candidates = [previous?.[key], next?.[key]]
      for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate !== 'transparent') {
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
