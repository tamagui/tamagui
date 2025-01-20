import { composeRefs } from '@tamagui/compose-refs'
import { isClient, isServer, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { composeEventHandlers, validStyles } from '@tamagui/helpers'
import React from 'react'
import { devConfig, onConfiguredOnce } from './config'
import { stackDefaultStyles } from './constants/constants'
import { isDevTools } from './constants/isDevTools'
import { ComponentContext } from './contexts/ComponentContext'
import { didGetVariableValue, setDidGetVariableValue } from './createVariable'
import { defaultComponentStateMounted } from './defaultComponentState'
import { useSplitStyles } from './helpers/getSplitStyles'
import { log } from './helpers/log'
import { mergeProps } from './helpers/mergeProps'
import { setElementProps } from './helpers/setElementProps'
import { subscribeToContextGroup } from './helpers/subscribeToContextGroup'
import { themeable } from './helpers/themeable'
import { wrapStyleTags } from './helpers/wrapStyleTags'
import { useComponentState } from './hooks/useComponentState'
import { setMediaShouldUpdate, useMedia } from './hooks/useMedia'
import { useThemeWithState } from './hooks/useTheme'
import type { TamaguiComponentEvents } from './interfaces/TamaguiComponentEvents'
import type { TamaguiComponentState } from './interfaces/TamaguiComponentState'
import type { WebOnlyPressEvents } from './interfaces/WebOnlyPressEvents'
import { hooks } from './setupHooks'
import type {
  ComponentContextI,
  DebugProp,
  LayoutEvent,
  SizeTokens,
  SpaceDirection,
  SpaceValue,
  SpacerProps,
  SpacerStyleProps,
  StackNonStyleProps,
  StackProps,
  StaticConfig,
  StyleableOptions,
  TamaguiComponent,
  TamaguiElement,
  TamaguiInternalConfig,
  TextProps,
  UseAnimationHook,
  UseAnimationProps,
  UseThemeWithStateProps,
} from './types'
import { Slot } from './views/Slot'
import { getThemedChildren } from './views/Theme'
import { ThemeDebug } from './views/ThemeDebug'

/**
 * All things that need one-time setup after createTamagui is called
 */
let time: any

let debugKeyListeners: Set<Function> | undefined
let startVisualizer: Function | undefined

type ComponentSetState = React.Dispatch<React.SetStateAction<TamaguiComponentState>>

export const componentSetStates = new Set<ComponentSetState>()

if (typeof document !== 'undefined') {
  const cancelTouches = () => {
    // clear all press downs
    componentSetStates.forEach((setState) =>
      setState((prev) => {
        if (prev.press || prev.pressIn) {
          return {
            ...prev,
            press: false,
            pressIn: false,
          }
        }
        return prev
      })
    )
    componentSetStates.clear()
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

const lastInteractionWasKeyboard = { value: false }
if (isWeb && globalThis['document']) {
  document.addEventListener('keydown', () => {
    lastInteractionWasKeyboard.value = true
  })
  document.addEventListener('mousedown', () => {
    lastInteractionWasKeyboard.value = false
  })
  document.addEventListener('mousemove', () => {
    lastInteractionWasKeyboard.value = false
  })
}

export function createComponent<
  ComponentPropTypes extends Record<string, any> = {},
  Ref extends TamaguiElement = TamaguiElement,
  BaseProps = never,
  BaseStyles extends Object = never,
>(staticConfig: StaticConfig) {
  const { componentName } = staticConfig

  let config: TamaguiInternalConfig | null = null

  let defaultProps = staticConfig.defaultProps

  onConfiguredOnce((conf) => {
    config = conf

    if (componentName) {
      // TODO this should be deprecated and removed likely or at least done differently
      const defaultForComponent = conf.defaultProps?.[componentName]
      if (defaultForComponent) {
        defaultProps = { ...defaultForComponent, ...defaultProps }
      }
    }
  })

  const { Component, isText, isZStack, isHOC } = staticConfig

  if (process.env.NODE_ENV === 'development' && staticConfig.defaultProps?.['debug']) {
    if (process.env.IS_STATIC !== 'is_static') {
      log(`🐛 [${componentName || 'Component'}]`, {
        staticConfig,
        defaultProps,
        defaultPropsKeyOrder: defaultProps ? Object.keys(defaultProps) : [],
      })
    }
  }

  const component = React.forwardRef<Ref, ComponentPropTypes>((propsIn, forwardedRef) => {
    const internalID = process.env.NODE_ENV === 'development' ? React.useId() : ''

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

    const componentContext = React.useContext(ComponentContext)

    // set variants through context
    // order is after default props but before props
    let styledContextProps: Object | undefined
    let overriddenContextProps: Object | undefined
    let contextValue: Object | null | undefined
    const { context, isReactNative } = staticConfig

    if (context) {
      contextValue = React.useContext(context)

      if (contextValue) {
        if (
          process.env.NODE_ENV === 'development' &&
          defaultProps?.['debug'] === 'verbose'
        ) {
          log(` 👇 contextValue`, contextValue)
        }

        const shorthands = config?.shorthands
        for (const key in context.props) {
          const propVal = propsIn[key] || propsIn[shorthands?.[propsIn as any]]

          // if not set, use context
          if (propVal === undefined) {
            const val = contextValue?.[key]
            if (val !== undefined) {
              styledContextProps ||= {}
              styledContextProps[key] = val
            }
          }

          // update context if needed (including value from defaultProps)
          const finalVal = propVal ?? defaultProps?.[key]
          if (finalVal !== undefined) {
            overriddenContextProps ||= {}
            overriddenContextProps[key] = finalVal
          }
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
      React.useEffect(() => {
        let overlay: HTMLSpanElement | null = null

        const debugVisualizerHandler = (show = false) => {
          const node = curStateRef.host as HTMLElement
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
      globalThis['time'] = time
    }
    if (process.env.NODE_ENV === 'development' && time) time`start (ignore)`

    /**
     * Component state for tracking animations, pseudos
     */
    const animationDriver = componentContext.animationDriver
    const useAnimations = animationDriver?.useAnimations as UseAnimationHook | undefined

    const {
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
      supportsCSSVars,
      willBeAnimated,
      willBeAnimatedClient,
    } = useComponentState(props, componentContext, staticConfig, config!)

    if (process.env.NODE_ENV === 'development' && time) time`use-state`

    const hasTextAncestor = !!(isWeb && isText ? componentContext.inText : false)

    const isTaggable = !Component || typeof Component === 'string'
    const tagProp = props.tag
    // default to tag, fallback to component (when both strings)
    const element = isWeb ? (isTaggable ? tagProp || Component : Component) : Component

    const BaseTextComponent = BaseText || element || 'span'
    const BaseViewComponent = BaseView || element || (hasTextAncestor ? 'span' : 'div')

    let elementType = isText ? BaseTextComponent : BaseViewComponent

    if (animationDriver && isAnimated) {
      elementType = animationDriver[isText ? 'Text' : 'View'] || elementType
    }

    // internal use only
    const disableThemeProp =
      process.env.TAMAGUI_TARGET === 'native' ? false : props['data-disable-theme']

    const disableTheme = disableThemeProp || isHOC

    if (process.env.NODE_ENV === 'development' && time) time`theme-props`

    if (props.themeShallow) {
      curStateRef.themeShallow = true
    }

    const themeStateProps: UseThemeWithStateProps = {
      componentName,
      disable: disableTheme,
      shallow: curStateRef.themeShallow,
      debug: debugProp,
    }

    // these two are set conditionally if existing in props because we wrap children with
    // a span if they ever set one of these, so avoid wrapping all children with span
    if ('themeInverse' in props) {
      themeStateProps.inverse = props.themeInverse
    }
    if ('theme' in props) {
      themeStateProps.name = props.theme
    }
    if (typeof curStateRef.isListeningToTheme === 'boolean') {
      themeStateProps.needsUpdate = () => !!stateRef.current.isListeningToTheme
    }
    // on native we optimize theme changes if fastSchemeChange is enabled, otherwise deopt
    if (process.env.TAMAGUI_TARGET === 'native') {
      themeStateProps.deopt = willBeAnimated
    }

    if (process.env.NODE_ENV === 'development') {
      if (debugProp && debugProp !== 'profile') {
        const name = `${
          componentName ||
          Component?.displayName ||
          Component?.name ||
          '[Unnamed Component]'
        }`

        const type =
          (hasEnterStyle ? '(hasEnter)' : ' ') +
          (isAnimated ? '(animated)' : ' ') +
          (isReactNative ? '(rnw)' : ' ') +
          (noClass ? '(noClass)' : ' ') +
          (state.press || state.pressIn ? '(PRESSED)' : ' ') +
          (state.hover ? '(HOVERED)' : ' ') +
          (state.focus ? '(FOCUSED)' : ' ') +
          (state.focusWithin ? '(WITHIN FOCUSED)' : ' ') +
          (presenceState?.isPresent === false ? '(EXIT)' : '')

        const dataIs = propsIn['data-is'] || ''
        const banner = `${internalID} ${name}${dataIs ? ` ${dataIs}` : ''} ${type}`
        console.info(
          `%c ${banner} (hydrated: ${isHydrated}) (unmounted: ${state.unmounted})`,
          'background: green; color: white;'
        )

        if (isServer) {
          log({ noClass, isAnimated, isWeb, supportsCSSVars })
        } else {
          // if strict mode or something messes with our nesting this fixes:
          console.groupEnd()

          const ch = propsIn.children
          let childLog =
            typeof ch === 'string' ? (ch.length > 4 ? ch.slice(0, 4) + '...' : ch) : ''
          if (childLog.length) {
            childLog = `(children: ${childLog})`
          }

          console.groupCollapsed(`${childLog} Props:`)
          log('props in:', propsIn)
          log('final props:', props)
          log({ state, staticConfig, elementType, themeStateProps })
          log({ contextProps: styledContextProps, overriddenContextProps })
          log({ presence, isAnimated, isHOC, hasAnimationProp, useAnimations })
          console.groupEnd()
        }
      }
    }

    if (process.env.NODE_ENV === 'development' && time) time`pre-theme-media`

    const [themeState, theme] = useThemeWithState(themeStateProps)

    if (process.env.NODE_ENV === 'development' && time) time`theme`

    elementType = Component || elementType
    const isStringElement = typeof elementType === 'string'

    const mediaState = useMedia(componentContext, debugProp)

    setDidGetVariableValue(false)

    if (process.env.NODE_ENV === 'development' && time) time`media`

    const resolveValues =
      // if HOC + mounted + has animation prop, resolve as value so it passes non-variable to child
      (isAnimated && !supportsCSSVars) ||
      (isHOC && state.unmounted == false && hasAnimationProp)
        ? 'value'
        : 'auto'

    const styleProps = {
      mediaState,
      noClass,
      resolveValues,
      isExiting,
      isAnimated,
      willBeAnimated,
      styledContextProps,
    } as const

    const themeName = themeState?.state?.name || ''

    if (process.env.NODE_ENV === 'development' && time) time`split-styles-prepare`

    const splitStyles = useSplitStyles(
      props,
      staticConfig,
      theme,
      themeName,
      state,
      styleProps,
      null,
      componentContext,
      elementType,
      debugProp
    )

    if (process.env.NODE_ENV === 'development' && time) time`split-styles`

    // hide strategy will set this opacity = 0 until measured
    if (props.group && props.untilMeasured === 'hide' && !curStateRef.hasMeasured) {
      splitStyles.style ||= {}
      splitStyles.style.opacity = 0
    }

    curStateRef.isListeningToTheme = splitStyles.dynamicThemeAccess

    // only listen for changes if we are using raw theme values or media space, or dynamic media (native)
    // array = space media breakpoints
    const hasRuntimeMediaKeys = splitStyles.hasMedia && splitStyles.hasMedia !== true
    const shouldListenForMedia =
      didGetVariableValue() ||
      hasRuntimeMediaKeys ||
      (noClass && splitStyles.hasMedia === true)

    const mediaListeningKeys = hasRuntimeMediaKeys
      ? (splitStyles.hasMedia as Record<string, boolean>)
      : null
    if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
      console.info(`useMedia() createComponent`, shouldListenForMedia, mediaListeningKeys)
    }

    setMediaShouldUpdate(stateRef, shouldListenForMedia, mediaListeningKeys)

    const {
      viewProps: viewPropsIn,
      pseudos,
      style: splitStylesStyle,
      classNames,
      space,
    } = splitStyles

    const propsWithAnimation = props as UseAnimationProps

    const {
      asChild,
      children,
      themeShallow,
      spaceDirection: _spaceDirection,
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
      ...nonTamaguiProps
    } = viewPropsIn

    // these can ultimately be for DOM, react-native-web views, or animated views
    // so the type is pretty loose
    let viewProps = nonTamaguiProps

    if (!isTaggable && props.forceStyle) {
      viewProps.forceStyle = props.forceStyle
    }

    if (isHOC && _themeProp) {
      viewProps.theme = _themeProp
    }

    if (tagProp && elementType['acceptTagProp']) {
      viewProps.tag = tagProp
    }

    // once you set animation prop don't remove it, you can set to undefined/false
    // reason is animations are heavy - no way around it, and must be run inline here (🙅 loading as a sub-component)
    let animationStyles: any
    const shouldUseAnimation = // if it supports css vars we run it on server too to get matching initial style
      (supportsCSSVars ? willBeAnimatedClient : willBeAnimated) && useAnimations && !isHOC

    if (shouldUseAnimation) {
      const animations = useAnimations({
        props: propsWithAnimation,
        // if hydrating, send empty style
        style: splitStylesStyle || {},
        presence,
        componentState: state,
        styleProps,
        theme: themeState.state?.theme!,
        pseudos: pseudos || null,
        staticConfig,
        stateRef,
      })

      if ((isAnimated || supportsCSSVars) && animations) {
        animationStyles = animations.style
        viewProps.style = animationStyles
        if (animations.className) {
          viewProps.className = `${state.unmounted === 'should-enter' ? 't_unmounted ' : ''}${viewProps.className || ''} ${animations.className}`
        }
      }

      if (process.env.NODE_ENV === 'development' && time) time`animations`
    }

    if (process.env.NODE_ENV === 'development' && props.untilMeasured && !props.group) {
      console.warn(
        `You set the untilMeasured prop without setting group. This doesn't work, be sure to set untilMeasured on the parent that sets group, not the children that use the $group- prop.\n\nIf you meant to do this, you can disable this warning - either change untilMeasured and group at the same time, or do group={conditional ? 'name' : undefined}`
      )
    }

    if (process.env.NODE_ENV === 'development' && time) time`destructure`

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

    viewProps =
      hooks.usePropsTransform?.(
        elementType,
        nonTamaguiProps,
        stateRef,
        curStateRef.willHydrate
      ) || nonTamaguiProps

    if (!curStateRef.composedRef) {
      curStateRef.composedRef = composeRefs<TamaguiElement>(
        (x) => (stateRef.current.host = x as TamaguiElement),
        forwardedRef,
        setElementProps
      )
    }

    viewProps.ref = curStateRef.composedRef

    if (process.env.NODE_ENV === 'development') {
      if (!isReactNative && !isText && isWeb && !isHOC) {
        React.Children.toArray(props.children).forEach((item) => {
          // allow newlines because why not its annoying with mdx
          if (typeof item === 'string' && item !== '\n') {
            console.error(
              `Unexpected text node: ${item}. A text node cannot be a child of a <${staticConfig.componentName || propsIn.tag || 'View'}>.`,
              props
            )
          }
        })
      }
    }

    if (process.env.NODE_ENV === 'development' && time) time`events-hooks`

    // combined multiple effects into one for performance so be careful with logic
    // should not be a layout effect because otherwise it wont render the initial state
    // for example css driver needs to render once with the first styles, then again with the next
    // if its a layout effect it will just skip that first <render >output
    const { pseudoGroups, mediaGroups } = splitStyles

    const unPress = () => setStateShallow({ press: false, pressIn: false })

    if (process.env.NODE_ENV === 'development' && isWeb) {
      useIsomorphicLayoutEffect(() => {
        if (debugProp === 'verbose') {
          function cssStyleDeclarationToObject(style: CSSStyleDeclaration) {
            const styleObject: Record<string, any> = {}
            for (let i = 0; i < style.length; i++) {
              let prop = style[i]
              styleObject[prop] = style.getPropertyValue(prop)
            }
            return styleObject
          }
          const computed = cssStyleDeclarationToObject(
            getComputedStyle(stateRef.current.host! as any)
          )
          console.groupCollapsed(`Rendered > (opacity: ${computed.opacity})`)
          console.warn(stateRef.current.host)
          console.warn(computed)
          console.groupEnd()
        }
      })
    }

    React.useEffect(() => {
      if (disabled) {
        return
      }

      let tm

      if (state.unmounted === true && hasEnterStyle) {
        setStateShallow({ unmounted: 'should-enter' })
        return
      }

      if (state.unmounted) {
        // this setTimeout fixes moti and css driver enter animations
        // not sure why
        tm = setTimeout(() => {
          setStateShallow({ unmounted: false })
        })

        return () => clearTimeout(tm)
      }

      const dispose = subscribeToContextGroup({
        disabled,
        componentContext,
        setStateShallow,
        state,
        mediaGroups,
        pseudoGroups,
      })

      return () => {
        clearTimeout(tm)
        dispose?.()
        componentSetStates.delete(setState)
      }
    }, [
      state.unmounted,
      disabled,
      pseudoGroups ? Object.keys([...pseudoGroups]).join('') : 0,
      mediaGroups ? Object.keys([...mediaGroups]).join('') : 0,
    ])

    // if its a group its gotta listen for pseudos to emit them to children

    const runtimePressStyle = !disabled && noClass && pseudos?.pressStyle
    const runtimeFocusStyle = !disabled && noClass && pseudos?.focusStyle
    const runtimeFocusVisibleStyle = !disabled && noClass && pseudos?.focusVisibleStyle
    const attachFocus = Boolean(
      runtimePressStyle ||
        runtimeFocusStyle ||
        runtimeFocusVisibleStyle ||
        onFocus ||
        onBlur ||
        !!componentContext.setParentFocusState
    )
    const attachPress = Boolean(
      groupName ||
        runtimePressStyle ||
        onPress ||
        onPressOut ||
        onPressIn ||
        onMouseDown ||
        onMouseUp ||
        onLongPress ||
        onClick ||
        pseudos?.focusVisibleStyle
    )
    const runtimeHoverStyle = !disabled && noClass && pseudos?.hoverStyle
    const needsHoverState = Boolean(
      groupName || runtimeHoverStyle || onHoverIn || onHoverOut
    )
    const attachHover =
      isWeb && !!(groupName || needsHoverState || onMouseEnter || onMouseLeave)

    // check presence rather than value to prevent reparenting bugs
    // allows for onPress={x ? function : undefined} without re-ordering dom
    const shouldAttach =
      !disabled &&
      !props.asChild &&
      Boolean(
        attachFocus ||
          attachPress ||
          attachHover ||
          runtimePressStyle ||
          runtimeHoverStyle ||
          runtimeFocusStyle
      )

    const needsPressState = Boolean(groupName || runtimePressStyle)

    if (process.env.NODE_ENV === 'development' && time) time`events-setup`

    if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
      log(`🪩 events()`, {
        runtimeFocusStyle,
        runtimePressStyle,
        runtimeHoverStyle,
        runtimeFocusVisibleStyle,
        attachPress,
        attachFocus,
        attachHover,
        shouldAttach,
        needsHoverState,
        pseudos,
      })
    }

    const events: TamaguiComponentEvents | null = shouldAttach
      ? {
          onPressOut: attachPress
            ? (e) => {
                unPress()
                onPressOut?.(e)
                onMouseUp?.(e)
              }
            : undefined,
          ...((attachHover || attachPress) && {
            onMouseEnter: (e) => {
              const next: Partial<typeof state> = {}
              if (needsHoverState) {
                next.hover = true
              }
              if (needsPressState) {
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
              if (needsHoverState) {
                next.hover = false
              }
              if (needsPressState) {
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
                if (runtimePressStyle || groupName) {
                  setStateShallow({
                    press: true,
                    pressIn: true,
                  })
                }
                onPressIn?.(e)
                onMouseDown?.(e)
                if (isWeb) {
                  componentSetStates.add(setState)
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
              if (componentContext.setParentFocusState) {
                componentContext.setParentFocusState({ focusWithin: true })
              }
              if (pseudos?.focusVisibleStyle) {
                setTimeout(() => {
                  setStateShallow({
                    focus: true,
                    focusVisible: !!lastInteractionWasKeyboard.value,
                  })
                }, 0)
              } else {
                setStateShallow({
                  focus: true,
                  focusVisible: false,
                })
              }
              onFocus?.(e)
            },
            onBlur: (e) => {
              if (componentContext.setParentFocusState) {
                componentContext.setParentFocusState({ focusWithin: false })
              }
              setStateShallow({
                focus: false,
                focusVisible: false,
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
        disabled: disabled,
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
      log(`events`, { events, attachHover, attachPress })
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
      useChildrenResult = hooks.useChildren(elementType, content, viewProps)
    }

    if (process.env.NODE_ENV === 'development' && time) time`use-children`

    if (useChildrenResult) {
      content = useChildrenResult
    } else {
      content = React.createElement(elementType, viewProps, content)
    }

    // needs to reset the presence state for nested children
    const ResetPresence = config?.animations?.ResetPresence
    if (
      ResetPresence &&
      willBeAnimated &&
      (hasEnterStyle || presenceState) &&
      content &&
      typeof content !== 'string'
    ) {
      content = <ResetPresence>{content}</ResetPresence>
    }

    if (process.env.NODE_ENV === 'development' && time) time`create-element`

    // must override context so siblings don't clobber initial state
    const groupState = curStateRef.group
    const subGroupContext = React.useMemo(() => {
      if (!groupState || !groupName) return
      groupState.listeners.clear()
      // change reference so context value updates
      return {
        ...componentContext.groups,
        // change reference so as we mutate it doesn't affect siblings etc
        state: {
          ...componentContext.groups.state,
          [groupName]: {
            pseudo: defaultComponentStateMounted,
            // capture just initial width and height if they exist
            // will have top, left, width, height (not x, y)
            layout: {
              width: fromPx(splitStyles.style?.width as any),
              height: fromPx(splitStyles.style?.height as any),
            } as any,
          },
        },
        emit: groupState.emit,
        subscribe: groupState.subscribe,
      } satisfies ComponentContextI['groups']
    }, [groupName])

    if ((groupName && subGroupContext) || propsIn.focusWithinStyle) {
      content = (
        <ComponentContext.Provider
          {...componentContext}
          groups={subGroupContext}
          setParentFocusState={setStateShallow}
        >
          {content}
        </ComponentContext.Provider>
      )
    }

    if (process.env.NODE_ENV === 'development' && time) time`group-context`

    // disable theme prop is deterministic so conditional hook ok here
    content = disableTheme
      ? content
      : getThemedChildren(themeState, content, themeStateProps, false, stateRef)

    if (process.env.NODE_ENV === 'development' && time) time`themed-children`

    if (process.env.NODE_ENV === 'development' && props['debug'] === 'visualize') {
      content = (
        <ThemeDebug themeState={themeState} themeProps={props}>
          {content}
        </ThemeDebug>
      )
    }

    if (process.env.TAMAGUI_TARGET === 'web') {
      if (isReactNative && !asChild) {
        content = (
          <span
            className="_dsp_contents"
            {...(isHydrated && events && getWebEvents(events))}
          >
            {content}
          </span>
        )
      }
    }

    // ensure we override new context with style resolved values
    if (staticConfig.context) {
      const contextProps = staticConfig.context.props
      for (const key in contextProps) {
        if ((viewProps.style && key in viewProps.style) || key in viewProps) {
          overriddenContextProps ||= {}
          overriddenContextProps[key] = viewProps.style?.[key] ?? viewProps[key]
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

    // add in <style> tags inline
    const { rulesToInsert } = splitStyles
    if (process.env.TAMAGUI_TARGET === 'web' && process.env.TAMAGUI_REACT_19) {
      content = wrapStyleTags(Object.values(rulesToInsert), content)
    }

    if (process.env.NODE_ENV === 'development') {
      if (debugProp && debugProp !== 'profile') {
        const element = typeof elementType === 'string' ? elementType : 'Component'
        const title = `render <${element} /> (${internalID}) with props`
        if (!isWeb) {
          log(title)
          log(`state: `, state)
          if (isDevTools) {
            log('viewProps', viewProps)
          }
          log(`final styles:`)
          for (const key in splitStylesStyle) {
            log(key, splitStylesStyle[key])
          }
        } else {
          console.groupCollapsed(title)
          try {
            log('viewProps', viewProps)
            log('children', content)
            if (typeof window !== 'undefined') {
              log({
                propsIn,
                props,
                animationStyles,
                classNames,
                content,
                defaultProps,
                elementType,
                events,
                isAnimated,
                hasRuntimeMediaKeys,
                isStringElement,
                mediaListeningKeys,
                pseudos,
                shouldAttach,
                noClass,
                shouldListenForMedia,
                splitStyles,
                splitStylesStyle,
                state,
                stateRef,
                staticConfig,
                styleProps,
                themeState,
                viewProps,
                willBeAnimated,
              })
            }
          } catch {
            // RN can run into PayloadTooLargeError: request entity too large
          } finally {
            console.groupEnd()
          }
        }
        if (debugProp === 'break') {
          // biome-ignore lint/suspicious/noDebugger: ok
          debugger
        }
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

  type ComponentType = TamaguiComponent<
    ComponentPropTypes,
    Ref,
    BaseProps,
    BaseStyles,
    {}
  >

  let res: ComponentType = component as any

  if (process.env.TAMAGUI_FORCE_MEMO || staticConfig.memo) {
    res = React.memo(res) as any
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

    let out = isForwardedRefAlready
      ? (Component as any)
      : React.forwardRef(Component as any)

    const extendedConfig = extendStyledConfig(options?.staticConfig)

    out = options?.disableTheme ? out : (themeable(out, extendedConfig) as any)

    if (process.env.TAMAGUI_MEMOIZE_STYLEABLE) {
      out = React.memo(out)
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
type EventLikeObject = { [key in EventKeys]?: any }

function getWebEvents<E extends EventLikeObject>(events: E, webStyle = true) {
  return {
    onMouseEnter: events.onMouseEnter,
    onMouseLeave: events.onMouseLeave,
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
export const Spacer = createComponent<
  SpacerProps,
  TamaguiElement,
  StackNonStyleProps,
  SpacerStyleProps
>({
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
  ensureKeys?: boolean
  debug?: DebugProp
}

export function spacedChildren(props: SpacedChildrenProps) {
  const { isZStack, children, space, direction, spaceFlex, separator, ensureKeys } = props
  const hasSpace = !!(space || spaceFlex)
  const hasSeparator = !(separator === undefined || separator === null)
  const areChildrenArray = Array.isArray(children)

  if (!ensureKeys && !(hasSpace || hasSeparator || isZStack)) {
    return children
  }

  const childrenList = areChildrenArray
    ? (children as any[])
    : React.Children.toArray(children)

  const len = childrenList.length
  if (len <= 1 && !isZStack && !childrenList[0]?.['type']?.['shouldForwardSpace']) {
    return children
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
        <React.Fragment key={`${index}0t`}>
          {isZStack ? <AbsoluteFill>{child}</AbsoluteFill> : child}
        </React.Fragment>
      )
    }

    // first child unspaced avoid insert space
    if (isUnspaced(child) && index === 0) continue
    // no spacing on ZStack
    if (isZStack) continue

    const next = childrenList[index + 1]

    if (next && !isEmpty && !isUnspaced(next)) {
      if (separator) {
        if (hasSpace) {
          final.push(
            createSpacer({
              key: `_${index}_00t`,
              direction,
              space,
              spaceFlex,
            })
          )
        }
        final.push(<React.Fragment key={`${index}03t`}>{separator}</React.Fragment>)
        if (hasSpace) {
          final.push(
            createSpacer({
              key: `_${index}01t`,
              direction,
              space,
              spaceFlex,
            })
          )
        }
      } else {
        final.push(
          createSpacer({
            key: `_${index}02t`,
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

const fromPx = (val?: number | string) =>
  typeof val !== 'string' ? val : +val.replace('px', '')
