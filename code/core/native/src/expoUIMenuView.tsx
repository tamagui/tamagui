import type { ComponentType, ReactNode } from 'react'
import React from 'react'

import type { ExpoMenuAction, ExpoMenuViewProps } from './expoUIMenuAdapter'

// the swiftui menu behind every native Menu and ContextMenu trigger on ios,
// composed from @expo/ui/swift-ui the same way @expo/ui's community MenuView
// is, minus `matchContents` on the Host. that flag copies each SwiftUI
// measurement back onto the host's yoga node as a fixed height, and yoga then
// measures the trigger's react-native children against that height, so trigger
// content can shrink but never grow: a row that mounts empty and fills in later
// stays at 0pt, and a streaming paragraph stays at its first line count. without
// the flag the host takes its height from the hosted react-native subtree like
// any other view, and RNHostView still sizes the SwiftUI side from that
// subtree's yoga bounds.

type SwiftUIModule = {
  Button: ComponentType<any>
  ContextMenu: ComponentType<any> & {
    Trigger: ComponentType<any>
    Items: ComponentType<any>
  }
  Host: ComponentType<any>
  Menu: ComponentType<any>
  RNHostView: ComponentType<any>
  Section: ComponentType<any>
  Toggle: ComponentType<any>
}

type SwiftUIModifiersModule = {
  disabled: (value: boolean) => unknown
}

export function createExpoUIMenuView({
  swiftUI,
  modifiers,
}: {
  swiftUI: SwiftUIModule
  modifiers: SwiftUIModifiersModule
}): ComponentType<ExpoMenuViewProps> {
  const { Button, ContextMenu, Host, Menu, RNHostView, Section, Toggle } = swiftUI

  function renderAction(
    action: ExpoMenuAction,
    onPressAction: ExpoMenuViewProps['onPressAction']
  ): ReactNode {
    if (action.attributes?.hidden) return null
    const { subactions, displayInline, state, attributes, image, title } = action
    const systemImage = typeof image === 'string' ? image : undefined

    if (subactions && subactions.length > 0) {
      const children = subactions.map((sub) => renderAction(sub, onPressAction))
      if (displayInline) {
        return (
          <Section key={action.id} title={title}>
            {children}
          </Section>
        )
      }
      return (
        <Menu key={action.id} label={title} systemImage={systemImage}>
          {children}
        </Menu>
      )
    }

    const fire = () => onPressAction?.({ nativeEvent: { event: action.id } })
    const itemModifiers = attributes?.disabled ? [modifiers.disabled(true)] : undefined

    if (state === 'on' || state === 'off') {
      return (
        <Toggle
          key={action.id}
          label={title}
          systemImage={systemImage}
          isOn={state === 'on'}
          onIsOnChange={fire}
          modifiers={itemModifiers}
        />
      )
    }

    return (
      <Button
        key={action.id}
        label={title}
        systemImage={systemImage}
        role={attributes?.destructive ? 'destructive' : undefined}
        modifiers={itemModifiers}
        onPress={fire}
      />
    )
  }

  return function ExpoUIMenuView({
    actions,
    onPressAction,
    shouldOpenOnLongPress,
    title,
    children,
  }: ExpoMenuViewProps) {
    const items = actions.map((action) => renderAction(action, onPressAction))
    const body = title ? <Section title={title}>{items}</Section> : items
    // RNHostView takes exactly one element, so the trigger children ride in a
    // fragment
    const trigger = (
      <RNHostView matchContents>
        <>{children}</>
      </RNHostView>
    )
    return (
      <Host ignoreSafeArea="all">
        {shouldOpenOnLongPress ? (
          <ContextMenu>
            <ContextMenu.Trigger>{trigger}</ContextMenu.Trigger>
            <ContextMenu.Items>{body}</ContextMenu.Items>
          </ContextMenu>
        ) : (
          <Menu label={trigger}>{body}</Menu>
        )}
      </Host>
    )
  }
}
