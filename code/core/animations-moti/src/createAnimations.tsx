import { PresenceContext, ResetPresence, usePresence } from '@tamagui/use-presence'
import {
  getSplitStyles,
  hooks,
  isWeb,
  Text,
  useComposedRefs,
  useThemeWithState,
  View,
  type AnimationDriver,
  type UniversalAnimatedNumber,
} from '@tamagui/web'
import type { TransitionConfig } from 'moti'
import { useMotify } from 'moti/author'
import type { CSSProperties } from 'react'
import React, { forwardRef, useRef } from 'react'
import type { TextStyle } from 'react-native'
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

// this is our own custom reanimated animated component so we can allow data- attributes, className etc
// this should ultimately be merged with react-native-web-lite

function createTamaguiAnimatedComponent(defaultTag = 'div') {
  const isText = defaultTag === 'span'

  const Component = Animated.createAnimatedComponent(
    forwardRef((propsIn: any, ref) => {
      const { forwardedRef, animation, tag = defaultTag, ...propsRest } = propsIn
      const hostRef = useRef()
      const composedRefs = useComposedRefs(forwardedRef, ref, hostRef)
      const stateRef = useRef<any>()
      if (!stateRef.current) {
        stateRef.current = {
          get host() {
            return hostRef.current
          },
        }
      }

      const [{ state }] = useThemeWithState({})

      // get styles but only inline style
      const result = getSplitStyles(
        propsRest,
        isText ? Text.staticConfig : View.staticConfig,
        state?.theme!,
        state?.name!,
        {
          unmounted: false,
        } as any,
        {
          isAnimated: false,
          noClass: true,
        }
      )

      const props = result.viewProps
      const Element = tag
      const transformedProps = hooks.usePropsTransform?.(tag, props, stateRef, false)

      return <Element {...transformedProps} ref={composedRefs} />
    })
  )
  Component['acceptTagProp'] = true
  return Component
}

const AnimatedView = createTamaguiAnimatedComponent('div')
const AnimatedText = createTamaguiAnimatedComponent('span')

// const AnimatedView = styled(View, {
//   disableClassName: true,
// })

// const AnimatedText = styled(Text, {
//   disableClassName: true,
// })

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
  color: true,
  left: true,
  right: true,
  top: true,
  bottom: true,
  fontSize: true,
  fontWeight: true,
  lineHeight: true,
  letterSpacing: true,
}

export function createAnimations<A extends Record<string, TransitionConfig>>(
  animations: A
): AnimationDriver<A> {
  return {
    View: isWeb ? AnimatedView : Animated.View,
    Text: isWeb ? AnimatedText : Animated.Text,
    // View: Animated.View,
    // Text: Animated.Text,
    isReactNative: true,
    animations,
    usePresence,
    ResetPresence,

    useAnimatedNumber(initial): UniversalAnimatedNumber<ReanimatedAnimatedNumber> {
      const sharedValue = useSharedValue(initial)

      return React.useMemo(
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
      const { props, presence, style, componentState } = animationProps
      const animationKey = Array.isArray(props.animation)
        ? props.animation[0]
        : props.animation

      const isHydrating = componentState.unmounted === true
      const disableAnimation = isHydrating || !animationKey

      let animate = {}
      let dontAnimate = {}

      if (disableAnimation) {
        dontAnimate = style
      } else {
        const animateOnly = props.animateOnly as string[]
        for (const key in style) {
          const value = style[key]
          if (
            !onlyAnimateKeys[key] ||
            value === 'auto' ||
            (typeof value === 'string' && value.startsWith('calc')) ||
            (animateOnly && !animateOnly.includes(key))
          ) {
            dontAnimate[key] = value
          } else {
            animate[key] = value
          }
        }
      }

      // if we don't do this moti seems to flicker a frame before applying animation
      if (componentState.unmounted === 'should-enter') {
        dontAnimate = style
      }

      const styles = animate
      const isExiting = Boolean(presence?.[1])
      const presenceContext = React.useContext(PresenceContext)
      const usePresenceValue = (presence || undefined) as any

      type UseMotiProps = Parameters<typeof useMotify>[0]

      // TODO moti is giving us type troubles, but this should work
      let transition = isHydrating
        ? { type: 'transition', duration: 0 }
        : (animations[animationKey as keyof typeof animations] as any)

      let hasClonedTransition = false

      if (Array.isArray(props.animation)) {
        const config = props.animation[1]
        if (config && typeof config === 'object') {
          for (const key in config) {
            const val = config[key]

            // performance - this seems to have (strangely) huge performance effect in uniswap
            // so instead of cloning up front, we clone only when we absolutely have to
            if (!hasClonedTransition) {
              transition = Object.assign({}, transition)
              hasClonedTransition = true
            }

            // referencing a pre-defined config
            if (typeof val === 'string') {
              transition[key] = animations[val]
            } else {
              transition[key] = val
            }
          }
        }
      }

      const motiProps = {
        animate: isExiting || componentState.unmounted === true ? {} : styles,
        transition: componentState.unmounted ? { duration: 0 } : transition,
        usePresenceValue,
        presenceContext,
        exit: isExiting ? styles : undefined,
      } satisfies UseMotiProps

      const moti = useMotify(motiProps)

      if (
        process.env.NODE_ENV === 'development' &&
        props['debug'] &&
        props['debug'] !== 'profile'
      ) {
        console.info(`useMotify(`, JSON.stringify(motiProps, null, 2) + ')', {
          'componentState.unmounted': componentState.unmounted,
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
