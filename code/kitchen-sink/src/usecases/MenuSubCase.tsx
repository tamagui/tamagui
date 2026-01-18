import { ChevronRight } from '@tamagui/lucide-icons'
import { Menu } from '@tamagui/menu'
import React from 'react'
import { Button, H1, Paragraph, Text, YStack } from 'tamagui'

/**
 * Menu Submenu Test Case
 *
 * Tests the safePolygon behavior when moving from a submenu trigger to submenu content.
 * The polygon should allow the mouse to move diagonally from trigger to content without
 * closing the submenu.
 */
export function MenuSubCase() {
  const [subMenuOpen, setSubMenuOpen] = React.useState(false)
  const [nestedSubOpen, setNestedSubOpen] = React.useState(false)
  const [lastAction, setLastAction] = React.useState<string>('')

  return (
    <YStack gap="$4" padding="$4" maxWidth={800} margin="auto">
      <YStack gap="$2">
        <H1>Menu Submenu SafePolygon Test</H1>
        <Paragraph>
          This tests that the safePolygon logic works correctly when hovering from a
          submenu trigger to submenu content. Move your mouse diagonally from the trigger
          to the submenu - it should not close.
        </Paragraph>
        <Text id="last-action" color="$color10">
          Last action: {lastAction || 'None'}
        </Text>
        <Text id="submenu-state" color={subMenuOpen ? '$green10' : '$red10'}>
          Submenu: {subMenuOpen ? 'Open' : 'Closed'}
        </Text>
      </YStack>

      <YStack alignItems="flex-start" gap="$4">
        <Menu allowFlip placement="bottom-start" offset={8}>
          <Menu.Trigger asChild>
            <Button id="menu-trigger" size="$4">
              Open Menu
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

              <Menu.Sub
                open={subMenuOpen}
                placement="right-start"
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
                  <Menu.ItemTitle>Actions (submenu)</Menu.ItemTitle>
                  <ChevronRight size={14} color="$color10" />
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

                    <Menu.Sub
                      open={nestedSubOpen}
                      placement="right-start"
                      onOpenChange={(open) => {
                        setNestedSubOpen(open)
                        setLastAction(`Nested submenu ${open ? 'opened' : 'closed'}`)
                      }}
                    >
                      <Menu.SubTrigger
                        key="nested-submenu-trigger"
                        id="nested-submenu-trigger"
                        justify="space-between"
                        textValue="More"
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 4,
                        }}
                        hoverStyle={{ bg: '$backgroundHover' }}
                      >
                        <Menu.ItemTitle>More (nested)</Menu.ItemTitle>
                        <ChevronRight size={14} color="$color10" />
                      </Menu.SubTrigger>

                      <Menu.Portal zIndex={300}>
                        <Menu.SubContent
                          id="nested-submenu-content"
                          bg="$background"
                          p="$2"
                          minW={160}
                          borderWidth={1}
                          borderColor="$borderColor"
                          elevation="$3"
                        >
                          <Menu.Item
                            key="nested-submenu-item-1"
                            id="nested-submenu-item-1"
                            onSelect={() => setLastAction('Nested Item 1 selected')}
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderRadius: 4,
                            }}
                            hoverStyle={{ bg: '$backgroundHover' }}
                          >
                            <Menu.ItemTitle>Nested Item 1</Menu.ItemTitle>
                          </Menu.Item>
                          <Menu.Item
                            key="nested-submenu-item-2"
                            id="nested-submenu-item-2"
                            onSelect={() => setLastAction('Nested Item 2 selected')}
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderRadius: 4,
                            }}
                            hoverStyle={{ bg: '$backgroundHover' }}
                          >
                            <Menu.ItemTitle>Nested Item 2</Menu.ItemTitle>
                          </Menu.Item>
                        </Menu.SubContent>
                      </Menu.Portal>
                    </Menu.Sub>
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
      </YStack>
    </YStack>
  )
}
