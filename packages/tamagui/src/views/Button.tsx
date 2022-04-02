import {
  GetProps,
  StaticComponent,
  ThemeableProps,
  getTokens,
  getVariableValue,
  styled,
  themeable,
  useTheme,
} from '@tamagui/core'
import React, { FunctionComponent, forwardRef, isValidElement } from 'react'
import { View } from 'react-native'

import { getFontSize } from '../helpers/getFontSize'
import { SizableStack } from './SizableStack'
import { SizableText, SizableTextProps } from './SizableText'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

type ButtonIconProps = { color?: string; size?: number }
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null

export type ButtonProps = GetProps<typeof ButtonFrame> &
  ThemeableProps & {
    scaleIcon?: number
    color?: SizableTextProps['color']
    fontWeight?: SizableTextProps['fontWeight']
    letterSpacing?: SizableTextProps['letterSpacing']
    noTextWrap?: boolean
    icon?: IconProp
    iconAfter?: IconProp
  }

const ButtonFrame = styled(SizableStack, {
  name: 'Button',
  tag: 'button',
  borderWidth: 0,
  borderColor: '$borderColor',
  hoverable: true,
  pressable: true,

  variants: {
    circular: {
      true: (_, { props, tokens }) => {
        const sizeVal = props['size'] ?? '$4'
        const size = tokens.size[sizeVal] ?? 44
        const sizePx = +getVariableValue(size)
        return {
          width: sizePx * 2,
          maxWidth: sizePx * 2,
          height: sizePx * 2,
          maxHeight: sizePx * 2,
          overflow: 'hidden',
          borderRadius: 100_000,
          paddingVertical: 0,
          paddingHorizontal: 0,
        }
      },
    },
  },
})

export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<View>> =
  ButtonFrame.extractable(
    themeable(
      forwardRef((props: any, ref) => {
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
          fontWeight,
          letterSpacing,
          ...rest
        } = props as ButtonProps
        const theme = useTheme()
        const color = (colorProp || theme?.color)?.toString()
        const addTheme = (el: any) => {
          if (isValidElement(el)) {
            return el
          }
          if (el) {
            const iconSize = getFontSize(size, { relativeSize: -1 + scaleIcon })
            if (props['debug']) console.log('iconSize', iconSize, size)
            return React.createElement(el, {
              color,
              size: iconSize,
            })
          }
          return el
        }
        const themedIcon = icon ? addTheme(icon) : null
        const themedIconAfter = iconAfter ? addTheme(iconAfter) : null

        const contents = noTextWrap
          ? children
          : React.Children.map(children, (child) => {
              const component =
                typeof child !== 'string' ? (child['type'] as StaticComponent) : null
              if (component?.staticConfig?.isText) {
                return child
              }
              return (
                <SizableText
                  fontWeight={fontWeight}
                  letterSpacing={letterSpacing}
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
          <ButtonFrame
            size={size}
            space={space ?? getSpaceSize(size, -3)}
            ref={ref as any}
            {...rest}
          >
            {themedIcon}
            {contents}
            {themedIconAfter}
          </ButtonFrame>
        )
      })
    )
  ) as any

export const getSpaceSize = (size: any, sizeUpOrDownBy = 0) => {
  const sizes = getTokens().size
  const sizeNames = Object.keys(sizes)
  const sizeDown =
    sizes[sizeNames[Math.max(0, sizeNames.indexOf(size || '$4') + sizeUpOrDownBy)]] || '$4'
  return sizeDown
}
