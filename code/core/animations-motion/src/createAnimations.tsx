import { PresenceContext, ResetPresence, usePresence } from '@tamagui/use-presence'
import type { AnimationDriver, UniversalAnimatedNumber } from '@tamagui/web'
import {
  useAnimateMini,
  useSpring,
  type MotionValue,
  type ValueTransition,
} from 'motion/react'
import React, { useLayoutEffect, useMemo } from 'react'

// TODO:
//  - we need a mode where it returns us CSS-like stlye values but on the stlye object
//  - we memoize them from the first render always and pass to render (for ssr and initial render)
//  - then use useLayout and call animate() but do logic to split out our animation={{ opacity: {} }}
//    style config properly, and also animation={['defaultName', { ... }]} style etc
//  - test the WAAPI mode for no-rerenders
//  - revisit fernando / my PR on no-rerender pseudo/media animations

type MotionAnimatedNumber = MotionValue<number>

type AnimationConfig = ValueTransition

export function createAnimations<A extends Record<string, AnimationConfig>>(
  animations: A
): AnimationDriver<A> {
  return {
    View: undefined,
    Text: undefined,
    isReactNative: false,
    supportsCSSVars: false,
    animations,
    usePresence,
    ResetPresence,

    useAnimatedNumber(initial): UniversalAnimatedNumber<MotionAnimatedNumber> {
      const motionValue = useSpring(initial)

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
              motionValue.jump(next)
              onFinish?.()
            } else {
              motionValue.set(next)
              // Motion doesn't have a direct onFinish callback, so we simulate it
              if (onFinish) {
                const unsubscribe = motionValue.on('change', (value) => {
                  if (Math.abs(value - next) < 0.01) {
                    unsubscribe()
                    onFinish()
                  }
                })
              }
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
      const instance = value.getInstance()

      React.useEffect(() => {
        const unsubscribe = instance.on('change', onValue)
        return unsubscribe
      }, [instance, onValue])
    },

    useAnimatedNumberStyle(val, getStyle) {
      const instance = val.getInstance()
      const [style, setStyle] = React.useState(() => getStyle(instance.get()))

      React.useEffect(() => {
        const unsubscribe = instance.on('change', (value) => {
          setStyle(getStyle(value))
        })
        return unsubscribe
      }, [instance, getStyle])

      return style
    },

    useAnimations: (animationProps) => {
      const { props, presence, style, componentState, stateRef } = animationProps
      const animationKey = Array.isArray(props.animation)
        ? props.animation[0]
        : props.animation

      const isHydrating = componentState.unmounted === true
      const disableAnimation = isHydrating || !animationKey
      const presenceContext = React.useContext(PresenceContext)

      const [scope, animate] = useAnimateMini()

      const out = useMemo(() => {}, [
        presenceContext,
        presence,
        animationKey,
        componentState.unmounted,
        JSON.stringify(style),
      ])

      useLayoutEffect(() => {
        // console.log('animate', style)
        animate(
          stateRef.current.host as any,
          {},
          {
            alignContent: {
              type: 'spring',
              delay: 100,
            },
          }
        )
      }, [style])

      return { style: undefined }

      // const { dontAnimate, animatedStyle } = useMemo(() => {
      //   let animate = {}
      //   let dontAnimate = {}

      //   if (disableAnimation) {
      //     dontAnimate = style
      //   } else {
      //     const animateOnly = props.animateOnly as string[]
      //     for (const key in style) {
      //       const value = style[key]
      //       if (
      //         !animatableKeys[key] ||
      //         value === 'auto' ||
      //         (typeof value === 'string' && value.startsWith('calc')) ||
      //         (animateOnly && !animateOnly.includes(key))
      //       ) {
      //         dontAnimate[key] = value
      //       } else {
      //         animate[key] = value
      //       }
      //     }
      //   }

      //   // If we're entering, don't animate on first render
      //   if (componentState.unmounted === 'should-enter') {
      //     dontAnimate = style
      //   }

      //   const isExiting = Boolean(presence?.[1])

      //   // Get animation config
      //   let animationConfig = isHydrating
      //     ? { type: 'spring', duration: 0 }
      //     : (animations[animationKey as keyof typeof animations] as any)

      //   // Handle array-based animation config
      //   if (Array.isArray(props.animation)) {
      //     const config = props.animation[1]
      //     if (config && typeof config === 'object') {
      //       animationConfig = { ...animationConfig, ...config }
      //     }
      //   }

      //   return {
      //     dontAnimate,
      //     animatedStyle: animate,
      //     animationConfig,
      //     isExiting,
      //   }
      // }, [
      //   presenceContext,
      //   presence,
      //   animationKey,
      //   componentState.unmounted,
      //   JSON.stringify(style),
      // ])

      // For now, we'll return the combined style
      // In a more complete implementation, we'd use Motion's animate prop
      // return {
      //   style: [dontAnimate, animatedStyle],
      // }
    },
  }
}
