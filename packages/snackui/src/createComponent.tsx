import { stylePropsTransform, stylePropsView, validStyles } from '@snackui/helpers'
import React, {
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
  Pressable,
  Text as ReactText,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { StaticComponent } from './helpers/extendStaticConfig'
import { spacedChildren } from './helpers/spacedChildren'
import { StaticConfig } from './helpers/StaticConfig'
import { ThemeManagerContext, invertStyleVariableToValue } from './hooks/useTheme'
import { isTouchDevice, isWeb } from './platform'
import { StackProps } from './StackProps'

const displayContentsStyle = { display: 'contents' }

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

const mapTransformKeys = {
  x: 'translateX',
  y: 'translateY',
}

const mergeTransform = (obj: ViewStyle, key: string, val: any) => {
  const transform = obj.transform
    ? Array.isArray(obj.transform)
      ? obj.transform
      : [obj.transform]
    : []
  // @ts-expect-error
  transform.push({ [mapTransformKeys[key] || key]: val })
  obj.transform = transform
}

const mouseUps = new Set<Function>()

if (typeof document !== 'undefined') {
  document.addEventListener('mouseup', () => {
    mouseUps.forEach((x) => x())
    mouseUps.clear()
  })
}

export function createComponent<A extends any = StackProps>(componentProps: Partial<StaticConfig>) {
  const sheet = StyleSheet.create({
    defaultStyle: componentProps.defaultProps,
  })

  const validStyleProps = componentProps.validStyles ?? stylePropsView

  const getSplitStyles = (
    props: { [key: string]: any },
    // convert from var to theme value
    varToVal?: (key: string) => string
  ) => {
    let psuedos: { hoverStyle?: ViewStyle; pressStyle?: ViewStyle } | null = null
    let viewProps: ViewProps = {}
    let style: any[] = []
    let cur: ViewStyle | null = null
    for (const key in props) {
      let val = props[key]
      if (key === 'style' || (key[0] === '_' && key.startsWith('_style'))) {
        if (cur) {
          // process last
          fixNativeShadow(cur, true)
          style.push(cur)
          cur = null
        }
        style.push(val)
        continue
      }
      if (key === 'fullscreen') {
        cur = cur || {}
        Object.assign(cur, fullscreenStyle)
        continue
      }
      // is style
      const isPseudo = key === 'hoverStyle' || key === 'pressStyle' || key === 'focusStyle'
      if (validStyleProps[key] || isPseudo) {
        if (!isPseudo) {
          // apply theme
          val = varToVal?.(val) ?? val
          // transforms
          if (key in stylePropsTransform) {
            cur = cur || {}
            mergeTransform(cur, key, val)
            continue
          }
        }
        if (isPseudo && val) {
          psuedos = psuedos || {}
          const pseudoStyle: ViewStyle = {}
          for (const subKey in val) {
            const sval = varToVal?.(val[subKey]) ?? val[subKey]
            if (subKey in stylePropsTransform) {
              mergeTransform(pseudoStyle, subKey, sval)
              continue
            } else {
              pseudoStyle[subKey] = sval
            }
          }
          fixNativeShadow(pseudoStyle, true)
          psuedos[key] = pseudoStyle
          continue
        }
        cur = cur || {}
        cur[key] = val
        continue
      }
      // if no match, prop
      viewProps[key] = val
    }
    // push last style
    if (cur) {
      fixNativeShadow(cur, true)
      style.push(cur)
    }
    // if (process.env.NODE_ENV === 'development') {
    //   if (props['debug']) {
    //     try {
    //       console.log(' processed styles:', JSON.stringify({ props, viewProps, style }, null, 2))
    //     } catch {
    //       console.log(' processed styles:', { props, viewProps, style })
    //     }
    //   }
    // }
    return {
      viewProps,
      style,
      psuedos,
    }
  }

  const component = forwardRef<View, A>((props: StackProps, ref) => {
    const {
      animated,
      children,
      pointerEvents,
      onPress,
      onPressIn,
      onPressOut,
      onHoverIn,
      onHoverOut,
      spacing,
      disabled,
      // @ts-ignore
      onMouseEnter,
      // @ts-ignore
      onMouseLeave,
    } = props
    const manager = useContext(ThemeManagerContext)
    const [state, set] = useState(() => ({
      hover: false,
      press: false,
      pressIn: false,
      theme: manager.name,
    }))

    const isTracking = useRef(false)
    const varToVal = useCallback(
      (variable: string) => {
        isTracking.current = true
        const invert = invertStyleVariableToValue[state.theme || 'light']
        return invert?.[variable]
      },
      [state.theme]
    )

    const { viewProps, psuedos, style } = useMemo(() => {
      return getSplitStyles(
        componentProps.preProcessProps ? componentProps.preProcessProps(props) : props,
        varToVal
      )
    }, [props])

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
          set((x) => ({ ...x, theme: name }))
        }
      })
      return () => {
        dispose()
        mouseUps.delete(unPress)
        isTracking.current = false
        internal.current!.isMounted = false
      }
    }, [manager])

    const ViewComponent = componentProps.isText
      ? animated
        ? Animated.Text
        : ReactText
      : animated
      ? Animated.View
      : View

    const styles = [
      sheet.defaultStyle,
      style,
      psuedos && state.hover ? psuedos.hoverStyle || null : null,
      psuedos && state.press ? psuedos.pressStyle || null : null,
      disabled ? disabledStyle : null,
    ]

    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        console.log(' 🍑 debug\n  🔵 props: ', props, '\n  🔵 styles: ', styles)
      }
    }

    let content = (
      // @ts-ignore
      <ViewComponent
        ref={ref}
        {...viewProps}
        pointerEvents={!isWeb && pointerEvents === 'none' ? 'box-none' : pointerEvents}
        style={styles}
      >
        {spacedChildren({
          children,
          spacing,
          flexDirection: componentProps.defaultProps?.flexDirection,
        })}
      </ViewComponent>
    )

    const attachPress = !!((psuedos && psuedos.pressStyle) || onPress || onPressOut || onPressIn)
    const attachHover =
      isWeb &&
      !!((psuedos && psuedos.hoverStyle) || onHoverIn || onHoverOut || onMouseEnter || onMouseLeave)

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
        if (shouldAttach || internal.current.hasEverHadEvents) {
          content = (
            <div {...events} style={displayContentsStyle}>
              {content}
            </div>
          )
        }
      } else {
        if (pointerEvents !== 'none' && !!(onPress || onPressOut || psuedos?.pressStyle)) {
          content = (
            <Pressable
              hitSlop={10}
              onPress={events.onClick}
              onPressOut={unPress}
              onPressIn={events.onMouseDown}
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
    const config: StaticConfig = {
      validStyles,
      ...componentProps,
      postProcessStyles: (inStyles) => {
        const { style, psuedos } = getSplitStyles(inStyles)
        const next = {
          ...style.reduce((acc, value) => {
            Object.assign(acc, value)
            return acc
          }, {}),
          ...psuedos,
        }
        if (componentProps.postProcessStyles) {
          return componentProps.postProcessStyles(next)
        }
        return next
      },
      validPropsExtra: {
        ...componentProps.validPropsExtra,
        disabled: true,
        fullscreen: true,
      },
    }
    component['staticConfig'] = config
  }

  return (component as any) as StaticComponent<A>
}

const defaultShadowOffset = {
  width: 0,
  height: 0,
}

const matchRgba = /rgba\(\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*\)$/

// used by both expansion and inline, be careful
function fixNativeShadow(props: StackProps, merge = false) {
  let res = merge ? props : {}
  if (props.shadowColor) {
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
