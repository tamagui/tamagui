import { normalizeTransition, getEffectiveAnimation } from '@tamagui/animation-helpers'
import {
  type AnimatedNumberStrategy,
  type AnimationDriver,
  type TransitionProp,
  fixStyles,
  getSplitStyles,
  hooks,
  styleToCSS,
  Text,
  type UniversalAnimatedNumber,
  useComposedRefs,
  useIsomorphicLayoutEffect,
  useThemeWithState,
  View,
} from '@tamagui/web'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
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

type AnimationProps = {
  doAnimate?: Record<string, unknown>
  dontAnimate?: Record<string, unknown>
  animationOptions?: AnimationOptions
}

export function createAnimations<A extends Record<string, AnimationConfig>>(
  animationsProp: A
): AnimationDriver<A> {
  // normalize animation configs
  // @ts-expect-error avoid doing a spread for no reason, sub-constraint type issue
  const animations: A = {}
  for (const key in animationsProp) {
    const config = animationsProp[key]
    // If config only has duration (timing-based), use 'tween' type
    // Otherwise default to 'spring' which matches the moti driver
    const isTimingBased =
      config.duration !== undefined &&
      config.damping === undefined &&
      config.stiffness === undefined &&
      config.mass === undefined
    animations[key] = {
      type: isTimingBased ? 'tween' : 'spring',
      ...config,
      // Convert duration/delay from ms to seconds for motion library
      ...(config.duration ? { duration: config.duration / 1000 } : null),
      ...(config.delay ? { delay: config.delay / 1000 } : null),
    }
  }

  return {
    // this is only used by Sheet basically for now to pass result of useAnimatedStyle to
    View: MotionView,
    Text: MotionText,
    isReactNative: false,
    supportsCSS: true,
    needsWebStyles: true,
    avoidReRenders: true,
    animations,
    usePresence,
    ResetPresence,

    useAnimations: (animationProps) => {
      const { props, style, componentState, stateRef, useStyleEmitter, presence } =
        animationProps

      const animationKey = Array.isArray(props.transition)
        ? props.transition[0]
        : props.transition

      const isHydrating = componentState.unmounted === true
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
      const disableAnimation = isHydrating || isMounting || !animationKey

      const isFirstRender = useRef(true)
      const [scope, animate] = useAnimate()
      const lastDoAnimate = useRef<Record<string, unknown> | null>(null)
      const controls = useRef<AnimationPlaybackControlsWithThen | null>(null)
      const styleKey = JSON.stringify(style)

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
      }, [isExiting, animationKey, styleKey, animationState])

      const debugId = process.env.NODE_ENV === 'development' ? useId() : ''
      const lastAnimateAt = useRef(0)
      const disposed = useRef(false)
      const [firstRenderStyle] = useState(style)

      // avoid first render returning wrong styles - always render all, after that we can just mutate
      const lastDontAnimate = useRef<Record<string, unknown>>(firstRenderStyle)

      useLayoutEffect(() => {
        return () => {
          disposed.current = true
        }
      }, [])

      // const runAnimation = (props: AnimationProps) => {
      //   const waitForNextAnimationFrame = () => {
      //     if (disposed.current) return
      //     // we just skip to the last one
      //     const queue = animationsQueue.current
      //     const last = queue[queue.length - 1]
      //     animationsQueue.current = []

      //     if (!last) {
      //       console.error(`Should never hit`)
      //       return
      //     }

      //     if (!props) return

      //     if (scope.current) {
      //       flushAnimation(props)
      //     } else {
      //       // frame.postRender(waitForNextAnimationFrame)
      //       requestAnimationFrame(waitForNextAnimationFrame)
      //     }
      //   }

      //   const hasQueue = animationsQueue.current.length
      //   const shouldWait =
      //     hasQueue ||
      //     (lastAnimateAt.current &&
      //       Date.now() - lastAnimateAt.current > minTimeBetweenAnimations)

      //   if (isExiting || isFirstRender.current || (scope.current && !shouldWait)) {
      //     flushAnimation(props)
      //   } else {
      //     animationsQueue.current.push(props)
      //     if (!hasQueue) {
      //       waitForNextAnimationFrame()
      //     }
      //   }
      // }

      const updateFirstAnimationStyle = () => {
        const node = stateRef.current.host

        if (!(node instanceof HTMLElement)) {
          return false
        }

        if (!lastDoAnimate.current) {
          lastAnimateAt.current = Date.now()
          lastDoAnimate.current = doAnimate || {}
          animate(scope.current, doAnimate || {}, {
            type: false,
          })
          // scope.animations = []

          if (shouldDebug) {
            console.groupCollapsed(`[motion] ${debugId} 🌊 FIRST`)
            console.info(doAnimate)
            console.groupEnd()
          }
          return true
        }

        return false
      }

      const flushAnimation = ({
        doAnimate = {},
        animationOptions = {},
        dontAnimate,
      }: AnimationProps) => {
        try {
          const node = stateRef.current.host

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
              removeRemovedStyles(prevDont, dontAnimate, node)
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
            if (updateFirstAnimationStyle()) {
              return
            }

            // bugfix: going from non-animated to animated in motion -
            // motion batches things so the above removal can happen a frame before causing flickering
            // we see this with tooltips, this is not an ideal solution though, ideally we can remove/update
            // in the same batch/frame as motion
            if (prevDont) {
              for (const key in prevDont) {
                if (key in doAnimate) {
                  node.style[key] = prevDont[key]
                  // Also update lastDoAnimate to include the previous value
                  // This prevents animating from undefined to the current value
                  // when a property transitions from dontAnimate to doAnimate
                  if (lastDoAnimate.current) {
                    lastDoAnimate.current[key] = prevDont[key]
                  }
                }
              }
            }

            const lastAnimated = lastDoAnimate.current
            if (lastAnimated) {
              // Pass dontAnimate as third arg to prevent clearing styles that moved to dontAnimate
              removeRemovedStyles(lastAnimated, doAnimate, node, dontAnimate)
            }

            const diff = getDiff(lastDoAnimate.current, doAnimate)
            if (diff) {
              // motion animates transform props via its own mechanism (WAAPI, CSS variables),
              // but React may have set individual CSS transform props (scale, translate, etc.)
              // which would conflict. Clear them from the inline style before animating.
              // note: CSS has translate, scale, rotate as individual properties
              const cssTransformProps = ['translate', 'scale', 'scaleX', 'scaleY', 'x', 'y', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY']
              for (const prop of cssTransformProps) {
                if (prop in diff) {
                  // clear the individual CSS property so motion's transform takes effect
                  node.style[prop as any] = ''
                }
              }

              // motion handles individual transform props (translateX, translateY, scale, etc.) natively
              // no need for matrix parsing since getSplitStyles now outputs individual props when supportsCSS is true
              controls.current = animate(scope.current, diff, animationOptions)
              lastAnimateAt.current = Date.now()
            }
          }

          lastDontAnimate.current = dontAnimate || {}
          lastDoAnimate.current = doAnimate
        } finally {
          if (isExiting) {
            if (controls.current) {
              controls.current.finished.then(() => {
                sendExitComplete?.()
              })
            } else {
              sendExitComplete?.()
            }
          }
        }
      }

      useStyleEmitter?.((nextStyle) => {
        const animationProps = getMotionAnimatedProps(
          props as any,
          nextStyle,
          disableAnimation,
          animationState
        )

        flushAnimation(animationProps)
      })

      const animateKey = JSON.stringify(style)

      useIsomorphicLayoutEffect(() => {
        if (isFirstRender.current) {
          updateFirstAnimationStyle()
          isFirstRender.current = false
          lastDontAnimate.current = dontAnimate
          lastDoAnimate.current = doAnimate || {}
          return
        }

        // always clear queue if we re-render
        // animationsQueue.current = []

        // don't ever queue on a render
        flushAnimation({
          doAnimate,
          dontAnimate,
          animationOptions,
        })
      }, [animateKey, isExiting])

      if (shouldDebug) {
        console.groupCollapsed(`[motion] 🌊 render`)
        console.info({
          style,
          doAnimate,
          dontAnimate,
          animateKey,
          scope,
          animationOptions,
          isExiting,
          isFirstRender: isFirstRender.current,
          animationProps,
        })
        console.groupEnd()
      }

      // motion handles transform props via animate(), so we need to exclude them
      // from the React style to avoid conflicts (both setting scale would cause issues)
      const styleWithoutMotionProps = { ...firstRenderStyle }
      // remove transform props that motion animates - these should only be controlled by motion
      // note: CSS has translate (not translateX/Y), scale, rotate as individual properties
      const motionTransformProps = ['translate', 'scale', 'scaleX', 'scaleY', 'x', 'y', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY']
      for (const prop of motionTransformProps) {
        delete styleWithoutMotionProps[prop]
      }

      return {
        // we never change this, after first render on
        style: styleWithoutMotionProps,
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
    props: { transition: TransitionProp | null; animateOnly?: string[] },
    style: Record<string, unknown>,
    disable: boolean,
    animationState: 'enter' | 'exit' | 'default' = 'default'
  ): AnimationProps {
    if (disable) {
      return {
        dontAnimate: style,
      }
    }

    const animationOptions = transitionPropToAnimationConfig(
      props.transition,
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

    // half works in chrome but janky and stops working after first animation
    // if (
    //   typeof doAnimate?.opacity !== 'undefined' &&
    //   typeof dontAnimate?.backdropFilter === 'string'
    // ) {
    //   if (!dontAnimate.backdropFilter.includes('opacity(')) {
    //     dontAnimate.backdropFilter += ` opacity(${doAnimate.opacity})`
    //     dontAnimate.WebkitBackdropFilter += ` opacity(${doAnimate.opacity})`
    //     dontAnimate.transition = 'backdrop-filter ease-in 1000ms'
    //   }
    // }

    return {
      dontAnimate,
      doAnimate,
      animationOptions,
    }
  }

  function transitionPropToAnimationConfig(
    transitionProp: TransitionProp | null,
    animationState: 'enter' | 'exit' | 'default' = 'default'
  ): TransitionAnimationOptions {
    const normalized = normalizeTransition(transitionProp)

    // Get the effective animation key based on enter/exit/default state
    const effectiveKey = getEffectiveAnimation(normalized, animationState)

    // If no animation defined, return empty config
    if (!effectiveKey && Object.keys(normalized.properties).length === 0) {
      return {}
    }

    const defaultConfig = effectiveKey ? animations[effectiveKey] : null

    // Framer Motion uses seconds, so convert from ms
    const delay =
      typeof normalized.delay === 'number' ? normalized.delay / 1000 : undefined

    // Build the animation options
    const result: TransitionAnimationOptions = {}

    // Set default animation config
    if (defaultConfig) {
      result.default = delay ? { ...defaultConfig, delay } : defaultConfig
    }

    // Add property-specific animations
    for (const [propName, animationNameOrConfig] of Object.entries(
      normalized.properties
    )) {
      if (typeof animationNameOrConfig === 'string') {
        result[propName] = animations[animationNameOrConfig]
      } else if (animationNameOrConfig && typeof animationNameOrConfig === 'object') {
        const baseConfig = animationNameOrConfig.type
          ? animations[animationNameOrConfig.type]
          : defaultConfig
        result[propName] = {
          ...baseConfig,
          ...animationNameOrConfig,
        }
      }
    }

    return result
  }
}

function removeRemovedStyles(
  prev: Object,
  next: Object,
  node: HTMLElement,
  dontClearIfIn?: Object
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
        state?.theme!,
        state?.name!,
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

  Component['acceptTagProp'] = true

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
