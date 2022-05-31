import {
  ButtonInsideButtonContext,
  GetProps,
  ReactComponentWithRef,
  ThemeableProps,
  getButtonSize,
  getVariableValue,
  spacedChildren,
  styled,
  themeable,
} from '@tamagui/core'
import { getFontSize } from '@tamagui/font-size'
import {
  TextParentStyles,
  useGetThemedIcon,
  wrapStringChildrenInText,
} from '@tamagui/helpers-tamagui'
import { ThemeableStack } from '@tamagui/stacks'
import { SizableText, SizableTextProps } from '@tamagui/text'
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

const ButtonFrame = styled(ThemeableStack, {
  name: 'Button',
  tag: 'button',
  hoverable: true,
  pressable: true,
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

    // TODO see core/styled.ts bug
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
  flexGrow: 1,
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
  const iconSize = getFontSize(size) * scaleIcon
  const getThemedIcon = useGetThemedIcon({ size: iconSize, color })
  const [themedIcon, themedIconAfter] = [icon, iconAfter].map(getThemedIcon)
  const spaceSize = getVariableValue(iconSize) * scaleSpace
  const contents = wrapStringChildrenInText({
    ...props,
    TextComponent: ButtonText,
  })

  return (
    // careful not to destructure and re-order props, order is important
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
              space: spaceSize,
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
