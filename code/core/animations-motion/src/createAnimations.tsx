import { PresenceContext, ResetPresence, usePresence } from '@tamagui/use-presence'
import {
  type AnimationProp,
  isWeb,
  type AnimationDriver,
  type UniversalAnimatedNumber,
} from '@tamagui/web'
import {
  motion,
  useAnimate,
  useSpring,
  type AnimationOptions,
  type MotionValue,
  type ValueTransition,
} from 'motion/react'
import React, { forwardRef, useLayoutEffect, useMemo, useRef } from 'react'
import { Text, View } from 'react-native'

type MotionAnimatedNumber = MotionValue<number>
type AnimationConfig = ValueTransition

export function createAnimations<A extends Record<string, AnimationConfig>>(
  animations: A
): AnimationDriver<A> {
  function getMotionAnimatedProps(
    props: { animation: AnimationProp | null; animateOnly?: string[] },
    style: Record<string, unknown>
  ) {
    const animationOptions = animationPropToAnimationConfig(props.animation)

    let dontAnimate = {}
    const doAnimate = {}

    const animateOnly = props.animateOnly as string[] | undefined
    for (const key in style) {
      const value = style[key]
      if (animateOnly && !animateOnly.includes(key)) {
        dontAnimate[key] = value
      } else {
        doAnimate[key] = value
      }
    }

    return {
      dontAnimate,
      doAnimate,
      animationOptions,
    }
  }

  function animationPropToAnimationConfig(
    animationProp: AnimationProp | null
  ): AnimationOptions {
    let defaultAnimationKey = ''
    let specificAnimations = {}

    if (typeof animationProp === 'string') {
      defaultAnimationKey = animationProp
    } else if (Array.isArray(animationProp)) {
      if (typeof animationProp[0] === 'string') {
        defaultAnimationKey = animationProp[0]
        specificAnimations = animationProp[1]
      } else {
        specificAnimations = animationProp
      }
    }

    if (!defaultAnimationKey) {
      return {}
    }

    return {
      default: animations[defaultAnimationKey],
      ...Object.fromEntries(
        Object.keys(specificAnimations).flatMap((key) => {
          if (animations[key]) {
            return [[key, animations[key]]]
          }
          return []
        })
      ),
    }
  }

  return {
    View: isWeb ? MotionView : View,
    Text: isWeb ? MotionView : Text,
    isReactNative: false,
    supportsCSSVars: true,
    needsWebStyles: true,
    avoidReRenders: true,
    animations,
    usePresence,
    ResetPresence,

    useAnimations: (animationProps) => {
      const { props, presence, style, componentState, stateRef, useStyleEmitter } =
        animationProps
      const animationKey = Array.isArray(props.animation)
        ? props.animation[0]
        : props.animation

      const isHydrating = componentState.unmounted === true
      const disableAnimation = isHydrating || !animationKey
      const presenceContext = React.useContext(PresenceContext)

      const [scope, animate] = useAnimate()

      // const style = styleToCSS(styleIn)

      const { dontAnimate, doAnimate, animationOptions } = useMemo(() => {
        return getMotionAnimatedProps(props as any, style)
      }, [
        presenceContext,
        presence,
        animationKey,
        componentState.unmounted,
        JSON.stringify(style),
      ])

      const curAnimatedStyle = useRef({})

      useStyleEmitter?.((nextStyle) => {
        const { doAnimate, animationOptions } = getMotionAnimatedProps(
          props as any,
          nextStyle
        )
        console.log('go for it', doAnimate, animationOptions)
        animate(stateRef.current.host as any, doAnimate, animationOptions)
      })

      useLayoutEffect(() => {
        curAnimatedStyle.current = doAnimate
        animate(stateRef.current.host as any, doAnimate, animationOptions)
      }, [doAnimate, animationOptions])

      return {
        style: dontAnimate,
        ref: scope,
      }
    },

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
  }
}

const MotionView = forwardRef((props: any, ref) => {
  const Element = motion[props.tag || 'div']
  return <Element ref={ref} {...props} />
})
