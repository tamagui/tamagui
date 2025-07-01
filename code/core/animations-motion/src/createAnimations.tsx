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
  isEqualShallow,
  useThemeWithState,
  View,
} from '@tamagui/core'
import { PresenceContext, ResetPresence, usePresence } from '@tamagui/use-presence'
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
      const { props, style, componentState, stateRef, useStyleEmitter, presence } =
        animationProps

      const animationKey = Array.isArray(props.animation)
        ? props.animation[0]
        : props.animation

      const isHydrating = componentState.unmounted === true
      const disableAnimation = isHydrating || !animationKey
      const presenceContext = React.useContext(PresenceContext)
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]

      const [scope, animate] = useAnimate()
      const lastAnimationStyle = useRef<Object | null>(null)
      const controls = useRef<AnimationPlaybackControlsWithThen | null>(null)
      const styleKey = JSON.stringify(style)
      const currentDontAnimate = useRef<Object>({})
      const lastRun = useRef<Promise<void> | null>(null)
      const nextRunDiff = useRef<Object | null>(null)

      const { dontAnimate, doAnimate, animationOptions } = useMemo(() => {
        const motionAnimationState = getMotionAnimatedProps(
          props as any,
          style,
          disableAnimation
        )
        return motionAnimationState
      }, [presenceContext, animationKey, styleKey])

      const runAnimation = async (
        nextStyle: Record<string, unknown> | null,
        animationOptions: AnimationOptions | undefined
      ) => {
        if (!nextStyle) return
        if (!(stateRef.current.host instanceof HTMLElement)) {
          return
        }

        // ideally this would just come from tamagui
        fixStyles(nextStyle)
        styleToCSS(nextStyle)

        if (!lastAnimationStyle.current) {
          lastAnimationStyle.current = nextStyle
          const firstAnimation = animate(scope.current, nextStyle, {
            duration: 0,
            type: 'tween',
          })
          firstAnimation.complete()
          scope.animations = []

          if (
            process.env.NODE_ENV === 'development' &&
            props['debug'] &&
            props['debug'] !== 'profile'
          ) {
            console.groupCollapsed(`[animations-motion] 🌊 FIRST`)
            console.info(nextStyle)
            console.groupEnd()
          }
          return
        }

        let diff: Record<string, unknown> | null = null
        for (const key in nextStyle) {
          if (nextStyle[key] !== lastAnimationStyle.current[key]) {
            diff ||= {}
            diff[key] = nextStyle[key]
          }
        }

        if (nextRunDiff.current) {
          Object.assign(nextRunDiff.current, diff)
          console.info('skip this run')
          return
        }

        // fixbug where updating twice in under a frame cause NaN issues on animating transforms and glitchy animations
        const lastRunPromise = lastRun.current

        let resolveLastRun: Function | undefined
        const runPromise = new Promise<void>((res) => {
          resolveLastRun = res
        })
        lastRun.current = runPromise

        if (lastRunPromise) {
          nextRunDiff.current = {}
          console.info(`wait for last`)
          await lastRunPromise
        }

        const curControls = controls.current
        let waits = 0

        // if we check when no animations it breaks
        if (curControls?.['animations'].length) {
          while (curControls?.time < 0.012) {
            lastRun.current ||= runPromise
            waits++
            if (waits > 15) {
              console.info(`broke the waits, too many`, curControls?.time, curControls)
              break
            }
            await new Promise((res) => setTimeout(res, 15))
          }
        }

        if (nextRunDiff.current) {
          diff = { ...diff, ...nextRunDiff.current }
          nextRunDiff.current = null
        }

        if (
          process.env.NODE_ENV === 'development' &&
          props['debug'] &&
          props['debug'] !== 'profile'
        ) {
          console.groupCollapsed(
            `[animations-motion] 🌊 animate (${JSON.stringify(diff, null, 2)})`
          )
          console.info({ animationProps, nextStyle, lastAnimationStyle })
          console.groupEnd()
        }

        if (!diff || !Object.keys(diff).length) {
          resolveLastRun?.()
          return
        }

        curControls?.stop()
        controls.current = animate(scope.current, diff, animationOptions)
        lastAnimationStyle.current = { ...nextStyle, ...diff }

        if (isExiting) {
          controls.current.finished.then(() => {
            sendExitComplete?.()
          })
        }

        resolveLastRun?.()
      }

      useStyleEmitter?.((nextStyle) => {
        const { doAnimate, dontAnimate, animationOptions } = getMotionAnimatedProps(
          props as any,
          nextStyle,
          disableAnimation
        )

        if (!isEqualShallow(dontAnimate, currentDontAnimate.current)) {
          console.warn('changed dont animate', dontAnimate, currentDontAnimate.current)
        }

        runAnimation(doAnimate, animationOptions)
      })

      // strict mode correctness fix, idk why i thought it would clear a useRef
      // before running strict? if you remove this you'll see the next
      // useLayoutEffect re-run and animate due to lastAnimationStyle.current
      // being set when in theory it should be clear
      useEffect(() => {
        return () => {
          lastAnimationStyle.current = null
        }
      }, [])

      useLayoutEffect(() => {
        if (!doAnimate) return
        runAnimation(doAnimate, animationOptions)
      }, [JSON.stringify(doAnimate), lastAnimationStyle])

      useEffect(() => {
        currentDontAnimate.current = dontAnimate
      }, [dontAnimate])

      if (
        process.env.NODE_ENV === 'development' &&
        props['debug'] &&
        props['debug'] !== 'profile'
      ) {
        console.groupCollapsed(`[animations-motion] 🌊 render`)
        console.info({ style, doAnimate, dontAnimate, scope, animationOptions })
        console.groupEnd()
      }

      return {
        style: dontAnimate,
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
    let doAnimate: Record<string, unknown> | null = null

    const animateOnly = props.animateOnly as string[] | undefined
    for (const key in style) {
      const value = style[key]
      if (disableAnimationProps.has(key) || (animateOnly && !animateOnly.includes(key))) {
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

// sort of temporary
const disableAnimationProps = new Set<string>([
  'alignContent',
  'alignItems',
  'backdropFilter',
  'boxSizing',
  'contain',
  'display',
  'flexBasis',
  'flexDirection',
  'flexShrink',
  'justifyContent',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'overflow',
  'pointerEvents',
  'position',
  'textWrap',
  'zIndex',
  'overflowX',
  'overflowY',
  'outlineStyle',
  'outlineWidth',
  'outlineColor',
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
