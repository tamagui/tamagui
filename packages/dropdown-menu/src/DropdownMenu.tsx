import { isWeb, withStaticProperties } from '@tamagui/core'
import { createNativeMenu, useNativeProp } from '@tamagui/menu'
import React from 'react'

import {
  DROPDOWN_MENU_CONTEXT,
  DropdownMenu as NonNativeDropdownMenu,
} from './NonNativeDropdownMenu'

const { Menu: NativeMenuRoot } = createNativeMenu('DropdownMenu')

const DropdownMenuComp = withNativeMenu(NonNativeDropdownMenu, NativeMenuRoot, true)

const Trigger = withNativeMenu(NonNativeDropdownMenu.Trigger, NativeMenuRoot.Trigger)
const Portal = withNativeMenu(NonNativeDropdownMenu.Portal, React.Fragment)
const Content = withNativeMenu(NonNativeDropdownMenu.Content, NativeMenuRoot.Content)
const Group = withNativeMenu(NonNativeDropdownMenu.Group, NativeMenuRoot.Group)
const Label = withNativeMenu(NonNativeDropdownMenu.Label, NativeMenuRoot.Label)
const Item = withNativeMenu(NonNativeDropdownMenu.Item, NativeMenuRoot.Item)
const ItemTitle = withNativeMenu(
  NonNativeDropdownMenu.ItemTitle,
  NativeMenuRoot.ItemTitle
)
const ItemSubtitle = withNativeMenu(
  NonNativeDropdownMenu.ItemSubtitle,
  NativeMenuRoot.ItemSubtitle
)

const ItemIcon = withNativeMenu(NonNativeDropdownMenu.ItemIcon, NativeMenuRoot.ItemIcon)

const ItemImage = withNativeMenu(
  NonNativeDropdownMenu.ItemImage,
  NativeMenuRoot.ItemImage
)

const CheckboxItem = withNativeMenu(
  NonNativeDropdownMenu.CheckboxItem,
  NativeMenuRoot.CheckboxItem
)
const RadioGroup = withNativeMenu(
  NonNativeDropdownMenu.RadioGroup,
  ({ children }) => children
)
const RadioItem = withNativeMenu(
  NonNativeDropdownMenu.RadioItem,
  ({ children }) => children
)
const ItemIndicator = withNativeMenu(
  NonNativeDropdownMenu.ItemIndicator,
  NativeMenuRoot.ItemIndicator
)
const Separator = withNativeMenu(
  NonNativeDropdownMenu.Separator,
  NativeMenuRoot.Separator
)
const Arrow = withNativeMenu(NonNativeDropdownMenu.Arrow, NativeMenuRoot.Arrow)
const Sub = withNativeMenu(NonNativeDropdownMenu.Sub, NativeMenuRoot.Sub)
const SubTrigger = withNativeMenu(
  NonNativeDropdownMenu.SubTrigger,
  NativeMenuRoot.SubTrigger
)
const SubContent = withNativeMenu(
  NonNativeDropdownMenu.SubContent,
  NativeMenuRoot.SubContent
)

export const DropdownMenu = withStaticProperties(DropdownMenuComp, {
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

function withNativeMenu<
  C extends React.ComponentType<any>,
  N extends React.ComponentType<any>
>(Component: C, NativeComponent: N, isRoot = false) {
  if (isWeb) return Component
  const Menu = (
    props: React.ComponentProps<C> & React.ComponentProps<N> & { native: boolean }
  ) => {
    let isNative = true
    if (isRoot) {
      isNative = props.native
    } else {
      isNative = useNativeProp(DROPDOWN_MENU_CONTEXT).native
    }
    if (isNative) {
      return <NativeComponent {...(props as React.ComponentProps<N>)} />
    }

    return <Component {...(props as React.ComponentProps<C>)} />
  }

  Menu.displayName = `${Component.displayName}Wrapper`

  return Menu
}
