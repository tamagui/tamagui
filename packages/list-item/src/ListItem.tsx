import {
  FontSizeTokens,
  GetProps,
  Spacer,
  TamaguiComponent,
  TamaguiElement,
  ThemeableProps,
  getSize,
  getVariableValue,
  styled,
  themeable,
  withStaticProperties,
} from '@tamagui/core'
import { getFontSize } from '@tamagui/font-size'
import { getSpace, useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ThemeableStack, YStack } from '@tamagui/stacks'
import { SizableText, TextParentStyles, wrapChildrenInText } from '@tamagui/text'
import React, { FunctionComponent, forwardRef } from 'react'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

type ListItemIconProps = { color?: string; size?: number }
type IconProp = JSX.Element | FunctionComponent<ListItemIconProps> | null

export type ListItemProps = Omit<TextParentStyles, 'TextComponent'> &
  GetProps<typeof ListItemFrame> &
  ThemeableProps & {
    // add icon before, passes color and size automatically if Component
    icon?: IconProp
    // add icon after, passes color and size automatically if Component
    iconAfter?: IconProp
    // adjust icon relative to size
    // default: -1
    scaleIcon?: number
    // make the spacing elements flex
    spaceFlex?: number | boolean
    // adjust internal space relative to icon size
    scaleSpace?: number
    // title
    title?: React.ReactNode
    // subtitle
    subTitle?: React.ReactNode
  }

export const ListItemFrame = styled(ThemeableStack, {
  name: 'ListItem',
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
    size: '$4',
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

  const size = props.size || '$4'
  const subtitleSizeToken = getSize(size, -3)
  const subtitleSize = `$${subtitleSizeToken.key}` as FontSizeTokens
  const iconSize = getFontSize(size) * scaleIcon
  const getThemedIcon = useGetThemedIcon({ size: iconSize, color })
  const [themedIcon, themedIconAfter] = [icon, iconAfter].map(getThemedIcon)
  const spaceSize = getVariableValue(iconSize) * scaleSpace
  const contents = wrapChildrenInText(Text, props)

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
          {Boolean(title || subTitle) ? (
            <YStack flex={1}>
              <Title>{title}</Title>
              {subTitle ? (
                typeof subTitle === 'string' ? (
                  // TODO can use theme but we need to standardize to alt themes
                  // or standardize on subtle colors in themes
                  <Subtitle size={subtitleSize}>{subTitle}</Subtitle>
                ) : (
                  subTitle
                )
              ) : null}
              {contents}
            </YStack>
          ) : (
            contents
          )}
          {themedIconAfter ? (
            <>
              <Spacer flex size={spaceSize} />
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
  return <ListItemFrame ref={ref} {...listItemProps} />
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
  ListItemFrame.extractable(themeable(ListItemComponent), listItemStaticConfig),
  {
    Text: ListItemText,
    Subtitle: ListItemSubtitle,
  }
)
