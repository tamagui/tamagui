// Styled ToggleGroup = the unstyled @tamagui/ui ToggleGroup behavior + the
// default v2-look skin on its Item (theme palette, border, hover/press/focus
// color styling, and the default "active" appearance via the Item's `activeStyle`
// prop). The behavior frame keeps only structural layout + the size mechanism.
// Single skin definition; the shadcn registry item is generated from this file.
import {
  type GetProps,
  styled,
  ToggleGroup as UiToggleGroup,
  withStaticProperties,
} from '@tamagui/ui'

// default appearance for an active (pressed-on) item — applied by the Toggle
// behavior through its `activeStyle` prop when the item is active.
const activeAppearance = {
  backgroundColor: '$backgroundPress',
  hoverStyle: {
    backgroundColor: '$backgroundPress',
  },
  focusStyle: {
    backgroundColor: '$backgroundPress',
  },
} as const

export const ToggleGroupItem = styled(UiToggleGroup.Item, {
  name: 'ToggleGroupItem',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderWidth: 1,
  margin: -1,
  activeStyle: activeAppearance,

  hoverStyle: {
    backgroundColor: '$backgroundHover',
    borderColor: '$borderColorHover',
  },
  pressStyle: {
    backgroundColor: '$backgroundPress',
    borderColor: '$borderColorPress',
  },
  focusVisibleStyle: {
    outlineColor: '$outlineColor',
    outlineWidth: 2,
    outlineStyle: 'solid',
    zIndex: 10,
  },
})

export const ToggleGroup = withStaticProperties(UiToggleGroup, {
  Item: ToggleGroupItem,
})

export type ToggleGroupItemProps = GetProps<typeof ToggleGroupItem>
