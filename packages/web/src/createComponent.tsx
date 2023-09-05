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

import { getConfig, onConfiguredOnce } from './config'
import { stackDefaultStyles } from './constants/constants'
import { ComponentContext } from './contexts/ComponentContext'
import { didGetVariableValue, setDidGetVariableValue } from './createVariable'
import {
  createShallowSetState,
  mergeIfNotShallowEqual,
} from './helpers/createShallowSetState'
import { useSplitStyles } from './helpers/getSplitStyles'
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
  LayoutEvent,
  SpaceDirection,
  SpaceValue,
  SpacerProps,
  StackProps,
  StaticConfig,
  TamaguiComponent,
  TamaguiComponentEvents,
  TamaguiComponentState,
  TamaguiElement,
  TamaguiInternalConfig,
  TextProps,
  UseAnimationHook,
  UseAnimationProps,
} from './types'
import { Slot } from './views/Slot'
import { useThemedChildren } from './views/Theme'
import { ThemeDebug } from './views/ThemeDebug'

// this appears to fix expo / babel not picking this up sometimes? really odd
process.env.TAMAGUI_TARGET

export const defaultComponentState: TamaguiComponentState = {
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  unmounted: true,
}

const defaultComponentStateMounted: TamaguiComponentState = {
  ...defaultComponentState,
  unmounted: false,
}

const defaultComponentStateShouldEnter: TamaguiComponentState = {
  ...defaultComponentState,
  unmounted: 'should-enter',
}

/**
 * All things that need one-time setup after createTamagui is called
 */
let tamaguiConfig: TamaguiInternalConfig
let AnimatedText: any
let AnimatedView: any
let initialTheme: any
let time: any

export const mouseUps = new Set<Function>()
if (typeof document !== 'undefined') {
  const cancelTouches = () => {
    mouseUps.forEach((x) => x())
    mouseUps.clear()
  }
  addEventListener('mouseup', cancelTouches)
  addEventListener('touchend', cancelTouches)
  addEventListener('touchcancel', cancelTouches)
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
  onConfiguredOnce((conf) => {
    // one time only setup
    if (!tamaguiConfig) {
      tamaguiConfig = conf

      if (!initialTheme) {
        const next = conf.themes[Object.keys(conf.themes)[0]]
        initialTheme = proxyThemeVariables(next)
        if (process.env.NODE_ENV === 'development') {
          if (!initialTheme) {
            // rome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log('Warning: Missing theme')
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
  const defaultProps = staticConfig.defaultProps

  if (process.env.NODE_ENV === 'development' && staticConfig.defaultProps?.['debug']) {
    if (process.env.IS_STATIC !== 'is_static') {
      // rome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(`🐛 [${staticConfig.componentName || 'Component'}]`, {
        staticConfig,
        defaultProps,
        defaultPropsKeyOrder: defaultProps ? Object.keys(defaultProps) : [],
      })
    }
  }

  const component = forwardRef<Ref, ComponentPropTypes>((propsIn, forwardedRef) => {
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
    let props: StackProps | TextProps
    if (curDefaultProps) {
      props = mergeProps(curDefaultProps, propsIn)
    } else {
      props = propsIn
    }

    const debugProp = props['debug'] as DebugProp
    const componentName = props.componentName || staticConfig.componentName

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

    const isHydrated = useDidFinishSSR()

    if (process.env.NODE_ENV === 'development' && time) time`did-finish-ssr`

    // conditional but if ever true stays true
    // [animated, inversed]
    const stateRef = useRef(
      undefined as any as {
        hasMeasured?: boolean
        hasAnimated?: boolean
        themeShallow?: boolean
        isListeningToTheme?: boolean
      }
    )
    stateRef.current ||= {}

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

    if (groupName) {
      // when we set state we also set our group state and emit an event for children listening:
      const groupContextState = componentContext.groups.state
      const og = setStateShallow
      setStateShallow = (state) => {
        og(state)
        componentContext.groups.emit(groupName, {
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

    AnimatedText = animationsConfig ? animationsConfig.Text : BaseTextComponent
    AnimatedView = animationsConfig ? animationsConfig.View : BaseViewComponent

    let elementType = isText
      ? (isAnimated ? AnimatedText : null) || BaseTextComponent
      : (isAnimated ? AnimatedView : null) || BaseViewComponent

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

    const isAnimatedReactNative = isAnimated && animationsConfig?.isReactNative
    const isReactNative = Boolean(staticConfig.isReactNative || isAnimatedReactNative)
    const shouldAvoidClasses = Boolean(
      !isWeb || isAnimated || !staticConfig.acceptsClassName || propsIn.disableClassName
    )

    const shouldForcePseudo = !!propsIn.forceStyle
    const noClassNames = shouldAvoidClasses || shouldForcePseudo

    // internal use only
    const disableThemeProp = props['data-disable-theme']
    const disableTheme = (disableThemeProp && !willBeAnimated) || isHOC

    if (process.env.NODE_ENV === 'development' && time) time`theme-props`

    if (props.themeShallow) {
      stateRef.current.themeShallow = true
    }

    const themeStateProps = {
      name: props.theme,
      componentName,
      // @ts-ignore this is internal use only
      disable: disableTheme,
      shallow: stateRef.current.themeShallow,
      shouldUpdate: () => {
        // only forces when defined
        return stateRef.current.isListeningToTheme
      },
      debug: debugProp,
    }

    const isExiting = Boolean(!state.unmounted && presence?.[0] === false)

    if (process.env.NODE_ENV === 'development') {
      const id = useId()

      if (debugProp && debugProp !== 'profile') {
        // prettier-ignore
        const name = `${
          componentName || Component?.displayName || Component?.name || "[Unnamed Component]"
        }`;
        const type = isAnimatedReactNative ? '(animated)' : isReactNative ? '(rnw)' : ''
        const dataIs = propsIn['data-is'] || ''
        const banner = `${name}${dataIs ? ` ${dataIs}` : ''} ${type} id ${id}`
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
          // prettier-ignore
          // rome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log({
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
          });
          console.groupEnd()
        }
      }
    }

    if (process.env.NODE_ENV === 'development' && time) time`pre-theme-media`

    const [themeState, theme] = useThemeWithState(themeStateProps)

    elementType = Component || elementType
    const isStringElement = typeof elementType === 'string'

    if (process.env.NODE_ENV === 'development' && time) time`theme`

    const mediaState = useMedia(
      // @ts-ignore, we just pass a stable object so we can get it later with
      // should match to the one used in `setMediaShouldUpdate` below
      stateRef
    )

    if (process.env.NODE_ENV === 'development' && time) time`media`

    setDidGetVariableValue(false)

    const resolveVariablesAs =
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
      resolveVariablesAs,
      isExiting,
      isAnimated,
      keepStyleSSR,
    } as const

    const splitStyles = useSplitStyles(
      props,
      staticConfig,
      theme,
      themeState.state.name,
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
    const isAnimatedReactNativeWeb = isAnimated && isReactNative

    if (process.env.NODE_ENV === 'development') {
      if (!process.env.TAMAGUI_TARGET) {
        console.error(
          `No process.env.TAMAGUI_TARGET set, please set it to "native" or "web".`
        )
      }

      if (debugProp && debugProp !== 'profile') {
        console.groupCollapsed('>>>')
        // prettier-ignore
        // rome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("props in", propsIn, "mapped to", props, "in order", Object.keys(props));
        // rome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log('splitStyles', splitStyles)
        // rome-ignore lint/suspicious/noConsoleLog: ok
        console.log('media', { shouldListenForMedia, isMediaArray, mediaListeningKeys })
        // rome-ignore lint/suspicious/noConsoleLog: ok
        console.log('className', Object.values(splitStyles.classNames))
        if (isClient) {
          // rome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log('ref', hostRef, '(click to view)')
        }
        console.groupEnd()
        if (debugProp === 'break') {
          // rome-ignore lint/suspicious/noDebugger: ok
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
        theme: themeState.state.theme!,
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
      onPress,
      onLongPress,
      onPressIn,
      onPressOut,
      onHoverIn,
      onHoverOut,
      themeShallow,
      spaceDirection: _spaceDirection,
      disabled: disabledProp,
      onMouseUp,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
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

    if (isHOC && _themeProp) {
      viewProps.theme = _themeProp
    }

    if (groupName) {
      nonTamaguiProps.onLayout = composeEventHandlers(
        nonTamaguiProps.onLayout,
        (e: LayoutEvent) => {
          componentContext.groups.emit(groupName, {
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
    if (
      process.env.TAMAGUI_TARGET === 'web' &&
      !isReactNative &&
      !willBeAnimated &&
      !asChild
    ) {
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
    // if its a layout effect it will just skip that first render output
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

    if (process.env.TAMAGUI_TARGET === 'web') {
      const classList = [
        componentName ? componentClassName : '',
        fontFamilyClassName,
        classNames ? Object.values(classNames).join(' ') : '',
        groupClassName,
      ]
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
        viewProps.className = className
        viewProps.style = style
      }

      // turn debug data- props into dataSet in dev mode
      if (isReactNative) {
        if (process.env.NODE_ENV === 'development') {
          Object.keys(viewProps).forEach((key) => {
            if (key.startsWith('data-')) {
              viewProps.dataSet ??= {}
              viewProps.dataSet[key.replace('data-', '')] = viewProps[key]
              delete viewProps[key]
            }
          })
        }
      }
    } else {
      // native assign styles
      viewProps.style = style
    }

    // if its a group its gotta listen for pseudos to emit them to children

    const runtimePressStyle = !disabled && noClassNames && pseudos?.pressStyle
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
    const isHoverable =
      isWeb &&
      !!(
        groupName ||
        runtimeHoverStyle ||
        onHoverIn ||
        onHoverOut ||
        onMouseEnter ||
        onMouseLeave
      )

    const handlesPressEvents = !(isWeb || asChild)

    // check presence rather than value to prevent reparenting bugs
    // allows for onPress={x ? function : undefined} without re-ordering dom
    const shouldAttach = Boolean(
      attachPress ||
        isHoverable ||
        (noClassNames && 'pressStyle' in props) ||
        (isWeb && noClassNames && 'hoverStyle' in props)
    )

    if (process.env.NODE_ENV === 'development' && time) time`events-setup`

    const events: TamaguiComponentEvents | null =
      shouldAttach && !isDisabled && !asChild
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
                next.hover = true
                if (state.pressIn) {
                  next.press = true
                }
                setStateShallow(next)
                onHoverIn?.(e)
                onMouseEnter?.(e)
              },
              onMouseLeave: (e) => {
                const next: Partial<typeof state> = {}
                mouseUps.add(unPress)
                next.hover = false
                if (state.pressIn) {
                  next.press = false
                  next.pressIn = false
                }
                setStateShallow(next)
                onHoverOut?.(e)
                onMouseLeave?.(e)
              },
            }),
            onPressIn: attachPress
              ? (e) => {
                  setStateShallow({
                    press: true,
                    pressIn: true,
                  })
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
            ...(process.env.TAMAGUI_TARGET === 'native' && {
              onLongPress:
                attachPress && onLongPress
                  ? (e) => {
                      unPress()
                      onLongPress?.(e)
                    }
                  : undefined,
            }),
          }
        : null

    if (process.env.TAMAGUI_TARGET === 'native' && events) {
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

    if (process.env.NODE_ENV === 'development' && time) time`events`

    if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
      // rome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(`events`, { events, isHoverable, attachPress })
    }

    // EVENTS native
    hooks.useEvents?.(viewProps, events, splitStyles, setStateShallow)

    const direction = props.spaceDirection || 'both'

    if (process.env.NODE_ENV === 'development' && time) time`hooks`

    // since we re-render without changing children often for animations or on mount
    // we memo children here. tested this on the site homepage which has hundreds of components
    // and i see no difference in startup performance, but i do see it memoing often
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
      Object.assign(viewProps, {
        onPress,
        onLongPress,
        onPressIn,
        onPressOut,
      })
    }

    if (process.env.NODE_ENV === 'development' && time) time`spaced-as-child`

    // perf - unwrap View
    if (
      // in test mode disable perf unwrapping so react-testing-library finds Text properly
      process.env.NODE_ENV !== 'test' &&
      process.env.TAMAGUI_TARGET === 'native' &&
      (elementType === BaseText || elementType === BaseView)
    ) {
      // instead of rendering a whole sub component, just grab the contents directly
      // we could further improve this performance by actually just doing this ourselves
      viewProps.children = content
      content = elementType.render(viewProps, viewProps.ref)
    } else {
      content = createElement(elementType, viewProps, content)
    }

    if (process.env.NODE_ENV === 'development' && time) time`create-element`

    // must override context so siblings don't clobber initial state
    const subGroupContext = useMemo(() => {
      if (!groupName) return
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
      } satisfies ComponentContextI['groups']
    }, [groupName])

    if (groupName && subGroupContext) {
      content = (
        <ComponentContext.Provider groups={subGroupContext}>
          {content}
        </ComponentContext.Provider>
      )
    }

    if (process.env.NODE_ENV === 'development' && time) time`group-context`

    // disable theme prop is deterministic so conditional hook ok here
    content = disableThemeProp
      ? content
      : useThemedChildren(themeState, content, themeStateProps)

    if (process.env.NODE_ENV === 'development' && time) time`themed-children`

    if (process.env.NODE_ENV === 'development' && props['debug'] === 'visualize') {
      content = (
        <ThemeDebug themeState={themeState} themeProps={props}>
          {content}
        </ThemeDebug>
      )
    }

    if (process.env.TAMAGUI_TARGET === 'web') {
      if (events || isAnimatedReactNativeWeb) {
        content = (
          <span
            className={`${isAnimatedReactNativeWeb ? className : ''} _dsp_contents`}
            {...(events && {
              onMouseEnter: events.onMouseEnter,
              onMouseLeave: events.onMouseLeave,
              onClick: events.onPress,
              onMouseDown: events.onPressIn,
              onMouseUp: events.onPressOut,
              onTouchStart: events.onPressIn,
              onTouchEnd: events.onPressOut,
            })}
          >
            {content}
          </span>
        )
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
        console.groupCollapsed(`render <${element} /> with props`)
        try {
          // rome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log('viewProps', viewProps)
          // rome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log('viewPropsOrder', Object.keys(viewProps))
          for (const key in viewProps) {
            // rome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log(' - ', key, viewProps[key])
          }
          // rome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log('children', content)
          if (typeof window !== 'undefined') {
            // prettier-ignore
            // rome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log({
              viewProps,
              state,
              styleProps,
              themeState,
              isAnimated,
              isAnimatedReactNativeWeb,
              defaultProps,
              splitStyles,
              animationStyles,
              handlesPressEvents,
              willBeAnimated,
              isStringElement,
              classNamesIn: props.className?.split(" "),
              classNamesOut: viewProps.className?.split(" "),
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
            });
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

  type ComponentType = TamaguiComponent<ComponentPropTypes, Ref, BaseProps, {}>

  let res: ComponentType = component as any

  if (process.env.TAMAGUI_MEMO_ALL || staticConfig.memo) {
    res = memo(res) as any
  }

  res.staticConfig = staticConfig

  function extendStyledConfig(extended?: Partial<StaticConfig>) {
    return {
      ...staticConfig,
      ...extended,
      neverFlatten: true,
      isHOC: true,
    }
  }

  function extractable(Component: any, extended?: Partial<StaticConfig>) {
    Component.staticConfig = extendStyledConfig(extended)
    Component.styleable = styleable
    return Component
  }

  function styleable(Component: any, extended?: Partial<StaticConfig>) {
    const isForwardedRefAlready = Component.render?.length === 2
    const ComponentForwardedRef = isForwardedRefAlready
      ? (Component as any)
      : // memo because theme changes otherwise would always re-render
        memo(forwardRef(Component as any))

    const extendedConfig = extendStyledConfig(extended)
    const out = themeable(ComponentForwardedRef, extendedConfig) as any
    out.staticConfig = extendedConfig
    out.styleable = styleable
    return out
  }

  res.extractable = extractable
  res.styleable = styleable

  return res
}

// for elements to avoid spacing
export function Unspaced(props: { children?: any }) {
  return props.children
}
Unspaced['isUnspaced'] = true

// dont used styled() here to avoid circular deps
// keep inline to avoid circular deps
// @ts-expect-error we override
export const Spacer = createComponent<SpacerProps>({
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
      '...size': (size, { tokens }) => {
        size = size === true ? '$true' : size
        const sizePx = tokens.space[size] ?? size
        return {
          width: sizePx,
          height: sizePx,
          minWidth: sizePx,
          minHeight: sizePx,
        }
      },
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
  direction?: SpaceDirection
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
      // rome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(`  Spaced children`, final, props)
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

const DefaultProps = new Map()

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
