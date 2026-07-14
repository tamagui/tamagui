import { ContextMenu as ContextMenuBehavior } from '@tamagui/context-menu'
import { Menu as MenuBehavior } from '@tamagui/menu'
import React from 'react'
import { styled, withStaticProperties } from 'tamagui'

const contentStyles = {
  name: 'DemoMenuContent',
  minWidth: 180,
  padding: '$1.5',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderRadius: '$4',
  borderWidth: 1,
  boxShadow: '0 4px 12px $shadowColor',
} as const

const itemStyles = {
  name: 'DemoMenuItem',
  width: '100%',
  paddingHorizontal: '$2.5',
  paddingVertical: '$2',
  alignItems: 'center',
  flexDirection: 'row',
  borderRadius: '$2',
  cursor: 'pointer',

  focusStyle: {
    backgroundColor: '$backgroundHover',
  },

  pressStyle: {
    backgroundColor: '$backgroundPress',
  },

  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.45,
      },
    },
  },
} as const

const titleStyles = {
  name: 'DemoMenuItemTitle',
  color: '$color',
  cursor: 'default',
  flexGrow: 1,
  flexShrink: 1,
} as const

const subtitleStyles = {
  name: 'DemoMenuItemSubtitle',
  color: '$color',
  opacity: 0.6,
  cursor: 'default',
} as const

const iconStyles = {
  name: 'DemoMenuItemIcon',
  width: 20,
  height: 20,
  marginLeft: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
} as const

const indicatorStyles = {
  name: 'DemoMenuItemIndicator',
  marginLeft: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
} as const

const separatorStyles = {
  name: 'DemoMenuSeparator',
  height: 1,
  marginHorizontal: '$2',
  marginVertical: '$1',
  backgroundColor: '$borderColor',
} as const

const labelStyles = {
  name: 'DemoMenuLabel',
  paddingHorizontal: '$2.5',
  paddingVertical: '$1.5',
  color: '$color',
  opacity: 0.6,
  cursor: 'default',
} as const

const groupStyles = {
  name: 'DemoMenuGroup',
  width: '100%',
} as const

const MenuContent = styled(MenuBehavior.Content, contentStyles)
const MenuSubContent = styled(MenuBehavior.SubContent, contentStyles)
const MenuGroup = styled(MenuBehavior.Group, groupStyles)
const MenuLabel = styled(MenuBehavior.Label, labelStyles)
const MenuItem = styled(MenuBehavior.Item, itemStyles)
const MenuCheckboxItem = styled(MenuBehavior.CheckboxItem, itemStyles)
const MenuRadioItem = styled(MenuBehavior.RadioItem, itemStyles)
const MenuSubTrigger = styled(MenuBehavior.SubTrigger, itemStyles)
const MenuItemTitle = styled(MenuBehavior.ItemTitle, titleStyles)
const MenuItemSubtitle = styled(MenuBehavior.ItemSubtitle, subtitleStyles)
const MenuItemIcon = styled(MenuBehavior.ItemIcon, iconStyles)
const MenuItemIndicator = styled(MenuBehavior.ItemIndicator, indicatorStyles)
const MenuSeparator = styled(MenuBehavior.Separator, separatorStyles)
const MenuArrow = styled(MenuBehavior.Arrow, {
  name: 'DemoMenuArrow',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderWidth: 1,
})
const MenuScrollView = styled(MenuBehavior.ScrollView, {
  name: 'DemoMenuScrollView',
  padding: '$1',
})

const MenuRoot = (props: React.ComponentProps<typeof MenuBehavior>) => (
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

const ContextMenuContent = styled(ContextMenuBehavior.Content, contentStyles)
const ContextMenuSubContent = styled(ContextMenuBehavior.SubContent, contentStyles)
const ContextMenuGroup = styled(ContextMenuBehavior.Group, groupStyles)
const ContextMenuLabel = styled(ContextMenuBehavior.Label, labelStyles)
const ContextMenuItem = styled(ContextMenuBehavior.Item, itemStyles)
const ContextMenuCheckboxItem = styled(ContextMenuBehavior.CheckboxItem, itemStyles)
const ContextMenuRadioItem = styled(ContextMenuBehavior.RadioItem, itemStyles)
const ContextMenuSubTrigger = styled(ContextMenuBehavior.SubTrigger, itemStyles)
const ContextMenuItemTitle = styled(ContextMenuBehavior.ItemTitle, titleStyles)
const ContextMenuItemSubtitle = styled(ContextMenuBehavior.ItemSubtitle, subtitleStyles)
const ContextMenuItemIcon = styled(ContextMenuBehavior.ItemIcon, iconStyles)
const ContextMenuItemIndicator = styled(
  ContextMenuBehavior.ItemIndicator,
  indicatorStyles
)
const ContextMenuSeparator = styled(ContextMenuBehavior.Separator, separatorStyles)
const ContextMenuArrow = styled(ContextMenuBehavior.Arrow, {
  name: 'DemoContextMenuArrow',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderWidth: 1,
})

const ContextMenuRoot = (props: React.ComponentProps<typeof ContextMenuBehavior>) => (
  <ContextMenuBehavior {...props} />
)

export const ContextMenu = withStaticProperties(ContextMenuRoot, {
  Trigger: ContextMenuBehavior.Trigger,
  Portal: ContextMenuBehavior.Portal,
  Content: ContextMenuContent,
  Preview: ContextMenuBehavior.Preview,
  Group: ContextMenuGroup,
  Label: ContextMenuLabel,
  Item: ContextMenuItem,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuBehavior.RadioGroup,
  RadioItem: ContextMenuRadioItem,
  ItemIndicator: ContextMenuItemIndicator,
  Separator: ContextMenuSeparator,
  Arrow: ContextMenuArrow,
  Sub: ContextMenuBehavior.Sub,
  SubTrigger: ContextMenuSubTrigger,
  SubContent: ContextMenuSubContent,
  ItemTitle: ContextMenuItemTitle,
  ItemSubtitle: ContextMenuItemSubtitle,
  ItemIcon: ContextMenuItemIcon,
  ItemImage: ContextMenuBehavior.ItemImage,
}) as unknown as typeof ContextMenuBehavior
