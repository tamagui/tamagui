import {
  defaultComponentState,
  defaultComponentStateMounted,
  defaultComponentStateShouldEnter,
} from '../defaultComponentState'
import { useDidHydrateOnce } from '../hooks/useDidHydrateOnce'
import { useRef, useState } from 'react'
import type {
  ComponentContextI,
  GroupStateListener,
  StackProps,
  StaticConfig,
  TamaguiComponentState,
  TamaguiComponentStateRef,
  TamaguiInternalConfig,
  TextProps,
  UseAnimationHook,
} from '../types'
import { isServer, isWeb } from '@tamagui/constants'
import { createShallowSetState } from '../helpers/createShallowSetState'
import { isObj } from '../helpers/isObj'
import { log } from '../helpers/log'

export const useComponentState = (
  props: StackProps | TextProps | Record<string, any>,
  { animationDriver, groups }: ComponentContextI,
  staticConfig: StaticConfig,
  config: TamaguiInternalConfig
) => {
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

  // disable for now still ssr issues
  const supportsCSSVars = animationDriver?.supportsCSSVars
  const curStateRef = stateRef.current

  const willBeAnimatedClient = (() => {
    const next = !!(hasAnimationProp && !staticConfig.isHOC && useAnimations)
    return Boolean(next || curStateRef.hasAnimated)
  })()

  const willBeAnimated = !isServer && willBeAnimatedClient

  // once animated, always animated to preserve hooks / vdom structure
  if (willBeAnimated && !curStateRef.hasAnimated) {
    curStateRef.hasAnimated = true
  }

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
  // finish animated logic, avoid isAnimated when unmounted
  const hasRNAnimation = hasAnimationProp && animationDriver?.isReactNative

  const hasEnterState = hasEnterStyle || isEntering

  // this can be conditional because its only ever needed with animations
  const didHydrateOnce = willBeAnimated ? useDidHydrateOnce() : true
  const shouldEnter = hasEnterState || (!didHydrateOnce && hasRNAnimation)
  const shouldEnterFromUnhydrated = isWeb && !didHydrateOnce

  const initialState = shouldEnter
    ? // on the very first render we switch all spring animation drivers to css rendering
      // this is because we need to use css variables, which they don't support to do proper SSR
      // without flickers of the wrong colors.
      // but once we do that initial hydration and we are in client side rendering mode,
      // we can avoid the extra re-render on mount
      shouldEnterFromUnhydrated
      ? defaultComponentState
      : defaultComponentStateShouldEnter
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

  const isHydrated = state.unmounted === false || state.unmounted === 'should-enter'

  // only web server + initial client render run this when not hydrated:
  let isAnimated = willBeAnimated
  if (isWeb && hasRNAnimation && !staticConfig.isHOC && state.unmounted === true) {
    isAnimated = false
    curStateRef.willHydrate = true
  }

  // immediately update disabled state and reset component state
  if (disabled !== state.disabled) {
    state.disabled = disabled
    // if disabled remove all press/focus/hover states
    if (disabled) {
      Object.assign(state, defaultComponentStateMounted)
    }
    setState({ ...state })
  }

  let setStateShallow = createShallowSetState(setState, disabled, false, props.debug)

  // if (isHydrated && state.unmounted === 'should-enter') {
  //   state.unmounted = true
  // }

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

  let shouldAvoidClasses = !isWeb

  // on server for SSR and animation compat added the && isHydrated but perhaps we want
  // disableClassName="until-hydrated" to be more straightforward
  // see issue if not, Button sets disableClassName to true <Button animation="" /> with
  // the react-native driver errors because it tries to animate var(--color) to rbga(..)
  if (isWeb) {
    const { disableClassName } = props

    const isAnimatedAndHydrated =
      isAnimated && !supportsCSSVars && didHydrateOnce && !isServer

    const isClassNameDisabled =
      !staticConfig.acceptsClassName && (config.disableSSR || didHydrateOnce)

    const isDisabledManually =
      disableClassName && !isServer && didHydrateOnce && state.unmounted === true

    if (isAnimatedAndHydrated || isDisabledManually || isClassNameDisabled) {
      shouldAvoidClasses = true

      if (process.env.NODE_ENV === 'development' && props.debug) {
        log(`avoiding className`, {
          isAnimatedAndHydrated,
          isDisabledManually,
          isClassNameDisabled,
        })
      }
    }
  }

  const groupName = props.group as any as string

  if (groupName && !curStateRef.group) {
    const listeners = new Set<GroupStateListener>()
    curStateRef.group = {
      listeners,
      emit(name, state) {
        listeners.forEach((l) => l(name, state))
      },
      subscribe(cb) {
        listeners.add(cb)
        return () => {
          listeners.delete(cb)
        }
      },
    }
  }

  if (groupName) {
    // when we set state we also set our group state and emit an event for children listening:
    const groupContextState = groups.state
    const og = setStateShallow
    setStateShallow = (state) => {
      og(state)
      curStateRef.group!.emit(groupName, {
        pseudo: state,
      })
      // and mutate the current since its concurrent safe (children throw it in useState on mount)
      const next = {
        ...groupContextState[groupName],
        ...state,
      }
      groupContextState[groupName] = next
    }
  }

  return {
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
    shouldAvoidClasses,
    state,
    stateRef,
    supportsCSSVars,
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
    props.accessibilityState?.disabled ||
    props['aria-disabled'] ||
    props.accessibilityDisabled ||
    false
  )
}
