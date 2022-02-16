import { concatClassName, stylePropsView } from '@tamagui/helpers'
import { useForceUpdate } from '@tamagui/use-force-update'
import React, {
  Children,
  Fragment,
  createElement,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'

import { onConfiguredOnce } from './conf'
import { stackDefaultStyles } from './constants/constants'
import { isTouchDevice, isWeb } from './constants/platform'
import { rnw } from './constants/rnw'
import { addStylesUsingClassname, useStylesAsClassname } from './helpers/addStylesUsingClassname'
import { extendStaticConfig, parseStaticConfig } from './helpers/extendStaticConfig'
import { getSplitStyles } from './helpers/getSplitStyles'
import { useFeatures } from './hooks/useFeatures'
import { usePressable } from './hooks/usePressable'
import { useTheme } from './hooks/useTheme'
import {
  SpaceTokens,
  StaticComponent,
  StaticConfig,
  StaticConfigParsed,
  TamaguiInternalConfig,
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

const defaultComponentState = {
  hover: false,
  press: false,
  pressIn: false,
}

type ComponentState = typeof defaultComponentState

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

export function createComponent<ComponentPropTypes extends Object = DefaultProps>(
  configIn: Partial<StaticConfig> | StaticConfigParsed
) {
  let staticConfig: StaticConfigParsed
  if ('parsed' in configIn) {
    staticConfig = configIn
  } else {
    staticConfig = parseStaticConfig(configIn)
  }

  const { Component, validStyles, isText, isZStack } = staticConfig
  const validStyleProps = validStyles ?? stylePropsView

  // split out default styles vs props so we can assign it to component.defaultProps
  let defaultProps = null as any
  let tamaguiConfig: TamaguiInternalConfig

  // web uses className, native uses style
  let defaultNativeStyle: StyleSheet.NamedStyles<{ base: {} }> | null = null
  let defaultsClassName = ''
  let initialTheme: any

  // see onConfiguredOnce below which attaches a name then to this component

  const component = forwardRef<View, ComponentPropTypes>((props: any, forwardedRef) => {
    const forceUpdate = useForceUpdate()
    const features = useFeatures(props, { forceUpdate })
    const theme = useTheme()
    const [state, set_] = useState<ComponentState>(defaultComponentState)
    const set = createShallowUpdate(set_)

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

    const {
      viewProps: viewPropsIn,
      pseudos,
      style,
      classNames,
    } = getSplitStyles(props, staticConfig, theme)

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
      onClick,

      accessible,
      accessibilityRole,

      // TODO feature load layout hook
      onLayout,
      ...viewProps
    } = viewPropsIn

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

    // hasEverHadEvents prevents repareting if you remove onPress or similar...
    const internal = useRef<{ isMounted: boolean; hasEverHadEvents?: boolean }>()
    if (!internal.current) {
      internal.current = {
        isMounted: true,
      }
    }

    useEffect(() => {
      internal.current!.isMounted = true
      return () => {
        mouseUps.delete(unPress)
        internal.current!.isMounted = false
      }
    }, [])

    const useAnimations = tamaguiConfig.animations?.useAnimations
    const isAnimated = !!(useAnimations && props.animation)

    // element
    const isInternalComponent = !Component || typeof Component === 'string'
    // default to tag, fallback to component (when both strings)
    const element = isWeb ? (isInternalComponent ? tag || Component : Component) : Component
    const ReactView =
      (isAnimated ? tamaguiConfig?.animations?.View : null) ??
      (!isWeb ? View : element || (hasTextAncestor ? 'span' : 'div'))
    const ReactText =
      (isAnimated ? tamaguiConfig?.animations?.Text : null) ?? (!isWeb ? Text : element || 'span')
    const ViewComponent = isText ? ReactText : ReactView

    // styles
    const isHovering = !isTouchDevice && !disabled && pseudos && state.hover
    const isPressing = !disabled && pseudos && state.press

    let styles = [
      defaultNativeStyle ? defaultNativeStyle.base : null,
      // parity w react-native-web, only for text in text
      // TODO this should be able to be done w css to replicate after extraction:
      //  (.text .text { display: inline-flex; }) (but if they set display we'd need stronger precendence)
      // isText && hasTextAncestor && isWeb ? { display: 'inline-flex' } : null,
      style,
      isHovering ? pseudos.hoverStyle || null : null,
      isPressing ? pseudos.pressStyle || null : null,
    ]

    if (isAnimated) {
      if (process.env.NODE_ENV === 'development') {
        if (props['debug']) {
          // prettier-ignore
          console.log('» animations', useAnimations, tamaguiConfig.animations, ViewComponent?.render?.toString(), { animation: props.animation }, style)
        }
      }
      const res = useAnimations(props, {
        style,
        isHovering,
        isPressing,
      })
      styles = [res]
    }

    if (isWeb && !isAnimated) {
      const stylesClassNames = useStylesAsClassname(styles)
      const classList = isText
        ? [
            defaultsClassName,
            // hasTextAncestor === true && cssText.textHasAncestor,
            // TODO MOVE TO VARIANTS [number] [any]
            // numberOfLines != null && numberOfLines > 1 && cssText.textMultiLine,
            classNames,
            stylesClassNames,
            props.className,
          ]
        : [defaultsClassName, props.className, classNames, stylesClassNames]

      // @ts-ignore we are optimizing using arguments
      const className = concatClassName(...classList)
      if (process.env.NODE_ENV === 'development') {
        if (props['debug']) {
          // prettier-ignore
          console.log('» className', { style, styles, classList, stylesClassNames, className: className.trim().split(' ') })
        }
      }
      viewProps.className = className
    } else {
      viewProps.style = styles
    }

    if (pointerEvents) {
      viewProps.pointerEvents = pointerEvents
    }

    if (isWeb && !isAnimated) {
      // from react-native-web
      const platformMethodsRef = rnw.usePlatformMethods(viewProps)
      const setRef = rnw.useMergeRefs(hostRef, platformMethodsRef, forwardedRef)
      viewProps.ref = setRef
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
        viewProps.ref = forwardedRef
      }
    }

    const attachPress = !!(
      (pseudos && pseudos.pressStyle) ||
      onPress ||
      onPressOut ||
      onPressIn ||
      onClick
    )
    const attachHover =
      isWeb &&
      !isTouchDevice &&
      !!((pseudos && pseudos.hoverStyle) || onHoverIn || onHoverOut || onMouseEnter || onMouseLeave)

    // check presence to prevent reparenting bugs, allows for onPress={x ? function : undefined} usage
    // while avoiding reparenting...
    // once proper reparenting is supported, we can remove this and use that...
    const shouldAttach =
      internal.current.hasEverHadEvents ||
      attachPress ||
      attachHover ||
      'pressStyle' in props ||
      'onPress' in props ||
      'onPressIn' in props ||
      'onPressOut' in props ||
      (isWeb &&
        ('hoverStyle' in props ||
          'onClick' in props ||
          'onHoverIn' in props ||
          'onHoverOut' in props ||
          'onMouseEnter' in props ||
          'onMouseLeave' in props))

    // never remove events as we wrap in a div (for now, may be able to remove..)
    if (shouldAttach) {
      internal.current.hasEverHadEvents = true
    }

    const unPress = useCallback(() => {
      if (!internal.current!.isMounted) return
      set({
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
          ...(isWeb &&
            !isTouchDevice && {
              onMouseEnter:
                attachHover || attachPress
                  ? (e) => {
                      let next: Partial<typeof state> = {}
                      if (attachHover) {
                        next.hover = true
                      }
                      if (state.pressIn) {
                        next.press = true
                      }
                      if (Object.keys(next).length) {
                        set(next)
                      }
                      onHoverIn?.(e)
                      onMouseEnter?.(e)
                    }
                  : undefined,
              onMouseLeave:
                attachHover || attachPress
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
                        set(next)
                      }
                      onHoverOut?.(e)
                      onMouseLeave?.(e)
                    }
                  : undefined,
            }),
          onMouseDown: attachPress
            ? (e) => {
                set({
                  press: true,
                  pressIn: true,
                })
                onPressIn?.(e)
                onMouseDown?.(e)
              }
            : (onPressIn as any),
          onClick: attachPress
            ? (e) => {
                // this caused issue with next.js passing href
                // e.preventDefault()
                onPress?.(e)
                onClick?.(e)
                unPress()
                onPressOut?.(e)
              }
            : (onPressOut as any),
        }
      : null

    if (events) {
      if (typeof ViewComponent !== 'string') {
        // TODO once we do the above we can then rely entirely on pressStyle returned here isntead of above pressStyle logic
        const [pressProps] = usePressable({
          disabled,
          hitSlop,
          onPressIn: events.onMouseDown,
          onPressOut: events.onPressOut,
          onPress: events.onClick,
        })
        Object.assign(viewProps, pressProps)
      } else {
        Object.assign(viewProps, events)
      }
    }

    const childEls = spacedChildren({
      children,
      space,
      flexDirection: props.flexDirection || defaultProps?.flexDirection,
      isZStack: isZStack,
    })

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
        console.log('set', className, viewProps.dataSet, viewProps)
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

    // const shouldWrapTextAncestor = isWeb && isText && !hasTextAncestor
    // if (shouldWrapTextAncestor) {
    //   // from react-native-web
    //   content = createElement(TextAncestorContext.Provider, { value: true }, content)
    // }

    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        viewProps['debug'] = true
        console.log('» props in:', props)
        console.log('» props out:', viewProps.dataSet, {
          ...viewProps,
          classNameSplit: viewProps.className?.split(' '),
        })
        // prettier-ignore
        console.log('» etc:', { shouldAttach, ViewComponent, viewProps, styles, pseudos, content, childEls })
        // only on browser because node expands it huge
        if (typeof window !== 'undefined') {
          console.log('» component info', { staticConfig, tamaguiConfig })
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
    initialTheme = conf.themes[conf.defaultTheme || Object.keys(conf.themes)[0]]
    const { classNames, pseudos, style, viewProps } = getSplitStyles(
      staticConfig.defaultProps,
      staticConfig,
      initialTheme
    )
    if (isWeb) {
      if (classNames) {
        defaultsClassName += classNames + ' '
      }
      defaultsClassName += addStylesUsingClassname([style, pseudos])
      if (process.env.NODE_ENV === 'development' && shouldDebug) {
        // prettier-ignore
        console.log('tamagui 🐛:', { defaultsClassName: defaultsClassName.split(' ') })
      }
    } else {
      // native, create a default StyleSheet
      // TODO handle pseudos
      const sheetStyles = {}
      for (const styleObj of style) {
        Object.assign(sheetStyles, styleObj)
      }
      defaultNativeStyle = StyleSheet.create({
        base: sheetStyles,
      })
    }
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

  const res = component as any as StaticComponent<ComponentPropTypes, void>

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

let hasWarnedOnce = false

// dont used styled() here to avoid circular deps
// keep inline to avoid circular deps

export const Spacer = createComponent<{ size?: number | SpaceTokens; flex?: boolean | number }>({
  defaultProps: {
    ...stackDefaultStyles,
    size: true,
  },
  variants: {
    size: {
      '...size': (size, { tokens }) => {
        size = size == true ? '$true' : size
        return {
          width: tokens.size[size] ?? size,
          height: tokens.size[size] ?? size,
        }
      },
    },

    direction: {
      horizontal: {
        height: 0,
      },
      vertical: {
        width: 0,
      },
    },
  },
})

export function spacedChildren({
  isZStack,
  children,
  space,
  flexDirection,
}: {
  isZStack?: boolean
  children: any
  space?: any
  flexDirection?: ViewStyle['flexDirection']
}) {
  if (!space && !isZStack) {
    return children
  }
  const childrenList = Children.toArray(children)
  const len = childrenList.length
  if (len === 1) {
    return children
  }
  const next: any[] = []
  for (const [index, child] of childrenList.entries()) {
    if (child === null || child === undefined) {
      continue
    }

    const key = `${child?.['key'] ?? index}`

    next.push(
      <Fragment key={key}>{isZStack ? <AbsoluteFill>{child}</AbsoluteFill> : child}</Fragment>
    )

    // allows for custom visually hidden components that dont insert spacing
    if (child?.['type']?.['isVisuallyHidden']) {
      continue
    }

    if (index !== len - 1) {
      if (space) {
        next.push(
          <Spacer
            key={`${key}_spacer`}
            // @ts-ignore TODO
            direction={
              flexDirection === 'row' || flexDirection === 'row-reverse' ? 'horizontal' : 'vertical'
            }
            size={space}
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
