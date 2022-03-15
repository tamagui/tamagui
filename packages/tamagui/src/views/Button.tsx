import {
  StaticComponent,
  ThemeableProps,
  getTokens,
  styled,
  themeable,
  useTheme,
} from '@tamagui/core'
import React, { forwardRef, isValidElement } from 'react'

import { getFontSize } from '../helpers/getFontSize'
import { SizableFrame, SizableFrameProps } from './SizableFrame'
import { SizableText, SizableTextProps } from './SizableText'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

type IconProp = JSX.Element | ((props: { color?: string; size?: number }) => JSX.Element) | null

export type ButtonProps = SizableFrameProps &
  ThemeableProps & {
    scaleIcon?: number
    color?: SizableTextProps['color']
    noTextWrap?: boolean
    icon?: IconProp
    iconAfter?: IconProp
  }

const ButtonFrame = styled(
  SizableFrame,
  {
    tag: 'button',
    borderWidth: 0,
    hoverable: true,
    pressable: true,
  },
  {
    componentName: 'button',
  }
)

export const Button: React.FC<ButtonProps> = ButtonFrame.extractable(
  themeable(
    forwardRef((props, ref) => {
      const {
        children,
        icon,
        iconAfter,
        space,
        noTextWrap,
        theme: themeName,
        size = '$4',
        scaleIcon = 0,
        color: colorProp,
        ...rest
      } = props
      const theme = useTheme()
      const color = (colorProp || theme.color)?.toString()
      const addTheme = (el: any) => {
        return isValidElement(el)
          ? el
          : !!el
          ? React.createElement(el, {
              color,
              size: getFontSize(size, { relativeSize: -1 + scaleIcon }),
            })
          : null
      }
      const themedIcon = icon ? addTheme(icon) : null
      const themedIconAfter = iconAfter ? addTheme(iconAfter) : null

      const contents = noTextWrap
        ? children
        : React.Children.map(children, (child) => {
            const component = typeof child !== 'string' ? (child['type'] as StaticComponent) : null
            if (component?.staticConfig?.isText) {
              return child
            }
            return (
              <SizableText
                cursor="inherit"
                size={size}
                color={color}
                flexGrow={0}
                flexShrink={1}
                ellipse
              >
                {children}
              </SizableText>
            )
          })

      return (
        <ButtonFrame size={size} space={space ?? getSpaceSize(size, -3)} ref={ref as any} {...rest}>
          {themedIcon}
          {contents}
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
