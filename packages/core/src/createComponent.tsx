import { concatClassName, stylePropsView } from '@tamagui/helpers'
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

import { stackDefaultStyles } from './constants/constants'
import { isTouchDevice, isWeb } from './constants/platform'
import { rnw } from './constants/rnw'
import { onConfiguredOnce } from './createTamagui'
import { addStylesUsingClassname, useStylesAsClassname } from './helpers/addStylesUsingClassname'
import { extendStaticConfig, parseStaticConfig } from './helpers/extendStaticConfig'
import { getSplitStyles } from './helpers/getSplitStyles'
import { useFeatures } from './hooks/useFeatures'
import { useForceUpdate } from './hooks/useForceUpdate'
import { usePressable } from './hooks/usePressable'
import {
  SpaceTokens,
  StaticComponent,
  StaticConfig,
  StaticConfigParsed,
  TamaguiInternalConfig,
} from './types'
import { TextAncestorContext } from './views/TextAncestorContext'
import { ThemeManagerContext } from './views/ThemeManagerContext'

export const mouseUps = new Set<Function>()

if (typeof document !== 'undefined') {
  document.addEventListener('mouseup', () => {
    mouseUps.forEach((x) => x())
    mouseUps.clear()
  })
}

type DefaultProps = {}

export function createComponent<A extends Object = DefaultProps>(
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
  let defaultsStyle: any
  let defaultsClassName = ''
  let initialTheme: any

  // see onConfiguredOnce below which attaches a name then to this component

  const component = forwardRef<View, A>((props: any, forwardedRef) => {
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
      // TODO feature load layou hook
      onLayout,
    } = props

    const forceUpdate = useForceUpdate()
    const features = useFeatures(props, { forceUpdate })
    const manager = useContext(ThemeManagerContext)
    const [state, set_] = useState(() => ({
      hover: false,
      press: false,
      pressIn: false,
      theme: manager.name,
    }))
    const set = (next: Partial<typeof state>) =>
      set_((prev) => {
        for (const key in next) {
          if (prev[key] !== next[key]) {
            return { ...prev, ...next }
          }
        }
        return prev
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

    const isTracking = useRef(false)

    const { viewProps, pseudos, style, classNames } = getSplitStyles(
      props,
      staticConfig,
      (manager.theme as any) || initialTheme
    )

    // hasEverHadEvents prevents repareting if you remove onPress or similar...
    const internal = useRef<{ isMounted: boolean; hasEverHadEvents?: boolean }>()
    if (!internal.current) {
      internal.current = {
        isMounted: true,
      }
    }

    useEffect(() => {
      internal.current!.isMounted = true
      const dispose = manager?.onChangeTheme((name) => {
        if (isTracking.current) {
          set({ theme: name })
        }
      })
      return () => {
        dispose()
        mouseUps.delete(unPress)
        isTracking.current = false
        internal.current!.isMounted = false
      }
    }, [manager])

    // element
    const element = isWeb
      ? !Component || typeof Component === 'string'
        ? // default to tag, fallback to component (when both strings)
          tag || Component
        : Component
      : Component
    const ReactView = !isWeb ? View : element || (hasTextAncestor ? 'span' : 'div')
    const ReactText = !isWeb ? Text : element || 'span'
    const ViewComponent = isText ? ReactText : ReactView

    // styles
    const isHovering = !isTouchDevice && !disabled && pseudos && state.hover
    const isPressing = !disabled && pseudos && state.press

    const styles = [
      // parity w react-native-web, only for text in text
      // TODO this should be able to be done w css to replicate after extraction:
      //  (.text .text { display: inline-flex; }) (but if they set display we'd need stronger precendence)
      // isText && hasTextAncestor && isWeb ? { display: 'inline-flex' } : null,
      style,
      isHovering ? pseudos.hoverStyle || null : null,
      isPressing ? pseudos.pressStyle || null : null,
    ]

    if (isWeb) {
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

      // @ts-expect-error
      const className = concatClassName(...classList)
      if (process.env.NODE_ENV === 'development') {
        if (props['debug']) {
          // prettier-ignore
          console.log('🥚 className', { style, styles, classList, stylesClassNames, className })
        }
      }
      viewProps.className = className
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
    if (isWeb && rnw) {
      const domProps = rnw.createDOMProps(viewProps)
      const className =
        domProps.className && domProps.className !== viewProps.className
          ? `${domProps.className} ${viewProps.className}`
          : viewProps.className
      Object.assign(viewProps, domProps)
      viewProps.className = className
      content = createElement(ViewComponent, viewProps, childEls)
    } else {
      content = createElement(ViewComponent, viewProps, childEls)
    }

    const shouldWrapTextAncestor = isWeb && isText && !hasTextAncestor
    if (shouldWrapTextAncestor) {
      // from react-native-web
      // @ts-ignore
      content = createElement(TextAncestorContext.Provider, { value: true }, content)
    }

    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        viewProps['debug'] = true
        console.log('🥚 props in:', props)
        console.log('🥚 props out:', viewProps)
        console.log(props.onClick?.toString())
        // prettier-ignore
        console.log('🥚 etc:', { shouldAttach, ViewComponent, viewProps, styles, pseudos, content, childEls })
        // only on browser because node expands it huge
        if (isWeb) {
          console.log('🥚 component info', { staticConfig, tamaguiConfig })
        }
      }
    }

    return (
      <>
        {features}
        {content}
      </>
    )
  })

  // Once configuration is run and all components are registered
  // get default props + className and analyze styles
  onConfiguredOnce((conf) => {
    tamaguiConfig = conf
    initialTheme = conf.themes[conf.defaultTheme || Object.keys(conf.themes)[0]]
    const next = getSplitStyles(staticConfig.defaultProps, staticConfig, initialTheme, true)
    if (isWeb) {
      if (next.classNames) {
        defaultsClassName += next.classNames + ' '
      }
      defaultsClassName += addStylesUsingClassname([next.style, next.pseudos])
    } else {
      if (!hasWarnedOnce) {
        hasWarnedOnce = true
        console.log('⚠️ we need to account for default styles for media queries')
      }
    }
    // @ts-ignore
    component.defaultProps = {
      ...next.viewProps,
      ...component.defaultProps,
    }
    if (process.env.NODE_ENV === 'development') {
      if (staticConfig.defaultProps?.debug) {
        console.log('tamagui debug component:', next, defaultsClassName, component.defaultProps)
      }
    }
  })

  component['staticConfig'] = {
    validStyles: validStyleProps,
    ...staticConfig,
  }

  const res = component as any as StaticComponent<A, void>

  // add extractable HoC
  res['extractable'] = (Component: any) => {
    Component['staticConfig'] = extendStaticConfig(res, {
      neverFlatten: true,
      defaultProps: Component.defaultProps,
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

    next.push(<Fragment key={key}>{isZStack ? <Absolute>{child}</Absolute> : child}</Fragment>)

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

// for now not so "tamagui-y"
const Absolute = ({ children }) => <View style={sheet.fullscreen}>{children}</View>
const sheet = StyleSheet.create({
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})
