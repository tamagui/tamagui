import { PresenceContext, usePresence } from '@tamagui/animate-presence'
import { AnimationDriver, AnimationProp, isWeb } from '@tamagui/core'
import { useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Animated } from 'react-native'

type AnimationsConfig<A extends Object = any> = {
  [Key in keyof A]: AnimationConfig
}

type AnimationConfig = Partial<
  Pick<
    Animated.SpringAnimationConfig,
    | 'delay'
    | 'bounciness'
    | 'damping'
    | 'friction'
    | 'mass'
    | 'overshootClamping'
    | 'speed'
    | 'stiffness'
    | 'tension'
    | 'velocity'
  >
>
// | ({ type: 'timing'; loop?: number; repeat?: number; repeatReverse?: boolean } & WithTimingConfig)
// | ({ type: 'spring'; loop?: number; repeat?: number; repeatReverse?: boolean } & WithSpringConfig)
// | ({ type: 'decay'; loop?: number; repeat?: number; repeatReverse?: boolean } & WithDecayConfig)

const animatedStyleKey = {
  transform: true,
  opacity: true,
}

export function createAnimations<A extends AnimationsConfig>(animations: A): AnimationDriver<A> {
  const AnimatedView = Animated.View
  const AnimatedText = Animated.Text

  AnimatedView['displayName'] = 'AnimatedView'
  AnimatedText['displayName'] = 'AnimatedText'

  return {
    avoidClasses: true,
    animations,
    View: AnimatedView,
    Text: AnimatedText,
    useAnimations: (props, helpers) => {
      const { pseudos, onDidAnimate, delay, getStyle, state, staticConfig } = helpers
      const [isPresent, sendExitComplete] = usePresence()
      const presence = useContext(PresenceContext)

      const exitStyle = presence?.exitVariant
        ? staticConfig.variantsParsed?.[presence.exitVariant]?.true || pseudos.exitStyle
        : pseudos.exitStyle

      const onDidAnimateCb = useCallback<NonNullable<typeof onDidAnimate>>(
        (...args) => {
          onDidAnimate?.(...args)
        },
        [onDidAnimate]
      )

      const isExiting = isPresent === false
      const isEntering = !state.mounted

      const all = getStyle({
        isExiting,
        isEntering,
        exitVariant: presence?.exitVariant,
        enterVariant: presence?.enterVariant,
      })

      const animateStyles = useRef<Record<string, Animated.Value>>({})
      const animatedTranforms = useRef<{ [key: string]: Animated.Value }[]>([])
      const interpolations = new WeakMap<Animated.Value, string>()

      // TODO loop and create values, run them if they change

      const runners: Function[] = []

      function update(animated: Animated.Value | undefined, valIn: any) {
        let val = valIn
        let postfix = ''
        if (typeof val === 'string') {
          const [numbers, after] = val.split(/[0-9]+/)
          postfix = after
          val = +numbers
        }
        if (animated) {
          const animationConfig = typeof props.animation === 'string' && animations[props.animation]
          runners.push(() => {
            // console.log('animate to', val, animationConfig)
            Animated.spring(animated, {
              toValue: val,
              useNativeDriver: !isWeb,
              ...animationConfig,
            }).start()
          })
          return animated
        } else {
          const res = new Animated.Value(val)
          // console.log('set up', res, (val) =>
          //   Animated.spring(res, { toValue: val, useNativeDriver: false }).start()
          // )
          interpolations.set(res, postfix)
          return res
        }
      }

      const nonAnimatedStyle = {}
      for (const key of Object.keys(all)) {
        const val = all[key]
        if (animatedStyleKey[key]) {
          if (key === 'transform') {
            // for now just support one transform key
            if (val) {
              for (const [index, transform] of val.entries()) {
                if (!transform) continue
                const tkey = Object.keys(transform)[0]
                // console.log('tkey', tkey)
                animatedTranforms.current[index] = {
                  [tkey]: update(animatedTranforms.current[index]?.[tkey], transform[tkey]),
                }
              }
            }
          } else {
            animateStyles.current[key] = update(animateStyles.current[key], val)
          }
        } else {
          nonAnimatedStyle[key] = val
        }
      }

      const animatedStyle = {
        ...animateStyles.current,
        transform: animatedTranforms.current,
      }

      const args = [
        JSON.stringify(all),
        state.mounted,
        state.hover,
        state.press,
        state.pressIn,
        state.focus,
        delay,
        isPresent,
        onDidAnimate,
        onDidAnimateCb,
        presence?.exitVariant,
        presence?.enterVariant,
      ]

      useLayoutEffect(() => {
        //
        for (const runner of runners) {
          console.log('gogo')
          runner()
        }
      }, args)

      // const callback = (
      //   isExiting: boolean,
      //   exitingStyleProps: Record<string, boolean>,
      //   key: string,
      //   value: any
      // ) => {
      //   return (completed, current) => {
      //     onDidAnimateCb(key, completed, current, {
      //       attemptedValue: value,
      //     })
      //     if (isExiting) {
      //       exitingStyleProps[key] = false
      //       const areStylesExiting = Object.values(exitingStyleProps).some(Boolean)
      //       // if this is true, then we've finished our exit animations
      //       if (!areStylesExiting) {
      //         sendExitComplete?.()
      //       }
      //     }
      //   }
      // }

      return useMemo(() => {
        return {
          style: [nonAnimatedStyle, animatedStyle],
        }
      }, args)
    },
  }
}
