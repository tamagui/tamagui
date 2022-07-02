import { PresenceContext, usePresence } from '@tamagui/animate-presence'
import { AnimationDriver, AnimationProp } from '@tamagui/core'
import { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Animated } from 'react-native'

type AnimationsConfig<A extends Object = any> = {
  [Key in keyof A]: AnimationConfig
}

type AnimationConfig = {}
// | ({ type: 'timing'; loop?: number; repeat?: number; repeatReverse?: boolean } & WithTimingConfig)
// | ({ type: 'spring'; loop?: number; repeat?: number; repeatReverse?: boolean } & WithSpringConfig)
// | ({ type: 'decay'; loop?: number; repeat?: number; repeatReverse?: boolean } & WithDecayConfig)

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

      const animatedValues = useRef<Record<string, Animated.Value>>({})

      // TODO loop and create values, run them if they change

      const [animatedStyles, nonAnimatedStyle] = [{}, {}]
      const animatedStyleKey = {
        transform: true,
        opacity: true,
      }
      for (const key of Object.keys(all)) {
        if (animatedStyleKey[key]) {
          animatedStyles[key] = all[key]
        } else {
          nonAnimatedStyle[key] = all[key]
        }
      }

      const animatedStyle = animatedStyleKey

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
