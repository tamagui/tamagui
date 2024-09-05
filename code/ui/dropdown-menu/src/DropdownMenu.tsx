import { withStaticProperties } from '@tamagui/core'
import {
  createMenu,
  createNativeMenu,
  useNativeProp,
  withNativeMenu,
} from '@tamagui/menu'
import React from 'react'

import {
  DROPDOWN_MENU_CONTEXT,
  createNonNativeDropdownMenu,
} from './createNonNativeDropdownMenu'

export function createDropdownMenu(params: Parameters<typeof createMenu>[0]) {
  const { Menu: NativeMenuRoot } = createNativeMenu('DropdownMenu')
  const NonNativeDropdownMenu = createNonNativeDropdownMenu(params)

  const COMMON_PARAMS = {
    isRoot: false,
    useNativeProp,
    useNativePropScope: DROPDOWN_MENU_CONTEXT,
  }

  const DropdownMenuComp = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.Root,
    NativeComponent: NativeMenuRoot,
    isRoot: true,
  })

  const Trigger = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.Trigger,
    NativeComponent: NativeMenuRoot.Trigger,
  })
  const Portal = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.Portal,
    NativeComponent: React.Fragment,
  })
  const Content = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.Content,
    NativeComponent: NativeMenuRoot.Content,
  })
  const Group = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.Group,
    NativeComponent: NativeMenuRoot.Group,
  })
  const Label = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.Label,
    NativeComponent: NativeMenuRoot.Label,
  })
  const Item = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.Item,
    NativeComponent: NativeMenuRoot.Item,
  })
  const ItemTitle = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.ItemTitle,
    NativeComponent: NativeMenuRoot.ItemTitle,
  })
  const ItemSubtitle = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.ItemSubtitle,
    NativeComponent: NativeMenuRoot.ItemSubtitle,
  })

  const ItemIcon = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.ItemIcon,
    NativeComponent: NativeMenuRoot.ItemIcon,
  })

  const ItemImage = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.ItemImage,
    NativeComponent: NativeMenuRoot.ItemImage,
  })

  const CheckboxItem = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.CheckboxItem,
    NativeComponent: NativeMenuRoot.CheckboxItem,
  })
  const RadioGroup = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.RadioGroup,
    NativeComponent: ({ children }) => children,
  })
  const RadioItem = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.RadioItem,
    NativeComponent: ({ children }) => children,
  })
  const ItemIndicator = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.ItemIndicator,
    NativeComponent: NativeMenuRoot.ItemIndicator,
  })
  const Separator = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.Separator,
    NativeComponent: NativeMenuRoot.Separator,
  })
  const Arrow = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.Arrow,
    NativeComponent: NativeMenuRoot.Arrow,
  })
  const Sub = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.Sub,
    NativeComponent: NativeMenuRoot.Sub,
  })
  const SubTrigger = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.SubTrigger,
    NativeComponent: NativeMenuRoot.SubTrigger,
  })
  const SubContent = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeDropdownMenu.SubContent,
    NativeComponent: NativeMenuRoot.SubContent,
  })

  const DropdownMenu = withStaticProperties(DropdownMenuComp, {
    Trigger,
    Portal,
    Content,
    Group,
    Label,
    Item,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    ItemIndicator,
    Separator,
    Arrow,
    Sub,
    SubTrigger,
    SubContent,
    ItemTitle,
    ItemSubtitle,
    ItemIcon,
    ItemImage,
  })
  return DropdownMenu
}
