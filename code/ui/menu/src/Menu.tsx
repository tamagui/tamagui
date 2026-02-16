import {
  type CreateBaseMenuProps,
  createNativeMenu,
  withNativeMenu,
} from '@tamagui/create-menu'
import { withStaticProperties } from '@tamagui/web'
import React from 'react'
import { DROPDOWN_MENU_CONTEXT, createNonNativeMenu } from './createNonNativeMenu'

export function createMenu(params: CreateBaseMenuProps) {
  const { Menu: NativeMenuRoot } = createNativeMenu('Menu')
  const NonNativeMenu = createNonNativeMenu(params)

  const COMMON_PARAMS = {
    isRoot: false,
    scope: DROPDOWN_MENU_CONTEXT,
  }

  const MenuComp = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.Root,
    NativeComponent: NativeMenuRoot,
    isRoot: true,
  })

  const Trigger = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.Trigger,
    NativeComponent: NativeMenuRoot.Trigger,
  })
  const Portal = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.Portal,
    NativeComponent: React.Fragment,
  })
  const Content = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.Content,
    NativeComponent: NativeMenuRoot.Content,
  })
  const Group = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.Group,
    NativeComponent: NativeMenuRoot.Group,
  })
  const Label = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.Label,
    NativeComponent: NativeMenuRoot.Label,
  })
  const Item = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.Item,
    NativeComponent: NativeMenuRoot.Item,
  })
  const ItemTitle = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.ItemTitle,
    NativeComponent: NativeMenuRoot.ItemTitle,
  })
  const ItemSubtitle = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.ItemSubtitle,
    NativeComponent: NativeMenuRoot.ItemSubtitle,
  })

  const ItemIcon = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.ItemIcon,
    NativeComponent: NativeMenuRoot.ItemIcon,
  })

  const ItemImage = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.ItemImage,
    NativeComponent: NativeMenuRoot.ItemImage,
  })

  const CheckboxItem = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.CheckboxItem,
    NativeComponent: NativeMenuRoot.CheckboxItem,
  })
  const RadioGroup = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.RadioGroup,
    NativeComponent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  })
  const RadioItem = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.RadioItem,
    NativeComponent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  })
  const ItemIndicator = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.ItemIndicator,
    NativeComponent: NativeMenuRoot.ItemIndicator,
  })
  const Separator = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.Separator,
    NativeComponent: NativeMenuRoot.Separator,
  })
  const Arrow = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.Arrow,
    NativeComponent: NativeMenuRoot.Arrow,
  })
  const Sub = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.Sub,
    NativeComponent: NativeMenuRoot.Sub,
  })
  const SubTrigger = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.SubTrigger,
    NativeComponent: NativeMenuRoot.SubTrigger,
  })
  const SubContent = withNativeMenu({
    ...COMMON_PARAMS,
    Component: NonNativeMenu.SubContent,
    NativeComponent: NativeMenuRoot.SubContent,
  })

  // ScrollView is web-only, native menus use native UI that handles overflow automatically
  const ScrollView = NonNativeMenu.ScrollView

  const Menu = withStaticProperties(MenuComp, {
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
    ScrollView,
  } as const)
  return Menu
}
