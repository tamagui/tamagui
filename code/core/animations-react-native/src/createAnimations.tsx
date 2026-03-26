import { getEffectiveAnimation, normalizeTransition } from '@tamagui/animation-helpers'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import type {
  AnimatedNumberStrategy,
  AnimationDriver,
  TransitionProp,
  UniversalAnimatedNumber,
  UseAnimatedNumberReaction,
  UseAnimatedNumberStyle,
} from '@tamagui/web'
import { useEvent, useThemeWithState } from '@tamagui/web'
import React from 'react'
import { Animated, type Text, type View } from 'react-native'

// detect Fabric (New Architecture) — Paper doesn't support native driver for all style keys
const isFabric =
  !isWeb && typeof global !== 'undefined' && !!global.__nativeFabricUIManager

// Helper to resolve dynamic theme values like {dynamic: {dark: "value", light: undefined}}
const resolveDynamicValue = (value: any, isDark: boolean): any => {
  if (value && typeof value === 'object' && 'dynamic' in value) {
    const dynamicValue = isDark ? value.dynamic.dark : value.dynamic.light
    return dynamicValue
  }
  return value
}

type AnimationsConfig<A extends object = any> = { [Key in keyof A]: AnimationConfig }

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

// these style keys are costly to animate and only work with native driver on Fabric
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
}

type CreateAnimationsOptions = {
  // override native driver detection (default: auto-detect Fabric)
  useNativeDriver?: boolean
}

export const AnimatedView: Animated.AnimatedComponent<typeof View> = Animated.View
export const AnimatedText: Animated.AnimatedComponent<typeof Text> = Animated.Text

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
          useNativeDriver: isFabric,
        })
        composite.start(handleFinish)
        state.current.composite = composite
      } else {
        state.current.composite?.stop()
        const composite = Animated.timing(val, {
          ...config,
          toValue: next,
          useNativeDriver: isFabric,
        })
        composite.start(handleFinish)
        state.current.composite = composite
      }
    },
  }
}

type RNAnimatedNum = UniversalAnimatedNumber<Animated.Value>

export const useAnimatedNumberReaction: UseAnimatedNumberReaction<RNAnimatedNum> = (
  { value },
  onValue
) => {
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

export const useAnimatedNumberStyle: UseAnimatedNumberStyle<RNAnimatedNum> = (
  value,
  getStyle
) => {
  return getStyle(value.getInstance())
}

export function createAnimations<A extends AnimationsConfig>(
  animations: A,
  options?: CreateAnimationsOptions
): AnimationDriver<A> {
  const nativeDriver = options?.useNativeDriver ?? isFabric

  return {
    isReactNative: true,
    inputStyle: 'value',
    outputStyle: 'inline',
    avoidReRenders: true,
    animations,
    needsCustomComponent: true,
    View: AnimatedView,
    Text: AnimatedText,
    useAnimatedNumber,
    useAnimatedNumberReaction,
    useAnimatedNumberStyle,
    usePresence,
    ResetPresence,
    useAnimations: ({
      props,
      onDidAnimate,
      style,
      componentState,
      presence,
      useStyleEmitter,
    }) => {
      const isDisabled = isWeb && componentState.unmounted === true
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]
      const [, themeState] = useThemeWithState({})
      // Check scheme first, then fall back to checking theme name for 'dark'
      const isDark = themeState?.scheme === 'dark' || themeState?.name?.startsWith('dark')

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

      // exit cycle guards to prevent stale/duplicate completion
      const exitCycleIdRef = React.useRef(0)
      const exitCompletedRef = React.useRef(false)
      const wasExitingRef = React.useRef(false)

      // detect transition into/out of exiting state
      const justStartedExiting = isExiting && !wasExitingRef.current
      const justStoppedExiting = !isExiting && wasExitingRef.current

      // start new exit cycle only on transition INTO exiting
      if (justStartedExiting) {
        exitCycleIdRef.current++
        exitCompletedRef.current = false
      }
      // invalidate pending callbacks when exit is canceled/interrupted
      if (justStoppedExiting) {
        exitCycleIdRef.current++
      }

      const animateOnly = (props.animateOnly as string[]) || []
      const hasTransitionOnly = !!props.animateOnly

      // Track if we just finished entering (transition from entering to not entering)
      // must be declared before args array that uses justFinishedEntering
      const isEntering = !!componentState.unmounted
      const wasEnteringRef = React.useRef(isEntering)
      const justFinishedEntering = wasEnteringRef.current && !isEntering
      React.useEffect(() => {
        wasEnteringRef.current = isEntering
      })

      const args = [
        JSON.stringify(style),
        componentState,
        isExiting,
        !!onDidAnimate,
        isDark,
        justFinishedEntering,
        hasTransitionOnly,
      ]

      const res = React.useMemo(() => {
        const runners: Function[] = []
        const completions: Promise<void>[] = []

        // Determine animation state for enter/exit transitions
        // Use 'enter' if we're entering OR if we just finished entering
        const animationState: 'enter' | 'exit' | 'default' = isExiting
          ? 'exit'
          : isEntering || justFinishedEntering
            ? 'enter'
            : 'default'

        const nonAnimatedStyle = {}

        for (const key in style) {
          const rawVal = style[key]
          // Resolve dynamic theme values (like $theme-dark)
          const val = resolveDynamicValue(rawVal, isDark)
          if (val === undefined) continue

          if (isDisabled) {
            continue
          }

          if (animatedStyleKey[key] == null && !costlyToAnimateStyleKey[key]) {
            nonAnimatedStyle[key] = val
            continue
          }

          if (hasTransitionOnly && !animateOnly.includes(key)) {
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

        const animatedTransformStyle =
          animatedTranforms.current.length > 0
            ? {
                transform: animatedTranforms.current.map((r) => {
                  const key = Object.keys(r)[0]
                  const val =
                    animationsState.current!.get(r[key])?.interpolation || r[key]
                  return { [key]: val }
                }),
              }
            : {}

        const animatedStyle = {
          ...Object.fromEntries(
            Object.entries(animateStyles.current).map(([k, v]) => [
              k,
              animationsState.current!.get(v)?.interpolation || v,
            ])
          ),
          ...animatedTransformStyle,
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
            const animationConfig = getAnimationConfig(
              key,
              animations,
              props.transition,
              animationState
            )

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
                  useNativeDriver: nativeDriver,
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
                // always resolve during exit (element is leaving anyway)
                // for non-exit, only resolve on successful completion
                if (finished || isExiting) {
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

      // track previous exiting state
      React.useEffect(() => {
        wasExitingRef.current = isExiting
      })

      useIsomorphicLayoutEffect(() => {
        res.runners.forEach((r) => r())

        // capture current cycle id
        const cycleId = exitCycleIdRef.current

        // handle zero-completion case immediately
        if (res.completions.length === 0) {
          onDidAnimate?.()
          if (isExiting && !exitCompletedRef.current) {
            exitCompletedRef.current = true
            sendExitComplete?.()
          }
          return
        }

        let cancel = false
        Promise.all(res.completions).then(() => {
          if (cancel) return
          // guard against stale cycle completion
          if (isExiting && cycleId !== exitCycleIdRef.current) return
          if (isExiting && exitCompletedRef.current) return

          onDidAnimate?.()
          if (isExiting) {
            exitCompletedRef.current = true
            sendExitComplete?.()
          }
        })
        return () => {
          cancel = true
        }
      }, args)

      // avoidReRenders: receive style changes imperatively from tamagui
      // and update Animated.Values directly without React re-renders
      // reuses the same update() + runner pattern as the useMemo path
      useStyleEmitter?.((nextStyle) => {
        for (const key in nextStyle) {
          const rawVal = nextStyle[key]
          const val = resolveDynamicValue(rawVal, isDark)
          if (val === undefined) continue

          if (key === 'transform' && Array.isArray(val)) {
            for (const [index, transform] of val.entries()) {
              if (!transform) continue
              const tkey = Object.keys(transform)[0]
              const currentTransform = animatedTranforms.current[index]?.[tkey]
              animatedTranforms.current[index] = {
                [tkey]: update(tkey, currentTransform, transform[tkey]),
              }
            }
          } else if (animatedStyleKey[key] != null || costlyToAnimateStyleKey[key]) {
            animateStyles.current[key] = update(key, animateStyles.current[key], val)
          }
        }

        // run the queued animations immediately
        res.runners.forEach((r) => r())

        function update(
          key: string,
          animated: Animated.Value | undefined,
          valIn: string | number
        ) {
          const isColor = colorStyleKey[key]
          const [numVal, type] = isColor ? [0, undefined] : getValue(valIn)
          let animateToValue = numVal
          const value = animated || new Animated.Value(numVal)
          const curInterpolation = animationsState.current.get(value)

          if (type) {
            animationsState.current.set(value, {
              interpolation: value.interpolate(
                getInterpolated(
                  curInterpolation?.current ?? value['_value'],
                  numVal,
                  type
                )
              ),
              current: numVal,
            })
          }

          if (isColor) {
            animateToValue = curInterpolation?.animateToValue ? 0 : 1
            animationsState.current.set(value, {
              current: valIn,
              interpolation: value.interpolate(
                getColorInterpolated(
                  curInterpolation?.current as string,
                  valIn as string,
                  animateToValue
                )
              ),
              animateToValue: curInterpolation?.animateToValue ? 0 : 1,
            })
          }

          const animationConfig = getAnimationConfig(
            key,
            animations,
            props.transition,
            'default'
          )
          res.runners.push(() => {
            value.stopAnimation()
            const anim = Animated[animationConfig.type || 'spring'](value, {
              toValue: animateToValue,
              useNativeDriver: nativeDriver,
              ...animationConfig,
            })
            ;(animationConfig.delay
              ? Animated.sequence([Animated.delay(animationConfig.delay), anim])
              : anim
            ).start()
          })

          return value
        }
      })

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
  transition?: TransitionProp,
  animationState: 'enter' | 'exit' | 'default' = 'default'
): AnimationConfig {
  const normalized = normalizeTransition(transition)
  const shortKey = transformShorthands[key]

  // Check for property-specific animation
  const propAnimation = normalized.properties[key] ?? normalized.properties[shortKey]

  let animationType: string | null = null
  let extraConf: any = {}

  if (typeof propAnimation === 'string') {
    // Direct animation name: { x: 'quick' }
    animationType = propAnimation
  } else if (propAnimation && typeof propAnimation === 'object') {
    // Config object: { x: { type: 'quick', delay: 100 } }
    // Use effective animation based on state if no explicit type in config
    animationType =
      propAnimation.type || getEffectiveAnimation(normalized, animationState)
    extraConf = propAnimation
  } else {
    // Fall back to effective animation based on state (enter/exit/default)
    animationType = getEffectiveAnimation(normalized, animationState)
  }

  // Apply global delay if no property-specific delay
  if (normalized.delay && !extraConf.delay) {
    extraConf = { ...extraConf, delay: normalized.delay }
  }

  const found = animationType ? animations[animationType] : {}
  return {
    ...found,
    // Apply global spring config overrides (from transition={['bouncy', { stiffness: 1000 }]})
    ...normalized.config,
    // Property-specific config takes highest precedence
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
