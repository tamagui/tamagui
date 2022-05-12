import {
  ButtonInsideButtonContext,
  GetProps,
  ReactComponentWithRef,
  SizeTokens,
  ThemeableProps,
  buttonScaling,
  getButtonSize,
  getSizeScaledToFont,
  getVariableValue,
  spacedChildren,
  styled,
  themeable,
  useTheme,
} from '@tamagui/core'
import { SizableStack } from '@tamagui/stacks'
import { SizableText, SizableTextProps } from '@tamagui/text'
import React, { FunctionComponent, forwardRef, isValidElement, useContext } from 'react'
import { View } from 'react-native'

import { getFontSize } from '../helpers/getFontSize'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

type ButtonIconProps = { color?: string; size?: number }
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null

export type ButtonProps = GetProps<typeof ButtonFrame> &
  ThemeableProps & {
    // add icon before, passes color and size automatically if Component
    icon?: IconProp
    // add icon after, passes color and size automatically if Component
    iconAfter?: IconProp
    // adjust icon relative to size
    // default: -1
    scaleIcon?: number
    // dont wrap inner contents in a text element
    noTextWrap?: boolean
    // make the spacing elements flex
    spaceFlex?: number | boolean
    // adjust internal space relative to icon size
    scaleSpace?: number

    // pass text properties:
    color?: SizableTextProps['color']
    fontWeight?: SizableTextProps['fontWeight']
    fontSize?: SizableTextProps['fontSize']
    fontFamily?: SizableTextProps['fontFamily']
    letterSpacing?: SizableTextProps['letterSpacing']
    textAlign?: SizableTextProps['textAlign']

    // all the other text controls
    textProps?: Partial<SizableTextProps>
  }

const ButtonFrame = styled(SizableStack, {
  name: 'Button',
  tag: 'button',
  size: '$4',
  borderWidth: 0,
  borderColor: '$borderColor',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'nowrap',
  hoverable: true,
  pressable: true,

  // TODO only on hoverable/pressable!
  // would need to merge variants
  cursor: 'pointer',

  variants: {
    active: {
      true: {
        hoverStyle: {
          backgroundColor: '$background',
        },
      },
    },

    circular: {
      true: (_, extras) => {
        const { props } = extras
        const sizeVal = props.size ?? '$4'
        const scale = getSizeScaledToFont(sizeVal, buttonScaling, extras)
        const size = scale.minHeight
        return {
          width: size,
          height: size,
          maxWidth: size,
          maxHeight: size,
          minWidth: size,
          minHeight: size,
          borderRadius: 100_000,
          paddingVertical: 0,
          paddingHorizontal: 0,
        }
      },
    },
  },
})

const ButtonComponent = forwardRef((props: ButtonProps, ref) => {
  // careful not to desctructure and re-order props, order is important
  const {
    children,
    icon,
    iconAfter,
    noTextWrap,
    theme: themeName,
    space,
    spaceFlex,
    scaleIcon = 1,
    scaleSpace = 0.5,

    // text props
    color: colorProp,
    fontWeight,
    letterSpacing,
    fontSize,
    fontFamily,
    textAlign,
    textProps,
    ...rest
  } = props as ButtonProps

  const isInsideButton = useContext(ButtonInsideButtonContext)
  const theme = useTheme()
  const size = props.size || '$4'

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

  const iconSize = getFontSize(size) * scaleIcon

  const addTheme = (el: any) => {
    if (isValidElement(el)) {
      return el
    }
    if (el) {
      return React.createElement(el, {
        color,
        size: iconSize,
      })
    }
    return el
  }
  const themedIcon = icon ? addTheme(icon) : null
  const themedIconAfter = iconAfter ? addTheme(iconAfter) : null

  let contents = children

  if (!noTextWrap && children) {
    // in the case of using variables, like so:
    // <Button>Hello, {name}</Button>
    // it gives us props.children as ['Hello, ', 'name']
    // but we don't want to wrap multiple SizableText around each part
    // so we group them
    let allChildren = React.Children.toArray(children)
    let nextChildren: any[] = []
    let lastIsString = false

    function concatStringChildren() {
      if (!lastIsString) return
      const index = nextChildren.length - 1
      const childrenStrings = nextChildren[index]
      nextChildren[index] = (
        <SizableText
          key={index}
          {...{
            fontWeight,
            letterSpacing,
            fontSize,
            fontFamily,
            textAlign,
            size,
          }}
          {...(colorProp && {
            color: colorProp,
          })}
          flexGrow={1}
          flexShrink={1}
          ellipse
          {...textProps}
        >
          {childrenStrings}
        </SizableText>
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

    contents = nextChildren
  }

  return (
    // careful not to desctructure and re-order props, order is important
    <ButtonInsideButtonContext.Provider value={true}>
      <ButtonFrame
        fontFamily={fontFamily}
        // fixes SSR issue + DOM nesting issue of not allowing button in button
        {...(isInsideButton && {
          tag: 'span',
        })}
        ref={ref as any}
        {...rest}
      >
        {themedIcon || themedIconAfter
          ? spacedChildren({
              // a bit arbitrary but scaling to font size is necessary so long as button does
              space: getVariableValue(iconSize) * scaleSpace,
              spaceFlex,
              direction: props.flexDirection || 'row',
              children: [themedIcon, contents, themedIconAfter],
            })
          : contents}
      </ButtonFrame>
    </ButtonInsideButtonContext.Provider>
  )
})

export const Button: ReactComponentWithRef<ButtonProps, HTMLButtonElement | View> =
  ButtonFrame.extractable(themeable(ButtonComponent as any) as any, {
    inlineProps: new Set([
      // text props go here (can't really optimize them, but we never fully extract button anyway)
      'color',
      'fontWeight',
      'fontSize',
      'fontFamily',
      'letterSpacing',
      'textAlign',
    ]),
  })
