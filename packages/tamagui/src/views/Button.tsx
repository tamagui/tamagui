import { TextProps, ThemeableProps, Variable, getTokens, themeable, useTheme } from '@tamagui/core'
import React, { forwardRef, isValidElement } from 'react'

import { InteractiveFrame, InteractiveFrameProps } from './InteractiveFrame'
import { SizableText } from './SizableText'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

type IconProp = JSX.Element | ((props: { color?: string; size?: number }) => JSX.Element) | null

export type ButtonProps = InteractiveFrameProps &
  ThemeableProps & {
    textProps?: Omit<TextProps, 'children'>
    noTextWrap?: boolean
    icon?: IconProp
    iconAfter?: IconProp
  }

export const Button = InteractiveFrame.extractable(
  themeable(
    forwardRef((props: ButtonProps, ref) => {
      const {
        children,
        icon,
        iconAfter,
        space,
        textProps,
        noTextWrap,
        theme: themeName,
        size,
        ...rest
      } = props
      const theme = useTheme()
      const addTheme = (el: any) => {
        return isValidElement(el)
          ? el
          : !!el
          ? React.createElement(el, {
              color: theme.color2,
              size: getIconSize(size, -1),
            })
          : null
      }
      const themedIcon = icon ? addTheme(icon) : null
      const themedIconAfter = iconAfter ? addTheme(iconAfter) : null

      return (
        <InteractiveFrame
          size={size}
          space={space ?? getSpaceSize(size, -3)}
          ref={ref as any}
          {...rest}
        >
          {themedIcon}
          {noTextWrap ? (
            children
          ) : !children ? null : textProps ? (
            // flex shrink = 1, flex grow = 0 makes buttons shrink properly in native
            <SizableText
              color="$color2"
              flexGrow={0}
              flexShrink={1}
              ellipse
              size={size}
              {...textProps}
            >
              {children}
            </SizableText>
          ) : (
            <SizableText size={size} color="$color2" flexGrow={0} flexShrink={1} ellipse>
              {children}
            </SizableText>
          )}
          {themedIconAfter}
        </InteractiveFrame>
      )
    })
  )
)

export const getSpaceSize = (size: any, sizeUpOrDownBy = 0) => {
  const sizes = getTokens().size
  const sizeNames = Object.keys(sizes)
  const sizeDown =
    sizes[sizeNames[Math.max(0, sizeNames.indexOf(size || '$4') + sizeUpOrDownBy)]] || '$4'
  return sizeDown
}

export const getIconSize = (size: any = '$4', sizeUpOrDownBy = 0) => {
  const tokens = getTokens()
  const fonts = Object.keys(tokens.font)
  const fontSize = (tokens.font.body || tokens.font[fonts[0]]).size
  let res: Variable | number | null = null
  if (sizeUpOrDownBy === 0) {
    res = fontSize[size]
  } else {
    const fontSizeNames = Object.keys(fontSize)
    const nameIndex = Math.max(1, fontSizeNames.indexOf(size) + sizeUpOrDownBy)
    const sizedName = fontSizeNames[nameIndex]
    res = fontSize[sizedName] ?? 16
  }
  if (res instanceof Variable) {
    return res.val
  }
  return res
}
