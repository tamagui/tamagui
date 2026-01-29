import { Menu } from '@tamagui/menu'
import { Button, YStack } from 'tamagui'

export function MenuAsChildPositionCase() {
  return (
    <YStack padding="$4" gap="$4">
      <Menu placement="bottom-start">
        <Menu.Trigger asChild>
          <Button data-testid="menu-trigger-button">Open Menu</Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Content>
            <Menu.Item key="item-1" textValue="Item 1">
              <Menu.ItemTitle>Item 1</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      <Button data-testid="reference-button">Reference Button</Button>
    </YStack>
  )
}
