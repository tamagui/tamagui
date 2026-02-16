import { Menu } from '@tamagui/menu'
import { Button, YStack } from 'tamagui'

/**
 * Menu auto-resize test case
 * Tests that menus automatically resize to fit within tight viewport spaces
 * The menu should constrain its height to available space and become scrollable
 */

const ITEM_COUNT = 20

export function MenuAutoResizeCase() {
  return (
    <YStack
      data-testid="container"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      padding="$4"
    >
      <Menu placement="bottom-start">
        <Menu.Trigger asChild>
          <Button data-testid="menu-trigger" size="$4">
            Open Menu
          </Button>
        </Menu.Trigger>

        <Menu.Portal zIndex={100}>
          <Menu.Content
            data-testid="menu-content"
            minWidth={200}
            borderWidth={1}
            borderColor="$borderColor"
            elevation="$3"
            padding={0}
            overflow="hidden"
          >
            <Menu.ScrollView
              data-testid="menu-scroll-view"
              maxHeight="var(--tamagui-popper-available-height)"
            >
              <YStack padding="$2">
                {Array.from({ length: ITEM_COUNT }).map((_, i) => (
                  <Menu.Item
                    data-testid={`menu-item-${i + 1}`}
                    key={`item-${i}`}
                    textValue={`Item ${i + 1}`}
                    style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 }}
                    focusStyle={{ backgroundColor: '$backgroundHover' }}
                  >
                    <Menu.ItemTitle>Item {i + 1}</Menu.ItemTitle>
                  </Menu.Item>
                ))}
              </YStack>
            </Menu.ScrollView>
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </YStack>
  )
}
