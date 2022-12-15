import { useComposedRefs } from '@tamagui/compose-refs'
import { isClient, isRSC, isServer, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  composeEventHandlers,
  stylePropsView,
  validPseudoKeys,
  validStyles,
} from '@tamagui/helpers'
import { useResponderEvents } from '@tamagui/react-native-use-responder-events'
import React, {
  Children,
  Fragment,
  RefObject,
  createElement,
  forwardRef,
  memo,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'

import { onConfiguredOnce } from './config'
import { stackDefaultStyles } from './constants/constants'
import { FontLanguageContext } from './contexts/FontLanguageContext'
import { TextAncestorContext } from './contexts/TextAncestorContext'
import { didGetVariableValue, setDidGetVariableValue } from './createVariable'
import { extendStaticConfig, parseStaticConfig } from './helpers/extendStaticConfig'
import { getRect } from './helpers/getRect'
import { useSplitStyles } from './helpers/getSplitStyles'
import { getAllSelectors } from './helpers/insertStyleRule'
import { mergeProps } from './helpers/mergeProps'
import { proxyThemeVariables } from './helpers/proxyThemeVariables'
import { useShallowSetState } from './helpers/useShallowSetState'
import { measureLayout, useElementLayout } from './hooks/useElementLayout'
import { setMediaShouldUpdate, useMedia } from './hooks/useMedia'
import { useServerRef, useServerState } from './hooks/useServerHooks'
import { getThemeIsNewTheme, getThemeManager, useTheme } from './hooks/useTheme'
import {
  DebugProp,
  SpaceDirection,
  SpaceTokens,
  SpacerProps,
  StaticConfig,
  StaticConfigParsed,
  StylableComponent,
  TamaguiComponent,
  TamaguiComponentState,
  TamaguiConfig,
  TamaguiElement,
  TamaguiInternalConfig,
  UseAnimationHook,
  UseAnimationProps,
} from './types'
import { usePressability } from './vendor/Pressability'
import { Slot, mergeEvent } from './views/Slot'
import { wrapThemeManagerContext } from './views/Theme'

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

/**
 * All things that need one-time setup after createTamagui is called
 */
let defaultComponentState: TamaguiComponentState | null = null
let defaultComponentStateMounted: TamaguiComponentState | null = null
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

// mutates
function mergeShorthands({ defaultProps }: StaticConfigParsed, { shorthands }: TamaguiConfig) {
  // they are defined in correct order already { ...parent, ...child }
  for (const key of Object.keys(defaultProps)) {
    defaultProps[shorthands[key] || key] = defaultProps[key]
  }
}

/**
 * Only on native do we need the actual underlying View/Text
 * On the web we avoid react-native altogether in core.
 */
let BaseText: any
let BaseView: any
if (process.env.TAMAGUI_TARGET === 'native') {
  const native = require('react-native')
  BaseText = native.Text || native.default.Text
  BaseView = native.View || native.default.View
}

export function createComponent<
  ComponentPropTypes extends Object = {},
  Ref = TamaguiElement,
  BaseProps = never
>(configIn: Partial<StaticConfig> | StaticConfigParsed, ParentComponent?: StylableComponent) {
  const staticConfig = (() => {
    const next = extendStaticConfig(configIn, ParentComponent)
    if ('parsed' in next) {
      return next
    } else {
      return parseStaticConfig(next)
    }
  })()

  const defaultComponentClassName = `is_${staticConfig.componentName}`
  let defaultNativeStyle: any
  let tamaguiDefaultProps: any
  let defaultTag: string | undefined

  // see onConfiguredOnce below which attaches a name then to this component
  const component = forwardRef<Ref, ComponentPropTypes>((propsIn: any, forwardedRef) => {
    // test only
    if (process.env.NODE_ENV === 'test') {
      if (propsIn['data-test-renders']) {
        propsIn['data-test-renders']['current'] ??= 0
        propsIn['data-test-renders']['current'] += 1
      }
    }
    // const time = t.start({ quiet: true })

    // React inserts default props after your props for some reason...
    // order important so we do loops, you can't just spread because JS does weird things
    let props: any
    if (tamaguiDefaultProps && !propsIn.asChild) {
      props = mergeProps(tamaguiDefaultProps, propsIn)[0]
    } else {
      props = propsIn
    }

    const debugProp = props['debug'] as DebugProp
    const { Component, isText, isZStack } = staticConfig
    const componentName = props.componentName || staticConfig.componentName
    const componentClassName = props.asChild
      ? ''
      : props.componentName
      ? `is_${props.componentName}`
      : defaultComponentClassName

    /**
     * Component state for tracking animations, pseudos
     */
    const animationsConfig = tamaguiConfig.animations
    const useAnimations = animationsConfig?.useAnimations as UseAnimationHook | undefined
    const avoidClassesWhileAnimating = animationsConfig.isReactNative
    const hasEnterStyle = !!props.enterStyle
    const needsMount = Boolean((isWeb ? isClient : true) && (hasEnterStyle || props.animation))
    const states = useServerState<TamaguiComponentState>(
      needsMount ? defaultComponentState! : defaultComponentStateMounted!
    )

    const state = propsIn.forceStyle ? { ...states[0], [propsIn.forceStyle]: true } : states[0]
    const setState = states[1]
    const setStateShallow = useShallowSetState(setState, debugProp, componentName)

    // conditional but if ever true stays true
    // [animated, inversed]
    const stateRef = useRef(
      undefined as any as {
        hasAnimated?: boolean
        hasThemeInversed?: boolean
        hasProvidedThemeManager?: boolean
        themeShouldReset?: boolean
      }
    )
    stateRef.current ??= {}

    const isAnimated = (() => {
      const next = !!(useAnimations && props.animation)
      if (next && !stateRef.current.hasAnimated) {
        stateRef.current.hasAnimated = true
      }
      return next || stateRef.current.hasAnimated
    })()

    const usePresence = tamaguiConfig.animations?.usePresence
    const presence = !isRSC && isAnimated ? usePresence() : null

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

    const isReactNative = Boolean(
      staticConfig.isReactNative || (isAnimated && tamaguiConfig.animations.isReactNative)
    )

    if (process.env.NODE_ENV === 'development') {
      if (debugProp) {
        const name = `${
          componentName || Component?.displayName || Component?.name || '[Unnamed Component]'
        }`
        const type = isReactNative ? '(rnw)' : ''
        const dataIs = propsIn['data-is'] || ''
        const banner = `${name}${dataIs ? ` ${dataIs}` : ''} ${type}`
        // eslint-disable-next-line no-console
        console.group(`%c ${banner}`, 'background: yellow;')
        if (!isServer) {
          // eslint-disable-next-line no-console
          console.log(`state`, state)
        }
      }
    }

    const shouldAvoidClasses =
      !isWeb || !!(props.animation && avoidClassesWhileAnimating) || !staticConfig.acceptsClassName
    const shouldForcePseudo = !!propsIn.forceStyle
    const noClassNames = shouldAvoidClasses || shouldForcePseudo

    const theme = useTheme({
      name: props.theme,
      componentName,
      reset: props.reset,
      inverse: props.themeInverse,
      // @ts-expect-error internal use only
      disable: props['data-themeable'],
      debug: props.debug,
    })
    const themeManager = getThemeManager(theme)
    const themeIsNew = getThemeIsNewTheme(theme)

    const hasTextAncestor = !!(isWeb && isText ? useContext(TextAncestorContext) : false)
    const languageContext = isRSC ? null : useContext(FontLanguageContext)
    const isDisabled = props.disabled ?? props.accessibilityState?.disabled

    const isTaggable = !Component || typeof Component === 'string'
    // default to tag, fallback to component (when both strings)
    const element = isWeb
      ? isTaggable
        ? props.tag || defaultTag || Component
        : Component
      : Component

    const BaseTextComponent = BaseText || element || 'span'
    const BaseViewComponent = BaseView || element || (hasTextAncestor ? 'span' : 'div')
    let elementType = isText
      ? (isAnimated ? AnimatedText : null) || BaseTextComponent
      : (isAnimated ? AnimatedView : null) || BaseViewComponent

    elementType = Component || elementType
    const isStringElement = typeof elementType === 'string'

    const isExiting = presence?.[0] === false

    const mediaState = useMedia(
      // @ts-ignore, we just pass a stable object so we can get it later with
      // should match to the one used in `setMediaShouldUpdate` below
      stateRef
    )

    setDidGetVariableValue(false)

    const splitStyles = useSplitStyles(
      props,
      staticConfig,
      theme,
      {
        ...state,
        mediaState,
        noClassNames,
        dynamicStylesInline: noClassNames,
        hasTextAncestor,
        resolveVariablesAs: 'value',
        isExiting,
      },
      null,
      languageContext || undefined,
      elementType,
      debugProp
    )

    // only listen for changes if we are using raw theme values or media space, or dynamic media (native)
    const shouldListenForMediaChanges =
      didGetVariableValue() ||
      splitStyles.hasMedia === 'space' ||
      (noClassNames === true && splitStyles.hasMedia)

    if (shouldListenForMediaChanges) {
      setMediaShouldUpdate(stateRef, shouldListenForMediaChanges)
    }

    const hostRef = useServerRef<TamaguiElement>(null)

    // animation setup
    const isAnimatedReactNativeWeb = isAnimated && avoidClassesWhileAnimating

    if (process.env.NODE_ENV === 'development') {
      if (!process.env.TAMAGUI_TARGET) {
        // eslint-disable-next-line no-console
        console.error(`No process.env.TAMAGUI_TARGET set, please set it to "native" or "web".`)
      }

      if (debugProp) {
        // eslint-disable-next-line no-console
        console.groupCollapsed('props')
        // eslint-disable-next-line no-console
        console.log('props in', propsIn, 'mapped to', props, 'in order', Object.keys(props))
        // eslint-disable-next-line no-console
        console.log('splitStyles', splitStyles)
        // eslint-disable-next-line no-console
        console.log('shouldListenForMediaChanges', shouldListenForMediaChanges)
        // eslint-disable-next-line no-console
        console.log('className', Object.values(splitStyles.classNames))
        if (isClient) {
          // eslint-disable-next-line no-console
          console.log('ref', hostRef, '(click to view)')
        }
        // eslint-disable-next-line no-console
        console.groupEnd()
        if (debugProp === 'break') {
          // eslint-disable-next-line no-debugger
          debugger
        }
      }
    }

    const {
      viewProps: viewPropsIn,
      pseudos,
      medias,
      style: splitStylesStyle,
      classNames,
      space,
    } = splitStyles

    const propsWithAnimation = props as UseAnimationProps

    // once you set animation prop don't remove it, you can set to undefined/false
    // reason is animations are heavy - no way around it, and must be run inline here (🙅 loading as a sub-component)
    let animationStyles: any
    if (!isRSC && isAnimated && useAnimations) {
      const animations = useAnimations({
        props: propsWithAnimation,
        style: splitStylesStyle,
        presence,
        state,
        pseudos,
        onDidAnimate: props.onDidAnimate,
        hostRef,
        staticConfig,
      })
      if (animations) {
        animationStyles = animations.style
      }
    }

    const {
      hitSlop,
      asChild,
      children,
      onPress,
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
      hrefAttrs,
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

    const disabled =
      (props.accessibilityState != null && props.accessibilityState.disabled === true) ||
      props.accessibilityDisabled

    // these can ultimately be for DOM, react-native-web views, or animated views
    // so the type is pretty loose
    let viewProps: Record<string, any>

    // if react-native-web view just pass all props down
    if (process.env.TAMAGUI_TARGET === 'web' && !isReactNative) {
      // otherwise replicate react-native-web functionality
      const {
        // event props
        onMoveShouldSetResponder,
        onMoveShouldSetResponderCapture,
        onResponderEnd,
        onResponderGrant,
        onResponderMove,
        onResponderReject,
        onResponderRelease,
        onResponderStart,
        onResponderTerminate,
        onResponderTerminationRequest,
        onScrollShouldSetResponder,
        onScrollShouldSetResponderCapture,
        onSelectionChangeShouldSetResponder,
        onSelectionChangeShouldSetResponderCapture,
        onStartShouldSetResponder,
        onStartShouldSetResponderCapture,

        // android
        collapsable,
        focusable,

        // deprecated,
        accessible,
        accessibilityDisabled,

        onLayout,

        ...webProps
      } = nonTamaguiProps

      viewProps = webProps

      if (!isRSC) {
        usePlatformMethods(hostRef as RefObject<Element>)

        useElementLayout(hostRef as RefObject<Element>, onLayout as any)

        useResponderEvents(hostRef, {
          onMoveShouldSetResponder,
          onMoveShouldSetResponderCapture,
          onResponderEnd,
          onResponderGrant,
          onResponderMove,
          onResponderReject,
          onResponderRelease,
          onResponderStart,
          onResponderTerminate,
          onResponderTerminationRequest,
          onScrollShouldSetResponder,
          onScrollShouldSetResponderCapture,
          onSelectionChangeShouldSetResponder,
          onSelectionChangeShouldSetResponderCapture,
          onStartShouldSetResponder,
          onStartShouldSetResponderCapture,
        } as any)
      }

      if (props.href != undefined && hrefAttrs != undefined) {
        const { download, rel, target } = hrefAttrs
        if (download != null) {
          viewProps.download = download
        }
        if (rel != null) {
          viewProps.rel = rel
        }
        if (typeof target === 'string') {
          viewProps.target = target.charAt(0) !== '_' ? '_' + target : target
        }
      }

      // FOCUS
      // "focusable" indicates that an element may be a keyboard tab-stop.
      const _focusable = focusable != undefined ? focusable : accessible
      const role = viewProps.role
      if (_focusable === false) {
        viewProps.tabIndex = '-1'
      }
      if (
        // These native elements are focusable by default
        elementType === 'a' ||
        elementType === 'button' ||
        elementType === 'input' ||
        elementType === 'select' ||
        elementType === 'textarea'
      ) {
        if (_focusable === false || accessibilityDisabled === true) {
          viewProps.tabIndex = '-1'
        }
      } else if (
        // These roles are made focusable by default
        role === 'button' ||
        role === 'checkbox' ||
        role === 'link' ||
        role === 'radio' ||
        role === 'textbox' ||
        role === 'switch'
      ) {
        if (_focusable !== false) {
          viewProps.tabIndex = '0'
        }
      }
      // Everything else must explicitly set the prop
      if (_focusable === true) {
        viewProps.tabIndex = '0'
      }
    } else {
      viewProps = nonTamaguiProps
    }

    viewProps.ref = useComposedRefs(hostRef as any, forwardedRef)

    if (process.env.NODE_ENV === 'development' && !isText && isWeb) {
      Children.toArray(props.children).forEach((item) => {
        if (typeof item === 'string') {
          // eslint-disable-next-line no-console
          console.error(`Unexpected text node: ${item}. A text node cannot be a child of a <View>.`)
        }
      })
    }

    const unPress = useCallback(() => {
      setStateShallow({
        press: false,
        pressIn: false,
      })
    }, [setStateShallow])

    if (isWeb) {
      useEffect(() => {
        return () => {
          mouseUps.delete(unPress)
        }
      }, [])
    }

    const shouldSetMounted = needsMount && state.unmounted
    useEffect(() => {
      if (!shouldSetMounted) return
      setStateShallow({
        unmounted: false,
      })
    }, [shouldSetMounted])

    let styles: Record<string, any>[]

    if (isStringElement && shouldAvoidClasses && !shouldForcePseudo) {
      styles = {
        ...defaultNativeStyle,
        ...(animationStyles ?? splitStylesStyle),
        ...medias,
      }
    } else {
      styles = [isWeb ? null : defaultNativeStyle, animationStyles ?? splitStylesStyle, medias]

      // ugly but for now...
      if (shouldForcePseudo) {
        const next = {}
        styles.forEach((style) => Object.assign(next, style))
        // @ts-ignore
        Object.assign(splitStyles.style, next)
      }
    }

    let fontFamily = isText ? splitStyles.fontFamily || staticConfig.defaultProps.fontFamily : null
    if (fontFamily && fontFamily[0] === '$') {
      fontFamily = fontFamily.slice(1)
    }
    const fontFamilyClassName = fontFamily ? `font_${fontFamily}` : ''

    const classList = [
      componentName ? componentClassName : '',
      fontFamilyClassName,
      themeIsNew ? theme.className : '',
      classNames ? Object.values(classNames).join(' ') : '',
    ]
    const className = classList.join(' ')

    if (process.env.TAMAGUI_TARGET === 'web') {
      const style = animationStyles ?? splitStyles.style

      if (isAnimatedReactNativeWeb) {
        viewProps.style = style
      } else if (isReactNative) {
        const rnwStyle = { $$css: true }
        for (const name of className.split(' ')) {
          rnwStyle[name] = name
        }
        viewProps.style = [rnwStyle, ...(Array.isArray(style) ? style : [style])]
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
                delete style.fontWeight
                delete style.fontStyle
              }
            }
          }
        }
      }

      // assign styles
      viewProps.style = styles
    }

    const runtimePressStyle = !disabled && noClassNames && pseudos?.pressStyle
    const attachPress = !!(runtimePressStyle || onPress || onPressOut || onPressIn || onClick)
    const runtimeHoverStyle = !disabled && noClassNames && pseudos?.hoverStyle
    const isHoverable =
      isWeb && !!(runtimeHoverStyle || onHoverIn || onHoverOut || onMouseEnter || onMouseLeave)

    const handlesPressEvents = !isWeb && !asChild

    // check presence rather than value to prevent reparenting bugs
    // allows for onPress={x ? function : undefined} without re-ordering dom
    const shouldAttach = asChild
      ? false
      : Boolean(
          attachPress ||
            isHoverable ||
            'pressStyle' in props ||
            'onPress' in props ||
            'onPressIn' in props ||
            'onPressOut' in props ||
            (isWeb &&
              ('hoverStyle' in props ||
                'onHoverIn' in props ||
                'onHoverOut' in props ||
                'onMouseEnter' in props ||
                'onMouseLeave' in props))
        )

    const events =
      shouldAttach && !isRSC && !isDisabled
        ? {
            onPressOut: attachPress
              ? (e) => {
                  unPress()
                  onPressOut?.(e)
                  onMouseUp?.(e)
                }
              : undefined,
            ...(isHoverable && {
              onMouseEnter: isHoverable
                ? (e) => {
                    const next: Partial<typeof state> = {}
                    if (isHoverable) {
                      next.hover = true
                    }
                    if (state.pressIn) {
                      next.press = true
                    }
                    if (isHoverable || state.pressIn) {
                      setStateShallow(next)
                    }
                    onHoverIn?.(e)
                    onMouseEnter?.(e)
                  }
                : undefined,
              onMouseLeave: isHoverable
                ? (e) => {
                    const next: Partial<typeof state> = {}
                    mouseUps.add(unPress)
                    if (isHoverable) {
                      next.hover = false
                    }
                    if (state.pressIn) {
                      next.press = false
                      next.pressIn = false
                    }
                    if (Object.keys(next).length) {
                      setStateShallow(next)
                    }
                    onHoverOut?.(e)
                    onMouseLeave?.(e)
                  }
                : undefined,
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
                  onClick?.(e)
                  onPress?.(e)
                }
              : undefined,

            // replicating TouchableWithoutFeedback
            ...(!isWeb && {
              cancelable: !props.rejectResponderTermination,
              disabled: isDisabled,
              hitSlop: props.hitSlop,
              delayLongPress: props.delayLongPress,
              delayPressIn: props.delayPressIn,
              delayPressOut: props.delayPressOut,
              focusable: viewProps.focusable ?? true,
              minPressDuration: 0,
            }),
          }
        : null

    const themeShouldReset = Boolean(themeShallow && themeManager && themeIsNew)
    const shouldProvideThemeManager = themeShouldReset || (themeManager && themeIsNew)

    // memoize to avoid re-parenting
    if (shouldProvideThemeManager) {
      stateRef.current.hasProvidedThemeManager = true
    }
    if (themeShouldReset) {
      stateRef.current.themeShouldReset = true
    }

    const childEls =
      !children || asChild
        ? children
        : wrapThemeManagerContext(
            spacedChildren({
              separator,
              children,
              space,
              direction: props.spaceDirection || 'both',
              isZStack,
            }),
            // only set context if changed theme
            stateRef.current.hasProvidedThemeManager ? themeManager : undefined,
            stateRef.current.themeShouldReset
          )

    let content: any

    if (asChild) {
      elementType = Slot
      viewProps = {
        ...viewProps,
        onPress,
        onPressIn,
        onPressOut,
      }
    }

    // EVENTS native
    if (process.env.TAMAGUI_TARGET === 'native') {
      // add focus events
      const attachFocus = !!pseudos.focusStyle
      if (attachFocus) {
        viewProps.onFocus = mergeEvent(viewProps.onFocus, () => {
          setStateShallow({ focus: true })
        })
        viewProps.onBlur = mergeEvent(viewProps.onBlur, () => {
          setStateShallow({ focus: false })
        })
      }

      // use Pressability to get smooth unPress when you press + hold + move out
      // only ever create once, use .configure() to update later
      const pressability = usePressability(events ? { ...events, hitSlop } : {})
      if (attachPress && events) {
        for (const key in pressability) {
          const og = props[key]
          const val = pressability[key]
          viewProps[key] =
            og && !dontComposePressabilityKeys[key] ? composeEventHandlers(og, val) : val
        }
      }
    }

    content = createElement(elementType, viewProps, childEls)

    if (process.env.TAMAGUI_TARGET === 'web') {
      if (events || isAnimatedReactNativeWeb) {
        content = (
          <span
            className={(isAnimatedReactNativeWeb ? className : '') + `  _dsp_contents`}
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

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG !== 'tamagui') {
      if (debugProp) {
        const element = typeof elementType === 'string' ? elementType : 'Component'
        // eslint-disable-next-line no-console
        console.groupCollapsed(`render <${element} /> with props`, viewProps)
        for (const key in viewProps) {
          // eslint-disable-next-line no-console
          console.log(key, viewProps[key])
        }
        // eslint-disable-next-line no-console
        console.log('children', content)
        // eslint-disable-next-line no-console
        console.groupEnd()
        if (typeof window !== 'undefined') {
          // prettier-ignore
          // eslint-disable-next-line no-console
          console.log({ state, shouldProvideThemeManager, isAnimated, isAnimatedReactNativeWeb, tamaguiDefaultProps, viewProps, splitStyles, animationStyles, handlesPressEvents, isStringElement, classNamesIn: props.className?.split(' '), classNamesOut: viewProps.className?.split(' '), events, shouldAttach, styles, pseudos, content, childEls, shouldAvoidClasses, avoidClasses: avoidClassesWhileAnimating, animation: props.animation, style: splitStylesStyle, defaultNativeStyle, ...(typeof window !== 'undefined' ? { theme, themeClassName:  theme.className, staticConfig, tamaguiConfig, events, shouldAvoidClasses, shouldForcePseudo, classNames: Object.fromEntries(Object.entries(classNames).map(([k, v]) => [v, getAllSelectors()[v]])) } : null) })
        }
        // eslint-disable-next-line no-console
        console.groupEnd()
      }
    }

    return content
  })

  if (staticConfig.componentName) {
    component.displayName = staticConfig.componentName
  }

  onConfiguredOnce((conf) => {
    // one time only setup
    if (!tamaguiConfig) {
      tamaguiConfig = conf

      if (!defaultComponentState) {
        defaultComponentState = {
          hover: false,
          press: false,
          pressIn: false,
          focus: false,
          unmounted: true,
        }
        defaultComponentStateMounted = {
          ...defaultComponentState,
          unmounted: false,
        }
      }

      if (tamaguiConfig.animations) {
        AnimatedText = tamaguiConfig.animations.Text
        AnimatedView = tamaguiConfig.animations.View
      }

      if (!initialTheme) {
        const next = conf.themes[Object.keys(conf.themes)[0]]
        initialTheme = proxyThemeVariables(next)
        if (process.env.NODE_ENV === 'development') {
          if (!initialTheme) {
            // eslint-disable-next-line no-console
            console.log(`Warning: Missing theme`)
          }
        }
      }
    }

    // per-component setup
    // do this to make sure shorthands don't duplicate with.. longhands
    mergeShorthands(staticConfig, tamaguiConfig)

    let defaultPropsIn = staticConfig.defaultProps || {}

    // because we run createTamagui after styled() defs, have to do some work here
    // gather defaults props one time and merge downwards
    // find last unprocessed and process
    const parentNames = [...(staticConfig.parentNames || []), staticConfig.componentName]

    if (tamaguiConfig.defaultProps && parentNames && staticConfig.componentName) {
      defaultPropsIn = mergeConfigDefaultProps(
        staticConfig.componentName,
        defaultPropsIn,
        tamaguiConfig.defaultProps,
        parentNames,
        tamaguiConfig
      )
    }

    const debug = defaultPropsIn['debug']

    // remove all classNames
    const [ourProps, ourClassNames] = mergeProps(defaultPropsIn, {})

    if (ourProps.tag) {
      defaultTag = ourProps.tag
    }

    const noClassNames = !staticConfig.acceptsClassName
    const { name, variants, defaultVariants, ...restProps } = ourProps

    // must preserve prop order
    // leave out className because we handle that already with initialSplitStyles.classNames
    // otherwise it confuses variant functions getting className props
    const [defaults, defaultsClassnames] = mergeProps(component.defaultProps as any, {
      ...defaultVariants,
      ...restProps,
    })

    defaultNativeStyle = {}

    const validStyles = staticConfig.validStyles || stylePropsView

    // split - keep variables on props to be processed using theme values at runtime (native)
    if (!isWeb) {
      for (const key in staticConfig.defaultProps) {
        const val = staticConfig.defaultProps[key]
        if (validPseudoKeys[key]) continue
        if ((typeof val === 'string' && val[0] === '$') || !validStyles[key]) {
          defaults[key] = val
        } else {
          defaultNativeStyle[key] = val
        }
      }
    }

    // set to global
    tamaguiDefaultProps = defaults

    // add debug logs
    if (process.env.NODE_ENV === 'development' && debug) {
      if (process.env.IS_STATIC !== 'is_static') {
        // prettier-ignore
        // eslint-disable-next-line no-console
        console.log(`🐛 [${staticConfig.componentName || 'Component'}]`, { staticConfig, tamaguiDefaultProps, defaultNativeStyle, defaults, defaultPropsIn, defaultPropsKeyOrder: Object.keys(staticConfig.defaultProps), defaultPropsInKeyOrder: Object.keys(defaultPropsIn).map((k) => [k, defaultPropsIn[k]]), ourProps, ourClassNames, defaultsClassnames, defaultTag, noClassNames, })
      }
    }
  })

  let res: TamaguiComponent<ComponentPropTypes, Ref, BaseProps> = component as any

  if (configIn.memo) {
    res = memo(res) as any
  }

  res.staticConfig = {
    validStyles: staticConfig.validStyles || stylePropsView,
    ...staticConfig,
  }

  // res.extractable HoC
  res.extractable = (Component: any, conf?: Partial<StaticConfig>) => {
    Component.staticConfig = extendStaticConfig(
      {
        Component,
        ...conf,
        neverFlatten: true,
        defaultProps: {
          ...Component.defaultProps,
          ...conf?.defaultProps,
        },
      },
      res
    )
    return Component
  }

  return res
}

// for elements to avoid spacing
export const Unspaced = (props: { children?: any }) => {
  return props.children
}
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
  },

  variants: {
    size: {
      '...size': (size, { tokens }) => {
        size = size == true ? '$true' : size
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
  space?: SpaceTokens | number | null
  spaceFlex?: boolean | number
  direction?: SpaceDirection
  separator?: React.ReactNode
}

export function spacedChildren({
  isZStack,
  children,
  space,
  direction,
  spaceFlex,
  separator,
}: SpacedChildrenProps) {
  const hasSpace = !!(space || spaceFlex)
  const hasSeparator = !(separator === undefined || separator === null)
  if (!hasSpace && !hasSeparator && !isZStack) {
    return children
  }
  const childrenList = Children.toArray(children)
  const len = childrenList.length
  if (len <= 1 && !isZStack) {
    if (len === 1) {
      // forward space! only when one component doesn't make sense to forward space to all children
      const [onlyChild] = childrenList
      if (React.isValidElement(onlyChild) && onlyChild.type?.['shouldForwardSpace']) {
        return React.cloneElement(onlyChild, { space, direction, spaceFlex, separator } as any)
      }
    }
    return childrenList
  }
  const final: React.ReactNode[] = []
  for (const [index, child] of childrenList.entries()) {
    const isEmpty =
      child === null || child === undefined || (Array.isArray(child) && child.length === 0)
    // push them all, but wrap some in Fragment
    if (isEmpty || !child || (child['key'] && !isZStack)) {
      final.push(child)
    } else {
      final.push(
        <Fragment key={index}>{isZStack ? <AbsoluteFill>{child}</AbsoluteFill> : child}</Fragment>
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

  return final
}

type CreateSpacerProps = SpacedChildrenProps & { key: string }

function createSpacer({ key, direction, space, spaceFlex }: CreateSpacerProps) {
  return (
    // @ts-ignore this one blew up but the types seem better
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
  // console.log('unspaced?', child, getMedia())
  return child?.['type']?.['isVisuallyHidden'] || child?.['type']?.['isUnspaced']
}

const DefaultProps = new Map()

function mergeConfigDefaultProps(
  name: string,
  props: Record<string, any>,
  configDefaults: Record<string, Object>,
  parentNames: (string | undefined)[],
  conf: TamaguiInternalConfig
) {
  const len = parentNames.length
  let prev

  for (let i = 0; i < len; i++) {
    const n = parentNames[i]
    if (!n) continue
    if (DefaultProps.has(n)) {
      prev = DefaultProps.get(n)
      continue
    }
    const props = configDefaults[n]
    if (!props) {
      if (prev) {
        DefaultProps.set(n, prev)
      }
      continue
    }
    prev = mergeProps(prev || {}, props, false, conf.inverseShorthands)[0]
    DefaultProps.set(n, prev)
  }

  // overwrite the user defined defaults on top of internal defined defaults
  const ourDefaultsMerged = DefaultProps.get(name)
  if (ourDefaultsMerged) {
    return mergeProps(props, ourDefaultsMerged, false, conf.inverseShorthands)[0]
  }
  return props
}

// react native compat (web only)
function usePlatformMethods(hostRef: RefObject<Element>) {
  useIsomorphicLayoutEffect(() => {
    const node = hostRef.current
    if (!node) return
    // @ts-ignore
    node.measure = (callback) => measureLayout(node, null, callback)
    // @ts-ignore
    node.measureLayout = (relativeToNode, success) => measureLayout(node, relativeToNode, success)
    // @ts-ignore
    node.measureInWindow = (callback) => {
      if (!node) return
      setTimeout(() => {
        const { height, left, top, width } = getRect(node as HTMLElement)!
        callback(left, top, width, height)
      }, 0)
    }
  }, [hostRef])
}

const AbsoluteFill: any = createComponent({
  componentName: 'AbsoluteFill',
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

const dontComposePressabilityKeys = {
  onClick: true,
}
