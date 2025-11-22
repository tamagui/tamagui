import { getFontSize } from '@tamagui/font-size'
import { getButtonSized } from '@tamagui/get-button-sized'
import { ButtonNestingContext, getElevation, themeableVariants } from '@tamagui/stacks'
import { SizableText, wrapChildrenInText } from '@tamagui/text'
import type { ColorTokens, GetProps, RNExtraProps, SizeTokens, Token } from '@tamagui/web'
import {
  createStyledContext,
  getTokenValue,
  styled,
  useProps,
  View,
  withStaticProperties,
} from '@tamagui/web'
import { useContext } from 'react'
import { useGetIcon } from '@tamagui/helpers-tamagui'

type ButtonVariant = 'outlined'

export type ButtonProps = GetProps<typeof Frame>

const context = createStyledContext<{
  size?: SizeTokens
  variant?: ButtonVariant
  color?: ColorTokens | string
  elevation?: SizeTokens | number
}>({
  size: undefined,
  variant: undefined,
  color: undefined,
  elevation: undefined,
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

    circular: themeableVariants.circular,

    chromeless: themeableVariants.chromeless,

    bordered: themeableVariants.bordered,

    size: {
      '...size': (val, extras) => {
        const buttonStyle = getButtonSized(val, extras)
        const gap = getTokenValue(val as Token) * 0.4
        return {
          ...buttonStyle,
          gap,
        }
      },
      ':number': (val, extras) => {
        const buttonStyle = getButtonSized(val, extras)
        const gap = val * 0.4
        return {
          ...buttonStyle,
          gap,
        }
      },
    },

    elevation: {
      '...size': getElevation,
      ':number': getElevation,
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

const Icon = (props: { children: React.ReactNode; scaleIcon?: number }) => {
  const { children, scaleIcon = 1, marginLeft, marginRight, size } = props as any
  const styledContext = context.useStyledContext()
  if (!styledContext) {
    throw new Error('Button.Icon must be used within a Button')
  }
  const getIcon = useGetIcon()

  const sizeToken = size ?? styledContext.size

  const iconSize =
    (typeof sizeToken === 'number' ? sizeToken * 0.5 : getFontSize(sizeToken as Token)) *
    scaleIcon

  return getIcon(children, {
    size: iconSize,
    color: styledContext.color,
    marginLeft,
    marginRight,
  })
}

export const ButtonContext = createStyledContext<{
  size?: SizeTokens
  variant?: ButtonVariant
  color?: ColorTokens | string
}>({
  size: undefined,
  variant: undefined,
  color: undefined,
})

const ButtonComponent = Frame.styleable<{
  icon?: any
  iconAfter?: any
  scaleIcon?: number
  iconSize?: SizeTokens
  onLayout?: RNExtraProps['onLayout']
}>((propsIn: any, ref) => {
  const isNested = useContext(ButtonNestingContext)

  // Process props through useProps to expand shorthands (like br -> borderRadius)
  const processedProps = useProps(propsIn, {
    noNormalize: true,
    noExpand: true,
  })

  const {
    children,
    iconSize,
    icon,
    iconAfter,
    scaleIcon = 1,
    noTextWrap,
    ...props
  } = processedProps

  const size = propsIn.size || (propsIn.unstyled ? undefined : '$true')

  const styledContext = context.useStyledContext()
  const finalSize = iconSize ?? size ?? styledContext?.size
  const iconSizeNumber =
    (typeof finalSize === 'number' ? finalSize * 0.5 : getFontSize(finalSize as Token)) *
    scaleIcon

  const getIcon = useGetIcon()

  const [themedIcon, themedIconAfter] = [icon, iconAfter].map((icon) => {
    if (!icon) return null
    return getIcon(icon, {
      size: iconSizeNumber,
      color: styledContext?.color,
      // No marginLeft or marginRight needed - spacing is handled by the gap property in Frame's size variants
    })
  })

  const wrappedChildren = wrapChildrenInText(
    Text,
    { children, noTextWrap },
    {
      unstyled: process.env.TAMAGUI_HEADLESS === '1',
      size: finalSize ?? styledContext?.size,
    }
  )

  return (
    <ButtonNestingContext.Provider value={true}>
      <Frame
        ref={ref}
        {...props}
        {...(isNested && { tag: 'span' })}
        // Pass resolved size to circular variant when no explicit size provided
        {...(props.circular && !propsIn.size && { size })}
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
