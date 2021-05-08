import { stylePropsText, stylePropsTextOnly, stylePropsTransform } from '@snackui/helpers'
import React, { memo, useMemo } from 'react'
import { Text as ReactText, TextProps as ReactTextProps, TextStyle } from 'react-native'

import { isWeb } from '../platform'
import { TransformStyleProps, mergeTransform } from './Stacks'

// TODO merge this with stacks and just make it a stack basically that renders to a Text ultimately,
// should save a lot of code overhead and bugs, and fix pseudo styles

type EnhancedTextStyle = Omit<TextStyle, 'display' | 'backfaceVisibility'> & TransformStyleProps

export type TextProps = Omit<ReactTextProps, 'style'> &
  EnhancedTextStyle & {
    hoverStyle?: EnhancedTextStyle | null
    pressStyle?: EnhancedTextStyle | null
    focusStyle?: EnhancedTextStyle | null
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
  if (process.env.NODE_ENV === 'development') {
    if (props['debug']) {
      console.log(' 🍑 debug:\n  allProps', allProps, '\n  propsStyle', props['style'], '\n  style', JSON.stringify(style))
    }
  }
  return <ReactText {...props} style={[isWeb ? defaultStyle : null, props['style'], style]} />
})

const webOnlySpecificStyleKeys = {
  userSelect: true,
  textOverflow: true,
  whiteSpace: true,
  wordWrap: true,
  selectable: true,
  cursor: true,
}

const webOnlyProps = {
  className: true,
}

const webOnlyStyleKeys = {
  hoverStyle: true,
  pressStyle: true,
}

const styleProps = {
  all: {
    ...stylePropsText,
    ...(isWeb && {
      ...webOnlyStyleKeys,
      ...webOnlySpecificStyleKeys,
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
  let props: TextProps = {}
  let style: TextStyle = {}
  for (const key in allProps) {
    if (!isWeb && key in webOnlySpecificStyleKeys) {
      continue
    }
    if (key in styleKeys) {
      if (key === 'style') {
        continue
      }
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
          Object.assign(props, ellipsePropsNative)
          continue
        }
        if (webOnlyStyleKeys[key] || webOnlyProps[key]) {
          continue
        }
      }
      if (key in stylePropsTransform) {
        mergeTransform(style, key, val)
        continue
      }
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
      props[key] = allProps[key]
    }
  }
  return [props, style]
}

if (process.env.IS_STATIC) {
  // @ts-ignore
  Text.staticConfig = {
    isText: true,
    postProcessStyles: (styles) => getTextStyle(styles, styleProps.all)[1],
    validStyles: {
      ...stylePropsText,
      ...webOnlySpecificStyleKeys,
    },
    defaultProps: defaultStyle,
    expansionProps: {
      selectable: selectableStyle,
      ellipse: getEllipse,
    },
  }
}
