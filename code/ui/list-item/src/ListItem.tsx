import { useIconSize } from '@tamagui/font-size'
import { getFontSized } from '@tamagui/get-font-sized'
import { getSize, getSpace } from '@tamagui/get-token'
import { withStaticProperties } from '@tamagui/helpers'
import { getIcon } from '@tamagui/helpers-tamagui'
import { YStack } from '@tamagui/stacks'
import { SizableText, wrapChildrenInText } from '@tamagui/text'
import type { ColorTokens, FontSizeTokens, GetProps, SizeTokens } from '@tamagui/web'
import { createStyledContext, styled, View } from '@tamagui/web'
import type { FunctionComponent, JSX, ReactNode } from 'react'

type IconProp = JSX.Element | FunctionComponent<{ color?: any; size?: any }> | null

type ListItemVariant = 'outlined'

export type ListItemExtraProps = {
  icon?: IconProp
  iconAfter?: IconProp
  scaleIcon?: number
  title?: ReactNode
  subTitle?: ReactNode
  iconSize?: SizeTokens
}

export type ListItemProps = GetProps<typeof ListItemFrame> & ListItemExtraProps

const NAME = 'ListItem'

const context = createStyledContext<{
  size?: SizeTokens
  variant?: ListItemVariant
  color?: ColorTokens | string
}>({
  size: undefined,
  variant: undefined,
  color: undefined,
})

const ListItemFrame = styled(View, {
  context,
  name: NAME,
  render: 'li',
  role: 'listitem',

  variants: {
    unstyled: {
      false: {
        size: '$true',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        borderColor: '$borderColor',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        flexDirection: 'row',
        backgroundColor: '$background',
        cursor: 'default',

        hoverStyle: {
          backgroundColor: '$backgroundHover',
          borderColor: '$borderColorHover',
        },

        pressStyle: {
          backgroundColor: '$backgroundPress',
          borderColor: '$borderColorPress',
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

    size: {
      '...size': (val: SizeTokens, { tokens }) => {
        return {
          minHeight: tokens.size[val],
          paddingHorizontal: tokens.space[val],
          paddingVertical: getSpace(tokens.space[val], {
            shift: -4,
          }),
        }
      },
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
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const ListItemText = styled(SizableText, {
  context,
  name: 'ListItemText',

  variants: {
    unstyled: {
      false: {
        color: '$color',
        size: '$true',
        flexGrow: 1,
        flexShrink: 1,
        ellipsis: true,
        cursor: 'inherit',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const ListItemSubtitle = styled(ListItemText, {
  name: 'ListItemSubtitle',
  context,
  variants: {
    unstyled: {
      false: {
        opacity: 0.6,
        maxWidth: '100%',
        color: '$color',
      },
    },

    size: {
      '...size': (val, extras) => {
        const oneSmaller = getSize(val, {
          shift: -1,
          excludeHalfSteps: true,
        })
        const fontStyle = getFontSized(oneSmaller.key as FontSizeTokens, extras as any)
        return fontStyle
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const ListItemTitle = styled(ListItemText, {
  name: 'ListItemTitle',
  context,
  variants: {
    unstyled: {
      false: {},
    },
  } as const,
  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const ListItemIcon = (props: {
  children: React.ReactNode
  size?: SizeTokens
  scaleIcon?: number
}) => {
  const { children, size, scaleIcon } = props
  const styledContext = context.useStyledContext()
  if (!styledContext) {
    throw new Error('ListItem.Icon must be used within a ListItem')
  }

  const sizeToken = size ?? styledContext.size ?? '$true'

  const iconSize = useIconSize({
    sizeToken,
    scaleIcon: scaleIcon ?? 1,
  })

  return getIcon(children, {
    ...(iconSize != null && { size: iconSize }),
    color: styledContext.color,
  })
}

const ListItemComponent = ListItemFrame.styleable<ListItemExtraProps>(
  function ListItem(propsIn, ref) {
    const {
      children,
      icon,
      iconAfter,
      scaleIcon = 1,
      unstyled = false,
      subTitle,
      title,
      iconSize,
      ...rest
    } = propsIn

    const size = propsIn.size || '$true'
    const styledContext = context.useStyledContext()
    const iconSizeNumber = useIconSize({
      sizeToken: iconSize || size,
      scaleIcon: scaleIcon ?? 1,
    })

    const [themedIcon, themedIconAfter] = [icon, iconAfter].map((icon, i) => {
      if (!icon) return null
      const isBefore = i === 0
      return getIcon(icon, {
        ...(iconSizeNumber != null && { size: iconSizeNumber }),
        color: styledContext?.color,
        ...(iconSizeNumber != null && {
          [isBefore ? 'marginRight' : 'marginLeft']: `${iconSizeNumber * 0.4}%`,
        }),
      })
    })

    const wrappedChildren = wrapChildrenInText(
      ListItemText,
      { children },
      propsIn.unstyled !== true
        ? {
            unstyled: process.env.TAMAGUI_HEADLESS === '1',
            fontSize: propsIn.size,
          }
        : undefined
    )

    return (
      <ListItemFrame ref={ref} {...rest}>
        {themedIcon}
        {title || subTitle ? (
          <YStack flex={1}>
            {title ? (
              typeof title === 'string' ? (
                <ListItemTitle unstyled={unstyled} size={size as any}>
                  {title}
                </ListItemTitle>
              ) : (
                title
              )
            ) : null}
            {subTitle ? (
              <>
                {typeof subTitle === 'string' ? (
                  <ListItemSubtitle unstyled={unstyled} size={size}>
                    {subTitle}
                  </ListItemSubtitle>
                ) : (
                  subTitle
                )}
              </>
            ) : null}
            {wrappedChildren}
          </YStack>
        ) : (
          wrappedChildren
        )}
        {themedIconAfter}
      </ListItemFrame>
    )
  }
)

export const ListItem = withStaticProperties(ListItemComponent, {
  Apply: context.Provider,
  Frame: ListItemFrame,
  Text: ListItemText,
  Subtitle: ListItemSubtitle,
  Icon: ListItemIcon,
  Title: ListItemTitle,
})
