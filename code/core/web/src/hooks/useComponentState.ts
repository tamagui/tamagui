import { getPlatformDriver, isServer, isWeb } from '@tamagui/constants'
import { stylePropsAll } from '@tamagui/helpers'
import {
  canonicalClauseModifier,
  scanFlatValue,
  type FlatValueHandler,
} from '@tamagui/style-grammar/runtime'
import { mergeIfNotShallowEqual } from '@tamagui/is-equal-shallow'
import { useDidFinishSSR, useIsClientOnly } from '@tamagui/use-did-finish-ssr'
import { useRef, useState } from 'react'
import { getSetting } from '../config'
import { formatDiagnostic } from '../helpers/formatDiagnostic'
import { isOptimizedForFirstRender } from './isOptimizedForFirstRender'
import {
  defaultComponentState,
  defaultComponentStateMounted,
  defaultComponentStateShouldEnter,
} from '../defaultComponentState'
import { isObj } from '../helpers/isObj'
import { log } from '../helpers/log'
import type {
  ComponentContextI,
  StaticConfig,
  TamaguiComponentState,
  TamaguiComponentStateRef,
  TamaguiInternalConfig,
  TextProps,
  UseAnimationHook,
} from '../types'
import type { ViewProps } from '../views/View'

// canonical spellings only: `canonicalClauseModifier` folds `active` and
// `pressed` into `press` and `starting` into `enter` before the lookup, so the
// alias table in @tamagui/style-grammar stays the only place they are listed
const platformPseudoModifiers = new Set(['hover', 'press', 'focus'])
const enterModifier = new Set(['enter'])

type LifecycleScanContext = TamaguiComponentStateRef & {
  // source, wanted modifiers, found, and pending match. created once per
  // component and reused by both lifecycle questions on every render.
  flatScan?: [string, ReadonlySet<string>, boolean, boolean]
}

const lifecycleHandler: FlatValueHandler<LifecycleScanContext> = {
  segment(ctx, start, end, isBase, valid) {
    const scan = ctx.flatScan!
    if (!isBase && valid && start < end && scan[3]) scan[2] = true
    scan[3] = false
  },
  chain(ctx, start, end, valid) {
    const scan = ctx.flatScan!
    scan[3] = false
    if (!valid) return true
    for (let index = start; index <= end; index++) {
      if (index !== end && scan[0].charCodeAt(index) !== 58) continue
      if (scan[1].has(canonicalClauseModifier(scan[0].slice(start, index)))) {
        scan[3] = true
      }
      start = index + 1
    }
    return true
  },
}

/**
 * Does any flat style value on this component carry one of `modifiers`?
 *
 * It runs the same `scanFlatValue` lexer the style scanner runs, which is the
 * whole reason it exists in this shape: a value the style scanner throws away
 * used to still put the component on the should-enter path here, so it rendered
 * an enter frame for a style that never arrived.
 */
function hasFlatModifier(
  props: Record<string, any>,
  config: TamaguiInternalConfig,
  modifiers: ReadonlySet<string>,
  ctx: LifecycleScanContext,
  variants?: Record<string, any>
): boolean {
  const scan = (ctx.flatScan ||= ['', enterModifier, false, false])
  for (const key in props) {
    const value = props[key]
    const isString = typeof value === 'string'
    if (isString ? value.indexOf(':') === -1 : !value || typeof value !== 'object') {
      continue
    }
    const property = config.shorthands[key] || key
    if (
      !(property in stylePropsAll) &&
      property !== 'transition' &&
      // conditional variant props resolve style branches too, so their
      // lifecycle clauses drive the same decision
      !(variants && key in variants)
    ) {
      continue
    }
    if (!isString) {
      // an object-valued transition is the driver's per-lifecycle config
      // grammar (`{ default, enter, exit }` timings), not a flat conditional
      // style value — its keys name when to run, not what style arrives
      if (property === 'transition') continue
      // flat conditional objects carry the chain as the key; a structured leaf
      // (shadowOffset) has no modifier-named key so it never matches
      for (const chain in value) {
        if (chain === 'default' || value[chain] == null) continue
        let start = 0
        for (let index = 0; index <= chain.length; index++) {
          if (index !== chain.length && chain.charCodeAt(index) !== 58) continue
          if (modifiers.has(canonicalClauseModifier(chain.slice(start, index)))) {
            return true
          }
          start = index + 1
        }
      }
      continue
    }
    scan[0] = value
    scan[1] = modifiers
    scan[2] = false
    scan[3] = false
    scanFlatValue(value, lifecycleHandler, ctx)
    if (scan[2]) return true
  }
  return false
}

export const useComponentState = (
  props: ViewProps | TextProps | Record<string, any>,
  animationDriver: ComponentContextI['animationDriver'],
  staticConfig: StaticConfig,
  config: TamaguiInternalConfig
) => {
  'use no memo'

  const isHydrated = useDidFinishSSR()
  const needsHydration = !useIsClientOnly()

  const useAnimations = animationDriver?.isStub
    ? undefined
    : (animationDriver?.useAnimations as UseAnimationHook | undefined)

  const { isHOC } = staticConfig

  const stateRef = useRef<TamaguiComponentStateRef>(
    // performance: avoid creating object every render
    undefined as unknown as TamaguiComponentStateRef
  )

  if (!stateRef.current) {
    stateRef.current = {
      startedUnhydrated: needsHydration && !isHydrated,
      optimizeForFirstRender: isOptimizedForFirstRender(),
    }
  }

  // after we get states mount we need to turn off isAnimated for server side
  const hasAnimationProp = Boolean(
    (!isHOC && 'transition' in props) ||
    (props.style && hasAnimatedStyleValue(props.style))
  )

  const inputStyle = animationDriver?.inputStyle ?? 'css'
  const outputStyle = animationDriver?.outputStyle ?? 'css'
  const curStateRef = stateRef.current

  if (!needsHydration && hasAnimationProp) {
    curStateRef.hasAnimated = true
  }

  // A renderer platform driver with native pseudo states (react-native-gpui)
  // makes any component with interaction clauses ride the animation-driver
  // emitter path — no per-site transition/animation prop required. the flip is
  // driver-sourced (hover) or event-sourced (press/focus) but either way applies
  // through the emitter with zero React commits; with no transition declared it
  // resolves instant (see createComponent's effectiveTransition default).
  const platformPseudo = Boolean(
    !isHOC &&
    useAnimations &&
    animationDriver?.avoidReRenders &&
    getPlatformDriver()?.pseudo &&
    hasFlatModifier(
      props,
      config,
      platformPseudoModifiers,
      curStateRef as LifecycleScanContext,
      staticConfig.variants
    )
  )

  const willBeAnimatedClient = (() => {
    const next = !!((hasAnimationProp || platformPseudo) && !isHOC && useAnimations)
    return Boolean(next || curStateRef.hasAnimated)
  })()

  const willBeAnimated = !isServer && willBeAnimatedClient

  // once animated, always animated to preserve hooks / vdom structure
  if (willBeAnimated && !curStateRef.hasAnimated) {
    curStateRef.hasAnimated = true
  }

  const { disableClassName } = props

  // HOOK
  const presence =
    (!isHOC &&
      willBeAnimated &&
      props['animatePresence'] !== false &&
      animationDriver?.usePresence?.()) ||
    null

  const presenceState = presence?.[2]
  const isExiting = presenceState?.isPresent === false
  const isEntering = presenceState?.isPresent === true && presenceState.initial !== false

  const hasEnterStyle = hasFlatModifier(
    props,
    config,
    enterModifier,
    curStateRef as LifecycleScanContext,
    staticConfig.variants
  )

  const hasAnimationThatNeedsHydrate =
    hasAnimationProp &&
    !isHydrated &&
    (animationDriver?.isReactNative || inputStyle !== 'css')

  const canImmediatelyEnter = hasEnterStyle || isEntering

  // this can be conditional because its only ever needed with animations
  const shouldEnter =
    !isHOC &&
    (hasEnterStyle ||
      isEntering ||
      hasAnimationThatNeedsHydrate ||
      // disableClassName doesnt work server side, only client, so needs hydrate
      // this is just for a better ux, supports css variables for light/dark, media queries, etc
      disableClassName)

  // two stage enter: because we switch from css driver to spring driver
  //   - first render: render to match server with css driver
  //   - second render: state.unmounted = should-enter, still rendering the initial,
  //     non-entered state but now with the spring animation driver

  const initialState = shouldEnter
    ? // on the very first render we switch all spring animation drivers to css rendering
      // this is because we need to use css variables, which they don't support to do proper SSR
      // without flickers of the wrong colors.
      // but once we do that initial hydration and we are in client side rendering mode,
      // we can avoid the extra re-render on mount
      canImmediatelyEnter
      ? defaultComponentStateShouldEnter
      : defaultComponentState
    : defaultComponentStateMounted

  // will be nice to deprecate half of these:
  const disabled = isDisabled(props)

  if (disabled != null) {
    initialState.disabled = disabled
  }

  // HOOK
  const states = useState<TamaguiComponentState>(initialState)

  const state = props.forceStyle ? { ...states[0], [props.forceStyle]: true } : states[0]
  const setState = states[1]

  // apply states we never updated from avoiding re-renders in animation driver
  // unsafe yea yea
  // if (stateRef.current.nextComponentState) {
  //   Object.assign(state, stateRef.current.nextComponentState)
  // }

  // only web server + initial client render run this when not hydrated:
  let isAnimated = willBeAnimated
  if (isWeb && hasAnimationThatNeedsHydrate && !staticConfig.isHOC && !isHydrated) {
    isAnimated = false
    curStateRef.willHydrate = true
  }

  // immediately update disabled state and reset component state
  if (disabled !== state.disabled) {
    // if disabled remove all press/focus/hover states
    if (disabled) {
      Object.assign(state, defaultComponentStateMounted)
    }
    state.disabled = disabled
    setState((_) => ({ ...state }))
  }

  const groupName = props.group as any as string | undefined

  // hoisted shallow-set closure: created once per component instance and
  // reused every render. drops the useCallback hook that useCreateShallowSetState
  // would otherwise add. setState from useState is stable per instance so we
  // can safely capture it. debug is read off stateRef at call time.
  //
  // important: this lives on `baseSetStateShallow`, not `setStateShallow`.
  // createComponent's avoidReRenders path overwrites `stateRef.current.setStateShallow`
  // with an emitter wrapper and captures this base as its real-re-render escape hatch.
  // if the base shared the `setStateShallow` field, on the 2nd+ render this hook would
  // read back the wrapper, the wrapper's escape hatch would point at itself, and a real
  // re-render (e.g. unmounted 'should-enter' -> false) would never reach React, leaving
  // enter animations stuck at opacity 0.
  if (!stateRef.current.baseSetStateShallow) {
    const r = stateRef.current
    r.baseSetStateShallow = (stateOrGetState: any) => {
      setState((prev: any) => {
        const next =
          typeof stateOrGetState === 'function' ? stateOrGetState(prev) : stateOrGetState
        const update = mergeIfNotShallowEqual(prev, next)
        if (process.env.NODE_ENV === 'development') {
          const dbg = (r as any).__debug
          if (dbg && update !== prev) {
            console.groupCollapsed(`setStateShallow CHANGE`, '=>', update)
            console.info(`previously`, prev)
            console.trace()
            console.groupEnd()
          }
        }
        return update
      })
    }
  }
  if (process.env.NODE_ENV === 'development') {
    ;(stateRef.current as any).__debug = props.debug
  }
  const setStateShallow = stateRef.current.baseSetStateShallow!
  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`state-useCreateShallowSetState`

  // merge AnimatePresence's `custom` onto a FRESH props object — never mutate the
  // caller's incoming props. with the ref-strip clone removed in createComponent, on
  // the no-defaults path that input IS React's own props object and must stay
  // immutable. the augmented copy is returned as `props` below.
  let outProps: typeof props = props
  if (presenceState && isAnimated && isHydrated && staticConfig.variants) {
    if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
      console.warn(
        formatDiagnostic(
          'TAMAGUI_PRESENCE_STATE',
          staticConfig.Component?.displayName ||
            staticConfig.Component?.name ||
            'TamaguiComponent',
          'AnimatePresence supplied lifecycle state to an animated component',
          'Remove debug="verbose" after inspecting the animation state',
          'presenceState',
          presenceState
        )
      )
    }
    const { custom } = presenceState
    if (isObj(custom)) {
      outProps = { ...props, ...custom }
    }
  }

  let noClass = !isWeb || !!props.forceStyle

  if (!isHydrated) {
    noClass = false
  } else {
    // on server for SSR and animation compat added the && isHydrated but perhaps we want
    // disableClassName="until-hydrated" to be more straightforward
    // see issue if not, Button sets disableClassName to true <Button transition="" /> with
    // the react-native driver errors because it tries to animate var(--color) to rbga(..)
    // no matter what if fully unmounted or on the server we use className
    // only once we hydrate do we switch to spring animation drivers or disableClassName etc
    if (isWeb && isHydrated) {
      const isAnimatedAndHydrated = isAnimated && isHydrated

      const isClassNameDisabled =
        !staticConfig.acceptsClassName && (getSetting('disableSSR') || !state.unmounted)

      const isDisabledManually = disableClassName && !state.unmounted

      if (
        // Only disable className for animation drivers that output inline styles (not css)
        (isAnimatedAndHydrated && outputStyle !== 'css') ||
        isDisabledManually ||
        isClassNameDisabled
      ) {
        noClass = true

        if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
          log(`avoiding className`, {
            isAnimatedAndHydrated,
            isDisabledManually,
            isClassNameDisabled,
          })
        }
      }
    }
  }

  return {
    props: outProps,
    startedUnhydrated: curStateRef.startedUnhydrated,
    curStateRef,
    disabled,
    groupName,
    hasAnimationProp,
    hasEnterStyle,
    isAnimated,
    isExiting,
    isHydrated,
    presence,
    presenceState,
    setState,
    setStateShallow,
    noClass,
    state,
    stateRef,
    inputStyle,
    outputStyle,
    willBeAnimated,
    willBeAnimatedClient,
    platformPseudo,
  }
}

function hasAnimatedStyleValue(style: object) {
  for (const k in style) {
    const val = style[k]
    if (val && typeof val === 'object' && '_animation' in val) {
      return true
    }
  }
  return false
}

const isDisabled = (props: any) => {
  return (
    props.disabled ||
    props.passThrough ||
    props.accessibilityState?.disabled ||
    props['aria-disabled'] ||
    props.accessibilityDisabled ||
    false
  )
}
