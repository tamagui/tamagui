import { useComposedRefs } from '@tamagui/compose-refs'
import { isClient, isServer, isWeb } from '@tamagui/constants'
import { composeEventHandlers, validStyles } from '@tamagui/helpers'
import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import React, {
  Children,
  Fragment,
  createElement,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import { devConfig, getConfig, onConfiguredOnce } from './config'
import { stackDefaultStyles } from './constants/constants'
import { ComponentContext } from './contexts/ComponentContext'
import { didGetVariableValue, setDidGetVariableValue } from './createVariable'
import {
  defaultComponentState,
  defaultComponentStateMounted,
  defaultComponentStateShouldEnter,
} from './defaultComponentState'
import {
  createShallowSetState,
  mergeIfNotShallowEqual,
} from './helpers/createShallowSetState'
import { useSplitStyles } from './helpers/getSplitStyles'
import { log } from './helpers/log'
import { mergeProps } from './helpers/mergeProps'
import { proxyThemeVariables } from './helpers/proxyThemeVariables'
import { themeable } from './helpers/themeable'
import { mediaKeyMatch, setMediaShouldUpdate, useMedia } from './hooks/useMedia'
import { useThemeWithState } from './hooks/useTheme'
import { hooks } from './setupHooks'
import {
  ComponentContextI,
  DebugProp,
  DisposeFn,
  GroupState,
  GroupStateListener,
  LayoutEvent,
  SizeTokens,
  SpaceDirection,
  SpaceValue,
  SpacerProps,
  StackProps,
  StackPropsBase,
  StaticConfig,
  StyleableOptions,
  TamaguiComponent,
  TamaguiComponentEvents,
  TamaguiComponentState,
  TamaguiElement,
  TamaguiInternalConfig,
  TextProps,
  UseAnimationHook,
  UseAnimationProps,
  UseThemeWithStateProps,
  WebOnlyPressEvents,
} from './types'
import { Slot } from './views/Slot'
import { getThemedChildren } from './views/Theme'
import { ThemeDebug } from './views/ThemeDebug'

// this appears to fix expo / babel not picking this up sometimes? really odd
process.env.TAMAGUI_TARGET

/**
 * All things that need one-time setup after createTamagui is called
 */
let tamaguiConfig: TamaguiInternalConfig
let initialTheme: any
let time: any

let debugKeyListeners: Set<Function> | undefined
let startVisualizer: Function | undefined

export const mouseUps = new Set<Function>()
if (typeof document !== 'undefined') {
  const cancelTouches = () => {
    mouseUps.forEach((x) => x())
    mouseUps.clear()
  }
  addEventListener('mouseup', cancelTouches)
  addEventListener('touchend', cancelTouches)
  addEventListener('touchcancel', cancelTouches)

  // hold option to see debug visualization
  if (process.env.NODE_ENV === 'development') {
    startVisualizer = () => {
      const devVisualizerConfig = devConfig?.visualizer
      if (devVisualizerConfig) {
        debugKeyListeners = new Set()
        let tm
        let isShowing = false
        const options = {
          key: 'Alt',
          delay: 800,
          ...(typeof devVisualizerConfig === 'object' ? devVisualizerConfig : {}),
        }

        document.addEventListener('blur', () => {
          clearTimeout(tm)
        })

        document.addEventListener('keydown', ({ key, defaultPrevented }) => {
          if (defaultPrevented) return
          clearTimeout(tm) // always clear so we dont trigger on chords
          if (key === options.key) {
            tm = setTimeout(() => {
              isShowing = true
              debugKeyListeners?.forEach((l) => l(true))
            }, options.delay)
          }
        })

        document.addEventListener('keyup', ({ key, defaultPrevented }) => {
          if (defaultPrevented) return
          if (key === options.key) {
            clearTimeout(tm)
            if (isShowing) {
              debugKeyListeners?.forEach((l) => l(false))
            }
          }
        })
      }
    }
  }
}

/**
 * Only on native do we need the actual underlying View/Text
 * On the web we avoid react-native dep altogether.
 */
let BaseText: any
let BaseView: any
let hasSetupBaseViews = false

export function createComponent<
  ComponentPropTypes extends StackProps | TextProps = {},
  Ref = TamaguiElement,
  BaseProps = never
>(staticConfig: StaticConfig) {
  let config: TamaguiInternalConfig | null = null
  let defaultProps = staticConfig.defaultProps

  onConfiguredOnce((conf) => {
    config = conf

    if (staticConfig.componentName) {
      const defaultForComponent = conf.defaultProps?.[staticConfig.componentName]
      if (defaultForComponent) {
        defaultProps = { ...defaultForComponent, ...defaultProps }
      }
    }

    // one time only setup
    if (!tamaguiConfig) {
      tamaguiConfig = conf

      if (!initialTheme) {
        const next = conf.themes[Object.keys(conf.themes)[0]]
        initialTheme = proxyThemeVariables(next)
        if (process.env.NODE_ENV === 'development') {
          if (!initialTheme) {
            log('Warning: Missing theme')
          }
        }
      }
    }
  })

  const {
    Component,
    isText,
    isZStack,
    isHOC,
    validStyles = {},
    variants = {},
  } = staticConfig

  const defaultComponentClassName = `is_${staticConfig.componentName}`

  if (process.env.NODE_ENV === 'development' && staticConfig.defaultProps?.['debug']) {
    if (process.env.IS_STATIC !== 'is_static') {
      log(`🐛 [${staticConfig.componentName || 'Component'}]`, {
        staticConfig,
        defaultProps,
        defaultPropsKeyOrder: defaultProps ? Object.keys(defaultProps) : [],
      })
    }
  }

  const component = forwardRef<Ref, ComponentPropTypes>((propsIn, forwardedRef) => {
    const internalID = process.env.NODE_ENV === 'development' ? useId() : ''

    if (process.env.NODE_ENV === 'development') {
      if (startVisualizer) {
        startVisualizer()
        startVisualizer = undefined
      }
    }

    if (process.env.TAMAGUI_TARGET === 'native') {
      // todo this could be moved to a cleaner location
      if (!hasSetupBaseViews) {
        hasSetupBaseViews = true
        const baseViews = hooks.getBaseViews?.()
        if (baseViews) {
          BaseText = baseViews.Text
          BaseView = baseViews.View
        }
      }
    }

    // test only
    if (process.env.NODE_ENV === 'test') {
      if (propsIn['data-test-renders']) {
        propsIn['data-test-renders']['current'] ??= 0
        propsIn['data-test-renders']['current'] += 1
      }
    }

    const componentContext = useContext(ComponentContext)

    // set variants through context
    // order is after default props but before props
    let styledContextProps: Object | undefined
    let overriddenContextProps: Object | undefined
    let contextValue: Object | null | undefined
    const { context } = staticConfig

    if (context) {
      contextValue = useContext(context)
      const { inverseShorthands } = getConfig()
      for (const key in context.props) {
        const propVal =
          // because its after default props but before props this annoying amount of checks
          propsIn[key] ??
          propsIn[inverseShorthands[key]] ??
          defaultProps?.[key] ??
          defaultProps?.[inverseShorthands[key]]
        // if not set, use context
        if (propVal === undefined) {
          if (contextValue) {
            const isValidValue = key in validStyles || key in variants
            if (isValidValue) {
              styledContextProps ||= {}
              styledContextProps[key] = contextValue[key]
            }
          }
        }
        // if set in props, update context
        else {
          overriddenContextProps ||= {}
          overriddenContextProps[key] = propVal
        }
      }
    }

    // context overrides defaults but not props
    const curDefaultProps = styledContextProps
      ? { ...defaultProps, ...styledContextProps }
      : defaultProps

    // React inserts default props after your props for some reason...
    // order important so we do loops, you can't just spread because JS does weird things
    let props: StackProps | TextProps = propsIn
    if (curDefaultProps) {
      props = mergeProps(curDefaultProps, propsIn)
    }

    const debugProp = props['debug'] as DebugProp
    const componentName = props.componentName || staticConfig.componentName

    if (process.env.NODE_ENV === 'development' && isClient) {
      useEffect(() => {
        let overlay: HTMLSpanElement | null = null

        const debugVisualizerHandler = (show = false) => {
          const node = hostRef.current as HTMLElement
          if (!node) return

          if (show) {
            overlay = document.createElement('span')
            overlay.style.inset = '0px'
            overlay.style.zIndex = '1000000'
            overlay.style.position = 'absolute'
            overlay.style.borderColor = 'red'
            overlay.style.borderWidth = '1px'
            overlay.style.borderStyle = 'dotted'

            const dataAt = node.getAttribute('data-at') || ''
            const dataIn = node.getAttribute('data-in') || ''

            const tooltip = document.createElement('span')
            tooltip.style.position = 'absolute'
            tooltip.style.top = '0px'
            tooltip.style.left = '0px'
            tooltip.style.padding = '3px'
            tooltip.style.background = 'rgba(0,0,0,0.75)'
            tooltip.style.color = 'rgba(255,255,255,1)'
            tooltip.style.fontSize = '12px'
            tooltip.style.lineHeight = '12px'
            tooltip.style.fontFamily = 'monospace'
            tooltip.style['webkitFontSmoothing'] = 'none'
            tooltip.innerText = `${componentName || ''} ${dataAt} ${dataIn}`.trim()

            overlay.appendChild(tooltip)
            node.appendChild(overlay)
          } else {
            if (overlay) {
              node.removeChild(overlay)
            }
          }
        }
        debugKeyListeners ||= new Set()
        debugKeyListeners.add(debugVisualizerHandler)
        return () => {
          debugKeyListeners?.delete(debugVisualizerHandler)
        }
      }, [componentName])
    }

    if (
      !process.env.TAMAGUI_IS_CORE_NODE &&
      process.env.NODE_ENV === 'development' &&
      debugProp === 'profile' &&
      !time
    ) {
      const timer = require('@tamagui/timer').timer()
      time = timer.start()
    }
    if (process.env.NODE_ENV === 'development' && time) time`start (ignore)`

    const isHydrated = config?.disableSSR ? true : useDidFinishSSR()

    if (process.env.NODE_ENV === 'development' && time) time`did-finish-ssr`

    // conditional but if ever true stays true
    // [animated, inversed]
    const stateRef = useRef(
      {} as any as {
        hasMeasured?: boolean
        hasAnimated?: boolean
        themeShallow?: boolean
        isListeningToTheme?: boolean
        group?: {
          listeners: Set<GroupStateListener>
          emit: GroupStateListener
          subscribe: (cb: GroupStateListener) => () => void
        }
      }
    )

    if (process.env.NODE_ENV === 'development' && time) time`stateref`

    const hostRef = useRef<TamaguiElement>(null)

    /**
     * Component state for tracking animations, pseudos
     */
    const animationsConfig = componentContext.animationDriver
    const useAnimations = animationsConfig?.useAnimations as UseAnimationHook | undefined

    // after we get states mount we need to turn off isAnimated for server side
    const hasAnimationProp = Boolean(
      props.animation || (props.style && hasAnimatedStyleValue(props.style))
    )

    // disable for now still ssr issues
    const supportsCSSVars = animationsConfig?.supportsCSSVars

    const willBeAnimated = (() => {
      if (isServer && !supportsCSSVars) return false
      const curState = stateRef.current
      const next = !!(hasAnimationProp && !isHOC && useAnimations)
      return Boolean(next || curState.hasAnimated)
    })()

    const usePresence = animationsConfig?.usePresence
    const presence = (willBeAnimated && usePresence?.()) || null

    const hasEnterStyle = !!props.enterStyle
    const needsMount = Boolean((isWeb ? isClient : true) && willBeAnimated)

    if (process.env.NODE_ENV === 'development' && time) time`pre-use-state`

    const initialState = willBeAnimated
      ? supportsCSSVars
        ? defaultComponentStateShouldEnter!
        : defaultComponentState!
      : defaultComponentStateMounted!

    const states = useState<TamaguiComponentState>(initialState)

    const state = propsIn.forceStyle
      ? { ...states[0], [propsIn.forceStyle]: true }
      : states[0]
    const setState = states[1]

    let setStateShallow = createShallowSetState(setState)

    const groupName = props.group as any as string
    const groupClassName = groupName ? `t_group_${props.group}` : ''

    if (groupName && !stateRef.current.group) {
      const listeners = new Set<GroupStateListener>()
      stateRef.current.group = {
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
      const groupContextState = componentContext.groups.state
      const og = setStateShallow
      setStateShallow = (state) => {
        og(state)
        stateRef.current.group!.emit(groupName, {
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

    if (process.env.NODE_ENV === 'development' && time) time`use-state`

    let isAnimated = willBeAnimated

    if (willBeAnimated && !supportsCSSVars) {
      if (!presence && isHydrated) {
        if (isServer || state.unmounted === true) {
          isAnimated = false
        }
      }
    }

    // once animated, always animated to preserve hooks
    if (willBeAnimated && !stateRef.current.hasAnimated) {
      stateRef.current.hasAnimated = true
    }

    const componentClassName = props.asChild
      ? ''
      : props.componentName
      ? `is_${props.componentName}`
      : defaultComponentClassName

    const hasTextAncestor = !!(isWeb && isText ? componentContext.inText : false)
    const isDisabled = props.disabled ?? props.accessibilityState?.disabled

    if (process.env.NODE_ENV === 'development' && time) time`use-context`

    const isTaggable = !Component || typeof Component === 'string'
    // default to tag, fallback to component (when both strings)
    const element = isWeb ? (isTaggable ? props.tag || Component : Component) : Component

    const BaseTextComponent = BaseText || element || 'span'
    const BaseViewComponent = BaseView || element || (hasTextAncestor ? 'span' : 'div')

    let elementType = isText ? BaseTextComponent : BaseViewComponent
    if (animationsConfig && willBeAnimated) {
      elementType = animationsConfig[isText ? 'Text' : 'View'] || elementType
    }

    // set enter/exit variants onto our new props object
    if (isAnimated && presence) {
      const presenceState = presence[2]
      if (presenceState) {
        const isEntering = state.unmounted
        const isExiting = !presenceState.isPresent
        const enterExitVariant = presenceState.enterExitVariant
        const enterVariant = enterExitVariant ?? presenceState.enterVariant
        const exitVariant = enterExitVariant ?? presenceState.exitVariant

        if (isEntering && enterVariant) {
          if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
            console.warn(`Animating presence ENTER "${enterVariant}"`)
          }

          props[enterVariant] = true
        } else if (isExiting && exitVariant) {
          if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
            console.warn(`Animating presence EXIT "${enterVariant}"`)
          }

          props[exitVariant] = enterExitVariant ? false : true
        }
      }
    }

    const isAnimatedReactNative = hasAnimationProp && animationsConfig?.isReactNative
    const isReactNative = Boolean(staticConfig.isReactNative || isAnimatedReactNative)
    const shouldAvoidClasses = Boolean(
      !isWeb || isAnimated || !staticConfig.acceptsClassName || propsIn.disableClassName
    )

    const shouldForcePseudo = !!propsIn.forceStyle
    const noClassNames = shouldAvoidClasses || shouldForcePseudo

    // internal use only
    const disableThemeProp =
      process.env.TAMAGUI_TARGET === 'native' ? false : props['data-disable-theme']
    const disableTheme = (disableThemeProp && !willBeAnimated) || isHOC

    if (process.env.NODE_ENV === 'development' && time) time`theme-props`

    if (props.themeShallow) {
      stateRef.current.themeShallow = true
    }

    const themeStateProps: UseThemeWithStateProps = {
      name: props.theme,
      componentName,
      disable: disableTheme,
      shallow: stateRef.current.themeShallow,
      inverse: props.themeInverse,
      debug: debugProp,
    }

    if (typeof stateRef.current.isListeningToTheme === 'boolean') {
      themeStateProps.shouldUpdate = () => stateRef.current.isListeningToTheme
    }

    // on native we optimize theme changes if fastSchemeChange is enabled, otherwise deopt
    if (process.env.TAMAGUI_TARGET === 'native') {
      themeStateProps.deopt = willBeAnimated
    }

    const isExiting = Boolean(!state.unmounted && presence?.[0] === false)

    if (process.env.NODE_ENV === 'development') {
      if (debugProp && debugProp !== 'profile') {
        // prettier-ignore
        const name = `${
          componentName || Component?.displayName || Component?.name || "[Unnamed Component]"
        }`;
        const type = isAnimatedReactNative ? '(animated)' : isReactNative ? '(rnw)' : ''
        const dataIs = propsIn['data-is'] || ''
        const banner = `${name}${dataIs ? ` ${dataIs}` : ''} ${type} id ${internalID}`
        console.group(
          `%c ${banner} (unmounted: ${state.unmounted})${
            presence ? ` (presence: ${presence[0]})` : ''
          } ${isHydrated ? '💦' : '🏜️'}`,
          'background: green; color: white;'
        )
        if (!isServer) {
          console.groupCollapsed(
            `Info (collapsed): ${state.press || state.pressIn ? 'PRESSED ' : ''}${
              state.hover ? 'HOVERED ' : ''
            }${state.focus ? 'FOCUSED' : ' '}`
          )

          log({
            propsIn,
            props,
            state,
            staticConfig,
            elementType,
            themeStateProps,
            styledContext: { contextProps: styledContextProps, overriddenContextProps },
            presence,
            isAnimated,
            isHOC,
            hasAnimationProp,
            useAnimations,
            propsInOrder: Object.keys(propsIn),
            propsOrder: Object.keys(props),
          })
          console.groupEnd()
        }
      }
    }

    if (process.env.NODE_ENV === 'development' && time) time`pre-theme-media`

    const [themeState, theme] = useThemeWithState(themeStateProps)

    elementType = Component || elementType
    const isStringElement = typeof elementType === 'string'

    if (process.env.NODE_ENV === 'development' && time) time`theme`

    const mediaState = useMedia(stateRef, componentContext)

    if (process.env.NODE_ENV === 'development' && time) time`media`

    setDidGetVariableValue(false)

    const resolveValues =
      // if HOC + mounted + has animation prop, resolve as value so it passes non-variable to child
      (isAnimated && !supportsCSSVars) ||
      (isHOC && state.unmounted == false && hasAnimationProp)
        ? 'value'
        : 'auto'

    // temp: once we fix above we can disable this
    const keepStyleSSR = willBeAnimated && animationsConfig?.keepStyleSSR

    const styleProps = {
      mediaState,
      noClassNames,
      resolveValues,
      isExiting,
      isAnimated,
      keepStyleSSR,
    } as const

    const splitStyles = useSplitStyles(
      props,
      staticConfig,
      theme,
      themeState?.state?.name || '',
      state,
      styleProps,
      null,
      componentContext,
      elementType,
      debugProp
    )

    // hide strategy will set this opacity = 0 until measured
    if (props.group && props.untilMeasured === 'hide' && !stateRef.current.hasMeasured) {
      splitStyles.style.opacity = 0
    }

    if (process.env.NODE_ENV === 'development' && time) time`split-styles`

    stateRef.current.isListeningToTheme = splitStyles.dynamicThemeAccess

    // only listen for changes if we are using raw theme values or media space, or dynamic media (native)
    // array = space media breakpoints
    const isMediaArray = splitStyles.hasMedia && Array.isArray(splitStyles.hasMedia)
    const shouldListenForMedia =
      didGetVariableValue() ||
      isMediaArray ||
      (noClassNames && splitStyles.hasMedia === true)
    const mediaListeningKeys = isMediaArray ? (splitStyles.hasMedia as any) : null

    setMediaShouldUpdate(stateRef, {
      enabled: shouldListenForMedia,
      keys: mediaListeningKeys,
    })

    // animation setup
    const isAnimatedReactNativeWeb = hasAnimationProp && isReactNative

    if (process.env.NODE_ENV === 'development') {
      if (!process.env.TAMAGUI_TARGET) {
        console.error(
          `No process.env.TAMAGUI_TARGET set, please set it to "native" or "web".`
        )
      }

      if (debugProp && debugProp !== 'profile') {
        console.groupCollapsed('>>>')

        log('props in', propsIn, 'mapped to', props, 'in order', Object.keys(props))
        log('splitStyles', splitStyles)
        log('media', { shouldListenForMedia, isMediaArray, mediaListeningKeys })
        log('className', Object.values(splitStyles.classNames))
        if (isClient) {
          log('ref', hostRef, '(click to view)')
        }
        console.groupEnd()
        if (debugProp === 'break') {
          // biome-ignore lint/suspicious/noDebugger: ok
          debugger
        }
      }
    }

    const {
      viewProps: viewPropsIn,
      pseudos,
      style: splitStylesStyle,
      classNames,
      space,
    } = splitStyles

    const propsWithAnimation = props as UseAnimationProps

    // once you set animation prop don't remove it, you can set to undefined/false
    // reason is animations are heavy - no way around it, and must be run inline here (🙅 loading as a sub-component)
    let animationStyles: any
    if (willBeAnimated && useAnimations && !isHOC) {
      const animations = useAnimations({
        props: propsWithAnimation,
        // if hydrating, send empty style
        style: splitStylesStyle,
        // style: splitStylesStyle,
        presence,
        componentState: state,
        styleProps,
        theme: themeState.state?.theme!,
        pseudos: pseudos || null,
        hostRef,
        staticConfig,
      })

      if (isAnimated && animations) {
        animationStyles = animations.style
      }

      if (process.env.NODE_ENV === 'development' && time) time`animations`
    }

    const {
      asChild,
      children,
      themeShallow,
      spaceDirection: _spaceDirection,
      disabled: disabledProp,
      onPress,
      onLongPress,
      onPressIn,
      onPressOut,
      onHoverIn,
      onHoverOut,
      onMouseUp,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      separator,
      // ignore from here on out
      forceStyle: _forceStyle,
      // @ts-ignore  for next/link compat etc
      onClick,
      theme: _themeProp,
      // @ts-ignore
      defaultVariants,

      ...nonTamaguiProps
    } = viewPropsIn

    if (process.env.NODE_ENV === 'development' && props.untilMeasured && !props.group) {
      console.warn(
        `You set the untilMeasured prop without setting group. This doesn't work, be sure to set untilMeasured on the parent that sets group, not the children that use the $group- prop.\n\nIf you meant to do this, you can disable this warning - either change untilMeasured and group at the same time, or do group={conditional ? 'name' : undefined}`
      )
    }

    if (process.env.NODE_ENV === 'development' && time) time`destructure`

    const disabled =
      props.accessibilityState?.disabled ||
      // @ts-expect-error (comes from core)
      props.accessibilityDisabled

    // these can ultimately be for DOM, react-native-web views, or animated views
    // so the type is pretty loose
    let viewProps = nonTamaguiProps

    if (hasAnimationProp && props.tag && !props.role && !props.accessibilityRole) {
      viewProps.role = props.tag as any
    }

    if (isHOC && _themeProp) {
      viewProps.theme = _themeProp
    }

    if (groupName) {
      nonTamaguiProps.onLayout = composeEventHandlers(
        nonTamaguiProps.onLayout,
        (e: LayoutEvent) => {
          stateRef.current.group!.emit(groupName, {
            layout: e.nativeEvent.layout,
          })

          // force re-render if measure strategy is hide
          if (!stateRef.current.hasMeasured && props.untilMeasured === 'hide') {
            setState((prev) => ({ ...prev }))
          }

          stateRef.current.hasMeasured = true
        }
      )
    }

    // if react-native-web view just pass all props down
    if (process.env.TAMAGUI_TARGET === 'web' && !isReactNative && !asChild) {
      viewProps = hooks.usePropsTransform?.(elementType, nonTamaguiProps, hostRef)
    } else {
      viewProps = nonTamaguiProps
    }

    const composedRef = useComposedRefs(hostRef as any, forwardedRef)
    viewProps.ref = composedRef

    if (process.env.NODE_ENV === 'development') {
      if (!isReactNative && !isText && isWeb && !isHOC) {
        Children.toArray(props.children).forEach((item) => {
          // allow newlines because why not its annoying with mdx
          if (typeof item === 'string' && item !== '\n') {
            console.error(
              `Unexpected text node: ${item}. A text node cannot be a child of a <View>.`
            )
          }
        })
      }
    }

    if (process.env.NODE_ENV === 'development' && time) time`events-hooks`

    let unPress = () =>
      setStateShallow({
        press: false,
        pressIn: false,
      })

    if (process.env.TAMAGUI_TARGET === 'web') {
      // needs to be referentially stable for web as we add to mouseUps
      unPress = useCallback(unPress, [])
    }

    // combined multiple effects into one for performance so be careful with logic
    // should not be a layout effect because otherwise it wont render the initial state
    // for example css driver needs to render once with the first styles, then again with the next
    // if its a layout effect it will just skip that first <render >output
    const shouldSetMounted = needsMount && state.unmounted
    const { pseudoGroups, mediaGroups } = splitStyles

    useEffect(() => {
      if (shouldSetMounted) {
        const unmounted =
          state.unmounted === true && hasEnterStyle ? 'should-enter' : false
        setStateShallow({
          unmounted,
        })
        return
        // no need for mouseUp removal effect if its not even mounted yet
      }

      // parent group pseudo listening
      let disposeGroupsListener: DisposeFn | undefined
      if (pseudoGroups || mediaGroups) {
        const current = {
          pseudo: {},
          media: {},
        } satisfies GroupState
        disposeGroupsListener = componentContext.groups.subscribe(
          (name, { layout, pseudo }) => {
            if (pseudo && pseudoGroups?.has(name)) {
              // we emit a partial so merge it + change reference so mergeIfNotShallowEqual runs
              Object.assign(current.pseudo, pseudo)
              persist()
            } else if (layout && mediaGroups) {
              const mediaState = getMediaState(mediaGroups, layout)
              const next = mergeIfNotShallowEqual(current.media, mediaState)
              if (next !== current.media) {
                Object.assign(current.media, next)
                persist()
              }
            }
            function persist() {
              setStateShallow({
                // force it to be referentially different so it always updates
                group: {
                  ...state.group,
                  [name]: current,
                },
              })
            }
          }
        )
      }

      return () => {
        disposeGroupsListener?.()
        mouseUps.delete(unPress)
      }
    }, [
      shouldSetMounted,
      state.unmounted,
      pseudoGroups ? Object.keys([...pseudoGroups]).join('') : 0,
      mediaGroups ? Object.keys([...mediaGroups]).join('') : 0,
    ])

    const avoidAnimationStyle = keepStyleSSR && state.unmounted === true

    let fontFamily = isText
      ? splitStyles.fontFamily || staticConfig.defaultProps?.fontFamily
      : null
    if (fontFamily && fontFamily[0] === '$') {
      fontFamily = fontFamily.slice(1)
    }
    const fontFamilyClassName = fontFamily ? `font_${fontFamily}` : ''

    const style = avoidAnimationStyle
      ? splitStyles.style
      : animationStyles || splitStyles.style

    let className: string | undefined

    const asChildExceptStyleLike =
      asChild === 'except-style' || asChild === 'except-style-web'

    if (!asChildExceptStyleLike) {
      if (process.env.TAMAGUI_TARGET === 'web') {
        let classList: string[] = []
        if (componentName) classList.push(componentClassName)
        if (fontFamilyClassName) classList.push(fontFamilyClassName)
        if (classNames) classList.push(Object.values(classNames).join(' '))
        if (groupClassName) classList.push(groupClassName)

        className = classList.join(' ')

        if (isAnimatedReactNativeWeb && !avoidAnimationStyle) {
          viewProps.style = style
        } else if (isReactNative) {
          // TODO these shouldn't really return from getSplitStyles when in Native mode
          const cnStyles = { $$css: true }
          for (const name of className.split(' ')) {
            cnStyles[name] = name
          }
          viewProps.style = [...(Array.isArray(style) ? style : [style]), cnStyles]
        } else {
          if (className) {
            viewProps.className = className
          }
          viewProps.style = style
        }
      } else {
        // native assign styles
        viewProps.style = style
      }
    }

    // if its a group its gotta listen for pseudos to emit them to children

    const runtimePressStyle = !disabled && noClassNames && pseudos?.pressStyle
    const runtimeFocusStyle = !disabled && noClassNames && pseudos?.focusStyle
    const attachFocus = Boolean(runtimePressStyle || onFocus || onBlur)
    const attachPress = Boolean(
      groupName ||
        runtimePressStyle ||
        onPress ||
        onPressOut ||
        onPressIn ||
        onLongPress ||
        onClick
    )
    const runtimeHoverStyle = !disabled && noClassNames && pseudos?.hoverStyle
    const needsHoverState = runtimeHoverStyle || onHoverIn || onHoverOut
    const isHoverable =
      isWeb && !!(groupName || needsHoverState || onMouseEnter || onMouseLeave)

    // check presence rather than value to prevent reparenting bugs
    // allows for onPress={x ? function : undefined} without re-ordering dom
    const shouldAttach = Boolean(
      attachFocus ||
        attachPress ||
        isHoverable ||
        runtimePressStyle ||
        runtimeHoverStyle ||
        runtimeFocusStyle
    )

    if (process.env.NODE_ENV === 'development' && time) time`events-setup`

    const events: TamaguiComponentEvents | null =
      shouldAttach && !isDisabled && !props.asChild
        ? {
            onPressOut: attachPress
              ? (e) => {
                  unPress()
                  onPressOut?.(e)
                  onMouseUp?.(e)
                }
              : undefined,
            ...((isHoverable || attachPress) && {
              onMouseEnter: (e) => {
                const next: Partial<typeof state> = {}
                if (needsHoverState) {
                  next.hover = true
                }
                if (runtimePressStyle) {
                  if (state.pressIn) {
                    next.press = true
                  }
                }
                setStateShallow(next)
                onHoverIn?.(e)
                onMouseEnter?.(e)
              },
              onMouseLeave: (e) => {
                const next: Partial<typeof state> = {}
                mouseUps.add(unPress)
                if (needsHoverState) {
                  next.hover = false
                }
                if (runtimePressStyle) {
                  if (state.pressIn) {
                    next.press = false
                    next.pressIn = false
                  }
                }
                setStateShallow(next)
                onHoverOut?.(e)
                onMouseLeave?.(e)
              },
            }),
            onPressIn: attachPress
              ? (e) => {
                  if (runtimePressStyle) {
                    setStateShallow({
                      press: true,
                      pressIn: true,
                    })
                  }
                  onPressIn?.(e)
                  onMouseDown?.(e)
                  if (isWeb) {
                    mouseUps.add(unPress)
                  }
                }
              : undefined,
            onPress: attachPress
              ? (e) => {
                  unPress()
                  // @ts-ignore
                  isWeb && onClick?.(e)
                  onPress?.(e)
                  if (process.env.TAMAGUI_TARGET === 'web') {
                    onLongPress?.(e)
                  }
                }
              : undefined,
            ...(process.env.TAMAGUI_TARGET === 'native' &&
              attachPress &&
              onLongPress && {
                onLongPress: (e) => {
                  unPress()
                  onLongPress?.(e)
                },
              }),
            ...(attachFocus && {
              onFocus: (e) => {
                setStateShallow({
                  focus: true,
                })
                onFocus?.(e)
              },
              onBlur: (e) => {
                setStateShallow({
                  focus: false,
                })
                onBlur?.(e)
              },
            }),
          }
        : null

    if (process.env.TAMAGUI_TARGET === 'native' && events && !asChild) {
      // replicating TouchableWithoutFeedback
      Object.assign(events, {
        cancelable: !viewProps.rejectResponderTermination,
        disabled: isDisabled,
        hitSlop: viewProps.hitSlop,
        delayLongPress: viewProps.delayLongPress,
        delayPressIn: viewProps.delayPressIn,
        delayPressOut: viewProps.delayPressOut,
        focusable: viewProps.focusable ?? true,
        minPressDuration: 0,
      })
    }

    if (process.env.TAMAGUI_TARGET === 'web' && events && !isReactNative) {
      Object.assign(viewProps, getWebEvents(events))
    }

    if (process.env.NODE_ENV === 'development' && time) time`events`

    if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
      log(`events`, { events, isHoverable, attachPress })
    }

    // EVENTS native
    hooks.useEvents?.(viewProps, events, splitStyles, setStateShallow, staticConfig)

    const direction = props.spaceDirection || 'both'

    if (process.env.NODE_ENV === 'development' && time) time`hooks`

    let content =
      !children || asChild
        ? children
        : spacedChildren({
            separator,
            children,
            space,
            direction,
            isZStack,
            debug: debugProp,
          })

    if (asChild) {
      elementType = Slot
      // on native this is already merged into viewProps in hooks.useEvents
      if (process.env.TAMAGUI_TARGET === 'web') {
        const webStyleEvents = asChild === 'web' || asChild === 'except-style-web'
        const passEvents = getWebEvents(
          {
            onPress,
            onLongPress,
            onPressIn,
            onPressOut,
            onHoverIn,
            onHoverOut,
            onMouseUp,
            onMouseDown,
            onMouseEnter,
            onMouseLeave,
          },
          webStyleEvents
        )
        Object.assign(viewProps, passEvents)
      } else {
        Object.assign(viewProps, { onPress, onLongPress })
      }
    }

    if (process.env.NODE_ENV === 'development' && time) time`spaced-as-child`

    let useChildrenResult: any
    if (hooks.useChildren) {
      useChildrenResult = hooks.useChildren(
        elementType,
        content,
        viewProps,
        events,
        staticConfig
      )
    }
    if (useChildrenResult) {
      content = useChildrenResult
    } else {
      content = createElement(elementType, viewProps, content)
    }

    // needs to reset the presence state for nested children
    const ResetPresence = config?.animations?.ResetPresence
    if (willBeAnimated && presence && ResetPresence && typeof content !== 'string') {
      content = <ResetPresence>{content}</ResetPresence>
    }

    if (process.env.NODE_ENV === 'development' && time) time`create-element`

    // must override context so siblings don't clobber initial state
    const groupState = stateRef.current.group
    const subGroupContext = useMemo(() => {
      if (!groupState || !groupName) return
      groupState.listeners.clear()
      // change reference so context value updates
      return {
        ...componentContext.groups,
        // change reference so as we mutate it doesn't affect siblings etc
        state: {
          ...componentContext.groups.state,
          [groupName]: {
            pseudo: initialState,
            // capture just initial width and height if they exist
            // will have top, left, width, height (not x, y)
            layout: {
              width: fromPx(splitStyles.style.width as any),
              height: fromPx(splitStyles.style.height as any),
            } as any,
          },
        },
        emit: groupState.emit,
        subscribe: groupState.subscribe,
      } satisfies ComponentContextI['groups']
    }, [groupName])

    if (groupName && subGroupContext) {
      content = (
        <ComponentContext.Provider {...componentContext} groups={subGroupContext}>
          {content}
        </ComponentContext.Provider>
      )
    }

    if (process.env.NODE_ENV === 'development' && time) time`group-context`

    // disable theme prop is deterministic so conditional hook ok here
    content = disableTheme
      ? content
      : getThemedChildren(themeState, content, themeStateProps, false)

    if (process.env.NODE_ENV === 'development' && time) time`themed-children`

    if (process.env.NODE_ENV === 'development' && props['debug'] === 'visualize') {
      content = (
        <ThemeDebug themeState={themeState} themeProps={props}>
          {content}
        </ThemeDebug>
      )
    }

    if (process.env.TAMAGUI_TARGET === 'web') {
      if (isReactNative) {
        content = (
          <span
            className={`${isAnimatedReactNativeWeb ? className : ''} _dsp_contents`}
            {...(events && getWebEvents(events))}
          >
            {content}
          </span>
        )
      }
    }

    // ensure we override new context with syle resolved values
    if (staticConfig.context) {
      const contextProps = staticConfig.context.props
      for (const key in contextProps) {
        if (key in style || key in viewProps) {
          overriddenContextProps ||= {}
          overriddenContextProps[key] = style[key] ?? viewProps[key]
        }
      }
    }

    if (overriddenContextProps) {
      const Provider = staticConfig.context!.Provider!
      content = (
        <Provider {...contextValue} {...overriddenContextProps}>
          {content}
        </Provider>
      )
    }

    if (process.env.NODE_ENV === 'development') {
      if (debugProp && debugProp !== 'profile') {
        const element = typeof elementType === 'string' ? elementType : 'Component'
        console.groupCollapsed(`render <${element} /> (${internalID}) with props`)
        try {
          log('viewProps', viewProps)
          log('viewPropsOrder', Object.keys(viewProps))
          for (const key in viewProps) {
            log(' - ', key, viewProps[key])
          }
          log('children', content)
          if (typeof window !== 'undefined') {
            log({
              viewProps,
              state,
              styleProps,
              themeState,
              isAnimated,
              isAnimatedReactNativeWeb,
              defaultProps,
              splitStyles,
              animationStyles,
              willBeAnimated,
              isStringElement,
              classNamesIn: props.className?.split(' '),
              classNamesOut: viewProps.className?.split(' '),
              events,
              shouldAttach,
              pseudos,
              content,
              shouldAvoidClasses,
              animation: props.animation,
              splitStylesStyle,
              staticConfig,
              tamaguiConfig,
              shouldForcePseudo,
              elementType,
              initialState,
              classNames,
            })
          }
        } catch {
          // RN can run into PayloadTooLargeError: request entity too large
        }
        console.groupEnd()
        console.groupEnd()
      }
    }

    if (process.env.NODE_ENV === 'development' && time) {
      time`rest`
      if (!globalThis['willPrint']) {
        globalThis['willPrint'] = true
        setTimeout(() => {
          delete globalThis['willPrint']
          time.print()
          time = null
        }, 50)
      }
    }

    return content
  })

  // let hasLogged = false

  if (staticConfig.componentName) {
    component.displayName = staticConfig.componentName
  }

  type ComponentType = TamaguiComponent<ComponentPropTypes, Ref, BaseProps, void>

  let res: ComponentType = component as any

  if (process.env.TAMAGUI_FORCE_MEMO || staticConfig.memo) {
    res = memo(res) as any
  }

  res.staticConfig = staticConfig

  function extendStyledConfig(extended?: Partial<StaticConfig>) {
    return {
      ...staticConfig,
      ...extended,
      neverFlatten: true,
      isHOC: true,
      isStyledHOC: false,
    }
  }

  function extractable(Component: any, extended?: Partial<StaticConfig>) {
    Component.staticConfig = extendStyledConfig(extended)
    Component.styleable = styleable
    return Component
  }

  function styleable(Component: any, options?: StyleableOptions) {
    const isForwardedRefAlready = Component.render?.length === 2

    let out = isForwardedRefAlready ? (Component as any) : forwardRef(Component as any)

    const extendedConfig = extendStyledConfig(options?.staticConfig)

    out = options?.disableTheme ? out : (themeable(out, extendedConfig) as any)

    if (process.env.TAMAGUI_MEMOIZE_STYLEABLE) {
      out = memo(out)
    }

    out.staticConfig = extendedConfig
    out.styleable = styleable
    return out
  }

  res.extractable = extractable
  res.styleable = styleable

  return res
}

type EventKeys = keyof (TamaguiComponentEvents & WebOnlyPressEvents)
type EventLikeObject = {
  [key in EventKeys]?: any
}

function getWebEvents<E extends EventLikeObject>(events: E, webStyle = true) {
  return {
    onMouseEnter: events.onHoverIn ?? events.onMouseEnter,
    onMouseLeave: events.onHoverOut ?? events.onMouseLeave,
    [webStyle ? 'onClick' : 'onPress']: events.onPress,
    onMouseDown: events.onPressIn,
    onMouseUp: events.onPressOut,
    onTouchStart: events.onPressIn,
    onTouchEnd: events.onPressOut,
    onFocus: events.onFocus,
    onBlur: events.onBlur,
  }
}

// for elements to avoid spacing
export function Unspaced(props: { children?: any }) {
  return props.children
}
Unspaced['isUnspaced'] = true

const getSpacerSize = (size: SizeTokens | number | boolean, { tokens }) => {
  size = size === true ? '$true' : size
  const sizePx = tokens.space[size as any] ?? size
  return {
    width: sizePx,
    height: sizePx,
    minWidth: sizePx,
    minHeight: sizePx,
  }
}

// dont used styled() here to avoid circular deps
// keep inline to avoid circular deps
// @ts-expect-error we override
export const Spacer = createComponent<SpacerProps, TamaguiElement, StackPropsBase>({
  acceptsClassName: true,
  memo: true,
  componentName: 'Spacer',
  validStyles,

  defaultProps: {
    ...stackDefaultStyles,
    // avoid nesting issues
    tag: 'span',
    size: true,
    pointerEvents: 'none',
  },

  variants: {
    size: {
      '...': getSpacerSize,
    },

    flex: {
      true: {
        flexGrow: 1,
      },
    },

    direction: {
      horizontal: {
        height: 0,
        minHeight: 0,
      },
      vertical: {
        width: 0,
        minWidth: 0,
      },
      both: {},
    },
  } as const,
})

export type SpacedChildrenProps = {
  isZStack?: boolean
  children?: React.ReactNode
  space?: SpaceValue
  spaceFlex?: boolean | number
  direction?: SpaceDirection | 'unset'
  separator?: React.ReactNode
  debug?: DebugProp
}

export function spacedChildren(props: SpacedChildrenProps) {
  const { isZStack, children, space, direction, spaceFlex, separator } = props
  const hasSpace = !!(space || spaceFlex)
  const hasSeparator = !(separator === undefined || separator === null)
  if (!(hasSpace || hasSeparator || isZStack)) {
    return children
  }

  const childrenList = Children.toArray(children)

  const len = childrenList.length
  if (len <= 1 && !isZStack && !childrenList[0]?.['type']?.['shouldForwardSpace']) {
    return childrenList
  }

  const final: React.ReactNode[] = []
  for (let [index, child] of childrenList.entries()) {
    const isEmpty =
      child === null ||
      child === undefined ||
      (Array.isArray(child) && child.length === 0)

    // forward space
    if (!isEmpty && React.isValidElement(child) && child.type?.['shouldForwardSpace']) {
      child = React.cloneElement(child, {
        space,
        spaceFlex,
        separator,
        key: child.key,
      } as any)
    }

    // push them all, but wrap some in Fragment
    if (isEmpty || !child || (child['key'] && !isZStack)) {
      final.push(child)
    } else {
      final.push(
        <Fragment key={index}>
          {isZStack ? <AbsoluteFill>{child}</AbsoluteFill> : child}
        </Fragment>
      )
    }

    // first child unspaced avoid insert space
    if (isUnspaced(child) && index === 0) continue
    // no spacing on ZStack
    if (isZStack) continue

    const next = childrenList[index + 1]

    if (next && !isUnspaced(next)) {
      if (separator) {
        if (hasSpace) {
          final.push(
            createSpacer({
              key: `_${index}_00tmgui`,
              direction,
              space,
              spaceFlex,
            })
          )
        }
        final.push(
          React.isValidElement(separator)
            ? React.cloneElement(separator, { key: `sep_${index}` })
            : separator
        )
        if (hasSpace) {
          final.push(
            createSpacer({
              key: `_${index}01tmgui`,
              direction,
              space,
              spaceFlex,
            })
          )
        }
      } else {
        final.push(
          createSpacer({
            key: `_${index}02tmgui`,
            direction,
            space,
            spaceFlex,
          })
        )
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    if (props.debug) {
      log(`  Spaced children`, final, props)
    }
  }

  return final
}

type CreateSpacerProps = SpacedChildrenProps & { key: string }

function createSpacer({ key, direction, space, spaceFlex }: CreateSpacerProps) {
  return (
    <Spacer
      key={key}
      size={space}
      direction={direction}
      {...(typeof spaceFlex !== 'undefined' && {
        flex: spaceFlex === true ? 1 : spaceFlex === false ? 0 : spaceFlex,
      })}
    />
  )
}

function isUnspaced(child: React.ReactNode) {
  const t = child?.['type']
  return t?.['isVisuallyHidden'] || t?.['isUnspaced']
}

const AbsoluteFill: any = createComponent({
  defaultProps: {
    ...stackDefaultStyles,
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'box-none',
  },
})

function hasAnimatedStyleValue(style: Object) {
  return Object.keys(style).some((k) => {
    const val = style[k]
    return val && typeof val === 'object' && '_animation' in val
  })
}

function getMediaState(
  mediaGroups: Set<string>,
  layout: LayoutEvent['nativeEvent']['layout']
) {
  return Object.fromEntries(
    [...mediaGroups].map((mediaKey) => {
      return [mediaKey, mediaKeyMatch(mediaKey, layout as any)]
    })
  )
}

const fromPx = (val?: number | string) =>
  typeof val !== 'string' ? val : +val.replace('px', '')
