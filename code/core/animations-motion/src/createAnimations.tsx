import { PresenceContext, ResetPresence, usePresence } from '@tamagui/use-presence'
import {
  type AnimatedNumberStrategy,
  getSplitStyles,
  hooks,
  styleToCSS,
  Text,
  useComposedRefs,
  useGet,
  useThemeWithState,
  View,
  type AnimationDriver,
  type AnimationProp,
  type UniversalAnimatedNumber,
  useEvent,
} from '@tamagui/core'
import {
  type MotionValue,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
  type AnimationOptions,
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

// TODO: useAnimatedNumber style could avoid re-rendering

type MotionAnimatedNumber = MotionValue<number>
type AnimationConfig = ValueTransition

type MotionAnimatedNumberStyle = {
  getStyle: (cur: number) => Record<string, unknown>
  motionValue: MotionValue<number>
}

const MotionValueStrategy = new WeakMap<MotionValue, AnimatedNumberStrategy>()

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
    supportsCSSVars: true,
    needsWebStyles: true,
    avoidReRenders: true,
    animations,
    usePresence,
    ResetPresence,

    useAnimations: (animationProps) => {
      const { props, presence, style, componentState, stateRef, useStyleEmitter } =
        animationProps
      const animationKey = Array.isArray(props.animation)
        ? props.animation[0]
        : props.animation

      const isHydrating = componentState.unmounted === true
      const disableAnimation = isHydrating || !animationKey
      const presenceContext = React.useContext(PresenceContext)

      const [scope, animate] = useAnimate()

      const { dontAnimate, doAnimate, animationOptions } = useMemo(() => {
        console.warn('re-running')
        return getMotionAnimatedProps(props as any, style, disableAnimation)
      }, [presenceContext, animationKey, JSON.stringify(style)])

      const firstRenderStyle = useRef<Object | null>(null)

      function runAnimation(
        animationStyle: Record<string, unknown>,
        options: AnimationOptions
      ) {
        if (!(stateRef.current.host instanceof HTMLElement)) {
          return
        }

        styleToCSS(animationStyle) // ideally this would just come from tamagui

        if (!firstRenderStyle.current) {
          firstRenderStyle.current = animationStyle
          animate(stateRef.current.host, animationStyle, {
            duration: 0,
            type: 'tween',
          })
          return
        }

        animate(stateRef.current.host, animationStyle, animationOptions)
        // idea is - we assign to dontAnimate here so in case there's any renders that don't change style
        // but do cause it to trigger a React re-render, React doesn't remove the animated styles
        // need to figure this out better though - what happens if it's currently animating?
        // Object.assign(dontAnimate, doAnimate)
      }

      useStyleEmitter?.((nextStyle) => {
        const { doAnimate, animationOptions } = getMotionAnimatedProps(
          props as any,
          nextStyle,
          disableAnimation
        )
        if (doAnimate) {
          runAnimation(doAnimate, animationOptions)
          Object.assign(dontAnimate, doAnimate)
        }
      })

      useLayoutEffect(() => {
        if (!doAnimate) return
        runAnimation(doAnimate, animationOptions)
      }, [doAnimate])

      return {
        style: dontAnimate,
        ref: scope,
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
            console.log('settinv value', next)
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
    disable = false
  ) {
    if (disable) {
      return {
        dontAnimate: style,
        doAnimate: null,
      }
    }

    const animationOptions = animationPropToAnimationConfig(props.animation)

    let dontAnimate = {}
    const doAnimate = {}

    const animateOnly = props.animateOnly as string[] | undefined
    for (const key in style) {
      const value = style[key]
      if (animateOnly && !animateOnly.includes(key)) {
        dontAnimate[key] = value
      } else {
        doAnimate[key] = value
      }
    }

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

    return {
      default: animations[defaultAnimationKey],
      ...Object.fromEntries(
        Object.keys(specificAnimations).flatMap((key) => {
          if (animations[key]) {
            return [[key, animations[key]]]
          }
          return []
        })
      ),
    }
  }
}

const MotionView = createMotionView('div')
const MotionText = createMotionView('span')

function createMotionView(defaultTag: string) {
  // return forwardRef((props: any, ref) => {
  //   console.log('rendering?', props)
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

      // we can definitely get rid of this here
      if (out.viewProps.style) {
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

        console.log('gogoog', { value, nextStyle, webStyle, animationConfig })

        if (webStyle && node instanceof HTMLElement) {
          animate(node, webStyle as any, animationConfig as any)
        }
      })
    }, [animatedStyle])

    return <Element {...transformedProps} ref={composedRefs} />
  })

  Component['acceptTagProp'] = true

  return Component
}
