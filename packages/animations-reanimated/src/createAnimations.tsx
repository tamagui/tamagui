import { PresenceContext, usePresence } from '@tamagui/animate-presence'
import { AnimationDriver, AnimationProp } from '@tamagui/core'
import { useCallback, useContext, useMemo } from 'react'
import Animated, {
  WithDecayConfig,
  WithSpringConfig,
  WithTimingConfig,
  runOnJS,
  useAnimatedStyle,
  withDecay,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

type AnimationsConfig<A extends Object = any> = {
  [Key in keyof A]: AnimationConfig
}

type AnimationConfig =
  | ({ type: 'timing'; loop?: number; repeat?: number; repeatReverse?: boolean } & WithTimingConfig)
  | ({ type: 'spring'; loop?: number; repeat?: number; repeatReverse?: boolean } & WithSpringConfig)
  | ({ type: 'decay'; loop?: number; repeat?: number; repeatReverse?: boolean } & WithDecayConfig)

export function createAnimations<A extends AnimationsConfig>(animations: A): AnimationDriver<A> {
  const AnimatedView = Animated.View
  const AnimatedText = Animated.Text

  AnimatedView['displayName'] = 'AnimatedView'
  AnimatedText['displayName'] = 'AnimatedText'

  return {
    avoidClasses: true,
    animations,
    View: AnimatedView,
    Text: AnimatedText,
    useAnimations: (props, helpers) => {
      const { pseudos, onDidAnimate, delay, getStyle, state, staticConfig } = helpers
      const [isPresent, sendExitComplete] = usePresence()
      const presence = useContext(PresenceContext)

      const exitStyle = presence?.exitVariant
        ? staticConfig.variantsParsed?.[presence.exitVariant]?.true || pseudos.exitStyle
        : pseudos.exitStyle

      const reanimatedOnDidAnimated = useCallback<NonNullable<typeof onDidAnimate>>(
        (...args) => {
          onDidAnimate?.(...args)
        },
        [onDidAnimate]
      )

      const isExiting = isPresent === false
      const isEntering = !state.mounted

      const all = getStyle({
        isExiting,
        isEntering,
        exitVariant: presence?.exitVariant,
        enterVariant: presence?.enterVariant,
      })

      const [animatedStyles, nonAnimatedStyle] = [{}, {}]
      const animatedStyleKey = {
        transform: true,
        opacity: true,
      }
      for (const key of Object.keys(all)) {
        if (animatedStyleKey[key]) {
          animatedStyles[key] = all[key]
        } else {
          nonAnimatedStyle[key] = all[key]
        }
      }

      const args = [
        JSON.stringify(all),
        state.mounted,
        state.hover,
        state.press,
        state.pressIn,
        state.focus,
        delay,
        isPresent,
        onDidAnimate,
        reanimatedOnDidAnimated,
        presence?.exitVariant,
        presence?.enterVariant,
      ]

      const callback = (
        isExiting: boolean,
        exitingStyleProps: Record<string, boolean>,
        key: string,
        value: any
      ) => {
        'worklet'
        return (completed, current) => {
          'worklet'
          runOnJS(reanimatedOnDidAnimated)(key, completed, current, {
            attemptedValue: value,
          })
          if (isExiting) {
            exitingStyleProps[key] = false
            const areStylesExiting = Object.values(exitingStyleProps).some(Boolean)
            // if this is true, then we've finished our exit animations
            if (!areStylesExiting) {
              if (sendExitComplete) {
                runOnJS(sendExitComplete)()
              }
            }
          }
        }
      }

      const animatedStyle = useAnimatedStyle(() => {
        'worklet'
        const style = animatedStyles

        const final = {
          transform: [] as any[],
        }

        const isExiting = isPresent === false

        const exitingStyleProps: Record<string, boolean> = {}
        if (exitStyle) {
          for (const key in exitStyle) {
            if (key === 'transform') {
              for (const attr of exitStyle[key]) {
                const tkey = Object.keys(attr)[0]
                exitingStyleProps[tkey] = true
              }
            } else {
              exitingStyleProps[key] = true
            }
          }
        }

        for (const key in style) {
          const value = style[key]
          const animationConfig = getAnimationConfig(key, animations, props.animation)
          const { animation, config, shouldRepeat, repeatCount, repeatReverse } = getAnimation(
            key,
            animationConfig,
            props.animateOnly
          )

          let { delayMs = null } = animationDelay(key, animationConfig, delay)

          if (!animation) {
            console.warn('No animation for', key, 'in', style)
            continue
          }
          if (!config) {
            console.warn('No animation config for', key, 'in', style)
            continue
          }

          if (key === 'transform') {
            if (!Array.isArray(value)) {
              console.error(`Invalid transform value. Needs to be an array.`)
              continue
            }

            for (const transformObject of value) {
              const key = Object.keys(transformObject)[0]
              const transformValue = transformObject[key]
              let finalValue = animation(
                transformValue,
                config as any,
                callback(isExiting, exitingStyleProps, key, value)
              )
              if (shouldRepeat) {
                finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
              }
              final['transform'].push({
                [key]: finalValue,
              })
            }
            continue
          }

          if (typeof value === 'object') {
            // shadows
            final[key] = {}
            for (const innerStyleKey of Object.keys(value || {})) {
              let finalValue = animation(
                value,
                config as any,
                callback(isExiting, exitingStyleProps, key, value)
              )
              if (shouldRepeat) {
                finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
              }
              if (delayMs != null) {
                final[key][innerStyleKey] = withDelay(delayMs, finalValue)
              } else {
                final[key][innerStyleKey] = finalValue
              }
            }
            continue
          }

          let finalValue = animation(
            value,
            config as any,
            callback(isExiting, exitingStyleProps, key, value)
          )
          if (shouldRepeat) {
            finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
          }
          if (delayMs != null && typeof delayMs === 'number') {
            final[key] = withDelay(delayMs, finalValue)
          } else {
            final[key] = finalValue
          }

          // end for (key in mergedStyles)
        }

        return final
      }, args)

      return useMemo(() => {
        return {
          style: [nonAnimatedStyle, animatedStyle],
        }
      }, args)
    },
  }
}

function getAnimationConfig(key: string, animations: AnimationsConfig, animation?: AnimationProp) {
  'worklet'
  if (typeof animation === 'string') {
    return animations[animation]
  }
  let type = ''
  let extraConf: any
  if (Array.isArray(animation)) {
    type = animation[0] as string
    const conf = animation[1] && animation[1][key]
    if (conf) {
      if (typeof conf === 'string') {
        type = conf
      } else {
        type = (conf as any).type || type
        extraConf = conf
      }
    }
  } else {
    const val = animation?.[key]
    type = val?.type
    extraConf = val
  }
  const found = animations[type]
  if (!found) {
    throw new Error(`No animation of type "${type}" for key "${key}"`)
  }
  return {
    ...found,
    ...extraConf,
    type: found.type,
  }
}

function animationDelay(
  key: string,
  animation: AnimationConfig | undefined,
  defaultDelay?: number
) {
  'worklet'
  if (
    !animation ||
    !animation[key] ||
    animation[key].delayMs === undefined ||
    animation[key].delayMs === null
  ) {
    return {
      delayMs: null,
    }
  }
  return {
    delayMs: animation[key].delayMs as TransitionConfig['delay'],
  }
}

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

function getAnimation(
  key: string,
  animationConfig: AnimationConfig | undefined,
  animateOnly?: string[]
) {
  'worklet'
  if (!animationConfig || (animateOnly && !animateOnly.includes(key))) {
    return {}
  }

  let repeatCount = 0
  let repeatReverse = animationConfig.repeatReverse || false
  let animationType: Required<TransitionConfig>['type'] = animationConfig?.type || 'spring'

  if (isColor(key) || key === 'opacity') {
    animationType = 'timing'
  }

  if ('repeat' in animationConfig) {
    repeatCount = animationConfig.repeat || 0
  } else {
    if (animationConfig.loop) {
      repeatCount = animationConfig.loop ? -1 : 0
    }
  }

  let config = animationConfig
  let animation: typeof withTiming | typeof withSpring | typeof withDecay

  if (animationType === 'timing') {
    animation = withTiming
  } else if (animationType === 'spring') {
    animation = withSpring
  } else if (animationType === 'decay') {
    animation = withDecay
    config = config || {
      velocity: 2,
      deceleration: 2,
    }
  } else {
    console.warn('no type of animation?', animationType)
    animation = withSpring
  }

  return {
    animation,
    config,
    repeatReverse,
    repeatCount,
    shouldRepeat: !!repeatCount,
  }
}
