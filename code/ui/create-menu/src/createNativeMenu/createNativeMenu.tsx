/**
 * createNativeMenu - provides native menu implementation for React Native
 *
 * On Web: Returns empty stub components (withNativeMenu will use the web components instead)
 * On Native: Uses Zeego for native menus (Credit to nandorojo/Zeego)
 */

import { isWeb, withStaticProperties } from '@tamagui/web'
import type { FC } from 'react'
import React from 'react'
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

export const createNativeMenu = (MenuType: 'ContextMenu' | 'Menu') => {
  // On web, return empty stubs - withNativeMenu will use the web components passed to it
  if (isWeb) {
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

  // Native implementation using Zeego
  const ZeegoDropdownMenu = require('zeego/dropdown-menu')
  const ZeegoContextMenu = require('zeego/context-menu')
  const { NativePropProvider } = require('../createBaseMenu')

  // Select the appropriate Zeego menu based on type
  const ZeegoMenu = MenuType === 'ContextMenu' ? ZeegoContextMenu : ZeegoDropdownMenu

  // Portal is a no-op on native
  const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>
  }
  Portal.displayName = 'Portal'

  // Use Zeego's Sub directly - it handles native submenus properly
  const Sub = ZeegoMenu.Sub
  const SubTrigger = ZeegoMenu.SubTrigger
  const SubContent = ZeegoMenu.SubContent

  // Add displayNames so withNativeMenu can identify them
  Sub.displayName = 'Sub'
  SubTrigger.displayName = 'SubTrigger'
  SubContent.displayName = 'SubContent'

  // RadioGroup and RadioItem are web-only, return null for native
  const RadioGroup: React.FC<{
    children: React.ReactNode
    value?: string
    onValueChange?: (value: string) => void
  }> = ({ children }) => {
    return <>{children}</>
  }
  RadioGroup.displayName = `${MenuType}RadioGroup`

  const RadioItem: React.FC<{ children: React.ReactNode; value: string }> = ({
    children,
  }) => {
    return <>{children}</>
  }
  RadioItem.displayName = `${MenuType}RadioItem`

  // Arrow is web-only
  const Arrow: React.FC = () => null
  Arrow.displayName = 'Arrow'

  // CheckboxItem wrapper to handle both checked/onCheckedChange and value/onValueChange
  const CheckboxItem: React.FC<any> = (props) => {
    const { checked, onCheckedChange, value, onValueChange, ...rest } = props

    // If only checked/onCheckedChange are provided, convert them for native
    const finalValue = value !== undefined ? value : checked ? 'on' : 'off'
    const finalOnValueChange =
      onValueChange ||
      (onCheckedChange ? (v: string) => onCheckedChange(v === 'on') : undefined)

    return (
      <ZeegoMenu.CheckboxItem
        value={finalValue}
        onValueChange={finalOnValueChange}
        {...rest}
      />
    )
  }
  CheckboxItem.displayName = 'CheckboxItem'

  // Context menu specific components - no-op for DropdownMenu
  const Preview: React.FC<any> =
    MenuType === 'ContextMenu' ? ZeegoContextMenu.Preview : () => null
  Preview.displayName = `${MenuType}Preview`

  const Auxiliary: React.FC<any> =
    MenuType === 'ContextMenu' ? ZeegoContextMenu.Auxiliary : () => null
  Auxiliary.displayName = `${MenuType}Auxiliary`

  // Main menu component that wraps everything
  const Menu: React.FC<MenuProps> = (props) => {
    const { children, onOpenChange, onOpenWillChange } = props

    // onOpenWillChange is only available on ContextMenu
    const rootProps: any = {
      onOpenChange,
    }

    if (MenuType === 'ContextMenu' && onOpenWillChange) {
      rootProps.onOpenWillChange = onOpenWillChange
    }

    // Flatten children to handle Portal wrapping Content
    const flattenedChildren = React.Children.map(children, (child: any) => {
      const displayName = child?.type?.displayName || ''
      const isPortal =
        displayName === 'Portal' ||
        displayName === `${MenuType}Portal` ||
        displayName.includes('Portal')

      if (isPortal) {
        return child.props.children
      }
      return child
    })

    return (
      <NativePropProvider
        native
        scope={MenuType === 'Menu' ? 'MenuContext' : 'ContextMenuContext'}
      >
        <ZeegoMenu.Root {...rootProps}>{flattenedChildren}</ZeegoMenu.Root>
      </NativePropProvider>
    )
  }
  Menu.displayName = MenuType

  // Export the Menu with Zeego components directly attached
  const MenuComponent = withStaticProperties(Menu, {
    // Use Zeego components directly for core functionality
    Trigger: ZeegoMenu.Trigger,
    Content: ZeegoMenu.Content,
    Item: ZeegoMenu.Item,
    ItemTitle: ZeegoMenu.ItemTitle,
    ItemSubtitle: ZeegoMenu.ItemSubtitle,
    ItemIcon: ZeegoMenu.ItemIcon,
    ItemImage: ZeegoMenu.ItemImage,
    CheckboxItem, // Use our wrapper that handles prop conversion
    ItemIndicator: ZeegoMenu.ItemIndicator,
    Group: ZeegoMenu.Group,
    Label: ZeegoMenu.Label,
    Separator: ZeegoMenu.Separator,
    Sub, // Use Zeego's Sub directly
    SubTrigger,
    SubContent,

    // Portal is a no-op on native, but keep for compatibility
    Portal,

    // Web-only components that return null on native
    RadioGroup,
    RadioItem,
    Arrow,

    // Context menu specific components
    Preview,
    Auxiliary,
  })

  return { Menu: MenuComponent }
}
