import { useComposedRefs } from '@tamagui/compose-refs'
import {
  isClient,
  isRSC,
  isServer,
  isWeb,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import { validStyles } from '@tamagui/helpers'
import React, {
  Children,
  Fragment,
  createElement,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
} from 'react'

import { getConfig, onConfiguredOnce } from './config'
import { stackDefaultStyles } from './constants/constants'
import { FontLanguageContext } from './contexts/FontLanguageContext'
import { TextAncestorContext } from './contexts/TextAncestorContext'
import { didGetVariableValue, setDidGetVariableValue } from './createVariable'
import { useSplitStyles } from './helpers/getSplitStyles'
import { mergeProps } from './helpers/mergeProps'
import { parseStaticConfig } from './helpers/parseStaticConfig'
import { proxyThemeVariables } from './helpers/proxyThemeVariables'
import { themeable } from './helpers/themeable'
import { useShallowSetState } from './helpers/useShallowSetState'
import { useAnimationDriver } from './hooks/useAnimationDriver'
import { setMediaShouldUpdate, useMedia } from './hooks/useMedia'
import { useServerRef, useServerState } from './hooks/useServerHooks'
import { useThemeWithState } from './hooks/useTheme'
import { hooks } from './setupHooks'
import {
  DebugProp,
  SpaceDirection,
  SpaceValue,
  SpacerProps,
  StaticConfig,
  StaticConfigParsed,
  TamaguiComponent,
  TamaguiComponentEvents,
  TamaguiComponentState,
  TamaguiElement,
  TamaguiInternalConfig,
  UseAnimationHook,
  UseAnimationProps,
} from './types'
import { Slot } from './views/Slot'
import { useThemedChildren } from './views/Theme'
import { ThemeDebug } from './views/ThemeDebug'

// let t
// import { timer } from '@tamagui/timer'
// if (true || process.env.ANALYZE) {
//   t = require().timer()
//   setTimeout(() => {
//     const out = t.print()
//     if (isClient) {
//       alert(out)
//     }
//   }, 2000)
// }

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

const HYDRATION_CUTOFF = process.env.TAMAGUI_ANIMATED_PRESENCE_HYDRATION_CUTOFF
  ? +process.env.TAMAGUI_ANIMATED_PRESENCE_HYDRATION_CUTOFF
  : 5

/**
 * All things that need one-time setup after createTamagui is called
 */
let tamaguiConfig: TamaguiInternalConfig
let AnimatedText: any
let AnimatedView: any
let initialTheme: any

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

const numRenderedOfType: Record<string, number> = {}

export function createComponent<
  ComponentPropTypes extends Object = {},
  Ref = TamaguiElement,
  BaseProps = never
>(staticConfigIn: Partial<StaticConfig> | StaticConfigParsed) {
  const staticConfig = parseStaticConfig(staticConfigIn)

  onConfiguredOnce((conf) => {
    // one time only setup
    if (!tamaguiConfig) {
      tamaguiConfig = conf

      if (!initialTheme) {
        const next = conf.themes[Object.keys(conf.themes)[0]]
        initialTheme = proxyThemeVariables(next)
        if (process.env.NODE_ENV === 'development') {
          if (!initialTheme) {
            // rome-ignore lint/nursery/noConsoleLog: <explanation>
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

  if (process.env.NODE_ENV === 'development' && staticConfigIn.defaultProps?.['debug']) {
    if (process.env.IS_STATIC !== 'is_static') {
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log(`🐛 [${staticConfig.componentName || 'Component'}]`, {
        staticConfig,
        defaultProps,
        defaultPropsKeyOrder: Object.keys(defaultProps),
      })
    }
  }

  const component = forwardRef<Ref, ComponentPropTypes>((propsIn: any, forwardedRef) => {
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
    // const time = t.start({ quiet: true })

    // set variants through context
    // order is after default props but before props
    let styledContextProps: Object | undefined
    let overriddenContextProps: Object | undefined
    const { context } = staticConfig
    if (context) {
      const contextValue = useContext(context)
      const { inverseShorthands } = getConfig()
      for (const key in context.props) {
        const propVal =
          // because its after default props but before props this annoying amount of checks
          propsIn[key] ||
          propsIn[inverseShorthands[key]] ||
          defaultProps[key] ||
          defaultProps[inverseShorthands[key]]
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
    let props: any

    if (curDefaultProps) {
      props = mergeProps(curDefaultProps, propsIn)[0]
    } else {
      props = propsIn
    }

    const debugProp = props['debug'] as DebugProp
    const componentName = props.componentName || staticConfig.componentName

    // conditional but if ever true stays true
    // [animated, inversed]
    const stateRef = useRef(
      undefined as any as {
        hasAnimated?: boolean
        themeShallow?: boolean
        isListeningToTheme?: boolean
      }
    )
    stateRef.current ||= {}

    const hostRef = useServerRef<TamaguiElement>(null)

    /**
     * Component state for tracking animations, pseudos
     */
    const animationsConfig = useAnimationDriver()
    const useAnimations = animationsConfig?.useAnimations as UseAnimationHook | undefined

    // after we get states mount we need to turn off isAnimated for server side
    const hasAnimationProp = Boolean(
      props.animation || (props.style && hasAnimatedStyleValue(props.style))
    )

    const willBeAnimated = (() => {
      if (isServer) return false
      const curState = stateRef.current
      const next = !!(hasAnimationProp && !isHOC && useAnimations)
      if (next && !curState.hasAnimated) {
        curState.hasAnimated = true
      }
      return Boolean(next || curState.hasAnimated)
    })()

    const usePresence = animationsConfig?.usePresence
    const presence = (!isRSC && willBeAnimated && usePresence?.()) || null

    const hasEnterStyle = !!props.enterStyle

    // disable for now still ssr issues
    const supportsCSSVariables = false // ?? animationsConfig?.supportsCSSVariables

    const needsMount = Boolean(
      (isWeb ? willBeAnimated && isClient : true) && willBeAnimated
    )

    const initialState = needsMount
      ? supportsCSSVariables
        ? defaultComponentStateShouldEnter!
        : defaultComponentState!
      : defaultComponentStateMounted!
    const states = useServerState<TamaguiComponentState>(initialState)

    const state = propsIn.forceStyle
      ? { ...states[0], [propsIn.forceStyle]: true }
      : states[0]
    const setState = states[1]
    const setStateShallow = useShallowSetState(setState, debugProp, componentName)

    let isAnimated = willBeAnimated

    if (willBeAnimated && !supportsCSSVariables) {
      // cheat code to not always pay the cost of triple rendering,
      // after a bit we consider this component hydrated
      let hasHydrated = false
      numRenderedOfType[componentName] ??= 0
      if (willBeAnimated) {
        if (++numRenderedOfType[componentName] > HYDRATION_CUTOFF) {
          hasHydrated = true
        }
      }
      const hasPresenceIsHydrated = presence && hasHydrated
      if (!hasPresenceIsHydrated) {
        if (isAnimated && (isServer || state.unmounted === true)) {
          isAnimated = false
        }
      }
    }

    const componentClassName = props.asChild
      ? ''
      : props.componentName
      ? `is_${props.componentName}`
      : defaultComponentClassName
    const hasTextAncestor = !!(isWeb && isText ? useContext(TextAncestorContext) : false)
    const languageContext = isRSC ? null : useContext(FontLanguageContext)
    const isDisabled = props.disabled ?? props.accessibilityState?.disabled

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
        if (state.unmounted && presenceState.enterVariant) {
          props[presenceState.enterVariant] = true
        }
        if (!presenceState.isPresent && presenceState.exitVariant) {
          props[presenceState.exitVariant] = true
        }
      }
    }

    const isReactNativeAnimated = animationsConfig?.isReactNative
    const avoidClassesWhileAnimating = isReactNativeAnimated
    const isAnimatedReactNative = isAnimated && isReactNativeAnimated
    const isReactNative = Boolean(staticConfig.isReactNative || isAnimatedReactNative)

    const shouldAvoidClasses =
      !isWeb ||
      !!(isAnimated && avoidClassesWhileAnimating) ||
      !staticConfig.acceptsClassName

    const shouldForcePseudo = !!propsIn.forceStyle
    const noClassNames = shouldAvoidClasses || shouldForcePseudo

    // internal use only
    const disableThemeProp = props['data-disable-theme']
    const disableTheme = (disableThemeProp && !willBeAnimated) || isHOC

    const themeStateProps = {
      name: props.theme,
      componentName,
      reset: props.reset,
      inverse: props.themeInverse,
      // @ts-ignore this is internal use only
      disable: disableTheme,
      shouldUpdate: () => {
        // only forces when defined
        return stateRef.current.isListeningToTheme
      },
      debug: debugProp,
    }

    const isExiting = Boolean(!state.unmounted && presence?.[0] === false)

    if (process.env.NODE_ENV === 'development') {
      const id = useId()

      if (debugProp) {
        // prettier-ignore
        const name = `${componentName || Component?.displayName || Component?.name || '[Unnamed Component]'}`
        const type = isAnimatedReactNative ? '(animated)' : isReactNative ? '(rnw)' : ''
        const dataIs = propsIn['data-is'] || ''
        const banner = `${name}${dataIs ? ` ${dataIs}` : ''} ${type} id ${id}`
        console.group(
          `%c ${banner} (unmounted: ${state.unmounted})${
            presence ? ` (presence: ${presence[0]})` : ''
          }`,
          'background: yellow;'
        )
        if (!isServer) {
          console.groupCollapsed(
            `Info (collapsed): ${state.press || state.pressIn ? 'PRESSED ' : ''}${
              state.hover ? 'HOVERED ' : ''
            }${state.focus ? 'FOCUSED' : ' '}`
          )
          // prettier-ignore
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log({ props, state, staticConfig, elementType, themeStateProps, styledContext: { contextProps: styledContextProps, overriddenContextProps }, presence, isAnimated, isHOC, hasAnimationProp, useAnimations, propsInOrder: Object.keys(propsIn), propsOrder: Object.keys(props), curDefaultPropsOrder: Object.keys(curDefaultProps) })
          console.groupEnd()
        }
      }
    }

    const themeState = useThemeWithState(themeStateProps)!

    elementType = Component || elementType
    const isStringElement = typeof elementType === 'string'

    const mediaState = useMedia(
      // @ts-ignore, we just pass a stable object so we can get it later with
      // should match to the one used in `setMediaShouldUpdate` below
      stateRef,
      debugProp ? { props, staticConfig } : null
    )

    setDidGetVariableValue(false)

    const resolveVariablesAs =
      // if HOC + mounted + has animation prop, resolve as value so it passes non-variable to child
      isAnimated || (isHOC && state.unmounted == false && hasAnimationProp)
        ? 'value'
        : 'auto'

    const splitStyles = useSplitStyles(
      props,
      staticConfig,
      themeState,
      {
        ...state,
        mediaState,
        noClassNames,
        hasTextAncestor,
        resolveVariablesAs,
        isExiting,
        isAnimated,
        // temp: once we fix above we can disable this
        willBeAnimated: willBeAnimated && animationsConfig?.supportsCSSVariables,
      },
      null,
      languageContext || undefined,
      elementType,
      debugProp
    )

    stateRef.current.isListeningToTheme = splitStyles.dynamicThemeAccess

    // only listen for changes if we are using raw theme values or media space, or dynamic media (native)
    // array = space media breakpoints
    const isMediaArray = Array.isArray(splitStyles.hasMedia)
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
    const isAnimatedReactNativeWeb = isAnimated && avoidClassesWhileAnimating

    if (process.env.NODE_ENV === 'development') {
      if (!process.env.TAMAGUI_TARGET) {
        console.error(
          `No process.env.TAMAGUI_TARGET set, please set it to "native" or "web".`
        )
      }

      if (debugProp) {
        console.groupCollapsed('>>>')
        // prettier-ignore
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log('props in', propsIn, 'mapped to', props, 'in order', Object.keys(props))
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log('splitStyles', splitStyles)
        // rome-ignore lint/nursery/noConsoleLog: ok
        console.log('media', { shouldListenForMedia, isMediaArray, mediaListeningKeys })
        // rome-ignore lint/nursery/noConsoleLog: ok
        console.log('className', Object.values(splitStyles.classNames))
        if (isClient) {
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
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
    if (!isRSC && willBeAnimated && useAnimations && !isHOC) {
      const animations = useAnimations({
        props: propsWithAnimation,
        // if hydrating, send empty style
        style: splitStylesStyle,
        // style: splitStylesStyle,
        presence,
        state: {
          ...state,
          isAnimated,
        },
        theme: themeState.theme,
        pseudos: pseudos || null,
        onDidAnimate: props.onDidAnimate,
        hostRef,
        staticConfig,
      })

      if (isAnimated) {
        if (animations) {
          animationStyles = animations.style
        }
      }
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

    const disabled = props.accessibilityState?.disabled || props.accessibilityDisabled

    // these can ultimately be for DOM, react-native-web views, or animated views
    // so the type is pretty loose
    let viewProps = nonTamaguiProps

    if (isHOC && _themeProp) {
      viewProps.theme = _themeProp
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

    viewProps.ref = useComposedRefs(hostRef as any, forwardedRef)

    if (process.env.NODE_ENV === 'development') {
      if (!isText && isWeb && !isHOC) {
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

    const unPress = useCallback(() => {
      setStateShallow({
        press: false,
        pressIn: false,
      })
    }, [setStateShallow])

    const shouldSetMounted = needsMount && state.unmounted

    // combined two effects into one for performance so be careful with logic
    // because no need for mouseUp removal effect if its not even mounted yet
    useIsomorphicLayoutEffect(() => {
      if (!shouldSetMounted) {
        return () => {
          mouseUps.delete(unPress)
        }
      }

      const unmounted = state.unmounted === true && hasEnterStyle ? 'should-enter' : false
      setStateShallow({
        unmounted,
      })
    }, [shouldSetMounted, state.unmounted])

    let styles: Record<string, any>[]

    if (isStringElement && shouldAvoidClasses && !shouldForcePseudo) {
      styles = {
        ...(animationStyles ?? splitStylesStyle),
      }
    } else {
      styles = [animationStyles ?? splitStylesStyle]

      // ugly but for now...
      if (shouldForcePseudo) {
        const next = {}
        styles.forEach((style) => Object.assign(next, style))
        // @ts-ignore
        Object.assign(splitStyles.style, next)
      }
    }

    let fontFamily = isText
      ? splitStyles.fontFamily || staticConfig.defaultProps.fontFamily
      : null
    if (fontFamily && fontFamily[0] === '$') {
      fontFamily = fontFamily.slice(1)
    }
    const fontFamilyClassName = fontFamily ? `font_${fontFamily}` : ''

    const classList = [
      hasEnterStyle && ((state.unmounted && needsMount) || !isClient)
        ? 't_will-mount'
        : '',
      componentName ? componentClassName : '',
      fontFamilyClassName,
      classNames ? Object.values(classNames).join(' ') : '',
    ]

    const className = classList.join(' ')

    if (process.env.TAMAGUI_TARGET === 'web') {
      const style = animationStyles ?? splitStyles.style

      if (isAnimatedReactNativeWeb) {
        viewProps.style = style
      } else if (isReactNative) {
        // TODO these shouldn't really return from getSplitStyles when in Native mode
        const cnStyles = { $$css: true }
        for (const name of className.split(' ')) {
          cnStyles[name] = name
        }
        viewProps.style = [...(Array.isArray(style) ? style : [style]), cnStyles]

        if (process.env.NODE_ENV === 'development') {
          // turn debug data- props into dataSet in dev mode
          Object.keys(viewProps).forEach((key) => {
            if (key.startsWith('data-')) {
              viewProps.dataSet ??= {}
              viewProps.dataSet[key.replace('data-', '')] = viewProps[key]
              delete viewProps[key]
            }
          })
        }
      } else {
        viewProps.className = className
        viewProps.style = style
      }
    }

    // TODO MOVE INTO HOOK
    if (process.env.TAMAGUI_TARGET === 'native') {
      // swap out the right family based on weight/style
      if (splitStyles.fontFamily) {
        const faceInfo = tamaguiConfig.fontsParsed[splitStyles.fontFamily]?.face
        if (faceInfo) {
          const [weight, style] = (() => {
            let weight: string | undefined
            let style: string | undefined
            for (let i = styles.length; i >= 0; i--) {
              weight ??= styles[i]?.fontWeight
              style ??= styles[i]?.fontStyle
            }
            return [weight || '400', style || 'normal'] as const
          })()
          const overrideFace = faceInfo[weight]?.[style]?.val
          if (overrideFace) {
            for (const style of styles) {
              if (style?.fontFamily) {
                style.fontFamily = overrideFace
                style.fontWeight = undefined
                style.fontStyle = undefined
              }
            }
          }
        }
      }

      // assign styles
      viewProps.style = styles
    }

    const runtimePressStyle = !disabled && noClassNames && pseudos?.pressStyle
    const attachPress = Boolean(
      runtimePressStyle || onPress || onPressOut || onPressIn || onLongPress || onClick
    )
    const runtimeHoverStyle = !disabled && noClassNames && pseudos?.hoverStyle
    const isHoverable =
      isWeb &&
      !!(runtimeHoverStyle || onHoverIn || onHoverOut || onMouseEnter || onMouseLeave)

    const handlesPressEvents = !(isWeb || asChild)

    // check presence rather than value to prevent reparenting bugs
    // allows for onPress={x ? function : undefined} without re-ordering dom
    const shouldAttach = Boolean(
      attachPress ||
        isHoverable ||
        (noClassNames && 'pressStyle' in props) ||
        (isWeb && noClassNames && 'hoverStyle' in props)
    )

    const events: TamaguiComponentEvents | null =
      shouldAttach && !isRSC && !isDisabled && !asChild
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
                    hover: false,
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
                }
              : undefined,
            onLongPress: attachPress
              ? (e) => {
                  unPress()
                  onLongPress?.(e)
                }
              : undefined,
          }
        : null

    if (process.env.TAMAGUI_TARGET === 'native') {
      if (events) {
        // replicating TouchableWithoutFeedback
        Object.assign(events, {
          cancelable: !props.rejectResponderTermination,
          disabled: isDisabled,
          hitSlop: props.hitSlop,
          delayLongPress: props.delayLongPress,
          delayPressIn: props.delayPressIn,
          delayPressOut: props.delayPressOut,
          focusable: viewProps.focusable ?? true,
          minPressDuration: 0,
        })
      }
    }

    if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log(`events`, { events, isHoverable, attachPress })
    }

    // EVENTS native
    hooks.useEvents?.(viewProps, events, splitStyles, setStateShallow)

    const shouldReset = !!(themeShallow && themeState.isNewTheme)
    if (shouldReset) {
      stateRef.current.themeShallow = true
    }

    const direction = props.spaceDirection || 'both'

    // since we re-render without changing children often for animations or on mount
    // we memo children here. tested this on the site homepage which has hundreds of components
    // and i see no difference in startup performance, but i do see it memoing often
    let content = useMemo(() => {
      return !children || asChild
        ? children
        : spacedChildren({
            separator,
            children,
            space,
            direction,
            isZStack,
            debug: debugProp,
          })
    }, [children, asChild, separator, space, direction, debugProp, isZStack])

    if (asChild) {
      elementType = Slot
      viewProps = {
        ...viewProps,
        onPress,
        onLongPress,
        onPressIn,
        onPressOut,
      }
    }

    content = createElement(elementType, viewProps, content)

    // disable theme prop is deterministic so conditional hook ok here
    content = disableThemeProp
      ? content
      : useThemedChildren(themeState, content, {
          shallow: stateRef.current.themeShallow,
          // passPropsToChildren: true,
        })

    if (process.env.NODE_ENV === 'development') {
      if (props['debug'] === 'visualize') {
        content = (
          <ThemeDebug themeState={themeState} themeProps={props}>
            {content}
          </ThemeDebug>
        )
      }
    }

    if (process.env.TAMAGUI_TARGET === 'web') {
      if (events || isAnimatedReactNativeWeb) {
        content = (
          <span
            className={`${isAnimatedReactNativeWeb ? className : ''}  _dsp_contents`}
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
      content = <Provider {...overriddenContextProps}>{content}</Provider>
    }

    if (process.env.NODE_ENV === 'development') {
      if (debugProp) {
        const element = typeof elementType === 'string' ? elementType : 'Component'
        console.groupCollapsed(`render <${element} /> with props`)
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log('viewProps', viewProps)
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log('viewPropsOrder', Object.keys(viewProps))
        for (const key in viewProps) {
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log(' - ', key, viewProps[key])
        }
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log('children', content)
        if (typeof window !== 'undefined') {
          // prettier-ignore
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log({ state, themeState, isAnimated, isAnimatedReactNativeWeb, defaultProps, viewProps, splitStyles, animationStyles, handlesPressEvents, isStringElement, classNamesIn: props.className?.split(' '), classNamesOut: viewProps.className?.split(' '), events, shouldAttach, styles, pseudos, content, shouldAvoidClasses, avoidClasses: avoidClassesWhileAnimating, animation: props.animation, style: splitStylesStyle, staticConfig, tamaguiConfig, shouldForcePseudo })
        }
        console.groupEnd()
        console.groupEnd()
      }
    }

    return content
  })

  if (staticConfig.componentName) {
    component.displayName = staticConfig.componentName
  }

  type ComponentType = TamaguiComponent<ComponentPropTypes, Ref, BaseProps, {}>

  let res: ComponentType = component as any

  if (staticConfig.memo) {
    res = memo(res) as any
  }

  res.staticConfig = staticConfig

  function extendStyledConfig() {
    return {
      ...staticConfig,
      neverFlatten: true,
      isHOC: true,
    }
  }

  function extractable(Component: any) {
    Component.staticConfig = extendStyledConfig()
    Component.styleable = styleable
    return Component
  }

  function styleable(Component: any) {
    const isForwardedRefAlready = Component.render?.length === 2
    const ComponentForwardedRef = isForwardedRefAlready
      ? (Component as any)
      : forwardRef(Component as any)

    const extendedConfig = extendStyledConfig()
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
export const Unspaced = (props: { children?: any }) => props.children
Unspaced['isUnspaced'] = true

// dont used styled() here to avoid circular deps
// keep inline to avoid circular deps

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
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
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
