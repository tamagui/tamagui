/**
 * createNativeMenu - native menu implementation for React Native
 *
 * Web: returns empty stub components (withNativeMenu uses the web components instead)
 * Native: lazily resolves Zeego at render time so importing the package doesn't warn/error
 */

import { getZeego, NativeMenuContext } from '@tamagui/native'
import { isWeb, withStaticProperties, isIos } from '@tamagui/web'
import type { FC } from 'react'
import React from 'react'
import type {
  ContextMenuPreviewProps,
  NativeContextMenuAuxiliaryProps,
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

// zeego module shape (DropdownMenu / ContextMenu both share this)
type ZeegoMenuModule = {
  Root: FC<Record<string, unknown>>
  Trigger: FC<MenuTriggerProps>
  Content: FC<NativeMenuContentProps>
  Item: FC<NativeMenuItemProps>
  ItemTitle: FC<NativeMenuItemTitleProps>
  ItemSubtitle: FC<NativeMenuItemSubtitleProps>
  ItemIcon: FC<NativeMenuItemIconProps>
  ItemImage: FC<NativeMenuItemImageProps>
  ItemIndicator: FC<NativeMenuItemIndicatorProps>
  Group: FC<NativeMenuGroupProps>
  Label: FC<NativeMenuLabelProps>
  Separator: FC<NativeMenuSeparatorProps>
  Sub: FC<NativeMenuSubProps>
  SubTrigger: FC<NativeMenuSubTriggerProps>
  SubContent: FC<NativeMenuSubContentProps>
  CheckboxItem: FC<NativeMenuCheckboxItemProps>
  Preview: FC<ContextMenuPreviewProps>
  Auxiliary: FC<NativeContextMenuAuxiliaryProps>
}

// component types we recognize via displayName matching
type MappedComponentType =
  | 'SubContent'
  | 'SubTrigger'
  | 'Content'
  | 'Sub'
  | 'Group'
  | 'CheckboxItem'

const MAPPED_TYPES: MappedComponentType[] = [
  'SubContent',
  'SubTrigger',
  'Content',
  'Sub',
  'Group',
  'CheckboxItem',
]

// types whose children get recursively transformed
const CONTAINER_TYPES: MappedComponentType[] = ['SubContent', 'Content', 'Sub', 'Group']

type ComponentMap = Pick<
  ZeegoMenuModule,
  'SubContent' | 'Content' | 'Sub' | 'Group' | 'SubTrigger'
>

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
    Auxiliary: FC<NativeContextMenuAuxiliaryProps>
  }
}

// shared helpers (stateless, no need to recreate per call)

function getComponentType(displayName: string): MappedComponentType | null {
  for (const type of MAPPED_TYPES) {
    if (displayName === type || displayName.includes(`(${type})`)) {
      return type
    }
  }
  return null
}

function isItemLike(props: Record<string, unknown>, displayName: string): boolean {
  if (getComponentType(displayName)) return false
  return 'onSelect' in props || 'textValue' in props
}

function isPortalLike(displayName: string): boolean {
  return displayName === 'Portal' || displayName.includes('Portal')
}

// stub used for web — never actually rendered, just needs to exist for withNativeMenu fallback
const emptyStub = (() => null) as FC<any>

function createWebStubs(): NativeMenuComponents {
  return {
    Menu: withStaticProperties(emptyStub as FC<NativeMenuProps>, {
      Trigger: emptyStub as FC<MenuTriggerProps>,
      Content: emptyStub as FC<NativeMenuContentProps>,
      Item: emptyStub as FC<NativeMenuItemProps>,
      ItemTitle: emptyStub as FC<NativeMenuItemTitleProps>,
      ItemSubtitle: emptyStub as FC<NativeMenuItemSubtitleProps>,
      SubTrigger: emptyStub as FC<NativeMenuSubTriggerProps>,
      Group: emptyStub as FC<NativeMenuGroupProps>,
      ItemIcon: emptyStub as FC<NativeMenuItemIconProps>,
      Separator: emptyStub as FC<NativeMenuSeparatorProps>,
      CheckboxItem: emptyStub as FC<NativeMenuCheckboxItemProps>,
      ItemIndicator: emptyStub as FC<NativeMenuItemIndicatorProps>,
      ItemImage: emptyStub as FC<NativeMenuItemImageProps>,
      Label: emptyStub as FC<NativeMenuLabelProps>,
      Arrow: emptyStub as FC<NativeMenuArrowProps>,
      Sub: emptyStub as FC<NativeMenuSubProps>,
      SubContent: emptyStub as FC<NativeMenuSubContentProps>,
      Preview: emptyStub as FC<ContextMenuPreviewProps>,
      Portal: emptyStub as FC<{ children: React.ReactNode }>,
      RadioGroup: emptyStub as FC<{ children: React.ReactNode }>,
      RadioItem: emptyStub as FC<{ children: React.ReactNode }>,
      Auxiliary: emptyStub as FC<NativeContextMenuAuxiliaryProps>,
    }),
  }
}

export const createNativeMenu = (
  MenuType: 'ContextMenu' | 'Menu'
): NativeMenuComponents => {
  if (isWeb) {
    return createWebStubs()
  }

  // ===========================================
  // native implementation — lazily resolves zeego
  // ===========================================

  const isContextMenu = MenuType === 'ContextMenu'
  const isAndroid = !isIos && !isWeb

  // cached after first successful resolve
  let resolved: { menu: ZeegoMenuModule; componentMap: ComponentMap } | null = null
  let warned = false

  function resolve(): typeof resolved {
    if (resolved) return resolved
    const zeego = getZeego()
    if (!zeego.isEnabled) {
      if (!warned) {
        warned = true
        console.warn(
          `Warning: Must call import '@tamagui/native/setup-zeego' at your app entry point to use native menus`
        )
      }
      return null
    }
    const menu = (
      isContextMenu ? zeego.state.ContextMenu : zeego.state.DropdownMenu
    ) as ZeegoMenuModule
    resolved = {
      menu,
      componentMap: {
        SubContent: menu.SubContent,
        Content: menu.Content,
        Sub: menu.Sub,
        Group: menu.Group,
        SubTrigger: menu.SubTrigger,
      },
    }
    return resolved
  }

  // transform children tree for zeego compatibility
  function transformChildren(
    menu: ZeegoMenuModule,
    map: ComponentMap,
    children: React.ReactNode,
    shouldReverseOnIos = false
  ): React.ReactNode {
    const result: React.ReactNode[] = []

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        result.push(child)
        return
      }

      const displayName = (child.type as { displayName?: string })?.displayName || ''
      const props = child.props as Record<string, any>

      // flatten portal wrappers
      if (isPortalLike(displayName)) {
        const inner = transformChildren(
          menu,
          map,
          props.children as React.ReactNode,
          false
        )
        React.Children.forEach(inner, (c) => result.push(c))
        return
      }

      // flatten ScrollView (native passthrough — children need to be visible to zeego)
      if (displayName.includes('ScrollView')) {
        const inner = transformChildren(
          menu,
          map,
          props.children as React.ReactNode,
          false
        )
        React.Children.forEach(inner, (c) => result.push(c))
        return
      }

      const componentType = getComponentType(displayName)

      // normalize checkbox checked/value props
      if (componentType === 'CheckboxItem') {
        const {
          checked,
          onCheckedChange,
          value,
          onValueChange,
          children: cbChildren,
          ...rest
        } = props as Record<string, any>

        const finalValue = value ?? (checked ? 'on' : 'off')
        const finalOnValueChange =
          onValueChange ??
          (onCheckedChange && ((v: string) => onCheckedChange(v === 'on')))

        const cleanChildren = React.Children.map(cbChildren, (c) => {
          if (!React.isValidElement(c)) return c
          const dn = (c.type as { displayName?: string })?.displayName || ''
          if (dn.includes('ItemIndicator')) return null
          return c
        })

        result.push(
          React.createElement(
            menu.CheckboxItem,
            {
              ...rest,
              key: child.key,
              value: finalValue,
              onValueChange: finalOnValueChange,
            } as any,
            cleanChildren
          )
        )
        return
      }

      if (componentType) {
        const { children: childChildren, ...restProps } = props
        const isContainer = (CONTAINER_TYPES as string[]).includes(componentType)
        const shouldReverse =
          componentType === 'Content' || componentType === 'SubContent'
        result.push(
          React.createElement(
            map[componentType as keyof ComponentMap],
            { ...restProps, key: child.key } as any,
            isContainer
              ? transformChildren(
                  menu,
                  map,
                  childChildren as React.ReactNode,
                  shouldReverse
                )
              : childChildren
          )
        )
        return
      }

      // convert Item-like components to zeego Items
      if (isItemLike(props, displayName)) {
        const { children: itemChildren, ...itemProps } = props
        result.push(
          React.createElement(
            menu.Item,
            { ...itemProps, key: child.key } as any,
            itemChildren
          )
        )
        return
      }

      result.push(child)
    })

    // iOS DropdownMenu displays items in reverse order
    if (isIos && shouldReverseOnIos && !isContextMenu) {
      result.reverse()
    }

    return result
  }

  // lazy wrapper — resolves the zeego component on first render
  function lazyZeego<P extends Record<string, any>>(
    name: keyof ZeegoMenuModule,
    displayName?: string
  ): FC<P> {
    const Comp: FC<P> = (props) => {
      const z = resolve()
      if (!z) return null
      return React.createElement(z.menu[name] as FC<any>, props)
    }
    Comp.displayName = displayName || name
    return Comp
  }

  const Trigger = lazyZeego<MenuTriggerProps>('Trigger')
  const Content = lazyZeego<NativeMenuContentProps>('Content')
  const Item = lazyZeego<NativeMenuItemProps>('Item')
  const ItemTitle = lazyZeego<NativeMenuItemTitleProps>('ItemTitle')
  const ItemSubtitle = lazyZeego<NativeMenuItemSubtitleProps>('ItemSubtitle')
  const ItemIcon = lazyZeego<NativeMenuItemIconProps>('ItemIcon')
  const ItemImage = lazyZeego<NativeMenuItemImageProps>('ItemImage')
  const ItemIndicator = lazyZeego<NativeMenuItemIndicatorProps>('ItemIndicator')
  const Group = lazyZeego<NativeMenuGroupProps>('Group')
  const Label = lazyZeego<NativeMenuLabelProps>('Label')
  const Separator = lazyZeego<NativeMenuSeparatorProps>('Separator')
  const Sub = lazyZeego<NativeMenuSubProps>('Sub')
  const SubTrigger = lazyZeego<NativeMenuSubTriggerProps>('SubTrigger')
  const SubContent = lazyZeego<NativeMenuSubContentProps>('SubContent')

  const Portal: FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
  Portal.displayName = 'Portal'

  const Arrow: FC<NativeMenuArrowProps> = () => null
  Arrow.displayName = 'Arrow'

  const RadioGroup: FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
  RadioGroup.displayName = `${MenuType}RadioGroup`

  const RadioItem: FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
  RadioItem.displayName = `${MenuType}RadioItem`

  const CheckboxItem: FC<NativeMenuCheckboxItemProps> = () => null
  CheckboxItem.displayName = 'CheckboxItem'

  const Preview: FC<ContextMenuPreviewProps> = isContextMenu
    ? lazyZeego<ContextMenuPreviewProps>('Preview', `${MenuType}Preview`)
    : () => null
  Preview.displayName = `${MenuType}Preview`

  const Auxiliary: FC<NativeContextMenuAuxiliaryProps> = isContextMenu
    ? lazyZeego<NativeContextMenuAuxiliaryProps>('Auxiliary', `${MenuType}Auxiliary`)
    : () => null
  Auxiliary.displayName = `${MenuType}Auxiliary`

  // on Android, provide NativeMenuContext so components use Gesture.Manual()
  // instead of Gesture.Tap() (which sends ACTION_CANCEL to MenuView)
  const Menu: FC<NativeMenuProps> = ({ children, onOpenChange, onOpenWillChange }) => {
    const z = resolve()
    if (!z) return null

    const rootProps: Record<string, unknown> = { onOpenChange }
    if (isContextMenu && onOpenWillChange) {
      rootProps.onOpenWillChange = onOpenWillChange
    }

    const content = (
      <z.menu.Root {...rootProps}>
        {transformChildren(z.menu, z.componentMap, children)}
      </z.menu.Root>
    )

    if (isAndroid) {
      return (
        <NativeMenuContext.Provider value={true}>{content}</NativeMenuContext.Provider>
      )
    }

    return content
  }
  Menu.displayName = MenuType

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
