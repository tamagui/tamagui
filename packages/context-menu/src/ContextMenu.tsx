import { isWeb, withStaticProperties } from '@tamagui/core'
import { createNativeMenu, useNativeProp } from '@tamagui/menu'
import React from 'react'

import {
  CONTEXTMENU_CONTEXT,
  ContextMenu as NonNativeContextMenu,
} from './NonNativeContextMenu'

const { Menu: NativeMenuRoot } = createNativeMenu('ContextMenu')

const ContextMenuComp = withNativeMenu(NonNativeContextMenu, NativeMenuRoot, true)

const Trigger = withNativeMenu(NonNativeContextMenu.Trigger, NativeMenuRoot.Trigger)
const Portal = withNativeMenu(NonNativeContextMenu.Portal, React.Fragment)
const Content = withNativeMenu(NonNativeContextMenu.Content, NativeMenuRoot.Content)
const Preview = withNativeMenu(
  NonNativeContextMenu.Preview,
  NativeMenuRoot.Preview,
  false
)
const Group = withNativeMenu(NonNativeContextMenu.Group, NativeMenuRoot.Group)
const Label = withNativeMenu(NonNativeContextMenu.Label, NativeMenuRoot.Label)
const Item = withNativeMenu(NonNativeContextMenu.Item, NativeMenuRoot.Item)
const ItemTitle = withNativeMenu(NonNativeContextMenu.ItemTitle, NativeMenuRoot.ItemTitle)
const ItemSubtitle = withNativeMenu(
  NonNativeContextMenu.ItemSubtitle,
  NativeMenuRoot.ItemSubtitle
)

const ItemIcon = withNativeMenu(NonNativeContextMenu.ItemIcon, NativeMenuRoot.ItemIcon)

const ItemImage = withNativeMenu(NonNativeContextMenu.ItemImage, NativeMenuRoot.ItemImage)

const CheckboxItem = withNativeMenu(
  NonNativeContextMenu.CheckboxItem,
  NativeMenuRoot.CheckboxItem
)
const RadioGroup = withNativeMenu(
  NonNativeContextMenu.RadioGroup,
  ({ children }) => children
)
const RadioItem = withNativeMenu(
  NonNativeContextMenu.RadioItem,
  ({ children }) => children
)
const ItemIndicator = withNativeMenu(
  NonNativeContextMenu.ItemIndicator,
  NativeMenuRoot.ItemIndicator
)
const Separator = withNativeMenu(NonNativeContextMenu.Separator, NativeMenuRoot.Separator)
const Arrow = withNativeMenu(NonNativeContextMenu.Arrow, NativeMenuRoot.Arrow)
const Sub = withNativeMenu(NonNativeContextMenu.Sub, NativeMenuRoot.Sub)
const SubTrigger = withNativeMenu(
  NonNativeContextMenu.SubTrigger,
  NativeMenuRoot.SubTrigger
)
const SubContent = withNativeMenu(
  NonNativeContextMenu.SubContent,
  NativeMenuRoot.SubContent
)

export const ContextMenu = withStaticProperties(ContextMenuComp, {
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
  Preview,
})

function withNativeMenu<
  C extends React.ComponentType<any>,
  N extends React.ComponentType<any>
>(Component: C, NativeComponent: N, isRoot = false) {
  if (isWeb) return Component
  const Menu = (
    props: React.ComponentProps<C> & React.ComponentProps<N> & { native?: boolean }
  ) => {
    let isNative = true
    if (isRoot) {
      isNative = props.native
    } else {
      isNative = useNativeProp(CONTEXTMENU_CONTEXT).native
    }
    if (isNative) {
      return <NativeComponent {...(props as React.ComponentProps<N>)} />
    }

    return <Component {...(props as React.ComponentProps<C>)} />
  }

  Menu.displayName = `${Component.displayName}Wrapper`

  return Menu
}
