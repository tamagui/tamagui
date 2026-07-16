import { getFontSized } from '@tamagui/get-font-sized'
import { oneSizeTokenSmaller } from '@tamagui/get-token'
import { withStaticProperties } from '@tamagui/helpers'
import { getThemedIconSize, useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { themeableVariantStyles, YStack } from '@tamagui/stacks'
import { SizableText, wrapChildrenInText } from '@tamagui/text'
import type {
  ColorTokens,
  FontSizeTokens,
  GetProps,
  SizeTokens,
  VariantSpreadExtras,
} from '@tamagui/web'
import {
  createStyledContext,
  createStyledHOC,
  getVariableValue,
  resolveDefaultToken,
  styled,
  useProps,
  View,
} from '@tamagui/web'
import type { FunctionComponent, JSX, ReactNode } from 'react'

type IconProp = JSX.Element | FunctionComponent<{ color?: any; size?: any }> | null

type ListItemVariant = 'outlined'

export type ListItemExtraProps = {
  icon?: IconProp
  iconAfter?: IconProp
  scaleIcon?: number
  title?: ReactNode
  subTitle?: ReactNode
  iconSize?: SizeTokens | true
  color?: ColorTokens | string
}

export type ListItemProps = GetProps<typeof ListItemFrame> & ListItemExtraProps

const NAME = 'ListItem'

const context = createStyledContext<{
  size?: SizeTokens | true
  variant?: ListItemVariant
  color?: ColorTokens | string
}>({
  size: undefined,
  variant: undefined,
  color: undefined,
})

const listItemSizeVariant = (
  val: SizeTokens | true,
  { tokens }: VariantSpreadExtras<any>
) => {
  const sizeToken = resolveDefaultToken(val, 'size')
  const spaceToken = resolveDefaultToken(val, 'space')
  const sizeVal = getVariableValue(tokens.size[sizeToken]) as number
  return {
    minHeight: tokens.size[sizeToken],
    paddingHorizontal: tokens.space[spaceToken],
    paddingVertical: Math.max(0, Math.round(sizeVal * 0.36 - 9)),
    gap: getThemedIconSize(sizeToken, 0.4),
  }
}

const listItemSubtitleSizeVariant = (
  val: SizeTokens | true,
  extras: VariantSpreadExtras<any>
) => {
  const fontSizeToken = resolveDefaultToken(val, 'fontSize')
  const oneSmaller = oneSizeTokenSmaller(fontSizeToken)
  return getFontSized(oneSmaller as FontSizeTokens, extras as any)
}

const ListItemFrame = styled(View, {
  context,
  name: NAME,
  render: 'li',
  role: 'listitem',
  size: true,
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

  variants: {
    variant: {
      outlined: themeableVariantStyles.outlined,
    },

    size: {
      true: listItemSizeVariant,
      Size: listItemSizeVariant,
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
})

const ListItemText = styled(SizableText, {
  context,
  name: 'ListItemText',
  color: '$color',
  size: true,
  flexGrow: 1,
  flexShrink: 1,
  ellipsis: true,
  cursor: 'inherit',
})

const ListItemSubtitle = styled(ListItemText, {
  name: 'ListItemSubtitle',
  context,
  opacity: 0.6,
  maxWidth: '100%',
  color: '$color',
  variants: {
    size: {
      true: listItemSubtitleSizeVariant,
      Size: listItemSubtitleSizeVariant,
    },
  } as const,
})

const ListItemTitle = styled(ListItemText, {
  name: 'ListItemTitle',
  context,
})

const ListItemIcon = (props: {
  children: React.ReactNode
  size?: SizeTokens | true
  scaleIcon?: number
}) => {
  const { children, size, scaleIcon = 1 } = props
  const styledContext = context.useStyledContext()
  if (!styledContext) {
    throw new Error('ListItem.Icon must be used within a ListItem')
  }

  const sizeToken = size ?? styledContext.size ?? true
  const contextColor = styledContext.color
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

const ListItemComponent = createStyledHOC(ListItemFrame)<ListItemExtraProps>(
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
      subTitle,
      title,
      iconSize,
      color,
      ...rest
    } = processedProps

    const styledContext = context.useStyledContext()
    const size = rest.size ?? propsIn.size ?? styledContext?.size ?? true
    const contextColor = color ?? propsIn.color ?? styledContext?.color
    const iconColorProp =
      contextColor === 'unset' || typeof contextColor === 'number'
        ? undefined
        : contextColor
    const iconSizeNumber = getThemedIconSize(iconSize ?? (size as any), scaleIcon)
    const getThemedIcon = useGetThemedIcon({
      size: iconSizeNumber,
      color: iconColorProp,
    })

    const themedIcon = icon ? getThemedIcon(icon) : null
    const themedIconAfter = iconAfter ? getThemedIcon(iconAfter) : null

    const wrappedChildren = wrapChildrenInText(ListItemText, { children }, { size })

    const listItemContext = {
      ...styledContext,
      color: contextColor,
      size: size as SizeTokens,
      variant: (rest.variant ?? propsIn.variant ?? styledContext?.variant) as
        | ListItemVariant
        | undefined,
    }
    const frameProps = {
      ...rest,
      size,
      variant: listItemContext.variant,
    }

    return (
      <context.Provider {...listItemContext}>
        <ListItemFrame ref={ref} {...(frameProps as any)}>
          <context.Provider {...listItemContext}>
            {themedIcon}
            {title || subTitle ? (
              <YStack flex={1}>
                {title ? (
                  typeof title === 'string' ? (
                    <ListItemTitle size={size as any}>{title}</ListItemTitle>
                  ) : (
                    title
                  )
                ) : null}
                {subTitle ? (
                  <>
                    {typeof subTitle === 'string' ? (
                      <ListItemSubtitle size={size}>{subTitle}</ListItemSubtitle>
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
          </context.Provider>
        </ListItemFrame>
      </context.Provider>
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
