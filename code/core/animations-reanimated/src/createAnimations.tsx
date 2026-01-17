import { normalizeTransition } from '@tamagui/animation-helpers'
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

/**
 * Apply animation to a value based on config
 */
const applyAnimation = (
  targetValue: number | string,
  config: TransitionConfig
): number | string => {
  'worklet'
  const delay = config.delay

  let animatedValue: any
  if (config.type === 'timing') {
    animatedValue = withTiming(targetValue as number, config as WithTimingConfig)
  } else {
    animatedValue = withSpring(targetValue as number, config as WithSpringConfig)
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
  ;(Component as any).acceptTagProp = true
  return Component
}

const AnimatedView = createWebAnimatedComponent('div')
const AnimatedText = createWebAnimatedComponent('span')

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
    View: isWeb ? AnimatedView : Animated.View,
    Text: isWeb ? AnimatedText : Animated.Text,
    isReactNative: true,
    supportsCSS: false,
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
      const { props, presence, style, componentState, useStyleEmitter, themeName } =
        animationProps

      // Extract animation key from normalized transition
      // props.transition can be: string | [string, config] | { default: string, ... }
      const normalized = normalizeTransition(props.transition)
      const animationKey = normalized.default

      // State flags
      const isHydrating = componentState.unmounted === true
      const isMounting = componentState.unmounted === 'should-enter'
      const disableAnimation = isHydrating || !animationKey

      // Theme state for dynamic values - use themeName from props instead of hook
      const isDark = themeName?.startsWith('dark') || false

      // Presence state for exit animations
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]

      // Track exit animation progress (0 = not started, 1 = complete)
      const exitProgress = useSharedValue(0)

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

        // Normalize the transition prop to a consistent format
        const normalized = normalizeTransition(props.transition)

        // Get base animation config from default animation key
        let base = normalized.default
          ? (animations[normalized.default as keyof typeof animations] ??
            ({ type: 'spring' } as TransitionConfig))
          : ({ type: 'spring' } as TransitionConfig)

        // Apply global delay to base config if present
        if (normalized.delay) {
          base = { ...base, delay: normalized.delay }
        }

        // Build per-property overrides from normalized properties
        const overrides: Record<string, TransitionConfig> = {}

        for (const key in normalized.properties) {
          const animationNameOrConfig = normalized.properties[key]
          if (typeof animationNameOrConfig === 'string') {
            // Property override referencing a named animation: { x: 'quick' }
            overrides[key] =
              animations[animationNameOrConfig as keyof typeof animations] ?? base
          } else if (animationNameOrConfig && typeof animationNameOrConfig === 'object') {
            // Property override with inline config: { x: { type: 'quick', delay: 100 } }
            const configType = (animationNameOrConfig as any).type
            const baseForProp = configType
              ? (animations[configType as keyof typeof animations] ?? base)
              : base
            // Cast to TransitionConfig since we're merging compatible animation configs
            overrides[key] = {
              ...baseForProp,
              ...animationNameOrConfig,
            } as TransitionConfig
          }
        }

        // Build per-property config map
        const configs: Record<string, TransitionConfig> = {}

        // Get all animated property keys including transform sub-properties
        const allKeys = new Set(Object.keys(animatedStyles))
        if (animatedStyles.transform && Array.isArray(animatedStyles.transform)) {
          for (const t of animatedStyles.transform as Record<string, unknown>[]) {
            allKeys.add(Object.keys(t)[0])
          }
        }

        for (const key of allKeys) {
          configs[key] = overrides[key] ?? base
        }

        return { baseConfig: base, propertyConfigs: configs }
      }, [isHydrating, props.transition, animatedStyles])

      // Store config in SharedValue for worklet access (concurrent-safe)
      // Using .set() method for React Compiler compatibility
      const configRef = useSharedValue({
        baseConfig,
        propertyConfigs,
        disableAnimation,
        isHydrating,
      })
      configRef.set({ baseConfig, propertyConfigs, disableAnimation, isHydrating })

      // =========================================================================
      // avoidRerenders: Register style emitter callback
      // When hover/press/etc state changes, this is called instead of re-rendering
      // =========================================================================
      useStyleEmitter?.((nextStyle: Record<string, unknown>) => {
        const animateOnly = props.animateOnly as string[] | undefined
        const animated: Record<string, unknown> = {}
        const statics: Record<string, unknown> = {}
        const transforms: Array<Record<string, unknown>> = []

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

        // Update SharedValues - this triggers worklet without React re-render
        // Using .set() method for concurrent-safe updates
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

      // Store baseConfig in a ref so the exit effect doesn't re-run when config changes
      const baseConfigRef = useRef(baseConfig)
      baseConfigRef.current = baseConfig

      // Handle exit animation completion using reanimated's native callback
      // Animate exitProgress from 0 to 1 during exit, call sendExitComplete on completion
      React.useEffect(() => {
        if (!isExiting || !sendExitComplete) return

        // Use ref to get current config without adding to deps
        const config = baseConfigRef.current

        // Animate exitProgress to 1, which triggers sendExitComplete on completion
        // Using .set() for React Compiler compatibility
        if (config.type === 'timing') {
          exitProgress.set(
            withTiming(1, config as WithTimingConfig, (finished) => {
              'worklet'
              if (finished) {
                runOnJS(sendExitComplete)()
              }
            })
          )
        } else {
          exitProgress.set(
            withSpring(1, config as WithSpringConfig, (finished) => {
              'worklet'
              if (finished) {
                runOnJS(sendExitComplete)()
              }
            })
          )
        }

        return () => {
          // Cancel the exit animation if component unmounts early
          cancelAnimation(exitProgress)
        }
      }, [isExiting, sendExitComplete])

      // Create animated style
      const animatedStyle = useAnimatedStyle(() => {
        'worklet'

        if (disableAnimation || isHydrating) {
          return {}
        }

        const result: Record<string, any> = {}
        const config = configRef.get()

        // Check if we have avoidRerenders updates
        // Using .get() method for concurrent-safe reads in worklets
        const emitterAnimated = animatedTargetsRef.get()
        const hasEmitterUpdates = emitterAnimated !== null

        // Use emitter values if available, otherwise use React state values
        const animatedValues = hasEmitterUpdates ? emitterAnimated! : animatedStyles
        const staticValues = hasEmitterUpdates ? staticTargetsRef.get()! : {}

        // Include static values from emitter (for hover/press style changes)
        for (const key in staticValues) {
          result[key] = staticValues[key]
        }

        // Animate regular properties
        for (const key in animatedValues) {
          if (key === 'transform') continue

          const targetValue = animatedValues[key]
          const propConfig = config.propertyConfigs[key] ?? config.baseConfig
          result[key] = applyAnimation(targetValue as number, propConfig)
        }

        // Handle transforms
        const transforms = hasEmitterUpdates
          ? transformTargetsRef.get()
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
              validTransforms.push({
                [transformKey]: applyAnimation(targetValue as number, propConfig),
              })
            }
          }

          if (validTransforms.length > 0) {
            result.transform = validTransforms
          }
        }

        return result
      }, [animatedStyles, baseConfig, propertyConfigs, disableAnimation, isHydrating])

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
