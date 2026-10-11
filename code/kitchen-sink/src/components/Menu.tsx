import { Menu as MenuBehavior } from '@tamagui/menu'
import type { ComponentProps } from 'react'
import { styled, withStaticProperties } from 'tamagui'

const contentStyles = {
  displayName: 'KitchenSinkMenuContent',
  minWidth: 180,
  padding: '1-5',
  backgroundColor: 'background',
  borderColor: 'border-color',
  borderRadius: '4',
  borderWidth: 1,
  boxShadow: '0 4px 12px shadow-color',
} as const

const itemStyles = {
  displayName: 'KitchenSinkMenuItem',
  width: '100%',
  paddingHorizontal: '2-5',
  paddingVertical: '2',
  alignItems: 'center',
  flexDirection: 'row',
  borderRadius: '2',
  cursor: 'pointer',
  backgroundColor: 'press:background-press focus:background-hover',

  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.45,
      },
    },
  },
} as const

const MenuContent = styled(MenuBehavior.Content, contentStyles)
const MenuSubContent = styled(MenuBehavior.SubContent, contentStyles)
const MenuItem = styled(MenuBehavior.Item, itemStyles)
const MenuCheckboxItem = styled(MenuBehavior.CheckboxItem, itemStyles)
const MenuRadioItem = styled(MenuBehavior.RadioItem, itemStyles)
const MenuSubTrigger = styled(MenuBehavior.SubTrigger, itemStyles)
const MenuItemTitle = styled(MenuBehavior.ItemTitle, {
  displayName: 'KitchenSinkMenuItemTitle',
  color: 'color',
  cursor: 'default',
  flexGrow: 1,
  flexShrink: 1,
})
const MenuItemSubtitle = styled(MenuBehavior.ItemSubtitle, {
  displayName: 'KitchenSinkMenuItemSubtitle',
  color: 'color',
  cursor: 'default',
  opacity: 0.6,
})
const MenuItemIcon = styled(MenuBehavior.ItemIcon, {
  displayName: 'KitchenSinkMenuItemIcon',
  width: 20,
  height: 20,
  marginLeft: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
})
const MenuItemIndicator = styled(MenuBehavior.ItemIndicator, {
  displayName: 'KitchenSinkMenuItemIndicator',
  marginLeft: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
})
const MenuGroup = styled(MenuBehavior.Group, {
  displayName: 'KitchenSinkMenuGroup',
  width: '100%',
})
const MenuLabel = styled(MenuBehavior.Label, {
  displayName: 'KitchenSinkMenuLabel',
  paddingHorizontal: '2-5',
  paddingVertical: '1-5',
  color: 'color',
  cursor: 'default',
  opacity: 0.6,
})
const MenuSeparator = styled(MenuBehavior.Separator, {
  displayName: 'KitchenSinkMenuSeparator',
  height: 1,
  marginHorizontal: '2',
  marginVertical: '1',
  backgroundColor: 'border-color',
})
const MenuArrow = styled(MenuBehavior.Arrow, {
  displayName: 'KitchenSinkMenuArrow',
  backgroundColor: 'background',
  borderColor: 'border-color',
  borderWidth: 1,
})
const MenuScrollView = styled(MenuBehavior.ScrollView, {
  displayName: 'KitchenSinkMenuScrollView',
  padding: '1',
})

const MenuRoot = (props: ComponentProps<typeof MenuBehavior>) => (
  <MenuBehavior {...props} />
)

export const Menu = withStaticProperties(MenuRoot, {
  Trigger: MenuBehavior.Trigger,
  Portal: MenuBehavior.Portal,
  Content: MenuContent,
  Group: MenuGroup,
  Label: MenuLabel,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuBehavior.RadioGroup,
  RadioItem: MenuRadioItem,
  ItemIndicator: MenuItemIndicator,
  Separator: MenuSeparator,
  Arrow: MenuArrow,
  Sub: MenuBehavior.Sub,
  SubTrigger: MenuSubTrigger,
  SubContent: MenuSubContent,
  ItemTitle: MenuItemTitle,
  ItemSubtitle: MenuItemSubtitle,
  ItemIcon: MenuItemIcon,
  ItemImage: MenuBehavior.ItemImage,
  ScrollView: MenuScrollView,
}) as unknown as typeof MenuBehavior
