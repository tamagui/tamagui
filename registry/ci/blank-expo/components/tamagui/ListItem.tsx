// Styled ListItem = @tamagui/ui's list-item behavior and parts + the default
// v2-look skin (theme palette, border, cursor, hover/press color, the outlined
// and active appearances, disabled dimming). @tamagui/ui ships no ListItem of
// its own: it exposes `useListItem` and the frame, text, title, subtitle, and
// icon parts, and a skin decides the rest. This is the single skin definition —
// the shadcn registry item is generated from this file.
import {
  createStyledHOC,
  type GetProps,
  type ListItemBehaviorProps,
  ListItemContext,
  ListItemFrame as ListItemBehaviorFrame,
  ListItemIcon,
  ListItemSubtitle,
  ListItemText,
  ListItemTitle,
  styled,
  useListItem,
  withStaticProperties,
} from '@tamagui/ui'

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
})

const ListItemComponent = createStyledHOC(
  ListItemFrame,
  function ListItem(props: ListItemBehaviorProps, ref) {
    const { props: listItemProps } = useListItem(props)
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
