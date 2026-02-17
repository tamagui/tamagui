import { Menu } from '@tamagui/menu'
import { Button, YStack } from 'tamagui'

/**
 * Menu bottom placement test - menu opens below trigger and stays there
 */

const ITEM_COUNT = 20

export function MenuBottomCase() {
  return (
    <YStack
      data-testid="container"
      $platform-web={{
        height: '100vh',
      }}
      justifyContent="flex-start"
      alignItems="center"
      paddingTop="$8"
    >
      <Menu placement="bottom-start" stayInFrame allowFlip={false}>
        <Menu.Trigger asChild>
          <Button data-testid="menu-trigger" size="$4">
            Open Menu Below
          </Button>
        </Menu.Trigger>

        <Menu.Portal zIndex={100}>
          <Menu.Content
            data-testid="menu-content"
            minWidth={200}
            borderWidth={1}
            borderColor="$borderColor"
            elevation="$3"
            padding="$2"
          >
            <Menu.ScrollView data-testid="menu-scroll-view">
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
            </Menu.ScrollView>
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </YStack>
  )
}
