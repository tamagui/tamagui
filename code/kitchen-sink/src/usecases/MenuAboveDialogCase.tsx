import { useState } from 'react'
import { Button, Dialog, Paragraph, YStack, XStack } from 'tamagui'
import { Menu } from '@tamagui/menu'

// tests that Menu renders above Dialog when opened from inside Dialog
export function MenuAboveDialogCase() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <YStack padding="$4" gap="$4">
      <Paragraph>
        Test: Open dialog, then open menu from inside. Menu should appear above dialog
        overlay.
      </Paragraph>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Trigger asChild>
          <Button testID="dialog-trigger">Open Dialog</Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay testID="dialog-overlay" key="overlay" opacity={0.5} />
          <Dialog.Content testID="dialog-content" bordered elevate key="content">
            <YStack gap="$3" padding="$4" minWidth={300}>
              <Dialog.Title>Dialog with Menu</Dialog.Title>
              <Dialog.Description>
                Click the menu below. It should appear above this dialog.
              </Dialog.Description>

              <Menu>
                <Menu.Trigger asChild>
                  <Button testID="menu-trigger">Open Menu</Button>
                </Menu.Trigger>

                <Menu.Portal>
                  <Menu.Content
                    testID="menu-content"
                    p="$2"
                    minWidth={180}
                    bg="$background"
                    borderWidth={1}
                    borderColor="$borderColor"
                    elevation="$4"
                  >
                    <Menu.Item testID="menu-item-1">
                      <Menu.ItemTitle>Item 1</Menu.ItemTitle>
                    </Menu.Item>
                    <Menu.Item testID="menu-item-2">
                      <Menu.ItemTitle>Item 2</Menu.ItemTitle>
                    </Menu.Item>
                    <Menu.Item testID="menu-item-3">
                      <Menu.ItemTitle>Item 3</Menu.ItemTitle>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Portal>
              </Menu>

              <XStack gap="$3" justifyContent="flex-end">
                <Dialog.Close asChild>
                  <Button testID="dialog-close">Close</Button>
                </Dialog.Close>
              </XStack>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <YStack gap="$2">
        <Paragraph testID="dialog-status">
          Dialog: {dialogOpen ? 'open' : 'closed'}
        </Paragraph>
      </YStack>
    </YStack>
  )
}
