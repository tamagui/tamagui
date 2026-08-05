import type { ComponentType, ReactElement, ReactNode } from 'react'
import React from 'react'

import type { NativeMenuAdapter, NativeMenuModule } from './nativeMenuState'

type ExpoMenuAction = {
  id: string
  title: string
  image?: unknown
  state?: 'on' | 'off'
  attributes?: {
    destructive?: boolean
    disabled?: boolean
    hidden?: boolean
  }
  subactions?: ExpoMenuAction[]
  displayInline?: boolean
}

type ExpoMenuViewProps = {
  actions: ExpoMenuAction[]
  title?: string
  shouldOpenOnLongPress?: boolean
  onPressAction?: (event: { nativeEvent: { event: string } }) => void
  onOpenMenu?: () => void
  onCloseMenu?: () => void
  children?: ReactNode
}

export type ExpoUIMenuAdapterOptions = {
  MenuView: ComponentType<any>
}

type MarkerProps = {
  children?: ReactNode
  [key: string]: unknown
}

function marker(name: string): ComponentType<MarkerProps> {
  const Marker = () => null
  Marker.displayName = `ExpoUI${name}`
  return Marker
}

function isMarkerType(candidate: unknown, type: ComponentType<MarkerProps>): boolean {
  if (candidate === type) return true
  // createMenu runs every native component through withNativeMenu, which wraps
  // it in a new function component and copies the marker's displayName onto the
  // wrapper. that wrapper is a different reference, so an identity-only check
  // matches nothing and every item silently comes back with an empty title, no
  // icon, and no submenu. fall back to the (unique, ExpoUI-prefixed) name.
  const wanted = (type as { displayName?: string }).displayName
  if (!wanted) return false
  return (
    typeof candidate === 'function' &&
    (candidate as { displayName?: string }).displayName === wanted
  )
}

function elementOfType(
  children: ReactNode,
  type: ComponentType<MarkerProps>
): ReactElement<MarkerProps> | null {
  for (const child of React.Children.toArray(children)) {
    if (React.isValidElement<MarkerProps>(child) && isMarkerType(child.type, type)) {
      return child
    }
  }
  return null
}

function textFromNode(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (!React.isValidElement<MarkerProps>(node)) return ''
  return React.Children.toArray(node.props.children).map(textFromNode).join('')
}

export function createExpoUIMenuAdapter({
  MenuView,
}: ExpoUIMenuAdapterOptions): NativeMenuAdapter {
  const NativeMenuView: ComponentType<ExpoMenuViewProps> = MenuView

  function createModule(isContextMenu: boolean): NativeMenuModule {
    const Trigger = marker('Trigger')
    const Content = marker('Content')
    const Item = marker('Item')
    const ItemTitle = marker('ItemTitle')
    const ItemSubtitle = marker('ItemSubtitle')
    const ItemIcon = marker('ItemIcon')
    const ItemImage = marker('ItemImage')
    const ItemIndicator = marker('ItemIndicator')
    const Group = marker('Group')
    const Label = marker('Label')
    const Separator = marker('Separator')
    const Sub = marker('Sub')
    const SubTrigger = marker('SubTrigger')
    const SubContent = marker('SubContent')
    const CheckboxItem = marker('CheckboxItem')
    const Preview = marker('Preview')
    const Auxiliary = marker('Auxiliary')

    function Root({
      children,
      onOpenChange,
      onOpenWillChange,
    }: {
      children?: ReactNode
      onOpenChange?: (open: boolean) => void
      onOpenWillChange?: (open: boolean) => void
    }) {
      const trigger = elementOfType(children, Trigger)
      const content = elementOfType(children, Content)
      const preview = elementOfType(children, Preview)
      const auxiliary = elementOfType(children, Auxiliary)

      if (preview || auxiliary) {
        throw new Error(
          '@expo/ui/community/menu does not support Tamagui context-menu previews or auxiliary views'
        )
      }
      if (!trigger || !content) {
        throw new Error('Tamagui native menus require one Trigger and one Content')
      }

      let nextId = 0
      const handlers = new Map<string, () => void>()

      function actionId(element: ReactElement<MarkerProps>): string {
        return element.key == null
          ? `tamagui-menu-${nextId++}`
          : String(element.key).replace(/^\.\$/, '')
      }

      function itemTitle(element: ReactElement<MarkerProps>): string {
        if (typeof element.props.textValue === 'string') return element.props.textValue
        const title = elementOfType(element.props.children, ItemTitle)
        return title ? textFromNode(title.props.children) : ''
      }

      function actionImage(element: ReactElement<MarkerProps>): unknown {
        const image = elementOfType(element.props.children, ItemImage)
        if (image?.props.source) return image.props.source
        const icon = elementOfType(element.props.children, ItemIcon)
        if (!icon) return undefined
        const ios = icon.props.ios
        if (
          typeof ios === 'object' &&
          ios &&
          'name' in ios &&
          typeof ios.name === 'string'
        ) {
          return ios.name
        }
        return typeof icon.props.iosIconName === 'string'
          ? icon.props.iosIconName
          : undefined
      }

      function attributes(
        element: ReactElement<MarkerProps>
      ): ExpoMenuAction['attributes'] {
        const destructive = element.props.destructive === true
        const disabled = element.props.disabled === true
        const hidden = element.props.hidden === true
        return destructive || disabled || hidden
          ? { destructive, disabled, hidden }
          : undefined
      }

      function actionsFrom(childrenToParse: ReactNode): ExpoMenuAction[] {
        const actions: ExpoMenuAction[] = []
        let section: ExpoMenuAction[] | null = null

        function append(action: ExpoMenuAction) {
          if (section) {
            section.push(action)
          } else {
            actions.push(action)
          }
        }

        function flushSection() {
          if (!section?.length) {
            section = []
            return
          }
          actions.push({
            id: `tamagui-menu-section-${nextId++}`,
            title: '',
            subactions: section,
            displayInline: true,
          })
          section = []
        }

        for (const child of React.Children.toArray(childrenToParse)) {
          if (!React.isValidElement<MarkerProps>(child)) continue

          if (isMarkerType(child.type, Separator)) {
            if (!section) section = actions.splice(0)
            flushSection()
            continue
          }

          if (isMarkerType(child.type, Group)) {
            const label = elementOfType(child.props.children, Label)
            append({
              id: actionId(child),
              title: label ? textFromNode(label.props.children) : '',
              subactions: actionsFrom(child.props.children),
              displayInline: true,
            })
            continue
          }

          if (isMarkerType(child.type, Sub)) {
            const subTrigger = elementOfType(child.props.children, SubTrigger)
            const subContent = elementOfType(child.props.children, SubContent)
            if (!subTrigger || !subContent) {
              throw new Error(
                'Tamagui native submenus require one SubTrigger and SubContent'
              )
            }
            append({
              id: actionId(child),
              title: itemTitle(subTrigger),
              image: actionImage(subTrigger),
              attributes: attributes(subTrigger),
              subactions: actionsFrom(subContent.props.children),
            })
            continue
          }

          if (!isMarkerType(child.type, Item) && !isMarkerType(child.type, CheckboxItem))
            continue

          if (elementOfType(child.props.children, ItemSubtitle)) {
            throw new Error(
              '@expo/ui/community/menu does not support menu item subtitles'
            )
          }

          const id = actionId(child)
          if (isMarkerType(child.type, CheckboxItem)) {
            const current =
              child.props.value === true ||
              child.props.value === 'on' ||
              child.props.checked === true
            const onValueChange = child.props.onValueChange
            const onCheckedChange = child.props.onCheckedChange
            handlers.set(id, () => {
              if (typeof onValueChange === 'function') {
                onValueChange(current ? 'off' : 'on', current ? 'on' : 'off')
              } else if (typeof onCheckedChange === 'function') {
                onCheckedChange(!current)
              }
            })
            append({
              id,
              title: itemTitle(child),
              image: actionImage(child),
              state: current ? 'on' : 'off',
              attributes: attributes(child),
            })
            continue
          }

          const onSelect = child.props.onSelect
          if (typeof onSelect === 'function') {
            handlers.set(id, () => onSelect())
          }
          append({
            id,
            title: itemTitle(child),
            image: actionImage(child),
            attributes: attributes(child),
          })
        }

        if (section) flushSection()
        return actions
      }

      const label = elementOfType(content.props.children, Label)
      const triggerAction = trigger.props.action

      return (
        <NativeMenuView
          actions={actionsFrom(content.props.children)}
          title={label ? textFromNode(label.props.children) : undefined}
          shouldOpenOnLongPress={
            triggerAction === 'longPress' || (triggerAction !== 'press' && isContextMenu)
          }
          onPressAction={(event) => handlers.get(event.nativeEvent.event)?.()}
          onOpenMenu={() => {
            onOpenWillChange?.(true)
            onOpenChange?.(true)
          }}
          onCloseMenu={() => {
            onOpenWillChange?.(false)
            onOpenChange?.(false)
          }}
        >
          {trigger.props.children}
        </NativeMenuView>
      )
    }

    return {
      Root,
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
      Preview,
      Auxiliary,
    }
  }

  return {
    name: 'expo-ui',
    Menu: createModule(false),
    ContextMenu: createModule(true),
  }
}
