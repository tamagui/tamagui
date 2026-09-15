// Styled ListItem = @tamagui/ui's list-item behavior and parts + the default
// v2-look skin (theme palette, border, cursor, hover/press color, the outlined
// and active appearances, disabled dimming) and the size table. @tamagui/ui
// ships no ListItem of its own: it exposes `useListItem` and the frame, text,
// title, subtitle, and icon parts, and a skin decides the rest. This is the
// single skin definition — the shadcn registry item is generated from this file.
import {
  createStyledHOC,
  type GetProps,
  getSizing,
  resolveSizing,
  type SizeName,
  styled,
  withStaticProperties,
} from '@tamagui/core'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import {
  type ListItemBehaviorProps,
  ListItemContext,
  ListItemFrame as ListItemBehaviorFrame,
  type ListItemIconProps as ListItemBehaviorIconProps,
  ListItemSubtitle as ListItemBehaviorSubtitle,
  ListItemText as ListItemBehaviorText,
  ListItemTitle as ListItemBehaviorTitle,
  useListItem,
} from '@tamagui/list-item'

export type ListItemSize = SizeName | boolean

// frame geometry and text derive from the config sizing ladder, the same rungs
// Button uses
const listItemFrameSize = styled.dynamic<ListItemSize>((val, env) => {
  const sizing = resolveSizing(val, env)
  return {
    paddingInline: sizing.paddingInline,
    paddingBlock: sizing.paddingBlock,
    gap: sizing.gap,
  }
})

const listItemTextSize = styled.dynamic<ListItemSize>((val, env) => {
  const sizing = resolveSizing(val, env)
  return { fontSize: sizing.fontSize, lineHeight: sizing.lineHeight }
})

// the subtitle sits one step below the title on the type scale, keyed by the
// title font key so custom rungs keep their own title size
const subtitleFontSize: Record<string, string> = {
  xs: 'xs',
  sm: 'xs',
  base: 'sm',
  lg: 'base',
}

const listItemSubtitleSize = styled.dynamic<ListItemSize>((val, env) => {
  const sizing = resolveSizing(val, env)
  const fontSize = subtitleFontSize[sizing.fontSize] ?? sizing.fontSize
  return { fontSize, lineHeight: fontSize }
})

// icon px for an explicit size: numbers pass through, skin size names read
// the config ladder, absent names the default
const resolveListItemIconPx = (size: number | string | boolean | undefined): number => {
  if (typeof size === 'number') return size
  return getSizing(size as ListItemSize).icon
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
    size: listItemFrameSize,

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
    size: listItemTextSize,
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const ListItemTitle = styled(ListItemBehaviorTitle, {
  context: ListItemContext,
  displayName: 'ListItemTitle',
  variants: {
    size: listItemTextSize,
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const ListItemSubtitle = styled(ListItemBehaviorSubtitle, {
  context: ListItemContext,
  displayName: 'ListItemSubtitle',
  variants: {
    size: listItemSubtitleSize,
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
    size: resolveListItemIconPx(size ?? context.size) * scaleIcon,
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
    const iconSize = props.iconSize ?? resolveListItemIconPx(size) * scaleIcon
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
