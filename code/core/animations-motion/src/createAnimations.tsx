import {
  type AnimatedNumberStrategy,
  type AnimationDriver,
  type AnimationProp,
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
} from '@tamagui/core'
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

const minTimeBetweenAnimations = 1000 / 60

const MotionValueStrategy = new WeakMap<MotionValue, AnimatedNumberStrategy>()

type AnimationProps = {
  doAnimate?: Record<string, unknown>
  dontAnimate?: Record<string, unknown>
  animationOptions?: AnimationOptions
}

export function createAnimations<A extends Record<string, AnimationConfig>>(
  animationsProp: A
): AnimationDriver<A> {
  // normalize, it doesn't assume type: 'spring' even if damping etc there so we do that
  // which also matches the moti driver
  // @ts-expect-error avoid doing a spread for no reason, sub-constraint type issue
  const animations: A = {}
  for (const key in animationsProp) {
    animations[key] = {
      type: 'spring',
      ...animationsProp[key],
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

      const animationKey = Array.isArray(props.animation)
        ? props.animation[0]
        : props.animation

      const isHydrating = componentState.unmounted === true
      const disableAnimation = isHydrating || !animationKey
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]

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
          disableAnimation
        )
        return motionAnimationState
      }, [isExiting, animationKey, styleKey])

      const animationsQueue = useRef<AnimationProps[]>([])
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
          controls.current = animate(scope.current, doAnimate || {}, {
            type: false,
          })
          controls.current.complete()
          // scope.animations = []

          if (shouldDebug) {
            console.groupCollapsed(`[motion] 🌊 FIRST`)
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
        // if (shouldDebug) {
        //   if (Date.now() - lastAnimateAt.current < minTimeBetweenAnimations) {
        //     console.warn('TO SOON')
        //   }
        // }

        try {
          const node = stateRef.current.host

          if (shouldDebug) {
            console.groupCollapsed(
              `[motion] 🌊 animate (${JSON.stringify(getDiff(lastDoAnimate.current, doAnimate), null, 2)})`
            )
            console.info({
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
          if (dontAnimate) {
            const prev = lastDontAnimate.current
            if (prev) {
              removeRemovedStyles(prev, dontAnimate, node)
              const changed = getDiff(prev, dontAnimate)
              if (changed) {
                Object.assign(node.style, changed as any)
              }
            }
          }

          lastDontAnimate.current = dontAnimate || {}

          if (doAnimate) {
            if (updateFirstAnimationStyle()) {
              return
            }

            const lastAnimated = lastDoAnimate.current
            if (lastAnimated) {
              removeRemovedStyles(lastAnimated, doAnimate, node)
            }

            const diff = getDiff(lastDoAnimate.current, doAnimate)
            if (diff) {
              controls.current = animate(scope.current, diff, animationOptions)
              lastAnimateAt.current = Date.now()
            }
          }

          lastDoAnimate.current = doAnimate
        } finally {
          if (controls.current) {
            if (isExiting) {
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
          disableAnimation
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

      return {
        // we never change this, after first render on
        style: firstRenderStyle,
        ref: scope,
        tag: 'div',
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
    props: { animation: AnimationProp | null; animateOnly?: string[] },
    style: Record<string, unknown>,
    disable: boolean
  ): AnimationProps {
    if (disable) {
      return {
        dontAnimate: style,
      }
    }

    const animationOptions = animationPropToAnimationConfig(props.animation)

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

  function animationPropToAnimationConfig(
    animationProp: AnimationProp | null
  ): AnimationOptions {
    let defaultAnimationKey = ''
    let specificAnimations = {}

    if (typeof animationProp === 'string') {
      defaultAnimationKey = animationProp
    } else if (Array.isArray(animationProp)) {
      if (typeof animationProp[0] === 'string') {
        defaultAnimationKey = animationProp[0]
        specificAnimations = animationProp[1]
      } else {
        specificAnimations = animationProp
      }
    }

    if (!defaultAnimationKey) {
      return {}
    }

    const defaultConfig = animations[defaultAnimationKey]

    return {
      default: defaultConfig,
      ...Object.fromEntries(
        Object.entries(specificAnimations).flatMap(
          ([propName, animationNameOrConfig]) => {
            if (typeof animationNameOrConfig === 'string') {
              return [[propName, animations[animationNameOrConfig]]]
            }
            if (animationNameOrConfig && typeof animationNameOrConfig === 'object') {
              return [
                [
                  propName,
                  {
                    ...defaultConfig,
                    ...animationNameOrConfig,
                  },
                ],
              ]
            }
            return []
          }
        )
      ),
    }
  }
}

function removeRemovedStyles(prev: Object, next: Object, node: HTMLElement) {
  for (const key in prev) {
    if (!(key in next)) {
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
  //   const Element = motion[props.tag || defaultTag]
  //   return <Element ref={ref} {...props} />
  // })
  const isText = defaultTag === 'span'

  const Component = forwardRef((propsIn: any, ref) => {
    const { forwardedRef, animation, tag = defaultTag, style, ...propsRest } = propsIn
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
    const Element = tag || 'div'
    const transformedProps = hooks.usePropsTransform?.(tag, props, stateRef, false)

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
