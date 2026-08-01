// Styled ListItem = the unstyled @tamagui/ui ListItem behavior + the default
// v2-look skin (theme palette, border, cursor, hover/press color styling, text
// color via the styled context, the outlined/active appearance, and disabled
// dimming). The behavior keeps structural layout + the size mechanism + the
// disabled pointer-event block. Single skin definition; the shadcn registry item
// is generated from this file.
import {
  type GetProps,
  ListItem as UiListItem,
  styled,
  withStaticProperties,
} from '@tamagui/ui'

// the additive-border "outlined" appearance (formerly themeableVariantStyles.outlined
// from ThemeableStack, now removed from the behavior package).
const outlined = {
  backgroundColor: 'transparent hover:transparent press:transparent',
  borderWidth: 1,
  borderColor: 'border-color hover:border-color-hover press:border-color-press',
} as const

const StyledListItem = styled(UiListItem, {
  name: 'ListItem',
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

export const ListItem = withStaticProperties(StyledListItem, {
  Apply: UiListItem.Apply,
  Frame: UiListItem.Frame,
  Text: UiListItem.Text,
  Subtitle: UiListItem.Subtitle,
  Icon: UiListItem.Icon,
  Title: UiListItem.Title,
})

export type ListItemProps = GetProps<typeof StyledListItem>
