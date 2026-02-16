/**
 * Test case for Menu arrow visibility with AnimatePresence
 * Issue: Arrow has opacity: 0 applied with Motion driver when wrapped in AnimatePresence
 * Works with CSS driver but not Motion driver
 */
import { Menu } from '@tamagui/menu'
import { AnimatePresence, Button, Paragraph, Popover, YStack } from 'tamagui'

// Reproduce the pattern from ~/chat where arrow is wrapped in AnimatePresence
const PopoverWithAnimatePresenceArrow = () => {
  return (
    <Popover offset={10}>
      <Popover.Trigger asChild>
        <Button testID="popover-trigger">Open Popover</Button>
      </Popover.Trigger>

      <Popover.Content
        enterStyle={{ y: -4, opacity: 0 }}
        exitStyle={{ y: 6, opacity: 0 }}
        transition="100ms"
        bg="$background"
        p="$4"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius="$4"
      >
        {/* This pattern causes the arrow to have opacity: 0 with Motion driver */}
        <AnimatePresence>
          <Popover.Arrow
            testID="popover-arrow"
            size="$4"
            borderWidth={1}
            borderColor="$borderColor"
            bg="$background"
          />
        </AnimatePresence>
        <YStack gap="$2">
          <Button size="$2">Item 1</Button>
          <Button size="$2">Item 2</Button>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

// Menu with arrow (no AnimatePresence - should work)
const MenuWithArrow = () => {
  return (
    <Menu offset={10}>
      <Menu.Trigger asChild>
        <Button testID="menu-trigger">Open Menu</Button>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Content
          testID="menu-content"
          enterStyle={{ scale: 0.9, opacity: 0, y: -5 }}
          exitStyle={{ scale: 0.95, opacity: 0, y: -3 }}
          transition="100ms"
          borderRadius="$4"
        >
          <Menu.Arrow
            testID="menu-arrow"
            size="$4"
            borderWidth={1}
            borderColor="$borderColor"
          />
          <Menu.Item key="item1">
            <Menu.ItemTitle>Item 1</Menu.ItemTitle>
          </Menu.Item>
          <Menu.Item key="item2">
            <Menu.ItemTitle>Item 2</Menu.ItemTitle>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  )
}

export function MenuArrowAnimatePresenceCase() {
  return (
    <YStack gap="$4" padding="$4" alignItems="center" justifyContent="center" flex={1}>
      <YStack gap="$2" alignItems="center">
        <MenuWithArrow />
        <Paragraph opacity={0.5} size="$2">
          Menu with Arrow (no AnimatePresence)
        </Paragraph>
      </YStack>

      <YStack gap="$2" alignItems="center">
        <PopoverWithAnimatePresenceArrow />
        <Paragraph opacity={0.5} size="$2">
          Popover with Arrow in AnimatePresence
        </Paragraph>
      </YStack>
    </YStack>
  )
}
