import React, { useMemo, useRef } from 'react'
import {
  Platform,
  Text as ReactText,
  TextProps as ReactTextProps,
  TextStyle,
} from 'react-native'

export type TextProps = Omit<ReactTextProps, 'style'> &
  Omit<TextStyle, 'display' | 'backfaceVisibility'> & {
    display?: TextStyle['display'] | 'inherit'
    ellipse?: boolean
    selectable?: boolean
    children?: any
    className?: string
    pointerEvents?: string
    cursor?: string
    userSelect?: string
  }

const defaultProps: TextStyle = {
  // fixes transforms not working on web
  display: 'inline-block' as any,
}

const selectableStyle = {
  userSelect: 'text',
}

const ellipseStyle = {
  display: 'inline-block',
  maxWidth: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export const Text = (allProps: TextProps) => {
  const [props, style] = useTextStyle(allProps)
  const textRef = useRef(null)
  return <ReactText ref={textRef} {...props} style={[style, props['style']]} />
}

if (process.env.IS_STATIC) {
  Text.staticConfig = {
    validStyles: require('../styleProps').stylePropsText,
    defaultProps,
    expansionProps: {
      selectable: selectableStyle,
      ellipse: ellipseStyle,
    },
  }
}

const textNonStylePropReg = /^(allow.*|on[A-Z].*|.*[Mm]ode)/
const isWeb = Platform.OS === 'web'
const webOnlyStyleKeys = {
  userSelect: true,
  hoverStyle: true,
  pressStyle: true,
  className: true,
  textOverflow: true,
  whiteSpace: true,
  wordWrap: true,
  cursor: true,
  selectable: true,
  size: true,
}

const useTextStyle = (allProps: TextProps) => {
  return useMemo(() => {
    const props: ReactTextProps = {}
    const style: TextStyle = isWeb
      ? {
          ...defaultProps,
        }
      : {}
    for (const key in allProps) {
      if (!isWeb) {
        if (key === 'ellipse') {
          props['numberOfLines'] = 1
          props['lineBreakMode'] = 'clip'
          continue
        }
        if (webOnlyStyleKeys[key]) {
          continue
        }
      }
      const val = allProps[key]
      if (val === undefined) continue
      if (val) {
        if (key === 'selectable') {
          Object.assign(style, selectableStyle as any)
          continue
        }
        if (key === 'ellipse') {
          Object.assign(style, ellipseStyle as any)
          continue
        }
      }
      const isProp = textNonStyleProps[key] ?? textNonStylePropReg.test(key)
      if (isProp) {
        props[key] = val
      } else {
        if (!isWeb) {
          if (key === 'display' && val === 'inline') {
            continue
          }
          if (val === 'inherit') {
            continue
          }
          if (key === 'fontSize' && val < 12) {
            style.fontSize = 12
            continue
          }
        }
        style[key] = val
      }
    }
    return [props, style]
  }, [allProps])
}

const textNonStyleProps = {
  href: true,
  className: true,
  allowFontScaling: true,
  ellipsizeMode: true,
  lineBreakMode: true,
  numberOfLines: true,
  onLayout: true,
  onPress: true,
  onLongPress: true,
  style: true,
  children: true,
  testID: true,
  nativeID: true,
  maxFontSizeMultiplier: true,
}
