import { stylePropsView } from '@snackui/helpers'
import React, {
  RefObject,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { combineRefs } from '../helpers/combineRefs'
import { StaticComponent } from '../helpers/extendStaticConfig'
import { spacedChildren } from '../helpers/spacedChildren'
import { ActiveThemeContext, invertStyleVariableToValue } from '../hooks/useTheme'
import { isTouchDevice, isWeb } from '../platform'
import { Spacing } from './Spacer'

export type StackProps = Omit<
  Omit<ViewStyle, 'display'> &
    Omit<ViewProps, 'display'> & {
      ref?: RefObject<View | HTMLElement> | ((node: View | HTMLElement) => any)
      animated?: boolean
      fullscreen?: boolean
      children?: any
      hoverStyle?: ViewStyle | null
      pressStyle?: ViewStyle | null
      // focusStyle?: ViewStyle | null
      onHoverIn?: (e: MouseEvent) => any
      onHoverOut?: (e: MouseEvent) => any
      onPress?: (e: GestureResponderEvent) => any
      onPressIn?: (e: GestureResponderEvent) => any
      onPressOut?: (e: GestureResponderEvent) => any
      spacing?: Spacing
      cursor?: string
      pointerEvents?: string
      userSelect?: string
      className?: string
      // stronger version of pointer-events: none;
      disabled?: boolean
      contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'paint' | string
      display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex'
    },
  // because who tf uses alignContent or backfaceVisibility
  'alignContent' | 'backfaceVisibility'
>

const fullscreenStyle: StackProps = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

const disabledStyle: StackProps = {
  pointerEvents: 'none',
  userSelect: 'none',
}

// somewhat optimized to avoid object creation
const useViewStylePropsSplit = (props: { [key: string]: any }) => {
  const activeTheme = useContext(ActiveThemeContext)
  const activeThemeInvert = invertStyleVariableToValue[activeTheme.name]

  return useMemo(() => {
    let styleProps: ViewStyle | null = null
    let viewProps: ViewProps | null = null
    for (const key in props) {
      const val = props[key]
      if (stylePropsView[key]) {
        styleProps = styleProps || {}
        styleProps[key] = activeThemeInvert?.[val] ?? val
      } else {
        viewProps = viewProps || {}
        viewProps[key] = props[key]
      }
    }
    if (styleProps) {
      fixNativeShadow(styleProps, true)
    }
    return [viewProps, styleProps] as const
  }, [props, activeTheme])
}

const mouseUps = new Set<Function>()

if (typeof document !== 'undefined') {
  document.addEventListener('mouseup', () => {
    mouseUps.forEach((x) => x())
    mouseUps.clear()
  })
}

const createStack = ({
  defaultProps,
  defaultStyle,
}: {
  defaultProps?: ViewStyle
  defaultStyle?: any
}) => {
  const sheet = StyleSheet.create({
    style: defaultStyle,
  })

  const component = forwardRef<View, StackProps>((props, ref) => {
    const {
      children,
      animated,
      fullscreen,
      pointerEvents,
      style = null,
      pressStyle = null,
      onPress,
      onPressIn,
      onPressOut,
      hoverStyle = null,
      // focusStyle, // TODO
      onHoverIn,
      onHoverOut,
      spacing,
      disabled,
      // @ts-ignore
      onMouseEnter,
      // @ts-ignore
      onMouseLeave,
    } = props

    const [viewProps, styleProps] = useViewStylePropsSplit(props)
    // hasEverHadEvents prevents repareting if you remove onPress or similar...
    const internal = useRef<{ isMounted: boolean; hasEverHadEvents?: boolean }>()
    if (!internal.current) {
      internal.current = {
        isMounted: true,
      }
    }

    useEffect(() => {
      return () => {
        mouseUps.delete(unPress)
        internal.current!.isMounted = false
      }
    }, [])

    const [state, set] = useState({
      hover: false,
      press: false,
      pressIn: false,
    })

    const ViewComponent = 'animated' in props ? Animated.View : View

    const styles = [
      sheet.style,
      fullscreen ? fullscreenStyle : null,
      style,
      styleProps,
      state.hover ? hoverStyle : null,
      state.press ? pressStyle : null,
      disabled ? disabledStyle : null,
    ]

    let content = (
      <ViewComponent
        ref={ref}
        {...viewProps}
        pointerEvents={!isWeb && pointerEvents === 'none' ? 'box-none' : pointerEvents}
        style={styles}
      >
        {spacedChildren({
          children,
          spacing,
          flexDirection: defaultStyle?.flexDirection,
        })}
      </ViewComponent>
    )

    const attachPress = !!(pressStyle || onPress || onPressOut || onPressIn)
    const attachHover =
      isWeb && !!(hoverStyle || onHoverIn || onHoverOut || onMouseEnter || onMouseLeave)

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
      set((x) => ({
        ...x,
        press: false,
        pressIn: false,
      }))
    }, [])

    if (shouldAttach || internal.current.hasEverHadEvents) {
      internal.current.hasEverHadEvents = true
      const events = {
        ...(!isTouchDevice && {
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
                    set({ ...state, ...next })
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
                    set({ ...state, ...next })
                  }
                  onHoverOut?.(e)
                  onMouseLeave?.(e)
                }
              : undefined,
        }),
        onMouseDown: attachPress
          ? (e) => {
              set({
                ...state,
                press: true,
                pressIn: true,
              })
              onPressIn?.(e)
            }
          : (onPressIn as any),
        onClick: attachPress
          ? (e) => {
              e.preventDefault()
              unPress()
              onPressOut?.(e)
              onPress?.(e)
            }
          : (onPressOut as any),
      }

      if (isWeb) {
        content = (
          <div {...events} className="display-contents">
            {content}
          </div>
        )
      } else {
        if (pointerEvents !== 'none' && !!(onPress || onPressOut || pressStyle)) {
          content = (
            <Pressable
              hitSlop={10}
              onPress={events.onClick}
              onPressOut={unPress}
              onPressIn={events.onMouseDown}
              style={
                styleProps
                  ? {
                      zIndex: styleProps.zIndex,
                      width: styleProps.width,
                      height: styleProps.height,
                      position: styleProps.position,
                    }
                  : null
              }
            >
              {content}
            </Pressable>
          )
        }
      }
    }

    return content
  })

  if (process.env.IS_STATIC) {
    // @ts-expect-error
    component.staticConfig = {
      validStyles: stylePropsView,
      defaultProps: {
        ...defaultProps,
        ...defaultStyle,
      },
      expansionProps: {
        fullscreen: fullscreenStyle,
        disabled: disabledStyle,
        ...(!isWeb && {
          shadowColor: fixNativeShadow,
        }),
        contain: ({ contain }) => ({
          contain,
        }),
      },
    }
  }

  return (component as any) as StaticComponent<StackProps>
}

const defaultShadowOffset = {
  width: 0,
  height: 0,
}

const matchRgba = /rgba\(\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*\)$/

// used by both expansion and inline, be careful
function fixNativeShadow(props: StackProps, merge = false) {
  let res = merge ? props : {}
  if ('shadowColor' in props) {
    res.shadowColor = props.shadowColor
    if (!('shadowOffset' in props)) {
      res.shadowOffset = defaultShadowOffset
    }
    if (!('shadowOpacity' in props)) {
      res.shadowOpacity = 1
      const color = String(res.shadowColor).trim()
      if (color[0] === 'r' && color[3] === 'a') {
        const [_, r, g, b, a] = color.match(matchRgba) ?? []
        if (typeof a !== 'string') {
          console.warn('non valid rgba', color)
          return props
        }
        res.shadowColor = `rgb(${r},${g},${b})`
        res.shadowOpacity = +a
      } else {
        res.shadowOpacity = 1
      }
    }
  }
  return res
}

export const AbsoluteVStack = createStack({
  defaultStyle: {
    position: 'absolute',
    flexDirection: 'column',
    flexBasis: 'auto',
    display: 'flex',
  },
})

export const HStack = createStack({
  defaultStyle: {
    flexDirection: 'row',
    flexBasis: 'auto',
    display: 'flex',
  },
})

export const VStack = createStack({
  defaultStyle: {
    flexDirection: 'column',
    flexBasis: 'auto',
    display: 'flex',
  },
})
