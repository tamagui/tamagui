/**
 * Credit to the nandorojo/Zeego for the original implementation of this file
 */
import { withStaticProperties } from '@tamagui/core'
import React, { Children, ReactElement, cloneElement, useRef } from 'react'
import { Image } from 'react-native'
import {
  ContextMenuButton,
  ContextMenuView,
  MenuActionConfig,
} from 'react-native-ios-context-menu'
import type { ImageSystemConfig } from 'react-native-ios-context-menu/src/types/ImageItemConfig'
import { View } from 'tamagui'

import { NativePropProvider } from '../createMenu'
import type {
  ContextMenuAuxliliaryProps,
  ContextMenuContentProps,
  ContextMenuPreviewProps,
  ContextMenuSubContentProps,
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

const createIosMenu = (MenuType: 'ContextMenu' | 'DropdownMenu') => {
  const Trigger = create(({ children, asChild, ...rest }: MenuTriggerProps) => {
    if (asChild) {
      return cloneElement(children, {
        ...rest,
      })
    }
    return <View {...rest}>{children}</View>
  }, `${MenuType}Trigger`)

  const Auxiliary = create(({ children }: ContextMenuAuxliliaryProps) => {
    return <></>
  }, `${MenuType}Auxiliary`)

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

  const ItemIcon = create((_: MenuItemIconProps) => {
    return <>{}</>
  }, `${MenuType}ItemIcon`)

  const ItemImage = create((_: MenuItemImageProps) => {
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
        `Menu Invalid <SubTrigger />. It either needs a string as the children, or a <ItemTitle /> in the children. However, it got neither.


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

  const Preview = create((_: ContextMenuPreviewProps) => {
    return <></>
  }, `${MenuType}Preview`)

  Preview.defaultProps = {
    isResizeAnimated: true,
  }

  const CheckboxItem = create(({ children }: MenuCheckboxItemProps) => {
    return <></>
  }, `${MenuType}CheckboxItem`)

  const Label = create(({ children }: MenuLabelProps) => {
    if (typeof children != 'string') {
      console.error('Menu <Label /> children must be a string.')
    }
    return <></>
  }, `${MenuType}Label`)

  type MenuOption = 'destructive' | 'displayInline'
  type MenuAttribute = 'disabled' | 'destructive' | 'hidden'

  type MenuAttributes = MenuAttribute[]
  type MenuOptions = MenuOption[]

  type MenuConfig = {
    menuTitle: string
    menuItems: (MenuItem | MenuConfig)[]
    menuAttributes?: MenuAttributes
    menuOptions?: MenuOptions
    icon?: MenuActionConfig['icon']
  }

  type MenuItem = {
    actionKey: string
    actionTitle: string
    discoverabilityTitle?: string
    menuAttributes?: MenuAttributes
    menuOptions?: MenuOptions
    icon?: MenuActionConfig['icon']
    menuState?: 'on' | 'off' | 'mixed'
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
      const menuAttributes: MenuAttributes = []

      if (child.props.disabled) {
        menuAttributes.push('disabled')
      }
      if (child.props.destructive) {
        menuAttributes.push('destructive')
      }
      if (child.props.hidden) {
        menuAttributes.push('hidden')
      }

      let icon: MenuItem['icon']

      if (typeof child.props.children == 'string') {
        title = child.props.children
      } else {
        const titleChild = pickChildren<MenuItemTitleProps>(
          child.props.children,
          ItemTitle
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

        if (iconChildren?.[0]?.props.iosIconName || iconChildren?.[0]?.props.ios) {
          const iconConfiguration = iconChildren?.[0]?.props.ios

          icon = {
            type: 'IMAGE_SYSTEM',
            imageValue: {
              ...iconConfiguration,
              systemName: iconConfiguration?.name ?? iconChildren[0].props.iosIconName,
            } as ImageSystemConfig,
          }
        } else {
          const imageChild = pickChildren<MenuItemImageProps>(
            child.props.children,
            ItemImage
          ).targetChildren?.[0]

          if (imageChild) {
            if (imageChild.props.source) {
              const { source, ios: { lazy = true, style } = {} } = imageChild.props
              if (typeof source === 'object' && 'uri' in source && source.uri) {
                icon = {
                  type: 'IMAGE_REMOTE_URL',
                  imageValue: {
                    url: source.uri,
                  },
                  imageLoadingConfig: {
                    shouldLazyLoad: lazy ?? true,
                  },
                  imageOptions: style,
                }
              } else {
                const imageValue = Image.resolveAssetSource(imageChild.props.source)
                icon = {
                  type: 'IMAGE_REQUIRE',
                  imageValue,
                }
              }
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
          (child.key.startsWith('.') && !isNaN(Number(maybeIndexKey)))
        ) {
          console.warn(
            `Menu <Item /> is missing a unique key. Pass a unique key string for each item, such as: <Item key="${
              title.toLowerCase().replace(/ /g, '-') || `action-${index}`
            }" />. Falling back to index (${key}) instead, but this may have negative consequences.`
          )
        }
        if ('onSelect' in child.props && child.props.onSelect) {
          //@ts-ignore
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
      return Children.map(flattenChildren(children), (_child, index) => {
        if (isInstanceOfComponent(_child, Item)) {
          const child = _child as ReactElement<MenuItemProps>

          const item = getItemFromChild(child, index)
          if (item) {
            const { icon, title, key, menuAttributes, subtitle } = item
            const finalItem: MenuItem = {
              actionKey: key,
              actionTitle: title,
              icon,
              menuAttributes,
              discoverabilityTitle: subtitle,
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
              actionKey: key,
              actionTitle: title,
              icon,
              menuAttributes,
              discoverabilityTitle: subtitle,
              menuState: currentState,
            }
            return finalItem
          }
        } else if (isInstanceOfComponent(_child, Sub)) {
          const child = _child as ReactElement<MenuProps>
          const triggerItemChild = pickChildren<MenuSubTriggerProps>(
            child.props.children,
            SubTrigger
          ).targetChildren?.[0]

          const triggerItem =
            triggerItemChild && getItemFromChild(triggerItemChild, index)
          if (triggerItem) {
            const nestedContent = pickChildren<
              MenuSubContentProps | ContextMenuSubContentProps
            >(child.props.children, SubContent, COMPONENTS_TO_IGNORE).targetChildren?.[0]

            if (nestedContent) {
              const nestedItems = mapItemsChildren(nestedContent.props.children).filter(
                filterNull
              )

              if (nestedItems.length) {
                const menuOptions: MenuOptions = []
                if (new Set(triggerItem.menuAttributes || []).has('destructive')) {
                  menuOptions.push('destructive')
                }
                const menuConfig: MenuConfig = {
                  menuTitle: triggerItem?.title,
                  icon: triggerItem?.icon,
                  menuItems: nestedItems,
                  menuOptions,
                  menuAttributes: triggerItem.menuAttributes,
                }
                return menuConfig
              }
            }
          }
        } else if (isInstanceOfComponent(_child, Group)) {
          const child = _child as ReactElement<MenuGroupProps>

          const groupItems = mapItemsChildren(child.props.children).filter(filterNull)

          return {
            menuTitle: '',
            menuItems: groupItems,
            menuOptions: ['displayInline'],
          }
        }
        return null
      })
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

    const Component = MenuType === 'ContextMenu' ? ContextMenuView : ContextMenuButton

    const preview = pickChildren(content?.props.children, Preview).targetChildren?.[0]

    const previewProps = preview?.props as ContextMenuPreviewProps | undefined

    const onMenuDidHide =
      props.onOpenChange &&
      (() => {
        props.onOpenChange?.(false)
      })
    const onMenuDidShow =
      props.onOpenChange &&
      (() => {
        props.onOpenChange?.(true)
      })
    const onMenuWillShow =
      props.onOpenWillChange &&
      (() => {
        props.onOpenWillChange?.(true)
      })
    const onMenuWillHide =
      props.onOpenWillChange &&
      (() => {
        props.onOpenWillChange?.(false)
      })

    const triggerItem = trigger.targetChildren?.[0]

    let shouldOpenOnSingleTap = MenuType === 'DropdownMenu'

    if (triggerItem?.props.action) {
      shouldOpenOnSingleTap = triggerItem.props.action === 'press'
    }

    const auxiliary =
      MenuType === 'ContextMenu'
        ? pickChildren<ContextMenuAuxliliaryProps>(content?.props.children, Auxiliary)
            ?.targetChildren
        : undefined

    const auxiliaryProps = auxiliary?.[0]?.props

    const menuRef = useRef<ContextMenuButton>()

    return (
      <NativePropProvider
        native
        // to avoid circular dependency we havn't imported these static strings from DropdownMenu and ContextMenu
        scope={MenuType === 'DropdownMenu' ? 'DropdownMenuContext' : 'ContextMenuContext'}
      >
        <Component
          ref={menuRef as any}
          onPressMenuItem={({ nativeEvent }) => {
            if (callbacks[nativeEvent.actionKey]) {
              callbacks[nativeEvent.actionKey]()
            }
          }}
          isMenuPrimaryAction={shouldOpenOnSingleTap}
          // TODO: how resolve tamagui style to react-native style?
          //@ts-ignore
          style={[{ flexGrow: 0 }, props.style]}
          menuConfig={{
            menuTitle,
            menuItems,
          }}
          renderPreview={
            MenuType === 'ContextMenu' && preview && previewProps?.children
              ? () => {
                  return (
                    <>
                      {typeof previewProps?.children == 'function'
                        ? previewProps.children()
                        : previewProps?.children}
                    </>
                  )
                }
              : undefined
          }
          lazyPreview={
            MenuType === 'ContextMenu'
              ? typeof previewProps?.children == 'function'
              : undefined
          }
          onPressMenuPreview={
            MenuType === 'ContextMenu' ? previewProps?.onPress : undefined
          }
          auxiliaryPreviewConfig={
            auxiliaryProps?.children
              ? {
                  alignmentHorizontal: auxiliaryProps?.alignmentHorizontal,
                  anchorPosition: auxiliaryProps?.anchorPosition,
                  height: auxiliaryProps?.height,
                  marginAuxiliaryPreview: auxiliaryProps?.marginWithScreenEdge,
                  marginPreview: auxiliaryProps?.marginPreview,
                  transitionConfigEntrance: auxiliaryProps?.transitionConfigEntrance,
                  transitionEntranceDelay: auxiliaryProps?.transitionEntranceDelay,
                  width: auxiliaryProps?.width,
                }
              : undefined
          }
          isAuxiliaryPreviewEnabled={!!auxiliaryProps?.children}
          onMenuAuxiliaryPreviewDidShow={auxiliaryProps?.onDidShow}
          onMenuAuxiliaryPreviewWillShow={auxiliaryProps?.onWillShow}
          renderAuxiliaryPreview={
            auxiliaryProps?.children
              ? () => {
                  const child =
                    typeof auxiliaryProps?.children == 'function'
                      ? auxiliaryProps?.children({
                          dismissMenu() {
                            menuRef.current?.dismissMenu()
                          },
                        })
                      : auxiliaryProps?.children
                  return <>{child}</>
                }
              : undefined
          }
          previewConfig={
            preview
              ? {
                  // ...previewProps,
                  previewType: 'CUSTOM',
                  previewSize: previewProps?.size,
                  backgroundColor: previewProps?.backgroundColor,
                  borderRadius: previewProps?.borderRadius,
                  isResizeAnimated: previewProps?.isResizeAnimated,
                  preferredCommitStyle: previewProps?.preferredCommitStyle,
                }
              : undefined
          }
          onMenuDidHide={onMenuDidHide}
          onMenuDidShow={onMenuDidShow}
          onMenuWillHide={onMenuWillHide}
          onMenuWillShow={onMenuWillShow}
          {...props.__unsafeIosProps}
        >
          {triggerItem}
        </Component>
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

export { createIosMenu as createNativeMenu }
