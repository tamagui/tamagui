import { Menu } from '@tamagui/menu'
import { Button, YStack } from 'tamagui'

/**
 * Menu Unstyled Test Case
 *
 * Tests that Menu.Content unstyled prop removes all default styles.
 * When unstyled is true, no background, padding, or border should be applied.
 */
export function MenuUnstyledCase() {
  return (
    <YStack padding="$4" gap="$4">
      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="unstyled-menu-trigger" size="$4">
            Open Unstyled Menu
          </Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Content data-testid="unstyled-menu-content" unstyled>
            <Menu.Item key="item-1" data-testid="unstyled-menu-item-1">
              <Menu.ItemTitle>Item 1</Menu.ItemTitle>
            </Menu.Item>
            <Menu.Item key="item-2" data-testid="unstyled-menu-item-2">
              <Menu.ItemTitle>Item 2</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="styled-menu-trigger" size="$4">
            Open Styled Menu (default)
          </Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Content data-testid="styled-menu-content">
            <Menu.Item key="item-1" data-testid="styled-menu-item-1">
              <Menu.ItemTitle>Item 1</Menu.ItemTitle>
            </Menu.Item>
            <Menu.Item key="item-2" data-testid="styled-menu-item-2">
              <Menu.ItemTitle>Item 2</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </YStack>
  )
}
