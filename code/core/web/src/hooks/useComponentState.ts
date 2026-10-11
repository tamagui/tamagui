import { getPlatformDriver, isServer, isWeb } from '@tamagui/constants'
import { mergeIfNotShallowEqual } from '@tamagui/is-equal-shallow'
import { useDidFinishSSR, useIsClientOnly } from '@tamagui/use-did-finish-ssr'
import { useRef, useState } from 'react'
import { getSetting } from '../config'
import { isOptimizedForFirstRender } from './isOptimizedForFirstRender'
import { defaultComponentStateMounted } from '../defaultComponentState'
import { isObj } from '../helpers/isObj'
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
    undefined as unknown as TamaguiComponentStateRef
  )

  const curStateRef = (stateRef.current ||= {
    startedUnhydrated: needsHydration && !isHydrated,
    optimizeForFirstRender: isOptimizedForFirstRender(),
  })

  const hasAnimationProp = Boolean(
    (!isHOC && 'transition' in props) ||
    (props.style && hasAnimatedStyleValue(props.style))
  )

  const inputStyle = animationDriver?.inputStyle ?? 'css'
  const outputStyle = animationDriver?.outputStyle ?? 'css'

  if (!needsHydration && hasAnimationProp) {
    curStateRef.hasAnimated = true
  }

  const platformPseudoPossible = Boolean(
    !isHOC &&
    useAnimations &&
    animationDriver?.avoidReRenders &&
    getPlatformDriver()?.pseudo
  )

  const willBeAnimatedClient = Boolean(
    ((hasAnimationProp || platformPseudoPossible) && !isHOC && useAnimations) ||
    curStateRef.hasAnimated
  )

  const willBeAnimated = !isServer && willBeAnimatedClient

  if (willBeAnimated && hasAnimationProp && !curStateRef.hasAnimated) {
    curStateRef.hasAnimated = true
  }

  const { disableClassName } = props

  const animatePresenceOptIn =
    willBeAnimated && !isHOC && props['animatePresence'] !== false
  if (animatePresenceOptIn) {
    curStateRef.shouldRegisterPresence = true
  } else {
    curStateRef.shouldRegisterPresence ??= false
  }

  const presenceResult = animationDriver?.usePresence?.(curStateRef) || null
  const presence = animatePresenceOptIn ? presenceResult : null

  const presenceState = presence?.[2]
  const isExiting = presenceState?.isPresent === false
  const isEntering = presenceState?.isPresent === true && presenceState.initial !== false

  const hasAnimationThatNeedsHydrate =
    hasAnimationProp && !isHydrated && inputStyle !== 'css'

  const disabled = isDisabled(props)

  const [componentState, reactSetState] = useState<TamaguiComponentState>(() =>
    disabled != null
      ? { ...defaultComponentStateMounted, disabled }
      : defaultComponentStateMounted
  )

  const initialStyleFrameUnmounted = curStateRef.initialStyleFrameUnmounted
  let state =
    (!curStateRef.didFinalizeInitialStyleFrame && !isHOC) ||
    initialStyleFrameUnmounted !== undefined
      ? { ...componentState }
      : componentState
  if (!curStateRef.didFinalizeInitialStyleFrame && !isHOC) {
    state.unmounted = true
  }
  if (initialStyleFrameUnmounted !== undefined) {
    state.unmounted = initialStyleFrameUnmounted
  }
  if (props.forceStyle) {
    if (state === componentState) state = { ...state }
    state[props.forceStyle] = true
  }

  const setState = (curStateRef.setState ||= (stateOrGetState) => {
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
  })

  let isAnimated = willBeAnimated
  if (isWeb && hasAnimationThatNeedsHydrate && !isHOC && !isHydrated) {
    isAnimated = false
    curStateRef.willHydrate = true
  }

  if (disabled !== state.disabled) {
    if (disabled) {
      Object.assign(state, defaultComponentStateMounted)
    }
    state.disabled = disabled
    setState((_) => ({ ...state }))
  }

  const groupName = props.group as any as string | undefined

  const setStateShallow = (curStateRef.baseSetStateShallow ||= (stateOrGetState: any) => {
    setState((prev: any) => {
      const next =
        typeof stateOrGetState === 'function' ? stateOrGetState(prev) : stateOrGetState
      return mergeIfNotShallowEqual(prev, next)
    })
  })

  let outProps: typeof props = props
  if (presenceState && isAnimated && isHydrated && staticConfig.variants) {
    const { custom } = presenceState
    if (isObj(custom)) {
      outProps = { ...props, ...custom }
    }
  }

  let noClass = !isWeb || Boolean(props.forceStyle)

  if (isWeb) {
    if (!isHydrated) {
      noClass = false
    } else {
      const isAnimatedAndHydrated = Boolean(
        (hasAnimationProp || curStateRef.hasAnimated) && useAnimations && !isHOC
      )
      const isClassNameDisabled =
        !staticConfig.acceptsClassName && (getSetting('disableSSR') || !state.unmounted)
      const isDisabledManually = Boolean(disableClassName && !state.unmounted)

      if (
        (isAnimatedAndHydrated && outputStyle !== 'css') ||
        isDisabledManually ||
        isClassNameDisabled
      ) {
        noClass = true
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
        isWeb && hasAnimationThatNeedsHydrate && !isHOC && !isHydrated
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
