import { AnimatePresenceContext, usePresence } from '@tamagui/animate-presence'
import { AnimationDriver, UseAnimationProps, UseAnimationState } from '@tamagui/core'
import { createContext, useCallback, useContext, useEffect } from 'react'
import {
  PerpectiveTransform,
  RotateTransform,
  RotateXTransform,
  RotateYTransform,
  RotateZTransform,
  ScaleTransform,
  ScaleXTransform,
  ScaleYTransform,
  SkewXTransform,
  SkewYTransform,
  TranslateXTransform,
  TranslateYTransform,
} from 'react-native'
import Animated, {
  WithDecayConfig,
  WithSpringConfig,
  WithTimingConfig,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

const AnimatedView = Animated.View
const AnimatedText = Animated.Text

AnimatedView['displayName'] = 'AnimatedView'
AnimatedText['displayName'] = 'AnimatedText'

export function createAnimations<A extends Object>(animations: A): AnimationDriver<A> {
  return {
    avoidClasses: true,
    animations,
    View: AnimatedView,
    Text: AnimatedText,
    useAnimations: (props: UseAnimationProps, state: UseAnimationState) => {
      const { style, hoverStyle, pressStyle, focusStyle, exitStyle, onDidAnimate, delay } = state
      const [isPresent, safeToUnmount] = usePresence()
      const presence = useContext(AnimatePresenceContext)
      const isMounted = useSharedValue(false)
      const hasExitStyle = !!exitStyle
      const custom = useCallback(() => {
        'worklet'
        return presence?.custom
      }, [presence])

      const reanimatedOnDidAnimated = useCallback<NonNullable<typeof onDidAnimate>>(
        (...args) => {
          onDidAnimate?.(...args)
        },
        [onDidAnimate]
      )
      const reanimatedSafeToUnmount = useCallback(() => {
        safeToUnmount?.()
      }, [safeToUnmount])

      useEffect(() => {
        isMounted.value = true
      }, [isMounted])

      useEffect(
        function allowUnMountIfMissingExit() {
          if (!isPresent && !hasExitStyle) {
            reanimatedSafeToUnmount()
          }
        },
        [hasExitStyle, isPresent, reanimatedSafeToUnmount]
      )

      const animatedStyle = useAnimatedStyle(() => {
        const final = {
          transform: [] as any[],
        }

        const isExiting = !isPresent && !!exitStyle
        const transition = animations[props.animation]

        const mergedStyles = {
          ...style,
          ...hoverStyle,
          ...pressStyle,
          ...focusStyle,
          // ...isExiting && exitStyle(custom()),
          ...(isExiting && exitStyle),
        }

        // console.log('wut', style, hoverStyle, pressStyle, isExiting)

        const exitingStyleProps: Record<string, boolean> = {}
        if (exitStyle) {
          for (const key of Object.keys(exitStyle)) {
            exitingStyleProps[key] = true
          }
        }

        for (const key in mergedStyles) {
          const value = mergedStyles[key]
          const { animation, config, shouldRepeat, repeatCount, repeatReverse } = animationConfig(
            key,
            transition
          )

          const callback: (completed: boolean, value?: any) => void = (completed, recentValue) => {
            if (onDidAnimate) {
              runOnJS(reanimatedOnDidAnimated)(key as any, completed, recentValue, {
                attemptedValue: value,
              })
            }
            if (isExiting) {
              exitingStyleProps[key] = false
              const areStylesExiting = Object.values(exitingStyleProps).some(Boolean)
              // if this is true, then we've finished our exit animations
              if (!areStylesExiting) {
                runOnJS(reanimatedSafeToUnmount)()
              }
            }
          }

          let { delayMs = null } = animationDelay(key, transition, delay)

          if (key === 'transform') {
            if (!Array.isArray(value)) {
              console.error(`Invalid transform value. Needs to be an array.`)
            } else {
              for (const transformObject of value) {
                const key = Object.keys(transformObject)[0]
                const transformValue = transformObject[key]
                const transform = {} as any
                if (transition?.[key]?.delay != null) {
                  delayMs = transition?.[key]?.delay ?? null
                }
                let finalValue = animation(transformValue, config, callback)
                if (shouldRepeat) {
                  finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
                }
                if (delayMs != null) {
                  transform[key] = withDelay(delayMs, finalValue)
                } else {
                  transform[key] = finalValue
                }
                if (Object.keys(transform).length) {
                  final['transform'].push(transform)
                }
              }
            }
          } else if (typeof value === 'object') {
            // shadows
            final[key] = {}
            for (const innerStyleKey of Object.keys(value || {})) {
              let finalValue = animation(value, config, callback)
              if (shouldRepeat) {
                finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
              }
              if (delayMs != null) {
                final[key][innerStyleKey] = withDelay(delayMs, finalValue)
              } else {
                final[key][innerStyleKey] = finalValue
              }
            }
          } else {
            let finalValue = animation(value, config, callback)
            if (shouldRepeat) {
              finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
            }
            if (delayMs != null && typeof delayMs === 'number') {
              final[key] = withDelay(delayMs, finalValue)
            } else {
              final[key] = finalValue
            }
          }

          // end for (key in mergedStyles)
        }

        console.log('final', final)

        return final
      }, [
        style,
        custom,
        delay,
        // disableInitialAnimation,
        // exitProp,
        // exitTransitionProp,
        // fromProp,
        isPresent,
        hasExitStyle,
        isMounted,
        isPresent,
        onDidAnimate,
        reanimatedOnDidAnimated,
        reanimatedSafeToUnmount,
        // state,
        // stylePriority,
        // transitionProp,
      ])

      return {
        style: animatedStyle,
      }
    },
  }
}

function animationDelay<Animate>(
  key: string,
  transition: MotiTransition<Animate> | undefined,
  defaultDelay?: number
) {
  'worklet'
  let delayMs: TransitionConfig['delay'] = defaultDelay

  if ((transition as any)?.[key as keyof Animate]?.delay != null) {
    delayMs = (transition as any)?.[key as keyof Animate]?.delay
  } else if (transition?.delay != null) {
    delayMs = transition.delay
  }

  return {
    delayMs,
  }
}

type MotiTransition<A> = any
type Transforms = PerpectiveTransform &
  RotateTransform &
  RotateXTransform &
  RotateYTransform &
  RotateZTransform &
  ScaleTransform &
  ScaleXTransform &
  ScaleYTransform &
  TranslateXTransform &
  TranslateYTransform &
  SkewXTransform &
  SkewYTransform
type TransitionConfigWithoutRepeats = (
  | ({ type?: 'spring' } & WithSpringConfig)
  | ({ type: 'timing' } & WithTimingConfig)
  | ({ type: 'decay' } & WithDecayConfig)
) & {
  delay?: number
}

type TransitionConfig = TransitionConfigWithoutRepeats & {
  /**
   * Number of times this animation should repeat. To make it infinite, use the `loop` boolean.
   *
   * Default: `0`
   *
   * It's worth noting that this value isn't *exactly* a `repeat`. Instead, it uses Reanimated's `withRepeat` function under the hood, which repeats back to the **previous value**. If you want a repeated animation, I recommend setting it to `true` from the start, and make sure you have a `from` value.
   *
   * As a result, this value cannot be reliably changed on the fly. If you would like animations to repeat based on the `from` value, `repeat` must be a number when the component initializes. You can set it to `0` to stop it, but you won't be able to start it again. You might be better off using the sequence array API if you need to update its repetitiveness on the fly.
   */
  repeat?: number
  /**
   * Setting this to `true` is the same as `repeat: Infinity`
   *
   * Default: `false`
   *
   * Note: this value cannot be set on the fly. If you would like animations to repeat based on the `from` value, it must be `true` when the component initializes. You can set it to `false` to stop it, but you won't be able to start it again. You might be better off using the sequence array API if you need to update its repetitiveness on the fly.
   */
  loop?: boolean
  /**
   * Whether or not the animation repetition should alternate in direction.
   *
   * By default, this is `true`.
   *
   * If `false`, any animations with `loop` or `repeat` will not go back and forth. Instead, they will go from 0 -> 1, and again from 0 -> 1.
   *
   * If `true`, then animations will go 0 -> 1 -> 0.
   *
   * Setting this to `true` is like setting `animationDirection: alternate` in CSS.
   */
  repeatReverse?: boolean
}

const isColor = (styleKey: string) => {
  'worklet'
  return [
    'backgroundColor',
    'borderBottomColor',
    'borderColor',
    'borderEndColor',
    'borderLeftColor',
    'borderRightColor',
    'borderStartColor',
    'borderTopColor',
    'color',
  ].includes(styleKey)
}

function animationConfig<Animate>(
  styleProp: string,
  transition: MotiTransition<Animate> | undefined
) {
  'worklet'
  const key = styleProp
  let repeatCount = 0
  let repeatReverse = true

  let animationType: Required<TransitionConfig>['type'] = 'spring'
  if (isColor(key) || key === 'opacity') animationType = 'timing'

  // say that we're looking at `width`
  // first, check if we have transition.width.type
  if ((transition as any)?.[key as keyof Animate]?.type) {
    animationType = (transition as any)[key]?.type
  } else if (transition?.type) {
    // otherwise, fallback to transition.type
    animationType = transition.type
  }

  const loop = (transition as any)?.[key as keyof Animate]?.loop ?? transition?.loop

  if (loop != null) {
    repeatCount = loop ? -1 : 0
  }

  if ((transition as any)?.[key as keyof Animate]?.repeat != null) {
    repeatCount = (transition as any)?.[key as keyof Animate]?.repeat
  } else if (transition?.repeat != null) {
    repeatCount = transition.repeat
  }

  if ((transition as any)?.[key as keyof Animate]?.repeatReverse != null) {
    repeatReverse = (transition as any)?.[key as keyof Animate]?.repeatReverse
  } else if (transition?.repeatReverse != null) {
    repeatReverse = transition.repeatReverse
  }

  // debug({ loop, key, repeatCount, animationType })
  let config = {}
  // so sad, but fix it later :(
  let animation = (...props: any): any => props

  if (animationType === 'timing') {
    const duration =
      ((transition as any)?.[key as keyof Animate] as WithTimingConfig)?.duration ??
      (transition as WithTimingConfig)?.duration

    const easing =
      ((transition as any)?.[key as keyof Animate] as WithTimingConfig)?.easing ??
      (transition as WithTimingConfig)?.easing

    if (easing) {
      config['easing'] = easing
    }
    if (duration != null) {
      config['duration'] = duration
    }
    animation = withTiming
  } else if (animationType === 'spring') {
    animation = withSpring
    config = {} as WithSpringConfig
    configKeys.forEach((configKey) => {
      'worklet'
      const styleSpecificConfig = transition?.[key]?.[configKey]
      const transitionConfigForKey = transition?.[configKey]
      if (styleSpecificConfig != null) {
        config[configKey] = styleSpecificConfig
      } else if (transitionConfigForKey != null) {
        config[configKey] = transitionConfigForKey
      }
    })
  } else if (animationType === 'decay') {
    animation = withDecay
    config = {
      velocity: 2,
      deceleration: 2,
    }
    const configKeys: (keyof WithDecayConfig)[] = [
      'clamp',
      'velocity',
      'deceleration',
      'velocityFactor',
    ]
    configKeys.forEach((configKey) => {
      'worklet'
      // is this necessary ^ don't think so...?
      const styleSpecificConfig = transition?.[key]?.[configKey]
      const transitionConfigForKey = transition?.[configKey]

      if (styleSpecificConfig != null) {
        config[configKey] = styleSpecificConfig
      } else if (transitionConfigForKey != null) {
        config[configKey] = transitionConfigForKey
      }
    })
  }

  return {
    animation,
    config,
    repeatReverse,
    repeatCount,
    shouldRepeat: !!repeatCount,
  }
}

const configKeys: (keyof WithSpringConfig)[] = [
  'damping',
  'mass',
  'overshootClamping',
  'restDisplacementThreshold',
  'restSpeedThreshold',
  'stiffness',
  'velocity',
]
