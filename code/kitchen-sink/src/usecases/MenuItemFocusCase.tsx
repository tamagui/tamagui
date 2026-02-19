import { Menu } from '@tamagui/menu'
import React from 'react'
import { Button, Input, YStack } from 'tamagui'

/**
 * Menu item focus preservation test case
 * Tests that when a menu item's onPress focuses another element,
 * that element keeps focus instead of returning to the trigger
 */

export function MenuItemFocusCase() {
  const inputRef = React.useRef<HTMLInputElement>(null!)
  const [showInput, setShowInput] = React.useState(false)

  return (
    <YStack padding="$4" gap="$4">
      <Menu placement="bottom-start">
        <Menu.Trigger asChild>
          <Button data-testid="menu-trigger" size="$4">
            Open Menu
          </Button>
        </Menu.Trigger>

        <Menu.Portal zIndex={100}>
          <Menu.Content
            data-testid="menu-content"
            p="$2"
            minW={200}
            borderWidth={1}
            borderColor="$borderColor"
            elevation="$3"
          >
            <Menu.Item
              data-testid="focus-input-item"
              key="focus-input"
              textValue="Focus Input"
              style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 }}
              focusStyle={{ bg: '$backgroundHover' }}
              onPress={() => {
                // show input - the autoFocus should handle focusing
                setShowInput(true)
              }}
            >
              <Menu.ItemTitle>Focus Input</Menu.ItemTitle>
            </Menu.Item>

            <Menu.Item
              data-testid="focus-existing-item"
              key="focus-existing"
              textValue="Focus Existing"
              style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 }}
              focusStyle={{ bg: '$backgroundHover' }}
              onPress={() => {
                // focus the already-visible input
                const input = document.querySelector(
                  '[data-testid="always-visible-input"]'
                ) as HTMLInputElement
                input?.focus()
              }}
            >
              <Menu.ItemTitle>Focus Existing Input</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {showInput && (
        <Input
          ref={inputRef as any}
          data-testid="dynamic-input"
          placeholder="I should be focused"
          autoFocus
        />
      )}

      <Input data-testid="always-visible-input" placeholder="Always visible input" />
    </YStack>
  )
}
