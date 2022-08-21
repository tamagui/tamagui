import { PresenceContext, usePresence } from '@tamagui/animate-presence'
import {
  AnimatedNumberStrategy,
  AnimationConfigType,
  AnimationDriver,
  AnimationProp,
  UniversalAnimatedNumber,
  isWeb,
  useEvent,
  useIsomorphicLayoutEffect,
} from '@tamagui/core'
import { AnimationControls, animate } from 'motion'
import { useContext, useEffect, useMemo, useRef } from 'react'
import { Text, View } from 'react-native'

export const AnimatedView = View
export const AnimatedText = Text

export function useAnimatedNumber(
  initial: number
): UniversalAnimatedNumber<AnimationControls | null> {
  const state = useRef(
    null as any as {
      val: number
      controls: AnimationControls | null
    }
  )
  if (!state.current) {
    state.current = {
      val: initial,
      controls: null,
    }
  }
  return {
    getInstance() {
      return state.current.controls
    },
    getValue() {
      return state.current.val
    },
    stop() {
      state.current.controls?.stop()
    },
    setValue(next: number, { type, ...config } = { type: 'spring' }) {
      // const val = state.current.val
      // if (type === 'direct') {
      //   val.setValue(next)
      // } else if (type === 'spring') {
      //   state.current.composite?.stop()
      //   const composite = Animated.spring(val, {
      //     ...config,
      //     toValue: next,
      //     useNativeDriver: !isWeb,
      //   })
      //   composite.start()
      //   state.current.composite = composite
      // } else {
      //   state.current.composite?.stop()
      //   const composite = Animated.timing(val, {
      //     ...config,
      //     toValue: next,
      //     useNativeDriver: !isWeb,
      //   })
      //   composite.start()
      //   state.current.composite = composite
      // }
    },
  }
}

export function useAnimatedNumberReaction(
  value: UniversalAnimatedNumber<any>,
  cb: (current: number) => void
) {
  // const onChange = useEvent((current) => {
  //   cb(current.value)
  // })
  // useEffect(() => {
  //   const id = value.getInstance().addListener(onChange)
  //   return () => {
  //     value.getInstance().removeListener(id)
  //   }
  // }, [value, onChange])
}

export function useAnimatedNumberStyle<V extends UniversalAnimatedNumber<any>>(
  value: V,
  getStyle: (value: any) => any
) {
  return getStyle(value.getInstance())
}

// @ts-ignore
export function createAnimations<A extends AnimationConfigType>(animations: A): AnimationDriver<A> {
  AnimatedView['displayName'] = 'AnimatedView'
  AnimatedText['displayName'] = 'AnimatedText'

  return {
    avoidClasses: true,
    animations,
    View: AnimatedView,
    Text: AnimatedText,
    useAnimatedNumber,
    useAnimatedNumberReaction,
    useAnimatedNumberStyle,
    useAnimations: (props, helpers) => {
      const { onDidAnimate, delay, getStyle, state } = helpers
      const [isPresent, sendExitComplete] = usePresence()
      const presence = useContext(PresenceContext)

      const isExiting = isPresent === false
      const isEntering = !state.mounted

      const all = getStyle({
        isExiting,
        isEntering,
        exitVariant: presence?.exitVariant,
        enterVariant: presence?.enterVariant,
      })

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
        presence?.exitVariant,
        presence?.enterVariant,
      ]

      // return useMemo(() => {
      //   return {
      //     style: [nonAnimatedStyle, animatedStyle],
      //   }
      //   // eslint-disable-next-line react-hooks/exhaustive-deps
      // }, args)
      return {}
    },
  }
}
