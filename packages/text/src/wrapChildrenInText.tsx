import type { SizeTokens } from '@tamagui/web'
import React from 'react'

import type { TextParentStyles } from './types'

type Props = TextParentStyles & {
  children?: React.ReactNode
  size?: SizeTokens
}

export function wrapChildrenInText(
  TextComponent: any,
  propsIn: Props & {
    unstyled?: boolean
  },
  extraProps?: Record<string, any>
) {
  const {
    children,
    textProps,
    size,
    noTextWrap,
    color,
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    textAlign,
    fontStyle,
    maxFontSizeMultiplier,
  } = propsIn

  if (noTextWrap || !children) {
    return [children]
  }

  const props = {
    ...extraProps,
  }

  // to avoid setting undefined
  if (color) props.color = color
  if (fontFamily) props.fontFamily = fontFamily
  if (fontSize) props.fontSize = fontSize
  if (fontWeight) props.fontWeight = fontWeight
  if (letterSpacing) props.letterSpacing = letterSpacing
  if (textAlign) props.textAlign = textAlign
  if (size) props.size = size
  if (fontStyle) props.fontStyle = fontStyle
  if (maxFontSizeMultiplier) props.maxFontSizeMultiplier = maxFontSizeMultiplier

  return React.Children.toArray(children).map((child, index) => {
    return typeof child === 'string' ? (
      // so "data-disable-theme" is a hack to fix themeInverse, don't ask me why
      <TextComponent key={index} {...props} {...textProps}>
        {child}
      </TextComponent>
    ) : (
      child
    )
  })
}
