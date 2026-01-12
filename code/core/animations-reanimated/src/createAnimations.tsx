import { normalizeTransition } from '@tamagui/animation-helpers'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
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

/** Per-property animation overrides */
type PropertyOverrides = Record<string, TransitionConfig | string>

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

/**
 * Estimate spring animation duration based on physics parameters
 * Uses underdamped harmonic oscillator settling time formula
 *
 * Adds 15% buffer to ensure animation visually completes before exit callback
 */
const estimateSpringDuration = (config: SpringConfig): number => {
  const stiffness = config.stiffness ?? 100
  const damping = config.damping ?? 10
  const mass = config.mass ?? 1

  // Guard against invalid parameters that would cause division by zero or NaN
  if (mass <= 0 || stiffness <= 0) {
    return 400 // sensible default
  }

  // Natural frequency: ω₀ = √(k/m)
  const omega0 = Math.sqrt(stiffness / mass)
  // Damping ratio: ζ = c / (2√(km))
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))

  let duration: number
  if (zeta < 1 && zeta > 0 && omega0 > 0) {
    // Underdamped: oscillates, settling time ≈ 4 / (ζω₀)
    duration = (4 / (zeta * omega0)) * 1000
  } else if (omega0 > 0) {
    // Overdamped or critically damped
    duration = (2 / omega0) * 1000
  } else {
    duration = 400 // fallback
  }

  // Guard against NaN/Infinity from edge cases
  if (!Number.isFinite(duration)) {
    return 400
  }

  // Clamp and add 15% buffer to prevent premature exit callbacks
  return Math.ceil(Math.min(2000, Math.max(200, duration)) * 1.15)
}

/**
 * Get total animation duration including delay
 * Adds 50ms buffer for timing animations to ensure completion before callbacks
 */
const getAnimationDuration = (config: TransitionConfig): number => {
  const delay = Math.max(0, config.delay ?? 0)

  if (config.type === 'timing') {
    const duration = Math.max(0, (config as TimingConfig).duration ?? 300)
    return duration + delay + 50
  }

  return estimateSpringDuration(config as SpringConfig) + delay
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
      const { forwardedRef, tag = defaultTag, ...rest } = propsIn
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
      const Element = tag
      const transformedProps = hooks.usePropsTransform?.(
        tag,
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
      const { props, presence, style, componentState, useStyleEmitter } = animationProps

      // Extract animation key
      const animationKey = Array.isArray(props.transition)
        ? props.transition[0]
        : props.transition

      // State flags
      const isHydrating = componentState.unmounted === true
      const isMounting = componentState.unmounted === 'should-enter'
      const disableAnimation = isHydrating || !animationKey

      // Theme state for dynamic values
      const [, themeState] = useThemeWithState({})
      const isDark = themeState?.scheme === 'dark' || themeState?.name?.startsWith('dark')

      // Presence state for exit animations
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]

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
        let base =
          normalized.default
            ? (animations[normalized.default as keyof typeof animations] ??
               ({ type: 'spring' } as TransitionConfig))
            : ({ type: 'spring' } as TransitionConfig)

        // Apply global delay to base config if present
        if (normalized.delay) {
          base = { ...base, delay: normalized.delay }
        }

        // Build per-property overrides from normalized properties
        const overrides: Record<string, TransitionConfig> = {}

        for (const [key, animationNameOrConfig] of Object.entries(normalized.properties)) {
          if (typeof animationNameOrConfig === 'string') {
            // Property override referencing a named animation: { x: 'quick' }
            overrides[key] = animations[animationNameOrConfig as keyof typeof animations] ?? base
          } else if (animationNameOrConfig && typeof animationNameOrConfig === 'object') {
            // Property override with inline config: { x: { type: 'quick', delay: 100 } }
            const configType = animationNameOrConfig.type
            const baseForProp = configType
              ? (animations[configType as keyof typeof animations] ?? base)
              : base
            // Cast to TransitionConfig since we're merging compatible animation configs
            overrides[key] = { ...baseForProp, ...animationNameOrConfig } as TransitionConfig
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

      // Store config in ref for worklet access
      const configRef = useRef({
        baseConfig,
        propertyConfigs,
        disableAnimation,
        isHydrating,
      })
      configRef.current = { baseConfig, propertyConfigs, disableAnimation, isHydrating }

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

          if (value === undefined) continue

          if (configRef.current.disableAnimation) {
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
        animatedTargetsRef.value = animated
        staticTargetsRef.value = statics
        transformTargetsRef.value = transforms

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

      // Handle exit animation completion
      // Use timeout based on calculated animation duration
      React.useEffect(() => {
        if (!isExiting || !sendExitComplete) return

        const duration = getAnimationDuration(baseConfig)
        const timeoutId = setTimeout(sendExitComplete, duration)

        return () => clearTimeout(timeoutId)
      }, [isExiting, sendExitComplete, baseConfig])

      // Create animated style
      const animatedStyle = useAnimatedStyle(() => {
        'worklet'

        if (disableAnimation || isHydrating) {
          return {}
        }

        const result: Record<string, any> = {}
        const config = configRef.current

        // Check if we have avoidRerenders updates
        const hasEmitterUpdates = animatedTargetsRef.value !== null

        // Use emitter values if available, otherwise use React state values
        const animatedValues = hasEmitterUpdates
          ? animatedTargetsRef.value!
          : animatedStyles
        const staticValues = hasEmitterUpdates ? staticTargetsRef.value! : {}

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
          ? transformTargetsRef.value
          : animatedStyles.transform

        // Animate transform properties with validation
        if (transforms && Array.isArray(transforms)) {
          const validTransforms = (transforms as Record<string, unknown>[])
            .filter((t) => {
              // Validate transform object has at least one key with a numeric value
              if (!t || typeof t !== 'object') return false
              const keys = Object.keys(t)
              if (keys.length === 0) return false
              const value = t[keys[0]]
              return typeof value === 'number' || typeof value === 'string'
            })
            .map((t) => {
              const transformKey = Object.keys(t)[0]
              const targetValue = t[transformKey]
              const propConfig = config.propertyConfigs[transformKey] ?? config.baseConfig
              return { [transformKey]: applyAnimation(targetValue as number, propConfig) }
            })

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
