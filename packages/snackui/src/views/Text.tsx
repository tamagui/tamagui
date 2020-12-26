import { stylePropsText, stylePropsTextOnly } from '@snackui/helpers'
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

const defaultStyle: TextStyle = {
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
  return (
    <ReactText
      {...props}
      style={[isWeb ? defaultStyle : null, style, props['style']]}
    />
  )
}

if (process.env.IS_STATIC) {
  Text.staticConfig = {
    isText: true,
    validStyles: stylePropsText,
    defaultProps: defaultStyle,
    expansionProps: {
      selectable: selectableStyle,
      ellipse: ellipseStyle,
    },
  }
}

const isWeb = Platform.OS === 'web'

const webOnlySpecificStyleKeys = {
  userSelect: true,
  textOverflow: true,
  whiteSpace: true,
  wordWrap: true,
  selectable: true,
}

const webOnlyProps = {
  className: true,
}

const webOnlyStyleKeys = {
  hoverStyle: true,
  pressStyle: true,
  cursor: true,
}

const textSpecificProps = {
  allowFontScaling: true,
  ellipsizeMode: true,
  lineBreakMode: true,
  numberOfLines: true,
  maxFontSizeMultiplier: true,
}

const testProps = {
  all: {
    ...textSpecificProps,
    ...stylePropsText,
    ...webOnlySpecificStyleKeys,
    ...webOnlyStyleKeys,
  },
  specific: {
    ...webOnlyStyleKeys,
    ...webOnlySpecificStyleKeys,
    ...textSpecificProps,
    ...stylePropsTextOnly,
  },
}

export const useTextStyle = (
  allProps: TextProps,
  onlyTextSpecificStyle?: boolean
) => {
  return useMemo(() => {
    const props: TextProps = {}
    const style: TextStyle = {}
    const test = onlyTextSpecificStyle ? testProps.specific : testProps.all
    for (const key in allProps) {
      if (!isWeb) {
        if (key === 'ellipse') {
          props['numberOfLines'] = 1
          props['lineBreakMode'] = 'clip'
          continue
        }
        if (webOnlyStyleKeys[key] || webOnlyProps[key]) {
          continue
        }
      }
      const val = allProps[key]
      if (test[key]) {
        if (key === 'selectable') {
          Object.assign(style, selectableStyle as any)
          continue
        }
        if (key === 'ellipse') {
          Object.assign(style, ellipseStyle as any)
          continue
        }
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
      } else {
        props[key] = val
      }
    }
    return [props, style] as const
  }, [allProps])
}
