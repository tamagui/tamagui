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
  NativeMenuArrowProps,
  NativeMenuCheckboxItemProps,
  NativeMenuContentProps,
  NativeMenuGroupProps,
  NativeMenuItemIconProps,
  NativeMenuItemImageProps,
  NativeMenuItemIndicatorProps,
  NativeMenuItemProps,
  NativeMenuItemSubtitleProps,
  NativeMenuItemTitleProps,
  NativeMenuLabelProps,
  NativeMenuProps,
  NativeMenuSeparatorProps,
  NativeMenuSubContentProps,
  NativeMenuSubProps,
  NativeMenuSubTriggerProps,
  MenuTriggerProps,
} from './createNativeMenuTypes'

export type NativeMenuComponents = {
  Menu: FC<NativeMenuProps> & {
    Trigger: FC<MenuTriggerProps>
    Content: FC<NativeMenuContentProps>
    Item: FC<NativeMenuItemProps>
    ItemTitle: FC<NativeMenuItemTitleProps>
    ItemSubtitle: FC<NativeMenuItemSubtitleProps>
    SubTrigger: FC<NativeMenuSubTriggerProps>
    Group: FC<NativeMenuGroupProps>
    ItemIcon: FC<NativeMenuItemIconProps>
    Separator: FC<NativeMenuSeparatorProps>
    CheckboxItem: FC<NativeMenuCheckboxItemProps>
    ItemIndicator: FC<NativeMenuItemIndicatorProps>
    ItemImage: FC<NativeMenuItemImageProps>
    Label: FC<NativeMenuLabelProps>
    Arrow: FC<NativeMenuArrowProps>
    Sub: FC<NativeMenuSubProps>
    SubContent: FC<NativeMenuSubContentProps>
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
    const Menu = {} as FC<NativeMenuProps>
    const Trigger = {} as FC<MenuTriggerProps>
    const Content = {} as FC<NativeMenuContentProps>
    const Preview = {} as FC<ContextMenuPreviewProps>
    const Item = {} as FC<NativeMenuItemProps>
    const ItemIcon = {} as FC<NativeMenuItemIconProps>
    const ItemImage = {} as FC<NativeMenuItemImageProps>
    const SubTrigger = {} as FC<NativeMenuSubTriggerProps>
    const ItemTitle = {} as FC<NativeMenuItemTitleProps>
    const ItemSubtitle = {} as FC<NativeMenuItemSubtitleProps>
    const Group = {} as FC<NativeMenuGroupProps>
    const Separator = {} as FC<NativeMenuSeparatorProps>
    const CheckboxItem = {} as FC<NativeMenuCheckboxItemProps>
    const ItemIndicator = {} as FC<NativeMenuItemIndicatorProps>
    const Label = {} as FC<NativeMenuLabelProps>
    const Arrow = {} as FC<NativeMenuArrowProps>
    const Sub = {} as FC<NativeMenuSubProps>
    const SubContent = {} as FC<NativeMenuSubContentProps>
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
  const Content: FC<NativeMenuContentProps> = ZeegoMenu.Content
  const Item: FC<NativeMenuItemProps> = ZeegoMenu.Item
  const ItemTitle: FC<NativeMenuItemTitleProps> = ZeegoMenu.ItemTitle
  const ItemSubtitle: FC<NativeMenuItemSubtitleProps> = ZeegoMenu.ItemSubtitle
  const ItemIcon: FC<NativeMenuItemIconProps> = ZeegoMenu.ItemIcon
  const ItemImage: FC<NativeMenuItemImageProps> = ZeegoMenu.ItemImage
  const ItemIndicator: FC<NativeMenuItemIndicatorProps> = ZeegoMenu.ItemIndicator
  const Group: FC<NativeMenuGroupProps> = ZeegoMenu.Group
  const Label: FC<NativeMenuLabelProps> = ZeegoMenu.Label
  const Separator: FC<NativeMenuSeparatorProps> = ZeegoMenu.Separator
  const Sub: FC<NativeMenuSubProps> = ZeegoMenu.Sub
  const SubTrigger: FC<NativeMenuSubTriggerProps> = ZeegoMenu.SubTrigger
  const SubContent: FC<NativeMenuSubContentProps> = ZeegoMenu.SubContent

  // Custom components
  const Portal: FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
  Portal.displayName = 'Portal'

  const Arrow: FC<NativeMenuArrowProps> = () => null
  Arrow.displayName = 'Arrow'

  const RadioGroup: FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
  RadioGroup.displayName = `${MenuType}RadioGroup`

  const RadioItem: FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
  RadioItem.displayName = `${MenuType}RadioItem`
  // CheckboxItem wrapper to normalize checked/value props
  const CheckboxItem: FC<NativeMenuCheckboxItemProps> = (props) => null
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
  const Menu: FC<NativeMenuProps> = ({ children, onOpenChange, onOpenWillChange }) => {
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
