import type { SizeTokens } from '@tamagui/core'
import React from 'react'

import type { TextParentStyles } from './types'

type Props = TextParentStyles & {
  children?: React.ReactNode
  size?: SizeTokens
}

export function wrapStringChildrenInText(
  TextComponent: any,
  {
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
  }: Props
) {
  if (noTextWrap || !children) {
    return children
  }

  // in the case of using variables, like so:
  // <ListItem>Hello, {name}</ListItem>
  // it gives us props.children as ['Hello, ', 'name']
  // but we don't want to wrap multiple SizableText around each part
  // so we group them
  let allChildren = React.Children.toArray(children)
  let nextChildren: any[] = []
  let lastIsString = false
  const directTextProps: any = {}
  // to avoid setting undefined
  if (color) directTextProps.color = color
  if (fontFamily) directTextProps.fontFamily = fontFamily
  if (fontSize) directTextProps.fontSize = fontSize
  if (fontWeight) directTextProps.fontWeight = fontWeight
  if (letterSpacing) directTextProps.letterSpacing = letterSpacing
  if (textAlign) directTextProps.textAlign = textAlign

  function concatStringChildren() {
    if (!lastIsString) return
    const index = nextChildren.length - 1
    const childrenStrings = nextChildren[index]
    nextChildren[index] = (
      <TextComponent key={index} {...directTextProps} size={size} {...textProps}>
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
