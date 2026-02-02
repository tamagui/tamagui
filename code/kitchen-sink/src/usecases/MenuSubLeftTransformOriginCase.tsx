import { ChevronLeft } from '@tamagui/lucide-icons'
import { Menu } from '@tamagui/menu'
import React from 'react'
import { Button, H1, Paragraph, Text, XStack, YStack } from 'tamagui'

/**
 * Menu Submenu Left Side Transform Origin Test Case
 *
 * Tests that the transform origin is correctly set when a submenu opens to the LEFT.
 * When placement is "left-start", the transform origin should be "right top" (or similar)
 * so the scale animation appears to grow FROM the right edge (where the trigger is).
 *
 * Bug: transform origin is not updated when submenu flips to left side,
 * causing the animation to appear from the wrong corner.
 */
export function MenuSubLeftTransformOriginCase() {
  const [subMenuOpen, setSubMenuOpen] = React.useState(false)

  return (
    <YStack gap="$4" padding="$4" maxWidth={800} margin="auto">
      <YStack gap="$2">
        <H1>Menu Submenu Left-Side Transform Origin Test</H1>
        <Paragraph>
          This tests that the transform origin is correctly set for left-side submenus.
          When the submenu opens to the LEFT, the scale animation should originate from
          the RIGHT edge (where it connects to the parent menu), not from the left.
        </Paragraph>
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
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                focusStyle={{ bg: '$backgroundHover' }}
              >
                <Menu.ItemTitle>Item 1</Menu.ItemTitle>
              </Menu.Item>

              {/* submenu explicitly positioned to the left with scale animation */}
              <Menu.Sub
                open={subMenuOpen}
                placement="left-start"
                onOpenChange={setSubMenuOpen}
              >
                <Menu.SubTrigger
                  key="submenu-trigger"
                  id="submenu-trigger"
                  justify="space-between"
                  textValue="Actions"
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                  focusStyle={{ bg: '$backgroundHover' }}
                >
                  <ChevronLeft size={14} color="$color10" />
                  <Menu.ItemTitle>Actions (left submenu)</Menu.ItemTitle>
                </Menu.SubTrigger>

                <Menu.Portal zIndex={200}>
                  {/*
                    DO NOT hardcode transformOrigin - let Popper compute it.
                    The scale animation should appear to grow from the right edge
                    since that's where the trigger is located.
                  */}
                  <Menu.SubContent
                    id="submenu-content"
                    bg="$background"
                    p="$2"
                    minW={180}
                    borderWidth={1}
                    borderColor="$borderColor"
                    elevation="$3"
                    transition="200ms"
                    enterStyle={{ scale: 0.8, opacity: 0 }}
                    exitStyle={{ scale: 0.9, opacity: 0 }}
                  >
                    <Menu.Item
                      key="submenu-item-1"
                      id="submenu-item-1"
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 4,
                      }}
                      focusStyle={{ bg: '$backgroundHover' }}
                    >
                      <Menu.ItemTitle>Sub Item 1</Menu.ItemTitle>
                    </Menu.Item>

                    <Menu.Item
                      key="submenu-item-2"
                      id="submenu-item-2"
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 4,
                      }}
                      focusStyle={{ bg: '$backgroundHover' }}
                    >
                      <Menu.ItemTitle>Sub Item 2</Menu.ItemTitle>
                    </Menu.Item>

                    <Menu.Item
                      key="submenu-item-3"
                      id="submenu-item-3"
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 4,
                      }}
                      focusStyle={{ bg: '$backgroundHover' }}
                    >
                      <Menu.ItemTitle>Sub Item 3</Menu.ItemTitle>
                    </Menu.Item>
                  </Menu.SubContent>
                </Menu.Portal>
              </Menu.Sub>

              <Menu.Item
                key="menu-item-2"
                id="menu-item-2"
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                focusStyle={{ bg: '$backgroundHover' }}
              >
                <Menu.ItemTitle>Item 2</Menu.ItemTitle>
              </Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu>
      </XStack>
    </YStack>
  )
}
