import { Menu } from '@tamagui/menu'
import { ScrollView, YStack } from 'tamagui'
import { Button } from '../components/Button'

/**
 * Menu dismiss-on-scroll test case
 *
 * Verifies handleScroll only dismisses the menu when the scroll actually
 * moves the menu's anchor:
 * - scrolling an unrelated subtree should NOT dismiss the menu
 * - scrolling a container that holds the trigger SHOULD dismiss the menu
 * - scrolling the page/window SHOULD dismiss the menu
 *
 * The trigger sits at the top of its scroll container so it is visible
 * without an initial scroll-into-view; the filler below keeps the container
 * scrollable.
 */

const filler = (prefix: string) =>
  Array.from({ length: 30 }).map((_, i) => (
    <YStack key={`${prefix}-${i}`} height={40} justifyContent="center">
      <Button size="small" variant="quiet">
        {prefix} row {i + 1}
      </Button>
    </YStack>
  ))

export function MenuDismissOnScrollCase() {
  return (
    <YStack data-testid="page" padding="$4" gap="$4" minHeight={2000}>
      {/* an unrelated scrollable subtree - scrolling this must NOT dismiss */}
      <ScrollView
        data-testid="unrelated-scroll"
        height={160}
        borderWidth={1}
        borderColor="$borderColor"
      >
        {filler('unrelated')}
      </ScrollView>

      {/* a scrollable container that holds the menu trigger - scrolling this
          moves the trigger, so it SHOULD dismiss */}
      <ScrollView
        data-testid="trigger-scroll"
        height={160}
        borderWidth={1}
        borderColor="$borderColor"
      >
        <Menu>
          <Menu.Trigger asChild>
            <Button data-testid="menu-trigger" size="medium">
              Open Menu
            </Button>
          </Menu.Trigger>

          <Menu.Portal zIndex={100}>
            <Menu.Content
              data-testid="menu-content"
              minWidth={200}
              borderWidth={1}
              borderColor="$borderColor"
              boxShadow="0 4px 12px $shadowColor"
              padding="$2"
            >
              <Menu.Item
                data-testid="menu-item-1"
                textValue="Item 1"
                style={{ paddingHorizontal: 8, paddingVertical: 6 }}
              >
                <Menu.ItemTitle>Item 1</Menu.ItemTitle>
              </Menu.Item>
              <Menu.Item
                data-testid="menu-item-2"
                textValue="Item 2"
                style={{ paddingHorizontal: 8, paddingVertical: 6 }}
              >
                <Menu.ItemTitle>Item 2</Menu.ItemTitle>
              </Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu>
        {filler('after')}
      </ScrollView>
    </YStack>
  )
}
