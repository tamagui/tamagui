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
import { useSpring, useTime, type MotionValue } from 'motion/react'
import type { CSSProperties } from 'react'
import React, { forwardRef, useMemo, useRef } from 'react'
import type { TextStyle } from 'react-native'

type MotionAnimatedNumber = MotionValue<number>

type SpringConfig = {
  type: 'spring'
  stiffness?: number
  damping?: number
  mass?: number
  velocity?: number
  restSpeed?: number
  restDelta?: number
}

type TimeConfig = {
  type: 'time'
  duration?: number
  ease?: string | number[]
}

type AnimationConfig = SpringConfig | TimeConfig

// This creates our own custom motion animated component for web
function createTamaguiMotionComponent(defaultTag = 'div') {
  const isText = defaultTag === 'span'

  const Component = forwardRef((propsIn: any, ref) => {
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

    const [_, state] = useThemeWithState({})

    // Get styles but only inline style
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
  
  Component['acceptTagProp'] = true
  return Component
}

const MotionView = createTamaguiMotionComponent('div')
const MotionText = createTamaguiMotionComponent('span')

const animatableKeys: { [key in keyof TextStyle | keyof CSSProperties]?: boolean } = {
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

export function createAnimations<A extends Record<string, AnimationConfig>>(
  animations: A
): AnimationDriver<A> {
  return {
    View: isWeb ? MotionView : View,
    Text: isWeb ? MotionText : Text,
    isReactNative: false,
    supportsCSSVars: true,
    animations,
    usePresence,
    ResetPresence,

    useAnimatedNumber(initial): UniversalAnimatedNumber<MotionAnimatedNumber> {
      const motionValue = useSpring(initial)

      return React.useMemo(
        () => ({
          getInstance() {
            return motionValue
          },
          getValue() {
            return motionValue.get()
          },
          setValue(next, config = { type: 'spring' }, onFinish) {
            if (config.type === 'direct') {
              motionValue.jump(next)
              onFinish?.()
            } else {
              motionValue.set(next)
              // Motion doesn't have a direct onFinish callback, so we simulate it
              if (onFinish) {
                const unsubscribe = motionValue.on('change', (value) => {
                  if (Math.abs(value - next) < 0.01) {
                    unsubscribe()
                    onFinish()
                  }
                })
              }
            }
          },
          stop() {
            motionValue.stop()
          },
        }),
        [motionValue]
      )
    },

    useAnimatedNumberReaction({ value }, onValue) {
      const instance = value.getInstance()
      
      React.useEffect(() => {
        const unsubscribe = instance.on('change', onValue)
        return unsubscribe
      }, [instance, onValue])
    },

    useAnimatedNumberStyle(val, getStyle) {
      const instance = val.getInstance()
      const [style, setStyle] = React.useState(() => getStyle(instance.get()))

      React.useEffect(() => {
        const unsubscribe = instance.on('change', (value) => {
          setStyle(getStyle(value))
        })
        return unsubscribe
      }, [instance, getStyle])

      return style
    },

    useAnimations: (animationProps) => {
      const { props, presence, style, componentState } = animationProps
      const animationKey = Array.isArray(props.animation)
        ? props.animation[0]
        : props.animation

      const isHydrating = componentState.unmounted === true
      const disableAnimation = isHydrating || !animationKey
      const presenceContext = React.useContext(PresenceContext)

      const { dontAnimate, animatedStyle } = useMemo(() => {
        let animate = {}
        let dontAnimate = {}

        if (disableAnimation) {
          dontAnimate = style
        } else {
          const animateOnly = props.animateOnly as string[]
          for (const key in style) {
            const value = style[key]
            if (
              !animatableKeys[key] ||
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

        // If we're entering, don't animate on first render
        if (componentState.unmounted === 'should-enter') {
          dontAnimate = style
        }

        const isExiting = Boolean(presence?.[1])
        
        // Get animation config
        let animationConfig = isHydrating
          ? { type: 'spring', duration: 0 }
          : (animations[animationKey as keyof typeof animations] as any)

        // Handle array-based animation config
        if (Array.isArray(props.animation)) {
          const config = props.animation[1]
          if (config && typeof config === 'object') {
            animationConfig = { ...animationConfig, ...config }
          }
        }

        return {
          dontAnimate,
          animatedStyle: animate,
          animationConfig,
          isExiting,
        }
      }, [
        presenceContext,
        presence,
        animationKey,
        componentState.unmounted,
        JSON.stringify(style),
      ])

      // For now, we'll return the combined style
      // In a more complete implementation, we'd use Motion's animate prop
      return {
        style: [dontAnimate, animatedStyle],
      }
    },
  }
}