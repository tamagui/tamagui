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
  createRefComponent,
} from '@tamagui/core'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import normalizeColor from '@react-native/normalize-colors'
import React, { useMemo, useRef } from 'react'
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
  gatedKeys: Record<string, boolean>
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
const getImplicitDefault = (
  key: string,
  targetValue: number | string
): number | string => {
  'worklet'
  const value =
    key === 'opacity' || key === 'scale' || key === 'scaleX' || key === 'scaleY' ? 1 : 0
  if (typeof targetValue !== 'string') return value

  // reanimated derives a string animation's suffix from its start value. keep
  // units on implicit starts so fresh `50%` and `90deg` keys interpolate.
  let suffixIndex = 0
  while (suffixIndex < targetValue.length) {
    const character = targetValue[suffixIndex]
    const code = character.charCodeAt(0)
    if (
      (code >= 48 && code <= 57) ||
      character === '.' ||
      character === '-' ||
      character === '+'
    ) {
      suffixIndex++
    } else {
      break
    }
  }
  return suffixIndex > 0 ? `${value}${targetValue.slice(suffixIndex)}` : value
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

// reanimated can pass either its rgba output or a processed numeric color back
// as animation history. snapshot targets are normalized on the JS side below;
// this worklet conversion exists only to validate that in-flight history.
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

const isReanimatedColorHistory = (value: unknown): boolean => {
  'worklet'
  const normalized = toReanimatedColor(value)
  return typeof normalized === 'string' && normalized.startsWith('rgba(')
}

const normalizeAnimationColor = (value: unknown): string | undefined => {
  if (typeof value === 'number') {
    return toReanimatedColor(value) as string
  }
  if (typeof value !== 'string') return

  const color = normalizeColor(value)
  if (color == null) return
  const red = Math.round((color & 0xff000000) >>> 24)
  const green = Math.round((color & 0x00ff0000) >>> 16)
  const blue = Math.round((color & 0x0000ff00) >>> 8)
  const alpha = (color & 0x000000ff) / 255
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

const buildSnapshot = (
  animated: Record<string, unknown>,
  statics: Record<string, unknown>,
  transforms: Array<Record<string, unknown>>,
  previousKeys: Set<string>,
  lastPainted: Record<string, unknown>
) => {
  const snapshotAnimated: Record<string, unknown> = {}
  const snapshotStatics = cloneStyleRecord(statics)

  for (const key in snapshotStatics) {
    if (!COLOR_STYLE_KEYS[key]) continue
    const normalized = normalizeAnimationColor(snapshotStatics[key])
    if (normalized !== undefined) snapshotStatics[key] = normalized
  }

  for (const key in animated) {
    if (key === 'transform') continue
    const value = animated[key]
    if (COLOR_STYLE_KEYS[key]) {
      const normalized = normalizeAnimationColor(value)
      if (normalized === undefined) {
        // invalid colors must paint plainly. creating a descriptor makes
        // reanimated's string interpolator emit '<letters>NaN'.
        snapshotStatics[key] = cloneAnimationValue(value)
        continue
      }
      snapshotAnimated[key] = normalized
    } else {
      snapshotAnimated[key] = cloneAnimationValue(value)
    }
  }

  const snapshotTransforms = transforms.map(cloneStyleRecord)
  const keys = new Set(Object.keys(snapshotAnimated))
  for (const transform of snapshotTransforms) {
    const key = Object.keys(transform)[0]
    const value = key ? transform[key] : undefined
    if (key && (typeof value === 'number' || typeof value === 'string')) {
      keys.add(`transform:${key}`)
    }
  }

  const seeds: Record<string, unknown> = {}
  for (const key of keys) {
    let value = lastPainted[key]
    if (typeof value !== 'number' && typeof value !== 'string') continue
    if (value === 'auto' || (typeof value === 'string' && value.startsWith('calc'))) {
      continue
    }
    if (COLOR_STYLE_KEYS[key]) value = normalizeAnimationColor(value)
    if (value !== undefined) seeds[key] = value
  }

  const gatedKeys: Record<string, boolean> = {}
  for (const key of keys) gatedKeys[key] = true

  const removedKeys = getRemovedAnimatedKeys(keys, previousKeys)
  const painted: Record<string, unknown> = {
    ...snapshotStatics,
    ...snapshotAnimated,
  }
  const staticTransforms = getAnimatedTransforms(snapshotStatics.transform)
  delete painted.transform
  for (const transform of staticTransforms) {
    const key = Object.keys(transform)[0]
    if (key) painted[`transform:${key}`] = transform[key]
  }
  for (const transform of snapshotTransforms) {
    const key = Object.keys(transform)[0]
    if (key) painted[`transform:${key}`] = transform[key]
  }

  return {
    value: {
      animated: snapshotAnimated,
      statics: snapshotStatics,
      transforms: snapshotTransforms,
      gatedKeys,
      seeds,
      removedKeys,
      removeTransform: Object.keys(removedKeys).some((key) =>
        key.startsWith('transform:')
      ),
      clearValue: isWeb ? '' : null,
    },
    painted,
    keys,
  }
}

const getGatedKeys = (snapshot: AnimationSnapshot): string[] =>
  Object.keys(snapshot.gatedKeys)

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
        ? isReanimatedColorHistory(value)
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

const animateSnapshotValue = (
  key: string,
  implicitKey: string,
  targetValue: number | string,
  config: TransitionConfig,
  previouslyEmitted: boolean,
  seedValue: unknown,
  gated: boolean,
  currentlyExiting: boolean,
  exitCycleId: number,
  currentlyCompletingEnter: boolean,
  enterCycleId: number,
  currentlyCompletingUpdate: boolean,
  updateCycleId: number,
  markExitKeyDone: (key: string, cycleId: number, finished: boolean) => void,
  markEnterKeyDone: (key: string, cycleId: number) => void,
  markUpdateKeyDone: (key: string, cycleId: number, finished: boolean) => void,
  validateStartAsColor = false
): number | string => {
  'worklet'

  const cycleGated =
    gated && (currentlyExiting || currentlyCompletingEnter || currentlyCompletingUpdate)
  if (!previouslyEmitted && seedValue === undefined && !cycleGated) {
    return targetValue
  }

  let callback: AnimationCallback | undefined
  if (gated && currentlyExiting) {
    callback = (finished) => {
      'worklet'
      runOnJS(markExitKeyDone)(key, exitCycleId, finished ?? false)
    }
  } else if (gated && currentlyCompletingEnter) {
    callback = () => {
      'worklet'
      runOnJS(markEnterKeyDone)(key, enterCycleId)
    }
  } else if (gated && currentlyCompletingUpdate) {
    callback = (finished) => {
      'worklet'
      runOnJS(markUpdateKeyDone)(key, updateCycleId, finished ?? false)
    }
  }

  return applyAnimation(
    targetValue,
    config,
    callback,
    previouslyEmitted
      ? undefined
      : ((seedValue ?? getImplicitDefault(implicitKey, targetValue)) as number | string),
    validateStartAsColor
  )
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

const splitAnimationStyles = (
  style: Record<string, unknown>,
  isDark: boolean,
  disableAnimation: boolean,
  animateOnly?: string[]
) => {
  const animated: Record<string, unknown> = {}
  const statics: Record<string, unknown> = {}

  for (const key in style) {
    const value = resolveDynamicValue(style[key], isDark)
    if (value === undefined) continue

    if (!disableAnimation && canAnimateProperty(key, value, animateOnly)) {
      animated[key] = cloneAnimationValue(value)
    } else {
      statics[key] = cloneAnimationValue(value)
    }
  }

  return { animated, statics }
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
    createRefComponent((propsIn: any, ref) => {
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
      const { nativeID, ...webProps } = transformedProps ?? viewProps

      return <Element {...webProps} ref={composedRefs} />
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
        onTransition,
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
      const onTransitionRef = useRef(onTransition)
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
      const enterStartedRef = useRef(false)
      const exitStartedRef = useRef(false)
      const updateStartedRef = useRef(false)
      const isExitingJSRef = useRef(false)
      isExitingJSRef.current = isExiting

      // =========================================================================
      // Update cycle state: an in-place style transition while mounted (not
      // enter/exit). drives the onTransition 'update' lifecycle events and the
      // components (e.g. accordion HeightAnimator) that retain content through
      // an in-place transition.
      // =========================================================================
      const updateCycleIdRef = useRef(0)
      const pendingUpdateKeysRef = useRef<Set<string>>(new Set())
      const updateCompletedRef = useRef(false)
      const isCompletingUpdateRef = useSharedValue(false)
      const updateCycleIdShared = useSharedValue(0)
      const markUpdateKeyDone = useEvent(
        (key: string, cycleId: number, finished: boolean) => {
          if (!finished || cycleId !== updateCycleIdRef.current) return
          if (updateCompletedRef.current) return
          pendingUpdateKeysRef.current.delete(key)
          if (pendingUpdateKeysRef.current.size === 0) {
            updateCompletedRef.current = true
            isCompletingUpdateRef.value = false
            if (updateStartedRef.current) {
              updateStartedRef.current = false
              emit('end', 'update', true)
            }
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
            if (exitStartedRef.current) {
              exitStartedRef.current = false
              // exit 'end' fires immediately before presence safeToRemove
              emit('end', 'exit', true)
            }
            sendExitComplete?.()
          }
        }
      )

      // =========================================================================
      // Enter cycle state for the onTransition enter 'end' event
      // =========================================================================
      const enterCycleIdRef = useRef(0)
      const pendingEnterKeysRef = useRef<Set<string>>(new Set())
      const enterCompletedRef = useRef(false)

      const markEnterKeyDone = useEvent((key: string, cycleId: number) => {
        if (cycleId !== enterCycleIdRef.current) return
        if (enterCompletedRef.current) return
        if (isExitingJSRef.current) return

        pendingEnterKeysRef.current.delete(key)

        if (pendingEnterKeysRef.current.size === 0) {
          enterCompletedRef.current = true
          if (enterStartedRef.current) {
            enterStartedRef.current = false
            emit('end', 'enter', true)
          }
        }
      })

      // SharedValue to pass exit state into worklet
      const isExitingRef = useSharedValue(isExiting)
      const exitCycleIdShared = useSharedValue(exitCycleIdRef.current)
      const isCompletingEnterRef = useSharedValue(false)
      const enterCycleIdShared = useSharedValue(enterCycleIdRef.current)

      // start new exit cycle only on transition INTO exiting (not every render while exiting)
      if (justStartedExiting) {
        exitCycleIdRef.current++
        exitCompletedRef.current = false
        pendingExitKeysRef.current.clear()
        enterCycleIdRef.current++
        pendingEnterKeysRef.current.clear()
        updateCycleIdRef.current++
        pendingUpdateKeysRef.current.clear()
        updateCompletedRef.current = true
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
        isCompletingEnterRef.value =
          !isExiting && justFinishedEntering && Boolean(onTransitionRef.current)
        enterCycleIdShared.value = enterCycleIdRef.current
        if (justStartedExiting) {
          isCompletingUpdateRef.value = false
          updateCycleIdShared.value = updateCycleIdRef.current
        }
      }, [
        isExiting,
        justFinishedEntering,
        exitCycleIdRef.current,
        enterCycleIdRef.current,
        justStartedExiting,
      ])

      // exit interrupted by a re-enter: report the exit as finished:false
      useIsomorphicLayoutEffect(() => {
        if (justStoppedExiting && exitStartedRef.current && !exitCompletedRef.current) {
          exitStartedRef.current = false
          emit('end', 'exit', false)
        }
      }, [justStoppedExiting])

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
      const { animatedStyles, staticStyles, nextCarry } = useMemo(() => {
        const animateOnly = props.animateOnly as string[] | undefined
        const { animated, statics } = splitAnimationStyles(
          style as Record<string, unknown>,
          isDark,
          disableAnimation,
          animateOnly
        )

        // every animated key keeps its FIRST animated value in React's style for
        // as long as it stays animated. the value never changes across renders,
        // so React's per-key style diff never touches the key again and the
        // mapper's inline writes survive every commit — reanimated's Fabric
        // commit hook provides this guarantee on native, web has no equivalent.
        // during enter the carry is the enterStyle (the mapper animates over it);
        // a key appearing post-mount (a just-measured height) paints its value in
        // the same commit the mapper first sees it, a frame before the mapper's
        // first write.
        // derive from committed state. mutating carryRef during render leaks
        // abandoned concurrent renders into later commits.
        const nextCarry = cloneStyleRecord(carryRef.current)
        for (const key in nextCarry) {
          if (!(key in animated)) delete nextCarry[key]
        }
        for (const key in animated) {
          if (!(key in nextCarry)) {
            nextCarry[key] = cloneAnimationValue(animated[key])
          }
          statics[key] = nextCarry[key]
        }

        return { animatedStyles: animated, staticStyles: statics, nextCarry }
      }, [disableAnimation, style, isDark, props.animateOnly])

      const renderSnapshot = useMemo(
        () =>
          buildSnapshot(
            animatedStyles,
            staticStyles,
            getAnimatedTransforms(animatedStyles.transform),
            committedRenderKeysRef.current,
            lastPaintedRef.current
          ),
        [animatedStyles, staticStyles]
      )
      const renderSnapshotRef = useSharedValue<AnimationSnapshot>({
        animated: {},
        statics: {},
        transforms: [],
        gatedKeys: {},
        seeds: {},
        removedKeys: {},
        removeTransform: false,
        clearValue: isWeb ? '' : null,
      })
      const emitterSnapshotRef = useSharedValue<AnimationSnapshot | null>(null)
      const emitterKeysRef = useRef<Set<string> | null>(null)

      useIsomorphicLayoutEffect(() => {
        carryRef.current = nextCarry
        committedRenderKeysRef.current = renderSnapshot.keys
        lastPaintedRef.current = renderSnapshot.painted
      }, [nextCarry, renderSnapshot])

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

          const previousKeys = emitterKeysRef.current ?? committedRenderKeysRef.current
          const { animated, statics } = splitAnimationStyles(
            nextStyle,
            isDark,
            configRef.value.disableAnimation,
            animateOnly
          )
          const snapshot = buildSnapshot(
            animated,
            statics,
            getAnimatedTransforms(animated.transform),
            previousKeys,
            lastPaintedRef.current
          )
          emitterSnapshotRef.value = snapshot.value
          emitterKeysRef.current = snapshot.keys
          lastPaintedRef.current = snapshot.painted

          if (
            process.env.NODE_ENV === 'development' &&
            props.debug &&
            props.debug !== 'profile'
          ) {
            console.info('[animations-reanimated] useStyleEmitter update', {
              animated,
              statics,
              transforms: snapshot.value.transforms,
            })
          }
        }
      )

      // Compute and register exit keys synchronously during render to avoid race conditions
      // This must happen BEFORE useAnimatedStyle runs so callbacks have a populated set
      const exitKeysRegistered = useRef(false)
      const enterKeysRegistered = useRef(false)

      if (!isExiting && justFinishedEntering && onTransition) {
        const enterKeys = getGatedKeys(renderSnapshot.value)
        enterCycleIdRef.current++
        enterCompletedRef.current = false
        pendingEnterKeysRef.current = new Set(enterKeys)
        enterKeysRegistered.current = enterKeys.length > 0
      }

      if (justStartedExiting && sendExitComplete) {
        const exitKeys = getGatedKeys(renderSnapshot.value)
        pendingExitKeysRef.current = new Set(exitKeys)
        exitKeysRegistered.current = exitKeys.length > 0
      }

      // update cycle: a genuine in-place style change while mounted (not
      // entering or exiting). register the exact keys that can animate before
      // publishing the cycle to the worklet; shared values are only written
      // from the layout effect, never from the mapper that reads them.
      const previousUpdateStyleRef = useRef<string | null>(null)
      const updateStyle = onTransition ? JSON.stringify(style) : null
      const previousUpdateStyle = previousUpdateStyleRef.current
      const shouldRegisterUpdate =
        updateStyle !== null &&
        previousUpdateStyle !== null &&
        previousUpdateStyle !== updateStyle &&
        !isExiting &&
        !isEntering &&
        !justFinishedEntering
      const updateKeys = shouldRegisterUpdate ? getGatedKeys(renderSnapshot.value) : []

      useIsomorphicLayoutEffect(() => {
        if (updateStyle === null) {
          previousUpdateStyleRef.current = null
          isCompletingUpdateRef.value = false
          return
        }

        // only a committed render may advance the authoritative cycle. the
        // captured previous value prevents StrictMode's repeated effect from
        // registering the same transition twice.
        const previousStyleStillCurrent =
          previousUpdateStyleRef.current === previousUpdateStyle
        previousUpdateStyleRef.current = updateStyle
        if (!shouldRegisterUpdate || !previousStyleStillCurrent) return

        const cycleId = ++updateCycleIdRef.current
        pendingUpdateKeysRef.current = new Set(updateKeys)
        updateCompletedRef.current = updateKeys.length === 0
        isCompletingUpdateRef.value = updateKeys.length > 0
        updateCycleIdShared.value = cycleId

        // a superseded in-flight update reports finished:false before the new
        // cycle starts; a zero-key cycle reports an immediate start/end pair
        if (updateStartedRef.current) {
          emit('end', 'update', false)
        }
        updateStartedRef.current = true
        emit('start', 'update')
        if (updateKeys.length === 0) {
          updateStartedRef.current = false
          emit('end', 'update', true)
        }
      }, [updateStyle, shouldRegisterUpdate])

      // handle zero-animation case in effect (after render commit)
      React.useEffect(() => {
        if (!justStartedExiting || !sendExitComplete) return

        // enter or update still in flight when exit begins is reported as finished:false
        if (enterStartedRef.current) {
          enterStartedRef.current = false
          emit('end', 'enter', false)
        }
        if (updateStartedRef.current) {
          updateStartedRef.current = false
          emit('end', 'update', false)
        }

        // emit exit start once per exit cycle
        if (onTransitionRef.current && !exitStartedRef.current) {
          exitStartedRef.current = true
          emit('start', 'exit')
        }

        // if no keys were registered, complete immediately
        if (!exitKeysRegistered.current && pendingExitKeysRef.current.size === 0) {
          if (!exitCompletedRef.current) {
            exitCompletedRef.current = true
            if (exitStartedRef.current) {
              exitStartedRef.current = false
              emit('end', 'exit', true)
            }
            sendExitComplete()
          }
        }
      }, [justStartedExiting, sendExitComplete])

      React.useEffect(() => {
        if (isExiting || !justFinishedEntering || !onTransition) return

        // emit enter start once per enter cycle
        if (!enterStartedRef.current) {
          enterStartedRef.current = true
          emit('start', 'enter')
        }

        if (!enterKeysRegistered.current && pendingEnterKeysRef.current.size === 0) {
          if (!enterCompletedRef.current) {
            enterCompletedRef.current = true
            if (enterStartedRef.current) {
              enterStartedRef.current = false
              emit('end', 'enter', true)
            }
          }
        }
      }, [isExiting, justFinishedEntering, onTransition])

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

          // read lifecycle state from shared values
          const currentlyExiting = isExitingRef.value
          const currentCycleId = exitCycleIdShared.value
          const currentlyCompletingEnter = isCompletingEnterRef.value
          const currentEnterCycleId = enterCycleIdShared.value
          const currentlyCompletingUpdate = isCompletingUpdateRef.value
          const currentUpdateCycleId = updateCycleIdShared.value

          // Include static values from emitter (for hover/press style changes)
          for (const key in staticValues) {
            result[key] = staticValues[key]
          }
          for (const key in snapshot.removedKeys) {
            if (!key.startsWith('transform:') && !(key in staticValues)) {
              result[key] = snapshot.clearValue
            }
          }

          // Animate regular properties
          for (const key in animatedValues) {
            if (key === 'transform') continue

            const targetValue = animatedValues[key]
            emitted[key] = true
            if (typeof targetValue !== 'number' && typeof targetValue !== 'string') {
              result[key] = targetValue
              continue
            }
            result[key] = animateSnapshotValue(
              key,
              key,
              targetValue,
              config.propertyConfigs[key] ?? config.baseConfig,
              !!previouslyEmitted[key],
              snapshot.seeds[key],
              !!snapshot.gatedKeys[key],
              currentlyExiting,
              currentCycleId,
              currentlyCompletingEnter,
              currentEnterCycleId,
              currentlyCompletingUpdate,
              currentUpdateCycleId,
              markExitKeyDone,
              markEnterKeyDone,
              markUpdateKeyDone,
              !!COLOR_STYLE_KEYS[key]
            )
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
              const transformKey = keys[0]
              const value = t[transformKey]
              if (typeof value === 'number' || typeof value === 'string') {
                const propConfig =
                  config.propertyConfigs[transformKey] ?? config.baseConfig

                const subKey = `transform:${transformKey}`
                emitted[subKey] = true
                validTransforms.push({
                  [transformKey]: animateSnapshotValue(
                    subKey,
                    transformKey,
                    value,
                    propConfig,
                    !!previouslyEmitted[subKey],
                    snapshot.seeds[subKey],
                    !!snapshot.gatedKeys[subKey],
                    currentlyExiting,
                    currentCycleId,
                    currentlyCompletingEnter,
                    currentEnterCycleId,
                    currentlyCompletingUpdate,
                    currentUpdateCycleId,
                    markExitKeyDone,
                    markEnterKeyDone,
                    markUpdateKeyDone
                  ),
                })
              } else {
                validTransforms.push(t)
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
              isCompletingEnterRef,
              enterCycleIdShared,
              markEnterKeyDone,
              isCompletingUpdateRef,
              updateCycleIdShared,
              markUpdateKeyDone,
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
