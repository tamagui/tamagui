import { composeRefs } from '@tamagui/compose-refs'
import { isClient, isServer, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { composeEventHandlers } from '@tamagui/helpers'
import { isEqualShallow } from '@tamagui/is-equal-shallow'
import React, { ReactElement, ReactNode, useMemo } from 'react'
import { devConfig, getConfig } from './config'
import { isDevTools } from './constants/isDevTools'
import { ComponentContext } from './contexts/ComponentContext'
import { GroupContext } from './contexts/GroupContext'
import { didGetVariableValue, setDidGetVariableValue } from './createVariable'
import { defaultComponentStateMounted } from './defaultComponentState'
import { getWebEvents, useEvents, wrapWithGestureDetector } from './eventHandling'
import { getDefaultProps } from './helpers/getDefaultProps'
import { getSplitStyles, useSplitStyles } from './helpers/getSplitStyles'
import { log } from './helpers/log'
import { type GenericProps, mergeComponentProps } from './helpers/mergeProps'
import { mergeRenderElementProps } from './helpers/mergeRenderElementProps'
import { objectIdentityKey } from './helpers/objectIdentityKey'
import { usePointerEvents } from './helpers/pointerEvents'
import {
  extractPseudoState,
  resolveEffectivePseudoTransition,
} from './helpers/pseudoTransitions'
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
} from './types'
import { Slot } from './views/Slot'
import { getThemedChildren } from './views/Theme'
import type { ViewProps } from './views/View'

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
  const cancelPresses = () => {
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
  const cancelTouches = () => {
    // clear press and hover on touch end - hover may have been set
    // via synthetic mouseenter event triggered by touch
    componentSetStates.forEach((setState) =>
      setState((prev) => {
        if (prev.press || prev.pressIn || prev.hover) {
          return {
            ...prev,
            press: false,
            pressIn: false,
            hover: false,
          }
        }
        return prev
      })
    )
    componentSetStates.clear()
  }
  addEventListener('mouseup', cancelPresses)
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
const lastInteractionWasTouch = { value: false }
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
    // Real mouse movement clears touch flag
    lastInteractionWasTouch.value = false
  })
  document.addEventListener('touchstart', () => {
    lastInteractionWasTouch.value = true
  })
  // Don't reset on touchend - mouseenter fires after touchend
  // and we need to still detect it as a touch interaction.
  // Mouse move will reset it when there's real mouse activity.
}

export function createComponent<
  ComponentPropTypes extends Record<string, any> = {},
  Ref extends TamaguiElement = TamaguiElement,
  BaseProps = never,
  BaseStyles extends object = never,
>(staticConfig: StaticConfig) {
  let config: TamaguiInternalConfig | null = null

  const { Component, isText, isHOC } = staticConfig

  const component = React.forwardRef<Ref, ComponentPropTypes>((propsIn, forwardedRef) => {
    'use no memo'

    config = config || getConfig()

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
        propsIn['data-test-renders']['current'] =
          propsIn['data-test-renders']['current'] ?? 0
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

    const componentContext = React.useContext(ComponentContext)
    const hasTextAncestor = !!(isWeb && isText ? componentContext.inText : false)

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
    let props: ViewProps | TextProps = propsIn

    const componentName = props.componentName || staticConfig.componentName

    // merge both default props and styled context props - ensure order is preserved
    const defaultProps = getDefaultProps(staticConfig, props.componentName)

    // merge styled context props over defaults, ensure order is preserved
    const [nextProps, overrides] = mergeComponentProps(
      defaultProps,
      styledContextValue,
      propsIn
    )

    props = nextProps as ViewProps | TextProps
    overriddenContextProps = overrides

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

        debugKeyListeners = debugKeyListeners || new Set()
        debugKeyListeners.add(debugVisualizerHandler)

        return () => {
          remove()
          debugKeyListeners?.delete(debugVisualizerHandler)
        }
      }, [componentName])
    }

    const groupContextParent = React.useContext(GroupContext)

    // Get animation driver - either from animatedBy prop lookup or context
    const animationDriver = (() => {
      if (props.animatedBy && config?.animations) {
        const animations = config.animations
        // If animations is an object with named drivers (has 'default' key)
        if ('default' in animations) {
          return (
            (animations as Record<string, any>)[props.animatedBy] ?? animations.default
          )
        }
        // Single driver config - only 'default' makes sense
        return props.animatedBy === 'default' ? animations : null
      }
      return componentContext.animationDriver
    })()

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

    // if our animation driver supports avoidReRenders, we'll replace this below with
    // a version that essentially uses an internall emitter rather than setting state
    // but still stores the current state and applies if it it needs to during render
    let setStateShallow = componentState.setStateShallow

    if (process.env.NODE_ENV === 'development' && time) time`use-state`

    // web-only - string-style not valid for native
    const renderProp = props.render
    const isRenderString = !Component || typeof Component === 'string'

    // default to render prop, fallback to component (when both strings)
    const element = isWeb
      ? isRenderString
        ? renderProp || Component
        : Component
      : Component

    const BaseTextComponent = BaseText || element || 'span'
    const BaseViewComponent = BaseView || element || (hasTextAncestor ? 'span' : 'div')
    const BaseComponent = isText ? BaseTextComponent : BaseViewComponent

    let elementType = BaseComponent

    const isAnimatedCustomComponent =
      animationDriver && isAnimated && animationDriver.needsCustomComponent

    if (isAnimatedCustomComponent) {
      elementType = animationDriver[isText ? 'Text' : 'View'] || elementType
    }

    // internal use only
    const disableThemeProp =
      process.env.TAMAGUI_TARGET === 'native' ? false : props['data-disable-theme']

    const disableTheme = disableThemeProp || isHOC

    if (process.env.NODE_ENV === 'development' && time) time`theme-props`

    const themeStateProps: UseThemeWithStateProps = {
      componentName,
      disable: disableTheme,
      shallow: props.themeShallow,
      debug: debugProp,
      unstyled: props.unstyled,
    }

    // this is set conditionally if existing in props because we wrap children with
    // a span if they ever set one of these, so avoid wrapping all children with span
    if ('theme' in props) {
      themeStateProps.name = props.theme
    }
    // Always set needsUpdate callback so it can check the ref's latest value
    // This ensures components with $theme-dark/$theme-light re-render on theme change
    // even when using raw colors (not tokens) since isListeningToTheme is set after useSplitStyles
    themeStateProps.needsUpdate = () => !!stateRef.current.isListeningToTheme
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

    elementType = element || elementType
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
          overriddenContextProps = overriddenContextProps || {}
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
        const useStyleListener = stateRef.current.useStyleListener

        // if no animation driver is listening for style updates, fall back to normal re-render
        // this happens when a component has group prop but no transition/animation prop
        if (!useStyleListener) {
          const pendingState = stateRef.current.nextState
          if (pendingState) {
            stateRef.current.nextState = undefined
            ogSetStateShallow(pendingState)
          }
          return
        }

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

        // compute effective transition based on entering/exiting pseudo states
        const effectiveTransition = resolveEffectivePseudoTransition(
          stateRef.current.prevPseudoState,
          updatedState,
          nextStyles?.pseudoTransitions,
          props.transition
        )

        // update prev state for next comparison (includes group states)
        stateRef.current.prevPseudoState = extractPseudoState(updatedState)

        useStyleListener((nextStyles?.style || {}) as any, effectiveTransition)
      }

      function updateGroupListeners() {
        const updatedState = stateRef.current.nextState!
        if (groupContext) {
          const {
            group,
            hasDynGroupChildren,
            unmounted,
            transition,
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
      // use a Set of listeners so multiple components can register
      componentContext.mediaEmitListeners =
        componentContext.mediaEmitListeners || new Set()

      // only register once per component instance
      if (!stateRef.current.mediaEmitCleanup) {
        const updateListener = (next: Record<string, boolean>) => {
          stateRef.current.nextMedia = next
          stateRef.current.updateStyleListener?.()
        }
        componentContext.mediaEmitListeners.add(updateListener)
        stateRef.current.mediaEmitCleanup = () => {
          componentContext.mediaEmitListeners?.delete(updateListener)
        }
      }

      componentContext.mediaEmit =
        componentContext.mediaEmit ||
        ((next) => {
          // notify all registered components
          for (const listener of componentContext.mediaEmitListeners!) {
            listener(next)
          }
        })

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
        splitStyles.style = splitStyles.style || {}
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

    if (props.forceStyle) {
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

      // compute effective transition once here (single source of truth)
      // avoidReRenders path also computes this in updateStyleListener
      const effectiveTransition = resolveEffectivePseudoTransition(
        stateRef.current.prevPseudoState,
        state,
        splitStyles?.pseudoTransitions,
        props.transition
      )

      // add effectiveTransition to splitStyles for drivers to consume
      if (splitStyles) {
        splitStyles.effectiveTransition = effectiveTransition
      }

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
        themeName,
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

    // handle pointer events (native: maps to touch events, web: no-op)
    usePointerEvents(props, viewProps)

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

    // Animation enter state machine: true -> 'should-enter' -> false
    // Stage 1: Set 'should-enter' synchronously before paint to apply enterStyle classes
    // Stage 2: After browser paint, set false to trigger CSS transition
    //
    // CRITICAL: useEffect does NOT guarantee post-paint execution!
    // See: https://thoughtspile.github.io/2021/11/15/unintentional-layout-effect/
    // When layoutEffect updates state → re-render before paint → useEffect flushes pre-paint
    // Solution: Double RAF ensures browser has actually painted before we transition
    useIsomorphicLayoutEffect(() => {
      if (state.unmounted === true && hasEnterStyle) {
        setStateShallow({ unmounted: 'should-enter' })
        return
      }

      if (state.unmounted) {
        // For CSS transitions, we need browser to paint enterStyle before removing it.
        // Double RAF guarantees paint: first RAF schedules after current frame,
        // second RAF schedules after that frame completes (including paint).
        if (supportsCSS) {
          let cancelled = false
          requestAnimationFrame(() => {
            if (cancelled) return
            requestAnimationFrame(() => {
              if (cancelled) return
              setStateShallow({ unmounted: false })
            })
          })
          return () => {
            cancelled = true
          }
        }
        // Non-CSS drivers handle their own animation timing
        setStateShallow({ unmounted: false })
      }

      return () => {
        componentSetStates.delete(setState)
        stateRef.current.mediaEmitCleanup?.()
      }
    }, [state.unmounted, supportsCSS])

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
              // Don't set hover on touch devices - touch triggers mouseenter
              // but there's no corresponding mouseleave on touch end
              if (needsHoverState && !lastInteractionWasTouch.value) {
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

    // EVENTS native - handles focus/blur, input special cases, and RNGH press handling
    // Skip gesture setup for HOC components - they may return null which crashes GestureDetector
    const pressGesture =
      process.env.TAMAGUI_TARGET === 'native'
        ? useEvents(events, viewProps, stateRef, staticConfig, isHOC)
        : null

    if (process.env.NODE_ENV === 'development' && time) time`hooks`

    if (asChild) {
      elementType = Slot
      // on native this is already merged into viewProps in useEvents
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

    let content: ReactNode | undefined

    if (isPassthrough) {
      // avoid re-parenting but avoid layout changes
      content = React.createElement(
        BaseComponent,
        {
          style: {
            display: 'contents',
          },
        },
        propsIn.children
      )
    } else {
      // here elementType is either the custom animated driver view, or base view
      if (hooks.useChildren) {
        // ONLY native:
        content = hooks.useChildren(elementType, content || children, viewProps)
      }

      const isRenderPropString = typeof renderProp === 'string'

      // this ONLY handles the case where render is NOT a string
      // either direct JSX, or a function that returns JSX, we always clone
      if (renderProp && !isRenderPropString) {
        const out = getCustomRender(
          renderProp,
          content || children,
          viewProps,
          componentState
        )
        if (out) {
          viewProps = out.viewProps
          elementType = out.elementType
        }
      }

      if (!content) {
        // web-only, handle render === string passing to custom animated component
        if (isRenderPropString) {
          viewProps.render === renderProp
        }

        content = React.createElement(elementType, viewProps, content || children)
      }

      if (process.env.NODE_ENV === 'development' && time) time`use-children`
    }

    // wrap with GestureDetector for RNGH press handling (native only, no-op on web)
    // Skip for HOC components - they pass press events to inner component instead
    if (process.env.TAMAGUI_TARGET === 'native') {
      content = wrapWithGestureDetector(content, pressGesture, stateRef, isHOC)
    }

    // needs to reset the presence state for nested children
    // Use the resolved animationDriver (handles multi-driver config)
    const ResetPresence = animationDriver?.ResetPresence
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

    // Text components set inText context for children so nested Text can inherit styles
    if (process.env.TAMAGUI_TARGET === 'web' && !asChild && isText && !hasTextAncestor) {
      content = (
        <ComponentContext.Provider {...componentContext} inText={true}>
          {content}
        </ComponentContext.Provider>
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
        if (!isWeb || !isClient) {
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
          // debugger intentionally here for debugging
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

  // we now have avoid re-renders in many more cases so imo this is way more worth it
  // Text/Button/string taking components
  //  + react compiler can memoize children too
  res = React.memo(res) as any

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

  function styleable(Component: any, options?: StyleableOptions) {
    const skipForwardRef = typeof Component === 'function' && Component.length === 1

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

  res.styleable = styleable

  return res
}

const fromPx = (val?: any): number => {
  if (typeof val === 'number') return val
  if (typeof val === 'string') return +val.replace('px', '')
  return 0
}

// handles all render logic - returns a new component
const getCustomRender = (
  renderProp: ViewProps['render'],
  content: ReactNode,
  viewProps: Record<string, unknown>,
  state: any
):
  | undefined
  | {
      viewProps: Record<string, any>
      elementType: any
    } => {
  // Handle render prop variants: function, JSX element, or string
  if (typeof renderProp === 'function') {
    // Render function: full control with props and state
    const out = renderProp(viewProps, state)
    renderProp = getRenderElementForPlatform(out)
  }

  if (renderProp) {
    if (typeof renderProp === 'object' && React.isValidElement(renderProp)) {
      // JSX element: clone with merged props
      const renderElement = getRenderElementForPlatform(renderProp)
      if (renderElement) {
        const elementProps = renderProp.props as Record<string, any> | undefined
        const mergedProps = elementProps
          ? mergeRenderElementProps(elementProps, viewProps, content)
          : viewProps

        return {
          elementType: renderProp.type,
          viewProps: mergedProps,
        }
      }
    }
  }
}

// avoid passing web-only elements to native
function getRenderElementForPlatform(potential: ReactElement) {
  if (process.env.TAMAGUI_TARGET === 'native') {
    if (isHTMLElement(potential)) {
      return
    }
  }
  return potential
}

function isHTMLElement(el: ReactElement) {
  return typeof el['type'] === 'string' && el['type'][0] === el['type'][0].toLowerCase()
}
