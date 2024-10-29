import { getFontSize } from '@tamagui/font-size'
import { getFontSized } from '@tamagui/get-font-sized'
import { getSize, getSpace } from '@tamagui/get-token'
import { withStaticProperties } from '@tamagui/helpers'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ThemeableStack, YStack } from '@tamagui/stacks'
import type { TextParentStyles } from '@tamagui/text'
import { SizableText, wrapChildrenInText } from '@tamagui/text'
import type {
  FontSizeTokens,
  GetProps,
  PropsWithoutMediaStyles,
  SizeTokens,
  ThemeableProps,
} from '@tamagui/web'
import { Spacer, getTokens, getVariableValue, styled, useProps } from '@tamagui/web'
import type { FunctionComponent, ReactNode } from 'react'

type ListItemIconProps = { color?: any; size?: any }
type IconProp = JSX.Element | FunctionComponent<ListItemIconProps> | null

export type ListItemExtraProps = Omit<TextParentStyles, 'TextComponent' | 'noTextWrap'> &
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
    title?: ReactNode
    /**
     * subtitle
     */
    subTitle?: ReactNode
    /**
     * will not wrap text around `children` only, "all" will not wrap title or subTitle
     */
    noTextWrap?: boolean | 'all'
  }

export type ListItemProps = GetProps<typeof ListItemFrame> & ListItemExtraProps

const NAME = 'ListItem'

export const ListItemFrame = styled(ThemeableStack, {
  name: NAME,
  tag: 'li',

  variants: {
    unstyled: {
      false: {
        size: '$true',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        width: '100%',
        borderColor: '$borderColor',
        maxWidth: '100%',
        overflow: 'hidden',
        flexDirection: 'row',
        backgroundColor: '$background',
        cursor: 'default',
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
        // TODO breaking types
        pointerEvents: 'none' as any,
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export const ListItemText = styled(SizableText, {
  name: 'ListItemText',

  variants: {
    unstyled: {
      false: {
        color: '$color',
        size: '$true',
        flexGrow: 1,
        flexShrink: 1,
        ellipse: true,
        cursor: 'inherit',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export const ListItemSubtitle = styled(ListItemText, {
  name: 'ListItemSubtitle',

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
        const fontStyle = getFontSized(oneSmaller.key as FontSizeTokens, extras)
        return fontStyle
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export const ListItemTitle = styled(ListItemText, {
  name: 'ListItemTitle',
})

export const useListItem = (
  propsIn: ListItemProps,
  {
    Text = ListItemText,
    Subtitle = ListItemSubtitle,
    Title = ListItemTitle,
  }: {
    Title?: any
    Subtitle?: any
    Text?: any
  } = { Text: ListItemText, Subtitle: ListItemSubtitle, Title: ListItemTitle }
): { props: PropsWithoutMediaStyles<ListItemProps> } => {
  // careful not to destructure and re-order props, order is important
  const props = useProps(propsIn, {
    resolveValues: 'none',
  })

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
    unstyled = false,
    subTitle,
    title,

    // text props
    color,
    fontWeight,
    fontSize,
    fontFamily,
    letterSpacing,
    textAlign,
    ellipse,

    ...rest
  } = props

  const textProps = {
    color,
    fontWeight,
    fontSize,
    fontFamily,
    letterSpacing,
    textAlign,
    ellipse,
    children,
  }

  const size = props.size || '$true'
  const iconSize = getFontSize(size as any) * scaleIcon
  const getThemedIcon = useGetThemedIcon({ size: iconSize, color: color as any })
  const [themedIcon, themedIconAfter] = [icon, iconAfter].map(getThemedIcon)
  const sizeToken = getTokens().space[props.space as any] ?? iconSize
  const spaceSize = getVariableValue(sizeToken) * scaleSpace

  const contents = wrapChildrenInText(Text, textProps)

  return {
    props: {
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
          {/* biome-ignore lint/complexity/noExtraBooleanCast: <explanation> */}
          {Boolean(title || subTitle) ? (
            <YStack flex={1}>
              {noTextWrap === 'all' ? title : <Title size={size}>{title}</Title>}
              {subTitle ? (
                <>
                  {typeof subTitle === 'string' && noTextWrap !== 'all' ? (
                    // TODO can use theme but we need to standardize to alt themes
                    // or standardize on subtle colors in themes
                    <Subtitle unstyled={unstyled} size={size}>
                      {subTitle}
                    </Subtitle>
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

const ListItemComponent = ListItemFrame.styleable<ListItemExtraProps>(
  function ListItem(props, ref) {
    const { props: listItemProps } = useListItem(props)
    return <ListItemFrame ref={ref} {...listItemProps} />
  }
)

export const ListItem = withStaticProperties(ListItemComponent, {
  Text: ListItemText,
  Subtitle: ListItemSubtitle,
})
