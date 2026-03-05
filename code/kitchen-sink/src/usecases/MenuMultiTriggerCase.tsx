import { Menu } from '@tamagui/menu'
import { Button, Text, XStack, YStack } from 'tamagui'

export function MenuMultiTriggerCase() {
  return (
    <YStack padding="$4" gap="$4">
      <Text>Test: 3 triggers sharing one Menu content</Text>

      <Menu placement="bottom-start">
        <XStack gap="$4">
          <Menu.Trigger asChild>
            <Button data-testid="trigger-a">Trigger A</Button>
          </Menu.Trigger>

          <Menu.Trigger asChild>
            <Button data-testid="trigger-b">Trigger B</Button>
          </Menu.Trigger>

          <Menu.Trigger asChild>
            <Button data-testid="trigger-c">Trigger C</Button>
          </Menu.Trigger>
        </XStack>

        <Menu.Portal>
          <Menu.Content
            data-testid="menu-content"
            p="$2"
            minWidth={180}
            borderWidth={1}
            borderColor="$borderColor"
            elevation="$3"
          >
            <Menu.Item data-testid="menu-item-1" key="i1" textValue="Item One">
              <Menu.ItemTitle>Item One</Menu.ItemTitle>
            </Menu.Item>
            <Menu.Item data-testid="menu-item-2" key="i2" textValue="Item Two">
              <Menu.ItemTitle>Item Two</Menu.ItemTitle>
            </Menu.Item>
            <Menu.Item data-testid="menu-item-3" key="i3" textValue="Item Three">
              <Menu.ItemTitle>Item Three</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </YStack>
  )
}
