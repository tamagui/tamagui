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
  size: '$4',
  borderWidth: 0,
  borderColor: '$borderColor',
  hoverable: true,
  pressable: true,

  variants: {
    active: {
      true: {
        // avoids hover styles when active
        // TODO not working?
        hoverStyle: {
          backgroundColor: '$background',
        },
      },
    },

    circular: {
      true: (_, { props, tokens }) => {
        const sizeVal = props['size'] ?? '$4'
        const sizeToken = tokens.size[sizeVal] ?? 44
        const size = +getVariableValue(sizeToken) * 2
        return {
          width: size,
          height: size,
          maxWidth: size,
          maxHeight: size,
          minWidth: size,
          minHeight: size,
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
        // careful not to desctructure and re-order props, order is important
        const {
          children,
          icon,
          iconAfter,
          space,
          noTextWrap,
          theme: themeName,
          scaleIcon = 0,
          color: colorProp,
          fontWeight,
          letterSpacing,
          ...rest
        } = props as ButtonProps
        const theme = useTheme()
        const size = props.size ?? '$4'

        // get color from prop or theme
        let color: any
        // @ts-expect-error
        if (theme && colorProp && colorProp in theme) {
          // @ts-expect-error
          color = theme[colorProp]
        } else if (colorProp) {
          color = colorProp
        } else {
          color = theme?.color
        }
        color = color?.toString()

        const addTheme = (el: any) => {
          if (isValidElement(el)) {
            return el
          }
          if (el) {
            const iconSize = getFontSize(size, { relativeSize: -1 + scaleIcon })
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
          // careful not to desctructure and re-order props, order is important
          <ButtonFrame space={getSpaceSize(size, -3)} ref={ref as any} {...rest}>
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
