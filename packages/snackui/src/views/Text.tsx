import { stylePropsTextOnly, validStyles } from '@snackui/helpers'
import { TextProps as ReactTextProps, TextStyle } from 'react-native'

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
  }

const webOnlySpecificStyleKeys = {
  userSelect: true,
  textOverflow: true,
  whiteSpace: true,
  wordWrap: true,
  selectable: true,
  cursor: true,
}

const validStylesText = {
  ...validStyles,
  ...stylePropsTextOnly,
  ...(isWeb && {
    ...webOnlySpecificStyleKeys,
  }),
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

function preProcessProps(props: any) {
  if (props.ellipse) {
    return {
      ...props,
      ...(process.env.TARGET === 'native' ? ellipsePropsNative : ellipseStyle),
    }
  }
  return props
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
  const res = useTextProps(allProps)[1]
  return res
}

export function useTextProps(allProps: TextProps, textOnly = false): [TextProps, TextStyle] {
  const validProps = textOnly ? stylePropsTextOnly : validStylesText
  let props: TextProps = {}
  let style: TextStyle = {}
  for (const key in allProps) {
    if (!isWeb && key in webOnlySpecificStyleKeys) {
      continue
    }
    const val = allProps[key]
    if (validProps[key]) {
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
  return [props, style]
}
