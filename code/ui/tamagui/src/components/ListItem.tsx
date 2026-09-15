// Styled ListItem = @tamagui/ui's list-item behavior and parts + the default
// v2-look skin (theme palette, border, cursor, hover/press color, the outlined
// and active appearances, disabled dimming) and the size table. @tamagui/ui
// ships no ListItem of its own: it exposes `useListItem` and the frame, text,
// title, subtitle, and icon parts, and a skin decides the rest. This is the
// single skin definition — the shadcn registry item is generated from this file.
import { createStyledHOC, type GetProps, styled, withStaticProperties } from '@tamagui/core'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import {
  type ListItemBehaviorProps,
  ListItemContext,
  ListItemFrame as ListItemBehaviorFrame,
  ListItemIcon as ListItemBehaviorIcon,
  type ListItemIconProps as ListItemBehaviorIconProps,
  ListItemSubtitle as ListItemBehaviorSubtitle,
  ListItemText as ListItemBehaviorText,
  ListItemTitle as ListItemBehaviorTitle,
  useListItem,
} from '@tamagui/list-item'

export type ListItemSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | boolean

const listItemFrameSize = {
  xs: { paddingInline: '2', paddingBlock: '1', gap: '1' },
  sm: { paddingInline: '3', paddingBlock: '1.5', gap: '1.5' },
  md: { paddingInline: '4', paddingBlock: '2', gap: '2' },
  lg: { paddingInline: '6', paddingBlock: '2', gap: '2' },
  xl: { paddingInline: '8', paddingBlock: '2.5', gap: '2.5' },
} as const

const listItemTextSize = {
  xs: { fontSize: 'xs', lineHeight: 'xs' },
  sm: { fontSize: 'sm', lineHeight: 'sm' },
  md: { fontSize: 'sm', lineHeight: 'sm' },
  lg: { fontSize: 'base', lineHeight: 'base' },
  xl: { fontSize: 'lg', lineHeight: 'lg' },
} as const

// the subtitle sits one step below the title
const listItemSubtitleSize = {
  xs: { fontSize: 'xs', lineHeight: 'xs' },
  sm: { fontSize: 'xs', lineHeight: 'xs' },
  md: { fontSize: 'sm', lineHeight: 'sm' },
  lg: { fontSize: 'sm', lineHeight: 'sm' },
  xl: { fontSize: 'base', lineHeight: 'base' },
} as const

const listItemIconSize = {
  xs: 12,
  sm: 16,
  md: 16,
  lg: 16,
  xl: 20,
} as const

// icon px for an explicit size: numbers pass through, skin size names read
// the table, anything else is the default
const resolveListItemIconPx = (size: unknown): number | undefined => {
  if (typeof size === 'number') return size
  if (typeof size === 'string' && size in listItemIconSize) {
    return listItemIconSize[size as keyof typeof listItemIconSize]
  }
  return undefined
}

// the additive-border "outlined" appearance (formerly themeableVariantStyles.outlined
// from ThemeableStack, now removed from the behavior package).
const outlined = {
  backgroundColor: 'transparent hover:transparent press:transparent',
  borderWidth: 1,
  borderColor: 'border-color hover:border-color-hover press:border-color-press',
} as const

export const ListItemFrame = styled(ListItemBehaviorFrame, {
  context: ListItemContext,
  displayName: 'ListItem',
  backgroundColor: 'background hover:background-hover press:background-press',
  borderColor: 'border-color hover:border-color-hover press:border-color-press',
  color: 'color',
  cursor: 'default',

  variants: {
    size: {
      ...listItemFrameSize,
      true: listItemFrameSize.md,
    },

    variant: {
      outlined,
    },

    active: {
      true: {
        backgroundColor: 'hover:background',
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
    size: 'md',
  },
})

export const ListItemText = styled(ListItemBehaviorText, {
  context: ListItemContext,
  displayName: 'ListItemText',
  variants: {
    size: {
      ...listItemTextSize,
      true: listItemTextSize.md,
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const ListItemTitle = styled(ListItemBehaviorTitle, {
  context: ListItemContext,
  displayName: 'ListItemTitle',
  variants: {
    size: {
      ...listItemTextSize,
      true: listItemTextSize.md,
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const ListItemSubtitle = styled(ListItemBehaviorSubtitle, {
  context: ListItemContext,
  displayName: 'ListItemSubtitle',
  variants: {
    size: {
      ...listItemSubtitleSize,
      true: listItemSubtitleSize.md,
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const ListItemIcon = ({
  children,
  size,
  scaleIcon = 1,
}: ListItemBehaviorIconProps) => {
  const context = ListItemContext.useStyledContext()
  const getThemedIcon = useGetThemedIcon({
    size:
      (resolveListItemIconPx(size ?? context.size) ?? listItemIconSize.md) * scaleIcon,
    color: context.color,
  })

  return getThemedIcon(children)
}

const ListItemComponent = createStyledHOC(
  ListItemFrame,
  function ListItem(props: ListItemBehaviorProps, ref) {
    // the `icon` prop is themed here, before the frame renders, so the skin
    // resolves its px up front instead of reading them back off the context
    const contextSize = ListItemContext.useStyledContext()?.size
    const size = props.size ?? contextSize ?? 'md'
    const scaleIcon = props.scaleIcon ?? 1
    const iconSize =
      props.iconSize ??
      (resolveListItemIconPx(size) ?? listItemIconSize.md) * scaleIcon
    const { props: listItemProps } = useListItem({
      ...props,
      iconSize,
      scaleIcon: props.iconSize == null ? 1 : scaleIcon,
    })
    return <ListItemFrame ref={ref} {...listItemProps} />
  }
)

export const ListItem = withStaticProperties(ListItemComponent, {
  Apply: ListItemContext.Provider,
  Frame: ListItemFrame,
  Icon: ListItemIcon,
  Subtitle: ListItemSubtitle,
  Text: ListItemText,
  Title: ListItemTitle,
})

export type ListItemProps = GetProps<typeof ListItemComponent>
