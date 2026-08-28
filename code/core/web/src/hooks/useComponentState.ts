import { getPlatformDriver, isServer, isWeb } from '@tamagui/constants'
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
  const platformPseudoPossible = Boolean(
    !isHOC &&
    useAnimations &&
    animationDriver?.avoidReRenders &&
    getPlatformDriver()?.pseudo
  )

  let willBeAnimatedClient = (() => {
    const next = !!(
      (hasAnimationProp || platformPseudoPossible) &&
      !isHOC &&
      useAnimations
    )
    return Boolean(next || curStateRef.hasAnimated)
  })()

  let willBeAnimated = !isServer && willBeAnimatedClient

  // once animated, always animated to preserve hooks / vdom structure
  if (willBeAnimated && hasAnimationProp && !curStateRef.hasAnimated) {
    curStateRef.hasAnimated = true
  }

  const { disableClassName } = props

  // HOOK
  // the registration decision must be current BEFORE this render commits: a
  // presence parent with zero registered consumers completes an exit
  // instantly, so an animated frame that only registers after a later
  // finalize pass never animates out. Everything the decision needs for the
  // transition-prop case is pre-pass knowledge; finalizeStyleFlags can only
  // widen it (pass-discovered platform pseudo), and a passThrough render
  // keeps the widened value.
  if (willBeAnimated && !isHOC && props['animatePresence'] !== false) {
    curStateRef.shouldRegisterPresence = true
  } else {
    curStateRef.shouldRegisterPresence ??= false
  }
  const presenceResult = animationDriver?.usePresence?.(curStateRef) || null
  // the hook call position is fixed, but the OBSERVED presence keeps the old
  // conditional-call semantics: a frame that opted out (animatePresence false,
  // HOC, not animated) must not see presence state — downstream that state
  // wraps children in ResetPresence, which would null the context for the
  // frame that actually animates the exit
  const presence =
    !isHOC && willBeAnimated && props['animatePresence'] !== false ? presenceResult : null

  const presenceState = presence?.[2]
  const isExiting = presenceState?.isPresent === false
  const isEntering = presenceState?.isPresent === true && presenceState.initial !== false

  const hasAnimationThatNeedsHydrate =
    hasAnimationProp && !isHydrated && inputStyle !== 'css'

  // two stage enter: because we switch from css driver to spring driver
  //   - first render: render to match server with css driver
  //   - second render: state.unmounted = should-enter, still rendering the initial,
  //     non-entered state but now with the spring animation driver

  // the sole style pass decides whether an enter clause exists. A fresh first
  // frame stays provisionally unmounted until that pass reports its flags —
  // except an HOC, which never enters (shouldEnter is !isHOC && ...), so its
  // pass must not resolve enter clauses as active on the first frame
  const initialState = { ...defaultComponentStateMounted }

  // will be nice to deprecate half of these:
  const disabled = isDisabled(props)

  if (disabled != null) {
    initialState.disabled = disabled
  }

  // HOOK
  const states = useState<TamaguiComponentState>(initialState)

  // React owns a mounted state from the start. The first style pass gets a
  // render-local provisional `unmounted` value so it can discover enter
  // clauses without mutating React state during render. Only a real enter
  // frame is carried in the ref until the first state update consumes it.
  const initialStyleFrameUnmounted = curStateRef.initialStyleFrameUnmounted
  let state =
    (!curStateRef.didFinalizeInitialStyleFrame && !isHOC) ||
    initialStyleFrameUnmounted !== undefined
      ? { ...states[0] }
      : states[0]
  if (!curStateRef.didFinalizeInitialStyleFrame && !isHOC) {
    state.unmounted = true
  }
  if (initialStyleFrameUnmounted !== undefined) {
    state.unmounted = initialStyleFrameUnmounted
  }
  if (props.forceStyle) {
    if (state === states[0]) state = { ...state }
    state[props.forceStyle] = true
  }
  if (!curStateRef.setState) {
    const reactSetState = states[1]
    curStateRef.setState = (stateOrGetState) => {
      const pendingUnmounted = curStateRef.initialStyleFrameUnmounted
      curStateRef.initialStyleFrameUnmounted = undefined
      reactSetState((previous) => {
        const current =
          pendingUnmounted !== undefined && previous.unmounted !== pendingUnmounted
            ? { ...previous, unmounted: pendingUnmounted }
            : previous
        return typeof stateOrGetState === 'function'
          ? stateOrGetState(current)
          : stateOrGetState
      })
    }
  }
  const setState = curStateRef.setState

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
      const isAnimatedAndHydrated =
        !!((hasAnimationProp || curStateRef.hasAnimated) && useAnimations && !isHOC) &&
        isHydrated

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

  const result = {
    props: outProps,
    startedUnhydrated: curStateRef.startedUnhydrated,
    curStateRef,
    disabled,
    groupName,
    hasAnimationProp,
    hasEnterStyle: false,
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
    platformPseudo: platformPseudoPossible,
    finalizeStyleFlags(hasEnterStyle: boolean, hasPlatformPseudo: boolean) {
      const platformPseudo = platformPseudoPossible && hasPlatformPseudo
      const nextWillBeAnimatedClient = Boolean(
        ((hasAnimationProp || platformPseudo) && !isHOC && useAnimations) ||
        curStateRef.hasAnimated
      )
      const nextWillBeAnimated = !isServer && nextWillBeAnimatedClient
      if (nextWillBeAnimated && !curStateRef.hasAnimated) {
        curStateRef.hasAnimated = true
      }
      if (!curStateRef.didFinalizeInitialStyleFrame) {
        curStateRef.didFinalizeInitialStyleFrame = true
        const shouldEnter =
          !isHOC &&
          (hasEnterStyle ||
            isEntering ||
            hasAnimationThatNeedsHydrate ||
            disableClassName)
        const unmounted = shouldEnter
          ? hasEnterStyle || isEntering
            ? 'should-enter'
            : true
          : false
        state.unmounted = unmounted
        curStateRef.initialStyleFrameUnmounted = unmounted || undefined
      }
      result.hasEnterStyle = hasEnterStyle
      result.platformPseudo = platformPseudo
      result.willBeAnimatedClient = nextWillBeAnimatedClient
      result.willBeAnimated = nextWillBeAnimated
      result.isAnimated =
        isWeb && hasAnimationThatNeedsHydrate && !staticConfig.isHOC && !isHydrated
          ? false
          : nextWillBeAnimated
      if (nextWillBeAnimated && !isHOC && props['animatePresence'] !== false) {
        curStateRef.shouldRegisterPresence = true
      }
      return result
    },
  }
  return result
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
