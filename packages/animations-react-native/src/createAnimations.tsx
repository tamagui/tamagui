import {
  AnimatedNumberStrategy,
  AnimationDriver,
  AnimationProp,
  UniversalAnimatedNumber,
  isWeb,
  useEvent,
  useIsomorphicLayoutEffect,
  useSafeRef,
} from '@tamagui/core'
import { usePresence } from '@tamagui/use-presence'
import { useEffect, useMemo } from 'react'
import { Animated } from 'react-native'

type AnimationsConfig<A extends Object = any> = {
  [Key in keyof A]: AnimationConfig
}

type AnimationConfig = Partial<
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

const animatedStyleKey = {
  transform: true,
  opacity: true,
}

export const AnimatedView = Animated.View
export const AnimatedText = Animated.Text

export function useAnimatedNumber(
  initial: number,
): UniversalAnimatedNumber<Animated.Value> {
  const state = useSafeRef(
    null as any as {
      val: Animated.Value
      composite: Animated.CompositeAnimation | null
      strategy: AnimatedNumberStrategy
    },
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
    setValue(next: number, { type, ...config } = { type: 'spring' }) {
      const val = state.current.val
      if (type === 'direct') {
        val.setValue(next)
      } else if (type === 'spring') {
        state.current.composite?.stop()
        const composite = Animated.spring(val, {
          ...config,
          toValue: next,
          useNativeDriver: !isWeb,
        })
        composite.start()
        state.current.composite = composite
      } else {
        state.current.composite?.stop()
        const composite = Animated.timing(val, {
          ...config,
          toValue: next,
          useNativeDriver: !isWeb,
        })
        composite.start()
        state.current.composite = composite
      }
    },
  }
}

export function useAnimatedNumberReaction(
  value: UniversalAnimatedNumber<Animated.Value>,
  cb: (current: number) => void,
) {
  const onChange = useEvent((current) => {
    cb(current.value)
  })

  useEffect(() => {
    const id = value.getInstance().addListener(onChange)
    return () => {
      value.getInstance().removeListener(id)
    }
  }, [value, onChange])
}

export function useAnimatedNumberStyle<
  V extends UniversalAnimatedNumber<Animated.Value>,
>(value: V, getStyle: (value: any) => any) {
  return getStyle(value.getInstance())
}

export function createAnimations<A extends AnimationsConfig>(
  animations: A,
): AnimationDriver<A> {
  AnimatedView['displayName'] = 'AnimatedView'
  AnimatedText['displayName'] = 'AnimatedText'

  return {
    isReactNative: true,
    animations,
    View: AnimatedView,
    Text: AnimatedText,
    useAnimatedNumber,
    useAnimatedNumberReaction,
    useAnimatedNumberStyle,
    usePresence,
    useAnimations: ({ props, onDidAnimate, style, state, presence }) => {
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]
      const mergedStyles = style
      const animateStyles = useSafeRef<Record<string, Animated.Value>>({})
      const animatedTranforms = useSafeRef<{ [key: string]: Animated.Value }[]>([])
      const animationsState = useSafeRef<
        WeakMap<
          Animated.Value,
          {
            interopolation: Animated.AnimatedInterpolation
            current?: number | undefined
          }
        >
      >(null as any)
      if (!animationsState.current) {
        animationsState.current = new WeakMap()
      }

      const runners: Function[] = []
      const completions: Promise<void>[] = []

      // const args = [JSON.stringify(mergedStyles)]
      const args = [
        JSON.stringify(mergedStyles),
        JSON.stringify(state),
        isExiting,
        !!onDidAnimate,
      ]

      const res = useMemo(() => {
        const nonAnimatedStyle = {}
        for (const key in mergedStyles) {
          const val = mergedStyles[key]
          if (!animatedStyleKey[key]) {
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
          for (const [index, transform] of val.entries()) {
            if (!transform) continue
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
            Object.entries({
              ...animateStyles.current,
            }).map(([k, v]) => [
              k,
              animationsState.current!.get(v)?.interopolation || v,
            ]),
          ),
          transform: animatedTranforms.current.map((r) => {
            const key = Object.keys(r)[0]
            const val =
              animationsState.current!.get(r[key])?.interopolation || r[key]
            return { [key]: val }
          }),
        }

        return {
          style: [nonAnimatedStyle, animatedStyle],
        }

        function update(
          key: string,
          animated: Animated.Value | undefined,
          valIn: string | number,
        ) {
          const [val, type] = getValue(valIn)
          const value = animated || new Animated.Value(val)
          let interpolateArgs: any
          if (type) {
            const curInterpolation = animationsState.current.get(value)
            interpolateArgs = getInterpolated(
              curInterpolation?.current ?? value['_value'],
              val,
              type,
            )
            animationsState.current!.set(value, {
              interopolation: value.interpolate(interpolateArgs),
              current: val,
            })
          }
          if (value) {
            const animationConfig = getAnimationConfig(
              key,
              animations,
              props.animation,
            )

            let resolve
            const promise = new Promise<void>((res) => {
              resolve = res
            })
            completions.push(promise)

            runners.push(() => {
              value.stopAnimation()
              Animated.spring(value, {
                toValue: val,
                useNativeDriver: !isWeb,
                ...animationConfig,
              }).start(({ finished }) => {
                if (finished) {
                  resolve()
                }
              })
            })
          }
          if (process.env.NODE_ENV === 'development') {
            if (props['debug']) {
              // eslint-disable-next-line no-console
              console.log(
                ' 💠 animate',
                key,
                `from ${value['_value']} to`,
                valIn,
                `(${val})`,
                'type',
                type,
                'interpolate',
                interpolateArgs,
              )
            }
          }
          return value
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, args)

      useIsomorphicLayoutEffect(() => {
        runners.forEach((r) => r())
        let cancel = false
        Promise.all(completions).then(() => {
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
        if (props['debug']) {
          // eslint-disable-next-line no-console
          console.log(`Returning animated`, res)
        }
      }

      return res
    },
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
  animation?: AnimationProp,
) {
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
  }
}

function getValue(input: number | string) {
  if (typeof input !== 'string') {
    return [input] as const
  }
  const [_, number, after] = input.match(/([-0-9]+)(deg|%|px)/) ?? []
  return [+number, after] as const
}
