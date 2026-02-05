/**
 * createNativeMenu - provides native menu implementation for React Native
 *
 * On Web: Returns empty stub components (withNativeMenu will use the web components instead)
 * On Native: Uses Zeego for native menus (Credit to nandorojo/Zeego)
 */

import { getZeego } from '@tamagui/native'
import { isWeb, withStaticProperties, isIos } from '@tamagui/web'
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

export type NativeMenuComponents = {
  Menu: FC<MenuProps> & {
    Trigger: FC<MenuTriggerProps>
    Content: FC<MenuContentProps>
    Item: FC<MenuItemProps>
    ItemTitle: FC<MenuItemTitleProps>
    ItemSubtitle: FC<MenuItemSubtitleProps>
    SubTrigger: FC<MenuSubTriggerProps>
    Group: FC<MenuGroupProps>
    ItemIcon: FC<MenuItemIconProps>
    Separator: FC<MenuSeparatorProps>
    CheckboxItem: FC<MenuCheckboxItemProps>
    ItemIndicator: FC<MenuItemIndicatorProps>
    ItemImage: FC<MenuItemImageProps>
    Label: FC<MenuLabelProps>
    Arrow: FC<MenuArrowProps>
    Sub: FC<MenuSubProps>
    SubContent: FC<MenuSubContentProps>
    Preview: FC<ContextMenuPreviewProps>
    Portal: FC<{ children: React.ReactNode }>
    RadioGroup: FC<{ children: React.ReactNode }>
    RadioItem: FC<{ children: React.ReactNode }>
    Auxiliary: FC<any>
  }
}

export const createNativeMenu = (
  MenuType: 'ContextMenu' | 'Menu'
): NativeMenuComponents => {
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
    const Portal = {} as FC<{ children: React.ReactNode }>
    const RadioGroup = {} as FC<{ children: React.ReactNode }>
    const RadioItem = {} as FC<{ children: React.ReactNode }>
    const Auxiliary = {} as FC<any>

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
        Portal,
        RadioGroup,
        RadioItem,
        Auxiliary,
      }),
    }
  }

  // ===========================================
  // Native implementation using Zeego
  // ===========================================

  const zeego = getZeego()
  if (!zeego.isEnabled) {
    console.warn(
      `Warning: Must call import '@tamagui/native/setup-zeego' at your app entry point to use native menus`
    )
    return { Menu: {} as any }
  }

  const { DropdownMenu: ZeegoDropdownMenu, ContextMenu: ZeegoContextMenu } = zeego.state

  const isContextMenu = MenuType === 'ContextMenu'
  const ZeegoMenu = isContextMenu ? ZeegoContextMenu : ZeegoDropdownMenu

  // Map displayName patterns to Zeego components
  const COMPONENT_MAP: Record<string, any> = {
    SubContent: ZeegoMenu.SubContent,
    Content: ZeegoMenu.Content,
    Sub: ZeegoMenu.Sub,
    Group: ZeegoMenu.Group,
    SubTrigger: ZeegoMenu.SubTrigger,
  }

  // Components that need children transformation (containers)
  const CONTAINER_TYPES = ['SubContent', 'Content', 'Sub', 'Group']

  /**
   * Get component type from displayName (handles styled wrappers)
   */
  const getComponentType = (displayName: string): string | null => {
    // Check in specific order (SubContent before Content, SubTrigger before Trigger)
    for (const type of [
      'SubContent',
      'SubTrigger',
      'Content',
      'Sub',
      'Group',
      'CheckboxItem',
    ]) {
      if (displayName === type || displayName.includes(`(${type})`)) {
        return type
      }
    }
    return null
  }

  /**
   * Check if component looks like a menu Item (has onSelect/textValue but isn't a special component)
   */
  const isItemLike = (props: Record<string, any>, displayName: string): boolean => {
    // If it matches a known component type, it's not a generic Item
    if (getComponentType(displayName)) {
      return false
    }
    return 'onSelect' in props || 'textValue' in props
  }

  /**
   * Check if displayName matches Portal
   */
  const isPortal = (displayName: string): boolean => {
    return displayName === 'Portal' || displayName.includes('Portal')
  }

  /**
   * Transform children tree for Zeego compatibility:
   * - Flatten Portal wrappers
   * - Recurse into containers (Content, Sub, Group, SubContent)
   * - Convert styled Items to Zeego Items
   * - Reverse children on iOS only for DropdownMenu at Content/SubContent level
   */
  const transformForZeego = (
    children: React.ReactNode,
    shouldReverseOnIos = false
  ): React.ReactNode => {
    const result: React.ReactNode[] = []

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        result.push(child)
        return
      }

      const displayName = (child.type as any)?.displayName || ''
      const props = child.props as Record<string, any>

      // Flatten Portal
      if (isPortal(displayName)) {
        const portalChildren = transformForZeego(props.children, false)
        React.Children.forEach(portalChildren, (c) => result.push(c))
        return
      }

      // Handle known component types (containers, SubTrigger, CheckboxItem)
      const componentType = getComponentType(displayName)

      // normalizing checked/value props
      if (componentType === 'CheckboxItem') {
        const { checked, onCheckedChange, value, onValueChange, children, ...rest } =
          props

        const finalValue = value ?? (checked ? 'on' : 'off')
        const finalOnValueChange =
          onValueChange ??
          (onCheckedChange && ((v: string) => onCheckedChange(v === 'on')))

        const cleanChildren = React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child

          const childDisplayName = (child.type as any)?.displayName || ''
          // If it's an ItemIndicator, remove it (return null) so we don't double render the checkmark
          if (childDisplayName.includes('ItemIndicator')) {
            return null
          }
          return child
        })

        result.push(
          React.createElement(
            ZeegoMenu.CheckboxItem,
            {
              ...rest,
              key: child.key,
              value: finalValue,
              onValueChange: finalOnValueChange,
            },
            cleanChildren
          )
        )
        return
      }

      if (componentType) {
        const { children: childChildren, ...restProps } = props
        const isContainer = CONTAINER_TYPES.includes(componentType)
        // Only reverse children of Content and SubContent (not Group or Sub)
        const shouldReverseChildren =
          componentType === 'Content' || componentType === 'SubContent'
        result.push(
          React.createElement(
            COMPONENT_MAP[componentType],
            { ...restProps, key: child.key },
            isContainer
              ? transformForZeego(childChildren, shouldReverseChildren)
              : childChildren
          )
        )
        return
      }

      // Convert Item-like components to Zeego Items
      if (isItemLike(props, displayName)) {
        const { children: itemChildren, ...itemProps } = props
        result.push(
          React.createElement(
            ZeegoMenu.Item,
            { ...itemProps, key: child.key },
            itemChildren
          )
        )
        return
      }

      // Pass through everything else
      result.push(child)
    })

    // iOS DropdownMenu (not ContextMenu) displays menu items in reverse order
    // Only reverse for Menu component, not ContextMenu
    if (isIos && shouldReverseOnIos && !isContextMenu) {
      result.reverse()
    }

    return result
  }

  // ===========================================
  // Component definitions (typed wrappers around Zeego)
  // ===========================================

  // Direct Zeego pass-throughs with proper types
  const Trigger: FC<MenuTriggerProps> = ZeegoMenu.Trigger
  const Content: FC<MenuContentProps> = ZeegoMenu.Content
  const Item: FC<MenuItemProps> = ZeegoMenu.Item
  const ItemTitle: FC<MenuItemTitleProps> = ZeegoMenu.ItemTitle
  const ItemSubtitle: FC<MenuItemSubtitleProps> = ZeegoMenu.ItemSubtitle
  const ItemIcon: FC<MenuItemIconProps> = ZeegoMenu.ItemIcon
  const ItemImage: FC<MenuItemImageProps> = ZeegoMenu.ItemImage
  const ItemIndicator: FC<MenuItemIndicatorProps> = ZeegoMenu.ItemIndicator
  const Group: FC<MenuGroupProps> = ZeegoMenu.Group
  const Label: FC<MenuLabelProps> = ZeegoMenu.Label
  const Separator: FC<MenuSeparatorProps> = ZeegoMenu.Separator
  const Sub: FC<MenuSubProps> = ZeegoMenu.Sub
  const SubTrigger: FC<MenuSubTriggerProps> = ZeegoMenu.SubTrigger
  const SubContent: FC<MenuSubContentProps> = ZeegoMenu.SubContent

  // Custom components
  const Portal: FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
  Portal.displayName = 'Portal'

  const Arrow: FC<MenuArrowProps> = () => null
  Arrow.displayName = 'Arrow'

  const RadioGroup: FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
  RadioGroup.displayName = `${MenuType}RadioGroup`

  const RadioItem: FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
  RadioItem.displayName = `${MenuType}RadioItem`
  // CheckboxItem wrapper to normalize checked/value props
  const CheckboxItem: FC<MenuCheckboxItemProps> = (props) => null
  CheckboxItem.displayName = 'CheckboxItem'

  // Context menu specific
  const Preview: FC<ContextMenuPreviewProps> = isContextMenu
    ? ZeegoContextMenu.Preview
    : () => null
  Preview.displayName = `${MenuType}Preview`

  const Auxiliary: FC<ContextMenuPreviewProps> = isContextMenu
    ? ZeegoContextMenu.Auxiliary
    : () => null
  Auxiliary.displayName = `${MenuType}Auxiliary`

  // Main Menu component
  const Menu: FC<MenuProps> = ({ children, onOpenChange, onOpenWillChange }) => {
    const rootProps: Record<string, unknown> = { onOpenChange }
    if (isContextMenu && onOpenWillChange) {
      rootProps.onOpenWillChange = onOpenWillChange
    }

    return <ZeegoMenu.Root {...rootProps}>{transformForZeego(children)}</ZeegoMenu.Root>
  }
  Menu.displayName = MenuType

  // ===========================================
  // Export
  // ===========================================

  return {
    Menu: withStaticProperties(Menu, {
      Trigger,
      Content,
      Item,
      ItemTitle,
      ItemSubtitle,
      ItemIcon,
      ItemImage,
      ItemIndicator,
      Group,
      Label,
      Separator,
      Sub,
      SubTrigger,
      SubContent,
      CheckboxItem,
      Portal,
      RadioGroup,
      RadioItem,
      Arrow,
      Preview,
      Auxiliary,
    }),
  }
}
