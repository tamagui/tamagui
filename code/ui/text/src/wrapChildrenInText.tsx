import type { SizeTokens } from '@tamagui/web'
import React from 'react'

import type { TextParentStyles } from './types'

type Props = TextParentStyles & {
  children?: React.ReactNode
  size?: SizeTokens | true
}

export function wrapChildrenInText(
  TextComponent: any,
  propsIn: Props & {},
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
    ellipsis,
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
  if (ellipsis !== undefined) props.ellipsis = ellipsis
  if (maxFontSizeMultiplier != null) props.maxFontSizeMultiplier = maxFontSizeMultiplier

  // adjacent text children are joined into ONE TextComponent. `<Button>hi {name}</Button>`
  // is two children ('hi ', name), and wrapping each separately renders them as sibling
  // text nodes: they lay out with a gap, ellipsis/wrapping applies per fragment instead of
  // to the whole string, and assistive tech (plus native test matchers) sees fragments
  // rather than one label. Numbers count as text too — leaving them unwrapped throws
  // "Text strings must be rendered within a <Text>" on native.
  const out: React.ReactNode[] = []
  let run: (string | number)[] = []
  let runKey = 0

  const flushRun = () => {
    if (!run.length) return
    out.push(
      // data-disable-theme keeps wrapped text from adding another theme boundary
      <TextComponent key={`text-${runKey}`} {...props} {...textProps}>
        {run.length === 1 ? run[0] : run.join('')}
      </TextComponent>
    )
    run = []
  }

  React.Children.toArray(children).forEach((child, index) => {
    if (typeof child === 'string' || typeof child === 'number') {
      if (!run.length) runKey = index
      run.push(child)
      return
    }
    flushRun()
    out.push(child)
  })
  flushRun()

  return out
}
