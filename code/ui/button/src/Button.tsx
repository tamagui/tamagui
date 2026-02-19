import { getFontSize } from '@tamagui/font-size'
import { getButtonSized } from '@tamagui/get-button-sized'
import { getIcon, useCurrentColor } from '@tamagui/helpers-tamagui'
import { ButtonNestingContext, getElevation, themeableVariants } from '@tamagui/stacks'
import { SizableText, wrapChildrenInText } from '@tamagui/text'
import type { ColorTokens, GetProps, SizeTokens, Token } from '@tamagui/web'
import {
  createStyledContext,
  getTokenValue,
  styled,
  useProps,
  View,
  withStaticProperties,
} from '@tamagui/web'
import type { FunctionComponent, JSX } from 'react'
import { useContext } from 'react'

type ButtonVariant = 'outlined'

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
  role: 'button',
  render: <button type="button" />,
  tabIndex: 0,

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
              borderWidth: 1,
              borderColor: '$borderColor',

              hoverStyle: {
                backgroundColor: 'transparent',
                borderColor: '$borderColorHover',
              },

              pressStyle: {
                backgroundColor: 'transparent',
                borderColor: '$borderColorPress',
              },
            },
    },

    circular: themeableVariants.circular,

    chromeless: themeableVariants.chromeless,

    size: {
      '...size': (val, extras) => {
        const buttonStyle = getButtonSized(val, extras)
        const gap = getTokenValue(val as Token)
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
        // @ts-ignore
        'aria-disabled': true,
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

const Icon = (props: {
  children: React.ReactNode
  scaleIcon?: number
  size?: SizeTokens
}) => {
  const { children, scaleIcon = 1, size } = props
  const styledContext = context.useStyledContext()
  if (!styledContext) {
    throw new Error('Button.Icon must be used within a Button')
  }

  const sizeToken = size ?? styledContext.size
  const iconColor = useCurrentColor(styledContext.color)

  const iconSize =
    (typeof sizeToken === 'number' ? sizeToken * 0.5 : getFontSize(sizeToken as Token)) *
    scaleIcon

  return getIcon(children, {
    size: iconSize,
    color: iconColor,
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

type IconProp = JSX.Element | FunctionComponent<{ color?: any; size?: any }> | null

type ButtonExtraProps = {
  icon?: IconProp
  iconAfter?: IconProp
  scaleIcon?: number
  iconSize?: SizeTokens
}

const ButtonComponent = Frame.styleable<ButtonExtraProps>((propsIn, ref) => {
  const isNested = useContext(ButtonNestingContext)

  // Process props through useProps to expand shorthands (like br -> borderRadius)
  const processedProps = useProps(propsIn, {
    noNormalize: true,
    noExpand: true,
  })

  const { children, iconSize, icon, iconAfter, scaleIcon = 1, ...props } = processedProps

  const size = propsIn.size || (propsIn.unstyled ? undefined : '$true')

  const styledContext = context.useStyledContext()
  const iconColor = useCurrentColor(styledContext?.color)
  const finalSize = iconSize ?? size ?? styledContext?.size
  const iconSizeNumber =
    (typeof finalSize === 'number' ? finalSize * 0.5 : getFontSize(finalSize as Token)) *
    scaleIcon

  const [themedIcon, themedIconAfter] = [icon, iconAfter].map((icon) => {
    if (!icon) return null
    return getIcon(icon, {
      size: iconSizeNumber,
      color: iconColor,
      // No marginLeft or marginRight needed - spacing is handled by the gap property in Frame's size variants
    })
  })

  const wrappedChildren = wrapChildrenInText(
    Text,
    { children },
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
        {...(isNested && { render: 'span' })}
        // Pass resolved size to circular variant when no explicit size provided
        {...(props.circular && !propsIn.size && { size })}
        tabIndex={0}
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

export type ButtonProps = GetProps<typeof ButtonComponent>
