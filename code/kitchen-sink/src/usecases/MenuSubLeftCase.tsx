import { ChevronLeft } from '@tamagui/lucide-icons'
import { Menu } from '@tamagui/menu'
import React from 'react'
import { Button, H1, Paragraph, Text, XStack, YStack } from 'tamagui'

/**
 * Menu Submenu Left Side Test Case
 *
 * Tests the safePolygon behavior when submenu is positioned to the LEFT of the trigger.
 * This happens when:
 * 1. The menu is near the right edge of the screen
 * 2. allowFlip is enabled and there's not enough space on the right
 * 3. placement is explicitly set to "left-start"
 *
 * The polygon should work correctly regardless of which side the submenu appears on.
 */
export function MenuSubLeftCase() {
  const [subMenuOpen, setSubMenuOpen] = React.useState(false)
  const [lastAction, setLastAction] = React.useState<string>('')

  return (
    <YStack gap="$4" padding="$4" maxWidth={800} margin="auto">
      <YStack gap="$2">
        <H1>Menu Submenu Left-Side SafePolygon Test</H1>
        <Paragraph>
          This tests that the safePolygon logic works correctly when the submenu opens to
          the LEFT of the trigger. Move your mouse diagonally from the trigger to the
          submenu - it should not close.
        </Paragraph>
        <Text id="last-action" color="$color10">
          Last action: {lastAction || 'None'}
        </Text>
        <Text id="submenu-state" color={subMenuOpen ? '$green10' : '$red10'}>
          Submenu: {subMenuOpen ? 'Open' : 'Closed'}
        </Text>
      </YStack>

      {/* position the menu on the right side to force submenu to open LEFT */}
      <XStack justifyContent="flex-end" paddingRight="$10">
        <Menu allowFlip={false} placement="bottom-end" offset={8}>
          <Menu.Trigger asChild>
            <Button id="menu-trigger" size="$4">
              Open Menu (Left Submenu)
            </Button>
          </Menu.Trigger>

          <Menu.Portal zIndex={100}>
            <Menu.Content
              id="menu-content"
              p="$2"
              minW={220}
              borderWidth={1}
              borderColor="$borderColor"
              bg="$background"
              elevation="$3"
            >
              <Menu.Item
                key="menu-item-1"
                id="menu-item-1"
                onSelect={() => setLastAction('Item 1 selected')}
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                hoverStyle={{ bg: '$backgroundHover' }}
              >
                <Menu.ItemTitle>Item 1 (above trigger)</Menu.ItemTitle>
              </Menu.Item>

              <Menu.Item
                key="menu-item-2"
                id="menu-item-2"
                onSelect={() => setLastAction('Item 2 selected')}
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                hoverStyle={{ bg: '$backgroundHover' }}
              >
                <Menu.ItemTitle>Item 2 (above trigger)</Menu.ItemTitle>
              </Menu.Item>

              {/* submenu explicitly positioned to the left */}
              <Menu.Sub
                open={subMenuOpen}
                placement="left-start"
                onOpenChange={(open) => {
                  setSubMenuOpen(open)
                  setLastAction(`Submenu ${open ? 'opened' : 'closed'}`)
                }}
              >
                <Menu.SubTrigger
                  key="submenu-trigger"
                  id="submenu-trigger"
                  justify="space-between"
                  textValue="Actions"
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                  hoverStyle={{ bg: '$backgroundHover' }}
                >
                  <ChevronLeft size={14} color="$color10" />
                  <Menu.ItemTitle>Actions (left submenu)</Menu.ItemTitle>
                </Menu.SubTrigger>

                <Menu.Portal zIndex={200}>
                  <Menu.SubContent
                    id="submenu-content"
                    bg="$background"
                    p="$2"
                    minW={180}
                    borderWidth={1}
                    borderColor="$borderColor"
                    elevation="$3"
                  >
                    <Menu.Item
                      key="submenu-item-1"
                      id="submenu-item-1"
                      onSelect={() => setLastAction('Sub Item 1 selected')}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 4,
                      }}
                      hoverStyle={{ bg: '$backgroundHover' }}
                    >
                      <Menu.ItemTitle>Sub Item 1</Menu.ItemTitle>
                    </Menu.Item>

                    <Menu.Item
                      key="submenu-item-2"
                      id="submenu-item-2"
                      onSelect={() => setLastAction('Sub Item 2 selected')}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 4,
                      }}
                      hoverStyle={{ bg: '$backgroundHover' }}
                    >
                      <Menu.ItemTitle>Sub Item 2</Menu.ItemTitle>
                    </Menu.Item>

                    <Menu.Item
                      key="submenu-item-3"
                      id="submenu-item-3"
                      onSelect={() => setLastAction('Sub Item 3 selected')}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 4,
                      }}
                      hoverStyle={{ bg: '$backgroundHover' }}
                    >
                      <Menu.ItemTitle>Sub Item 3</Menu.ItemTitle>
                    </Menu.Item>
                  </Menu.SubContent>
                </Menu.Portal>
              </Menu.Sub>

              <Menu.Item
                key="menu-item-3"
                id="menu-item-3"
                onSelect={() => setLastAction('Item 3 selected')}
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                hoverStyle={{ bg: '$backgroundHover' }}
              >
                <Menu.ItemTitle>Item 3 (below trigger)</Menu.ItemTitle>
              </Menu.Item>

              <Menu.Item
                key="menu-item-4"
                id="menu-item-4"
                onSelect={() => setLastAction('Item 4 selected')}
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                hoverStyle={{ bg: '$backgroundHover' }}
              >
                <Menu.ItemTitle>Item 4 (below trigger)</Menu.ItemTitle>
              </Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu>
      </XStack>
    </YStack>
  )
}
