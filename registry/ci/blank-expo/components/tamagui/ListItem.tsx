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
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '$borderColor',
  hoverStyle: {
    backgroundColor: 'transparent',
    borderColor: '$borderColorHover',
  },
  pressStyle: {
    backgroundColor: 'transparent',
    borderColor: '$borderColorPress',
  },
} as const

const StyledListItem = styled(UiListItem, {
  name: 'ListItem',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  color: '$color',
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
      outlined,
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

export const ListItem = withStaticProperties(StyledListItem, {
  Apply: UiListItem.Apply,
  Frame: UiListItem.Frame,
  Text: UiListItem.Text,
  Subtitle: UiListItem.Subtitle,
  Icon: UiListItem.Icon,
  Title: UiListItem.Title,
})

export type ListItemProps = GetProps<typeof StyledListItem>
