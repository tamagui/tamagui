import { AnimationDriver } from '@tamagui/core'

export function createAnimations<A extends Object>(animations: A): AnimationDriver<A> {
  return {
    avoidClasses: false,
    View: 'div',
    Text: 'span',
    animations,
    useAnimations: (props, { getStyle }) => {
      const animation = animations[props.animation as any]
      if (!animation) {
        throw new Error(`no animation found: ${props.animation}`)
      }

      const keys = props.animateOnly ? props.animateOnly.join(' ') : 'all'

      return {
        style: {
          transition: `${keys} ${animation}`,
          ...getStyle(),
        },
      }
    },
  }
}
