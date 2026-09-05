import { getFontSized } from '@tamagui/get-font-sized'
import { getThemedIconSize, useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { oneSizeSmaller, resolveSize } from '@tamagui/size'
import { YStack } from '@tamagui/stacks'
import type { TextParentStyles } from '@tamagui/text'
import { SizableText, textParentProps, wrapChildrenInText } from '@tamagui/text'
import type { ColorTokens, FontSizeTokens, GetProps, SizeTokens } from '@tamagui/web'
import { createStyledContext, splitStyleProps, styled, View } from '@tamagui/web'
import type { FunctionComponent, JSX, ReactNode } from 'react'

type IconProp = JSX.Element | FunctionComponent<{ color?: any; size?: any }> | null

/**
 * The three props every part shares. A styled component that declares this
 * context reads these from an ancestor and, for any it was passed directly,
 * republishes them to its own descendants — which is the whole mechanism for
 * getting size and color from a ListItem down to its text and icons.
 */
export const ListItemContext = createStyledContext<{
  size?: SizeTokens | true
  variant?: 'outlined'
  color?: ColorTokens | string
}>({
  size: undefined,
  variant: undefined,
  color: undefined,
})

export const listItemSizeVariant = styled.dynamic<SizeTokens | true>((val, env) => {
  const { frame } = resolveSize(val, env)
  return {
    minHeight: frame.minHeight,
    paddingHorizontal: frame.paddingHorizontal,
    paddingVertical: frame.paddingVertical,
    gap: frame.gap,
  }
})

const listItemSubtitleSizeVariant = styled.dynamic<SizeTokens | true>((val, env) => {
  return getFontSized(oneSizeSmaller(val, env.sizes) as FontSizeTokens, env)
})

// structural layout, the size mechanism, and the disabled pointer-event block.
// theme decoration (palette, border, cursor, the outlined/active appearance,
// disabled dimming) lives in a skin — see tamagui's components/ListItem.tsx
export const ListItemFrame = styled(View, {
  context: ListItemContext,
  displayName: 'ListItemFrame',
  // role is the cross-platform one; render only lands on web
  role: 'listitem',
  render: 'li',
  size: true,
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'nowrap',
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  flexDirection: 'row',

  variants: {
    size: listItemSizeVariant,

    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  } as const,
})

export const ListItemText = styled(SizableText, {
  context: ListItemContext,
  displayName: 'ListItemText',
  size: true,
  flexGrow: 1,
  flexShrink: 1,
  ellipsis: true,
  cursor: 'inherit',
})

export const ListItemSubtitle = styled(ListItemText, {
  context: ListItemContext,
  displayName: 'ListItemSubtitle',
  opacity: 0.6,
  maxWidth: '100%',

  variants: {
    size: listItemSubtitleSizeVariant,
  } as const,
})

export const ListItemTitle = styled(ListItemText, {
  context: ListItemContext,
  displayName: 'ListItemTitle',
})

export type ListItemIconProps = {
  children: ReactNode
  size?: SizeTokens | true
  scaleIcon?: number
}

export const ListItemIcon = ({ children, size, scaleIcon = 1 }: ListItemIconProps) => {
  const context = ListItemContext.useStyledContext()
  const getThemedIcon = useGetThemedIcon({
    size: getThemedIconSize(size ?? context.size ?? true, scaleIcon),
    color: context.color,
  })

  return getThemedIcon(children)
}

/**
 * The props `useListItem` reads and replaces, so exactly what its result omits.
 */
type ListItemConsumedProps = {
  children?: ReactNode
  icon?: IconProp
  iconAfter?: IconProp
  iconSize?: SizeTokens | true
  scaleIcon?: number
  subTitle?: ReactNode
  title?: ReactNode
}

export type ListItemBehaviorProps = TextParentStyles &
  ListItemConsumedProps & {
    // read to theme an `icon` prop, then passed through untouched: the frame
    // declares the styled context, so it is what publishes these to the parts
    color?: ColorTokens | string
    size?: SizeTokens | true
  }

/**
 * What `useListItem` returns: the caller's props minus the ones it consumed.
 * Spelled out rather than cast, so a skin that spreads the result onto a frame
 * is type-checked on exactly what it will receive.
 */
export type UseListItemProps<Props extends ListItemBehaviorProps> = Omit<
  Omit<Props, keyof TextParentStyles | keyof typeof textParentProps>,
  keyof ListItemConsumedProps
> & {
  children: ReactNode
  color?: Props['color']
}

/**
 * ListItem behavior: theming the icon props and assembling title, subtitle, and
 * children into the frame's single child. Flat text styles are handed directly
 * to generated text, while size and color still reach the parts through the
 * styled context.
 */
export function useListItem<Props extends ListItemBehaviorProps>(
  propsIn: Props
): { props: UseListItemProps<Props> } {
  const [wrappedTextProps, listItemProps] = splitStyleProps(propsIn, {
    expandShorthands: true,
    filter: textParentProps,
  })
  const {
    children,
    icon,
    iconAfter,
    iconSize,
    scaleIcon = 1,
    subTitle,
    title,
    ...frameProps
  } = listItemProps
  const { noTextWrap, textProps, ...textStyleProps } = wrappedTextProps

  // the frame publishes size and color to every part below it, but an `icon`
  // prop is themed here, before the frame renders, so it reads them itself
  const context = ListItemContext.useStyledContext()
  const getThemedIcon = useGetThemedIcon({
    size: getThemedIconSize(iconSize ?? propsIn.size ?? context.size ?? true, scaleIcon),
    color: propsIn.color ?? context.color,
  })

  const wrappedChildren = wrapChildrenInText(
    ListItemText,
    { children, noTextWrap, textProps },
    textStyleProps
  )

  return {
    props: {
      ...frameProps,
      color: propsIn.color,
      children: (
        <>
          {icon ? getThemedIcon(icon) : null}
          {title || subTitle ? (
            <YStack flex={1}>
              {typeof title === 'string' ? (
                <ListItemTitle {...textStyleProps} {...textProps}>
                  {title}
                </ListItemTitle>
              ) : (
                title
              )}
              {typeof subTitle === 'string' ? (
                <ListItemSubtitle {...textStyleProps} {...textProps}>
                  {subTitle}
                </ListItemSubtitle>
              ) : (
                subTitle
              )}
              {wrappedChildren}
            </YStack>
          ) : (
            wrappedChildren
          )}
          {iconAfter ? getThemedIcon(iconAfter) : null}
        </>
      ),
    },
  }
}

export type ListItemFrameProps = GetProps<typeof ListItemFrame>
