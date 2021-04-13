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

const emptyObj = Object.freeze({})

export const useTextStyle = (
  allProps: TextProps,
  onlyTextSpecificStyle?: boolean,
  memo?: boolean
) => {
  const styleKeys = onlyTextSpecificStyle ? testProps.specific : testProps.all
  if (memo) {
    return useMemo(() => getTextStyle(allProps, styleKeys), [allProps])
  }
  return getTextStyle(allProps, styleKeys)
}

// somewhat optimized to avoid creating objects unless necessary

const getTextStyle = (allProps: TextProps, styleKeys: Object) => {
  let props: TextProps | null = null
  let style: TextStyle | null = null

  for (const key in allProps) {
    if (styleKeys[key]) {
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
          props['numberOfLines'] = 1
          props['lineBreakMode'] = 'clip'
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
    }
  }

  if (style) {
    props = props || {}
    for (const key in allProps) {
      if (key in style) continue
      props[key] = allProps[key]
    }
  }

  return [props || allProps, style || emptyObj] as const
}
