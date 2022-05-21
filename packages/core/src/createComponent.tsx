import { stylePropsView } from '@tamagui/helpers'
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
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'

import { onConfiguredOnce } from './conf'
import { stackDefaultStyles } from './constants/constants'
import { isAndroid, isWeb, useIsomorphicLayoutEffect } from './constants/platform'
import { rnw } from './constants/rnw'
import { createShallowUpdate } from './helpers/createShallowUpdate'
import { extendStaticConfig, parseStaticConfig } from './helpers/extendStaticConfig'
import { SplitStyleResult, insertSplitStyles, useSplitStyles } from './helpers/getSplitStyles'
import { getAllSelectors } from './helpers/insertStyleRule'
import { BaseButton } from './helpers/nativeGestureHandler'
import { proxyThemeVariables } from './helpers/proxyThemeVariables'
import { wrapThemeManagerContext } from './helpers/wrapThemeManagerContext'
import { useFeatures } from './hooks/useFeatures'
import { useIsTouchDevice } from './hooks/useIsTouchDevice'
import { usePressable } from './hooks/usePressable'
import { getThemeManagerIfChanged, useTheme } from './hooks/useTheme'
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
  TamaguiInternalConfig,
  UseAnimationHook,
} from './types'
import { Slot } from './views/Slot'
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
  Ref = View,
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

  const componentClassName = `is_${staticConfig.componentName}`
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
  const component = forwardRef<Ref, ComponentPropTypes>((props: any, forwardedRef) => {
    // ridiculous fix because react inserts default props after your props for some reason...
    props = tamaguiDefaultProps && !props.asChild ? { ...tamaguiDefaultProps, ...props } : props

    const { Component, componentName, isText, isZStack } = staticConfig

    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        // prettier-ignore
        console.log('⚠️', staticConfig.componentName || Component?.displayName || Component?.name || '[Unnamed Component]', 'debug on')
        // keep separate react native warn touches every value on prop causing weird behavior
        console.log('props in:', props, Object.keys(props))
        if (props['debug'] === 'break') debugger
      }
    }

    const forceUpdate = useForceUpdate()
    const theme = useTheme(props.theme, staticConfig.componentName, props, forceUpdate)
    const [state, set_] = useState<TamaguiComponentState>(defaultComponentState)
    const setStateShallow = createShallowUpdate(set_)

    const shouldAvoidClasses = !!(props.animation && avoidClasses)
    const splitStyles = useSplitStyles(
      props,
      staticConfig,
      theme,
      {
        ...state,
        noClassNames: shouldAvoidClasses ? true : false,
        dynamicStylesInline: true,
        resolveVariablesAs: shouldAvoidClasses ? 'value' : 'auto',
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
      pointerEvents,
      onPress,
      onPressIn,
      onPressOut,
      onHoverIn,
      onHoverOut,
      space,
      disabled,
      onMouseEnter,
      onMouseLeave,
      hrefAttrs,
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
      onMouseDown,
      nativeID,

      accessible,
      accessibilityRole,

      // android
      collapsable,
      focusable,

      // ignore from here on out
      // for next/link compat etc
      // @ts-ignore
      onClick,
      theme: _themeProp,
      // @ts-ignore
      defaultVariants,

      onLayout,
      ...viewPropsRest
    } = viewPropsIn

    let viewProps: StackProps = viewPropsRest

    // from react-native-web
    if (process.env.NODE_ENV === 'development' && !isText && isWeb) {
      Children.toArray(props.children).forEach((item) => {
        if (typeof item === 'string') {
          console.error(`Unexpected text node: ${item}. A text node cannot be a child of a <View>.`)
        }
      })
    }

    const hasTextAncestor = isWeb ? useContext(TextAncestorContext) : false

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

    if (nativeID) {
      viewProps.id = nativeID
    }

    if (isAndroid) {
      if (collapsable) viewProps.collapsable = collapsable
      if (focusable) viewProps.focusable = focusable
    }

    if (!isWeb) {
      if (accessible) viewProps.accessible = accessible
      if (accessibilityRole) viewProps.accessibilityRole = accessibilityRole
    }

    if (isWeb && !asChild) {
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

    // get the right component
    const isTaggable = !Component || typeof Component === 'string'

    // default to tag, fallback to component (when both strings)
    const element = isWeb ? (isTaggable ? tag || Component : Component) : Component
    const BaseTextComponent = !isWeb ? Text : element || 'span'
    const BaseViewComponent = !isWeb ? View : element || (hasTextAncestor ? 'span' : 'div')
    let ViewComponent = isText
      ? (isAnimated ? AnimatedText || Text : null) || BaseTextComponent
      : (isAnimated ? AnimatedView || View : null) || BaseViewComponent

    ViewComponent = Component || ViewComponent

    let styles: any[]

    const isStringElement = typeof ViewComponent === 'string'
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

      viewProps.className = className
      viewProps.style = style
    } else {
      viewProps.style = styles
    }

    if (pointerEvents) {
      viewProps.pointerEvents = pointerEvents
    }

    if (isWeb) {
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
    } else {
      if (forwardedRef) {
        // @ts-ignore
        viewProps.ref = forwardedRef
      }
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

    const childEls =
      !children || asChild
        ? children
        : wrapThemeManagerContext(
            spacedChildren({
              children,
              space,
              direction: props.spaceDirection || 'both',
              isZStack,
            }),
            getThemeManagerIfChanged(theme)
          )

    let content: any

    // replicate react-native-web's `createElement`
    if (isWeb) {
      if (staticConfig.isReactNativeWeb) {
        viewProps.dataSet = {
          ...viewProps.dataSet,
          className: viewProps.className,
        }
      } else {
        const rnProps = rnw.createDOMProps(viewProps)
        const className =
          rnProps.className && rnProps.className !== viewProps.className
            ? `${rnProps.className} ${viewProps.className}`
            : viewProps.className

        // additive
        Object.assign(viewProps, rnProps)

        // we already handle Text/View properly
        if (className) {
          viewProps.className = className
        }
      }
    }

    if (asChild) {
      ViewComponent = Slot
      const onlyChild = React.Children.only(children)
      Object.assign(viewProps, onlyChild.props)
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

    content = createElement(ViewComponent, viewProps, childEls)

    // EVENTS native
    // native just wrap in <Pressable />
    if (!isWeb) {
      if (attachPress && events) {
        content = (
          // bugfix: on native <Pressable /> pressing down and then moving finger off
          // doesn't actually turn off press styles
          // but react-native-gesture-handler doesn't pass GestureResponderEvent...
          <Pressable onPressIn={events[pressInKey]} onPress={events[pressKey]}>
            <BaseButton
              onActiveStateChange={(isActive) => {
                if (!isActive) {
                  unPress()
                }
              }}
            >
              {content}
            </BaseButton>
          </Pressable>
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
        console.log('  » ', { propsIn: { ...props }, propsOut: { ...viewProps }, state, splitStyles, animationStyles, isStringElement, classNamesIn: props.className?.split(' '), classNamesOut: viewProps.className?.split(' '), events, shouldAttach, ViewComponent, viewProps, styles, pseudos, content, childEls, shouldAvoidClasses, avoidClasses, animation: props.animation, style, defaultNativeStyle, initialSplitStyles, ...(typeof window !== 'undefined' ? { theme, themeState: theme.__state, themeClassName:  theme.className, staticConfig, tamaguiConfig } : null) })
      }
    }

    if (features.length) {
      return (
        <>
          {features}
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

  res['staticConfig'] = {
    validStyles: staticConfig.validStyles || stylePropsView,
    ...staticConfig,
  }

  if (process.env.NODE_ENV === 'development') {
    res['whyDidYouRender'] = true
  }

  // res.extractable HoC
  res['extractable'] = (Component: any, conf?: Partial<StaticConfig>) => {
    Component['staticConfig'] = extendStaticConfig(
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

// dont used styled() here to avoid circular deps
// keep inline to avoid circular deps

export const Spacer = createComponent<
  Omit<StackProps, 'flex' | 'direction'> & {
    size?: number | SpaceTokens
    flex?: boolean | number
    direction?: 'horizontal' | 'vertical'
  }
>({
  memo: true,
  componentName: 'Spacer',
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
        flex: 1,
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

export function spacedChildren({
  isZStack,
  children,
  space,
  direction,
  spaceFlex,
}: {
  isZStack?: boolean
  children: any
  space?: any
  spaceFlex?: boolean | number
  direction?: SpaceDirection
}) {
  if (!space && !spaceFlex) {
    return children
  }
  const childrenList = Array.isArray(children) ? children : Children.toArray(children)
  const len = childrenList.length
  if (len <= 1) {
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

    if (next && !isVisuallyHidden(next)) {
      final.push(
        <Spacer
          key={`_${index}_spacer`}
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
  }

  return final
}

function isVisuallyHidden(child: any) {
  return child?.['type']?.['isVisuallyHidden']
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
