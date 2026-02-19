import { normalizeTransition, getEffectiveAnimation } from '@tamagui/animation-helpers'
import {
  getSplitStyles,
  hooks,
  isWeb,
  type PseudoTransitions,
  Text,
  useComposedRefs,
  useEvent,
  useIsomorphicLayoutEffect,
  useThemeWithState,
  View,
  type AnimationDriver,
  type UniversalAnimatedNumber,
} from '@tamagui/core'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import React, { forwardRef, useMemo, useRef } from 'react'
import type { SharedValue } from 'react-native-reanimated'
import Animated_, {
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated'

// =============================================================================
// ESM/CJS compatibility
// =============================================================================

/**
 * Handle ESM/CJS module interop for react-native-reanimated
 * @see https://github.com/evanw/esbuild/issues/2480#issuecomment-1833104754
 */
const getDefaultExport = <T,>(module: T | { default: T }): T => {
  const mod = module as any
  if (mod.__esModule || mod[Symbol.toStringTag] === 'Module') {
    return mod.default || mod
  }
  return mod
}

const Animated = getDefaultExport(Animated_)

// =============================================================================
// Types
// =============================================================================

type ReanimatedAnimatedNumber = SharedValue<number>

/** Spring animation configuration */
type SpringConfig = {
  type?: 'spring'
  delay?: number
} & Partial<WithSpringConfig>

/** Timing animation configuration */
type TimingConfig = {
  type: 'timing'
  delay?: number
} & Partial<WithTimingConfig>

/** Combined animation configuration type */
export type TransitionConfig = SpringConfig | TimingConfig

/** Options for createAnimations (reserved for future use) */
export type CreateAnimationsOptions = {}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Resolve dynamic theme values (e.g., `{dynamic: {dark: "value", light: "value"}}`)
 */
const resolveDynamicValue = (value: unknown, isDark: boolean): unknown => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'dynamic' in value &&
    typeof (value as any).dynamic === 'object'
  ) {
    const dynamic = (value as any).dynamic
    return isDark ? dynamic.dark : dynamic.light
  }
  return value
}

/** Animation completion callback type */
type AnimationCallback = (finished?: boolean) => void

/**
 * Apply animation to a value based on config, with optional completion callback
 */
const applyAnimation = (
  targetValue: number | string,
  config: TransitionConfig,
  callback?: AnimationCallback
): number | string => {
  'worklet'
  const delay = config.delay

  let animatedValue: any
  if (config.type === 'timing') {
    animatedValue = withTiming(
      targetValue as number,
      config as WithTimingConfig,
      callback
    )
  } else {
    animatedValue = withSpring(
      targetValue as number,
      config as WithSpringConfig,
      callback
    )
  }

  if (delay && delay > 0) {
    animatedValue = withDelay(delay, animatedValue)
  }

  return animatedValue
}

// =============================================================================
// Animatable Properties
// =============================================================================

const ANIMATABLE_PROPERTIES: Record<string, boolean> = {
  // Transform
  transform: true,
  // Opacity
  opacity: true,
  // Dimensions
  height: true,
  width: true,
  minWidth: true,
  minHeight: true,
  maxWidth: true,
  maxHeight: true,
  // Background
  backgroundColor: true,
  // Border colors
  borderColor: true,
  borderLeftColor: true,
  borderRightColor: true,
  borderTopColor: true,
  borderBottomColor: true,
  // Border radius
  borderRadius: true,
  borderTopLeftRadius: true,
  borderTopRightRadius: true,
  borderBottomLeftRadius: true,
  borderBottomRightRadius: true,
  // Border width
  borderWidth: true,
  borderLeftWidth: true,
  borderRightWidth: true,
  borderTopWidth: true,
  borderBottomWidth: true,
  // Text
  color: true,
  fontSize: true,
  fontWeight: true,
  lineHeight: true,
  letterSpacing: true,
  // Position
  left: true,
  right: true,
  top: true,
  bottom: true,
  // Margin
  margin: true,
  marginTop: true,
  marginBottom: true,
  marginLeft: true,
  marginRight: true,
  marginHorizontal: true,
  marginVertical: true,
  // Padding
  padding: true,
  paddingTop: true,
  paddingBottom: true,
  paddingLeft: true,
  paddingRight: true,
  paddingHorizontal: true,
  paddingVertical: true,
  // Flex/Gap
  gap: true,
  rowGap: true,
  columnGap: true,
  flex: true,
  flexGrow: true,
  flexShrink: true,
}

/**
 * Check if a style property can be animated
 */
const canAnimateProperty = (
  key: string,
  value: unknown,
  animateOnly?: string[]
): boolean => {
  if (!ANIMATABLE_PROPERTIES[key]) return false
  if (value === 'auto') return false
  if (typeof value === 'string' && value.startsWith('calc')) return false
  if (animateOnly && !animateOnly.includes(key)) return false
  return true
}

// =============================================================================
// Animated Components (Web)
// =============================================================================

/**
 * Create a Tamagui-compatible animated component for web
 * Supports data- attributes, className, and proper style handling
 */
function createWebAnimatedComponent(defaultTag: 'div' | 'span') {
  const isText = defaultTag === 'span'

  const Component = Animated.createAnimatedComponent(
    forwardRef((propsIn: any, ref) => {
      const { forwardedRef, render = defaultTag, ...rest } = propsIn
      const hostRef = useRef<HTMLElement>(null)
      const composedRefs = useComposedRefs(forwardedRef, ref, hostRef)

      const stateRef = useRef<{ host: HTMLElement | null }>({
        get host() {
          return hostRef.current
        },
      })

      const [, themeState] = useThemeWithState({})

      const result = getSplitStyles(
        rest,
        isText ? Text.staticConfig : View.staticConfig,
        themeState?.theme ?? {},
        themeState?.name ?? '',
        { unmounted: false } as any,
        { isAnimated: false, noClass: true }
      )

      const viewProps = result?.viewProps ?? {}
      const Element = render
      const transformedProps = hooks.usePropsTransform?.(
        render,
        viewProps,
        stateRef as any,
        false
      )

      return <Element {...transformedProps} ref={composedRefs} />
    })
  )
  ;(Component as any).acceptRenderProp = true
  return Component
}

const AnimatedView = createWebAnimatedComponent('div')
const AnimatedText = createWebAnimatedComponent('span')

// =============================================================================
// Transition Config Builder
// =============================================================================

type TransitionConfigResult = {
  baseConfig: TransitionConfig
  propertyConfigs: Record<string, TransitionConfig>
}

/**
 * Builds animation config from a transition prop.
 * Shared logic used in both initial render and style emitter updates.
 */
function buildTransitionConfig<A extends Record<string, TransitionConfig>>(
  transition: any,
  animations: A,
  animationState: 'enter' | 'exit' | 'default',
  styleKeys: Set<string>
): TransitionConfigResult {
  const normalized = normalizeTransition(transition)
  const effectiveKey = getEffectiveAnimation(normalized, animationState)

  let base = effectiveKey
    ? (animations[effectiveKey as keyof typeof animations] ??
      ({ type: 'spring' } as TransitionConfig))
    : ({ type: 'spring' } as TransitionConfig)

  if (normalized.delay) {
    base = { ...base, delay: normalized.delay }
  }

  if (normalized.config) {
    base = { ...base, ...normalized.config }
    // infer type: 'timing' if duration is provided without spring params
    if (
      base.type !== 'timing' &&
      normalized.config.duration !== undefined &&
      normalized.config.damping === undefined &&
      normalized.config.stiffness === undefined &&
      normalized.config.mass === undefined
    ) {
      base = { ...base, type: 'timing' }
    }
  }

  // build per-property configs
  const propertyConfigs: Record<string, TransitionConfig> = {}

  for (const key of styleKeys) {
    const propAnimation = normalized.properties[key]
    if (typeof propAnimation === 'string') {
      propertyConfigs[key] = animations[propAnimation as keyof typeof animations] ?? base
    } else if (propAnimation && typeof propAnimation === 'object') {
      const configType = (propAnimation as any).type
      const baseForProp = configType
        ? (animations[configType as keyof typeof animations] ?? base)
        : base
      propertyConfigs[key] = {
        ...baseForProp,
        ...propAnimation,
      } as TransitionConfig
    } else {
      propertyConfigs[key] = base
    }
  }

  return { baseConfig: base, propertyConfigs }
}

/**
 * Extracts all style keys including transform sub-properties.
 */
function getStyleKeys(style: Record<string, unknown>): Set<string> {
  const keys = new Set(Object.keys(style))
  if (style.transform && Array.isArray(style.transform)) {
    for (const t of style.transform as Record<string, unknown>[]) {
      if (t && typeof t === 'object') {
        keys.add(Object.keys(t)[0])
      }
    }
  }
  return keys
}

// =============================================================================
// Animation Driver Factory
// =============================================================================

/**
 * Create a Reanimated-based animation driver for Tamagui.
 *
 * This is a native Reanimated implementation without Moti dependency.
 * It provides smooth spring and timing animations with full support for:
 * - Per-property animation configurations
 * - Exit animations with proper completion callbacks
 * - Dynamic theme value resolution
 * - Transform property animations
 * - avoidReRenders optimization for hover/press/focus states
 *
 * @example
 * ```tsx
 * const animations = createAnimations({
 *   fast: { type: 'spring', damping: 20, stiffness: 250 },
 *   slow: { type: 'timing', duration: 500 },
 * })
 *
 * ```
 */
export function createAnimations<A extends Record<string, TransitionConfig>>(
  animationsConfig: A
): AnimationDriver<A> {
  // Normalize animation configs - default to spring if not specified
  // This matches behavior of moti and motion drivers
  const animations = {} as A
  for (const key in animationsConfig) {
    animations[key] = {
      type: 'spring',
      ...animationsConfig[key],
    } as A[typeof key]
  }

  return {
    needsCustomComponent: true,
    View: isWeb ? AnimatedView : Animated.View,
    Text: isWeb ? AnimatedText : Animated.Text,
    isReactNative: true,
    inputStyle: 'value',
    outputStyle: 'inline',
    avoidReRenders: true,
    animations,
    usePresence,
    ResetPresence,

    // =========================================================================
    // useAnimatedNumber - For imperative animated values
    // =========================================================================
    useAnimatedNumber(initial): UniversalAnimatedNumber<ReanimatedAnimatedNumber> {
      const sharedValue = useSharedValue(initial)

      return useMemo(
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
            const handleFinish = onFinish
              ? () => {
                  'worklet'
                  runOnJS(onFinish)()
                }
              : undefined

            if (config.type === 'direct') {
              sharedValue.value = next
              onFinish?.()
            } else if (config.type === 'spring') {
              sharedValue.value = withSpring(
                next,
                config as WithSpringConfig,
                handleFinish
              )
            } else {
              sharedValue.value = withTiming(
                next,
                config as WithTimingConfig,
                handleFinish
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

    // =========================================================================
    // useAnimatedNumberReaction - React to animated value changes
    // =========================================================================
    useAnimatedNumberReaction({ value }, onValue) {
      const instance = value.getInstance()

      return useAnimatedReaction(
        () => instance.value,
        (next, prev) => {
          if (prev !== next) {
            runOnJS(onValue)(next)
          }
        },
        [onValue, instance]
      )
    },

    // =========================================================================
    // useAnimatedNumberStyle - Create animated styles from values
    // =========================================================================
    useAnimatedNumberStyle(val, getStyle) {
      const instance = val.getInstance()

      const derivedValue = useDerivedValue(() => instance.value, [instance, getStyle])

      return useAnimatedStyle(
        () => getStyle(derivedValue.value),
        [val, getStyle, derivedValue, instance]
      )
    },

    // =========================================================================
    // useAnimations - Main animation hook for components
    // =========================================================================
    useAnimations(animationProps) {
      const {
        props,
        presence,
        style,
        componentState,
        useStyleEmitter,
        themeName,
        stateRef,
        styleState,
      } = animationProps

      // State flags
      const isHydrating = componentState.unmounted === true
      const isMounting = componentState.unmounted === 'should-enter'
      const isEntering = !!componentState.unmounted

      // Presence state for exit animations
      const isExiting = presence?.[0] === false

      // Track if we just finished entering (transition from entering to not entering)
      const wasEnteringRef = useRef(isEntering)
      const justFinishedEntering = wasEnteringRef.current && !isEntering
      React.useEffect(() => {
        wasEnteringRef.current = isEntering
      })

      // Use effectiveTransition computed by createComponent (single source of truth)
      const effectiveTransition = styleState?.effectiveTransition ?? props.transition
      const normalized = normalizeTransition(effectiveTransition)
      // Use 'enter' if we're mounting OR if we just finished entering
      const animationState: 'enter' | 'exit' | 'default' = isExiting
        ? 'exit'
        : isMounting || justFinishedEntering
          ? 'enter'
          : 'default'
      const animationKey = getEffectiveAnimation(normalized, animationState)

      const disableAnimation = isHydrating || !animationKey

      // Theme state for dynamic values - use themeName from props instead of hook
      const isDark = themeName?.startsWith('dark') || false

      // Get sendExitComplete callback from presence
      const sendExitComplete = presence?.[1]

      // =========================================================================
      // Exit cycle state for deterministic per-property completion tracking
      // =========================================================================
      const exitCycleIdRef = useRef(0)
      const pendingExitKeysRef = useRef<Set<string>>(new Set())
      const exitCompletedRef = useRef(false)
      const wasExitingRef = useRef(false)

      // detect transition into/out of exiting state
      const justStartedExiting = isExiting && !wasExitingRef.current
      const justStoppedExiting = !isExiting && wasExitingRef.current

      // stable callback to mark a property as done (called from worklet via runOnJS)
      const markExitKeyDone = useEvent(
        (key: string, cycleId: number, finished: boolean) => {
          // ignore callbacks from stale cycles
          if (cycleId !== exitCycleIdRef.current) return
          // ignore if already completed
          if (exitCompletedRef.current) return
          // count both finished and canceled animations as "done" during exit
          // (element is leaving anyway, canceled animations shouldn't block completion)

          pendingExitKeysRef.current.delete(key)

          // check if all exit animations are done
          if (pendingExitKeysRef.current.size === 0) {
            exitCompletedRef.current = true
            sendExitComplete?.()
          }
        }
      )

      // SharedValue to pass exit state into worklet
      const isExitingRef = useSharedValue(isExiting)
      const exitCycleIdShared = useSharedValue(exitCycleIdRef.current)

      // start new exit cycle only on transition INTO exiting (not every render while exiting)
      if (justStartedExiting) {
        exitCycleIdRef.current++
        exitCompletedRef.current = false
        pendingExitKeysRef.current.clear()
      }
      // invalidate pending callbacks when exit is canceled/interrupted
      if (justStoppedExiting) {
        exitCycleIdRef.current++
        pendingExitKeysRef.current.clear()
      }

      // update shared values (using effect to avoid writing during render)
      useIsomorphicLayoutEffect(() => {
        isExitingRef.value = isExiting
        exitCycleIdShared.value = exitCycleIdRef.current
      }, [isExiting, exitCycleIdRef.current])

      // track previous exiting state
      React.useEffect(() => {
        wasExitingRef.current = isExiting
      })

      // =========================================================================
      // avoidRerenders: SharedValues for style updates without re-renders
      // =========================================================================
      const animatedTargetsRef = useSharedValue<Record<string, unknown> | null>(null)
      const staticTargetsRef = useSharedValue<Record<string, unknown> | null>(null)
      const transformTargetsRef = useSharedValue<Array<Record<string, unknown>> | null>(
        null
      )

      // Separate styles into animated and static
      const { animatedStyles, staticStyles } = useMemo(() => {
        const animated: Record<string, unknown> = {}
        const staticStyles: Record<string, unknown> = {}
        const animateOnly = props.animateOnly as string[] | undefined

        for (const key in style) {
          const rawValue = (style as Record<string, unknown>)[key]
          const value = resolveDynamicValue(rawValue, isDark)

          if (value === undefined) continue

          if (disableAnimation) {
            staticStyles[key] = value
            continue
          }

          if (canAnimateProperty(key, value, animateOnly)) {
            animated[key] = value
          } else {
            staticStyles[key] = value
          }
        }

        // During mount, include animated values in static to prevent flicker
        if (isMounting) {
          for (const key in animated) {
            staticStyles[key] = animated[key]
          }
        }

        return { animatedStyles: animated, staticStyles }
      }, [disableAnimation, style, isDark, isMounting, props.animateOnly])

      // Build animation config with per-property overrides using normalized transition
      const { baseConfig, propertyConfigs } = useMemo(() => {
        if (isHydrating) {
          return {
            baseConfig: { type: 'timing' as const, duration: 0 },
            propertyConfigs: {} as Record<string, TransitionConfig>,
          }
        }

        return buildTransitionConfig(
          props.transition,
          animations,
          animationState,
          getStyleKeys(animatedStyles)
        )
      }, [isHydrating, props.transition, animatedStyles, animationState])

      // Store config in SharedValue for worklet access (concurrent-safe)
      // Using useEffect to avoid writing to shared value during render
      const configRef = useSharedValue({
        baseConfig,
        propertyConfigs,
        disableAnimation,
        isHydrating,
      })

      useIsomorphicLayoutEffect(() => {
        configRef.set({ baseConfig, propertyConfigs, disableAnimation, isHydrating })
      }, [baseConfig, propertyConfigs, disableAnimation, isHydrating])

      // =========================================================================
      // avoidRerenders: Register style emitter callback
      // When hover/press/etc state changes, this is called instead of re-rendering
      // =========================================================================
      useStyleEmitter?.((nextStyle: Record<string, unknown>, effectiveTransition) => {
        const animateOnly = props.animateOnly as string[] | undefined
        const animated: Record<string, unknown> = {}
        const statics: Record<string, unknown> = {}
        const transforms: Array<Record<string, unknown>> = []

        // effectiveTransition is computed in createComponent based on entering/exiting pseudo states
        // rebuild config whenever transition changes (entering OR exiting pseudo states)
        const transitionToUse = effectiveTransition ?? props.transition
        const { baseConfig: newBase, propertyConfigs: newPropertyConfigs } =
          buildTransitionConfig(
            transitionToUse,
            animations,
            animationState,
            getStyleKeys(nextStyle)
          )

        // update configRef with the new config
        configRef.set({
          baseConfig: newBase,
          propertyConfigs: newPropertyConfigs,
          disableAnimation: configRef.get().disableAnimation,
          isHydrating: configRef.get().isHydrating,
        })

        for (const key in nextStyle) {
          const rawValue = nextStyle[key]
          const value = resolveDynamicValue(rawValue, isDark)

          if (value == undefined) continue

          if (configRef.get().disableAnimation) {
            statics[key] = value
            continue
          }

          if (key === 'transform' && Array.isArray(value)) {
            for (const t of value as Record<string, unknown>[]) {
              if (t && typeof t === 'object') {
                const tKey = Object.keys(t)[0]
                const tVal = t[tKey]
                if (typeof tVal === 'number' || typeof tVal === 'string') {
                  transforms.push(t)
                }
              }
            }
            continue
          }

          if (canAnimateProperty(key, value, animateOnly)) {
            animated[key] = value
          } else {
            statics[key] = value
          }
        }

        // Update SharedValues - on web, the mapper watches these if passed in dependencies
        animatedTargetsRef.set(animated)
        staticTargetsRef.set(statics)
        transformTargetsRef.set(transforms)

        if (
          process.env.NODE_ENV === 'development' &&
          props.debug &&
          props.debug !== 'profile'
        ) {
          console.info('[animations-reanimated] useStyleEmitter update', {
            animated,
            statics,
            transforms,
          })
        }
      })

      // Compute and register exit keys synchronously during render to avoid race conditions
      // This must happen BEFORE useAnimatedStyle runs so callbacks have a populated set
      const exitKeysRegistered = useRef(false)
      if (justStartedExiting && sendExitComplete) {
        const exitKeys: string[] = []
        const animateOnly = props.animateOnly as string[] | undefined

        // regular animated properties
        for (const key in animatedStyles) {
          if (key === 'transform') continue
          if (canAnimateProperty(key, animatedStyles[key], animateOnly)) {
            exitKeys.push(key)
          }
        }

        // transform sub-keys (filter by animateOnly if specified)
        const transforms = animatedStyles.transform
        if (transforms && Array.isArray(transforms)) {
          for (const t of transforms) {
            if (!t) continue
            const tKey = Object.keys(t)[0]
            if (tKey) {
              // check animateOnly filter for transform sub-keys
              if (animateOnly && !animateOnly.includes(tKey)) {
                continue
              }
              exitKeys.push(`transform:${tKey}`)
            }
          }
        }

        // register keys for this cycle
        pendingExitKeysRef.current = new Set(exitKeys)
        exitKeysRegistered.current = exitKeys.length > 0
      }

      // handle zero-animation case in effect (after render commit)
      React.useEffect(() => {
        if (!justStartedExiting || !sendExitComplete) return

        // if no keys were registered, complete immediately
        if (!exitKeysRegistered.current && pendingExitKeysRef.current.size === 0) {
          if (!exitCompletedRef.current) {
            exitCompletedRef.current = true
            sendExitComplete()
          }
        }
      }, [justStartedExiting, sendExitComplete])

      // Create animated style
      const animatedStyle = useAnimatedStyle(() => {
        'worklet'

        if (disableAnimation || isHydrating) {
          return {}
        }

        const result: Record<string, any> = {}
        const config = configRef.get()

        // Check if we have avoidRerenders updates from useStyleEmitter
        const emitterAnimated = animatedTargetsRef.value
        const emitterStatic = staticTargetsRef.value
        const emitterTransforms = transformTargetsRef.value
        const hasEmitterUpdates = emitterAnimated !== null

        // Use emitter values if available, otherwise use React state values
        const animatedValues = hasEmitterUpdates ? emitterAnimated! : animatedStyles
        const staticValues = hasEmitterUpdates ? emitterStatic! : {}

        // read exit state from shared values
        const currentlyExiting = isExitingRef.value
        const currentCycleId = exitCycleIdShared.value

        // Include static values from emitter (for hover/press style changes)
        for (const key in staticValues) {
          result[key] = staticValues[key]
        }

        // Animate regular properties
        for (const key in animatedValues) {
          if (key === 'transform') continue

          const targetValue = animatedValues[key]
          const propConfig = config.propertyConfigs[key] ?? config.baseConfig

          // create callback for exit tracking
          let callback: AnimationCallback | undefined
          if (currentlyExiting) {
            const capturedKey = key
            const capturedCycleId = currentCycleId
            callback = (finished) => {
              'worklet'
              runOnJS(markExitKeyDone)(capturedKey, capturedCycleId, finished ?? false)
            }
          }

          result[key] = applyAnimation(targetValue as number, propConfig, callback)
        }

        // Handle transforms
        const transforms = hasEmitterUpdates
          ? emitterTransforms
          : animatedStyles.transform

        // Animate transform properties with validation
        if (transforms && Array.isArray(transforms)) {
          const validTransforms: Record<string, unknown>[] = []

          for (const t of transforms) {
            if (!t) continue
            const keys = Object.keys(t)
            if (keys.length === 0) continue
            const value = t[keys[0]]
            if (typeof value === 'number' || typeof value === 'string') {
              const transformKey = Object.keys(t)[0]
              const targetValue = t[transformKey]
              const propConfig = config.propertyConfigs[transformKey] ?? config.baseConfig

              // create callback for exit tracking (transform sub-key)
              let callback: AnimationCallback | undefined
              if (currentlyExiting) {
                const capturedKey = `transform:${transformKey}`
                const capturedCycleId = currentCycleId
                callback = (finished) => {
                  'worklet'
                  runOnJS(markExitKeyDone)(
                    capturedKey,
                    capturedCycleId,
                    finished ?? false
                  )
                }
              }

              validTransforms.push({
                [transformKey]: applyAnimation(
                  targetValue as number,
                  propConfig,
                  callback
                ),
              })
            }
          }

          if (validTransforms.length > 0) {
            result.transform = validTransforms
          }
        }

        return result
      }, [
        animatedStyles,
        baseConfig,
        propertyConfigs,
        disableAnimation,
        isHydrating,
        // Pass SharedValues so the mapper watches them on web (see useAnimatedStyle.ts line 470-472)
        animatedTargetsRef,
        staticTargetsRef,
        transformTargetsRef,
        isExitingRef,
        exitCycleIdShared,
        markExitKeyDone,
      ])

      // Debug logging
      if (
        process.env.NODE_ENV === 'development' &&
        props.debug &&
        props.debug !== 'profile'
      ) {
        console.info('[animations-reanimated] useAnimations', {
          animationKey,
          componentState,
          isExiting,
          animatedStyles,
          staticStyles,
          baseConfig,
          propertyConfigs,
        })
      }

      return {
        style: [staticStyles, animatedStyle],
      }
    },
  }
}
