import { getEffectiveAnimation, normalizeTransition } from '@tamagui/animation-helpers'
import {
  getSplitStyles,
  hooks,
  isWeb,
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
  runOnUI,
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

const silenceAnimatedComponentDevCheck = (style: unknown) => {
  if (
    process.env.NODE_ENV !== 'development' ||
    isWeb ||
    !style ||
    typeof style !== 'object'
  ) {
    return
  }

  // react fabric's dev performance logger diffs component props and reads the
  // reanimated guard getter even when the style is on an animated component.
  Object.defineProperty(style, '_requiresAnimatedComponent', {
    configurable: true,
    enumerable: false,
    value: true,
  })
}

// =============================================================================
// Types
// =============================================================================

type ReanimatedAnimatedNumber = SharedValue<number>

type AnimationSnapshot = {
  animated: Record<string, unknown>
  statics: Record<string, unknown>
  transforms: Array<Record<string, unknown>>
  /**
   * for each animated key (transform sub-keys as `transform:key`), the value the
   * previous committed render painted for it, when one exists and is animatable.
   * the worklet animates a mapper-fresh key FROM its seed instead of snapping —
   * this is how an enterStyle value painted statically during mount becomes the
   * start point once the key turns animated. keys with no seed paint their target
   * directly (a key appearing from nothing has nothing to animate from).
   */
  seeds: Record<string, unknown>
  removedKeys: Record<string, boolean>
  removeTransform: boolean
  clearValue: '' | null
}

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

const cloneAnimationValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(cloneAnimationValue)
  }

  if (value && typeof value === 'object') {
    const next: Record<string, unknown> = {}
    for (const key in value as Record<string, unknown>) {
      next[key] = cloneAnimationValue((value as Record<string, unknown>)[key])
    }
    return next
  }

  return value
}

const cloneStyleRecord = (style: Record<string, unknown>): Record<string, unknown> => {
  const next: Record<string, unknown> = {}
  for (const key in style) {
    next[key] = cloneAnimationValue(style[key])
  }
  return next
}

const cloneTransforms = (
  transforms: Array<Record<string, unknown>>
): Array<Record<string, unknown>> => transforms.map(cloneStyleRecord)

const cloneTransitionConfig = (config: TransitionConfig): TransitionConfig => {
  return cloneAnimationValue(config) as TransitionConfig
}

const getAnimatedTransforms = (value: unknown): Array<Record<string, unknown>> => {
  if (!Array.isArray(value)) return []
  return value.filter(
    (item): item is Record<string, unknown> =>
      item !== null && typeof item === 'object' && !Array.isArray(item)
  )
}

const getAnimatedKeySet = (
  animated: Record<string, unknown>,
  transforms: Array<Record<string, unknown>>
): Set<string> => {
  const keys = new Set<string>()
  for (const key in animated) {
    if (key !== 'transform') keys.add(key)
  }
  for (const transform of transforms) {
    const key = Object.keys(transform)[0]
    if (key) keys.add(`transform:${key}`)
  }
  return keys
}

const getRemovedAnimatedKeys = (
  current: Set<string>,
  previous: Set<string>
): Record<string, boolean> => {
  const removedKeys: Record<string, boolean> = {}
  for (const key of previous) {
    if (!current.has(key)) removedKeys[key] = true
  }
  return removedKeys
}

// implicit start values for style keys that were never painted (e.g. a key
// introduced by exitStyle with no base value). most numerics default to 0.
const getImplicitDefault = (key: string): number => {
  'worklet'
  return key === 'opacity' || key === 'scale' || key === 'scaleX' || key === 'scaleY'
    ? 1
    : 0
}

const COLOR_STYLE_KEYS: Record<string, boolean> = {
  backgroundColor: true,
  borderColor: true,
  borderLeftColor: true,
  borderRightColor: true,
  borderTopColor: true,
  borderBottomColor: true,
  color: true,
}

// reanimated interpolates only color strings its own parser accepts. anything
// else falls through to its generic prefix/suffix string handler, which
// mangles the value into '<letters>NaN' — the browser silently drops that,
// native processColor throws a redbox. normalize what we can and never build
// an animation descriptor from a color value that isn't clearly parseable.
const toReanimatedColor = (value: unknown): unknown => {
  'worklet'
  if (typeof value === 'number') {
    const color = value >>> 0
    const alpha = ((color >>> 24) & 255) / 255
    const red = (color >>> 16) & 255
    const green = (color >>> 8) & 255
    const blue = color & 255
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
  }
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  if (trimmed === 'transparent') return 'rgba(0, 0, 0, 0)'
  return trimmed
}

const isInterpolatableColor = (value: unknown): boolean => {
  'worklet'
  if (typeof value !== 'string') return false
  return (
    /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value) ||
    /^(?:rgba?|hsla?|hwb)\([0-9+\-.,%/\s]+\)$/.test(value)
  )
}

const getSeeds = (
  keys: Set<string>,
  previousPainted: Record<string, unknown>
): Record<string, unknown> => {
  const seeds: Record<string, unknown> = {}
  for (const key of keys) {
    const prev = previousPainted[key]
    if (typeof prev !== 'number' && typeof prev !== 'string') continue
    if (prev === 'auto' || (typeof prev === 'string' && prev.startsWith('calc'))) {
      continue
    }
    seeds[key] = prev
  }
  return seeds
}

const createReanimatedConfig = (config: TransitionConfig): Record<string, unknown> => {
  'worklet'
  const next: Record<string, unknown> = {}
  const source = config as Record<string, unknown>

  for (const key in source) {
    if (key === 'type' || key === 'delay') continue
    const value = source[key]
    if (value !== undefined) {
      next[key] = value
    }
  }

  return next
}

/**
 * Apply animation to a value based on config, with optional completion callback
 */
const applyAnimation = (
  targetValue: number | string,
  config: TransitionConfig,
  callback?: AnimationCallback,
  seedValue?: number | string,
  validateStartAsColor = false
): number | string => {
  'worklet'
  const delay = config.delay
  const reanimatedConfig = createReanimatedConfig(config)

  let animatedValue: any
  if (config.type === 'timing') {
    animatedValue = withTiming(
      targetValue as number,
      reanimatedConfig as WithTimingConfig,
      callback
    )
  } else {
    animatedValue = withSpring(
      targetValue as number,
      reanimatedConfig as WithSpringConfig,
      callback
    )
  }

  // reanimated starts a descriptor from its per-view history for the key — the
  // key's last output value, or the descriptor's own toValue when there is
  // none (an instant snap). both are wrong for a key that turns animated with
  // a painted predecessor: history may hold a stale clear-value ('') from when
  // the key was last removed, which poisons the start value (NaN frames). the
  // wrapper substitutes the seed for whatever start value reanimated passes.
  // color history gets the same treatment only when reanimated's own parser
  // rejects it, preserving valid in-flight values during interruption.
  if (seedValue !== undefined || validateStartAsColor) {
    const innerOnStart = animatedValue.onStart
    animatedValue.onStart = (
      animation: unknown,
      value: unknown,
      timestamp: number,
      previousAnimation: unknown
    ) => {
      'worklet'
      const startValue = validateStartAsColor
        ? isInterpolatableColor(toReanimatedColor(value))
          ? toReanimatedColor(value)
          : (seedValue ?? targetValue)
        : seedValue
      innerOnStart(animation, startValue, timestamp, previousAnimation)
    }
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

  let base = cloneTransitionConfig(
    effectiveKey
      ? (animations[effectiveKey as keyof typeof animations] ??
          ({ type: 'spring' } as TransitionConfig))
      : ({ type: 'spring' } as TransitionConfig)
  )

  if (normalized.delay) {
    base = cloneTransitionConfig({ ...base, delay: normalized.delay })
  }

  if (normalized.config) {
    base = cloneTransitionConfig({ ...base, ...normalized.config })
    // infer type: 'timing' if duration is provided without spring params
    if (
      base.type !== 'timing' &&
      normalized.config.duration !== undefined &&
      normalized.config.damping === undefined &&
      normalized.config.stiffness === undefined &&
      normalized.config.mass === undefined
    ) {
      base = cloneTransitionConfig({ ...base, type: 'timing' })
    }
  }

  // build per-property configs
  const propertyConfigs: Record<string, TransitionConfig> = {}

  for (const key of styleKeys) {
    const propAnimation = normalized.properties[key]
    if (typeof propAnimation === 'string') {
      propertyConfigs[key] = cloneTransitionConfig(
        animations[propAnimation as keyof typeof animations] ?? base
      )
    } else if (propAnimation && typeof propAnimation === 'object') {
      const configType = (propAnimation as any).type
      const baseForProp = configType
        ? (animations[configType as keyof typeof animations] ?? base)
        : base
      propertyConfigs[key] = cloneTransitionConfig({
        ...baseForProp,
        ...propAnimation,
      } as TransitionConfig)
    } else {
      propertyConfigs[key] = cloneTransitionConfig(base)
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
    animations[key] = cloneTransitionConfig({
      type: 'spring',
      ...animationsConfig[key],
    }) as A[typeof key]
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
            if (config.type === 'direct') {
              sharedValue.value = next
              onFinish?.()
            } else {
              // animations must start on the ui thread in reanimated 4.x -
              // withSpring/withTiming return animation descriptors that only
              // work when assigned to a SharedValue inside the UI runtime
              const cb = onFinish
                ? (finished?: boolean) => {
                    'worklet'
                    if (finished !== false) {
                      runOnJS(onFinish)()
                    }
                  }
                : undefined

              const animationConfig = cloneTransitionConfig(config)

              if (isWeb) {
                // on web there's no UI thread - set directly
                sharedValue.value = applyAnimation(next, animationConfig, cb)
              } else {
                runOnUI((targetValue: number, animationConfig: TransitionConfig) => {
                  'worklet'
                  sharedValue.value = applyAnimation(targetValue, animationConfig, cb)
                })(next, animationConfig)
              }
            }
          },

          stop() {
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

      if (isWeb) {
        // web: must pass explicit deps (no babel plugin)
        return useAnimatedStyle(() => {
          'worklet'
          return getStyle(instance.value)
        }, [instance, getStyle])
      }

      const styleVal = useDerivedValue(() => {
        'worklet'
        return getStyle(instance.value)
      })

      const animatedStyle = useAnimatedStyle(() => {
        'worklet'
        return styleVal.value
      })

      silenceAnimatedComponentDevCheck(animatedStyle)

      return animatedStyle
    },

    useAnimatedNumbersStyle(vals, getStyle) {
      const instances = vals.map((v) => v.getInstance())

      const animatedStyle = useAnimatedStyle(
        () => {
          'worklet'
          const currentValues = instances.map((inst) => inst.value)
          return getStyle(...currentValues)
        },
        isWeb ? [getStyle, ...instances] : undefined
      )

      silenceAnimatedComponentDevCheck(animatedStyle)

      return animatedStyle
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
        onDidAnimate,
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
      const onDidAnimateRef = useRef(onDidAnimate)
      useIsomorphicLayoutEffect(() => {
        onDidAnimateRef.current = onDidAnimate
      }, [onDidAnimate])

      const didAnimateCycleIdRef = useRef(0)
      const pendingDidAnimateKeysRef = useRef<Set<string>>(new Set())
      const didAnimateCompletedRef = useRef(false)
      const isCompletingAnimationRef = useSharedValue(false)
      const didAnimateCycleIdShared = useSharedValue(0)
      const markDidAnimateKeyDone = useEvent(
        (key: string, cycleId: number, finished: boolean) => {
          if (!finished || cycleId !== didAnimateCycleIdRef.current) return
          if (didAnimateCompletedRef.current) return
          pendingDidAnimateKeysRef.current.delete(key)
          if (pendingDidAnimateKeysRef.current.size === 0) {
            didAnimateCompletedRef.current = true
            onDidAnimateRef.current?.()
          }
        }
      )

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
      const committedRenderKeysRef = useRef(new Set<string>())
      // full painted style of the last committed source (render or emitter):
      // statics + animated targets, transform sub-keys flattened as `transform:key`.
      // seeds read from it.
      const lastPaintedRef = useRef<Record<string, unknown>>({})
      // per-key first-animated values React keeps painting under the mapper —
      // see the styles memo below
      const carryRef = useRef<Record<string, unknown>>({})

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
            staticStyles[key] = cloneAnimationValue(value)
            continue
          }

          if (canAnimateProperty(key, value, animateOnly)) {
            animated[key] = cloneAnimationValue(value)
          } else {
            staticStyles[key] = cloneAnimationValue(value)
          }
        }

        // every animated key keeps its FIRST animated value in React's style for
        // as long as it stays animated. the value never changes across renders,
        // so React's per-key style diff never touches the key again and the
        // mapper's inline writes survive every commit — reanimated's Fabric
        // commit hook provides this guarantee on native, web has no equivalent.
        // during enter the carry is the enterStyle (the mapper animates over it);
        // a key appearing post-mount (a just-measured height) paints its value in
        // the same commit the mapper first sees it, a frame before the mapper's
        // first write.
        const carry = carryRef.current
        for (const key in carry) {
          if (!(key in animated)) delete carry[key]
        }
        for (const key in animated) {
          if (!(key in carry)) {
            carry[key] = cloneAnimationValue(animated[key])
          }
          staticStyles[key] = carry[key]
        }

        return { animatedStyles: animated, staticStyles }
      }, [disableAnimation, style, isDark, props.animateOnly])

      const renderSnapshot = useMemo(() => {
        const transforms = getAnimatedTransforms(animatedStyles.transform)
        const regularAnimated: Record<string, unknown> = {}
        for (const key in animatedStyles) {
          if (key !== 'transform') regularAnimated[key] = animatedStyles[key]
        }
        const keys = getAnimatedKeySet(animatedStyles, transforms)
        const removedKeys = getRemovedAnimatedKeys(keys, committedRenderKeysRef.current)
        const seeds = getSeeds(keys, lastPaintedRef.current)
        const painted: Record<string, unknown> = { ...staticStyles }
        for (const key in regularAnimated) {
          painted[key] = regularAnimated[key]
        }
        delete painted.transform
        for (const t of transforms) {
          const tKey = Object.keys(t)[0]
          if (tKey) painted[`transform:${tKey}`] = t[tKey]
        }
        return {
          value: {
            animated: cloneStyleRecord(regularAnimated),
            statics: cloneStyleRecord(staticStyles),
            transforms: cloneTransforms(transforms),
            seeds: cloneStyleRecord(seeds),
            removedKeys: { ...removedKeys },
            removeTransform: Object.keys(removedKeys).some((key) =>
              key.startsWith('transform:')
            ),
            clearValue: isWeb ? '' : null,
          } satisfies AnimationSnapshot,
          painted,
          keys,
        }
      }, [animatedStyles, staticStyles])
      const renderSnapshotRef = useSharedValue<AnimationSnapshot>({
        animated: {},
        statics: {},
        transforms: [],
        seeds: {},
        removedKeys: {},
        removeTransform: false,
        clearValue: isWeb ? '' : null,
      })
      const emitterSnapshotRef = useSharedValue<AnimationSnapshot | null>(null)
      const emitterKeysRef = useRef<Set<string> | null>(null)

      useIsomorphicLayoutEffect(() => {
        committedRenderKeysRef.current = renderSnapshot.keys
        lastPaintedRef.current = renderSnapshot.painted
      }, [renderSnapshot])

      // reconcile the emitter latch with real re-renders.
      //
      // the avoidReRenders fast path lets a pure pseudo change (hover/press/focus) push
      // styles straight to the worklet via useStyleEmitter with no React commit — it sets
      // emitterSnapshotRef. the worklet then treats `emitterSnapshotRef !== null` as a
      // permanent latch: once the emitter has fired even once, it reads its last-emitted
      // snapshot and IGNORES `animatedStyles` from every subsequent re-render. so a base
      // style that changes through React (e.g. a row's `backgroundColor` flipping with an
      // external selection store, not a hover) never reaches the screen — it stays stuck on
      // the stale emitted value until the next hover re-fires the emitter. (the "active row
      // highlight gets stuck until you hover it again" report.)
      //
      // a real re-render is the freshest source of truth for the base style, so on render we
      // drop the emitter latch and let the worklet fall back to `animatedStyles`. the one
      // exception: while a self pseudo (hover/press/focus) is active the emitted style is a
      // transient override that isn't in this render, so keep it latched — otherwise an
      // unrelated re-render while hovering would snap back to the base. `pseudoActiveRef`
      // tracks that flag straight off the emitter (which fires on every pseudo transition), so
      // the un-hover/un-press emission flips it false and the next render reclaims the style.
      // no value comparison needed; runtime media stays correct because a render re-reads live
      // media into `animatedStyles`.
      // exit overrides the pseudo exception: the exit render's style IS the
      // authoritative target, and an element that exits while hovered/focused (every
      // dialog closed by clicking a button inside it) would otherwise keep the stale
      // emitted base latched — the worklet then "animates" to values already on
      // screen, every exit-key callback completes in a frame, and AnimatePresence
      // unmounts immediately (the dialog-exit-snap). mirrored into a plain ref so the
      // emitter callback (which runs outside render) can read it.
      const pseudoActiveRef = useRef(false)
      const isExitingJSRef = useRef(false)
      isExitingJSRef.current = isExiting
      // the committed render is the worklet's source of truth whenever the emitter is not
      // latched, so every render must publish its snapshot — not just the renders that drop
      // a latch. animated keys live only in this snapshot after mount (staticStyles carries
      // them during mount only), so a render that never publishes leaves the worklet reading
      // an empty snapshot and the animated properties never reach the screen at all.
      const publishedSnapshotRef = useRef<object | null>(null)
      useIsomorphicLayoutEffect(() => {
        const droppingLatch =
          (isExiting || !pseudoActiveRef.current) && emitterSnapshotRef.value !== null
        // when the latch drops, keys the emitter owned that this render no longer has must
        // be cleared too, otherwise reanimated keeps painting the stale emitted value
        const emitterKeys = droppingLatch ? emitterKeysRef.current : null

        if (droppingLatch || publishedSnapshotRef.current !== renderSnapshot.value) {
          const removedKeys = emitterKeys
            ? {
                ...renderSnapshot.value.removedKeys,
                ...getRemovedAnimatedKeys(renderSnapshot.keys, emitterKeys),
              }
            : renderSnapshot.value.removedKeys
          renderSnapshotRef.value = {
            ...renderSnapshot.value,
            removedKeys,
            removeTransform: Object.keys(removedKeys).some((key) =>
              key.startsWith('transform:')
            ),
          }
          publishedSnapshotRef.current = renderSnapshot.value
        }

        if (droppingLatch) {
          emitterSnapshotRef.value = null
          emitterKeysRef.current = null
        }
      })

      // Build animation config with per-property overrides using normalized transition
      const { baseConfig, propertyConfigs } = useMemo(() => {
        if (isHydrating) {
          return {
            baseConfig: { type: 'timing' as const, duration: 0 },
            propertyConfigs: {} as Record<string, TransitionConfig>,
          }
        }

        // use effectiveTransition (createComponent's single source of truth) so a
        // platform-pseudo component with no declared transition resolves its BASE
        // config to instant ('0ms') too — not just its pseudo flips. otherwise base
        // style changes on the driver path animate with the default spring and a
        // hover-out / base color change visibly lingers (looks "stuck").
        return buildTransitionConfig(
          effectiveTransition,
          animations,
          animationState,
          getStyleKeys(animatedStyles)
        )
      }, [isHydrating, effectiveTransition, animatedStyles, animationState])

      // Store config in SharedValue for worklet access (concurrent-safe)
      // Using useEffect to avoid writing to shared value during render
      const configRef = useSharedValue({
        baseConfig,
        propertyConfigs,
        disableAnimation,
        isHydrating,
      })

      useIsomorphicLayoutEffect(() => {
        configRef.value = {
          baseConfig,
          propertyConfigs,
          disableAnimation,
          isHydrating,
        }
      }, [baseConfig, propertyConfigs, disableAnimation, isHydrating])

      // =========================================================================
      // avoidRerenders: register style emitter callback
      // when hover/press/etc state changes, this is called instead of re-rendering
      // =========================================================================
      useStyleEmitter?.(
        (nextStyle: Record<string, unknown>, effectiveTransition, pseudoActive) => {
          // while exiting, the exit render owns the style — a pseudo flip mid-exit
          // (hover-out as the element fades under the cursor) must not re-latch the
          // base style over the in-flight exit targets.
          if (isExitingJSRef.current) return
          // track whether a self pseudo is active so the render-time layout effect knows whether
          // this emitter snapshot is a transient override to keep latched or a base it can drop.
          pseudoActiveRef.current = pseudoActive === true
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
          configRef.value = {
            baseConfig: newBase,
            propertyConfigs: newPropertyConfigs,
            disableAnimation: configRef.value.disableAnimation,
            isHydrating: configRef.value.isHydrating,
          }

          for (const key in nextStyle) {
            const rawValue = nextStyle[key]
            const value = resolveDynamicValue(rawValue, isDark)

            if (value == undefined) continue

            if (configRef.value.disableAnimation) {
              statics[key] = cloneAnimationValue(value)
              continue
            }

            if (key === 'transform' && Array.isArray(value)) {
              for (const t of value as Record<string, unknown>[]) {
                if (t && typeof t === 'object') {
                  const tKey = Object.keys(t)[0]
                  const tVal = t[tKey]
                  if (typeof tVal === 'number' || typeof tVal === 'string') {
                    transforms.push(cloneAnimationValue(t) as Record<string, unknown>)
                  }
                }
              }
              continue
            }

            if (canAnimateProperty(key, value, animateOnly)) {
              animated[key] = cloneAnimationValue(value)
            } else {
              statics[key] = cloneAnimationValue(value)
            }
          }

          const keys = getAnimatedKeySet(animated, transforms)
          const previousKeys = emitterKeysRef.current ?? committedRenderKeysRef.current
          const removedKeys = getRemovedAnimatedKeys(keys, previousKeys)
          const seeds = getSeeds(keys, lastPaintedRef.current)
          emitterSnapshotRef.value = {
            animated: cloneStyleRecord(animated),
            statics: cloneStyleRecord(statics),
            transforms: cloneTransforms(transforms),
            seeds: cloneStyleRecord(seeds),
            removedKeys: { ...removedKeys },
            removeTransform: Object.keys(removedKeys).some((key) =>
              key.startsWith('transform:')
            ),
            clearValue: isWeb ? '' : null,
          }
          emitterKeysRef.current = keys
          const painted: Record<string, unknown> = { ...statics, ...animated }
          delete painted.transform
          for (const t of transforms) {
            const tKey = Object.keys(t)[0]
            if (tKey) painted[`transform:${tKey}`] = t[tKey]
          }
          lastPaintedRef.current = painted

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
        }
      )

      // Compute and register exit keys synchronously during render to avoid race conditions
      // This must happen BEFORE useAnimatedStyle runs so callbacks have a populated set
      const exitKeysRegistered = useRef(false)
      if (justStartedExiting && sendExitComplete) {
        const exitKeys: string[] = []
        const animateOnly = props.animateOnly as string[] | undefined

        // regular animated properties. mirror the worklet: during exit every
        // fresh key with a seed or a numeric target (exitStyle-introduced keys
        // animate from their implicit default) gates completion; only fresh
        // non-numeric keys with no seed paint directly and are excluded.
        const snapshotSeeds = renderSnapshot.value.seeds
        for (const key in animatedStyles) {
          if (key === 'transform') continue
          // mirror the worklet: color seeds/targets the worklet refuses to
          // interpolate paint plain and must not gate exit completion
          const hasUsableSeed =
            key in snapshotSeeds &&
            (!COLOR_STYLE_KEYS[key] ||
              isInterpolatableColor(toReanimatedColor(snapshotSeeds[key])))
          const paintsDirectly =
            (!committedRenderKeysRef.current.has(key) &&
              !hasUsableSeed &&
              typeof animatedStyles[key] !== 'number') ||
            (COLOR_STYLE_KEYS[key] &&
              !isInterpolatableColor(toReanimatedColor(animatedStyles[key])))
          if (
            !paintsDirectly &&
            canAnimateProperty(key, animatedStyles[key], animateOnly)
          ) {
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
              const exitKey = `transform:${tKey}`
              const paintsDirectly =
                !committedRenderKeysRef.current.has(exitKey) &&
                !(exitKey in renderSnapshot.value.seeds) &&
                typeof t[tKey] !== 'number'
              if (!paintsDirectly) {
                exitKeys.push(exitKey)
              }
            }
          }
        }

        // register keys for this cycle
        pendingExitKeysRef.current = new Set(exitKeys)
        exitKeysRegistered.current = exitKeys.length > 0
      }

      // onDidAnimate is an internal completion hook used by components that
      // need to retain content through an in-place style transition. register
      // the exact keys that can animate before publishing the cycle to the
      // worklet; shared values are only written from the layout effect, never
      // from the mapper that reads them.
      const previousDidAnimateStyleRef = useRef<string | null>(null)
      const didAnimateStyle = onDidAnimate ? JSON.stringify(style) : null
      const previousDidAnimateStyle = previousDidAnimateStyleRef.current
      const shouldRegisterDidAnimate =
        didAnimateStyle !== null &&
        previousDidAnimateStyle !== null &&
        previousDidAnimateStyle !== didAnimateStyle &&
        !isExiting &&
        !isEntering &&
        !justFinishedEntering
      const didAnimateKeys: string[] = []
      if (shouldRegisterDidAnimate) {
        const snapshotSeeds = renderSnapshot.value.seeds
        const animateOnly = props.animateOnly as string[] | undefined

        for (const key in animatedStyles) {
          if (key === 'transform') continue
          const hasUsableSeed =
            key in snapshotSeeds &&
            (!COLOR_STYLE_KEYS[key] ||
              isInterpolatableColor(toReanimatedColor(snapshotSeeds[key])))
          const canStart = committedRenderKeysRef.current.has(key) || hasUsableSeed
          if (
            canStart &&
            (!COLOR_STYLE_KEYS[key] ||
              isInterpolatableColor(toReanimatedColor(animatedStyles[key]))) &&
            canAnimateProperty(key, animatedStyles[key], animateOnly)
          ) {
            didAnimateKeys.push(key)
          }
        }

        const transforms = animatedStyles.transform
        if (transforms && Array.isArray(transforms)) {
          for (const transform of transforms) {
            if (!transform) continue
            const transformKey = Object.keys(transform)[0]
            if (!transformKey) continue
            if (animateOnly && !animateOnly.includes(transformKey)) continue
            const key = `transform:${transformKey}`
            if (committedRenderKeysRef.current.has(key) || key in snapshotSeeds) {
              didAnimateKeys.push(key)
            }
          }
        }
      }

      useIsomorphicLayoutEffect(() => {
        if (didAnimateStyle === null) {
          previousDidAnimateStyleRef.current = null
          isCompletingAnimationRef.value = false
          return
        }

        // only a committed render may advance the authoritative cycle. the
        // captured previous value prevents StrictMode's repeated effect from
        // registering the same transition twice.
        const previousStyleStillCurrent =
          previousDidAnimateStyleRef.current === previousDidAnimateStyle
        previousDidAnimateStyleRef.current = didAnimateStyle
        if (!shouldRegisterDidAnimate || !previousStyleStillCurrent) return

        const cycleId = ++didAnimateCycleIdRef.current
        pendingDidAnimateKeysRef.current = new Set(didAnimateKeys)
        didAnimateCompletedRef.current = didAnimateKeys.length === 0
        isCompletingAnimationRef.value = didAnimateKeys.length > 0
        didAnimateCycleIdShared.value = cycleId
        if (didAnimateKeys.length === 0) {
          onDidAnimateRef.current?.()
        }
      }, [didAnimateStyle, shouldRegisterDidAnimate])

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

      // the worklet's own record of which animated keys it has emitted (mirrors
      // reanimated's per-view style history, which resets whenever a key leaves
      // the output). a key not in here is fresh to the mapper no matter what
      // React has committed — several renders can coalesce into one mapper run.
      // mutated in place from the worklet; never watched, so writes don't
      // retrigger the mapper.
      const mapperStateRef = useSharedValue<{ emitted: Record<string, boolean> }>({
        emitted: {},
      })
      // Create animated style
      const animatedStyle = useAnimatedStyle(
        () => {
          'worklet'

          const mapperState = mapperStateRef.value
          const config = configRef.value
          if (config.disableAnimation || config.isHydrating) {
            // the empty return wipes reanimated's per-key history, so ours
            // resets with it
            mapperState.emitted = {}
            return {}
          }

          const previouslyEmitted = mapperState.emitted
          const emitted: Record<string, boolean> = {}

          const result: Record<string, any> = {}

          // Check if we have avoidRerenders updates from useStyleEmitter
          const emitterSnapshot = emitterSnapshotRef.value
          const snapshot = emitterSnapshot ?? renderSnapshotRef.value

          // Use emitter values if available, otherwise use the committed render snapshot.
          // statics must fall back to the render's staticStyles (not {}): once an
          // emitter snapshot has applied static keys, reanimated never unsets
          // them, so after the latch drops a stale emitted value (e.g. a border
          // color that missed animateOnly) would keep painting over the fresh
          // style prop forever
          const animatedValues = snapshot.animated
          const staticValues = snapshot.statics

          // read exit state from shared values
          const currentlyExiting = isExitingRef.value
          const currentCycleId = exitCycleIdShared.value
          const currentlyCompletingAnimation = isCompletingAnimationRef.value
          const currentDidAnimateCycleId = didAnimateCycleIdShared.value

          // Include static values from emitter (for hover/press style changes)
          for (const key in staticValues) {
            result[key] = COLOR_STYLE_KEYS[key]
              ? toReanimatedColor(staticValues[key])
              : staticValues[key]
          }
          for (const key in snapshot.removedKeys) {
            if (!key.startsWith('transform:') && !(key in staticValues)) {
              result[key] = snapshot.clearValue
            }
          }

          // Animate regular properties
          for (const key in animatedValues) {
            if (key === 'transform') continue

            let targetValue = animatedValues[key]
            let seedValue: unknown =
              key in snapshot.seeds ? snapshot.seeds[key] : undefined
            if (COLOR_STYLE_KEYS[key]) {
              targetValue = toReanimatedColor(targetValue)
              seedValue = toReanimatedColor(seedValue)
              if (!isInterpolatableColor(targetValue)) {
                // interpolating this would corrupt it into '<letters>NaN'
                // (native processColor throws) — paint it plain instead
                console.warn(
                  '[animations-reanimated] non-interpolatable color painted plain:',
                  key,
                  JSON.stringify(animatedValues[key])
                )
                emitted[key] = true
                result[key] = targetValue
                continue
              }
              if (seedValue !== undefined && !isInterpolatableColor(seedValue)) {
                seedValue = undefined
              }
            }
            const propConfig = config.propertyConfigs[key] ?? config.baseConfig

            const shouldAnimate =
              previouslyEmitted[key] ||
              seedValue !== undefined ||
              (currentlyExiting && typeof targetValue === 'number')

            // create callback for exit and component animation completion tracking
            let callback: AnimationCallback | undefined
            if (shouldAnimate && currentlyExiting) {
              const capturedKey = key
              const capturedCycleId = currentCycleId
              callback = (finished) => {
                'worklet'
                runOnJS(markExitKeyDone)(capturedKey, capturedCycleId, finished ?? false)
              }
            } else if (shouldAnimate && currentlyCompletingAnimation) {
              const capturedKey = key
              const capturedCycleId = currentDidAnimateCycleId
              callback = (finished) => {
                'worklet'
                runOnJS(markDidAnimateKeyDone)(
                  capturedKey,
                  capturedCycleId,
                  finished ?? false
                )
              }
            }

            emitted[key] = true
            if (previouslyEmitted[key]) {
              result[key] = applyAnimation(
                targetValue as number,
                propConfig,
                callback,
                undefined,
                !!COLOR_STYLE_KEYS[key]
              )
            } else if (seedValue !== undefined) {
              result[key] = applyAnimation(
                targetValue as number,
                propConfig,
                callback,
                seedValue as number | string,
                !!COLOR_STYLE_KEYS[key]
              )
            } else if (currentlyExiting && typeof targetValue === 'number') {
              // a key introduced by exitStyle with no painted predecessor must
              // still animate over the exit (and gate exit completion) — start
              // it from the property's implicit default
              result[key] = applyAnimation(
                targetValue,
                propConfig,
                callback,
                getImplicitDefault(key)
              )
            } else {
              result[key] = targetValue
            }
          }

          // Handle transforms
          const transforms = snapshot.transforms

          // Animate transform properties with validation
          if (transforms.length > 0 || snapshot.removeTransform) {
            const validTransforms: Record<string, unknown>[] = []

            for (const t of transforms) {
              if (!t) continue
              const keys = Object.keys(t)
              if (keys.length === 0) continue
              const value = t[keys[0]]
              if (typeof value === 'number' || typeof value === 'string') {
                const transformKey = Object.keys(t)[0]
                const targetValue = t[transformKey]
                const propConfig =
                  config.propertyConfigs[transformKey] ?? config.baseConfig

                const subKey = `transform:${transformKey}`
                const shouldAnimate =
                  previouslyEmitted[subKey] ||
                  subKey in snapshot.seeds ||
                  (currentlyExiting && typeof targetValue === 'number')

                // create callback for exit and component animation completion tracking
                let callback: AnimationCallback | undefined
                if (shouldAnimate && currentlyExiting) {
                  const capturedKey = subKey
                  const capturedCycleId = currentCycleId
                  callback = (finished) => {
                    'worklet'
                    runOnJS(markExitKeyDone)(
                      capturedKey,
                      capturedCycleId,
                      finished ?? false
                    )
                  }
                } else if (shouldAnimate && currentlyCompletingAnimation) {
                  const capturedKey = subKey
                  const capturedCycleId = currentDidAnimateCycleId
                  callback = (finished) => {
                    'worklet'
                    runOnJS(markDidAnimateKeyDone)(
                      capturedKey,
                      capturedCycleId,
                      finished ?? false
                    )
                  }
                }

                emitted[subKey] = true
                validTransforms.push({
                  [transformKey]: previouslyEmitted[subKey]
                    ? applyAnimation(targetValue as number, propConfig, callback)
                    : subKey in snapshot.seeds
                      ? applyAnimation(
                          targetValue as number,
                          propConfig,
                          callback,
                          snapshot.seeds[subKey] as number | string
                        )
                      : currentlyExiting && typeof targetValue === 'number'
                        ? applyAnimation(
                            targetValue,
                            propConfig,
                            callback,
                            getImplicitDefault(transformKey)
                          )
                        : targetValue,
                })
              }
            }

            if (validTransforms.length > 0 || !('transform' in staticValues)) {
              result.transform = validTransforms
            }
          }

          mapperState.emitted = emitted

          return result
        },
        isWeb
          ? [
              // pass SharedValues so the stable mapper watches them on web (no babel plugin)
              renderSnapshotRef,
              emitterSnapshotRef,
              configRef,
              isExitingRef,
              exitCycleIdShared,
              markExitKeyDone,
              isCompletingAnimationRef,
              didAnimateCycleIdShared,
              markDidAnimateKeyDone,
            ]
          : undefined
      )

      silenceAnimatedComponentDevCheck(animatedStyle)

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

      // staticStyles carries animated keys only while mounting or on a key's
      // first post-mount appearance; after that the mapper owns them and the
      // commit bridge above keeps React commits from wiping its inline writes.
      return {
        style: [staticStyles, animatedStyle],
      }
    },
  }
}
