import { getFontSize } from '@tamagui/font-size'
import { getButtonSized } from '@tamagui/get-button-sized'
import { ButtonNestingContext, themeableVariants } from '@tamagui/stacks'
import { SizableText, wrapChildrenInText } from '@tamagui/text'
import type { GetProps, RNExtraProps, SizeTokens } from '@tamagui/web'
import { createStyledContext, styled, View, withStaticProperties } from '@tamagui/web'
import { useContext } from 'react'
import { useGetIcon } from '@tamagui/helpers-tamagui'

type ButtonVariant = 'outlined'

export type ButtonProps = GetProps<typeof Frame>

const context = createStyledContext<{
  size?: SizeTokens
  variant?: ButtonVariant
}>({
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

    // TODO: Consider flipping styled/unstyled defaults in future versions
    // This would make styled=true the default behavior and unstyled=true opt-in
    // This would provide better DX by default while maintaining backward compatibility
    styled: {
      true: {
        size: '$true',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        cursor: 'pointer',
        backgroundColor: '$background',
        borderWidth: 1,
        borderColor: 'transparent',
        gap: '$2',

        hoverStyle: {
          backgroundColor: '$backgroundHover',
          borderColor: '$borderColorHover',
        },

        pressStyle: {
          backgroundColor: '$backgroundPress',
          borderColor: '$borderColorHover',
        },

        focusVisibleStyle: {
          outlineColor: '$outlineColor',
          outlineStyle: 'solid',
          outlineWidth: 2,
        },
      },
    },

    circular: themeableVariants.circular,

    chromeless: themeableVariants.chromeless,

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
                outlineColor: '$outlineColor',
                outlineStyle: 'solid',
                outlineWidth: 2,
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

    styled: {
      true: {
        userSelect: 'none',
        cursor: 'pointer',
        flexGrow: 0,
        flexShrink: 1,
        ellipsis: true,
        color: '$color',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
    styled: false,
  },
})

const Icon = (props: { children: React.ReactNode; scaleIcon?: number }) => {
  const { children, scaleIcon = 1, marginLeft, marginRight, size } = props as any
  const styledContext = context.useStyledContext()
  if (!styledContext) {
    throw new Error('Button.Icon must be used within a Button')
  }
  const getIcon = useGetIcon()

  const sizeToken = size ?? styledContext.size

  const iconSize = getFontSize(sizeToken as any) * scaleIcon

  return getIcon(children, {
    size: iconSize,
    marginLeft,
    marginRight,
  })
}

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
  chromeless?: boolean
  circular?: boolean
  styled?: boolean
  onLayout?: RNExtraProps['onLayout']
}>((propsIn: any, ref) => {
  const isNested = useContext(ButtonNestingContext)
  const { children, iconSize, icon, iconAfter, scaleIcon = 1, styled, ...props } = propsIn

  const styledContext = context.useStyledContext()
  const size = iconSize ?? propsIn.size ?? styledContext?.size
  const iconSizeNumber = getFontSize(size as any) * scaleIcon

  const getIcon = useGetIcon()

  const [themedIcon, themedIconAfter] = [icon, iconAfter].map((icon, i) => {
    if (!icon) return null
    const isBefore = i === 0
    return getIcon(icon, {
      size: iconSizeNumber,
      ...{
        [!isBefore ? 'marginLeft' : 'marginRight']: `${iconSizeNumber * 0.4}%`,
      },
    })
  })

  const wrappedChildren = wrapChildrenInText(
    Text,
    { children },
    {
      unstyled: process.env.TAMAGUI_HEADLESS === '1',
      styled: styled,
      size: propsIn.size ?? styledContext?.size,
    }
  )

  return (
    <ButtonNestingContext.Provider value={true}>
      <Frame 
        ref={ref} 
        styled={styled}
        {...props} 
        {...(isNested && { tag: 'span' })}
        tabIndex={0}
        focusable={true}
      >
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
