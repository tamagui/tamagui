import { composeRefs } from '@tamagui/compose-refs'
import {
  IS_REACT_19,
  isAndroid,
  isClient,
  isServer,
  isWeb,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import { composeEventHandlers, validStyles } from '@tamagui/helpers'
import { isEqualShallow } from '@tamagui/is-equal-shallow'
import React, { useMemo } from 'react'
import { devConfig, onConfiguredOnce } from './config'
import { stackDefaultStyles } from './constants/constants'
import { isDevTools } from './constants/isDevTools'
import { ComponentContext } from './contexts/ComponentContext'
import { GroupContext } from './contexts/GroupContext'
import { didGetVariableValue, setDidGetVariableValue } from './createVariable'
import { defaultComponentStateMounted } from './defaultComponentState'
import { getSplitStyles, useSplitStyles } from './helpers/getSplitStyles'
import { log } from './helpers/log'
import { type GenericProps, mergeComponentProps } from './helpers/mergeProps'
import { objectIdentityKey } from './helpers/objectIdentityKey'
import { setElementProps } from './helpers/setElementProps'
import { subscribeToContextGroup } from './helpers/subscribeToContextGroup'
import { themeable } from './helpers/themeable'
import { getStyleTags } from './helpers/wrapStyleTags'
import { useComponentState } from './hooks/useComponentState'
import { setMediaShouldUpdate, useMedia } from './hooks/useMedia'
import { useThemeWithState } from './hooks/useTheme'
import type { TamaguiComponentEvents } from './interfaces/TamaguiComponentEvents'
import { hooks } from './setupHooks'
import type {
  AllGroupContexts,
  ComponentGroupEmitter,
  DebugProp,
  GroupStateListener,
  LayoutEvent,
  PseudoGroupState,
  SingleGroupContext,
  SizeTokens,
  SpaceDirection,
  SpacerProps,
  SpacerStyleProps,
  SpaceValue,
  StackNonStyleProps,
  StackProps,
  StaticConfig,
  StyleableOptions,
  TamaguiComponent,
  TamaguiComponentState,
  TamaguiElement,
  TamaguiInternalConfig,
  TextProps,
  UseAnimationHook,
  UseAnimationProps,
  UseStyleEmitter,
  UseThemeWithStateProps,
  WebOnlyPressEvents,
} from './types'
import { Slot } from './views/Slot'
import { getThemedChildren } from './views/Theme'

/**
 * All things that need one-time setup after createTamagui is called
 */
let time: any

let debugKeyListeners: Set<Function> | undefined
let startVisualizer: Function | undefined

type ComponentSetState = React.Dispatch<React.SetStateAction<TamaguiComponentState>>

export const componentSetStates = new Set<ComponentSetState>()
const avoidReRenderKeys = new Set([
  'hover',
  'press',
  'pressIn',
  'group',
  'focus',
  'focusWithin',
  'media',
  'group',
])

if (process.env.TAMAGUI_TARGET !== 'native' && typeof window !== 'undefined') {
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

      if (devVisualizerConfig && !globalThis.__tamaguiDevVisualizer) {
        globalThis.__tamaguiDevVisualizer = true

        debugKeyListeners = new Set()
        let tm
        let isShowing = false
        let resizeListener: (() => void) | null = null
        const options = {
          key: 'Alt',
          delay: 800,
          ...(typeof devVisualizerConfig === 'object' ? devVisualizerConfig : {}),
        }

        function show(val: boolean) {
          clearTimeout(tm)
          isShowing = val
          debugKeyListeners?.forEach((l) => l(val))

          // Remove resize listener when hiding
          if (!val && resizeListener) {
            window.removeEventListener('resize', resizeListener)
            resizeListener = null
          }
        }

        function cancelShow() {
          clearTimeout(tm)
          if (resizeListener) {
            window.removeEventListener('resize', resizeListener)
            resizeListener = null
          }
        }

        window.addEventListener('blur', () => {
          show(false)
        })

        window.addEventListener('keydown', ({ key, metaKey, defaultPrevented }) => {
          clearTimeout(tm) // always clear so we dont trigger on chords
          if (defaultPrevented) return
          if (metaKey) return
          if (key === options.key) {
            // Add resize listener immediately when Alt is pressed
            if (!resizeListener) {
              resizeListener = () => cancelShow()
              window.addEventListener('resize', resizeListener)
            }
            tm = setTimeout(() => {
              show(true)
            }, options.delay)
          }
        })

        window.addEventListener('keyup', ({ defaultPrevented }) => {
          if (defaultPrevented) return
          cancelShow()
          // any key can clear it
          if (isShowing) {
            show(false)
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
if (isWeb && typeof document !== 'undefined') {
  document.addEventListener('keydown', () => {
    if (!lastInteractionWasKeyboard.value) {
      lastInteractionWasKeyboard.value = true
    }
  })
  document.addEventListener('mousedown', () => {
    if (lastInteractionWasKeyboard.value) {
      lastInteractionWasKeyboard.value = false
    }
  })
  document.addEventListener('mousemove', () => {
    if (lastInteractionWasKeyboard.value) {
      lastInteractionWasKeyboard.value = false
    }
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

    // set variants through context
    // order is after default props but before props
    const { context, isReactNative } = staticConfig
    const debugProp = propsIn['debug'] as DebugProp

    const styledContextValue: GenericProps | undefined = context
      ? React.useContext(context)
      : undefined
    let overriddenContextProps: GenericProps | null = null

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
    if (process.env.NODE_ENV === 'development' && time) time`non-tamagui time (ignore)`

    // React inserts default props after your props for some reason...
    // order important so we do loops, you can't just spread because JS does weird things
    let props: StackProps | TextProps = propsIn

    // merge both default props and styled context props - ensure order is preserved
    if (styledContextValue || defaultProps) {
      const [nextProps, overrides] = mergeComponentProps(
        defaultProps,
        styledContextValue,
        propsIn
      )
      if (nextProps) {
        props = nextProps as StackProps | TextProps
      }
      overriddenContextProps = overrides
    }

    const componentName = props.componentName || staticConfig.componentName

    if (process.env.NODE_ENV === 'development' && isClient) {
      React.useEffect(() => {
        let node: HTMLElement | undefined
        let overlay: HTMLSpanElement | null = null

        const remove = () => {
          if (overlay) {
            try {
              overlay.parentNode?.removeChild(overlay)
              overlay = null
            } catch {
              // may have unmounted
            }
          }
        }

        const debugVisualizerHandler = (show = false) => {
          node = stateRef.current.host as HTMLElement | undefined
          if (!node) return

          if (show) {
            if (!overlay) {
              overlay = document.createElement('span')
              overlay.style.inset = '0px'
              overlay.style.zIndex = '1000000'
              overlay.style.position = 'absolute'
              overlay.style.borderColor = 'red'
              overlay.style.borderWidth = '1px'
              overlay.style.borderStyle = 'dotted'
            }

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
            tooltip.innerText = `${componentName || ''} ${dataAt} ${dataIn}`.trim()

            overlay.appendChild(tooltip)
            node.appendChild(overlay)
          } else {
            remove()
          }
        }

        debugKeyListeners ||= new Set()
        debugKeyListeners.add(debugVisualizerHandler)

        return () => {
          remove()
          debugKeyListeners?.delete(debugVisualizerHandler)
        }
      }, [componentName])
    }

    const componentContext = React.useContext(ComponentContext)
    const groupContextParent = React.useContext(GroupContext)
    const animationDriver = componentContext.animationDriver
    const useAnimations = animationDriver?.useAnimations as UseAnimationHook | undefined

    const componentState = useComponentState(
      props,
      animationDriver?.isStub ? null : animationDriver,
      staticConfig,
      config!
    )

    const {
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
      noClass,
      state,
      stateRef,
      supportsCSS,
      willBeAnimated,
      willBeAnimatedClient,
      startedUnhydrated,
    } = componentState

    if (hasAnimationProp && animationDriver?.avoidReRenders) {
      useIsomorphicLayoutEffect(() => {
        const pendingState = stateRef.current.nextState
        if (pendingState) {
          stateRef.current.nextState = undefined
          componentState.setStateShallow(pendingState)
        }
      })
    }

    // create new context with groups, or else sublings will grab the same one
    const allGroupContexts = useMemo((): AllGroupContexts | null => {
      if (!groupName || props.passThrough) {
        return groupContextParent
      }

      const listeners = new Set<GroupStateListener>()
      stateRef.current.group?.listeners?.clear()
      stateRef.current.group = {
        listeners,
        emit(state) {
          listeners.forEach((l) => l(state))
        },
        subscribe(cb) {
          listeners.add(cb)
          if (listeners.size === 1) {
            setStateShallow({ hasDynGroupChildren: true })
          }
          return () => {
            listeners.delete(cb)
            if (listeners.size === 0) {
              setStateShallow({ hasDynGroupChildren: false })
            }
          }
        },
      }

      return {
        ...groupContextParent,
        [groupName]: {
          state: {
            pseudo: defaultComponentStateMounted,
          },
          subscribe: (listener) => {
            const dispose = stateRef.current.group?.subscribe(listener)
            return () => {
              dispose?.()
            }
          },
        },
      }
    }, [stateRef, groupName, groupContextParent])

    // if our animation driver supports noReRender, we'll replace this below with
    // a version that essentially uses an internall emitter rather than setting state
    // but still stores the current state and applies if it it needs to during render
    let setStateShallow = componentState.setStateShallow

    if (process.env.NODE_ENV === 'development' && time) time`use-state`

    const hasTextAncestor = !!(isWeb && isText ? componentContext.inText : false)

    const isTaggable = !Component || typeof Component === 'string'
    const tagProp = props.tag
    // default to tag, fallback to component (when both strings)
    const element = isWeb ? (isTaggable ? tagProp || Component : Component) : Component

    const BaseTextComponent = BaseText || element || 'span'
    const BaseViewComponent = BaseView || element || (hasTextAncestor ? 'span' : 'div')

    let elementType = isText ? BaseTextComponent : BaseViewComponent

    if (
      animationDriver &&
      isAnimated &&
      // this should really be behind another prop as it's not really related to
      // "needsWebStyles" basically with motion we just animate a plain div, but
      // we still have animated.View/Text for Sheet which wants to control
      // things declaratively
      !animationDriver.needsWebStyles
    ) {
      elementType = animationDriver[isText ? 'Text' : 'View'] || elementType
    }

    // internal use only
    const disableThemeProp =
      process.env.TAMAGUI_TARGET === 'native' ? false : props['data-disable-theme']

    const disableTheme = disableThemeProp || isHOC

    if (process.env.NODE_ENV === 'development' && time) time`theme-props`

    if (props.themeShallow) {
      stateRef.current.themeShallow = true
    }

    const themeStateProps: UseThemeWithStateProps = {
      componentName,
      disable: disableTheme,
      shallow: stateRef.current.themeShallow,
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
    if (typeof stateRef.current.isListeningToTheme === 'boolean') {
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
        const banner = `<${name} /> ${internalID} ${dataIs ? ` ${dataIs}` : ''} ${type.trim()} (hydrated: ${isHydrated}) (unmounted: ${state.unmounted})`

        const ch = propsIn.children
        let childLog =
          typeof ch === 'string' ? (ch.length > 4 ? ch.slice(0, 4) + '...' : ch) : ''
        if (childLog.length) {
          childLog = `(children: ${childLog})`
        }

        if (isWeb) {
          console.info(`%c ${banner}`, 'background: green; color: white;')
          if (isServer) {
            log({ noClass, isAnimated, isWeb, supportsCSS })
          } else {
            // if strict mode or something messes with our nesting this fixes:
            console.groupEnd()

            console.groupCollapsed(`${childLog} [inspect props, state, context 👇]`)
            log('props in:', propsIn)
            log('final props:', props, Object.keys(props))
            log({ state, staticConfig, elementType, themeStateProps })
            log({
              context,
              overriddenContextProps,
              componentContext,
            })
            log({ presence, isAnimated, isHOC, hasAnimationProp, useAnimations })
            console.groupEnd()
          }
        } else {
          console.info(
            `\n\n------------------------------\n${banner}\n------------------------------\n`
          )
          log(`children:`, props.children)
          log({ overriddenContextProps, styledContextValue })
          log({ noClass, isAnimated, isWeb, supportsCSS })
        }
      }
    }

    if (process.env.NODE_ENV === 'development' && time) time`pre-theme-media`

    const [theme, themeState] = useThemeWithState(themeStateProps)

    if (process.env.NODE_ENV === 'development' && time) time`theme`

    elementType = Component || elementType
    const isStringElement = typeof elementType === 'string'

    const mediaState = useMedia(componentContext, debugProp)

    setDidGetVariableValue(false)

    if (process.env.NODE_ENV === 'development' && time) time`media`

    const resolveValues =
      // if HOC + mounted + has animation prop, resolve as value so it passes non-variable to child
      (isAnimated && !supportsCSS) ||
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
      styledContext: styledContextValue,
    } as const

    const themeName = themeState?.name || ''

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
      allGroupContexts,
      elementType,
      startedUnhydrated,
      debugProp
    )

    const isPassthrough = !splitStyles

    // splitStyles === null === passThrough

    // Merge style-resolved context overrides (issues #3670, #3676)
    // When styles set values that are also context keys (from variants, pseudos, media, etc),
    // we need to add them to overriddenContextProps so they propagate to children
    // Use either the component's own context or its parent's context (for styled() inheritance)
    let contextForOverride = staticConfig.context
    if (splitStyles?.overriddenContextProps) {
      const contextForProps =
        staticConfig.context || staticConfig.parentStaticConfig?.context
      if (contextForProps) {
        for (const key in splitStyles.overriddenContextProps) {
          overriddenContextProps ||= {}
          overriddenContextProps[key] = splitStyles.overriddenContextProps[key]
        }
        // Use parent's context if this component doesn't have its own
        if (!staticConfig.context) {
          contextForOverride = contextForProps
        }
      }
    }

    const groupContext = groupName ? allGroupContexts?.[groupName] || null : null

    // one tiny mutation 🙏 get width/height optimistically from raw values if possible
    // if set hardcoded it avoids extra renders
    if (
      !isPassthrough &&
      groupContext &&
      // avoids onLayout if we don't need it
      props.containerType !== 'normal'
    ) {
      const groupState = groupContext?.state
      if (groupState && groupState.layout === undefined) {
        if (splitStyles.style?.width || splitStyles.style?.height) {
          groupState.layout = {
            width: fromPx(splitStyles.style.width),
            height: fromPx(splitStyles.style.height),
          }
        }
      }
    }

    // avoids re-rendering if animation driver supports it
    // TODO believe we need to set some sort of "pendingState" in case it re-renders
    if (
      !isPassthrough &&
      (hasAnimationProp || groupName) &&
      animationDriver?.avoidReRenders
    ) {
      const ogSetStateShallow = setStateShallow

      stateRef.current.updateStyleListener = () => {
        const updatedState = stateRef.current.nextState || state
        const mediaState = stateRef.current.nextMedia

        const nextStyles = getSplitStyles(
          props,
          staticConfig,
          theme,
          themeName,
          updatedState,
          mediaState ? { ...styleProps, mediaState } : styleProps,
          null,
          componentContext,
          allGroupContexts,
          elementType,
          startedUnhydrated,
          debugProp
        )

        const useStyleListener = stateRef.current.useStyleListener

        useStyleListener?.((nextStyles?.style || {}) as any)
      }

      function updateGroupListeners() {
        const updatedState = stateRef.current.nextState!
        if (groupContext) {
          const {
            group,
            hasDynGroupChildren,
            unmounted,
            animation,
            ...childrenGroupState
          } = updatedState
          notifyGroupSubscribers(
            groupContext,
            stateRef.current.group || null,
            childrenGroupState
          )
        }
      }

      // don't change this ever or else you break ComponentContext and cause re-rendering
      componentContext.mediaEmit ||= (next) => {
        stateRef.current.nextMedia = next
        stateRef.current.updateStyleListener?.()
      }

      stateRef.current.setStateShallow = (nextOrGetNext) => {
        const prev = stateRef.current.nextState || state
        const next =
          typeof nextOrGetNext === 'function' ? nextOrGetNext(prev) : nextOrGetNext

        if (next === prev || isEqualShallow(prev, next)) {
          return
        }

        // one thing we have to handle here and where it gets a bit more complex is group styles
        const canAvoidReRender = Object.keys(next).every((key) =>
          avoidReRenderKeys.has(key)
        )

        const updatedState = {
          ...prev,
          ...next,
        }
        stateRef.current.nextState = updatedState

        if (canAvoidReRender) {
          if (
            process.env.NODE_ENV === 'development' &&
            debugProp &&
            debugProp !== 'profile'
          ) {
            console.groupCollapsed(`[⚡️] avoid setState`, componentName, next, {
              updatedState,
              props,
            })
            console.info(stateRef.current.host)
            console.groupEnd()
          }

          updateGroupListeners()
          stateRef.current.updateStyleListener?.()
        } else {
          if (
            process.env.NODE_ENV === 'development' &&
            debugProp &&
            debugProp !== 'profile'
          ) {
            console.info(`[🐌] re-render`, { canAvoidReRender, next })
          }
          ogSetStateShallow(next)
        }
      }

      // needs to capture latest props (it's called from memoized `events`)
      setStateShallow = (state) => {
        stateRef.current.setStateShallow?.(state)
      }
    }

    if (process.env.NODE_ENV === 'development' && time) time`split-styles`

    // hide strategy will set this opacity = 0 until measured
    if (splitStyles) {
      if (
        props.group &&
        props.untilMeasured === 'hide' &&
        !stateRef.current.hasMeasured
      ) {
        splitStyles.style ||= {}
        splitStyles.style.opacity = 0
      }

      if (splitStyles.dynamicThemeAccess != null) {
        stateRef.current.isListeningToTheme = splitStyles.dynamicThemeAccess
      }
    }

    // only listen for changes if we are using raw theme values or media space, or dynamic media (native)
    // array = space media breakpoints
    const hasRuntimeMediaKeys = splitStyles?.hasMedia && splitStyles.hasMedia !== true
    const shouldListenForMedia =
      didGetVariableValue() ||
      hasRuntimeMediaKeys ||
      (noClass && splitStyles?.hasMedia === true)

    const mediaListeningKeys = hasRuntimeMediaKeys
      ? (splitStyles.hasMedia as Set<string>)
      : null
    if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
      console.info(`useMedia() createComponent`, shouldListenForMedia, mediaListeningKeys)
    }

    setMediaShouldUpdate(componentContext, shouldListenForMedia, mediaListeningKeys)

    const {
      viewProps: viewPropsIn,
      pseudos,
      style: splitStylesStyle,
      classNames,
      space,
      pseudoGroups,
      mediaGroups,
    } = splitStyles || {}

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
      passThrough,
      forceStyle: _forceStyle,
      // @ts-ignore  for next/link compat etc
      onClick,
      theme: _themeProp,
      ...nonTamaguiProps
    } = viewPropsIn || {}

    // these can ultimately be for DOM, react-native-web views, or animated views
    // so the type is pretty loose
    let viewProps = nonTamaguiProps

    if (!isTaggable && props.forceStyle) {
      viewProps.forceStyle = props.forceStyle
    }

    if (isHOC) {
      if (typeof _themeProp !== 'undefined') {
        viewProps.theme = _themeProp
      }
      if (typeof passThrough !== 'undefined') {
        viewProps.passThrough = passThrough
      }
    }

    if (tagProp && elementType['acceptTagProp']) {
      viewProps.tag = tagProp
    }

    // once you set animation prop don't remove it, you can set to undefined/false
    // reason is animations are heavy - no way around it, and must be run inline here (🙅 loading as a sub-component)
    let animationStyles: any
    const shouldUseAnimation =
      // if it supports css vars we run it on server too to get matching initial style
      (supportsCSS ? willBeAnimatedClient : willBeAnimated) && useAnimations && !isHOC

    let animatedRef

    if (shouldUseAnimation) {
      const useStyleEmitter: UseStyleEmitter | undefined = animationDriver?.avoidReRenders
        ? (listener) => {
            stateRef.current.useStyleListener = listener
          }
        : undefined

      const animations = useAnimations({
        props: propsWithAnimation,
        // if hydrating, send empty style
        style: splitStylesStyle || {},
        // @ts-ignore
        styleState: splitStyles,
        useStyleEmitter,
        presence,
        componentState: state,
        styleProps,
        theme,
        pseudos: pseudos || null,
        staticConfig,
        stateRef,
      })

      if (animations) {
        if (animations.ref) {
          // @ts-ignore
          animatedRef = animations.ref
        }

        if (isHydrated && animations) {
          animationStyles = animations.style
          viewProps.style = animationStyles
          if (animations.className) {
            viewProps.className = `${state.unmounted === 'should-enter' ? 't_unmounted ' : ''}${viewProps.className || ''} ${animations.className}`
          }
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

    if (
      !isPassthrough &&
      groupContext && // avoids onLayout if we don't need it
      props.containerType !== 'normal'
    ) {
      nonTamaguiProps.onLayout = composeEventHandlers(
        nonTamaguiProps.onLayout,
        (e: LayoutEvent) => {
          // one off update here
          const layout = e.nativeEvent.layout
          groupContext.state.layout = layout
          stateRef.current.group?.emit({
            layout,
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
        stateRef.current.willHydrate
      ) || nonTamaguiProps

    if (!stateRef.current.composedRef) {
      stateRef.current.composedRef = composeRefs<TamaguiElement>(
        (x) => (stateRef.current.host = x as TamaguiElement),
        forwardedRef,
        setElementProps,
        animatedRef
      )
    }

    viewProps.ref = stateRef.current.composedRef

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

    const unPress = () => {
      setStateShallow({ press: false, pressIn: false })
    }

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
          const computed = stateRef.current.host
            ? cssStyleDeclarationToObject(
                getComputedStyle(stateRef.current.host as Element)
              )
            : {}
          console.groupCollapsed(`Rendered > (opacity: ${computed.opacity})`)
          console.warn(stateRef.current.host)
          console.warn(computed)
          console.groupEnd()
        }
      })
    }

    // TODO should this be regular effect to allow the render in-between?
    useIsomorphicLayoutEffect(() => {
      // Note: We removed the early return on disabled to allow animations to work
      // This fixes the issue where animations wouldn't work on disabled components
      if (state.unmounted === true && hasEnterStyle) {
        setStateShallow({ unmounted: 'should-enter' })
        return
      }

      let tm: NodeJS.Timeout
      if (state.unmounted) {
        if (animationDriver?.supportsCSS || isAndroid) {
          // this setTimeout fixes css driver enter animations  - not sure why
          // this setTimeout fixes the conflict when with the safe area view in android
          tm = setTimeout(() => {
            setStateShallow({ unmounted: false })
          })
          return () => clearTimeout(tm)
          // don't clearTimeout! safari gets bugs it just doesn't ever set unmounted: false
        }

        setStateShallow({ unmounted: false })
        return
      }

      // Only subscribe to context group if not disabled

      return () => {
        componentSetStates.delete(setState)
      }
    }, [state.unmounted, disabled])

    useIsomorphicLayoutEffect(() => {
      if (disabled) return

      if (!pseudoGroups && !mediaGroups) return
      if (!allGroupContexts) return
      return subscribeToContextGroup({
        groupContext: allGroupContexts,
        setStateShallow,
        mediaGroups,
        pseudoGroups,
      })
    }, [
      allGroupContexts,
      disabled,
      pseudoGroups ? objectIdentityKey(pseudoGroups) : 0,
      mediaGroups ? objectIdentityKey(mediaGroups) : 0,
    ])

    const groupEmitter = stateRef.current.group
    useIsomorphicLayoutEffect(() => {
      if (!groupContext || !groupEmitter) return

      notifyGroupSubscribers(groupContext, groupEmitter, state)
    }, [groupContext, groupEmitter, state])

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

    const hasDynamicGroupChildren = Boolean(groupName && state.hasDynGroupChildren)

    const attachPress = Boolean(
      hasDynamicGroupChildren ||
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
    const needsHoverState = Boolean(hasDynamicGroupChildren || runtimeHoverStyle)
    const attachHover =
      isWeb &&
      !!(hasDynamicGroupChildren || needsHoverState || onMouseEnter || onMouseLeave)

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

    const needsPressState = Boolean(hasDynamicGroupChildren || runtimePressStyle)

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
                if (needsPressState) {
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
              const next: Partial<typeof state> = {}
              if (componentContext.setParentFocusState) {
                next.focusWithin = true
              }
              if (pseudos?.focusVisibleStyle) {
                if (lastInteractionWasKeyboard.value) {
                  next.focusVisible = true
                } else {
                  next.focus = true
                }
              } else {
                next.focus = true
              }
              setStateShallow(next)
              onFocus?.(e)
            },
            onBlur: (e) => {
              if (componentContext.setParentFocusState) {
                componentContext.setParentFocusState({ focusWithin: false })
              }
              setStateShallow({
                focus: false,
                focusVisible: false,
                focusWithin: false,
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
      !children || asChild || !splitStyles
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

    if (isPassthrough) {
      content = propsIn.children
      elementType = BaseViewComponent
      viewProps = {
        style: {
          display: 'contents',
        },
      }
    }

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
    const needsReset = Boolean(
      // not when passing down to child
      !asChild &&
        // not when passThrough
        splitStyles &&
        // not when HOC
        !isHOC &&
        ResetPresence &&
        willBeAnimated &&
        (hasEnterStyle || presenceState)
    )
    // avoid re-parenting
    const hasEverReset = stateRef.current.hasEverResetPresence
    if (needsReset && !hasEverReset) {
      stateRef.current.hasEverResetPresence = true
    }
    const renderReset = needsReset || hasEverReset
    if (renderReset && ResetPresence) {
      content = <ResetPresence disabled={!needsReset}>{content}</ResetPresence>
    }

    if (process.env.NODE_ENV === 'development' && time) time`create-element`

    if ('focusWithinStyle' in propsIn) {
      content = (
        <ComponentContext.Provider
          {...componentContext}
          setParentFocusState={setStateShallow}
        >
          {content}
        </ComponentContext.Provider>
      )
    }

    if ('group' in props) {
      content = (
        <GroupContext.Provider value={allGroupContexts}>{content}</GroupContext.Provider>
      )
    }

    if (process.env.NODE_ENV === 'development' && time) time`group-context`

    content =
      disableTheme || !splitStyles
        ? content
        : getThemedChildren(themeState, content, themeStateProps, false, stateRef)

    if (process.env.NODE_ENV === 'development' && time) time`themed-children`

    if (process.env.TAMAGUI_TARGET === 'web') {
      if (isReactNative && !asChild) {
        content = (
          <span
            className="_dsp_contents"
            {...(!isPassthrough && isHydrated && events && getWebEvents(events))}
          >
            {content}
          </span>
        )
      }
    }

    if (overriddenContextProps && contextForOverride) {
      const Provider = contextForOverride.Provider!

      // make sure we re-order styled context keys based on how we pass them here:
      for (const key in styledContextValue) {
        if (!(key in overriddenContextProps)) {
          overriddenContextProps[key] = styledContextValue[key]
        }
      }

      if (debugProp) {
        console.info('overriddenContextProps', overriddenContextProps)
      }

      content = (
        <Provider __disableMergeDefaultValues {...overriddenContextProps}>
          {content}
        </Provider>
      )
    }

    if (process.env.NODE_ENV === 'development' && time) time`context-override`

    // SSR style support - for non compiled styles we render them inline until client takes over
    // on client we then switch over to our global sheet insert, because rendering inline is expensive
    if (process.env.TAMAGUI_TARGET === 'web' && startedUnhydrated && splitStyles) {
      content = (
        <>
          {content}
          {/* we surpress hydration warnings */}
          {!isHydrated ? getStyleTags(Object.values(splitStyles.rulesToInsert)) : null}
        </>
      )
    }

    if (process.env.NODE_ENV === 'development' && time) time`style-tags`

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
                attachPress,
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
                startedUnhydrated,
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

  function notifyGroupSubscribers(
    groupContext: SingleGroupContext | null,
    groupEmitter: ComponentGroupEmitter | null,
    pseudo: PseudoGroupState
  ) {
    if (!groupContext || !groupEmitter) {
      return
    }
    const nextState = { ...groupContext.state, pseudo }
    groupEmitter.emit(nextState)
    groupContext.state = nextState
  }

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
    const skipForwardRef =
      (IS_REACT_19 && typeof Component === 'function' && Component.length === 1) ||
      Component.render?.length === 2

    let out = skipForwardRef ? Component : React.forwardRef(Component)

    const extendedConfig = extendStyledConfig(options?.staticConfig)

    out = options?.disableTheme ? out : themeable(out, extendedConfig, true)

    if (extendedConfig.memo || process.env.TAMAGUI_MEMOIZE_STYLEABLE) {
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
  size = size === false ? 0 : size === true ? '$true' : size
  const sizePx = tokens.space[size] ?? size
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

  const childrenList = areChildrenArray ? children : React.Children.toArray(children)

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
        // @ts-expect-error we explicitly know with shouldForwardSpace
        space,
        spaceFlex,
        separator,
        key: child.key,
      })
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

const fromPx = (val?: any): number => {
  if (typeof val === 'number') return val
  if (typeof val === 'string') return +val.replace('px', '')
  return 0
}
