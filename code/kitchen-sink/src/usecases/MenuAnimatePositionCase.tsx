import { Menu } from '@tamagui/menu'
import { Button, Text, XStack, YStack } from 'tamagui'

export function MenuAnimatePositionCase() {
  return (
    <YStack padding="$4" gap="$4">
      <Text>Test: animatePosition — content should animate between triggers</Text>

      <Menu placement="bottom-start">
        <XStack gap="$8">
          <Menu.Trigger asChild>
            <Button data-testid="trigger-left">Left Trigger</Button>
          </Menu.Trigger>

          <Menu.Trigger asChild>
            <Button data-testid="trigger-right">Right Trigger</Button>
          </Menu.Trigger>
        </XStack>

        <Menu.Portal>
          <Menu.Content
            data-testid="menu-content"
            animatePosition
            p="$2"
            minWidth={180}
            borderWidth={1}
            borderColor="$borderColor"
            elevation="$3"
          >
            <Menu.Item data-testid="menu-item-1" key="i1" textValue="Alpha">
              <Menu.ItemTitle>Alpha</Menu.ItemTitle>
            </Menu.Item>
            <Menu.Item data-testid="menu-item-2" key="i2" textValue="Beta">
              <Menu.ItemTitle>Beta</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </YStack>
  )
}
