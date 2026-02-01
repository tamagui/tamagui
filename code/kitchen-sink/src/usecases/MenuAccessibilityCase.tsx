import { ChevronRight, FilePlus, Settings, Trash2 } from '@tamagui/lucide-icons'
import { Menu } from '@tamagui/menu'
import React from 'react'
import { Button, YStack } from 'tamagui'

/**
 * Menu accessibility test case
 * Tests:
 * - Trigger is focusable via tab
 * - Menu opens on Enter/Space and focuses first item
 * - Arrow keys navigate between items
 * - Escape closes menu and returns focus to trigger
 * - Submenu escape closes only submenu first
 */

export function MenuAccessibilityCase() {
  const [subMenuOpen, setSubMenuOpen] = React.useState(false)

  return (
    <YStack padding="$4" gap="$4">
      {/* focusable element before menu to test tab order */}
      <Button data-testid="before-button">Before</Button>

      <Menu placement="bottom-start">
        <Menu.Trigger asChild>
          <Button data-testid="menu-trigger" size="$4">
            Open Menu
          </Button>
        </Menu.Trigger>

        <Menu.Portal zIndex={100}>
          <Menu.Content
            data-testid="menu-content"
            p="$2"
            minW={200}
            borderWidth={1}
            borderColor="$borderColor"
            elevation="$3"
          >
            <Menu.Item
              data-testid="menu-item-1"
              key="item-1"
              textValue="Settings"
              style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 }}
              focusStyle={{ bg: '$backgroundHover' }}
            >
              <Settings size={14} />
              <Menu.ItemTitle marginLeft="$2">Settings</Menu.ItemTitle>
            </Menu.Item>

            <Menu.Item
              data-testid="menu-item-2"
              key="item-2"
              textValue="Profile"
              style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 }}
              focusStyle={{ bg: '$backgroundHover' }}
            >
              <Menu.ItemTitle>Profile</Menu.ItemTitle>
            </Menu.Item>

            <Menu.Item
              data-testid="menu-item-3"
              key="item-3"
              textValue="Preferences"
              style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 }}
              focusStyle={{ bg: '$backgroundHover' }}
            >
              <Menu.ItemTitle>Preferences</Menu.ItemTitle>
            </Menu.Item>

            <Menu.Separator />

            {/* submenu for testing nested escape behavior */}
            <Menu.Sub
              open={subMenuOpen}
              onOpenChange={setSubMenuOpen}
              placement="right-start"
            >
              <Menu.SubTrigger
                data-testid="submenu-trigger"
                key="actions"
                justify="space-between"
                textValue="Actions"
                style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 }}
                focusStyle={{ bg: '$backgroundHover' }}
              >
                <Menu.ItemTitle>Actions</Menu.ItemTitle>
                <ChevronRight size={12} color="$color10" />
              </Menu.SubTrigger>

              <Menu.Portal zIndex={200}>
                <Menu.SubContent
                  data-testid="submenu-content"
                  elevation="$3"
                  minW={160}
                  bg="$background"
                  p="$2"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <Menu.Item
                    data-testid="submenu-item-1"
                    key="create"
                    textValue="Create new"
                    style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 }}
                    focusStyle={{ bg: '$backgroundHover' }}
                  >
                    <FilePlus size={14} />
                    <Menu.ItemTitle marginLeft="$2">Create new</Menu.ItemTitle>
                  </Menu.Item>

                  <Menu.Item
                    data-testid="submenu-item-2"
                    key="delete"
                    textValue="Delete all"
                    style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 }}
                    focusStyle={{ bg: '$backgroundHover' }}
                  >
                    <Trash2 size={14} />
                    <Menu.ItemTitle marginLeft="$2">Delete all</Menu.ItemTitle>
                  </Menu.Item>
                </Menu.SubContent>
              </Menu.Portal>
            </Menu.Sub>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {/* focusable element after menu to test tab order */}
      <Button data-testid="after-button">After</Button>
    </YStack>
  )
}
