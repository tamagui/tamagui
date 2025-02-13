import { getButtonSized } from '@tamagui/get-button-sized'
import { ButtonNestingContext } from '@tamagui/stacks'
import { SizableText, wrapChildrenInText } from '@tamagui/text'
import type { GetProps, SizeTokens } from '@tamagui/web'
import { createStyledContext, styled, View, withStaticProperties } from '@tamagui/web'
import { createElement, isValidElement, useContext } from 'react'

type ButtonVariant = 'outlined'

export type ButtonProps = GetProps<typeof Frame>

const context = createStyledContext({
  size: undefined,
  variant: undefined,
})

const Frame = styled(View, {
  context,
  name: 'Button',
  group: 'Button' as any,
  containerType: 'normal',
  role: 'button',
  tag: 'button',

  variants: {
    unstyled: {
      false: {
        size: '$true',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        cursor: 'pointer',
        backgroundColor: '$background',
        borderWidth: 1,
        borderColor: 'transparent',

        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },

        pressStyle: {
          backgroundColor: '$backgroundPress',
        },

        focusVisibleStyle: {
          outlineColor: '$outlineColor',
          outlineStyle: 'solid',
          outlineWidth: 2,
        },
      },
    },

    variant: {
      outlined:
        process.env.TAMAGUI_HEADLESS === '1'
          ? {}
          : {
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderColor: '$borderColor',

              hoverStyle: {
                backgroundColor: 'transparent',
                borderColor: '$borderColorHover',
              },

              pressStyle: {
                backgroundColor: 'transparent',
                borderColor: '$borderColorPress',
              },

              focusVisibleStyle: {
                backgroundColor: 'transparent',
                borderColor: '$borderColorFocus',
              },
            },
    },

    size: {
      '...size': getButtonSized,
      ':number': getButtonSized,
    },

    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const Text = styled(SizableText, {
  context,

  variants: {
    unstyled: {
      false: {
        userSelect: 'none',
        cursor: 'pointer',
        // flexGrow 1 leads to inconsistent native style where text pushes to start of view
        flexGrow: 0,
        flexShrink: 1,
        ellipsis: true,
        color: '$color',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const Icon = styled(SizableText, {
  context,

  variants: {
    unstyled: {
      false: {
        userSelect: 'none',
        cursor: 'pointer',
        // flexGrow 1 leads to inconsistent native style where text pushes to start of view
        flexGrow: 0,
        flexShrink: 1,
        ellipsis: true,
        color: '$color',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export const ButtonContext = createStyledContext<{
  size?: SizeTokens
  variant?: ButtonVariant
}>({
  size: undefined,
  variant: undefined,
})

const ButtonComponent = Frame.styleable<{
  variant?: 'outlined'
  size?: SizeTokens
  icon?: any
  iconAfter?: any
  scaleIcon?: number
  iconSize?: SizeTokens
}>((propsIn: any, ref) => {
  const isNested = useContext(ButtonNestingContext)
  const { children, iconSize, icon, iconAfter, scaleIcon = 0.4, ...props } = propsIn

  const [themedIcon, themedIconAfter] = [icon, iconAfter].map((icon, i) => {
    if (!icon) return null
    const isBefore = i === 0
    return isValidElement(icon)
      ? icon
      : createElement(icon, {
          size: iconSize ?? props.size,
          ...(!iconSize &&
            typeof scaleIcon === 'number' && {
              scale: scaleIcon,
              [isBefore ? 'marginLeft' : 'marginRight']: `-${scaleIcon * 40}%`,
            }),
        })
  })

  const wrappedChildren = wrapChildrenInText(
    Text,
    { children },
    propsIn.unstyled !== true
      ? {
          unstyled: process.env.TAMAGUI_HEADLESS === '1',
          size: propsIn.size,
        }
      : undefined
  )

  return (
    <ButtonNestingContext.Provider value={true}>
      <Frame ref={ref} {...props} {...(isNested && { tag: 'span' })}>
        {themedIcon}
        {wrappedChildren}
        {themedIconAfter}
      </Frame>
    </ButtonNestingContext.Provider>
  )
})

export const Button = withStaticProperties(ButtonComponent, {
  Apply: context.Provider,
  Frame,
  Text,
  Icon,
})
