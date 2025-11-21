import { withStaticProperties } from '@tamagui/core'
import type { FC } from 'react'

import type {
  ContextMenuPreviewProps,
  MenuArrowProps,
  MenuCheckboxItemProps,
  MenuContentProps,
  MenuGroupProps,
  MenuItemIconProps,
  MenuItemImageProps,
  MenuItemIndicatorProps,
  MenuItemProps,
  MenuItemSubtitleProps,
  MenuItemTitleProps,
  MenuLabelProps,
  MenuProps,
  MenuSeparatorProps,
  MenuSubContentProps,
  MenuSubProps,
  MenuSubTriggerProps,
  MenuTriggerProps,
} from './createNativeMenuTypes'

export const createNativeMenu = (MenuType: 'ContextMenu' | 'DropdownMenu') => {
  const Menu = {} as FC<MenuProps>

  const Trigger = {} as FC<MenuTriggerProps>

  const Content = {} as FC<MenuContentProps>
  const Preview = {} as FC<ContextMenuPreviewProps>

  const Item = {} as FC<MenuItemProps>

  const ItemIcon = {} as FC<MenuItemIconProps>

  const ItemImage = {} as FC<MenuItemImageProps>

  const SubTrigger = {} as FC<MenuSubTriggerProps>

  const ItemTitle = {} as FC<MenuItemTitleProps>

  const ItemSubtitle = {} as FC<MenuItemSubtitleProps>

  const Group = {} as FC<MenuGroupProps>

  const Separator = {} as FC<MenuSeparatorProps>

  const CheckboxItem = {} as FC<MenuCheckboxItemProps>

  const ItemIndicator = {} as FC<MenuItemIndicatorProps>

  const Label = {} as FC<MenuLabelProps>

  const Arrow = {} as FC<MenuArrowProps>

  const Sub = {} as FC<MenuSubProps>

  const SubContent = {} as FC<MenuSubContentProps>

  return {
    Menu: withStaticProperties(Menu, {
      Trigger,
      Content,
      Item,
      ItemTitle,
      ItemSubtitle,
      SubTrigger,
      Group,
      ItemIcon,
      Separator,
      CheckboxItem,
      ItemIndicator,
      ItemImage,
      Label,
      Arrow,
      Sub,
      SubContent,
      Preview,
    }),
  }
}
