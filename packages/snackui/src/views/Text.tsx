import { stylePropsTextOnly } from '@snackui/helpers'
import { TextProps as ReactTextProps, TextStyle } from 'react-native'

import { validStylesText, webOnlySpecificStyleKeys } from '../constants'
import { createComponent } from '../createComponent'
import { isWeb } from '../platform'
import { TransformStyleProps } from '../StackProps'

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
    debug?: boolean
  }

export const Text = createComponent<TextProps>({
  isText: true,
  defaultProps: isWeb
    ? {
        // inline-block fixed transforms not working on web
        // but inline is necessary for text nesting (italic, bold etc)
        display: 'inline' as any,
      }
    : {},
  deoptProps: new Set(isWeb ? [''] : ['ellipse']),
  preProcessProps,
  postProcessStyles,
  validPropsExtra: {
    ellipse: true,
  },
  validStyles: validStylesText,
})

function preProcessProps(props: TextProps) {
  return {
    ...props,
    ...(props.ellipse
      ? process.env.TARGET === 'native'
        ? ellipsePropsNative
        : ellipseStyle
      : null),
    className: 'snack-text' + (props.className ? ` ${props.className}` : ''),
  }
}

const webOnlyProps = {
  className: true,
}

const webOnlyStyleKeys = {
  hoverStyle: true,
  pressStyle: true,
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

function postProcessStyles(allProps: TextProps): TextStyle {
  return useTextProps(allProps)[1]
}

export function useTextProps(allProps: TextProps, textOnly = false): [TextProps, TextStyle] {
  const validStyles = textOnly ? stylePropsTextOnly : validStylesText
  let props: TextProps = {}
  let style: TextStyle = {}
  for (const key in allProps) {
    if (!isWeb && key in webOnlySpecificStyleKeys) {
      continue
    }
    const val = allProps[key]
    if (validStyles[key]) {
      if (!isWeb) {
        if (val === 'inherit') {
          continue
        }
        if (webOnlyStyleKeys[key] || webOnlyProps[key]) {
          continue
        }
      }
      // expansions
      if (key === 'selectable') {
        Object.assign(style, selectableStyle)
        continue
      }
      if (key === 'ellipse') {
        Object.assign(style, ellipseStyle)
        continue
      }
      style[key] = val
      continue
    }
    props[key] = val
  }
  if (process.env.NODE_ENV === 'development') {
    if (allProps['debug']) {
      console.log('Text.debug', { allProps, props, style })
    }
  }
  return [props, style]
}
