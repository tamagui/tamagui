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
      const interpolations = useRef(new WeakMap<Animated.Value, Animated.AnimatedInterpolation>())

      // TODO loop and create values, run them if they change

      const runners: Function[] = []

      function update(animated: Animated.Value | undefined, valIn: string | number) {
        if (typeof props.animation !== 'string') {
          return new Animated.Value(0)
        }
        const [val, type] = getValue(valIn)
        const value = animated || new Animated.Value(val)
        if (type) {
          interpolations.current.set(value, getInterpolated(value, type, val))
        }
        if (animated) {
          const animationConfig = animations[props.animation]
          runners.push(() => {
            Animated.spring(animated, {
              toValue: val,
              useNativeDriver: !isWeb,
              ...animationConfig,
            }).start()
          })
        }
        return value
      }

      function getValue(input: number | string) {
        if (typeof input !== 'string') {
          return [input] as const
        }
        const neg = input[0] === '-'
        if (neg) input = input.slice(1)
        const [_, number, after] = input.match(/([-0-9]+)(deg|%)/) ?? []
        return [+number * (neg ? -1 : 1), after] as const
      }

      function getInterpolated(val: Animated.Value, postfix: string, next: number) {
        const cur = val['_value'] as number
        const inputRange = [cur, next]
        const outputRange = [`${cur}deg`, `${next}deg`]
        if (next < cur) {
          inputRange.reverse()
          outputRange.reverse()
        }
        return val.interpolate({
          inputRange,
          outputRange,
        })
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
        ...Object.fromEntries(
          Object.entries({
            ...animateStyles.current,
          }).map(([k, v]) => [k, interpolations.current.get(v) || v])
        ),
        transform: animatedTranforms.current.map((r) => {
          const key = Object.keys(r)[0]
          const val = interpolations.current.get(r[key]) || r[key]
          return { [key]: val }
        }),
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
