import { stylePropsView, validStyles } from '@tamagui/helpers'
import { useForceUpdate } from '@tamagui/use-force-update'
import React, {
  Children,
  Fragment,
  createElement,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'

import { onConfiguredOnce } from './conf'
import { stackDefaultStyles } from './constants/constants'
import { isWeb, useIsomorphicLayoutEffect } from './constants/platform'
import { rnw } from './constants/rnw'
import { createShallowUpdate } from './helpers/createShallowUpdate'
import { extendStaticConfig, parseStaticConfig } from './helpers/extendStaticConfig'
import { SplitStyleResult, insertSplitStyles, useSplitStyles } from './helpers/getSplitStyles'
import { getAllSelectors } from './helpers/insertStyleRule'
import { proxyThemeVariables } from './helpers/proxyThemeVariables'
import { wrapThemeManagerContext } from './helpers/wrapThemeManagerContext'
import { useFeatures } from './hooks/useFeatures'
import { useIsTouchDevice } from './hooks/useIsTouchDevice'
import { mediaState } from './hooks/useMedia'
import { usePressable } from './hooks/usePressable'
import { getThemeManagerIfChanged, useTheme } from './hooks/useTheme'
import {
  SpaceFlexDirection,
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

const defaultComponentState: TamaguiComponentState = {
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  // only used by enterStyle
  mounted: false,
  animation: null,
}

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

  function addPseudoToStyles(styles: any[], name: string, pseudos: any) {
    // on web use pseudo object { hoverStyle } to keep specificity with concatClassName
    const pseudoStyle = pseudos[name]
    const shouldNestObject = isWeb && name !== 'enterStyle' && name !== 'exitStyle'
    const defaultPseudoStyle = initialSplitStyles.pseudos[name]
    if (defaultPseudoStyle) {
      styles.push(shouldNestObject ? { [name]: defaultPseudoStyle } : defaultPseudoStyle)
    }
    if (pseudoStyle) {
      styles.push(shouldNestObject ? { [name]: pseudoStyle } : pseudoStyle)
    }
  }

  // see onConfiguredOnce below which attaches a name then to this component
  const component = forwardRef<Ref, ComponentPropTypes>((propsIn: any, forwardedRef) => {
    // React inserts default props after your props for some reason... order important
    const props =
      tamaguiDefaultProps && !propsIn.asChild ? { ...tamaguiDefaultProps, ...propsIn } : propsIn

    const { Component, isText, isZStack } = staticConfig
    const componentName = props.componentName || staticConfig.componentName
    const componentClassName = props.asChild
      ? ''
      : props.componentName
      ? `is_${props.componentName}`
      : defaultComponentClassName

    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        // prettier-ignore
        console.log('⚠️', componentName || Component?.displayName || Component?.name || '[Unnamed Component]', 'debug on')
        // keep separate react native warn touches every value on prop causing weird behavior
        console.log('props in:', { propsIn, props, ordered: Object.keys(props) })
        if (props['debug'] === 'break') debugger
      }
    }

    const forceUpdate = useForceUpdate()
    const theme = useTheme(props.theme, componentName, props, forceUpdate)
    const [state, set_] = useState<TamaguiComponentState>(defaultComponentState)
    const setStateShallow = createShallowUpdate(set_)

    const shouldAvoidClasses = !!(props.animation && avoidClasses)
    const splitStyles = useSplitStyles(
      props,
      staticConfig,
      theme,
      !shouldAvoidClasses
        ? {
            ...state,
            dynamicStylesInline: true,
          }
        : {
            ...state,
            noClassNames: true,
            dynamicStylesInline: true,
            resolveVariablesAs: 'value',
          },
      shouldAvoidClasses || props.asChild ? null : initialSplitStyles.classNames
    )

    const { viewProps: viewPropsIn, pseudos, medias, style, classNames } = splitStyles
    const useAnimations = tamaguiConfig.animations?.useAnimations as UseAnimationHook | undefined
    const isAnimated = !!(useAnimations && props.animation)
    const hasEnterStyle = !!props.enterStyle
    const hostRef = useRef<HTMLElement | View>(null)

    const features = useFeatures(props, {
      forceUpdate,
      setStateShallow,
      useAnimations,
      state,
      style: props.animation ? { ...defaultNativeStyle, ...style } : null,
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
      space: spaceProp,
      spaceDirection: _spaceDirection,
      disabled: disabledProp,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      hrefAttrs,
      separator,
      // ignore from here on out
      // for next/link compat etc
      // @ts-ignore
      onClick,
      theme: _themeProp,
      // @ts-ignore
      defaultVariants,

      ...nonTamaguiProps
    } = viewPropsIn

    // get the right component
    const isTaggable = !Component || typeof Component === 'string'
    const hasTextAncestor = isWeb ? useContext(TextAncestorContext) : false

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
    if (isWeb && !staticConfig.isReactNativeWeb) {
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

      if (!asChild) {
        rnw.useElementLayout(hostRef, onLayout)

        // from react-native-web
        rnw.useResponderEvents(hostRef, {
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
      }

      // from react-native-web
      const platformMethodsRef = rnw.usePlatformMethods(viewProps)
      const setRef = rnw.useMergeRefs(hostRef, platformMethodsRef, forwardedRef)

      if (!isAnimated) {
        // @ts-ignore
        viewProps.ref = setRef
      } else {
        if (forwardedRef) {
          // @ts-ignore
          viewProps.ref = forwardedRef
        }
      }

      if (props.href != null && hrefAttrs != null) {
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

      const role = viewProps.role

      // FOCUS
      // "focusable" indicates that an element may be a keyboard tab-stop.
      const _focusable = focusable != null ? focusable : accessible
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
      } else {
        // Everything else must explicitly set the prop
        if (_focusable === true) {
          viewProps.tabIndex = '0'
        }
      }
    } else {
      viewProps = nonTamaguiProps
      if (forwardedRef) {
        // @ts-ignore
        viewProps.ref = forwardedRef
      }
    }

    // from react-native-web
    if (process.env.NODE_ENV === 'development' && !isText && isWeb) {
      Children.toArray(props.children).forEach((item) => {
        if (typeof item === 'string') {
          console.error(`Unexpected text node: ${item}. A text node cannot be a child of a <View>.`)
        }
      })
    }

    // isMounted
    const internal = useRef<{ isMounted: boolean }>()
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
      }
    }, [hasEnterStyle, props.animation])

    let styles: any[]

    const animationStyles = state.animation ? state.animation.style : null

    if (isStringElement && shouldAvoidClasses) {
      styles = {
        ...defaultNativeStyle,
        ...(animationStyles ?? style),
        ...medias,
      }
    } else {
      styles = [
        isWeb ? null : defaultNativeStyleSheet ? (defaultNativeStyleSheet.base as ViewStyle) : null,
        // parity w react-native-web, only for text in text
        // TODO this should be able to be done w css to replicate after extraction:
        //  (.text .text { display: inline-flex; }) (but if they set display we'd need stronger precendence)
        // isText && hasTextAncestor && isWeb ? { display: 'inline-flex' } : null,
        animationStyles ?? style,
        medias,
      ]
      if (!animationStyles) {
        !state.mounted && addPseudoToStyles(styles, 'enterStyle', pseudos)
        state.hover && addPseudoToStyles(styles, 'hoverStyle', pseudos)
        state.focus && addPseudoToStyles(styles, 'focusStyle', pseudos)
        state.press && addPseudoToStyles(styles, 'pressStyle', pseudos)
      }
    }

    if (isWeb) {
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

      if (!shouldAvoidClasses) {
        if (classNames) {
          classList.push(Object.values(classNames).join(' '))
        }
        // TODO restore this to isText classList
        // hasTextAncestor === true && cssText.textHasAncestor,
        // TODO MOVE TO VARIANTS [number] [any]
        // numberOfLines != null && numberOfLines > 1 && cssText.textMultiLine,
      }

      const className = classList.join(' ')
      const style = animationStyles ?? splitStyles.style

      if (process.env.NODE_ENV === 'development' && props['debug']) {
        // prettier-ignore
        console.log('  » className', { splitStyles, style, isStringElement, pseudos, state, classNames, propsClassName: props.className, classList, className: className.trim().split(' '), themeClassName: theme.className, values: Object.fromEntries(Object.entries(classNames).map(([k, v]) => [v, getAllSelectors()[v]])) })
      }

      if (staticConfig.isReactNativeWeb) {
        viewProps.dataSet = {
          ...viewProps.dataSet,
          className: className,
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
      (pseudos && pseudos.pressStyle) ||
      (initialPseudos && initialPseudos.pressStyle) ||
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
              }
            : undefined,
          ...(isHoverable && {
            onMouseEnter: attachHover
              ? (e) => {
                  let next: Partial<typeof state> = {}
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
                  let next: Partial<typeof state> = {}
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

    let childEls =
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
            getThemeManagerIfChanged(theme)
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

    content = createElement(elementType, viewProps, childEls)

    // EVENTS native
    // native just wrap in <Pressable />
    if (process.env.TAMAGUI_TARGET === 'native') {
      if (attachPress && events) {
        content = (
          <TouchableWithoutFeedback
            onPressIn={events[pressInKey]}
            onPress={events[pressKey]}
            onPressOut={events[pressOutKey]}
          >
            {content}
          </TouchableWithoutFeedback>
        )
      }
    }

    if (isWeb && events && attachHover) {
      content = (
        <span
          className="tui_Hoverable"
          style={{
            display: 'contents',
          }}
          onMouseEnter={events.onMouseEnter}
          onMouseLeave={events.onMouseLeave}
        >
          {content}
        </span>
      )
    }

    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        // prettier-ignore
        console.log('  » ', { propsIn: { ...props }, propsOut: { ...viewProps }, state, splitStyles, animationStyles, isStringElement, classNamesIn: props.className?.split(' '), classNamesOut: viewProps.className?.split(' '), events, shouldAttach, ViewComponent: elementType, viewProps, styles, pseudos, content, childEls, shouldAvoidClasses, avoidClasses, animation: props.animation, style, defaultNativeStyle, initialSplitStyles, ...(typeof window !== 'undefined' ? { theme, themeClassName:  theme.className, staticConfig, tamaguiConfig } : null) })
      }
    }

    if (features.elements.length) {
      return (
        <>
          {features.elements}
          {content}
        </>
      )
    }

    return content
  })

  component.displayName = staticConfig.componentName

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
    initialSplitStyles = insertSplitStyles(staticConfig.defaultProps, staticConfig, initialTheme, {
      mounted: true,
      hover: false,
      press: false,
      pressIn: false,
      focus: false,
      resolveVariablesAs: 'both',
      keepVariantsAsProps: true,
    })

    // this ruins the prop order!!!
    // can't believe it but it puts default props after props?
    const defaults = {
      ...component.defaultProps,
      ...initialSplitStyles.viewProps,
    }

    defaultNativeStyle = {}

    const validStyles = staticConfig.validStyles || stylePropsView

    // split - keep variables on props to be processed using theme values at runtime (native)
    for (const key in staticConfig.defaultProps) {
      const val = staticConfig.defaultProps[key]
      if ((typeof val === 'string' && val[0] === '$') || !validStyles[key]) {
        defaults[key] = val
      } else {
        defaultNativeStyle[key] = val
      }
    }

    defaultNativeStyleSheet = StyleSheet.create({
      base: defaultNativeStyle,
    })

    if (Object.keys(defaults).length) {
      tamaguiDefaultProps = defaults
    }

    // add debug logs
    if (process.env.NODE_ENV === 'development' && staticConfig.defaultProps?.debug) {
      if (process.env.IS_STATIC !== 'is_static') {
        console.log(`🐛 [${staticConfig.componentName || 'Component'}]`, {
          staticConfig,
          initialSplitStyles,
          tamaguiDefaultProps,
          defaultNativeStyle,
          defaults,
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

type SpaceDirection = 'vertical' | 'horizontal'

export type SpacerProps = Omit<StackProps, 'flex' | 'direction'> & {
  size?: number | SpaceTokens
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
    },
  },

  defaultVariants: {
    direction: 'horizontal',
  },
})

export type SpacedChildrenProps = {
  isZStack?: boolean
  children?: any
  space?: any
  spaceFlex?: boolean | number
  direction?: SpaceFlexDirection
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
  if (!hasSpace && !hasSeparator) {
    return children
  }
  const childrenList = Children.toArray(children)
  if (childrenList.length <= 1) {
    return childrenList
  }
  const final: any[] = []
  for (const [index, child] of childrenList.entries()) {
    const isEmpty =
      child === null ||
      child === undefined ||
      child === false ||
      (Array.isArray(child) && child.length === 0)

    // push them all, but wrap some in Fragment
    if (isEmpty || !child || (child['key'] && !isZStack)) {
      final.push(child)
    } else {
      final.push(
        <Fragment key={index}>{isZStack ? <AbsoluteFill>{child}</AbsoluteFill> : child}</Fragment>
      )
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
      direction={
        direction === 'both'
          ? undefined
          : direction === 'row' || direction === 'row-reverse'
          ? 'horizontal'
          : 'vertical'
      }
      size={space}
      {...(spaceFlex && {
        flex: spaceFlex,
      })}
    />
  )
}

function isUnspaced(child: any) {
  return child?.['type']?.['isVisuallyHidden'] || child?.['type']?.['isUnspaced']
}

export function AbsoluteFill(props: any) {
  return isWeb ? (
    <div
      style={
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        } as any
      }
    >
      {props.children}
    </div>
  ) : (
    <View style={StyleSheet.absoluteFill}>{props.child}</View>
  )
}

// this can be done with CSS entirely right?
// const shouldWrapTextAncestor = isWeb && isText && !hasTextAncestor
// if (shouldWrapTextAncestor) {
//   // from react-native-web
//   content = createElement(TextAncestorContext.Provider, { value: true }, content)
// }

function processIDRefList(idRefList: string | Array<string>): string {
  return Array.isArray(idRefList) ? idRefList.join(' ') : idRefList
}

const accessibilityRoleToWebRole = {
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

// adapted from react-native-web
export function assignNativePropsToWeb(elementType: string, viewProps: any, nativeProps: any) {
  if (!viewProps.role && nativeProps.accessibilityRole) {
    if (nativeProps.accessibilityRole === 'none') {
      viewProps.role = 'presentation'
    } else {
      const webRole = accessibilityRoleToWebRole[nativeProps.accessibilityRole]
      if (webRole != null) {
        viewProps.role = webRole || nativeProps.accessibilityRole
      }
    }
  }

  if (nativeProps.accessibilityActiveDescendant != null) {
    viewProps['aria-activedescendant'] = nativeProps.accessibilityActiveDescendant
  }
  if (nativeProps.accessibilityAtomic != null) {
    viewProps['aria-atomic'] = nativeProps.accessibilityAtomic
  }
  if (nativeProps.accessibilityAutoComplete != null) {
    viewProps['aria-autocomplete'] = nativeProps.accessibilityAutoComplete
  }
  if (nativeProps.accessibilityBusy != null) {
    viewProps['aria-busy'] = nativeProps.accessibilityBusy
  }
  if (nativeProps.accessibilityChecked != null) {
    viewProps['aria-checked'] = nativeProps.accessibilityChecked
  }
  if (nativeProps.accessibilityColumnCount != null) {
    viewProps['aria-colcount'] = nativeProps.accessibilityColumnCount
  }
  if (nativeProps.accessibilityColumnIndex != null) {
    viewProps['aria-colindex'] = nativeProps.accessibilityColumnIndex
  }
  if (nativeProps.accessibilityColumnSpan != null) {
    viewProps['aria-colspan'] = nativeProps.accessibilityColumnSpan
  }
  if (nativeProps.accessibilityControls != null) {
    viewProps['aria-controls'] = processIDRefList(nativeProps.accessibilityControls)
  }
  if (nativeProps.accessibilityCurrent != null) {
    viewProps['aria-current'] = nativeProps.accessibilityCurrent
  }
  if (nativeProps.accessibilityDescribedBy != null) {
    viewProps['aria-describedby'] = processIDRefList(nativeProps.accessibilityDescribedBy)
  }
  if (nativeProps.accessibilityDetails != null) {
    viewProps['aria-details'] = nativeProps.accessibilityDetails
  }
  if (nativeProps.disabled === true) {
    viewProps['aria-disabled'] = true
    // Enhance with native semantics
    if (
      elementType === 'button' ||
      elementType === 'form' ||
      elementType === 'input' ||
      elementType === 'select' ||
      elementType === 'textarea'
    ) {
      viewProps.disabled = true
    }
  }
  if (nativeProps.accessibilityErrorMessage != null) {
    viewProps['aria-errormessage'] = nativeProps.accessibilityErrorMessage
  }
  if (nativeProps.accessibilityExpanded != null) {
    viewProps['aria-expanded'] = nativeProps.accessibilityExpanded
  }
  if (nativeProps.accessibilityFlowTo != null) {
    viewProps['aria-flowto'] = processIDRefList(nativeProps.accessibilityFlowTo)
  }
  if (nativeProps.accessibilityHasPopup != null) {
    viewProps['aria-haspopup'] = nativeProps.accessibilityHasPopup
  }
  if (nativeProps.accessibilityHidden === true) {
    viewProps['aria-hidden'] = nativeProps.accessibilityHidden
  }
  if (nativeProps.accessibilityInvalid != null) {
    viewProps['aria-invalid'] = nativeProps.accessibilityInvalid
  }
  if (
    nativeProps.accessibilityKeyShortcuts != null &&
    Array.isArray(nativeProps.accessibilityKeyShortcuts)
  ) {
    viewProps['aria-keyshortcuts'] = nativeProps.accessibilityKeyShortcuts.join(' ')
  }
  if (nativeProps.accessibilityLabel != null) {
    viewProps['aria-label'] = nativeProps.accessibilityLabel
  }
  if (nativeProps.accessibilityLabelledBy != null) {
    viewProps['aria-labelledby'] = processIDRefList(nativeProps.accessibilityLabelledBy)
  }
  if (nativeProps.accessibilityLevel != null) {
    viewProps['aria-level'] = nativeProps.accessibilityLevel
  }
  if (nativeProps.accessibilityLiveRegion != null) {
    viewProps['aria-live'] =
      nativeProps.accessibilityLiveRegion === 'none' ? 'off' : nativeProps.accessibilityLiveRegion
  }
  if (nativeProps.accessibilityModal != null) {
    viewProps['aria-modal'] = nativeProps.accessibilityModal
  }
  if (nativeProps.accessibilityMultiline != null) {
    viewProps['aria-multiline'] = nativeProps.accessibilityMultiline
  }
  if (nativeProps.accessibilityMultiSelectable != null) {
    viewProps['aria-multiselectable'] = nativeProps.accessibilityMultiSelectable
  }
  if (nativeProps.accessibilityOrientation != null) {
    viewProps['aria-orientation'] = nativeProps.accessibilityOrientation
  }
  if (nativeProps.accessibilityOwns != null) {
    viewProps['aria-owns'] = processIDRefList(nativeProps.accessibilityOwns)
  }
  if (nativeProps.accessibilityPlaceholder != null) {
    viewProps['aria-placeholder'] = nativeProps.accessibilityPlaceholder
  }
  if (nativeProps.accessibilityPosInSet != null) {
    viewProps['aria-posinset'] = nativeProps.accessibilityPosInSet
  }
  if (nativeProps.accessibilityPressed != null) {
    viewProps['aria-pressed'] = nativeProps.accessibilityPressed
  }
  if (nativeProps.accessibilityReadOnly != null) {
    viewProps['aria-readonly'] = nativeProps.accessibilityReadOnly
    // Enhance with native semantics
    if (elementType === 'input' || elementType === 'select' || elementType === 'textarea') {
      viewProps.readOnly = true
    }
  }
  if (nativeProps.accessibilityRequired != null) {
    viewProps['aria-required'] = nativeProps.accessibilityRequired
    // Enhance with native semantics
    if (elementType === 'input' || elementType === 'select' || elementType === 'textarea') {
      viewProps.required = true
    }
  }
  if (nativeProps.accessibilityRoleDescription != null) {
    viewProps['aria-roledescription'] = nativeProps.accessibilityRoleDescription
  }
  if (nativeProps.accessibilityRowCount != null) {
    viewProps['aria-rowcount'] = nativeProps.accessibilityRowCount
  }
  if (nativeProps.accessibilityRowIndex != null) {
    viewProps['aria-rowindex'] = nativeProps.accessibilityRowIndex
  }
  if (nativeProps.accessibilityRowSpan != null) {
    viewProps['aria-rowspan'] = nativeProps.accessibilityRowSpan
  }
  if (nativeProps.accessibilitySelected != null) {
    viewProps['aria-selected'] = nativeProps.accessibilitySelected
  }
  if (nativeProps.accessibilitySetSize != null) {
    viewProps['aria-setsize'] = nativeProps.accessibilitySetSize
  }
  if (nativeProps.accessibilitySort != null) {
    viewProps['aria-sort'] = nativeProps.accessibilitySort
  }
  if (nativeProps.accessibilityValueMax != null) {
    viewProps['aria-valuemax'] = nativeProps.accessibilityValueMax
  }
  if (nativeProps.accessibilityValueMin != null) {
    viewProps['aria-valuemin'] = nativeProps.accessibilityValueMin
  }
  if (nativeProps.accessibilityValueNow != null) {
    viewProps['aria-valuenow'] = nativeProps.accessibilityValueNow
  }
  if (nativeProps.accessibilityValueText != null) {
    viewProps['aria-valuetext'] = nativeProps.accessibilityValueText
  }

  if (nativeProps.nativeID) {
    viewProps.id = nativeProps.nativeID
  }
}
