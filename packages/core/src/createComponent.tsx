/* eslint-disable react-hooks/rules-of-hooks */
import { composeEventHandlers, stylePropsView, validStyles } from '@tamagui/helpers'
import {
  useElementLayout,
  useMergeRefs,
  usePlatformMethods,
  useResponderEvents,
} from '@tamagui/rnw'
import { useForceUpdate } from '@tamagui/use-force-update'
import React, {
  Children,
  Fragment,
  createElement,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'

import { getConfig, onConfiguredOnce } from './conf'
import { stackDefaultStyles } from './constants/constants'
import { isWeb, useIsomorphicLayoutEffect } from './constants/platform'
import { assignNativePropsToWeb } from './helpers/assignNativePropsToWeb'
import { getReturnVariablesAs } from './helpers/createPropMapper'
import { createShallowUpdate } from './helpers/createShallowUpdate'
import { extendStaticConfig, parseStaticConfig } from './helpers/extendStaticConfig'
import { SplitStyleResult, insertSplitStyles, useSplitStyles } from './helpers/getSplitStyles'
import { getAllSelectors } from './helpers/insertStyleRule'
import { mergeProps } from './helpers/mergeProps'
import { proxyThemeVariables } from './helpers/proxyThemeVariables'
import { wrapThemeManagerContext } from './helpers/wrapThemeManagerContext'
import { useFeatures } from './hooks/useFeatures'
import { useIsTouchDevice } from './hooks/useIsTouchDevice'
import { mediaState } from './hooks/useMedia'
import { usePressable } from './hooks/usePressable'
import { getThemeManager, useTheme } from './hooks/useTheme'
import { Pressability } from './Pressability'
import {
  SpaceDirection,
  SpaceTokens,
  StackProps,
  StaticConfig,
  StaticConfigParsed,
  StylableComponent,
  TamaguiComponent,
  TamaguiComponentState,
  TamaguiConfig,
  TamaguiElement,
  TamaguiInternalConfig,
  UseAnimationHook,
} from './types'
import { Slot, mergeEvent } from './views/Slot'
import { TextAncestorContext } from './views/TextAncestorContext'

React['keep']

const defaultComponentState: TamaguiComponentState = Object.freeze({
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  // only used by enterStyle
  mounted: false,
  animation: null,
})

export const mouseUps = new Set<Function>()
if (typeof document !== 'undefined') {
  document.addEventListener('mouseup', () => {
    mouseUps.forEach((x) => x())
    mouseUps.clear()
  })
  document.addEventListener('touchend', () => {
    mouseUps.forEach((x) => x())
    mouseUps.clear()
  })
  document.addEventListener('touchcancel', () => {
    mouseUps.forEach((x) => x())
    mouseUps.clear()
  })
}

// mutates
function mergeShorthands({ defaultProps }: StaticConfigParsed, { shorthands }: TamaguiConfig) {
  // they are defined in correct order already { ...parent, ...child }
  for (const key in defaultProps) {
    defaultProps[shorthands[key] || key] = defaultProps[key]
  }
}

let initialTheme: any

export function createComponent<
  ComponentPropTypes extends Object = {},
  Ref = TamaguiElement,
  BaseProps = never
>(configIn: Partial<StaticConfig> | StaticConfigParsed, ParentComponent?: StylableComponent) {
  const staticConfig = (() => {
    const config = extendStaticConfig(configIn, ParentComponent)
    if ('parsed' in config) {
      return config
    } else {
      return parseStaticConfig(config)
    }
  })()

  const defaultComponentClassName = `is_${staticConfig.componentName}`
  let tamaguiConfig: TamaguiInternalConfig
  let AnimatedText: any
  let AnimatedView: any
  let avoidClasses = true
  let defaultNativeStyle: any
  let defaultNativeStyleSheet: StyleSheet.NamedStyles<{ base: {} }>
  let tamaguiDefaultProps: any
  let initialSplitStyles: SplitStyleResult

  // see onConfiguredOnce below which attaches a name then to this component
  const component = forwardRef<Ref, ComponentPropTypes>((propsIn: any, forwardedRef) => {
    // React inserts default props after your props for some reason...
    // order important so we do loops, you can't just spread because JS does weird things
    let props: any
    if (tamaguiDefaultProps && !propsIn.asChild) {
      props = mergeProps(tamaguiDefaultProps, propsIn)[0]
    } else {
      props = propsIn
    }

    const hostRef = useRef<HTMLElement | View>(null)
    const { Component, isText, isZStack } = staticConfig
    const componentName = props.componentName || staticConfig.componentName
    const componentClassName = props.asChild
      ? ''
      : props.componentName
      ? `is_${props.componentName}`
      : defaultComponentClassName

    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        const name = `${
          componentName || Component?.displayName || Component?.name || '[Unnamed Component]'
        }`
        const banner = `${name} ${propsIn['data-is'] || ''}`
        console.group(`%c 🐛 ${banner}`, 'background: yellow;')
        console.log('props', propsIn)
        console.log('ref', hostRef, '(click to view)')
        if (props['debug'] === 'break') {
          debugger
        }
      }
    }

    const forceUpdate = useForceUpdate()
    const theme = useTheme(props.theme, componentName, props, forceUpdate)
    const [state, setState] = useState<TamaguiComponentState>(defaultComponentState)
    const setStateShallow = createShallowUpdate(setState)

    // allow forcing a pseudo state on
    if (propsIn.forceStyle) {
      state[propsIn.forceStyle] = true
    }

    const shouldAvoidClasses = !!(props.animation && avoidClasses)
    const shouldForcePseudo = !!propsIn.forceStyle
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const hasTextAncestor = !!(isWeb && isText ? useContext(TextAncestorContext) : false)
    const splitStyleState =
      !shouldAvoidClasses && !shouldForcePseudo
        ? {
            ...state,
            hasTextAncestor,
            dynamicStylesInline: true,
          }
        : ({
            ...state,
            noClassNames: true,
            dynamicStylesInline: true,
            hasTextAncestor,
            resolveVariablesAs: 'value',
          } as const)
    const splitStyles = useSplitStyles(
      props,
      staticConfig,
      theme,
      splitStyleState,
      props.asChild ? null : initialSplitStyles.classNames,
      props['debug']
    )

    const { viewProps: viewPropsIn, pseudos, medias, style, classNames } = splitStyles
    const useAnimations = tamaguiConfig.animations?.useAnimations as UseAnimationHook | undefined
    const isAnimated = !!(useAnimations && props.animation)
    const hasEnterStyle = !!props.enterStyle

    const animationFeatureStylesIn = props.animation ? { ...defaultNativeStyle, ...style } : null

    const features = useFeatures(props, {
      forceUpdate,
      setStateShallow,
      useAnimations,
      state,
      style: animationFeatureStylesIn,
      pseudos,
      staticConfig,
      theme,
      hostRef,
      onDidAnimate: props.onDidAnimate,
    })

    const {
      tag,
      hitSlop,
      asChild,
      children,
      onPress,
      onPressIn,
      onPressOut,
      onHoverIn,
      onHoverOut,
      themeShallow,
      space: spaceProp,
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

    // get the right component
    const isTaggable = !Component || typeof Component === 'string'

    // default to tag, fallback to component (when both strings)
    const element = isWeb ? (isTaggable ? tag || Component : Component) : Component
    const BaseTextComponent = !isWeb ? Text : element || 'span'
    const BaseViewComponent = !isWeb ? View : element || (hasTextAncestor ? 'span' : 'div')
    let elementType = isText
      ? (isAnimated ? AnimatedText || Text : null) || BaseTextComponent
      : (isAnimated ? AnimatedView || View : null) || BaseViewComponent

    elementType = Component || elementType
    const isStringElement = typeof elementType === 'string'

    const disabled =
      (props.accessibilityState != null && props.accessibilityState.disabled === true) ||
      props.accessibilityDisabled

    // these can ultimately be for DOM, react-native-web views, or animated views
    // so the type is pretty loose
    let viewProps: Record<string, any>

    // if react-native-web view just pass all props down
    if (process.env.TAMAGUI_TARGET === 'web' && !staticConfig.isReactNativeWeb) {
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

        // react-native props
        nativeID,

        // react-native-web accessibility props
        // @ts-ignore
        accessibilityActiveDescendant,
        // @ts-ignore
        accessibilityAtomic,
        // @ts-ignore
        accessibilityAutoComplete,
        // @ts-ignore
        accessibilityBusy,
        // @ts-ignore
        accessibilityChecked,
        // @ts-ignore
        accessibilityColumnCount,
        // @ts-ignore
        accessibilityColumnIndex,
        // @ts-ignore
        accessibilityColumnSpan,
        // @ts-ignore
        accessibilityControls,
        // @ts-ignore
        accessibilityCurrent,
        // @ts-ignore
        accessibilityDescribedBy,
        // @ts-ignore
        accessibilityDetails,
        // @ts-ignore
        accessibilityDisabled,
        // @ts-ignore
        accessibilityErrorMessage,
        // @ts-ignore
        accessibilityExpanded,
        // @ts-ignore
        accessibilityFlowTo,
        // @ts-ignore
        accessibilityHasPopup,
        // @ts-ignore
        accessibilityHidden,
        // @ts-ignore
        accessibilityInvalid,
        // @ts-ignore
        accessibilityKeyShortcuts,
        // @ts-ignore
        accessibilityLabel,
        // @ts-ignore
        accessibilityLabelledBy,
        // @ts-ignore
        accessibilityLevel,
        // @ts-ignore
        accessibilityLiveRegion,
        // @ts-ignore
        accessibilityModal,
        // @ts-ignore
        accessibilityMultiline,
        // @ts-ignore
        accessibilityMultiSelectable,
        // @ts-ignore
        accessibilityOrientation,
        // @ts-ignore
        accessibilityOwns,
        // @ts-ignore
        accessibilityPlaceholder,
        // @ts-ignore
        accessibilityPosInSet,
        // @ts-ignore
        accessibilityPressed,
        // @ts-ignore
        accessibilityReadOnly,
        // @ts-ignore
        accessibilityRequired,
        // @ts-ignore
        accessibilityRole,
        // @ts-ignore
        accessibilityRoleDescription,
        // @ts-ignore
        accessibilityRowCount,
        // @ts-ignore
        accessibilityRowIndex,
        // @ts-ignore
        accessibilityRowSpan,
        // @ts-ignore
        accessibilitySelected,
        // @ts-ignore
        accessibilitySetSize,
        // @ts-ignore
        accessibilitySort,
        // @ts-ignore
        accessibilityValueMax,
        // @ts-ignore
        accessibilityValueMin,
        // @ts-ignore
        accessibilityValueNow,
        // @ts-ignore
        accessibilityValueText,

        // deprecated
        accessible,
        accessibilityState,
        accessibilityValue,

        // android
        collapsable,
        focusable,

        onLayout,

        ...webProps
      } = nonTamaguiProps

      viewProps = webProps

      assignNativePropsToWeb(elementType, viewProps, nonTamaguiProps)

      useElementLayout(hostRef, onLayout)

      // from react-native-web
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
      })

      // from react-native-web
      const platformMethodsRef = usePlatformMethods(viewProps)

      const setRef = useMergeRefs(hostRef, platformMethodsRef, forwardedRef as any)
      viewProps.ref = setRef

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
      if (forwardedRef) {
        // @ts-ignore
        viewProps.ref = forwardedRef
      }
    }

    if (process.env.NODE_ENV === 'development' && !isText && isWeb) {
      Children.toArray(props.children).forEach((item) => {
        if (typeof item === 'string') {
          console.error(`Unexpected text node: ${item}. A text node cannot be a child of a <View>.`)
        }
      })
    }

    // isMounted
    const internal = useRef<{ isMounted: boolean; unmountEffects?: Function[] }>()
    if (!internal.current) {
      internal.current = {
        isMounted: true,
      }
    }

    useIsomorphicLayoutEffect(() => {
      // we need to use state to properly have mounted go from false => true
      if (typeof window !== 'undefined' && (hasEnterStyle || props.animation)) {
        // for SSR we never set mounted, ensuring enterStyle={{}} is set by default
        setStateShallow({
          mounted: true,
        })
      }

      internal.current!.isMounted = true
      return () => {
        mouseUps.delete(unPress)
        internal.current!.isMounted = false
        internal.current!.unmountEffects?.forEach((cb) => cb())
      }
    }, [hasEnterStyle, props.animation])

    let styles: any[]

    const animationStyles = state.animation ? state.animation.style : null

    if (isStringElement && shouldAvoidClasses && !shouldForcePseudo) {
      styles = {
        ...defaultNativeStyle,
        ...(animationStyles ?? style),
        ...medias,
      }
    } else {
      styles = [
        isWeb ? null : defaultNativeStyleSheet ? (defaultNativeStyleSheet.base as ViewStyle) : null,
        animationStyles ?? style,
        medias,
      ]
      if (!animationStyles) {
        const initPseudos = initialSplitStyles.pseudos
        const force = shouldForcePseudo
        !state.mounted && addPseudoToStyles(styles, initPseudos, pseudos, 'enterStyle')
        state.hover && addPseudoToStyles(styles, initPseudos, pseudos, 'hoverStyle', force)
        state.focus && addPseudoToStyles(styles, initPseudos, pseudos, 'focusStyle', force)
        state.press && addPseudoToStyles(styles, initPseudos, pseudos, 'pressStyle', force)
      }
      // ugly but for now...
      if (shouldForcePseudo) {
        const next = {}
        for (const style of styles) {
          if (style) {
            Object.assign(next, style)
          }
        }
        // @ts-ignore
        Object.assign(splitStyles.style, next)
      }
    }

    if (process.env.TAMAGUI_TARGET === 'web') {
      const fontFamilyName = isText
        ? props.fontFamily || staticConfig.defaultProps.fontFamily
        : null
      const fontFamily =
        fontFamilyName && fontFamilyName[0] === '$' ? fontFamilyName.slice(1) : null
      const classList = [
        componentName ? componentClassName : '',
        fontFamily ? `font_${fontFamily}` : '',
        theme.className,
        classNames ? Object.values(classNames).join(' ') : '',
      ]

      const className = classList.join(' ')
      const style = animationStyles ?? splitStyles.style

      // TODO this is specific to reanimated rn
      const isAnimatedReactNativeWeb = props.animation && avoidClasses

      if (staticConfig.isReactNativeWeb || isAnimatedReactNativeWeb) {
        viewProps.dataSet = {
          ...viewProps.dataSet,
          className,
          id: props.id,
        }
        if (props['data-is']) {
          viewProps.dataSet.is = props['data-is']
        }
      } else {
        viewProps.className = className
      }

      viewProps.style = style
    } else {
      viewProps.style = styles
    }

    // TODO need to loop active variants and see if they have matchin pseudos and apply as well
    const initialPseudos = initialSplitStyles.pseudos
    const attachPress = !!(
      pseudos?.pressStyle ||
      initialPseudos?.pressStyle ||
      onPress ||
      onPressOut ||
      onPressIn ||
      onClick
    )

    const isTouch = useIsTouchDevice()
    const isHoverable = isWeb && !isTouch
    const attachHover =
      isHoverable &&
      !!((pseudos && pseudos.hoverStyle) || onHoverIn || onHoverOut || onMouseEnter || onMouseLeave)

    const handlesPressEvents = !isStringElement && !asChild
    const pressKey = handlesPressEvents ? 'onPress' : 'onClick'
    const pressInKey = handlesPressEvents ? 'onPressIn' : 'onMouseDown'
    const pressOutKey = handlesPressEvents ? 'onPressOut' : 'onMouseUp'

    // check presence to prevent reparenting bugs, allows for onPress={x ? function : undefined} usage
    // while avoiding reparenting...
    // once proper reparenting is supported, we can remove this and use that...
    const shouldAttach =
      !asChild &&
      (attachPress ||
        attachHover ||
        'pressStyle' in props ||
        'onPress' in props ||
        'onPressIn' in props ||
        'onPressOut' in props ||
        (isWeb &&
          ('hoverStyle' in props ||
            'onHoverIn' in props ||
            'onHoverOut' in props ||
            'onMouseEnter' in props ||
            'onMouseLeave' in props)))

    const unPress = useCallback(() => {
      if (!internal.current!.isMounted) return
      setStateShallow({
        press: false,
        pressIn: false,
      })
    }, [])

    const events = shouldAttach
      ? {
          [pressOutKey]: attachPress
            ? (e) => {
                unPress()
                onPressOut?.(e)
                onMouseUp?.(e)
              }
            : undefined,
          ...(isHoverable && {
            onMouseEnter: attachHover
              ? (e) => {
                  const next: Partial<typeof state> = {}
                  if (attachHover) {
                    next.hover = true
                  }
                  if (state.pressIn) {
                    next.press = true
                  }
                  if (Object.keys(next).length) {
                    setStateShallow(next)
                  }
                  onHoverIn?.(e)
                  onMouseEnter?.(e)
                }
              : undefined,
            onMouseLeave: attachHover
              ? (e) => {
                  const next: Partial<typeof state> = {}
                  mouseUps.add(unPress)
                  if (attachHover) {
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
          [pressInKey]: attachPress
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
            : null,
          [pressKey]: attachPress
            ? (e) => {
                unPress()
                onClick?.(e)
                onPress?.(e)
              }
            : null,

          // replicating TouchableWithoutFeedback
          ...(!isWeb && {
            cancelable: !props.rejectResponderTermination,
            disabled: props.disabled !== null ? props.disabled : props.accessibilityState?.disabled,
            hitSlop: props.hitSlop,
            delayLongPress: props.delayLongPress,
            delayPressIn: props.delayPressIn,
            delayPressOut: props.delayPressOut,
            focusable: viewProps.focusable ?? true,
            minPressDuration: 0,
          }),
        }
      : null

    let space = spaceProp
    // find space by media query
    if (features.enabled.mediaQuery) {
      for (const key in mediaState) {
        if (!mediaState[key]) continue
        if (props[key] && props[key].space !== undefined) {
          space = props[key].space
        }
      }
    }

    const themeManager = getThemeManager(theme)

    const shouldSetChildrenThemeToParent = Boolean(
      themeShallow && themeManager && themeManager.didChangeTheme
    )

    const shouldProvideThemeManager =
      shouldSetChildrenThemeToParent || (themeManager && themeManager.didChangeTheme)

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
            shouldProvideThemeManager ? themeManager : undefined,
            shouldSetChildrenThemeToParent
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

    // EVENTS: web
    if (isWeb) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [pressableProps] = usePressable(
        events
          ? {
              disabled,
              ...(hitSlop && {
                hitSlop,
              }),
              onPressOut: events[pressOutKey],
              onPressIn: events[pressInKey],
              onPress: events[pressKey],
            }
          : {
              disabled: true,
            }
      )
      if (events) {
        if (handlesPressEvents) {
          Object.assign(viewProps, pressableProps)
        } else {
          Object.assign(viewProps, events)
        }
      }
    }

    // add focus events
    if (process.env.TAMAGUI_TARGET === 'native') {
      const attachFocus = !!(
        (pseudos && pseudos.focusStyle) ||
        (initialPseudos && initialPseudos.focusStyle)
      )
      if (attachFocus) {
        viewProps.onFocus = mergeEvent(viewProps.onFocus, () => {
          setStateShallow({ focus: true })
        })
        viewProps.onBlur = mergeEvent(viewProps.onBlur, () => {
          setStateShallow({ focus: false })
        })
      }
    }

    // EVENTS native
    // replicates TouchableWithoutFeedback
    if (process.env.TAMAGUI_TARGET === 'native') {
      // only ever create once, use .configure() to update later
      const pressability = useMemo(() => {
        if (attachPress && events) {
          const pressability = new Pressability(events)
          internal.current!.unmountEffects = [
            () => {
              pressability.reset()
            },
          ]
          return pressability
        }
      }, [])

      if (attachPress && events) {
        pressability.configure(events)
        const eventHandlers = pressability.getEventHandlers()
        for (const key in eventHandlers) {
          if (key === 'onBlur' || key === 'onFocus') {
            // avoids the default
            continue
          }
          const og = props[key]
          const val = eventHandlers[key]
          viewProps[key] = og ? composeEventHandlers(og, val) : val
        }
      }
    }

    content = createElement(elementType, viewProps, childEls)

    if (process.env.TAMAGUI_TARGET === 'web') {
      // only necessary when animating because some AnimatedView which wraps RNW View doesn't forward dataSet className
      const isAnimatedRNWView = isAnimated && typeof elementType !== 'string' // assuming for now as reanimated is only driver
      const shouldWrapWithComponentTheme =
        isAnimatedRNWView && getReturnVariablesAs(props, splitStyleState) === 'non-color-value'
      const shouldWrapWithHover = events && attachHover

      if (shouldWrapWithHover || shouldWrapWithComponentTheme) {
        const themeClassName = shouldWrapWithComponentTheme ? `${theme.className}` : ''
        const hoverClassName = shouldWrapWithHover ? 't_Hoverable' : ''
        content = (
          <span
            className={`${hoverClassName} ${themeClassName}`}
            style={{
              display: 'contents',
            }}
            {...(shouldWrapWithHover && {
              onMouseEnter: events.onMouseEnter,
              onMouseLeave: events.onMouseLeave,
            })}
          >
            {content}
          </span>
        )
      }
    }

    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        console.groupCollapsed('props out', viewProps)
        for (const key in viewProps) {
          console.log(key, viewProps[key])
        }
        console.groupEnd()
        if (typeof window !== 'undefined') {
          // prettier-ignore
          console.log({ state, shouldProvideThemeManager, tamaguiDefaultProps, viewProps, splitStyles, animationStyles, isStringElement, classNamesIn: props.className?.split(' '), classNamesOut: viewProps.className?.split(' '), events, shouldAttach, styles, pseudos, content, childEls, shouldAvoidClasses, avoidClasses, animation: props.animation, style, defaultNativeStyle, initialSplitStyles, ...(typeof window !== 'undefined' ? { theme, themeClassName:  theme.className, staticConfig, tamaguiConfig, events, shouldAvoidClasses, shouldForcePseudo, classNames: Object.fromEntries(Object.entries(classNames).map(([k, v]) => [v, getAllSelectors()[v]])) } : null) })
        }
        console.groupEnd()
      }
    }

    return features.elements.length ? (
      <>
        {features.elements}
        {content}
      </>
    ) : (
      content
    )
  })

  if (staticConfig.componentName) {
    component.displayName = staticConfig.componentName
  }

  // Once configuration is run and all components are registered
  // get default props + className and analyze styles
  onConfiguredOnce((conf) => {
    if (process.env.IS_STATIC === 'is_static') {
      // in static mode we just use these to lookup configuration
      return
    }

    tamaguiConfig = conf

    // do this to make sure shorthands don't duplicate with.. longhands
    mergeShorthands(staticConfig, tamaguiConfig)

    avoidClasses = !!tamaguiConfig.animations?.avoidClasses
    AnimatedText = tamaguiConfig.animations?.Text
    AnimatedView = tamaguiConfig?.animations?.View
    initialTheme =
      initialTheme ||
      proxyThemeVariables(conf.themes[conf.defaultTheme || Object.keys(conf.themes)[0]])

    // adds in user defined default props
    const config = getConfig()

    let defaultPropsIn = staticConfig.defaultProps || {}

    // because we run createTamagui after styled() defs, have to do some work here
    // gather defaults props one time and merge downwards
    // find last unprocessed and process
    const parentNames = [...(staticConfig.parentNames || []), staticConfig.componentName]

    if (config.defaultProps && parentNames && staticConfig.componentName) {
      defaultPropsIn = mergeConfigDefaultProps(
        staticConfig.componentName,
        defaultPropsIn,
        config.defaultProps,
        parentNames
      )
    }

    const debug = process.env.NODE_ENV === 'development' ? defaultPropsIn['debug'] : false

    if (process.env.NODE_ENV === 'development' && debug === 'break') {
      debugger
    }

    // remove all classNames
    const [parentProps, parentClassNames] = mergeProps(defaultPropsIn, {}, true)

    initialSplitStyles = insertSplitStyles(
      parentProps,
      staticConfig,
      initialTheme,
      {
        mounted: true,
        hover: false,
        press: false,
        pressIn: false,
        focus: false,
        resolveVariablesAs: 'both',
        keepVariantsAsProps: true,
      },
      undefined,
      debug
    )

    // must preserve prop order
    // leave out className because we handle that already with initialSplitStyles.classNames
    // otherwise it confuses variant functions getting className props
    const [defaults, defaultsClassnames] = mergeProps(
      component.defaultProps as any,
      initialSplitStyles.viewProps,
      true
    )

    // avoid passing className props to variants
    initialSplitStyles.classNames = {
      ...parentClassNames,
      ...defaultsClassnames,
      ...initialSplitStyles.classNames,
    }

    defaultNativeStyle = {}

    const validStyles = staticConfig.validStyles || stylePropsView

    // split - keep variables on props to be processed using theme values at runtime (native)
    if (!isWeb) {
      for (const key in staticConfig.defaultProps) {
        const val = staticConfig.defaultProps[key]
        if ((typeof val === 'string' && val[0] === '$') || !validStyles[key]) {
          defaults[key] = val
        } else {
          defaultNativeStyle[key] = val
        }
      }
    }

    defaultNativeStyleSheet = StyleSheet.create({
      base: defaultNativeStyle,
    })

    if (Object.keys(defaults).length) {
      tamaguiDefaultProps = defaults
    }

    // add debug logs
    if (process.env.NODE_ENV === 'development' && debug) {
      if (process.env.IS_STATIC !== 'is_static') {
        console.log(`🐛 [${staticConfig.componentName || 'Component'}]`, {
          staticConfig,
          initialSplitStyles,
          tamaguiDefaultProps,
          defaultNativeStyle,
          defaults,
          defaultPropsIn,
        })
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
        isExtractable: true,
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

export type SpacerProps = Omit<StackProps, 'flex' | 'direction' | 'size'> & {
  size?: number | SpaceTokens | null
  flex?: boolean | number
  direction?: SpaceDirection
}
export const Spacer = createComponent<SpacerProps>({
  memo: true,
  componentName: 'Spacer',
  validStyles,
  defaultProps: {
    ...stackDefaultStyles,
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
  },

  defaultVariants: {
    direction: 'both',
  },
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
  if (childrenList.length <= 1 && !isZStack) {
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
    if (isUnspaced(child) && index === 0) {
      continue
    }

    // no spacing on ZStack
    if (isZStack) {
      continue
    }

    const next = childrenList[index + 1]

    if (next && !isUnspaced(next)) {
      if (separator) {
        if (hasSpace) {
          final.push(
            createSpacer({
              key: `_${index}_before_sep_spacer`,
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
              key: `_${index}_after_sep_spacer`,
              direction,
              space,
              spaceFlex,
            })
          )
        }
      } else {
        final.push(
          createSpacer({
            key: `_${index}_spacer`,
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
    <Spacer
      key={key}
      size={space}
      direction={direction}
      {...(spaceFlex && {
        flex: spaceFlex,
      })}
    />
  )
}

function isUnspaced(child: React.ReactNode) {
  // console.log('unspaced?', child)
  return child?.['type']?.['isVisuallyHidden'] || child?.['type']?.['isUnspaced']
}

export function AbsoluteFill(props: { children?: React.ReactNode }) {
  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {props.children}
    </View>
  )
}

// this can be done with CSS entirely right?
// const shouldWrapTextAncestor = isWeb && isText && !hasTextAncestor
// if (shouldWrapTextAncestor) {
//   // from react-native-web
//   content = createElement(TextAncestorContext.Provider, { value: true }, content)
// }

export function processIDRefList(idRefList: string | Array<string>): string {
  return Array.isArray(idRefList) ? idRefList.join(' ') : idRefList
}

export const accessibilityRoleToWebRole = {
  adjustable: 'slider',
  button: 'button',
  header: 'heading',
  image: 'img',
  imagebutton: null,
  keyboardkey: null,
  label: null,
  link: 'link',
  none: 'presentation',
  search: 'search',
  summary: 'region',
  text: null,
}

function addPseudoToStyles(
  styles: any[],
  initialPseudos: SplitStyleResult['pseudos'],
  pseudos: any,
  name: string,
  force = false
) {
  // on web use pseudo object { hoverStyle } to keep specificity with concatClassName
  const pseudoStyle = pseudos[name]
  const shouldNestObject = isWeb && name !== 'enterStyle' && name !== 'exitStyle'
  const defaultPseudoStyle = initialPseudos[name]
  const style = defaultPseudoStyle ? { ...defaultPseudoStyle, ...pseudoStyle } : pseudoStyle
  if (style) {
    styles.push(shouldNestObject && !force ? { [name]: style } : style)
  }
}

const DefaultProps = new Map()

function mergeConfigDefaultProps(
  name: string,
  props: Record<string, any>,
  configDefaults: Record<string, Object>,
  parentNames: (string | undefined)[]
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
    prev = mergeProps(prev || {}, props)[0]
    console.log('set prev', prev)
    DefaultProps.set(n, prev)
  }

  // overwrite the user defined defaults on top of internal defined defaults
  const ourDefaultsMerged = DefaultProps.get(name)
  if (ourDefaultsMerged) {
    return mergeProps(props, ourDefaultsMerged)[0]
  }
  return props
}
