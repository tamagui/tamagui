import { AnimationDriver, Stack, Text } from '@tamagui/core'
import { useMemo, useRef } from 'react'

export function createAnimations<A extends Object>(animations: A): AnimationDriver<A> {
  return {
    avoidClasses: false,
    View: Stack,
    Text: Text,
    animations,

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

    useAnimations: (props, { getStyle }) => {
      const animationKey = Array.isArray(props.animation) ? props.animation[0] : props.animation
      const animation = animations[animationKey as any]
      if (!animation) {
        throw new Error(`no animation found: ${props.animation}`)
      }

      const keys = props.animateOnly ? props.animateOnly.join(' ') : 'all'

      const style = {
        style: {
          transition: `${keys} ${animation}`,
          ...getStyle(),
        },
      }

      return useMemo(() => {
        return style
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [JSON.stringify(style)])
    },
  }
}
