import { createNativeMenu } from '@tamagui/create-menu'
import { createExpoUIMenuAdapter, registerNativeMenuAdapter } from '@tamagui/native'
import type { ReactNode } from 'react'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test, vi } from 'vitest'

type MenuViewProps = {
  actions: Array<{
    id: string
    title: string
    state?: 'on' | 'off'
    subactions?: Array<{ id: string; title: string }>
  }>
  title?: string
  shouldOpenOnLongPress?: boolean
  onPressAction?: (event: { nativeEvent: { event: string } }) => void
  children?: ReactNode
}

describe('native menu adapters', () => {
  test('maps Tamagui menu primitives to Expo UI actions', async () => {
    let menuViewProps: MenuViewProps | null = null
    const onOpen = vi.fn()
    const onSelect = vi.fn()
    const onCheckedChange = vi.fn()

    function MenuView(props: MenuViewProps) {
      menuViewProps = props
      return <>{props.children}</>
    }

    function Trigger() {
      return null
    }

    registerNativeMenuAdapter(createExpoUIMenuAdapter({ MenuView }))
    const { Menu: ContextMenu } = createNativeMenu('ContextMenu')

    await act(async () => {
      TestRenderer.create(
        <ContextMenu onOpenChange={onOpen}>
          <ContextMenu.Trigger>
            <Trigger />
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Label>Project actions</ContextMenu.Label>
            <ContextMenu.Item key="rename" onSelect={onSelect}>
              <ContextMenu.ItemTitle>Rename</ContextMenu.ItemTitle>
            </ContextMenu.Item>
            <ContextMenu.CheckboxItem
              key="favorite"
              checked
              onCheckedChange={onCheckedChange}
            >
              <ContextMenu.ItemTitle>Favorite</ContextMenu.ItemTitle>
            </ContextMenu.CheckboxItem>
            <ContextMenu.Sub key="move">
              <ContextMenu.SubTrigger>
                <ContextMenu.ItemTitle>Move</ContextMenu.ItemTitle>
              </ContextMenu.SubTrigger>
              <ContextMenu.SubContent>
                <ContextMenu.Item key="archive">
                  <ContextMenu.ItemTitle>Archive</ContextMenu.ItemTitle>
                </ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Sub>
          </ContextMenu.Content>
        </ContextMenu>
      )
    })

    const props = menuViewProps!
    expect(props.title).toBe('Project actions')
    expect(props.shouldOpenOnLongPress).toBe(true)
    expect(props.actions).toEqual([
      { id: 'rename', title: 'Rename', image: undefined, attributes: undefined },
      {
        id: 'favorite',
        title: 'Favorite',
        image: undefined,
        state: 'on',
        attributes: undefined,
      },
      {
        id: 'move',
        title: 'Move',
        image: undefined,
        attributes: undefined,
        subactions: [
          { id: 'archive', title: 'Archive', image: undefined, attributes: undefined },
        ],
      },
    ])

    props.onPressAction?.({ nativeEvent: { event: 'rename' } })
    props.onPressAction?.({ nativeEvent: { event: 'favorite' } })
    expect(onSelect).toHaveBeenCalledOnce()
    expect(onCheckedChange).toHaveBeenCalledWith(false)
  })
})
