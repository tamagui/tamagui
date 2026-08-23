import { getPlatformDriver, isServer, isWeb } from '@tamagui/constants'
import { stylePropsAll } from '@tamagui/helpers'
import { canonicalClauseModifier, scanFlatValue } from '@tamagui/style-grammar/runtime'
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
import { type GenericProps, readMergedProp } from '../helpers/mergeProps'
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

// One live scan at a time, so the visitor and its state are hoisted rather than
// rebuilt per prop: this runs on every render of every component, and the whole
// point of an index-based scanner is that asking the question costs nothing.
let scanSource = ''
let scanWanted: ReadonlySet<string> = enterModifier
let scanFound = false
let scanRefused = false

const lifecycleVisitor = {
  segment(start: number, end: number, isBase: boolean) {
    // a clause with no payload is a value parseValue refuses, so nothing in it
    // reaches the style object and nothing in it can start an animation
    if (start === end && !isBase) scanRefused = true
  },
  chain(start: number, end: number) {
    if (scanRefused) return false
    for (let index = start; index <= end; index++) {
      if (index !== end && scanSource.charCodeAt(index) !== 58) continue
      if (scanWanted.has(canonicalClauseModifier(scanSource.slice(start, index)))) {
        scanFound = true
      }
      start = index + 1
    }
    return true
  },
  error() {
    scanRefused = true
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
  caller: Record<string, any>,
  context: Record<string, any> | undefined,
  defaults: Record<string, any> | undefined,
  config: TamaguiInternalConfig,
  modifiers: ReadonlySet<string>
): boolean {
  // scan each key's effective merged value once, in merge order: caller wins, then
  // styled context (undefined skips), then defaults. mirrors contributeMergedSources.
  const scanValue = (value: any, key: string): boolean => {
    if (typeof value !== 'string' || value.indexOf(':') === -1) return false
    const property = config.shorthands[key] || key
    if (!(property in stylePropsAll) && property !== 'transition') return false
    scanSource = value
    scanWanted = modifiers
    scanFound = false
    scanRefused = false
    scanFlatValue(value, lifecycleVisitor)
    return scanFound && !scanRefused
  }

  if (defaults) {
    for (const key in defaults) {
      if (key in caller) continue
      if (context && context[key] !== undefined) continue
      if (scanValue(defaults[key], key)) return true
    }
  }
  if (context) {
    for (const key in context) {
      if (key in caller) continue
      if (context[key] === undefined) continue
      if (defaults && key in defaults) continue
      if (scanValue(context[key], key)) return true
    }
  }
  for (const key in caller) {
    if (scanValue(caller[key], key)) return true
  }
  return false
}

export const useComponentState = (
  caller: ViewProps | TextProps | Record<string, any>,
  styledContextValue: GenericProps | undefined,
  resolvedDefaultProps: Record<string, any> | undefined,
  animationDriver: ComponentContextI['animationDriver'],
  staticConfig: StaticConfig,
  config: TamaguiInternalConfig
) => {
  const props = caller
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
  const transition = readMergedProp(caller, styledContextValue, resolvedDefaultProps, 'transition')
  const styleProp = readMergedProp(caller, styledContextValue, resolvedDefaultProps, 'style')
  const hasAnimationProp = Boolean(
    (!isHOC && transition !== undefined) ||
    (styleProp && hasAnimatedStyleValue(styleProp))
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
    hasFlatModifier(caller, styledContextValue, resolvedDefaultProps, config, platformPseudoModifiers)
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

  const disableClassName = readMergedProp(
    caller,
    styledContextValue,
    resolvedDefaultProps,
    'disableClassName'
  )

  // HOOK
  const presence =
    (!isHOC &&
      willBeAnimated &&
      caller['animatePresence'] !== false &&
      animationDriver?.usePresence?.()) ||
    null

  const presenceState = presence?.[2]
  const isExiting = presenceState?.isPresent === false
  const isEntering = presenceState?.isPresent === true && presenceState.initial !== false

  const hasEnterStyle = hasFlatModifier(
    caller,
    styledContextValue,
    resolvedDefaultProps,
    config,
    enterModifier
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
  const disabled = isDisabled(caller, styledContextValue, resolvedDefaultProps)

  if (disabled != null) {
    initialState.disabled = disabled
  }

  // HOOK
  const states = useState<TamaguiComponentState>(initialState)

  const forceStyle = readMergedProp(caller, styledContextValue, resolvedDefaultProps, 'forceStyle')
  const state = forceStyle ? { ...states[0], [forceStyle]: true } : states[0]
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

  const groupName = readMergedProp(caller, styledContextValue, resolvedDefaultProps, 'group') as any as string | undefined

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
    ;(stateRef.current as any).__debug = caller.debug
  }
  const setStateShallow = stateRef.current.baseSetStateShallow!
  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`state-useCreateShallowSetState`

  // merge AnimatePresence's `custom` onto a FRESH props object — never mutate the
  // caller's incoming props. with the ref-strip clone removed in createComponent, on
  // the no-defaults path that input IS React's own props object and must stay
  // immutable. the augmented copy is returned as `props` below.
  let outProps: typeof caller = caller
  if (presenceState && isAnimated && isHydrated && staticConfig.variants) {
    if (process.env.NODE_ENV === 'development' && caller.debug === 'verbose') {
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
      outProps = { ...caller, ...custom }
    }
  }

  let noClass = !isWeb || !!forceStyle

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

        if (process.env.NODE_ENV === 'development' && caller.debug === 'verbose') {
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

const isDisabled = (
  caller: Record<string, any>,
  context: Record<string, any> | undefined,
  defaults: Record<string, any> | undefined
) => {
  const read = (key: string) => readMergedProp(caller, context, defaults, key)
  return (
    read('disabled') ||
    read('passThrough') ||
    read('accessibilityState')?.disabled ||
    read('aria-disabled') ||
    read('accessibilityDisabled') ||
    false
  )
}
