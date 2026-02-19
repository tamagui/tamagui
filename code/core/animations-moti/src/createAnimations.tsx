// @ts-nocheck - deprecated package, moti dependency intentionally not included
import { PresenceContext, ResetPresence, usePresence } from '@tamagui/use-presence'
// we need core for hooks.usePropsTransform
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
} from '@tamagui/core'

// Helper to resolve dynamic theme values like {dynamic: {dark: "value", light: undefined}}
const resolveDynamicValue = (value: any, isDark: boolean): any => {
  if (value && typeof value === 'object' && 'dynamic' in value) {
    const dynamicValue = isDark ? value.dynamic.dark : value.dynamic.light
    return dynamicValue
  }
  return value
}
import type { TransitionConfig } from 'moti'
import { useMotify } from 'moti/author'
import type { CSSProperties } from 'react'
import React, { forwardRef, useMemo, useRef } from 'react'
import type { TextStyle } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import Animated_, {
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

// fix for building with type module
// see https://github.com/evanw/esbuild/issues/2480#issuecomment-1833104754
const safeESModule = <T,>(a: T | { default: T }): T => {
  const b = a as any
  const out = b.__esModule || b[Symbol.toStringTag] === 'Module' ? b.default : b
  // add metro support
  return out || a
}

const Animated = safeESModule(Animated_)

type ReanimatedAnimatedNumber = SharedValue<number>

// this is our own custom reanimated animated component so we can allow data- attributes, className etc
// this should ultimately be merged with react-native-web-lite

function createTamaguiAnimatedComponent(defaultTag = 'div') {
  const isText = defaultTag === 'span'

  const Component = Animated.createAnimatedComponent(
    forwardRef((propsIn: any, ref) => {
      const { forwardedRef, animation, render = defaultTag, ...propsRest } = propsIn
      const hostRef = useRef(null)
      const composedRefs = useComposedRefs(forwardedRef, ref, hostRef)
      const stateRef = useRef<any>(null)
      if (!stateRef.current) {
        stateRef.current = {
          get host() {
            return hostRef.current
          },
        }
      }

      const [_, state] = useThemeWithState({})

      // get styles but only inline style
      const result = getSplitStyles(
        propsRest,
        isText ? Text.staticConfig : View.staticConfig,
        state?.theme,
        state?.name,
        {
          unmounted: false,
        } as any,
        {
          isAnimated: false,
          noClass: true,
        }
      )

      const props = result?.viewProps || {}
      const Element = render
      const transformedProps = hooks.usePropsTransform?.(render, props, stateRef, false)

      return <Element {...transformedProps} ref={composedRefs} />
    })
  )
  Component['acceptRenderProp'] = true
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
    needsCustomComponent: true,
    View: isWeb ? AnimatedView : Animated.View,
    Text: isWeb ? AnimatedText : Animated.Text,
    // View: Animated.View,
    // Text: Animated.Text,
    isReactNative: true,
    inputStyle: 'value',
    outputStyle: 'inline',
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
      const animationKey = Array.isArray(props.transition)
        ? props.transition[0]
        : props.transition

      const isHydrating = componentState.unmounted === true
      const disableAnimation = isHydrating || !animationKey
      const presenceContext = React.useContext(PresenceContext)
      const [, themeState] = useThemeWithState({})
      // Check scheme first, then fall back to checking theme name for 'dark'
      const isDark = themeState?.scheme === 'dark' || themeState?.name?.startsWith('dark')

      // this memo is very important for performance, there's a big cost to
      // updating these values every render
      const { dontAnimate, motiProps } = useMemo(() => {
        let animate = {}
        let dontAnimate = {}

        if (disableAnimation) {
          // Resolve dynamic objects based on current theme
          for (const key in style) {
            const rawValue = style[key]
            const value = resolveDynamicValue(rawValue, isDark)
            if (value === undefined) continue
            dontAnimate[key] = value
          }
        } else {
          const animateOnly = props.animateOnly as string[]
          for (const key in style) {
            const rawValue = style[key]
            // Resolve dynamic theme values (like $theme-dark)
            const value = resolveDynamicValue(rawValue, isDark)
            if (value === undefined) continue
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
          // Resolve dynamic objects based on current theme
          for (const key in style) {
            const rawValue = style[key]
            const value = resolveDynamicValue(rawValue, isDark)
            if (value === undefined) continue
            dontAnimate[key] = value
          }
        }

        const styles = animate
        const isExiting = Boolean(presence?.[1])
        const usePresenceValue = (presence || undefined) as any

        type UseMotiProps = Parameters<typeof useMotify>[0]

        // TODO moti is giving us type troubles, but this should work
        let transition = isHydrating
          ? { type: 'transition', duration: 0 }
          : (animations[animationKey as keyof typeof animations] as any)

        let hasClonedTransition = false

        if (Array.isArray(props.transition)) {
          const config = props.transition[1]
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

        return {
          dontAnimate,
          motiProps: {
            animate: isExiting || componentState.unmounted === true ? {} : styles,
            transition: componentState.unmounted ? { duration: 0 } : transition,
            usePresenceValue,
            presenceContext,
            exit: isExiting ? styles : undefined,
          } satisfies UseMotiProps,
        }
      }, [
        presenceContext,
        presence,
        animationKey,
        componentState.unmounted,
        JSON.stringify(style),
        presenceContext,
        isDark,
      ])

      const moti = useMotify(motiProps)

      if (
        process.env.NODE_ENV === 'development' &&
        props['debug'] &&
        props['debug'] !== 'profile'
      ) {
        console.info(`useMotify(`, JSON.stringify(motiProps, null, 2) + ')', {
          'componentState.unmounted': componentState.unmounted,
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
