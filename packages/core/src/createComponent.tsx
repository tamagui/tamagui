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
  useEffect,
  useRef,
  useState,
} from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'

import { onConfiguredOnce } from './conf'
import { stackDefaultStyles } from './constants/constants'
import { isAndroid, isTouchDevice, isWeb } from './constants/platform'
import { rnw } from './constants/rnw'
import { isVariable } from './createVariable'
import { ComponentState, defaultComponentState } from './defaultComponentState'
import { extendStaticConfig, parseStaticConfig } from './helpers/extendStaticConfig'
import {
  ClassNamesObject,
  PseudoStyles,
  SplitStyleResult,
  getSplitStyles,
} from './helpers/getSplitStyles'
import { wrapThemeManagerContext } from './helpers/wrapThemeManagerContext'
import { useFeatures } from './hooks/useFeatures'
import { usePressable } from './hooks/usePressable'
import { getThemeManagerIfChanged, useTheme } from './hooks/useTheme'
import {
  SpaceTokens,
  StackProps,
  StaticComponent,
  StaticConfig,
  StaticConfigParsed,
  TamaguiInternalConfig,
  UseAnimationHook,
} from './types'
import { TextAncestorContext } from './views/TextAncestorContext'

export const mouseUps = new Set<Function>()

if (typeof document !== 'undefined') {
  document.addEventListener('mouseup', () => {
    mouseUps.forEach((x) => x())
    mouseUps.clear()
  })
}

type DefaultProps = {}

function createShallowUpdate(setter: React.Dispatch<React.SetStateAction<ComponentState>>) {
  return (next: Partial<ComponentState>) => {
    setter((prev) => {
      for (const key in next) {
        if (prev[key] !== next[key]) {
          return { ...prev, ...next }
        }
      }
      return prev
    })
  }
}

export function createComponent<ComponentPropTypes extends Object = DefaultProps, Ref = View>(
  configIn: Partial<StaticConfig> | StaticConfigParsed
) {
  let staticConfig: StaticConfigParsed
  if ('parsed' in configIn) {
    staticConfig = configIn
  } else {
    staticConfig = parseStaticConfig(configIn)
  }

  const { Component, validStyles, isText, isZStack, componentName } = staticConfig
  const componentClassName = `is_${componentName}`
  const validStyleProps = validStyles || stylePropsView

  // split out default styles vs props so we can assign it to component.defaultProps
  let tamaguiConfig: TamaguiInternalConfig
  let AnimatedText: any
  let AnimatedView: any
  let avoidClasses = false

  // web uses className, native uses style
  let defaultPseudos: PseudoStyles = {}
  let defaultNativeStyle: any
  let defaultNativeStyleSheet: StyleSheet.NamedStyles<{ base: {} }> | null = null
  let defaultsClassName: ClassNamesObject | null = null
  let initialTheme: any
  let splitStyleResult: SplitStyleResult | null = null

  function addPseudoToStyles(styles: any[], name: string, pseudos: any) {
    // on web use pseudo object { hoverStyle } to keep specificity with concatClassName
    const pseudoStyle = pseudos[name]
    if (pseudoStyle) {
      styles.push(isWeb ? { [name]: pseudoStyle } : pseudoStyle)
    }
    const defaultPseudoStyle = defaultPseudos[name]
    if (defaultPseudoStyle) {
      styles.push(isWeb ? { [name]: defaultPseudoStyle } : defaultPseudoStyle)
    }
  }

  // see onConfiguredOnce below which attaches a name then to this component
  const component = forwardRef<Ref, ComponentPropTypes>((props: any, forwardedRef) => {
    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        // prettier-ignore
        console.warn(componentName || Component?.displayName || Component?.name || '[Unnamed Component]', ' debug prop on:', { props: Object.entries(props) })
        if (props['debug'] === 'break') debugger
      }
    }

    const forceUpdate = useForceUpdate()
    const theme = useTheme(props.theme, componentName, props, forceUpdate)
    const [state, set_] = useState<ComponentState>(defaultComponentState)
    const setStateShallow = createShallowUpdate(set_)

    const shouldAvoidClasses = !!(state.animation && avoidClasses)
    const splitInfo = getSplitStyles(
      props,
      staticConfig,
      theme,
      shouldAvoidClasses ? { ...state, noClassNames: true, resolveVariablesAs: 'value' } : state,
      defaultsClassName
    )

    const { viewProps: viewPropsIn, pseudos, medias, style, classNames } = splitInfo
    const useAnimations = tamaguiConfig.animations?.useAnimations as UseAnimationHook | undefined
    const isAnimated = !!(useAnimations && props.animation)

    const styleWithPseudos = props.animation
      ? merge(
          { ...defaultNativeStyle, ...style },
          state.hover && pseudos.hoverStyle,
          state.press && pseudos.pressStyle,
          state.focus && pseudos.focusStyle,
          ...Object.values(medias)
        )
      : null

    const features = useFeatures(props, {
      forceUpdate,
      setStateShallow,
      useAnimations,
      state,
      style: styleWithPseudos,
      pseudos,
    })

    const {
      tag,
      hitSlop,
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
      theme: _themeProp,
      // @ts-ignore
      defaultVariants,

      // TODO feature load layout hook
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
    const hostRef = useRef(null)
    const hasEnterStyle = !!props.enterStyle

    // isMounted
    const internal = useRef<{ isMounted: boolean }>()
    if (!internal.current) {
      internal.current = {
        isMounted: true,
      }
    }
    useEffect(() => {
      if (hasEnterStyle) {
        // we need to use state to properly have mounted go from false => true
        setStateShallow({
          mounted: true,
        })
      }
      internal.current!.isMounted = true
      return () => {
        mouseUps.delete(unPress)
        internal.current!.isMounted = false
      }
    }, [])

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

    if (isWeb) {
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
        ...animationStyles,
        ...medias,
      }
    } else {
      styles = [
        isWeb ? null : defaultNativeStyleSheet ? (defaultNativeStyleSheet.base as ViewStyle) : null,
        // parity w react-native-web, only for text in text
        // TODO this should be able to be done w css to replicate after extraction:
        //  (.text .text { display: inline-flex; }) (but if they set display we'd need stronger precendence)
        // isText && hasTextAncestor && isWeb ? { display: 'inline-flex' } : null,
        // style,
        animationStyles ? animationStyles : style,
        medias,
      ]
      if (!animationStyles) {
        state.hover && addPseudoToStyles(styles, 'hoverStyle', pseudos)
        state.focus && addPseudoToStyles(styles, 'focusStyle', pseudos)
        state.press && addPseudoToStyles(styles, 'pressStyle', pseudos)
      }
    }

    // TODO i think can still render this first part using reanimated
    // that way we get some of the classnames we probably want here (componentName/font/etc)
    // can just remove  && !shouldAvoidClasses and add in a viewProps.style = styles in isWeb

    if (isWeb) {
      // const hasntSetInitialAnimationState = props.animation && !state.animation
      // const disableInsertStyles = hasntSetInitialAnimationState || shouldAvoidClasses || false
      // const stylesClassNames = useStylesAsClassname(
      //   Array.isArray(styles) ? styles : [styles],
      //   disableInsertStyles,
      //   props.debug
      // )
      if (!shouldAvoidClasses) {
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

        // TODO restore this to isText classList
        // hasTextAncestor === true && cssText.textHasAncestor,
        // TODO MOVE TO VARIANTS [number] [any]
        // numberOfLines != null && numberOfLines > 1 && cssText.textMultiLine,

        const className = classList.join(' ')
        if (process.env.NODE_ENV === 'development') {
          if (props['debug']) {
            // prettier-ignore
            console.log('  » className', { isStringElement, pseudos, state, defaultsClassName, classNames, propsClassName: props.className, style, classList, className: className.trim().split(' '), themeClassName: theme.className })
          }
        }
        viewProps.className = className
      } else {
        viewProps.style = styles
      }
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
    const attachPress = !!((pseudos && pseudos.pressStyle) || onPress || onPressOut || onPressIn)
    const isHoverable = isWeb && !isTouchDevice
    const attachHover =
      isHoverable &&
      !!((pseudos && pseudos.hoverStyle) || onHoverIn || onHoverOut || onMouseEnter || onMouseLeave)
    const pressEventKey = isStringElement ? 'onClick' : 'onPress'

    // check presence to prevent reparenting bugs, allows for onPress={x ? function : undefined} usage
    // while avoiding reparenting...
    // once proper reparenting is supported, we can remove this and use that...
    const shouldAttach =
      attachPress ||
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
          'onMouseLeave' in props))

    const unPress = useCallback(() => {
      if (!internal.current!.isMounted) return
      setStateShallow({
        press: false,
        pressIn: false,
      })
    }, [])

    const events = shouldAttach
      ? {
          ...(!isWeb && {
            // non web
            onPressOut: (e) => {
              unPress()
              onPressOut?.(e)
            },
          }),
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
          onMouseDown: attachPress
            ? (e) => {
                setStateShallow({
                  press: true,
                  pressIn: true,
                })
                onPressIn?.(e)
                onMouseDown?.(e)
              }
            : null,
          [pressEventKey]: attachPress
            ? (e) => {
                // this caused issue with next.js passing href
                // e.preventDefault()
                onPress?.(e)
                unPress()
                onPressOut?.(e)
              }
            : null,
        }
      : null

    let childEls = !children
      ? children
      : wrapThemeManagerContext(
          spacedChildren({
            children,
            space,
            flexDirection: props.flexDirection || staticConfig.defaultProps?.flexDirection,
            isZStack: isZStack,
          }),
          getThemeManagerIfChanged(theme)
        )

    // TODO once we do the above we can then rely entirely on pressStyle returned here isntead of above pressStyle logic
    const [pressProps] = usePressable(
      events
        ? {
            disabled,
            ...(hitSlop && {
              hitSlop,
            }),
            onPressIn: events.onMouseDown,
            onPressOut: events.onPressOut,
            onPress: events[pressEventKey],
          }
        : {
            disabled: true,
          }
    )

    if (events) {
      if (!isStringElement) {
        Object.assign(viewProps, pressProps)
      } else {
        Object.assign(viewProps, events)
      }
      if (isWeb && isHoverable) {
        childEls = (
          <span
            style={{
              display: 'contents',
            }}
            onMouseEnter={events.onMouseEnter}
            onMouseLeave={events.onMouseLeave}
          >
            {children}
          </span>
        )
      }
    }

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

    content = createElement(ViewComponent, viewProps, childEls)

    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        viewProps['debug'] = true
        // prettier-ignore
        console.log('  » ', { propsIn: { ...props }, propsOut: { ...viewProps }, animationStyles, isStringElement, classNamesIn: props.className?.split(' '), classNamesOut: viewProps.className?.split(' '), pressProps, events, shouldAttach, ViewComponent, viewProps, state, styles, pseudos, content, childEls, shouldAvoidClasses, animation: props.animation, style, defaultNativeStyle, splitStyleResult, ...(typeof window !== 'undefined' ? { theme, themeState: theme.__state, themeClassName:  theme.className, staticConfig, tamaguiConfig } : null) })
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

  // Once configuration is run and all components are registered
  // get default props + className and analyze styles
  onConfiguredOnce((conf) => {
    const shouldDebug = staticConfig.defaultProps?.debug
    tamaguiConfig = conf
    avoidClasses = !!tamaguiConfig.animations?.avoidClasses
    AnimatedText = tamaguiConfig.animations?.Text
    AnimatedView = tamaguiConfig?.animations?.View
    initialTheme = conf.themes[conf.defaultTheme || Object.keys(conf.themes)[0]]
    splitStyleResult = getSplitStyles(staticConfig.defaultProps, staticConfig, initialTheme, {
      mounted: true,
      resolveVariablesAs: 'variable',
    })

    if (process.env.NODE_ENV === 'development' && shouldDebug) {
      console.log('splitStyleResult', splitStyleResult)
    }

    const { classNames, pseudos, style, viewProps } = splitStyleResult

    if (isWeb) {
      defaultsClassName = classNames
    }

    // for use in animations + native
    defaultPseudos = defaultPseudos
    defaultNativeStyle = {}
    for (const key in style) {
      const v = style[key]
      defaultNativeStyle[key] = isVariable(v) ? v.val : v
    }
    defaultNativeStyleSheet = StyleSheet.create({
      base: defaultNativeStyle,
    })

    component.displayName = staticConfig.componentName

    // @ts-ignore
    component.defaultProps = {
      ...viewProps,
      ...component.defaultProps,
    }
    if (
      process.env.NODE_ENV === 'development' &&
      shouldDebug &&
      process.env.IS_STATIC !== 'is_static'
    ) {
      // prettier-ignore
      console.log('tamagui 🐛:', { classNames, pseudos, style, viewProps, component, defaultsClassName })
    }
  })

  let res: StaticComponent<ComponentPropTypes, {}, Ref> = component as any

  if (configIn.memo) {
    res = memo(res) as any
  }

  res['staticConfig'] = {
    validStyles: validStyleProps,
    ...staticConfig,
  }

  // res.extractable HoC
  res['extractable'] = (Component: any, conf?: StaticConfig) => {
    Component['staticConfig'] = extendStaticConfig(res, {
      ...conf,
      neverFlatten: true,
      defaultProps: {
        ...Component.defaultProps,
        ...conf?.defaultProps,
      },
    })
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
  defaultProps: {
    ...stackDefaultStyles,
    size: true,
  },
  variants: {
    size: {
      '...size': (size, { tokens }) => {
        size = size == true ? '$true' : size
        const sizePx = tokens.size[size] ?? size
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
})

export function spacedChildren({
  isZStack,
  children,
  space,
  flexDirection,
  spaceFlex,
}: {
  isZStack?: boolean
  children: any
  space?: any
  spaceFlex?: boolean | number
  flexDirection?: ViewStyle['flexDirection']
}) {
  const childrenList = Children.toArray(children)
  const len = childrenList.length
  if (len === 1) {
    return childrenList
  }
  const next: any[] = []
  for (const [index, child] of childrenList.entries()) {
    if (child === null || child === undefined) {
      continue
    }

    if (!child || (child['key'] && !isZStack)) {
      next.push(child)
    } else {
      next.push(
        <Fragment key={index}>{isZStack ? <AbsoluteFill>{child}</AbsoluteFill> : child}</Fragment>
      )
    }

    // allows for custom visually hidden components that dont insert spacing
    if (child['type']?.['isVisuallyHidden']) {
      continue
    }

    if (index !== len - 1) {
      if (space) {
        next.push(
          <Spacer
            key={`_${index}_spacer`}
            direction={
              flexDirection === 'row' || flexDirection === 'row-reverse' ? 'horizontal' : 'vertical'
            }
            size={space}
            {...(spaceFlex && {
              flex: spaceFlex,
            })}
          />
        )
      }
    }
  }
  return next
}

// TODO this can be removed likey for bundle size, didnt help reanimated fix as i thought
const merge = (...styles: (ViewStyle | null | false | undefined)[]) => {
  // ensure transforms get merged without duplicates:
  // so if you have a:
  //  transform: [{ scale: 1 }]
  // rest[0]:
  //  transform: [{ scale: 1.1 }]
  // it gets properly merged so that rest[0] overwrites a
  if (!styles[0]) return // never happens
  const res: ViewStyle = {}

  const len = styles.length
  for (let i = len - 1; i >= 0; i--) {
    const cur = styles[i]
    if (!cur) continue

    for (const key in cur) {
      const val = cur[key]
      if (key !== 'transform') {
        if (!(key in res)) {
          res[key] = val
        }
        continue
      }
      if (!res.transform) {
        res.transform = val
        continue
      }
      // transform
      for (const t of val) {
        const tkey = Object.keys(t)[0]
        if (res.transform.find((existing) => tkey in existing)) {
          continue
        }
        res.transform.push(t)
      }
    }
  }

  return res
}

export const AbsoluteFill = (props: any) =>
  isWeb ? (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {props.children}
    </div>
  ) : (
    <View style={StyleSheet.absoluteFill}>{props.child}</View>
  )

// this can be done with CSS entirely right?
// const shouldWrapTextAncestor = isWeb && isText && !hasTextAncestor
// if (shouldWrapTextAncestor) {
//   // from react-native-web
//   content = createElement(TextAncestorContext.Provider, { value: true }, content)
// }
