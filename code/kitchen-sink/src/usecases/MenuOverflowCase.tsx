import { Menu } from '@tamagui/menu'
import { Button, YStack } from 'tamagui'

/**
 * Menu overflow test case
 * Tests:
 * - Menu content becomes scrollable when items exceed max height
 * - Menu does not overflow the page
 * - Scrollbars are hidden
 * - Menu items remain keyboard navigable while scrolling
 */

const ITEM_COUNT = 30

export function MenuOverflowCase() {
  return (
    <YStack data-testid="container" height="100vh" justifyContent="flex-end" padding="$4">
      {/* position menu trigger near bottom of page to test overflow behavior */}
      <Menu placement="top-start" stayInFrame allowFlip>
        <Menu.Trigger asChild>
          <Button data-testid="menu-trigger" size="$4">
            Open Long Menu
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
          >
            <Menu.ScrollView data-testid="menu-scroll-view" maxHeight={300}>
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
