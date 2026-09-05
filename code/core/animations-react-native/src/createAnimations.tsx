import {
  easingToBezier,
  forAnimationState,
  getTransitionForKey,
  resolveTransition,
  type AnimationsConfig,
  type ResolvedEntry,
  type ResolvedTransition,
} from '@tamagui/animation-helpers'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import type {
  AnimatedNumberStrategy,
  AnimationDriverWithAnimatedNumbers,
  TransitionProp,
  UniversalAnimatedNumber,
  UseAnimatedNumberReaction,
  UseAnimatedNumberStyle,
} from '@tamagui/web'
import { useEvent } from '@tamagui/web'
import { useThemeWithState } from '@tamagui/web/internal-runtime'
import React from 'react'
import {
  Animated,
  Easing,
  processColor,
  type ColorValue,
  type Text,
  type View,
} from 'react-native'

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

/** what `getAnimationConfig` hands to `Animated.spring` / `Animated.timing` */
type AnimationConfig =
  | ({ type: 'spring'; delay?: number } & Partial<
      Pick<
        Animated.SpringAnimationConfig,
        'damping' | 'mass' | 'overshootClamping' | 'stiffness' | 'velocity'
      >
    >)
  | ({ type: 'timing'; delay?: number } & Partial<
      Pick<Animated.TimingAnimationConfig, 'duration' | 'easing'>
    >)

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

// layout dimension keys. these must run on the JS driver (useNativeDriver:false)
// because the native animated module can't drive layout props.
const layoutStyleKey = {
  height: true,
  width: true,
  minHeight: true,
  maxHeight: true,
  minWidth: true,
  maxWidth: true,
}

function hasAnimatedLayoutKey(
  style: Record<string, any>,
  isDark: boolean,
  resolved: ResolvedTransition
) {
  for (const key in layoutStyleKey) {
    if (!getTransitionForKey(resolved, key)) continue
    if (typeof resolveDynamicValue(style[key], isDark) === 'number') return true
  }
  return false
}

// Only colors accepted by RN's own parser can enter interpolation. CSS-wide
// keywords, unresolved tokens, var()/calc(), and empty strings otherwise reach
// createInterpolationFromStringOutputRange / mapStringToNumericComponents and
// throw. Those values must be applied as static styles.
function isAnimatableColor(value: unknown): value is string {
  return typeof value === 'string' && processColor(value as ColorValue) != null
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
        state.current.composite?.stop()
        state.current.composite = null
        val.setValue(next)
        // a direct set finishes the moment it lands. not calling back stranded
        // everything waiting on it (sheet snap, presence completion).
        onFinish?.()
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
  const instance = value.getInstance()
  const animatedStyle = getStyle(instance)
  const usesAnimatedNode = hasAnimatedNode(animatedStyle)
  const [current, setCurrent] = React.useState(value.getValue())

  // preserve the native animated-node path for direct mappings. callbacks
  // that do arithmetic require numeric values, so drive those through the
  // value listener and render the computed style.
  React.useEffect(() => {
    if (usesAnimatedNode) return

    const id = instance.addListener(({ value: next }) => {
      setCurrent(next)
    })
    return () => {
      instance.removeListener(id)
    }
  }, [instance, usesAnimatedNode])

  return usesAnimatedNode ? animatedStyle : getStyle(current)
}

function hasAnimatedNode(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  if (typeof (value as any).__getValue === 'function') return true
  if (Array.isArray(value)) return value.some(hasAnimatedNode)
  return Object.values(value).some(hasAnimatedNode)
}

export const useAnimatedNumbersStyle = (
  vals: RNAnimatedNum[],
  getStyle: (...currentValues: any[]) => any
): any => {
  return getStyle(...vals.map((v) => v.getInstance()))
}

export function createAnimations<A extends AnimationsConfig>(
  animations: A,
  options?: CreateAnimationsOptions
): AnimationDriverWithAnimatedNumbers<A> {
  const nativeDriver = options?.useNativeDriver ?? isFabric

  return {
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
    useAnimatedNumbersStyle,
    usePresence,
    ResetPresence,
    useAnimations: ({
      props,
      onTransition,
      style,
      componentState,
      presence,
      stateRef,
      styleState,
      useStyleEmitter,
    }) => {
      const isDisabled = isWeb && componentState.unmounted === true
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]
      const onTransitionRef = React.useRef(onTransition)
      onTransitionRef.current = onTransition
      const emit = (
        phase: 'start' | 'end',
        cause: 'enter' | 'exit' | 'update',
        finished?: boolean
      ) => {
        onTransitionRef.current?.(
          phase === 'end' ? { phase, cause, finished } : { phase, cause }
        )
      }
      // createComponent merges a colocated `transition` out of the active
      // pseudo style (`enterStyle={{ opacity: 0, transition: '200ms' }}`), so
      // this is the one that applies right now, not the base prop.
      const effectiveTransition = (styleState?.effectiveTransition ?? props.transition) as
        | TransitionProp
        | null
        | undefined

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
      const pseudoActiveRef = React.useRef(false)

      // exit cycle guards to prevent stale/duplicate completion
      const exitCycleIdRef = React.useRef(0)
      const exitCompletedRef = React.useRef(false)
      const wasExitingRef = React.useRef(false)

      // onTransition lifecycle bookkeeping
      const enterStartedRef = React.useRef(false)
      const exitStartedRef = React.useRef(false)
      const updateInFlightRef = React.useRef(false)
      const updateCycleIdRef = React.useRef(0)
      const prevStyleSigRef = React.useRef<string | null>(null)

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
        JSON.stringify(effectiveTransition),
        componentState,
        isExiting,
        !!onTransition,
        isDark,
        justFinishedEntering,
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

        // which style keys animate at all is the transition's own decision, so
        // a property list narrows this the same way it narrows css
        const resolved = forAnimationState(
          resolveTransition(effectiveTransition, { animations }),
          animationState
        )

        const nonAnimatedStyle = {}
        // animatedStyle owns every Animated.Value on the node. Fabric cannot mix
        // native- and JS-driven values inside that shared graph, so one layout
        // animation makes the whole node use the JS driver.
        const useNativeDriverForNode =
          nativeDriver && !hasAnimatedLayoutKey(style, isDark, resolved)

        // track which animated keys/transforms the incoming style actually
        // carries this pass, so entries that left the style can be dropped
        // below (an Animated.Value that persisted forever would keep painting
        // a stale pixel value, e.g. a released-to-auto accordion height)
        const seenAnimateKeys = new Set<string>()
        let sawTransform = false
        let transformCount = 0

        for (const key in style) {
          const rawVal = style[key]
          // Resolve dynamic theme values from flat theme clauses.
          const val = resolveDynamicValue(rawVal, isDark)
          if (val === undefined) continue

          if (isDisabled) {
            continue
          }

          if (
            animatedStyleKey[key] == null &&
            !costlyToAnimateStyleKey[key] &&
            !layoutStyleKey[key]
          ) {
            nonAnimatedStyle[key] = val
            continue
          }

          // `transform` is a container, not a property: its parts each resolve
          // on their own below, and a part no entry covers gets `snapConfig`.
          // the array cannot be split into animated and static halves here.
          if (key !== 'transform' && !getTransitionForKey(resolved, key)) {
            nonAnimatedStyle[key] = val
            continue
          }

          // layout dimension keys only animate numbers — 'auto' (an open
          // accordion at rest) and percent strings apply as static styles
          if (layoutStyleKey[key] && typeof val !== 'number') {
            nonAnimatedStyle[key] = val
            continue
          }

          // unparseable colors crash RN
          // interpolation — apply them as a static style instead
          if (colorStyleKey[key] && !isAnimatableColor(val)) {
            nonAnimatedStyle[key] = val
            continue
          }

          if (key !== 'transform') {
            animateStyles.current[key] = update(key, animateStyles.current[key], val)
            seenAnimateKeys.add(key)
            continue
          }
          // key: 'transform'
          // for now just support one transform key
          if (!val) continue
          if (typeof val === 'string') {
            console.warn(`Warning: Tamagui can't animate string transforms yet!`)
            continue
          }

          sawTransform = true
          for (const transform of val) {
            if (!transform) continue
            const index = transformCount++
            // tkey: e.g: 'translateX'
            const tkey = Object.keys(transform)[0]
            const currentTransform = animatedTranforms.current[index]?.[tkey]
            animatedTranforms.current[index] = {
              [tkey]: update(tkey, currentTransform, transform[tkey]),
            }
            animatedTranforms.current = [...animatedTranforms.current]
          }
        }

        // drop stale Animated.Values whose keys left the incoming style, so the
        // key genuinely leaves the rendered style object (a released height goes
        // back to auto instead of staying pinned at its last pixel value). skip
        // while exiting (presence still animates the leaving keys) and while
        // disabled (the loop above intentionally skips every key). an active
        // pseudo owns the current emitted style until its matching release.
        if (!isExiting && !isDisabled && !pseudoActiveRef.current) {
          for (const k in animateStyles.current) {
            if (!seenAnimateKeys.has(k)) delete animateStyles.current[k]
          }
          if (!sawTransform) {
            if (animatedTranforms.current.length) animatedTranforms.current = []
          } else if (animatedTranforms.current.length > transformCount) {
            animatedTranforms.current = animatedTranforms.current.slice(0, transformCount)
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
              effectiveTransition,
              animationState
            )

            let resolve
            const promise = new Promise<void>((res) => {
              resolve = res
            })
            completions.push(promise)

            runners.push(() => {
              value.stopAnimation()

              // `delay` drives the sequence below, so it must not also ride
              // along in the config or every delayed animation waits twice
              const { type, delay, ...config } = animationConfig
              const animation = Animated[type || 'spring'](value, {
                toValue: animateToValue,
                ...config,
                useNativeDriver: useNativeDriverForNode,
              })
              const animation2 = delay
                ? Animated.sequence([Animated.delay(delay), animation])
                : animation

              animation2.start(({ finished }) => {
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

      // exit interrupted by a re-enter: report the exit as finished:false
      useIsomorphicLayoutEffect(() => {
        if (justStoppedExiting && exitStartedRef.current && !exitCompletedRef.current) {
          exitStartedRef.current = false
          emit('end', 'exit', false)
        }
      }, [justStoppedExiting])

      useIsomorphicLayoutEffect(() => {
        res.runners.forEach((r) => r())

        // capture current cycle id
        const cycleId = exitCycleIdRef.current

        const cause: 'enter' | 'exit' | 'update' = isExiting
          ? 'exit'
          : isEntering || justFinishedEntering
            ? 'enter'
            : 'update'

        // interruptions: an enter or update still in flight when exit begins is
        // reported as finished:false (its own completion promise won't resolve
        // because the animation was stopped, not finished).
        if (cause === 'exit') {
          if (enterStartedRef.current) {
            enterStartedRef.current = false
            emit('end', 'enter', false)
          }
          if (updateInFlightRef.current) {
            updateInFlightRef.current = false
            updateCycleIdRef.current++
            emit('end', 'update', false)
          }
        }

        // in-place update: a genuine style change while mounted (not entering or
        // exiting). guard on the style signature so lifecycle-only re-renders
        // don't register as updates.
        if (cause === 'update') {
          const sig = args[0] as string
          if (prevStyleSigRef.current === null || prevStyleSigRef.current === sig) {
            prevStyleSigRef.current = sig
            return
          }
          prevStyleSigRef.current = sig
          if (res.completions.length === 0) return
          if (updateInFlightRef.current) {
            // superseded before finishing
            emit('end', 'update', false)
          }
          updateInFlightRef.current = true
          const uid = ++updateCycleIdRef.current
          emit('start', 'update')
          Promise.all(res.completions).then(() => {
            if (uid !== updateCycleIdRef.current) return
            updateInFlightRef.current = false
            emit('end', 'update', true)
          })
          return
        }

        // keep the update signature current while entering/exiting
        prevStyleSigRef.current = args[0] as string

        // handle zero-completion case immediately (enter/exit report a pair)
        if (res.completions.length === 0) {
          emit('start', cause)
          emit('end', cause, true)
          if (isExiting && !exitCompletedRef.current) {
            exitCompletedRef.current = true
            sendExitComplete?.()
          }
          return
        }

        // enter/exit start (once per cycle; re-runs continue the same animation)
        if (cause === 'enter' && !enterStartedRef.current) {
          enterStartedRef.current = true
          emit('start', 'enter')
        }
        if (cause === 'exit' && !exitStartedRef.current) {
          exitStartedRef.current = true
          emit('start', 'exit')
        }

        Promise.all(res.completions).then(() => {
          // guard against stale cycle completion
          if (isExiting && cycleId !== exitCycleIdRef.current) return
          if (isExiting && exitCompletedRef.current) return

          if (isExiting) {
            if (exitStartedRef.current) {
              exitStartedRef.current = false
              // exit 'end' fires immediately before presence safeToRemove
              emit('end', 'exit', true)
            }
            exitCompletedRef.current = true
            sendExitComplete?.()
          } else if (enterStartedRef.current) {
            enterStartedRef.current = false
            emit('end', 'enter', true)
          }
        })
      }, args)

      // avoidReRenders: receive style changes imperatively from tamagui
      // and update Animated.Values directly without React re-renders
      // reuses the same update() + runner pattern as the useMemo path
      useStyleEmitter?.((nextStyle, emittedTransition, pseudoActive) => {
        pseudoActiveRef.current = pseudoActive === true
        const runners: Function[] = []
        const seenAnimateKeys = new Set<string>()
        let transformCount = 0
        let animatedShapeChanged = false
        // the emitter runs on a mounted node, so `default` is the state, but
        // the transition is the one it was handed
        const emittedResolved = forAnimationState(
          resolveTransition(emittedTransition ?? effectiveTransition, { animations }),
          'default'
        )
        // nextStyle is the complete style for this node, so the emitter makes
        // the same single driver decision as the render path. include the
        // currently rendered graph because its stale keys are not removed until
        // the structural-change commit below.
        const useNativeDriverForNode =
          nativeDriver &&
          !hasAnimatedLayoutKey(nextStyle, isDark, emittedResolved) &&
          !Object.keys(animateStyles.current).some((key) => layoutStyleKey[key])

        for (const key in nextStyle) {
          const rawVal = nextStyle[key]
          const val = resolveDynamicValue(rawVal, isDark)
          if (val === undefined) continue

          if (key === 'transform' && Array.isArray(val)) {
            for (const transform of val) {
              if (!transform) continue
              const index = transformCount++
              const tkey = Object.keys(transform)[0]
              const currentTransform = animatedTranforms.current[index]?.[tkey]
              if (!currentTransform) animatedShapeChanged = true
              animatedTranforms.current[index] = {
                [tkey]: update(tkey, currentTransform, transform[tkey]),
              }
            }
          } else if (
            animatedStyleKey[key] != null ||
            costlyToAnimateStyleKey[key] ||
            layoutStyleKey[key]
          ) {
            // layout keys only animate numbers ('auto'/percents are static);
            // unparseable themed colors can't be interpolated — skip both and
            // let the next render apply them statically
            if (layoutStyleKey[key] && typeof val !== 'number') continue
            if (colorStyleKey[key] && !isAnimatableColor(val)) continue
            if (!animateStyles.current[key]) animatedShapeChanged = true
            animateStyles.current[key] = update(key, animateStyles.current[key], val)
            seenAnimateKeys.add(key)
          }
        }

        // the emitter receives a complete style. keep the Animated style graph
        // equally complete, including a pseudo release that omits a pseudo-only
        // key. React Native needs a commit when that graph's shape changes.
        for (const key in animateStyles.current) {
          if (!seenAnimateKeys.has(key)) {
            delete animateStyles.current[key]
            animatedShapeChanged = true
          }
        }
        if (animatedTranforms.current.length > transformCount) {
          animatedTranforms.current = animatedTranforms.current.slice(0, transformCount)
          animatedShapeChanged = true
        }

        // run the queued animations immediately
        runners.forEach((r) => r())

        // pseudo state normally stays on the avoidReRenders path. adding or
        // removing a style key cannot be expressed by an existing Animated.Value,
        // so commit the pending state only for that structural change.
        if (animatedShapeChanged && stateRef.current.nextState) {
          stateRef.current.baseSetStateShallow?.(stateRef.current.nextState)
        }

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

          // the emitter runs for pseudo-state changes on a mounted node, so
          // `default` is the state, but the transition is the one it was handed
          const animationConfig = getAnimationConfig(
            key,
            animations,
            emittedTransition ?? effectiveTransition,
            'default'
          )
          runners.push(() => {
            value.stopAnimation()
            const { type, delay, ...config } = animationConfig
            const anim = Animated[type || 'spring'](value, {
              toValue: animateToValue,
              ...config,
              useNativeDriver: useNativeDriverForNode,
            })
            ;(delay ? Animated.sequence([Animated.delay(delay), anim]) : anim).start()
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

/**
 * one resolved entry as a react-native Animated config.
 *
 * springs go in as stiffness/damping/mass, which is the parameterization RN
 * actually integrates. `bounciness`/`speed` and `tension`/`friction` are older
 * spellings of the same two numbers, so nothing is lost by not using them.
 */
function entryToRN(entry: ResolvedEntry): AnimationConfig {
  const extra = entry.timing.kind === 'spring' ? entry.timing.extra : undefined

  if (entry.timing.kind === 'spring') {
    return {
      type: 'spring',
      stiffness: entry.timing.stiffness,
      damping: entry.timing.damping,
      mass: entry.timing.mass,
      ...(typeof extra?.velocity === 'number' ? { velocity: extra.velocity } : null),
      ...(typeof extra?.overshootClamping === 'boolean'
        ? { overshootClamping: extra.overshootClamping }
        : null),
      ...(entry.delayMs ? { delay: entry.delayMs } : null),
    }
  }

  const bezier = easingToBezier(entry.timing.easing)
  return {
    type: 'timing',
    duration: entry.timing.durationMs,
    // `linear()` and `steps()` have no bezier equivalent; RN's default easing
    // is the honest answer rather than a curve we made up
    ...(bezier
      ? { easing: Easing.bezier(bezier[0], bezier[1], bezier[2], bezier[3]) }
      : null),
    ...(entry.delayMs ? { delay: entry.delayMs } : null),
  }
}

// a key the transition does not cover does not animate. snapping is what css
// does for an unlisted property, so the drivers have to agree on it too.
const snapConfig: AnimationConfig = { type: 'timing', duration: 0 }

function getAnimationConfig(
  key: string,
  animations: AnimationsConfig,
  transition?: TransitionProp | null,
  animationState: 'enter' | 'exit' | 'default' = 'default'
): AnimationConfig {
  const resolved = forAnimationState(
    resolveTransition(transition, { animations }),
    animationState
  )
  const entry = getTransitionForKey(resolved, key)
  return entry ? entryToRN(entry) : snapConfig
}

function getValue(input: number | string, isColor = false) {
  if (typeof input !== 'string') {
    return [input] as const
  }
  // the unit is optional: unitless numbers reach here as strings (scale, and
  // any bare token value), and the number may be fractional. matching only
  // `[-0-9]+` followed by a required unit read "1.5deg" as 5 and gave NaN for
  // "0.95", and an Animated animation toward NaN never calls its completion
  // callback, which strands whatever waits on it.
  const [_, number, after] = input.match(/(-?(?:\d+\.?\d*|\.\d+))(deg|%|px)?/) ?? []
  return [+number, after] as const
}
