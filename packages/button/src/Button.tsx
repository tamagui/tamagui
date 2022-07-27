import {
  ButtonInsideButtonContext,
  GetProps,
  TamaguiComponent,
  ThemeableProps,
  getButtonSize,
  getVariableValue,
  spacedChildren,
  styled,
  themeable,
} from '@tamagui/core'
import { getFontSize } from '@tamagui/font-size'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ThemeableStack } from '@tamagui/stacks'
import { SizableText, TextParentStyles, wrapChildrenInText } from '@tamagui/text'
import React, { FunctionComponent, forwardRef, useContext } from 'react'
import { View } from 'react-native'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

type ButtonIconProps = { color?: string; size?: number }
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null

export type ButtonProps = Omit<TextParentStyles, 'TextComponent'> &
  GetProps<typeof ButtonFrame> &
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
  }

export const ButtonFrame = styled(ThemeableStack, {
  name: 'Button',
  tag: 'button',
  focusable: true,
  hoverTheme: true,
  pressTheme: true,
  backgrounded: true,
  borderWidth: 1,
  borderColor: 'transparent',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'nowrap',
  flexDirection: 'row',

  // if we wanted this only when pressable = true, we'd need to merge variants?
  cursor: 'pointer',

  pressStyle: {
    borderColor: 'transparent',
  },

  hoverStyle: {
    borderColor: 'transparent',
  },

  focusStyle: {
    borderColor: '$borderColorFocus',
  },

  variants: {
    size: {
      '...size': getButtonSize,
    },

    active: {
      true: {
        hoverStyle: {
          backgroundColor: '$background',
        },
      },
    },

    disabled: {
      true: {
        opacity: 0.5,
        pointerEvents: 'none',
      },
    },
  } as const,

  defaultVariants: {
    size: '$4',
  },
})

// see TODO breaking types
// type x = GetProps<typeof ButtonFrame>
// type y = x['size']

export const ButtonText = styled(SizableText, {
  color: '$color',
  selectable: false,
  cursor: 'inherit',
  // flexGrow 1 leads to inconsistent native style where text pushes to start of view
  flexGrow: 0,
  flexShrink: 1,
  ellipse: true,
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
    scaleSpace = 0.66,
    separator,

    // text props
    color,
    fontWeight,
    letterSpacing,
    fontSize,
    fontFamily,
    textAlign,
    textProps,
    ...rest
  } = props as ButtonProps

  const isInsideButton = useContext(ButtonInsideButtonContext)
  const size = props.size || '$4'
  const iconSize = (typeof size === 'number' ? size * 0.5 : getFontSize(size)) * scaleIcon
  const getThemedIcon = useGetThemedIcon({ size: iconSize, color })
  const [themedIcon, themedIconAfter] = [icon, iconAfter].map(getThemedIcon)
  const spaceSize = getVariableValue(iconSize) * scaleSpace
  const contents = wrapChildrenInText(ButtonText, props)

  return (
    <ButtonFrame
      fontFamily={fontFamily}
      // fixes SSR issue + DOM nesting issue of not allowing button in button
      {...(isInsideButton && {
        tag: 'span',
      })}
      ref={ref as any}
      {...rest}
    >
      <ButtonInsideButtonContext.Provider value={true}>
        {themedIcon || themedIconAfter
          ? spacedChildren({
              // a bit arbitrary but scaling to font size is necessary so long as button does
              space: spaceSize,
              spaceFlex,
              separator,
              direction:
                props.flexDirection === 'column' || props.flexDirection === 'column-reverse'
                  ? 'vertical'
                  : 'horizontal',
              children: [themedIcon, contents, themedIconAfter],
            })
          : contents}
      </ButtonInsideButtonContext.Provider>
    </ButtonFrame>
  )
})

export const Button: TamaguiComponent<ButtonProps, HTMLButtonElement | View> =
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
