/**
 * Credit to the nandorojo/Zeego for the original implementation of this file
 */
import { MenuView } from '@react-native-menu/menu'
import { withStaticProperties } from '@tamagui/core'
import type React from 'react'
import { Children, type ReactElement, cloneElement } from 'react'
import { View } from 'tamagui'

import { NativePropProvider } from '../createMenu'
import type {
  ContextMenuAuxliliaryProps,
  ContextMenuContentProps,
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
import {
  create,
  filterNull,
  flattenChildren,
  isInstanceOfComponent,
  pickChildren,
} from './utils'

const COMPONENTS_TO_IGNORE = ['Portal', 'Radio']

const createAndroidMenu = (MenuType: 'ContextMenu' | 'DropdownMenu') => {
  const Trigger = create(({ children, asChild, ...rest }: MenuTriggerProps) => {
    if (asChild) {
      return cloneElement(children, {
        ...rest,
      })
    }
    return <View {...rest}>{children}</View>
  }, `${MenuType}Trigger`)

  const Auxiliary = create(
    ({ children }: ContextMenuAuxliliaryProps) => null,
    `${MenuType}Auxiliary`
  )

  const Group = create(({ children }: MenuGroupProps) => {
    return <>{children}</>
  }, `${MenuType}Group`)

  const Content = create(({ children }: MenuContentProps | ContextMenuContentProps) => {
    if (!children) {
      console.error(`Menu <Content /> children must be written directly inline.

You cannot wrap this component into its own component. It should look like this:

<Menu>
  <Content>
    <Item />
    <Item />
  </Content>
</Menu>

Notice that the <Item /> are all children of the <Content /> component. That's important.

If you want to use a custom component as your <Content />, you can use the create() method. But you still need to pass all items as children of <Content />.`)
    }
    return <>{children}</>
  }, `${MenuType}Content`)

  const ItemTitle = create(({ children }: MenuItemTitleProps) => {
    if (typeof children != 'string') {
      throw new Error('Menu <ItemTitle /> child must be a string')
    }
    return <>{children}</>
  }, `${MenuType}ItemTitle`)

  const ItemIcon = create((props: MenuItemIconProps) => {
    if (!props.androidIconName) {
      console.warn(
        'Menu <ItemIcon /> missing androidIconName prop. Will do nothing on android. Consider passing an androidIconName or switching to <ItemImage />.'
      )
    }
    return <>{}</>
  }, `${MenuType}ItemIcon`)

  const ItemImage = create((props: MenuItemImageProps) => {
    // if (!props.source) {
    //   console.error('Menu <ItemImage /> missing source prop.')
    // }
    if (!props.androidIconName) {
      console.warn(
        'Menu <ItemImage /> will not use your custom image on android. You should use the androidIconName prop to render an icon on android too.'
      )
    }
    return <>{}</>
  }, `${MenuType}ItemImage`)

  const ItemSubtitle = create(({ children }: MenuItemSubtitleProps) => {
    if (children && typeof children != 'string') {
      throw new Error('Menu <ItemSubtitle /> child must be a string')
    }
    return <>{children}</>
  }, `${MenuType}ItemSubtitle`)

  const Item = create(({ children }: MenuItemProps) => {
    const titleChild = pickChildren(children, ItemTitle).targetChildren
    if (typeof children != 'string' && !titleChild?.length) {
      console.error(
        `Menu Invalid <Item />. It either needs <ItemTitle /> in the children.

<Item>
  <ItemTitle>
    Title here
  </ItemTitle>
</Item>
  `
      )
    }
    return <>{children}</>
  }, `${MenuType}Item`)

  const SubTrigger = create(({ children }: MenuSubTriggerProps) => {
    const titleChild = pickChildren(children, ItemTitle).targetChildren
    if (typeof children != 'string' && !titleChild?.length) {
      console.error(
        `Menu Invalid <SubTrigger />. It either needs an <ItemTitle /> in the children.

<SubTrigger>
  <ItemTitle>
    Title here
  </ItemTitle>
</SubTrigger>
  `
      )
    }
    return <>{children}</>
  }, `${MenuType}SubTrigger`)
  const Sub = create((_: MenuSubProps) => <></>, `${MenuType}Sub`)
  const SubContent = create((_: MenuSubContentProps) => <></>, `${MenuType}SubContent`)

  const CheckboxItem = create(({ children }: MenuCheckboxItemProps) => {
    return <></>
  }, `${MenuType}CheckboxItem`)

  const Label = create(({ children }: MenuLabelProps) => {
    if (typeof children != 'string') {
      console.error('Menu <Label /> children must be a string.')
    }
    return <></>
  }, `${MenuType}Label`)

  type MenuAttributes = {
    disabled?: boolean
    destructive?: boolean
    hidden?: boolean
  }

  type MenuConfig = {
    id?: string
    title: string
    subactions: (MenuItem | MenuConfig)[]
    attributes?: MenuAttributes
    image?: MenuItemIcon
  }

  type MenuItemIcon = string

  type MenuItem = {
    id: string
    title: string
    titleColor?: string
    subtitle?: string
    image?: string
    imageColor?: string
    state?: 'on' | 'off' | 'mixed'
    attributes?: MenuAttributes
  }

  const Menu = create((props: MenuProps) => {
    const trigger = pickChildren<MenuTriggerProps>(props.children, Trigger)
    const content = pickChildren<MenuContentProps | ContextMenuContentProps>(
      props.children,
      Content,
      COMPONENTS_TO_IGNORE
    ).targetChildren?.[0]

    const callbacks: Record<string, () => void> = {}

    const getItemFromChild = (
      child: ReactElement<MenuItemProps | MenuSubTriggerProps | MenuCheckboxItemProps>,
      index: number
    ) => {
      let title: string | undefined
      const key: string = child.key ? `${child.key}` : `item-${index}`
      let subtitle: string | undefined
      const menuAttributes: MenuAttributes = {}

      if (child.props.disabled) {
        menuAttributes.disabled = true
      }
      if (child.props.destructive) {
        menuAttributes.destructive = true
      }
      if (child.props.hidden) {
        menuAttributes.hidden = true
      }

      let icon: MenuItem['image']

      if (typeof child.props.children == 'string') {
        title = child.props.children
      } else {
        const titleChild = pickChildren<MenuItemTitleProps>(
          child.props.children,
          ItemTitle,
          COMPONENTS_TO_IGNORE
        ).targetChildren

        const maybeTitle = child.props.textValue ?? titleChild?.[0]?.props.children

        if (typeof maybeTitle == 'string') {
          title = maybeTitle
        } else {
          console.error(
            `Menu Invalid <${Menu}.Item key="${key}" /> Missing valid title. Make sure you do one of the following:
  
  1. pass a string as the child of <${Menu}.ItemTitle />, nested directly inside of <${Menu}.Item />.
  2. OR, use the textValue prop on <${Menu}.Item textValue="Some value" />`
          )
        }

        const subtitleChild = pickChildren<MenuItemSubtitleProps>(
          child.props.children,
          ItemSubtitle
        ).targetChildren
        if (typeof subtitleChild?.[0]?.props.children == 'string') {
          subtitle = subtitleChild[0].props.children
        }

        const iconChildren = pickChildren<MenuItemIconProps>(
          child.props.children,
          ItemIcon
        ).targetChildren

        if (iconChildren?.[0]?.props.androidIconName) {
          icon = iconChildren[0].props.androidIconName
        } else {
          const imageChild = pickChildren<MenuItemImageProps>(
            child.props.children,
            ItemImage
          ).targetChildren?.[0]

          if (imageChild) {
            const { androidIconName } = imageChild.props
            if (androidIconName) {
              icon = androidIconName
            } else {
              // require('react-native/Libraries/Network/RCTNetworking')
              // const { Image } =
              //   require('react-native') as typeof import('react-native')
              // const iconValue = Image.resolveAssetSource(source)
              // icon = {
              //   iconType: 'REQUIRE',
              //   iconValue,
              // }
            }
          }
        }
      }
      if (title) {
        const maybeIndexKey =
          typeof child.key == 'string' && child.key.startsWith('.')
            ? child.key.substring(1)
            : undefined

        if (
          // if the key doesn't exist as a string
          typeof child.key != 'string' ||
          // or if flattenChildren assigned the key as `.${key}${index}`
          (child.key.startsWith('.') && !Number.isNaN(Number(maybeIndexKey)))
        ) {
          console.warn(
            `Menu <Item /> is missing a unique key. Pass a unique key string for each item, such as: <Item key="${
              title.toLowerCase().replace(/ /g, '-') || `action-${index}`
            }" />. Falling back to index (${key}) instead, but this may have negative consequences.`
          )
        }
        if ('onSelect' in child.props && child.props.onSelect) {
          // @ts-ignore
          callbacks[key] = child.props.onSelect
        } else if ('onValueChange' in child.props) {
          const menuState = child.props.value
          const currentState =
            menuState === true ? 'on' : menuState === false ? 'off' : menuState
          const nextState =
            currentState === 'mixed' || currentState === 'on' ? 'off' : 'on'
          const { onValueChange } = child.props
          callbacks[key] = () => {
            onValueChange?.(nextState, currentState)
          }
        }

        return {
          key,
          title,
          subtitle,
          menuAttributes,
          icon,
        }
      }
      return
    }

    const mapItemsChildren = (
      children: React.ReactNode
    ): ((MenuItem | MenuConfig) | null)[] => {
      return Children.map(
        flattenChildren(children, [...COMPONENTS_TO_IGNORE, 'Group']),
        (_child, index) => {
          if (isInstanceOfComponent(_child, Item)) {
            const child = _child as ReactElement<MenuItemProps>

            const item = getItemFromChild(child, index)
            if (item) {
              const { icon, title, key, menuAttributes, subtitle } = item
              const finalItem: MenuItem = {
                id: key,
                title,
                image: icon,
                attributes: menuAttributes,
                subtitle,
              }
              return finalItem
            }
          } else if (isInstanceOfComponent(_child, CheckboxItem)) {
            const child = _child as ReactElement<MenuCheckboxItemProps>

            const item = getItemFromChild(child, index)
            if (item) {
              const { icon, title, key, menuAttributes, subtitle } = item
              const menuState = child.props.value
              const currentState =
                menuState === true ? 'on' : menuState === false ? 'off' : menuState

              const finalItem: MenuItem = {
                id: key,
                title,
                image: icon,
                attributes: menuAttributes,
                subtitle,
                state: currentState,
              }
              return finalItem
            }
          } else if (isInstanceOfComponent(_child, Sub)) {
            const child = _child as ReactElement<MenuProps>
            const key: string = child.key ? `${child.key}` : `sub-${index}`
            const triggerItemChild = pickChildren<MenuSubTriggerProps>(
              child.props.children,
              SubTrigger
            ).targetChildren?.[0]

            const triggerItem =
              triggerItemChild && getItemFromChild(triggerItemChild, index)
            if (triggerItem) {
              const nestedContent = pickChildren<MenuContentProps>(
                child.props.children,
                SubContent,
                COMPONENTS_TO_IGNORE
              ).targetChildren?.[0]

              if (nestedContent) {
                const nestedItems = mapItemsChildren(nestedContent.props.children).filter(
                  filterNull
                )

                if (nestedItems.length) {
                  const menuConfig: MenuConfig = {
                    id: key,
                    title: triggerItem?.title,
                    image: triggerItem?.icon,
                    subactions: nestedItems,
                    attributes: triggerItem.menuAttributes,
                  }
                  return menuConfig
                }
              }
            }
          }
          return null
        }
      )
    }

    const menuItems = mapItemsChildren(content?.props.children).filter(filterNull)

    const labelComp = pickChildren<MenuLabelProps>(content?.props.children, Label)
      .targetChildren?.[0]
    let menuTitle = ''
    if (typeof labelComp?.props.children == 'string') {
      menuTitle = labelComp.props.children
    } else if (labelComp?.props.textValue) {
      menuTitle = labelComp.props.textValue
    }

    const triggerItem = trigger.targetChildren?.[0]

    let shouldOpenOnLongPress = MenuType === 'ContextMenu'

    if (triggerItem?.props.action) {
      shouldOpenOnLongPress = triggerItem.props.action === 'longPress'
    }

    return (
      <NativePropProvider
        native
        // to avoid circular dependency we havn't imported these static strings from DropdownMenu and ContextMenu
        scope={MenuType === 'DropdownMenu' ? 'DropdownMenuContext' : 'ContextMenuContext'}
      >
        <MenuView
          title={menuTitle}
          onPressAction={({ nativeEvent }) => {
            callbacks[nativeEvent.event]()
          }}
          shouldOpenOnLongPress={shouldOpenOnLongPress}
          actions={menuItems}
        >
          {triggerItem}
        </MenuView>
      </NativePropProvider>
    )
  }, `${MenuType}`)

  const Separator = create((_: MenuSeparatorProps) => {
    return <></>
  }, `${MenuType}Separator`)

  const ItemIndicator = create(
    (_: MenuItemIndicatorProps) => <></>,
    `${MenuType}ItemIndicator`
  )

  const Preview = create((_: ContextMenuPreviewProps) => <></>, `${MenuType}Preview`)

  const Arrow = create((_: MenuArrowProps) => <></>, `${MenuType}Arrow`)

  return {
    Menu: withStaticProperties(Menu, {
      Trigger,
      Content,
      Item,
      ItemTitle,
      ItemSubtitle,
      SubTrigger,
      Group,
      Separator,
      ItemIcon,
      ItemIndicator,
      CheckboxItem,
      ItemImage,
      Label,
      Preview,
      Arrow,
      Sub,
      SubContent,
      Auxiliary,
    }),
  }
}

export { createAndroidMenu as createNativeMenu }
