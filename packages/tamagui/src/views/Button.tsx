import { ThemeableProps, getTokens, styled, themeable, useTheme } from '@tamagui/core'
import React, { forwardRef, isValidElement } from 'react'

import { getFontSize } from '../helpers/getFontSize'
import { InteractiveFrame, InteractiveFrameProps } from './InteractiveFrame'
import { SizableText, SizableTextProps } from './SizableText'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

type IconProp = JSX.Element | ((props: { color?: string; size?: number }) => JSX.Element) | null

export type ButtonProps = InteractiveFrameProps &
  ThemeableProps & {
    color?: SizableTextProps['color']
    textProps?: Omit<SizableTextProps, 'children'>
    noTextWrap?: boolean
    icon?: IconProp
    iconAfter?: IconProp
  }

const ButtonFrame = styled(InteractiveFrame, {
  tag: 'button',
  borderWidth: 0,
})

export const Button = ButtonFrame.extractable(
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
        size = '$4',
        color: colorProp,
        ...rest
      } = props
      const theme = useTheme()
      const color = (colorProp || theme.color2).toString()
      const addTheme = (el: any) => {
        return isValidElement(el)
          ? el
          : !!el
          ? React.createElement(el, {
              color,
              size: getFontSize(size, { relativeSize: -1 }),
            })
          : null
      }
      const themedIcon = icon ? addTheme(icon) : null
      const themedIconAfter = iconAfter ? addTheme(iconAfter) : null

      return (
        <ButtonFrame
          hoverable
          pressable
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
              flexGrow={0}
              flexShrink={1}
              ellipse
              size={size}
              color={color}
              {...textProps}
            >
              {children}
            </SizableText>
          ) : (
            <SizableText size={size} color={color} flexGrow={0} flexShrink={1} ellipse>
              {children}
            </SizableText>
          )}
          {themedIconAfter}
        </ButtonFrame>
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
