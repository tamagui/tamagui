import { isServer, isWeb } from '@tamagui/constants'
import { useCreateShallowSetState } from '@tamagui/is-equal-shallow'
import { useDidFinishSSR, useIsClientOnly } from '@tamagui/use-did-finish-ssr'
import { useRef, useState } from 'react'
import {
  defaultComponentState,
  defaultComponentStateMounted,
  defaultComponentStateShouldEnter,
} from '../defaultComponentState'
import { isObj } from '../helpers/isObj'
import { log } from '../helpers/log'
import type {
  ComponentContextI,
  StackProps,
  StaticConfig,
  TamaguiComponentState,
  TamaguiComponentStateRef,
  TamaguiInternalConfig,
  TextProps,
  UseAnimationHook,
} from '../types'

export const useComponentState = (
  props: StackProps | TextProps | Record<string, any>,
  animationDriver: ComponentContextI['animationDriver'],
  staticConfig: StaticConfig,
  config: TamaguiInternalConfig
) => {
  const isHydrated = useDidFinishSSR()
  const needsHydration = !useIsClientOnly()
  const [startedUnhydrated] = useState(needsHydration && !isHydrated)
  const useAnimations = animationDriver?.useAnimations as UseAnimationHook | undefined

  const stateRef = useRef<TamaguiComponentStateRef>(
    undefined as any as TamaguiComponentStateRef
  )
  if (!stateRef.current) {
    stateRef.current = {}
  }

  // after we get states mount we need to turn off isAnimated for server side
  const hasAnimationProp = Boolean(
    'animation' in props || (props.style && hasAnimatedStyleValue(props.style))
  )

  const supportsCSS = animationDriver?.supportsCSS
  const curStateRef = stateRef.current

  if (!needsHydration && hasAnimationProp) {
    curStateRef.hasAnimated = true
  }

  const willBeAnimatedClient = (() => {
    const next = !!(hasAnimationProp && !staticConfig.isHOC && useAnimations)
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
    (willBeAnimated &&
      props['animatePresence'] !== false &&
      animationDriver?.usePresence?.()) ||
    null
  const presenceState = presence?.[2]
  const isExiting = presenceState?.isPresent === false
  const isEntering = presenceState?.isPresent === true && presenceState.initial !== false

  const hasEnterStyle = !!props.enterStyle

  const hasAnimationThatNeedsHydrate =
    hasAnimationProp && !isHydrated && (animationDriver?.isReactNative || !supportsCSS)

  const hasEnterState = hasEnterStyle || isEntering

  // this can be conditional because its only ever needed with animations
  const shouldEnter =
    hasEnterState ||
    hasAnimationThatNeedsHydrate ||
    // disableClassName doesnt work server side, only client, so needs hydrate
    // this is just for a better ux, supports css variables for light/dark, media queries, etc
    disableClassName

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
      hasEnterState
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

  const setStateShallow = useCreateShallowSetState(setState, props.debug)

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
    // see issue if not, Button sets disableClassName to true <Button animation="" /> with
    // the react-native driver errors because it tries to animate var(--color) to rbga(..)
    // no matter what if fully unmounted or on the server we use className
    // only once we hydrate do we switch to spring animation drivers or disableClassName etc
    if (isWeb && isHydrated) {
      // the reason we disable class even for css animation driver is i guess due to the logic around looking at transform
      // in the driver to determine the transition - but that could be improved to not need it and just use classnames
      const isAnimatedAndHydrated = isAnimated && isHydrated

      const isClassNameDisabled =
        !staticConfig.acceptsClassName && (config.disableSSR || !state.unmounted)

      const isDisabledManually = disableClassName && !state.unmounted

      if (isAnimatedAndHydrated || isDisabledManually || isClassNameDisabled) {
        noClass = true

        if (process.env.NODE_ENV === 'development' && props.debug) {
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
    startedUnhydrated,
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
    supportsCSS,
    willBeAnimated,
    willBeAnimatedClient,
  }
}

function hasAnimatedStyleValue(style: Object) {
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
