import { PresenceContext, ResetPresence, usePresence } from '@tamagui/use-presence'
import type { AnimationDriver, UniversalAnimatedNumber } from '@tamagui/web'
import type { MotiTransition } from 'moti'
import { useMotify } from 'moti/author'
import { useCallback, useContext, useMemo } from 'react'
import type { SharedValue } from 'react-native-reanimated'
import Animated, {
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
    animations,
    usePresence,
    ResetPresence,

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

    useAnimations: (animationProps) => {
      const { props, presence, style, onDidAnimate, componentState } = animationProps
      const animationKey = Array.isArray(props.animation)
        ? props.animation[0]
        : props.animation

      const isHydrating = componentState.unmounted === 'should-enter'
      let animate = {}
      let dontAnimate = {}

      if (isHydrating) {
        dontAnimate = style
      } else {
        const animateOnly = props.animateOnly || ['transform', 'opacity']
        if (animateOnly) {
          dontAnimate = { ...style }
          for (const key of animateOnly) {
            if (key in style) {
              animate[key] = style[key]
              delete dontAnimate[key]
            }
          }
        } else {
          animate = style
        }
      }

      // without this, the driver breaks on native
      // stringifying -> parsing fixes that
      const animateStr = JSON.stringify(animate)
      const styles = useMemo(() => JSON.parse(animateStr), [animateStr])

      const isExiting = Boolean(presence?.[1])
      const sendExitComplete = presence?.[1]

      const onDidAnimateCombined = useCallback(() => {
        onDidAnimate?.()
        sendExitComplete?.()
      }, [])

      type UseMotiProps = Parameters<typeof useMotify>[0]

      const motiProps = {
        animate: isExiting || isHydrating ? {} : styles,
        transition: animations[animationKey as keyof typeof animations],
        // isHydrating
        //   ? ({ type: 'timing', duration: 0 } as const)
        //   : componentState.unmounted
        //     ? { type: 'timing', duration: 0 }
        //     : animations[animationKey as keyof typeof animations]
        onDidAnimate: onDidAnimateCombined,
        usePresenceValue: presence as any,
        presenceContext: useContext(PresenceContext),
        exit: isExiting ? styles : undefined,
      } satisfies UseMotiProps

      const moti = useMotify(motiProps)

      if (process.env.NODE_ENV === 'development' && props['debug']) {
        console.info(`useMotify(`, JSON.stringify(motiProps, null, 2) + ')', {
          animationProps,
          motiProps,
          moti,
          style: [dontAnimate, moti.style],
        })
      }

      return {
        style: [dontAnimate, moti.style],
      }
    },
  }
}
