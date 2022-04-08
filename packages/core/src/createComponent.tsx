import { concatClassName, stylePropsView } from '@tamagui/helpers'
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
import { addStylesUsingClassname, useStylesAsClassname } from './helpers/addStylesUsingClassname'
import { extendStaticConfig, parseStaticConfig } from './helpers/extendStaticConfig'
import { SplitStyleResult, getSplitStyles } from './helpers/getSplitStyles'
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

if (process.env.TAMAGUI_TARGET === 'web') {
  require('./tamagui-base.css')
}

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

  // web uses className, native uses style
  let defaultNativeStyle: any
  let defaultNativeStyleSheet: StyleSheet.NamedStyles<{ base: {} }> | null = null
  let defaultsClassName = ''
  let initialTheme: any
  let splitStyleResult: SplitStyleResult | null = null

  // see onConfiguredOnce below which attaches a name then to this component

  const component = forwardRef<Ref, ComponentPropTypes>((props: any, forwardedRef) => {
    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        if (props['debug'] === 'break') {
          debugger
        }
        // prettier-ignore
        console.log(componentName || Component?.displayName || Component?.name || '[Unnamed Component]', ' debug prop on:')
      }
    }

    const forceUpdate = useForceUpdate()
    const theme = useTheme(props.theme, componentName, props, forceUpdate)
    const [state, set_] = useState<ComponentState>(defaultComponentState)
    const setStateShallow = createShallowUpdate(set_)

    const {
      viewProps: viewPropsIn,
      pseudos,
      style,
      classNames,
    } = getSplitStyles(props, staticConfig, theme, state.mounted)

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

      // TODO feature load layout hook
      onLayout,
      ...viewPropsRest
    } = viewPropsIn

    let viewProps: StackProps = viewPropsRest

    const useAnimations = tamaguiConfig.animations?.useAnimations as UseAnimationHook | undefined
    const isAnimated = !!(useAnimations && props.animation)

    const isHovering = Boolean(!disabled && !isTouchDevice && pseudos && state.hover)
    const isPressing = Boolean(!disabled && pseudos && state.press)
    const isFocusing = Boolean(!disabled && pseudos && state.focus)

    const features = useFeatures(props, {
      forceUpdate,
      setStateShallow,
      useAnimations,
      state,
      style,
      pseudos,
      isHovering,
      isPressing,
      isFocusing,
    })

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
    const avoidClasses = state.animation && state.animation.avoidClasses
    // default to tag, fallback to component (when both strings)
    const element = isWeb ? (isTaggable ? tag || Component : Component) : Component
    const BaseTextComponent = !isWeb ? Text : element || 'span'
    const BaseViewComponent = !isWeb ? View : element || (hasTextAncestor ? 'span' : 'div')
    const ViewComponent = isText
      ? (isAnimated && !avoidClasses ? AnimatedText || Text : null) || BaseTextComponent
      : (isAnimated && !avoidClasses ? AnimatedView || View : null) || BaseViewComponent

    let styles: any[]

    const isStringElement = typeof ViewComponent !== 'string'
    const shouldWrapHoverable = isWeb && isStringElement
    const animationStyles = state.animation ? state.animation.style : null

    if (avoidClasses) {
      // styles = [state.animatedStyle]
      if (isWeb) {
        styles = {
          ...defaultNativeStyle,
          ...animationStyles,
        }
      } else {
        styles = [defaultNativeStyleSheet?.base, animationStyles]
      }
    } else {
      const hoverStyle = isHovering ? pseudos!.hoverStyle : null
      const pressStyle = isPressing ? pseudos!.pressStyle : null
      const focusStyle = isFocusing ? pseudos!.focusStyle : null
      styles = [
        defaultNativeStyleSheet ? (defaultNativeStyleSheet.base as ViewStyle) : null,
        // parity w react-native-web, only for text in text
        // TODO this should be able to be done w css to replicate after extraction:
        //  (.text .text { display: inline-flex; }) (but if they set display we'd need stronger precendence)
        // isText && hasTextAncestor && isWeb ? { display: 'inline-flex' } : null,
        style,
        // nesting these on web because we need to be sure concatClassNames overrides the right className
        isWeb && hoverStyle ? ({ hoverStyle } as any) : hoverStyle,
        isWeb && pressStyle ? ({ pressStyle } as any) : pressStyle,
        isWeb && focusStyle ? ({ focusStyle } as any) : focusStyle,
        animationStyles,
      ]
    }

    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        // prettier-ignore
        console.log('  » ', { avoidClasses, animation: props.animation, style, styles, defaultNativeStyle, splitStyleResult })
      }
    }

    // TODO i think can still render this first part using reanimated
    // that way we get some of the classnames we probably want here (componentName/font/etc)
    // can just remove  && !avoidClasses and add in a viewProps.style = styles in isWeb

    if (isWeb) {
      const stylesClassNames = useStylesAsClassname(styles, avoidClasses || false, props.debug)
      if (!avoidClasses) {
        const fontFamilyName = isText
          ? props.fontFamily || staticConfig.defaultProps.fontFamily
          : null
        const fontFamily =
          fontFamilyName && fontFamilyName[0] === '$' ? fontFamilyName.slice(1) : null
        const classList = [
          fontFamily ? `font_${fontFamily}` : null,
          theme.className,
          defaultsClassName,
          classNames,
          stylesClassNames,
          props.className,
        ]
        if (componentName) {
          classList.unshift(componentClassName)
        }
        // TODO restore this to isText classList
        // hasTextAncestor === true && cssText.textHasAncestor,
        // TODO MOVE TO VARIANTS [number] [any]
        // numberOfLines != null && numberOfLines > 1 && cssText.textMultiLine,

        const className = concatClassName(...classList)
        if (process.env.NODE_ENV === 'development') {
          if (props['debug']) {
            // prettier-ignore
            console.log('  » styles', { pseudos, state, style, styles, classList, stylesClassNames, className: className.trim().split(' '), themeClassName: theme.className })
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

    const attachPress = !!((pseudos && pseudos.pressStyle) || onPress || onPressOut || onPressIn)
    const isHoverable = isWeb && !isTouchDevice
    const attachHover =
      isHoverable &&
      !!((pseudos && pseudos.hoverStyle) || onHoverIn || onHoverOut || onMouseEnter || onMouseLeave)

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
                  console.log('hoverin')
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
          [isWeb ? 'onClick' : 'onPress']: attachPress
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

    if (events) {
      // TODO once we do the above we can then rely entirely on pressStyle returned here isntead of above pressStyle logic
      const [pressProps] = usePressable({
        disabled,
        hitSlop,
        onPressIn: events.onMouseDown,
        onPressOut: events.onPressOut,
        onPress: events[isWeb ? 'onClick' : 'onPress'],
      })

      if (isStringElement) {
        Object.assign(viewProps, pressProps)

        // handle hoverable
        if (shouldWrapHoverable) {
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
      } else {
        Object.assign(viewProps, events)
      }
    }

    let content: any

    // replicate react-native-web's `createElement`
    if (isWeb && rnw && !isAnimated) {
      const domProps = rnw.createDOMProps(viewProps)
      const className =
        domProps.className && domProps.className !== viewProps.className
          ? `${domProps.className} ${viewProps.className}`
          : viewProps.className
      Object.assign(viewProps, domProps)

      if (staticConfig.isReactNativeWeb) {
        viewProps.dataSet = {
          ...(viewProps.dataSet || {}),
          cn: className,
        }
      } else {
        // we already handle Text/View properly
        if (className) {
          viewProps.className = className
        }
      }
      content = createElement(ViewComponent, viewProps, childEls)
    } else {
      content = createElement(ViewComponent, viewProps, childEls)
    }

    // this can be done with CSS entirely right?
    // const shouldWrapTextAncestor = isWeb && isText && !hasTextAncestor
    // if (shouldWrapTextAncestor) {
    //   // from react-native-web
    //   content = createElement(TextAncestorContext.Provider, { value: true }, content)
    // }

    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        viewProps['debug'] = true
        // prettier-ignore
        console.log('  » ', { propsIn: { ...props }, propsOut: { ...viewProps }, classNamesIn: props.className?.split(' '), classNamesOut: viewProps.className?.split(' '), shouldAttach, ViewComponent, viewProps, state, styles, pseudos, content, childEls })
        // only on browser because node expands it huge
        if (typeof window !== 'undefined') {
          // prettier-ignore
          console.log('  » ', { theme, themeState: theme.__state, themeClassName:  theme.className, staticConfig, tamaguiConfig })
        }
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
    AnimatedText = tamaguiConfig.animations?.Text
    AnimatedView = tamaguiConfig?.animations?.View
    initialTheme = conf.themes[conf.defaultTheme || Object.keys(conf.themes)[0]]
    splitStyleResult = getSplitStyles(
      staticConfig.defaultProps,
      staticConfig,
      initialTheme,
      true,
      'variable'
    )

    const { classNames, pseudos, style, viewProps } = splitStyleResult

    if (isWeb) {
      if (classNames) {
        defaultsClassName += classNames + ' '
      }
      const stylesObj = {}
      for (const k in style) {
        const v = style[k]
        stylesObj[k] = isVariable(v) ? v.variable : v
      }
      defaultsClassName += addStylesUsingClassname([stylesObj, pseudos])
      if (process.env.NODE_ENV === 'development' && shouldDebug) {
        // prettier-ignore
        console.log('tamagui 🐛:', { defaultsClassName: defaultsClassName.split(' ') })
      }
    }

    // for animations and native
    // TODO handle pseudos
    defaultNativeStyle = {}
    for (const key in style) {
      const v = style[key]
      defaultNativeStyle[key] = isVariable(v) ? v.val : v
    }
    defaultNativeStyleSheet = StyleSheet.create({
      base: defaultNativeStyle,
    })

    // @ts-ignore
    component.defaultProps = {
      ...viewProps,
      ...component.defaultProps,
    }
    if (process.env.NODE_ENV === 'development' && shouldDebug) {
      // prettier-ignore
      console.log('tamagui 🐛:', { initialTheme, classNames, pseudos, style, viewProps, defaultsClassName, component })
    }
  })

  component['staticConfig'] = {
    validStyles: validStyleProps,
    ...staticConfig,
  }

  let res: StaticComponent<ComponentPropTypes, void, Ref> = component as any

  if (configIn.memo) {
    res = memo(res) as any
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

export const AbsoluteFill = (props: any) =>
  isWeb ? (
    <div className="tamagui-absolute-fill">{props.children}</div>
  ) : (
    <View style={StyleSheet.absoluteFill}>{props.child}</View>
  )
