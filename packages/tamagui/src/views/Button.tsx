import { TextProps, ThemeableProps, getTokens, themeable, useTheme } from '@tamagui/core'
import React, { forwardRef, isValidElement } from 'react'

import { InteractiveFrame, InteractiveFrameProps } from './InteractiveFrame'
import { SizableText } from './SizableText'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type ButtonProps = InteractiveFrameProps &
  ThemeableProps & {
    textProps?: Omit<TextProps, 'children'>
    noTextWrap?: boolean
    icon?: JSX.Element | null
    iconAfter?: JSX.Element | null

    /* don't toggle this either always on or not */
    themeIcon?: boolean
  }

export const Button = InteractiveFrame.extractable(
  themeable(
    forwardRef(
      (
        {
          children,
          icon,
          iconAfter,
          space,
          textProps,
          noTextWrap,
          elevation,
          theme: themeName,
          size,
          themeIcon,
          ...props
        }: ButtonProps,
        ref
      ) => {
        const theme = themeIcon ? useTheme() : null
        const addTheme = (el: any) =>
          isValidElement(el)
            ? el
            : !!el
            ? React.createElement(
                el,
                theme ? { color: theme.color2, size: getIconSize(size, -1) } : {}
              )
            : null
        const themedIcon = icon ? addTheme(icon) : null
        const themedIconAfter = iconAfter ? addTheme(iconAfter) : null

        return (
          <InteractiveFrame
            size={size}
            space={
              space ??
              // TODO make helper fn
              (() => {
                // size down 2
                const sizes = getTokens().size
                const sizeNames = Object.keys(sizes)
                const sizeDown =
                  sizes[sizeNames[Math.max(0, sizeNames.indexOf(size || '$4') - 3)]] || '$4'
                return sizeDown
              })()
            }
            ref={ref as any}
            {...props}
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
      }
    )
  )
)

const getIconSize = (size: any = '$4', sizeUpDown = 0) => {
  const tokens = getTokens()
  const fonts = Object.keys(tokens.font)
  const fontSize = (tokens.font.body || tokens.font[fonts[0]]).size
  const fontSizeNames = Object.keys(fontSize)
  const nameIndex = Math.max(1, fontSizeNames.indexOf(size) + sizeUpDown)
  const sizedName = fontSizeNames[nameIndex]
  return (sizeUpDown === 0 ? fontSize[size] : fontSize[sizedName]) ?? 16
}
