import { ChevronRight } from '@tamagui/lucide-icons-2'
import { Menu } from '@tamagui/menu'
import React from 'react'
import { Button, Text, YStack } from 'tamagui'

/**
 * Tests that deeply nested submenus (3 levels) cascade in the same direction
 * rather than flipping back and overlapping the root menu.
 *
 * The trigger is positioned toward the right so that the nested submenu
 * is forced to make a flip decision when viewport is narrow enough.
 */
export function MenuSubNestedPositionCase() {
  const [subOpen, setSubOpen] = React.useState(false)
  const [nestedOpen, setNestedOpen] = React.useState(false)

  return (
    <YStack padding="$4" minHeight={600}>
      <YStack alignItems="flex-end" paddingRight={100}>
        <Menu placement="bottom-start" offset={4}>
          <Menu.Trigger asChild>
            <Button id="menu-trigger" size="$3">
              Open Menu
            </Button>
          </Menu.Trigger>

          <Menu.Portal zIndex={100}>
            <Menu.Content
              id="menu-content"
              p="$2"
              minWidth={180}
              borderWidth={1}
              borderColor="$borderColor"
              bg="$background"
              elevation="$3"
            >
              <Menu.Item
                key="item-1"
                id="item-1"
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                focusStyle={{ bg: '$backgroundHover' }}
              >
                <Menu.ItemTitle>Item 1</Menu.ItemTitle>
              </Menu.Item>

              <Menu.Sub open={subOpen} onOpenChange={setSubOpen}>
                <Menu.SubTrigger
                  key="sub-trigger"
                  id="sub-trigger"
                  justify="space-between"
                  textValue="More"
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                  focusStyle={{ bg: '$backgroundHover' }}
                >
                  <Menu.ItemTitle>More</Menu.ItemTitle>
                  <ChevronRight size={14} color="$color10" />
                </Menu.SubTrigger>

                <Menu.Portal zIndex={200}>
                  <Menu.SubContent
                    id="sub-content"
                    bg="$background"
                    p="$2"
                    minWidth={180}
                    borderWidth={1}
                    borderColor="$borderColor"
                    elevation="$3"
                  >
                    <Menu.Item
                      key="sub-item-1"
                      id="sub-item-1"
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 4,
                      }}
                      focusStyle={{ bg: '$backgroundHover' }}
                    >
                      <Menu.ItemTitle>Sub Item 1</Menu.ItemTitle>
                    </Menu.Item>

                    <Menu.Sub open={nestedOpen} onOpenChange={setNestedOpen}>
                      <Menu.SubTrigger
                        key="nested-trigger"
                        id="nested-trigger"
                        justify="space-between"
                        textValue="Even More"
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 4,
                        }}
                        focusStyle={{ bg: '$backgroundHover' }}
                      >
                        <Menu.ItemTitle>Even More</Menu.ItemTitle>
                        <ChevronRight size={14} color="$color10" />
                      </Menu.SubTrigger>

                      <Menu.Portal zIndex={300}>
                        <Menu.SubContent
                          id="nested-content"
                          bg="$background"
                          p="$2"
                          minWidth={180}
                          borderWidth={1}
                          borderColor="$borderColor"
                          elevation="$3"
                        >
                          <Menu.Item
                            key="nested-item-1"
                            id="nested-item-1"
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderRadius: 4,
                            }}
                            focusStyle={{ bg: '$backgroundHover' }}
                          >
                            <Menu.ItemTitle>Nested Item 1</Menu.ItemTitle>
                          </Menu.Item>
                          <Menu.Item
                            key="nested-item-2"
                            id="nested-item-2"
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderRadius: 4,
                            }}
                            focusStyle={{ bg: '$backgroundHover' }}
                          >
                            <Menu.ItemTitle>Nested Item 2</Menu.ItemTitle>
                          </Menu.Item>
                        </Menu.SubContent>
                      </Menu.Portal>
                    </Menu.Sub>

                    <Menu.Item
                      key="sub-item-2"
                      id="sub-item-2"
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 4,
                      }}
                      focusStyle={{ bg: '$backgroundHover' }}
                    >
                      <Menu.ItemTitle>Sub Item 2</Menu.ItemTitle>
                    </Menu.Item>
                  </Menu.SubContent>
                </Menu.Portal>
              </Menu.Sub>

              <Menu.Item
                key="item-2"
                id="item-2"
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                focusStyle={{ bg: '$backgroundHover' }}
              >
                <Menu.ItemTitle>Item 2</Menu.ItemTitle>
              </Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu>
      </YStack>

      <Text id="sub-state" marginTop="$4">
        Sub: {subOpen ? 'open' : 'closed'} | Nested: {nestedOpen ? 'open' : 'closed'}
      </Text>
    </YStack>
  )
}
