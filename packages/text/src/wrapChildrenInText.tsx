import type { SizeTokens } from '@tamagui/core'
import React from 'react'

import { TextParentStyles } from './types'

type Props = TextParentStyles & {
  children?: React.ReactNode
  size?: SizeTokens
}

export function wrapChildrenInText(TextComponent: any, propsIn: Props) {
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
  } = propsIn

  if (noTextWrap || !children) {
    return children
  }

  // in the case of using variables, like so:
  // <ListItem>Hello, {name}</ListItem>
  // it gives us props.children as ['Hello, ', 'name']
  // but we don't want to wrap multiple SizableText around each part
  // so we group them
  const allChildren = React.Children.toArray(children)
  const nextChildren: any[] = []
  let lastIsString = false
  const props: any = {}
  // to avoid setting undefined
  if (color) props.color = color
  if (fontFamily) props.fontFamily = fontFamily
  if (fontSize) props.fontSize = fontSize
  if (fontWeight) props.fontWeight = fontWeight
  if (letterSpacing) props.letterSpacing = letterSpacing
  if (textAlign) props.textAlign = textAlign
  if (size) props.size = size

  function concatStringChildren() {
    if (!lastIsString) return
    const index = nextChildren.length - 1
    const childrenStrings = nextChildren[index]
    nextChildren[index] = (
      <TextComponent key={index} {...props} {...textProps}>
        {childrenStrings}
      </TextComponent>
    )
  }

  for (const child of allChildren) {
    const last = nextChildren[nextChildren.length - 1]
    const isString = typeof child === 'string'
    if (isString) {
      if (lastIsString) {
        last.push(child)
      } else {
        nextChildren.push([child])
      }
    } else {
      concatStringChildren()
      nextChildren.push(child)
    }
    lastIsString = isString
  }
  concatStringChildren()

  return nextChildren
}
