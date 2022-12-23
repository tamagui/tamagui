import {
  AnimationDriver,
  Stack,
  Text,
  useIsomorphicLayoutEffect,
} from '@tamagui/core'
import { usePresence } from '@tamagui/use-presence'
import { useMemo, useRef } from 'react'

export function createAnimations<A extends Object>(
  animations: A,
): AnimationDriver<A> {
  return {
    View: Stack,
    Text: Text,
    animations,
    usePresence,

    useAnimatedNumber(initial) {
      const val = useRef(initial)
      return {
        getInstance() {
          return val
        },
        getValue() {
          return val.current
        },
        setValue(next) {
          val.current = next
        },
        stop() {},
      }
    },

    useAnimatedNumberReaction(val, reaction) {
      // TODO use event listeners, would need access to the corresponsing node...
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
        // eslint-disable-next-line no-console
        console.log('CSS animation', style, { isEntering, isExiting })
      }

      return useMemo(() => {
        return { style }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [JSON.stringify(style)])
    },
  }
}
