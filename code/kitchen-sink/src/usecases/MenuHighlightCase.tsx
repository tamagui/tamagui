import { Menu } from '@tamagui/menu'
import { Button, YStack, Text } from 'tamagui'

/**
 * Menu highlight test case
 * Tests that hover and keyboard focus show unified highlighting
 * without conflicts (double highlighting when switching between mouse/keyboard)
 */
export function MenuHighlightCase() {
  return (
    <YStack padding="$4" gap="$4" alignItems="flex-start">
      <Text>Test: hover and keyboard navigation should show same highlight</Text>

      <Menu placement="bottom-start">
        <Menu.Trigger asChild>
          <Button data-testid="menu-trigger">Open Menu</Button>
        </Menu.Trigger>

        <Menu.Portal zIndex={100}>
          <Menu.Content
            data-testid="menu-content"
            p="$2"
            minWidth={200}
            borderWidth={1}
            borderColor="$borderColor"
            elevation="$3"
          >
            <Menu.Item
              data-testid="menu-item-1"
              key="item-1"
              textValue="Item One"
            >
              <Menu.ItemTitle>Item One</Menu.ItemTitle>
            </Menu.Item>

            <Menu.Item
              data-testid="menu-item-2"
              key="item-2"
              textValue="Item Two"
            >
              <Menu.ItemTitle>Item Two</Menu.ItemTitle>
            </Menu.Item>

            <Menu.Item
              data-testid="menu-item-3"
              key="item-3"
              textValue="Item Three"
            >
              <Menu.ItemTitle>Item Three</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </YStack>
  )
}
