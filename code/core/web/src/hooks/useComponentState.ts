import { getPlatformDriver, isServer, isWeb } from '@tamagui/constants'
import { mergeIfNotShallowEqual } from '@tamagui/is-equal-shallow'
import { useDidFinishSSR, useIsClientOnly } from '@tamagui/use-did-finish-ssr'
import { useRef, useState } from 'react'
import { getSetting } from '../config'
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

  // a renderer platform driver with native pseudo states (react-native-gpui)
  // makes ANY component with runtime pseudo styles ride the animation-driver
  // emitter path — no per-site transition/animation prop required. the flip is
  // driver-sourced (hover) or event-sourced (press/focus) but either way applies
  // through the emitter with zero React commits; with no transition declared it
  // resolves instant (see createComponent's effectiveTransition default).
  const platformPseudo = Boolean(
    !isHOC &&
    useAnimations &&
    animationDriver?.avoidReRenders &&
    getPlatformDriver()?.pseudo &&
    ('hoverStyle' in props || 'pressStyle' in props || 'focusStyle' in props)
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

  const hasEnterStyle = !!props.enterStyle

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
  // reused every render. Drops the useCallback hook that useCreateShallowSetState
  // would otherwise add. setState from useState is stable per instance so we
  // can safely capture it. debug is read off stateRef at call time.
  //
  // IMPORTANT: this lives on `baseSetStateShallow`, NOT `setStateShallow`.
  // createComponent's avoidReRenders path overwrites `stateRef.current.setStateShallow`
  // with an emitter wrapper and captures THIS base as its real-re-render escape hatch.
  // if the base shared the `setStateShallow` field, on the 2nd+ render this hook would
  // read back the wrapper, the wrapper's escape hatch would point at itself, and a real
  // re-render (e.g. unmounted 'should-enter' -> false) would never reach React — leaving
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

  // set enter/exit variants onto our new props object
  if (presenceState && isAnimated && isHydrated && staticConfig.variants) {
    if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
      console.warn(`has presenceState ${JSON.stringify(presenceState)}`)
    }
    const { enterVariant, exitVariant, enterExitVariant, custom } = presenceState
    if (isObj(custom)) {
      Object.assign(props, custom)
    }
    const exv = exitVariant ?? enterExitVariant
    const env = enterVariant ?? enterExitVariant
    if (state.unmounted && env && staticConfig.variants[env]) {
      if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
        console.warn(`Animating presence ENTER "${env}"`)
      }
      props[env] = true
    } else if (isExiting && exv) {
      if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
        console.warn(`Animating presence EXIT "${exv}"`)
      }
      props[exv] = exitVariant !== enterExitVariant
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
  return Object.keys(style).some((k) => {
    const val = style[k]
    return val && typeof val === 'object' && '_animation' in val
  })
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
