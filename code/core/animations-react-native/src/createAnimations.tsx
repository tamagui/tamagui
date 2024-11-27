import React from 'react'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type {
  AnimatedNumberStrategy,
  AnimationDriver,
  AnimationProp,
  UniversalAnimatedNumber,
} from '@tamagui/web'
import { useEvent } from '@tamagui/web'

import { Animated } from 'react-native'

type AnimationsConfig<A extends Object = any> = { [Key in keyof A]: AnimationConfig }

type SpringConfig = { type?: 'spring' } & Partial<
  Pick<
    Animated.SpringAnimationConfig,
    | 'delay'
    | 'bounciness'
    | 'damping'
    | 'friction'
    | 'mass'
    | 'overshootClamping'
    | 'speed'
    | 'stiffness'
    | 'tension'
    | 'velocity'
  >
>

type TimingConfig = { type: 'timing' } & Partial<Animated.TimingAnimationConfig>

type AnimationConfig = SpringConfig | TimingConfig

const animatedStyleKey = {
  transform: true,
  opacity: true,
}

const colorStyleKey = {
  backgroundColor: true,
  color: true,
  borderColor: true,
  borderLeftColor: true,
  borderRightColor: true,
  borderTopColor: true,
  borderBottomColor: true,
}

// these are the styles that are costly to animate because they don't support useNativeDriver and some of them are changing layout
const costlyToAnimateStyleKey = {
  borderRadius: true,
  borderTopLeftRadius: true,
  borderTopRightRadius: true,
  borderBottomLeftRadius: true,
  borderBottomRightRadius: true,
  borderWidth: true,
  borderLeftWidth: true,
  borderRightWidth: true,
  borderTopWidth: true,
  borderBottomWidth: true,
  ...colorStyleKey,
  // TODO for other keys like height or width, it's better to not add them here till layout animations are ready
}

export const AnimatedView = Animated.View
export const AnimatedText = Animated.Text

export function useAnimatedNumber(
  initial: number
): UniversalAnimatedNumber<Animated.Value> {
  const state = React.useRef(
    null as any as {
      val: Animated.Value
      composite: Animated.CompositeAnimation | null
      strategy: AnimatedNumberStrategy
    }
  )
  if (!state.current) {
    state.current = {
      composite: null,
      val: new Animated.Value(initial),
      strategy: { type: 'spring' },
    }
  }

  return {
    getInstance() {
      return state.current.val
    },
    getValue() {
      return state.current.val['_value']
    },
    stop() {
      state.current.composite?.stop()
      state.current.composite = null
    },
    setValue(next: number, { type, ...config } = { type: 'spring' }, onFinish) {
      const val = state.current.val

      const handleFinish = onFinish
        ? ({ finished }) => (finished ? onFinish() : null)
        : undefined

      if (type === 'direct') {
        val.setValue(next)
      } else if (type === 'spring') {
        state.current.composite?.stop()
        const composite = Animated.spring(val, {
          ...config,
          toValue: next,
          useNativeDriver: !isWeb,
        })
        composite.start(handleFinish)
        state.current.composite = composite
      } else {
        state.current.composite?.stop()
        const composite = Animated.timing(val, {
          ...config,
          toValue: next,
          useNativeDriver: !isWeb,
        })
        composite.start(handleFinish)
        state.current.composite = composite
      }
    },
  }
}

export function useAnimatedNumberReaction(
  { value }: { value: UniversalAnimatedNumber<Animated.Value> },
  onValue: (current: number) => void
) {
  const onChange = useEvent((current) => {
    onValue(current.value)
  })

  React.useEffect(() => {
    const id = value.getInstance().addListener(onChange)
    return () => {
      value.getInstance().removeListener(id)
    }
  }, [value, onChange])
}

export function useAnimatedNumberStyle<V extends UniversalAnimatedNumber<Animated.Value>>(
  value: V,
  getStyle: (value: any) => any
) {
  return getStyle(value.getInstance())
}

export function createAnimations<A extends AnimationsConfig>(
  animations: A
): AnimationDriver<A> {
  return {
    isReactNative: true,
    animations,
    View: AnimatedView,
    Text: AnimatedText,
    useAnimatedNumber,
    useAnimatedNumberReaction,
    useAnimatedNumberStyle,
    usePresence,
    ResetPresence,
    useAnimations: ({ props, onDidAnimate, style, componentState, presence }) => {
      const isDisabled = isWeb && componentState.unmounted === true
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]

      /** store Animated value of each key e.g: color: AnimatedValue */
      const animateStyles = React.useRef<Record<string, Animated.Value>>({})
      const animatedTranforms = React.useRef<{ [key: string]: Animated.Value }[]>([])
      const animationsState = React.useRef(
        new WeakMap<
          Animated.Value,
          {
            interpolation: Animated.AnimatedInterpolation<any>
            current?: number | string | undefined
            // only for colors
            animateToValue?: number
          }
        >()
      )

      const animateOnly = (props.animateOnly as string[]) || []
      const hasAnimateOnly = !!props.animateOnly

      const args = [JSON.stringify(style), componentState, isExiting, !!onDidAnimate]

      // check if there is any style that is not supported by native driver
      const isThereNoNativeStyleKeys = React.useMemo(() => {
        if (isWeb) return true
        return Object.keys(style).some((key) => {
          if (animateOnly.length) {
            return !animatedStyleKey[key] && animateOnly.indexOf(key) === -1
          }
          return !animatedStyleKey[key]
        })
      }, args)

      const res = React.useMemo(() => {
        const runners: Function[] = []
        const completions: Promise<void>[] = []

        const nonAnimatedStyle = {}

        for (const key in style) {
          const val = style[key]

          if (isDisabled) {
            continue
          }

          if (animatedStyleKey[key] == null && !costlyToAnimateStyleKey[key]) {
            nonAnimatedStyle[key] = val
            continue
          }

          if (hasAnimateOnly && !animateOnly.includes(key)) {
            nonAnimatedStyle[key] = val
            continue
          }

          if (key !== 'transform') {
            animateStyles.current[key] = update(key, animateStyles.current[key], val)
            continue
          }
          // key: 'transform'
          // for now just support one transform key
          if (!val) continue
          if (typeof val === 'string') {
            console.warn(`Warning: Tamagui can't animate string transforms yet!`)
            continue
          }

          for (const [index, transform] of val.entries()) {
            if (!transform) continue
            // tkey: e.g: 'translateX'
            const tkey = Object.keys(transform)[0]
            const currentTransform = animatedTranforms.current[index]?.[tkey]
            animatedTranforms.current[index] = {
              [tkey]: update(tkey, currentTransform, transform[tkey]),
            }
            animatedTranforms.current = [...animatedTranforms.current]
          }
        }

        const animatedStyle = {
          ...Object.fromEntries(
            Object.entries(animateStyles.current).map(([k, v]) => [
              k,
              animationsState.current!.get(v)?.interpolation || v,
            ])
          ),
          transform: animatedTranforms.current.map((r) => {
            const key = Object.keys(r)[0]
            const val = animationsState.current!.get(r[key])?.interpolation || r[key]
            return { [key]: val }
          }),
        }

        return {
          runners,
          completions,
          style: [nonAnimatedStyle, animatedStyle],
        }

        function update(
          key: string,
          animated: Animated.Value | undefined,
          valIn: string | number
        ) {
          const isColorStyleKey = colorStyleKey[key]
          const [val, type] = isColorStyleKey ? [0, undefined] : getValue(valIn)
          let animateToValue = val
          const value = animated || new Animated.Value(val)
          const curInterpolation = animationsState.current.get(value)

          let interpolateArgs: any
          if (type) {
            interpolateArgs = getInterpolated(
              curInterpolation?.current ?? value['_value'],
              val,
              type
            )
            animationsState.current!.set(value, {
              interpolation: value.interpolate(interpolateArgs),
              current: val,
            })
          }

          if (isColorStyleKey) {
            animateToValue = curInterpolation?.animateToValue ? 0 : 1
            interpolateArgs = getColorInterpolated(
              curInterpolation?.current as string,
              // valIn is the next color
              valIn as string,
              animateToValue
            )
            animationsState.current!.set(value, {
              current: valIn,
              interpolation: value.interpolate(interpolateArgs),
              animateToValue: curInterpolation?.animateToValue ? 0 : 1,
            })
          }

          if (value) {
            const animationConfig = getAnimationConfig(key, animations, props.animation)

            let resolve
            const promise = new Promise<void>((res) => {
              resolve = res
            })
            completions.push(promise)

            runners.push(() => {
              value.stopAnimation()

              function getAnimation() {
                return Animated[animationConfig.type || 'spring'](value, {
                  toValue: animateToValue,
                  useNativeDriver: !isWeb && !isThereNoNativeStyleKeys,
                  ...animationConfig,
                })
              }

              const animation = animationConfig.delay
                ? Animated.sequence([
                    Animated.delay(animationConfig.delay),
                    getAnimation(),
                  ])
                : getAnimation()

              animation.start(({ finished }) => {
                if (finished) {
                  resolve()
                }
              })
            })
          }

          if (process.env.NODE_ENV === 'development') {
            if (props['debug'] === 'verbose') {
              // prettier-ignore
              console.info(
                ' 💠 animate',
                key,
                `from (${value['_value']}) to`,
                valIn,
                `(${val})`,
                'type',
                type,
                'interpolate',
                interpolateArgs
              )
            }
          }
          return value
        }
      }, args)

      useIsomorphicLayoutEffect(() => {
        res.runners.forEach((r) => r())
        let cancel = false
        Promise.all(res.completions).then(() => {
          if (cancel) return
          onDidAnimate?.()
          if (isExiting) {
            sendExitComplete?.()
          }
        })
        return () => {
          cancel = true
        }
      }, args)

      if (process.env.NODE_ENV === 'development') {
        if (props['debug'] === 'verbose') {
          console.info(`Animated`, { response: res, inputStyle: style, isExiting })
        }
      }

      return res
    },
  }
}

function getColorInterpolated(
  currentColor: string | undefined,
  nextColor: string,
  animateToValue: number
) {
  const inputRange = [0, 1]
  const outputRange = [currentColor ? currentColor : nextColor, nextColor]
  if (animateToValue === 0) {
    // because we are animating from value 1 to 0, we need to put target color at the beginning
    outputRange.reverse()
  }
  return {
    inputRange,
    outputRange,
  }
}

function getInterpolated(current: number, next: number, postfix = 'deg') {
  if (next === current) {
    current = next - 0.000000001
  }
  const inputRange = [current, next]
  const outputRange = [`${current}${postfix}`, `${next}${postfix}`]
  if (next < current) {
    inputRange.reverse()
    outputRange.reverse()
  }
  return {
    inputRange,
    outputRange,
  }
}

function getAnimationConfig(
  key: string,
  animations: AnimationsConfig,
  animation?: AnimationProp
): AnimationConfig {
  if (typeof animation === 'string') {
    return animations[animation]
  }
  let type = ''
  let extraConf: any
  const shortKey = transformShorthands[key]
  if (Array.isArray(animation)) {
    type = animation[0] as string
    const conf = animation[1]?.[key] ?? animation[1]?.[shortKey]
    if (conf) {
      if (typeof conf === 'string') {
        type = conf
      } else {
        type = (conf as any).type || type
        extraConf = conf
      }
    }
  } else {
    const val = animation?.[key] ?? animation?.[shortKey]
    type = val?.type
    extraConf = val
  }
  const found = animations[type]
  return {
    ...found,
    ...extraConf,
  }
}

// try both combos
const transformShorthands = {
  x: 'translateX',
  y: 'translateY',
  translateX: 'x',
  translateY: 'y',
}

function getValue(input: number | string, isColor = false) {
  if (typeof input !== 'string') {
    return [input] as const
  }
  const [_, number, after] = input.match(/([-0-9]+)(deg|%|px)/) ?? []
  return [+number, after] as const
}
