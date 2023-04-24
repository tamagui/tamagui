import { PresenceContext, usePresence } from '@tamagui/use-presence'
import { AnimationDriver, UniversalAnimatedNumber } from '@tamagui/web'
import { MotiTransition, useMotify } from 'moti'
import { useContext, useMemo } from 'react'
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'

export function createAnimations<A extends Record<string, MotiTransition>>(
  animations: A
): AnimationDriver<A> {
  return {
    View: Animated.View,
    Text: Animated.Text,
    isReactNative: true,
    animations,
    usePresence,

    useAnimatedNumber(initial): UniversalAnimatedNumber<number> {
      const val = useSharedValue(initial)

      return useMemo(
        () => ({
          getInstance() {
            'worklet'
            return val.value
          },
          getValue() {
            'worklet'
            return val.value
          },
          setValue(next) {
            'worklet'
            val.value = next
          },
          stop() {
            'worklet'
          },
        }),
        [val]
      )
    },

    useAnimatedNumberReaction({ value }, onValue) {
      return useAnimatedReaction(
        () => {
          return value.getValue()
        },
        (next, prev) => {
          if (prev !== next) {
            // @nate what is the point of this hook? is this necessary?
            // without runOnJS, onValue would need to be a worklet
            runOnJS(onValue)(next)
          }
        },
        // dependency array is very important here
        [value, onValue]
      )
    },

    /**
     * `getStyle` must be a worklet
     */
    useAnimatedNumberStyle(val, getStyle) {
      return useDerivedValue(() => {
        return getStyle(val.getValue())
        // dependency array is very important here
      }, [val, getStyle])
    },

    useAnimations: ({ props, presence, style, onDidAnimate }) => {
      const animationKey = Array.isArray(props.animation)
        ? props.animation[0]
        : props.animation

      let animate = style
      const nonAnimatedStyle: object | undefined = { ...style }

      const animateOnly = props.animateOnly ?? ['opacity', 'transform']

      animate = {}
      animateOnly.forEach((nonAnimatedKey) => {
        if (!style[nonAnimatedKey]) return
        animate[nonAnimatedKey] = style[nonAnimatedKey]
        delete style[nonAnimatedKey]
      })

      const animateStr = JSON.stringify(animate)
      const moti = useMotify({
        // without this, the driver breaks on native
        // stringifying -> parsing fixes that
        animate: useMemo(() => JSON.parse(animateStr), [animateStr]),
        transition: animations[animationKey as keyof typeof animations],
        onDidAnimate,
        usePresenceValue: presence as any,
        presenceContext: useContext(PresenceContext),
      })

      return {
        style: [nonAnimatedStyle, moti.style],
      }
    },
  }
}
