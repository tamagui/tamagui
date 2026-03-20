import { ChevronRight } from '@tamagui/lucide-icons-2'
import { Menu } from '@tamagui/menu'
import React from 'react'
import { Button, Text, YStack } from 'tamagui'

/**
 * Test case for menu focus leave behavior
 *
 * Bug 1: When leaving the menu entirely, focus style stays on last element
 * Bug 2: Two items can appear focused when moving quickly from submenu trigger
 */
export function MenuFocusLeaveCase() {
  const [subMenuOpen, setSubMenuOpen] = React.useState(false)

  return (
    <YStack padding="$4" gap="$4" alignItems="flex-start">
      <Text>Test: focus should clear when leaving menu entirely</Text>

      <Menu placement="bottom-start">
        <Menu.Trigger asChild>
          <Button data-testid="menu-trigger">Open Menu</Button>
        </Menu.Trigger>

        <Menu.Portal zIndex={100}>
          <Menu.Content
            data-testid="menu-content"
            p="$2"
            minWidth={220}
            borderWidth={1}
            borderColor="$borderColor"
            elevation="$3"
          >
            <Menu.Item data-testid="menu-item-1" key="item-1" textValue="Item One">
              <Menu.ItemTitle>Item One</Menu.ItemTitle>
            </Menu.Item>

            <Menu.Sub
              open={subMenuOpen}
              placement="right-start"
              onOpenChange={setSubMenuOpen}
            >
              <Menu.SubTrigger
                data-testid="submenu-trigger-1"
                key="submenu-trigger-1"
                justify="space-between"
                textValue="More Options"
              >
                <Menu.ItemTitle>More Options (submenu 1)</Menu.ItemTitle>
                <ChevronRight size={14} color="$color10" />
              </Menu.SubTrigger>

              <Menu.Portal zIndex={200}>
                <Menu.SubContent
                  data-testid="submenu-content-1"
                  bg="$background"
                  p="$2"
                  minWidth={180}
                  borderWidth={1}
                  borderColor="$borderColor"
                  elevation="$3"
                >
                  <Menu.Item
                    data-testid="submenu-1-item-1"
                    key="sub1item-1"
                    textValue="Sub Item 1"
                  >
                    <Menu.ItemTitle>Sub Item 1</Menu.ItemTitle>
                  </Menu.Item>
                  <Menu.Item
                    data-testid="submenu-1-item-2"
                    key="sub1item-2"
                    textValue="Sub Item 2"
                  >
                    <Menu.ItemTitle>Sub Item 2</Menu.ItemTitle>
                  </Menu.Item>
                </Menu.SubContent>
              </Menu.Portal>
            </Menu.Sub>

            {/* Second submenu trigger right below the first one - this is the bug scenario */}
            <Menu.Sub placement="right-start">
              <Menu.SubTrigger
                data-testid="submenu-trigger-2"
                key="submenu-trigger-2"
                justify="space-between"
                textValue="Another Submenu"
              >
                <Menu.ItemTitle>Another Submenu (submenu 2)</Menu.ItemTitle>
                <ChevronRight size={14} color="$color10" />
              </Menu.SubTrigger>

              <Menu.Portal zIndex={200}>
                <Menu.SubContent
                  data-testid="submenu-content-2"
                  bg="$background"
                  p="$2"
                  minWidth={180}
                  borderWidth={1}
                  borderColor="$borderColor"
                  elevation="$3"
                >
                  <Menu.Item
                    data-testid="submenu-2-item-1"
                    key="sub2item-1"
                    textValue="Sub 2 Item 1"
                  >
                    <Menu.ItemTitle>Sub 2 Item 1</Menu.ItemTitle>
                  </Menu.Item>
                </Menu.SubContent>
              </Menu.Portal>
            </Menu.Sub>

            <Menu.Item data-testid="menu-item-3" key="item-3" textValue="Item Three">
              <Menu.ItemTitle>Item Three (below submenus)</Menu.ItemTitle>
            </Menu.Item>

            <Menu.Item data-testid="menu-item-4" key="item-4" textValue="Item Four">
              <Menu.ItemTitle>Item Four</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {/* Area to move mouse to when leaving menu */}
      <YStack
        data-testid="outside-area"
        padding="$4"
        backgroundColor="$backgroundHover"
        marginTop="$8"
      >
        <Text>Move mouse here to leave menu</Text>
      </YStack>
    </YStack>
  )
}
