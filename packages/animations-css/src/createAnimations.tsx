import { AnimationDriver } from '@tamagui/core'
import { useMemo } from 'react'

export function createAnimations<A extends Object>(animations: A): AnimationDriver<A> {
  return {
    avoidClasses: false,
    View: 'div',
    Text: 'span',
    animations,
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
