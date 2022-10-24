import {
  AnimatedNumberStrategy,
  AnimationDriver,
  AnimationProp,
  UniversalAnimatedNumber,
  isWeb,
  useEvent,
  useIsomorphicLayoutEffect,
} from '@tamagui/core'
import { PresenceContext, usePresence } from '@tamagui/use-presence'
import { useContext, useEffect, useMemo, useRef } from 'react'
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

export function useAnimatedNumber(initial: number): UniversalAnimatedNumber<Animated.Value> {
  const state = useRef(
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
  cb: (current: number) => void
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

export function useAnimatedNumberStyle<V extends UniversalAnimatedNumber<Animated.Value>>(
  value: V,
  getStyle: (value: any) => any
) {
  return getStyle(value.getInstance())
}

export function createAnimations<A extends AnimationsConfig>(animations: A): AnimationDriver<A> {
  AnimatedView['displayName'] = 'AnimatedView'
  AnimatedText['displayName'] = 'AnimatedText'

  return {
    isReactNativeWeb: true,
    animations,
    View: AnimatedView,
    Text: AnimatedText,
    useAnimatedNumber,
    useAnimatedNumberReaction,
    useAnimatedNumberStyle,
    useAnimations: (props, helpers) => {
      const { onDidAnimate, delay, getStyle, state } = helpers
      const [isPresent, sendExitComplete] = usePresence()
      const presence = useContext(PresenceContext)

      // const exitStyle = presence?.exitVariant
      //   ? staticConfig.variantsParsed?.[presence.exitVariant]?.true || pseudos.exitStyle
      //   : pseudos.exitStyle

      const isExiting = isPresent === false
      const isEntering = !state.mounted

      const all = getStyle({
        isExiting,
        isEntering,
        exitVariant: presence?.exitVariant,
        enterVariant: presence?.enterVariant,
      })

      const animateStyles = useRef<Record<string, Animated.Value>>({})
      const animatedTranforms = useRef<{ [key: string]: Animated.Value }[]>([])
      const interpolations = useRef<WeakMap<Animated.Value, Animated.AnimatedInterpolation>>()
      if (!interpolations.current) {
        interpolations.current = new WeakMap<Animated.Value, Animated.AnimatedInterpolation>()
      }

      const runners: Function[] = []
      const completions: Promise<void>[] = []

      function update(key: string, animated: Animated.Value | undefined, valIn: string | number) {
        const [val, type] = getValue(valIn)
        const value = animated || new Animated.Value(val)
        let interpolateArgs: any
        if (type) {
          interpolateArgs = getInterpolated(value, type, val)
          interpolations.current!.set(value, value.interpolate(interpolateArgs))
        }
        if (animated) {
          const animationConfig = getAnimationConfig(key, animations, props.animation)

          let resolve
          const promise = new Promise<void>((res) => {
            resolve = res
          })
          completions.push(promise)

          runners.push(() => {
            animated.stopAnimation()
            Animated.spring(animated, {
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
            // prettier-ignore
            // eslint-disable-next-line no-console
            console.log('AnimatedValue', key, 'mapped value', valIn, 'of type', type, 'from parsed', val, 'interpolated', interpolateArgs, 'then to Animated.Value', value['_value'])
          }
        }
        return value
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
        presence?.exitVariant,
        presence?.enterVariant,
      ]

      const nonAnimatedStyle = {}
      for (const key in all) {
        const val = all[key]
        if (animatedStyleKey[key]) {
          if (key === 'transform') {
            // for now just support one transform key
            if (val) {
              for (const [index, transform] of val.entries()) {
                if (!transform) continue
                const tkey = Object.keys(transform)[0]
                animatedTranforms.current[index] = {
                  [tkey]: update(tkey, animatedTranforms.current[index]?.[tkey], transform[tkey]),
                }
              }
            }
          } else {
            animateStyles.current[key] = update(key, animateStyles.current[key], val)
          }
        } else {
          nonAnimatedStyle[key] = val
        }
      }

      const res = useMemo(() => {
        const animatedStyle = {
          ...Object.fromEntries(
            Object.entries({
              ...animateStyles.current,
            }).map(([k, v]) => [k, interpolations.current!.get(v) || v])
          ),
          transform: animatedTranforms.current.map((r) => {
            const key = Object.keys(r)[0]
            const val = interpolations.current!.get(r[key]) || r[key]
            return { [key]: val }
          }),
        }

        return {
          style: [nonAnimatedStyle, animatedStyle],
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, args)

      useIsomorphicLayoutEffect(() => {
        for (const runner of runners) {
          runner()
        }
        Promise.all(completions).then(() => {
          onDidAnimate?.()
          if (isExiting) {
            sendExitComplete?.()
          }
        })
      }, args)

      return res
    },
  }
}

function getInterpolated(val: Animated.Value, postfix: string, next: number) {
  const cur = val['_value'] as number
  const inputRange = [cur, next]
  const outputRange = [`${cur}deg`, `${next}deg`]
  if (next < cur) {
    inputRange.reverse()
    outputRange.reverse()
  }
  return {
    inputRange,
    outputRange,
  }
}

function getAnimationConfig(key: string, animations: AnimationsConfig, animation?: AnimationProp) {
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
  const neg = input[0] === '-'
  if (neg) input = input.slice(1)
  const [_, number, after] = input.match(/([-0-9]+)(deg|%)/) ?? []
  return [+number * (neg ? -1 : 1), after] as const
}
