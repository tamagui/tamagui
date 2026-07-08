import { getFontSized } from '@tamagui/get-font-sized'
import { getSize, getSpace } from '@tamagui/get-token'
import { withStaticProperties } from '@tamagui/helpers'
import { getThemedIconSize, useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { themeableVariantStyles, YStack } from '@tamagui/stacks'
import { SizableText, wrapChildrenInText } from '@tamagui/text'
import type { ColorTokens, FontSizeTokens, GetProps, SizeTokens } from '@tamagui/web'
import { createStyledContext, styled, useProps, View } from '@tamagui/web'
import { createContext, useContext } from 'react'
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
  color?: ColorTokens | string
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

const ListItemIconContext = createContext<{
  size?: SizeTokens
  color?: ColorTokens | string
} | null>(null)

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
      outlined: themeableVariantStyles.outlined,
    },

    size: {
      '...size': (val: SizeTokens, { tokens }) => {
        return {
          minHeight: tokens.size[val],
          paddingHorizontal: tokens.space[val],
          paddingVertical: getSpace(tokens.space[val], {
            shift: -4,
          }),
          gap: getThemedIconSize(val, 0.4),
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
  const { children, size, scaleIcon = 1 } = props
  const iconContext = useContext(ListItemIconContext)
  const styledContext = context.useStyledContext()
  if (!styledContext && !iconContext) {
    throw new Error('ListItem.Icon must be used within a ListItem')
  }

  const sizeToken = size ?? iconContext?.size ?? styledContext.size ?? '$true'
  const contextColor = iconContext?.color ?? styledContext.color
  const iconColorProp =
    contextColor === 'unset' || typeof contextColor === 'number'
      ? undefined
      : contextColor

  const iconSize = getThemedIconSize(sizeToken, scaleIcon)
  const getThemedIcon = useGetThemedIcon({
    size: iconSize,
    color: iconColorProp,
  })

  return getThemedIcon(children)
}

const ListItemComponent = ListItemFrame.styleable<ListItemExtraProps>(
  function ListItem(propsIn, ref) {
    const processedProps = useProps(propsIn, {
      noNormalize: true,
      noExpand: true,
    })

    const {
      children,
      icon,
      iconAfter,
      scaleIcon = 1,
      unstyled,
      subTitle,
      title,
      iconSize,
      color,
      ...rest
    } = processedProps

    const styledContext = context.useStyledContext()
    const isUnstyled = unstyled ?? process.env.TAMAGUI_HEADLESS === '1'
    const size =
      rest.size ??
      propsIn.size ??
      (isUnstyled ? undefined : styledContext?.size || '$true')
    const contextColor = color ?? propsIn.color ?? styledContext?.color
    const iconColorProp =
      contextColor === 'unset' || typeof contextColor === 'number'
        ? undefined
        : contextColor
    const iconSizeNumber = getThemedIconSize(iconSize || (size as any), scaleIcon)
    const getThemedIcon = useGetThemedIcon({
      size: iconSizeNumber,
      color: iconColorProp,
    })

    const themedIcon = icon ? getThemedIcon(icon) : null
    const themedIconAfter = iconAfter ? getThemedIcon(iconAfter) : null

    const wrappedChildren = wrapChildrenInText(
      ListItemText,
      { children },
      {
        unstyled: isUnstyled,
        size,
      }
    )

    const listItemContext = {
      ...styledContext,
      color: contextColor,
      size,
      variant: rest.variant ?? propsIn.variant ?? styledContext?.variant,
    }
    const frameProps = {
      ...rest,
      size,
      variant: listItemContext.variant,
    }

    return (
      <ListItemIconContext.Provider value={{ size, color: contextColor }}>
        <context.Provider {...listItemContext}>
          <ListItemFrame ref={ref} unstyled={isUnstyled} {...(frameProps as any)}>
            {themedIcon}
            {title || subTitle ? (
              <YStack flex={1}>
                {title ? (
                  typeof title === 'string' ? (
                    <ListItemTitle unstyled={isUnstyled} size={size as any}>
                      {title}
                    </ListItemTitle>
                  ) : (
                    title
                  )
                ) : null}
                {subTitle ? (
                  <>
                    {typeof subTitle === 'string' ? (
                      <ListItemSubtitle unstyled={isUnstyled} size={size}>
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
        </context.Provider>
      </ListItemIconContext.Provider>
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
