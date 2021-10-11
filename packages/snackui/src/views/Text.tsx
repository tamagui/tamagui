import { TextProps as ReactTextProps, TextStyle } from 'react-native'

import { validStylesText, webOnlySpecificStyleKeys } from '../constants'
import { createComponent } from '../createComponent'
import { PropMapper } from '../helpers/PropMapper'
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

export const textPropMapper: PropMapper = (key: string, val: any) {
  if (!isWeb && key in webOnlySpecificStyleKeys) {
    return false
  }
  if (key === 'ellipse') {
    if (process.env.TARGET === 'native') {
      return [[key, ellipsePropsNative]]
    } else {
      return [[key, ellipseStyle]]
    }
  }
  if (validStylesText[key]) {
    if (!isWeb) {
      if (val === 'inherit') {
        return false
      }
      if (webOnlyStyleKeys[key] || webOnlyProps[key]) {
        return false
      }
    }
    // expansions
    if (key === 'selectable') {
      return [[key, selectableStyle]]
    }
    if (key === 'ellipse') {
      return [[key, ellipseStyle]]
    }
    return true
  }
  return false
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
  preProcessProps(props: TextProps) {
    props.className = 'snack-text' + (props.className ? ` ${props.className}` : '')
    return props
  },
  propMapper: textPropMapper,
  // postProcessStyles,
  validPropsExtra: {
    ellipse: true,
  },
  validStyles: validStylesText,
})

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
