import { PresenceContext, usePresence } from '@tamagui/use-presence'
import { AnimationDriver, UniversalAnimatedNumber } from '@tamagui/web'
import type { MotiTransition } from 'moti'
import { useMotify } from 'moti/author'
import { useCallback, useContext, useMemo } from 'react'
import Animated, {
  SharedValue,
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

type ReanimatedAnimatedNumber = SharedValue<number>

export function createAnimations<A extends Record<string, MotiTransition>>(
  animations: A
): AnimationDriver<A> {
  return {
    View: Animated.View,
    Text: Animated.Text,
    isReactNative: true,
    keepStyleSSR: true,
    supportsCSSVars: true,
    animations,
    usePresence,
    supportsPseudos: true,

    useAnimatedNumber(initial): UniversalAnimatedNumber<ReanimatedAnimatedNumber> {
      const sharedValue = useSharedValue(initial)

      return useMemo(
        () => ({
          getInstance() {
            'worklet'
            return sharedValue
          },
          getValue() {
            'worklet'
            return sharedValue.value
          },
          setValue(next, config = { type: 'spring' }) {
            'worklet'
            if (config.type === 'direct') {
              sharedValue.value = next
            } else if (config.type === 'spring') {
              sharedValue.value = withSpring(next, config)
            } else {
              sharedValue.value = withTiming(next, config)
            }
          },
          stop() {
            'worklet'
            cancelAnimation(sharedValue)
          },
        }),
        [sharedValue]
      )
    },

    useAnimatedNumberReaction({ value }, onValue) {
      const instance = value.getInstance()
      return useAnimatedReaction(
        () => {
          return instance.value
        },
        (next, prev) => {
          if (prev !== next) {
            // @nate what is the point of this hook? is this necessary?
            // without runOnJS, onValue would need to be a worklet
            runOnJS(onValue)(next)
          }
        },
        // dependency array is very important here
        [onValue, instance]
      )
    },

    /**
     * `getStyle` must be a worklet
     */
    useAnimatedNumberStyle(val, getStyle) {
      const instance = val.getInstance()

      // this seems wrong but it works
      const derivedValue = useDerivedValue(() => {
        return instance.value
        // dependency array is very important here
      }, [instance, getStyle])

      return useAnimatedStyle(() => {
        return getStyle(derivedValue.value)
        // dependency array is very important here
      }, [val, getStyle, derivedValue, instance])
    },

    useAnimations: ({ props, presence, style, onDidAnimate, pseudos }) => {
      const pseudoState = useSharedValue({
        hover: false,
        press: false,
        focus: false,
      })
      const [animationKey, transitionOverride] = [].concat(props.animation)

      const isExiting = Boolean(presence?.[1])
      const sendExitComplete = presence?.[1]
      const transition = Object.assign(
        {},
        animations[animationKey as keyof typeof animations],
        transitionOverride
      )

      const onDidAnimateCombined = useCallback(() => {
        onDidAnimate?.()
        sendExitComplete?.()
      }, [])

      const animateOnly = props.animateOnly || ['transform', 'opacity']
      const dontAnimate = { ...style }
      for (const key of animateOnly) {
        if (key in style) {
          delete dontAnimate[key]
        }
      }

      // TODO see if native works without this
      // this is likely expensive for no reason
      const animateStr = JSON.stringify(style)
      const styles = useMemo(() => JSON.parse(animateStr), [animateStr])

      const animateOnlyString = animateOnly.join(',')

      const animateWithPseudos = useDerivedValue<any>(() => {
        let final = Object.assign({}, styles)

        const { hover: hovered, press: pressed, focus: focused } = pseudoState.value

        if (hovered && pseudos?.hoverStyle) {
          final = Object.assign(final, pseudos.hoverStyle)
        }

        if (pressed && pseudos?.pressStyle) {
          final = Object.assign(final, pseudos.pressStyle)
        }

        if (focused && pseudos?.focusStyle) {
          final = Object.assign(final, pseudos.focusStyle)
        }

        const animatesOnly = animateOnlyString.split(',')

        Object.keys(final).forEach((key) => {
          if (!animatesOnly.includes(key)) {
            delete final[key]
          }
        })

        if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log(`Moti animation:`, {
            animate: final,
            transition,
            styles,
            moti,
            dontAnimate,
            isExiting,
            animateStr,
          })
        }

        return final
      }, [pseudoState, pseudos, styles, animateOnlyString])

      const moti = useMotify({
        animate: isExiting ? undefined : animateWithPseudos,
        transition,
        onDidAnimate: onDidAnimateCombined,
        usePresenceValue: presence as any,
        presenceContext: useContext(PresenceContext),
        exit: isExiting ? styles : undefined,
      })

      return {
        style: [dontAnimate, moti.style],
        updatePseudoState(next) {
          pseudoState.value = Object.assign({}, pseudoState.value, next)
        },
      }
    },
  }
}
