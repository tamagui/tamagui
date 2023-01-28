import {
  FontSizeTokens,
  GetProps,
  Spacer,
  TamaguiElement,
  ThemeableProps,
  getTokens,
  getVariableValue,
  styled,
  themeable,
  useMediaPropsActive,
  withStaticProperties,
} from '@tamagui/core'
import { getFontSize } from '@tamagui/font-size'
import { getSize } from '@tamagui/get-size'
import { getSpace, useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ThemeableStack, YStack } from '@tamagui/stacks'
import { SizableText, TextParentStyles, wrapChildrenInText } from '@tamagui/text'
import React, { FunctionComponent, forwardRef } from 'react'

type ListItemIconProps = { color?: string; size?: number }
type IconProp = JSX.Element | FunctionComponent<ListItemIconProps> | null

export type ListItemProps = Omit<TextParentStyles, 'TextComponent' | 'noTextWrap'> &
  GetProps<typeof ListItemFrame> &
  ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp
    /**
     * adjust icon relative to size
     */
    /**
     * default: -1
     */
    scaleIcon?: number
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number
    /**
     * title
     */
    title?: React.ReactNode
    /**
     * subtitle
     */
    subTitle?: React.ReactNode
    /**
     * will not wrap text around `children` only, "all" will not wrap title or subTitle
     */
    noTextWrap?: boolean | 'all'
  }

const NAME = 'ListItem'

export const ListItemFrame = styled(ThemeableStack, {
  name: NAME,
  tag: 'li',
  alignItems: 'center',
  flexWrap: 'nowrap',
  width: '100%',
  borderColor: '$borderColor',
  maxWidth: '100%',
  overflow: 'hidden',
  flexDirection: 'row',

  variants: {
    size: {
      '...size': (val, { tokens }) => {
        return {
          minHeight: tokens.size[val],
          paddingHorizontal: tokens.space[val],
          paddingVertical: getSpace(val, -2),
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
        // TODO breaking types
        pointerEvents: 'none' as any,
      },
    },
  } as const,

  defaultVariants: {
    size: '$true',
  },
})

export const ListItemText = styled(SizableText, {
  name: 'ListItemText',
  color: '$color',
  userSelect: 'none',
  flexGrow: 1,
  flexShrink: 1,
  ellipse: true,
  cursor: 'default',
})

export const ListItemSubtitle = styled(ListItemText, {
  name: 'ListItemSubtitle',
  color: '$colorPress',
  marginTop: '$-2',
  opacity: 0.65,
  maxWidth: '100%',
  size: '$3',
})

export const ListItemTitle = styled(ListItemText, {
  name: 'ListItemTitle',
})

export const useListItem = (
  props: ListItemProps,
  {
    Text = ListItemText,
    Subtitle = ListItemSubtitle,
    Title = ListItemTitle,
  }: {
    Title?: any
    Subtitle?: any
    Text?: any
  } = { Text: ListItemText, Subtitle: ListItemSubtitle, Title: ListItemTitle }
) => {
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
    scaleSpace = 1,
    subTitle,

    // text props
    color,
    fontWeight,
    letterSpacing,
    fontSize,
    fontFamily,
    textAlign,
    textProps,
    title,
    ...rest
  } = props

  const mediaActiveProps = useMediaPropsActive(props)
  const size = mediaActiveProps.size || '$true'
  const subtitleSize = `$${+String(size).replace('$', '') - 1}` as FontSizeTokens
  const iconSize = getFontSize(size) * scaleIcon
  const getThemedIcon = useGetThemedIcon({ size: iconSize, color })
  const [themedIcon, themedIconAfter] = [icon, iconAfter].map(getThemedIcon)
  const spaceSize =
    getVariableValue(getTokens(true).space[mediaActiveProps.space as any] ?? iconSize) *
    scaleSpace
  // @ts-ignore noTextWrap = all is ok
  const contents = wrapChildrenInText(Text, mediaActiveProps)

  return {
    props: {
      fontFamily,
      ...rest,
      children: (
        <>
          {themedIcon ? (
            <>
              {themedIcon}
              <Spacer size={spaceSize} />
            </>
          ) : null}
          {/* helper for common title/subtitle pttern */}
          {title || subTitle ? (
            <YStack flex={1}>
              {noTextWrap === 'all' ? title : <Title size={size}>{title}</Title>}
              {subTitle ? (
                <>
                  <Spacer flex size={spaceSize * 0.333} />
                  {typeof subTitle === 'string' && noTextWrap !== 'all' ? (
                    // TODO can use theme but we need to standardize to alt themes
                    // or standardize on subtle colors in themes
                    <Subtitle size={subtitleSize}>{subTitle}</Subtitle>
                  ) : (
                    subTitle
                  )}
                </>
              ) : null}
              {contents}
            </YStack>
          ) : (
            contents
          )}
          {themedIconAfter ? (
            <>
              <Spacer size={spaceSize} />
              {themedIconAfter}
            </>
          ) : null}
        </>
      ),
    },
  }
}

const ListItemComponent = forwardRef<TamaguiElement, ListItemProps>((props, ref) => {
  const { props: listItemProps } = useListItem(props)
  return <ListItemFrame ref={ref} justifyContent="space-between" {...listItemProps} />
})

export const listItemStaticConfig = {
  inlineProps: new Set([
    // text props go here (can't really optimize them, but we never fully extract listItem anyway)
    'color',
    'fontWeight',
    'fontSize',
    'fontFamily',
    'letterSpacing',
    'textAlign',
  ]),
}

export const ListItem = withStaticProperties(
  ListItemFrame.extractable(
    themeable(ListItemComponent, { componentName: NAME }),
    listItemStaticConfig
  ),
  {
    Text: ListItemText,
    Subtitle: ListItemSubtitle,
  }
)
