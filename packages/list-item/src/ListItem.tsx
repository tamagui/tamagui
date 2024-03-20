import { getFontSize } from '@tamagui/font-size'
import { getFontSized } from '@tamagui/get-font-sized'
import { getSize, getSpace } from '@tamagui/get-token'
import { withStaticProperties } from '@tamagui/helpers'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ThemeableStack, YStack } from '@tamagui/stacks'
import type { TextParentStyles } from '@tamagui/text'
import { SizableText, wrapChildrenInText } from '@tamagui/text'
import type {
  ColorTokens,
  FontSizeTokens,
  GetProps,
  PropsWithoutMediaStyles,
  SizeTokens,
  ThemeableProps,
} from '@tamagui/web'
import {
  Spacer,
  View,
  createStyledContext,
  getTokens,
  getVariableValue,
  styled,
  useProps,
} from '@tamagui/web'
import type { FunctionComponent } from 'react'
import React from 'react'

type ListItemIconProps = { color?: any; size?: any }
type IconProp = JSX.Element | FunctionComponent<ListItemIconProps> | null

const ListItemContext = createStyledContext<{
  size?: SizeTokens
  color?: ColorTokens
}>({
  color: '$color',
  size: '$true',
})

export type ListItemExtraProps = Omit<TextParentStyles, 'TextComponent' | 'noTextWrap'> &
  ThemeableProps & {
    /**
     * @deprecated use ListItem.Icon instead
     */
    icon?: IconProp
    /**
     * @deprecated use ListItem.Icon instead
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
     * @deprecated use ListItem.Title instead
     */
    title?: React.ReactNode
    /**
     * subtitle
     * @deprecated use ListItem.Subtitle instead
     */
    subTitle?: React.ReactNode
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
  context: ListItemContext,

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
          gap: tokens.space[val],
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
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export const ListItemText = styled(SizableText, {
  name: 'ListItemText',
  context: ListItemContext,

  variants: {
    unstyled: {
      false: {
        color: '$color',
        size: '$true',
        flexGrow: 1,
        flexShrink: 1,
        ellipse: true,
        cursor: 'default',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export const ListItemSubtitle = styled(ListItemText, {
  name: 'ListItemSubtitle',
  context: ListItemContext,

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
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export const ListItemTitle = styled(ListItemText, {
  name: 'ListItemTitle',
  context: ListItemContext,
})

export const IconFrame = styled(View, {
  context: ListItemContext,

  variants: {
    after: {
      true: {
        marginLeft: 'auto',
      },
    },
  } as const,
})

export const ListItemIcon = IconFrame.styleable<{ scaleIcon?: number }>((props) => {
  const { children, scaleIcon = 1 } = props
  const { size, color } = ListItemContext.useStyledContext()

  const iconSize =
    (typeof size === 'number' ? size * 0.5 : getFontSize(size as FontSizeTokens)) *
    scaleIcon

  const getThemedIcon = useGetThemedIcon({ size: iconSize, color: color as any })
  return <IconFrame>{getThemedIcon(children)}</IconFrame>
})

export const TextContent = styled(View, {
  marginRight: 'auto',
  flex: 1,
})
