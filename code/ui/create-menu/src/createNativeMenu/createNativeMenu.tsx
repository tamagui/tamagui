/**
 * createNativeMenu - native menu implementation for React Native
 *
 * Web: returns empty stub components (withNativeMenu uses the web components instead)
 * Native: lazily resolves the registered adapter at render time.
 */

import {
  getNativeMenuAdapter,
  NativeMenuContext,
  unstable_claimExternalPressOwnership,
  unstable_releaseExternalPressOwnership,
} from '@tamagui/native'
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

// native menu modules share this compound-component shape
type NativeMenuModule = {
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
  | 'Item'
  | 'ItemTitle'
  | 'ItemSubtitle'
  | 'ItemIcon'
  | 'ItemImage'
  | 'ItemIndicator'
  | 'Label'
  | 'Separator'
  | 'CheckboxItem'
  | 'Preview'
  | 'Auxiliary'

const MAPPED_TYPES: MappedComponentType[] = [
  'SubContent',
  'SubTrigger',
  'Content',
  'Sub',
  'Group',
  'Item',
  'ItemTitle',
  'ItemSubtitle',
  'ItemIcon',
  'ItemImage',
  'ItemIndicator',
  'Label',
  'Separator',
  'CheckboxItem',
  'Preview',
  'Auxiliary',
]

// types whose children get recursively transformed
const CONTAINER_TYPES: MappedComponentType[] = [
  'SubContent',
  'SubTrigger',
  'Content',
  'Sub',
  'Group',
  'Item',
]

type ComponentMap = Pick<NativeMenuModule, MappedComponentType>

type TriggerPressBoundaryHandlers = {
  claim(debugName?: string | null): void
  release(debugName?: string | null): void
}

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
    if (
      displayName === type ||
      displayName === `Menu${type}` ||
      displayName === `ContextMenu${type}` ||
      displayName.includes(`(${type})`)
    ) {
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

function isTriggerLike(displayName: string): boolean {
  return displayName === 'Trigger' || displayName.includes('(Trigger)')
}

function composeHandlers<T extends (...args: any[]) => void>(first?: T, second?: T) {
  return (...args: Parameters<T>) => {
    first?.(...args)
    second?.(...args)
  }
}

function getTriggerDebugName(
  menuType: 'ContextMenu' | 'Menu',
  props: Record<string, any>
) {
  const childProps =
    React.isValidElement(props.children) && props.children.props
      ? (props.children.props as Record<string, any>)
      : null

  const prefix = menuType === 'ContextMenu' ? 'ContextMenuTrigger' : 'MenuTrigger'
  const detail =
    childProps?.testID ??
    childProps?.accessibilityLabel ??
    (typeof props.textValue === 'string' ? props.textValue : null)

  return [prefix, detail].filter(Boolean).join(':') || prefix
}

// web never renders these stubs, but withNativeMenu requires their component shape
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
  // native implementation lazily resolves the registered adapter
  // ===========================================

  const isContextMenu = MenuType === 'ContextMenu'
  const isAndroid = !isIos && !isWeb

  // cached after first successful resolve
  let resolved: { menu: NativeMenuModule; componentMap: ComponentMap } | null = null
  let warned = false

  function resolve(): typeof resolved {
    if (resolved) return resolved
    const adapter = getNativeMenuAdapter()
    if (!adapter) {
      if (!warned) {
        warned = true
        console.warn(
          `Warning: Register a native menu adapter before rendering Tamagui native menus`
        )
      }
      return null
    }
    const menu = (isContextMenu ? adapter.ContextMenu : adapter.Menu) as NativeMenuModule
    resolved = {
      menu,
      componentMap: {
        SubContent: menu.SubContent,
        SubTrigger: menu.SubTrigger,
        Content: menu.Content,
        Sub: menu.Sub,
        Group: menu.Group,
        Item: menu.Item,
        ItemTitle: menu.ItemTitle,
        ItemSubtitle: menu.ItemSubtitle,
        ItemIcon: menu.ItemIcon,
        ItemImage: menu.ItemImage,
        ItemIndicator: menu.ItemIndicator,
        Label: menu.Label,
        Separator: menu.Separator,
        CheckboxItem: menu.CheckboxItem,
        Preview: menu.Preview,
        Auxiliary: menu.Auxiliary,
      },
    }
    return resolved
  }

  type RadioContext = {
    value?: string
    onValueChange?: (value: string) => void
  }

  // transform Tamagui menu children into the registered adapter's components
  function transformChildren(
    menu: NativeMenuModule,
    map: ComponentMap,
    children: React.ReactNode,
    shouldReverseOnIos = false,
    triggerBoundaryHandlers?: TriggerPressBoundaryHandlers,
    radioContext?: RadioContext
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
          false,
          triggerBoundaryHandlers,
          radioContext
        )
        React.Children.forEach(inner, (c) => result.push(c))
        return
      }

      // flatten ScrollView so the adapter can inspect every menu item
      if (displayName.includes('ScrollView')) {
        const inner = transformChildren(
          menu,
          map,
          props.children as React.ReactNode,
          false,
          triggerBoundaryHandlers,
          radioContext
        )
        React.Children.forEach(inner, (c) => result.push(c))
        return
      }

      if (isTriggerLike(displayName)) {
        const debugName = getTriggerDebugName(MenuType, props)
        const claim = () => triggerBoundaryHandlers?.claim(debugName)
        const release = () => triggerBoundaryHandlers?.release(debugName)
        const { children: triggerChildren, ...triggerProps } = props

        result.push(
          React.createElement(
            menu.Trigger,
            {
              ...triggerProps,
              key: child.key,
              onTouchStart: composeHandlers(claim, props.onTouchStart),
              onTouchEnd: composeHandlers(props.onTouchEnd, release),
              onTouchCancel: composeHandlers(props.onTouchCancel, release),
              onResponderGrant: composeHandlers(claim, props.onResponderGrant),
              onResponderRelease: composeHandlers(props.onResponderRelease, release),
              onResponderTerminate: composeHandlers(props.onResponderTerminate, release),
              onPressIn: composeHandlers(claim, props.onPressIn),
              onPressOut: composeHandlers(props.onPressOut, release),
            } as any,
            triggerChildren
          )
        )
        return
      }

      // RadioGroup: render as an adapter Group and pipe value/onValueChange
      // down to any RadioItem descendants via radioContext
      if (displayName.includes('RadioGroup')) {
        const {
          value: rgValue,
          onValueChange: rgOnValueChange,
          children: rgChildren,
          ...rest
        } = props as Record<string, any>

        result.push(
          React.createElement(
            menu.Group,
            { ...rest, key: child.key } as any,
            transformChildren(
              menu,
              map,
              rgChildren as React.ReactNode,
              false,
              triggerBoundaryHandlers,
              { value: rgValue, onValueChange: rgOnValueChange }
            )
          )
        )
        return
      }

      // Native adapters share a checkbox primitive, so emit a CheckboxItem whose
      // 'on'/'off' state is derived from the enclosing RadioGroup's value.
      if (displayName.includes('RadioItem') && radioContext) {
        const {
          value: itemValue,
          children: rChildren,
          ...rest
        } = props as Record<string, any>

        const cleanChildren = React.Children.map(rChildren, (c) => {
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
              value: itemValue === radioContext.value ? 'on' : 'off',
              onValueChange: () => radioContext.onValueChange?.(itemValue),
            } as any,
            transformChildren(
              menu,
              map,
              cleanChildren,
              false,
              triggerBoundaryHandlers,
              radioContext
            )
          )
        )
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
            transformChildren(
              menu,
              map,
              cleanChildren,
              false,
              triggerBoundaryHandlers,
              radioContext
            )
          )
        )
        return
      }

      if (componentType) {
        const { children: childChildren, ...restProps } = props
        const AdapterComponent: FC<any> = map[componentType]
        const isContainer = CONTAINER_TYPES.includes(componentType)
        const shouldReverse =
          componentType === 'Content' || componentType === 'SubContent'
        result.push(
          React.createElement(
            AdapterComponent,
            { ...restProps, key: child.key } as any,
            isContainer
              ? transformChildren(
                  menu,
                  map,
                  childChildren,
                  shouldReverse,
                  triggerBoundaryHandlers,
                  radioContext
                )
              : childChildren
          )
        )
        return
      }

      // convert Item-like components to adapter Items
      if (isItemLike(props, displayName)) {
        const { children: itemChildren, ...itemProps } = props
        result.push(
          React.createElement(
            menu.Item,
            { ...itemProps, key: child.key } as any,
            transformChildren(
              menu,
              map,
              itemChildren as React.ReactNode,
              false,
              triggerBoundaryHandlers,
              radioContext
            )
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

  // resolve each adapter component on its first render
  function lazyAdapter<P extends Record<string, any>>(
    name: keyof NativeMenuModule,
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

  const Trigger = lazyAdapter<MenuTriggerProps>('Trigger')
  const Content = lazyAdapter<NativeMenuContentProps>('Content')
  const Item = lazyAdapter<NativeMenuItemProps>('Item')
  const ItemTitle = lazyAdapter<NativeMenuItemTitleProps>('ItemTitle')
  const ItemSubtitle = lazyAdapter<NativeMenuItemSubtitleProps>('ItemSubtitle')
  const ItemIcon = lazyAdapter<NativeMenuItemIconProps>('ItemIcon')
  const ItemImage = lazyAdapter<NativeMenuItemImageProps>('ItemImage')
  const ItemIndicator = lazyAdapter<NativeMenuItemIndicatorProps>('ItemIndicator')
  const Group = lazyAdapter<NativeMenuGroupProps>('Group')
  const Label = lazyAdapter<NativeMenuLabelProps>('Label')
  const Separator = lazyAdapter<NativeMenuSeparatorProps>('Separator')
  const Sub = lazyAdapter<NativeMenuSubProps>('Sub')
  const SubTrigger = lazyAdapter<NativeMenuSubTriggerProps>('SubTrigger')
  const SubContent = lazyAdapter<NativeMenuSubContentProps>('SubContent')

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
    ? lazyAdapter<ContextMenuPreviewProps>('Preview', `${MenuType}Preview`)
    : () => null
  Preview.displayName = `${MenuType}Preview`

  const Auxiliary: FC<NativeContextMenuAuxiliaryProps> = isContextMenu
    ? lazyAdapter<NativeContextMenuAuxiliaryProps>('Auxiliary', `${MenuType}Auxiliary`)
    : () => null
  Auxiliary.displayName = `${MenuType}Auxiliary`

  // on Android, provide NativeMenuContext so components use Gesture.Manual()
  // instead of Gesture.Tap() (which sends ACTION_CANCEL to MenuView)
  const Menu: FC<NativeMenuProps> = ({ children, onOpenChange, onOpenWillChange }) => {
    const triggerOwnerRef = React.useRef<object | null>(null)
    const claimTriggerBoundary = React.useCallback((debugName?: string | null) => {
      if (triggerOwnerRef.current) {
        unstable_releaseExternalPressOwnership(triggerOwnerRef.current, debugName)
      }
      triggerOwnerRef.current = unstable_claimExternalPressOwnership(debugName)
    }, [])

    const releaseTriggerBoundary = React.useCallback((debugName?: string | null) => {
      if (!triggerOwnerRef.current) return
      unstable_releaseExternalPressOwnership(triggerOwnerRef.current, debugName)
      triggerOwnerRef.current = null
    }, [])

    React.useEffect(() => releaseTriggerBoundary, [releaseTriggerBoundary])

    const z = resolve()
    if (!z) return null

    const handleOpenChange = React.useCallback(
      (isOpen: boolean) => {
        if (!isOpen) {
          releaseTriggerBoundary()
        }
        onOpenChange?.(isOpen)
      },
      [onOpenChange, releaseTriggerBoundary]
    )

    const handleOpenWillChange = React.useCallback(
      (willOpen: boolean) => {
        if (!willOpen) {
          releaseTriggerBoundary()
        }
        onOpenWillChange?.(willOpen)
      },
      [onOpenWillChange, releaseTriggerBoundary]
    )

    const rootProps: Record<string, unknown> = { onOpenChange: handleOpenChange }
    if (isContextMenu && onOpenWillChange) {
      rootProps.onOpenWillChange = handleOpenWillChange
    }

    const content = (
      <z.menu.Root {...rootProps}>
        {transformChildren(z.menu, z.componentMap, children, false, {
          claim: claimTriggerBoundary,
          release: releaseTriggerBoundary,
        })}
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
