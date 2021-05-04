import { stylePropsText, stylePropsTextOnly } from '@snackui/helpers'
import React, { memo, useMemo, useRef } from 'react'
import { Platform, Text as ReactText, TextProps as ReactTextProps, TextStyle } from 'react-native'

export type TextProps = Omit<ReactTextProps, 'style'> &
  Omit<TextStyle, 'display' | 'backfaceVisibility'> & {
    hoverStyle?: TextStyle | null
    pressStyle?: TextStyle | null
    focusStyle?: TextStyle | null
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
  // inline-block fixed transforms not working on web
  // but inline is necessary for text nesting (italic, bold etc)
  display: 'inline' as any,
  // color: 'var(--color)',
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

const ellipsePropsNative = {
  numberOfLines: 1,
  lineBreakMode: 'clip',
}

const getEllipse = (props: TextProps) => {
  return process.env.TARGET === 'native' ? ellipsePropsNative : ellipseStyle
}

export const Text = memo((allProps: TextProps) => {
  const [props, style] = useTextStyle(allProps, false, true)
  return <ReactText {...props} style={[isWeb ? defaultStyle : null, style, props['style']]} />
})


if (process.env.IS_STATIC) {
  // @ts-ignore
  Text.staticConfig = {
    isText: true,
    validStyles: stylePropsText,
    defaultProps: defaultStyle,
    expansionProps: {
      selectable: selectableStyle,
      ellipse: getEllipse,
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

const styleProps = {
  all: {
    ...stylePropsText,
    ...(isWeb && {
      ...webOnlySpecificStyleKeys,
      ...webOnlyStyleKeys,
    }),
  },
  specific: {
    ...(isWeb && {
      ...webOnlyStyleKeys,
      ...webOnlySpecificStyleKeys,
    }),
    ...stylePropsTextOnly,
  },
}

const emptyObj = Object.freeze({})

export const useTextStyle = (
  allProps: TextProps,
  onlyTextSpecificStyle?: boolean,
  memo?: boolean
) => {
  const styleKeys = onlyTextSpecificStyle ? styleProps.specific : styleProps.all
  if (memo) {
    return useMemo(() => getTextStyle(allProps, styleKeys), [allProps])
  }
  return getTextStyle(allProps, styleKeys)
}

// somewhat optimized to avoid creating objects unless necessary

const getTextStyle = (allProps: TextProps, styleKeys: Object): [TextProps, TextStyle] => {
  let props: TextProps | null = null
  let style: TextStyle | null = null

  for (const key in allProps) {
    if (!isWeb && key in webOnlySpecificStyleKeys) {
      continue
    }
    if (key in styleKeys) {
      const val = allProps[key]
      // if should skip
      if (isWeb) {
        if (key === 'display' && val === 'inline') {
          continue
        }
      } else {
        if (val === 'inherit') {
          continue
        }
        if (key === 'ellipse') {
          props = props || {}
          Object.assign(props, ellipsePropsNative)
          continue
        }
        if (webOnlyStyleKeys[key] || webOnlyProps[key]) {
          continue
        }
      }
      style = style || {}
      // style values
      if (key === 'selectable') {
        Object.assign(style, selectableStyle)
        continue
      }
      if (key === 'ellipse') {
        Object.assign(style, ellipseStyle)
        continue
      }
      if (!isWeb) {
        if (key === 'fontSize' && val < 12) {
          style.fontSize = 12
          continue
        }
      }
      style[key] = val
    } else {
      props = props || {}
      props[key] = allProps[key]
    }
  }

  return [props || emptyObj, style || emptyObj] as any
}
