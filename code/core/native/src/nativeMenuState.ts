import type { ComponentType } from 'react'

import { createGlobalState } from './globalState'

export type NativeMenuModule = {
  Root: ComponentType<any>
  Trigger: ComponentType<any>
  Content: ComponentType<any>
  Item: ComponentType<any>
  ItemTitle: ComponentType<any>
  ItemSubtitle: ComponentType<any>
  ItemIcon: ComponentType<any>
  ItemImage: ComponentType<any>
  ItemIndicator: ComponentType<any>
  Group: ComponentType<any>
  Label: ComponentType<any>
  Separator: ComponentType<any>
  Sub: ComponentType<any>
  SubTrigger: ComponentType<any>
  SubContent: ComponentType<any>
  CheckboxItem: ComponentType<any>
  Preview: ComponentType<any>
  Auxiliary: ComponentType<any>
}

/**
 * A native implementation for Tamagui Menu and ContextMenu compound components.
 * Register one adapter before the first native menu renders.
 */
export type NativeMenuAdapter = {
  name: string
  Menu: NativeMenuModule
  ContextMenu: NativeMenuModule
}

type NativeMenuState = {
  enabled: boolean
  adapter: NativeMenuAdapter | null
}

const state = createGlobalState<NativeMenuState>('native-menu-adapter', {
  enabled: false,
  adapter: null,
})

/**
 * Registers the process-wide native menu implementation. Re-registering the same
 * named adapter supports fast refresh; registering a different adapter throws.
 */
export function registerNativeMenuAdapter(adapter: NativeMenuAdapter): void {
  const current = state.get().adapter
  if (current && current.name !== adapter.name) {
    throw new Error(
      `A native menu adapter named "${current.name}" is already registered. ` +
        `Register exactly one adapter before rendering Tamagui menus.`
    )
  }
  state.set({ enabled: true, adapter })
}

export function getNativeMenuAdapter(): NativeMenuAdapter | null {
  return state.get().adapter
}
