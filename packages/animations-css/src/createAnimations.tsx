import { usePresence } from '@tamagui/use-presence'
import {
  AnimationDriver,
  Stack,
  Text,
  UniversalAnimatedNumber,
  useIsomorphicLayoutEffect,
} from '@tamagui/web'
import { useMemo, useRef, useState } from 'react'

export function createAnimations<A extends Object>(animations: A): AnimationDriver<A> {
  return {
    View: Stack,
    Text: Text,
    animations,
    usePresence,

    useAnimatedNumber(initial): UniversalAnimatedNumber<number> {
      const [val, setVal] = useState(initial)

      return {
        getInstance() {
          return val
        },
        getValue() {
          return val
        },
        setValue(next) {
          setVal(next)
        },
        stop() {},
      }
    },

    useAnimatedNumberReaction({ hostRef, value }, onValue) {
      // doesn't make much sense given value the animated value is a state in this driver, but this is compatible
      useIsomorphicLayoutEffect(() => {
        if (!hostRef.current) return
        const onTransitionEvent = (e: TransitionEvent) => {
          onValue(value.getValue())
        }

        const node = hostRef.current as HTMLElement
        node.addEventListener('transitionstart', onTransitionEvent)
        node.addEventListener('transitioncancel', onTransitionEvent)
        node.addEventListener('transitionend', onTransitionEvent)
        return () => {
          node.removeEventListener('transitionstart', onTransitionEvent)
          node.removeEventListener('transitioncancel', onTransitionEvent)
          node.removeEventListener('transitionend', onTransitionEvent)
        }
      }, [hostRef, onValue])
    },

    useAnimatedNumberStyle(val, getStyle) {
      return getStyle(val.getValue())
    },

    useAnimations: ({ props, presence, style, state, hostRef }) => {
      const isEntering = !!state.unmounted
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]
      const animationKey = Array.isArray(props.animation)
        ? props.animation[0]
        : props.animation
      const animation = animations[animationKey as any]
      if (!animation) {
        return null
      }

      const keys = props.animateOnly ? props.animateOnly.join(' ') : 'all'

      useIsomorphicLayoutEffect(() => {
        if (!sendExitComplete || !isExiting || !hostRef.current) return
        const node = hostRef.current as HTMLElement
        const onFinishAnimation = () => {
          sendExitComplete?.()
        }
        node.addEventListener('transitionend', onFinishAnimation)
        node.addEventListener('transitioncancel', onFinishAnimation)
        return () => {
          node.removeEventListener('transitionend', onFinishAnimation)
          node.addEventListener('transitioncancel', onFinishAnimation)
        }
      }, [sendExitComplete, isExiting])

      // add css transition
      style.transition = `${keys} ${animation}`

      if (process.env.NODE_ENV === 'development' && props['debug']) {
        // rome-ignore lint/nursery/noConsoleLog: ok
        console.log('CSS animation', style, { isEntering, isExiting })
      }

      return useMemo(() => {
        return { style }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [JSON.stringify(style)])
    },
  }
}
