import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { Menu } from '@tamagui/menu'
import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, test } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('web') as any)

describe('menu content without an explicit Menu.Portal', () => {
  test('renders the trigger and the content', () => {
    render(
      <TamaguiProvider config={config} defaultTheme="light">
        <Menu open>
          <Menu.Trigger>
            <span data-testid="menu-trigger" />
          </Menu.Trigger>
          <Menu.Content>
            <span data-testid="menu-content-child" />
          </Menu.Content>
        </Menu>
      </TamaguiProvider>
    )
    expect(document.querySelector('[data-testid="menu-trigger"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="menu-content-child"]')).toBeTruthy()
  })
})
