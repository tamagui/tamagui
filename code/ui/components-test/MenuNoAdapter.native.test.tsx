import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { Menu } from '@tamagui/menu'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('native'))

function hasTestID(json: any, testID: string): boolean {
  if (!json) return false
  if (Array.isArray(json)) return json.some((j) => hasTestID(j, testID))
  if (json.props?.testID === testID) return true
  return hasTestID(json.children, testID)
}

describe('native menu without a registered adapter', () => {
  test('renders the cross-platform menu instead of nothing', async () => {
    let renderer: TestRenderer.ReactTestRenderer

    await act(async () => {
      renderer = TestRenderer.create(
        <TamaguiProvider config={config} defaultTheme="light">
          <Menu open>
            <Menu.Trigger>
              <View testID="menu-trigger" />
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item key="one" textValue="One">
                <Menu.ItemTitle>One</Menu.ItemTitle>
              </Menu.Item>
              <View testID="menu-content-child" />
            </Menu.Content>
          </Menu>
        </TamaguiProvider>
      )
    })

    const json = renderer!.toJSON()
    expect(hasTestID(json, 'menu-trigger')).toBe(true)
    expect(hasTestID(json, 'menu-content-child')).toBe(true)
  })
})
