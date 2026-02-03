import { Menu } from '@tamagui/menu'
import React from 'react'
import { Button, Theme, YStack } from 'tamagui'

/**
 * Menu Theme Test Case
 *
 * Tests that menu content inherits the theme from parent context.
 * When a menu is inside a themed context (e.g., theme="blue"),
 * the portal should also render with that theme.
 */
export function MenuThemeCase() {
  return (
    <Theme name="blue">
      <YStack
        data-testid="themed-container"
        backgroundColor="$background"
        padding="$4"
        borderRadius="$4"
        alignItems="flex-start"
      >
        <Menu placement="bottom-start" offset={8}>
          <Menu.Trigger asChild>
            <Button data-testid="menu-trigger" size="$4">
              Open Menu
            </Button>
          </Menu.Trigger>

          <Menu.Portal>
            <Menu.Content
              data-testid="menu-content"
              p="$2"
              minW={180}
              borderWidth={1}
              borderColor="$borderColor"
              bg="$background"
            >
              <Menu.Item key="item-1" data-testid="menu-item-1">
                <Menu.ItemTitle>Item 1</Menu.ItemTitle>
              </Menu.Item>
              <Menu.Item key="item-2" data-testid="menu-item-2">
                <Menu.ItemTitle>Item 2</Menu.ItemTitle>
              </Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu>
      </YStack>
    </Theme>
  )
}
