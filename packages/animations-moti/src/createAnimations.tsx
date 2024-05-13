import { PresenceContext, ResetPresence, usePresence } from '@tamagui/use-presence'
import type { AnimationDriver, UniversalAnimatedNumber } from '@tamagui/web'
import type { TransitionConfig } from 'moti'
import { useMotify } from 'moti/author'
import { type CSSProperties, useContext, useMemo } from 'react'
import type { SharedValue } from 'react-native-reanimated'
import type { TextStyle } from 'react-native'
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

// function createTamaguiAnimatedComponent(tag = 'div') {
//   const Component = Animated.createAnimatedComponent(
//     forwardRef(({ forwardedRef, style, ...props }: any, ref) => {
//       const composedRefs = useComposedRefs(forwardedRef, ref)
//       const Element = props.tag || tag

//       // TODO this block should be exported by web as styleToWebStyle()
//       const webStyle = style
//       styleToCSS(style)
//       if (Array.isArray(webStyle.transform)) {
//         style.transform = transformsToString(style.transform)
//       }
//       for (const key in style) {
//         style[key] = normalizeValueWithProperty(style[key], key)
//       }

//       return <Element {...props} style={style} ref={composedRefs} />
//     })
//   )
//   Component['acceptTagProp'] = true
//   return Component
// }

// const AnimatedView = createTamaguiAnimatedComponent('div')
// const AnimatedText = createTamaguiAnimatedComponent('span')

const onlyAnimateKeys: { [key in keyof TextStyle | keyof CSSProperties]?: boolean } = {
  transform: true,
  opacity: true,
  height: true,
  width: true,
  backgroundColor: true,
  borderColor: true,
  borderLeftColor: true,
  borderRightColor: true,
  borderTopColor: true,
  borderBottomColor: true,
  borderRadius: true,
  borderTopLeftRadius: true,
  borderTopRightRadius: true,
  borderBottomLeftRadius: true,
  borderBottomRightRadius: true,
  borderLeftWidth: true,
  borderRightWidth: true,
  borderTopWidth: true,
  borderBottomWidth: true,
}

export function createAnimations<A extends Record<string, TransitionConfig>>(
  animations: A
): AnimationDriver<A> {
  return {
    // View: isWeb ? AnimatedView : Animated.View,
    // Text: isWeb ? AnimatedText : Animated.Text,
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
          setValue(next, config = { type: 'spring' }, onFinish) {
            'worklet'
            if (config.type === 'direct') {
              sharedValue.value = next
              onFinish?.()
            } else if (config.type === 'spring') {
              sharedValue.value = withSpring(
                next,
                config,
                onFinish
                  ? () => {
                      'worklet'
                      runOnJS(onFinish)()
                    }
                  : undefined
              )
            } else {
              sharedValue.value = withTiming(
                next,
                config,
                onFinish
                  ? () => {
                      'worklet'
                      runOnJS(onFinish)()
                    }
                  : undefined
              )
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
        const animateOnly = props.animateOnly as string[]
        for (const key in style) {
          const value = style[key]
          if (
            !onlyAnimateKeys[key] ||
            value === 'auto' ||
            (animateOnly && !animateOnly.includes(key))
          ) {
            dontAnimate[key] = value
          } else {
            animate[key] = value
          }
        }
      }

      // without this, the driver breaks on native
      // stringifying -> parsing fixes that
      const animateStr = JSON.stringify(animate)
      const styles = useMemo(() => JSON.parse(animateStr), [animateStr])

      const isExiting = Boolean(presence?.[1])
      const presenceContext = useContext(PresenceContext)
      const usePresenceValue = (presence || undefined) as any

      type UseMotiProps = Parameters<typeof useMotify>[0]

      const motiProps = {
        animate: isExiting || isHydrating ? {} : styles,
        transition:
          // TODO moti is giving us type troubles, but this should work
          animations[animationKey as keyof typeof animations] as any,
        usePresenceValue,
        presenceContext,
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
