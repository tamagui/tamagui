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
  NativeTextMetrics,
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
  TextInput,
  type ColorValue,
  type Text,
  type View,
} from 'react-native'

import type { CreateAnimationsOptions } from './types'

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

// layout dimensions. the native animated module has no whitelist entry for any
// of them, so a node animating one runs its whole Animated graph on the JS
// driver (useNativeDriver:false): Fabric cannot mix native- and JS-driven
// values on one node.
const layoutStyleKey = {
  height: true,
  width: true,
  minHeight: true,
  maxHeight: true,
  minWidth: true,
  maxWidth: true,
}

// text metrics have no whitelist entry either, but unlike a height they sit on
// nearly every Text, so being covered by a broad `transition="medium"` must not
// be enough to take the node off the native driver: an opacity fade over text
// whose size is not changing would then run in JS. they join the Animated graph
// only while they are actually moving, and the node's driver follows them.
const textMetricStyleKey = {
  fontSize: true,
  lineHeight: true,
}

const jsDriverStyleKey = { ...layoutStyleKey, ...textMetricStyleKey }

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

// A numeric authored lineHeight is a RATIO of the resolved font size, not a
// length. Core finalizes the destination to fontSize * ratio and reports the
// ratio back on `nativeTextMetrics`, so the painted leading has to be
// fontSize * ratio on EVERY frame, not only at the destination. This driver
// gets that exactly by never animating the leading itself: it animates the
// font size and the ratio, and paints their product as one Animated node.
// An absolute px leading, and any raw react-native style, keeps its own value
// and animates as an ordinary numeric key.
const getLeadingRatio = (metrics: { lineHeight?: unknown } | undefined | null) => {
  const ratio = metrics?.lineHeight
  return typeof ratio === 'number' && Number.isFinite(ratio) && ratio >= 0
    ? ratio
    : undefined
}

// the product needs both factors as numbers in the style it is painting into.
const paintsLeadingProduct = (
  style: Record<string, any>,
  ratio: number | undefined
): ratio is number =>
  ratio !== undefined &&
  typeof style.fontSize === 'number' &&
  typeof style.lineHeight === 'number'

// a leading multiplied off an ANCESTOR's live font size: this node has none of
// its own, core reports the ratio, and react-native inherits the size itself.
const inheritedFontSizeNode = (
  style: Record<string, any>,
  ratio: number | undefined,
  inheritedText: { fontSize: unknown; driver: string } | null | undefined
) =>
  ratio !== undefined &&
  typeof style.fontSize !== 'number' &&
  inheritedText?.driver === 'react-native'
    ? (inheritedText.fontSize as Animated.Value)
    : undefined

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

export const AnimatedView: Animated.AnimatedComponent<typeof View> = Animated.View
export const AnimatedText: Animated.AnimatedComponent<typeof Text> = Animated.Text
// a TextInput never inherits font size from an ancestor Text on native, so the
// binding hook has to hand it a host that accepts animated nodes of its own.
// built on first use: the compiler evaluates tamagui.config.ts against a
// react-native stub whose Animated cannot make one, and never binds any text.
let animatedTextInput: Animated.AnimatedComponent<typeof TextInput> | undefined

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

    // binds a descendant that has no font size of its own to the ancestor's
    // animated one. no clock here: the font size node is the ancestor's, and a
    // ratio leading is a multiplication of it, so both land on the same frame.
    useTextMetrics: ({ inheritedText, lineHeight }) => {
      const node =
        inheritedText?.driver === 'react-native'
          ? (inheritedText.fontSize as Animated.Value)
          : null
      // an absolute or `normal` leading still needs the font size bound, it
      // just keeps the leading the caller already resolved.
      const ratio = typeof lineHeight === 'number' ? lineHeight : null
      const style = React.useMemo(
        () =>
          node
            ? ratio === null
              ? { fontSize: node }
              : { fontSize: node, lineHeight: Animated.multiply(node, ratio) }
            : null,
        [node, ratio]
      )
      const textChannel = inheritedText ?? null
      if (!style) return { style: null, textChannel }
      animatedTextInput ||= Animated.createAnimatedComponent(TextInput)
      return { style, textChannel, Text: AnimatedText, TextInput: animatedTextInput }
    },

    useAnimations: ({
      props,
      onTransition,
      style,
      componentState,
      presence,
      stateRef,
      styleState,
      useStyleEmitter,
      inheritedText,
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
      // a ratio leading animates the RATIO, never the leading, and paints
      // fontSize * ratio as one node. the ratio is not a style key, so it lives
      // outside animateStyles (which the stale-key sweep and the emitter's
      // structural-change check both treat as the rendered style's own keys).
      const leadingRatioValue = React.useRef<Animated.Value | null>(null)
      const leadingRatioRef = React.useRef<number | undefined>(undefined)
      // whether the style React last committed paints the derived product. the
      // emitter can only re-target existing Animated.Values, so a pass that
      // disagrees with this has to force a commit to swap the node itself.
      const paintsDerivedLeading = React.useRef(false)
      // this subtree's live font size, published for descendants that inherit
      // it. the channel's identity IS the node's, so a consumer that keeps the
      // same channel keeps the same derived node.
      const textChannelRef = React.useRef<{ fontSize: unknown; driver: string } | null>(
        null
      )
      // core reports a numeric (ratio) leading on nativeTextMetrics; a px length
      // and 'normal' are reported as themselves and stay independent keys.
      leadingRatioRef.current = getLeadingRatio(styleState?.nativeTextMetrics)
      // the text metrics the last pass painted, so the next one can tell a real
      // change from a value that is simply present. a metric only joins the
      // Animated graph while it is moving (see textMetricStyleKey), which is
      // what keeps an ordinary opacity or transform animation over unchanged
      // text on the native driver.
      const paintedTextRef = React.useRef<{
        fontSize?: unknown
        lineHeight?: unknown
        ratio?: number
      }>({})
      // a value already in the graph keeps moving until it arrives, so a
      // re-render mid-flight never drops it back to a static style and snaps.
      // the first pass has painted nothing yet, so nothing is moving there
      // either: the metrics land as plain numbers and the node mounts on the
      // native driver.
      const movesTextValue = (key: 'fontSize' | 'lineHeight', target: unknown) => {
        if (typeof target !== 'number') return false
        const node = animateStyles.current[key]
        const last = node ? (node['_value'] as unknown) : paintedTextRef.current[key]
        return last !== undefined && last !== target
      }
      const movesLeadingRatio = (ratio: number | undefined) => {
        if (ratio === undefined) return false
        const node = leadingRatioValue.current
        const last = node ? (node['_value'] as number) : paintedTextRef.current.ratio
        return last !== undefined && last !== ratio
      }
      // the font size descendants read as this node's live size. it outlives
      // any one animation: dropping it whenever the size came to rest would
      // swap every descendant between Text and Animated.Text, remounting their
      // subtrees, and a TextInput's focus and contents with them, every time an
      // animation started or finished.
      const fontSizeNode = React.useRef<Animated.Value | null>(null)
      const animatedValueFor = (key: string) => {
        const painted = animateStyles.current[key]
        if (painted) return painted
        if (key === 'fontSize' && fontSizeNode.current) return fontSizeNode.current
        // a metric that was at rest is out of the graph, so the value it
        // rejoins with has to start at what the last pass painted: a fresh
        // Animated.Value starts AT its target, and would snap the metric.
        if (textMetricStyleKey[key])
          return new Animated.Value(paintedTextRef.current[key] as number)
        return undefined
      }
      const leadingRatioValueFrom = () =>
        leadingRatioValue.current ??
        new Animated.Value(paintedTextRef.current.ratio as number)
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
        leadingRatioRef.current,
        inheritedText,
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
        // the leading is derived only while something can actually move it.
        // when neither key is covered by the transition both fall through to
        // nonAnimatedStyle and land together in one commit, which is already
        // coherent and keeps the node on the native driver.
        const paintedRatio = leadingRatioRef.current
        const paintsProduct = paintsLeadingProduct(style, paintedRatio)
        const movesFontSize = movesTextValue('fontSize', style.fontSize)
        const movesLeading = paintsProduct
          ? movesLeadingRatio(paintedRatio)
          : movesTextValue('lineHeight', style.lineHeight)
        // a metric that has arrived leaves the graph here rather than in the
        // sweep at the end of the pass, so the node goes back to the native
        // driver in the same commit that stops moving it. the same three
        // conditions as that sweep: an exit and a latched pseudo both still own
        // the keys they are painting.
        if (!isExiting && !isDisabled && !pseudoActiveRef.current) {
          if (!movesFontSize) delete animateStyles.current.fontSize
          if (!movesLeading) delete animateStyles.current.lineHeight
        }

        // a font size a transition can move is published to descendants whether
        // or not it happens to be moving right now, so their host component
        // does not change under them when it starts.
        if (
          isDisabled ||
          typeof style.fontSize !== 'number' ||
          !getTransitionForKey(resolved, 'fontSize')
        ) {
          fontSizeNode.current = null
        } else if (!fontSizeNode.current) {
          fontSizeNode.current = new Animated.Value(style.fontSize)
        }

        // track which animated keys/transforms the incoming style actually
        // carries this pass, so entries that left the style can be dropped
        // below (an Animated.Value that persisted forever would keep painting
        // a stale pixel value, e.g. a released-to-auto accordion height)
        const seenAnimateKeys = new Set<string>()
        let sawTransform = false
        let transformCount = 0

        const derivesLeading =
          !isDisabled &&
          paintsProduct &&
          (movesFontSize || movesLeading) &&
          (!!getTransitionForKey(resolved, 'fontSize') ||
            !!getTransitionForKey(resolved, 'lineHeight'))
        // an inherited font size: core leaves this node's own fontSize out of
        // the style and reports the ratio, so the leading is the ANCESTOR's
        // live font size times this node's ratio. react-native inherits the
        // size itself, and a length leading is inherited as a length.
        const inheritedFontSize = isDisabled
          ? undefined
          : inheritedFontSizeNode(style, paintedRatio, inheritedText)

        // animatedStyle owns every Animated.Value on the node. Fabric cannot mix
        // native- and JS-driven values inside that shared graph, so one layout
        // animation, one text metric on the move, or a leading multiplied off an
        // ancestor's font size, makes the whole node use the JS driver. a metric
        // another pass left in the graph counts too, or its next animation would
        // start on a driver the node no longer runs on.
        const useNativeDriverForNode =
          nativeDriver &&
          !hasAnimatedLayoutKey(style, isDark, resolved) &&
          !movesFontSize &&
          !movesLeading &&
          !inheritedFontSize &&
          !Object.keys(animateStyles.current).some((key) => jsDriverStyleKey[key])

        for (const key in style) {
          const rawVal = style[key]
          // Resolve dynamic theme values from flat theme clauses.
          const val = resolveDynamicValue(rawVal, isDark)
          if (val === undefined) continue

          if (isDisabled) {
            continue
          }

          // fontSize and lineHeight are owned by the derived-leading block below
          if (
            (derivesLeading || inheritedFontSize) &&
            (key === 'fontSize' || key === 'lineHeight')
          ) {
            // unless the size is the factor at rest: the product multiplies the
            // number it paints, and that number has to be painted
            if (key === 'fontSize' && derivesLeading && !movesFontSize) {
              nonAnimatedStyle[key] = val
            }
            continue
          }

          // a text metric at rest stays out of the Animated graph entirely: it
          // paints as a plain style, and the node keeps the native driver
          if (
            textMetricStyleKey[key] &&
            !(key === 'fontSize' ? movesFontSize : movesLeading)
          ) {
            nonAnimatedStyle[key] = val
            continue
          }

          if (
            animatedStyleKey[key] == null &&
            !costlyToAnimateStyleKey[key] &&
            !jsDriverStyleKey[key]
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
          if (jsDriverStyleKey[key] && typeof val !== 'number') {
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
            animateStyles.current[key] = update(key, animatedValueFor(key), val)
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

        // the derived leading: fontSize and the ratio each animate on their own
        // resolved entry, and the painted leading is their product, so
        // lineHeight is fontSize * ratio on every frame by construction rather
        // than by two solvers happening to agree. a key the transition does not
        // cover gets snapConfig here exactly as it would anywhere else, which
        // makes `transition="fontSize 300ms"` move the leading with the size and
        // `transition="lineHeight 300ms"` move the ratio over a size that has
        // already arrived.
        // the ratio is a factor exactly like the font size: a value of its own
        // while it moves, the number it already paints while it does not
        const ratioFactor = (): Animated.Value | number => {
          if (!movesLeading) {
            leadingRatioValue.current = null
            return paintedRatio!
          }
          leadingRatioValue.current = update(
            'lineHeight',
            leadingRatioValueFrom(),
            paintedRatio!
          )
          return leadingRatioValue.current
        }
        let derivedLeading: ReturnType<typeof Animated.multiply> | undefined
        if (derivesLeading) {
          // a factor at rest multiplies as the plain number it already paints,
          // so the product does not carry a value nothing is moving
          let fontSizeFactor: Animated.Value | number = style.fontSize
          if (movesFontSize) {
            fontSizeFactor = update(
              'fontSize',
              animatedValueFor('fontSize'),
              style.fontSize
            )
            animateStyles.current.fontSize = fontSizeFactor
            seenAnimateKeys.add('fontSize')
          }
          derivedLeading = Animated.multiply(fontSizeFactor, ratioFactor())
        } else if (inheritedFontSize) {
          derivedLeading = Animated.multiply(inheritedFontSize, ratioFactor())
        } else if (!isDisabled) {
          leadingRatioValue.current = null
        }
        paintsDerivedLeading.current = !!derivedLeading

        // what descendants inherit from this node: its own animated font size
        // when it has one, nothing when it has a font size of its own that is
        // not animating (react-native inherits that statically), and otherwise
        // whatever it inherited itself.
        const ownFontSizeNode = fontSizeNode.current
        const textChannel = ownFontSizeNode
          ? textChannelRef.current?.fontSize === ownFontSizeNode
            ? textChannelRef.current
            : { fontSize: ownFontSizeNode, driver: 'react-native' }
          : typeof style.fontSize === 'number'
            ? null
            : (inheritedText ?? null)
        textChannelRef.current = textChannel

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
          ...(derivedLeading ? { lineHeight: derivedLeading } : null),
          ...animatedTransformStyle,
        }

        if (!isDisabled) {
          paintedTextRef.current = {
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            ratio: paintedRatio,
          }
        }

        return {
          runners,
          completions,
          textChannel,
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
      // the fourth argument is the emitted style's own nativeTextMetrics: the
      // emitter re-runs getSplitStyles outside render, so the ratio that
      // describes the style it hands over is never the ratio the last render
      // resolved (a pseudo can replace the leading with an absolute length).
      const onEmittedStyle = (
        nextStyle: Record<string, any>,
        emittedTransition: TransitionProp | null | undefined,
        pseudoActive?: boolean,
        nextMetrics?: NativeTextMetrics
      ) => {
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
        const emittedRatio = getLeadingRatio(nextMetrics)
        const emitterPaintsProduct = paintsLeadingProduct(nextStyle, emittedRatio)
        // the same rule as the render path: a text metric joins the graph only
        // while it is moving, so a pseudo that only changes an opacity leaves
        // the node's font size out of it and keeps the native driver
        const emitterMovesFontSize = movesTextValue('fontSize', nextStyle.fontSize)
        const emitterMovesLeading = emitterPaintsProduct
          ? movesLeadingRatio(emittedRatio)
          : movesTextValue('lineHeight', nextStyle.lineHeight)
        // nextStyle is the complete style for this node, so the emitter makes
        // the same single driver decision as the render path. include the
        // currently rendered graph because its stale keys are not removed until
        // the structural-change commit below.
        const useNativeDriverForNode =
          nativeDriver &&
          !hasAnimatedLayoutKey(nextStyle, isDark, emittedResolved) &&
          !emitterMovesFontSize &&
          !emitterMovesLeading &&
          !inheritedFontSizeNode(nextStyle, emittedRatio, inheritedText) &&
          !Object.keys(animateStyles.current).some((key) => jsDriverStyleKey[key])

        const emitterDerivesLeading =
          emitterPaintsProduct &&
          (emitterMovesFontSize || emitterMovesLeading) &&
          (!!getTransitionForKey(emittedResolved, 'fontSize') ||
            !!getTransitionForKey(emittedResolved, 'lineHeight'))

        for (const key in nextStyle) {
          const rawVal = nextStyle[key]
          const val = resolveDynamicValue(rawVal, isDark)
          if (val === undefined) continue

          if (emitterDerivesLeading && (key === 'fontSize' || key === 'lineHeight')) {
            continue
          }

          // a metric at rest is not the emitter's to animate. it either already
          // paints as a plain style or the commit below hands it to one.
          if (
            textMetricStyleKey[key] &&
            !(key === 'fontSize' ? emitterMovesFontSize : emitterMovesLeading)
          ) {
            continue
          }

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
            jsDriverStyleKey[key]
          ) {
            // layout keys only animate numbers ('auto'/percents are static);
            // unparseable themed colors can't be interpolated — skip both and
            // let the next render apply them statically
            if (jsDriverStyleKey[key] && typeof val !== 'number') continue
            if (colorStyleKey[key] && !isAnimatableColor(val)) continue
            if (!animateStyles.current[key]) animatedShapeChanged = true
            animateStyles.current[key] = update(key, animatedValueFor(key), val)
            seenAnimateKeys.add(key)
          }
        }

        // the emitter can only re-target Animated.Values the committed style
        // already paints. re-targeting the font size and the ratio keeps the
        // product moving without a commit; a pass that disagrees with the
        // committed style about whether the leading IS a product (a pseudo that
        // overrides it with an absolute length, or the first pseudo pass on a
        // node whose render never derived) needs the node swapped, which only a
        // commit can do.
        if (emitterDerivesLeading) {
          if (emitterMovesFontSize) {
            if (!animateStyles.current.fontSize) animatedShapeChanged = true
            animateStyles.current.fontSize = update(
              'fontSize',
              animatedValueFor('fontSize'),
              nextStyle.fontSize as number
            )
            seenAnimateKeys.add('fontSize')
          }
          // a factor at rest is left out: it multiplies as the number the
          // painted product already carries. giving one a value the committed
          // style does not paint is the shape change that commits.
          if (emitterMovesLeading) {
            if (!leadingRatioValue.current) animatedShapeChanged = true
            leadingRatioValue.current = update(
              'lineHeight',
              leadingRatioValueFrom(),
              emittedRatio!
            )
          }
        }
        if (emitterDerivesLeading !== paintsDerivedLeading.current) {
          animatedShapeChanged = true
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

        paintedTextRef.current = {
          fontSize: nextStyle.fontSize,
          lineHeight: nextStyle.lineHeight,
          ratio: emittedRatio,
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
      }
      useStyleEmitter?.(onEmittedStyle)

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
