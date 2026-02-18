import { Menu } from '@tamagui/menu'
import { Input } from '@tamagui/input'
import { Button, YStack, Text } from 'tamagui'
import { useState, useRef } from 'react'

/**
 * tests that Input autoFocus works both standalone and after a menu closes,
 * and that onCloseAutoFocus with preventDefault properly prevents focus restoration.
 */
export function InputAutoFocusAfterMenuCase() {
  const [showInput, setShowInput] = useState(false)
  const [preventDefaultFocusTarget, setPreventDefaultFocusTarget] = useState('')
  const customInputRef = useRef<HTMLInputElement>(null) as any

  return (
    <YStack padding="$4" gap="$4" alignItems="flex-start">
      {/* standalone autoFocus test */}
      <Input
        data-testid="autofocus-input"
        placeholder="Should be auto-focused"
        autoFocus
      />

      {/* menu -> input transition test */}
      <Menu placement="bottom-start">
        <Menu.Trigger asChild>
          <Button data-testid="menu-trigger">Open Menu</Button>
        </Menu.Trigger>

        <Menu.Portal zIndex={100}>
          <Menu.Content
            data-testid="menu-content"
            p="$2"
            minWidth={200}
            borderWidth={1}
            borderColor="$borderColor"
            elevation="$3"
          >
            <Menu.Item
              data-testid="menu-item-show-input"
              key="show-input"
              textValue="Show Input"
              onPress={() => setShowInput(true)}
            >
              <Menu.ItemTitle>Show Input</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {showInput && (
        <Input
          data-testid="after-menu-input"
          placeholder="Should focus after menu closes"
          autoFocus
        />
      )}

      {/* onCloseAutoFocus preventDefault test: prevent focus restore + manually focus a custom target */}
      <Input
        ref={customInputRef}
        data-testid="custom-focus-target"
        placeholder="Custom focus target"
      />

      <Menu placement="bottom-start">
        <Menu.Trigger asChild>
          <Button data-testid="prevent-default-trigger">
            Open Menu (preventDefault)
          </Button>
        </Menu.Trigger>

        <Menu.Portal zIndex={100}>
          <Menu.Content
            data-testid="prevent-default-menu-content"
            p="$2"
            minWidth={200}
            borderWidth={1}
            borderColor="$borderColor"
            elevation="$3"
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              // manually focus a custom target instead of the trigger
              customInputRef.current?.focus()
              setPreventDefaultFocusTarget('custom-focused')
            }}
          >
            <Menu.Item
              data-testid="prevent-default-menu-item"
              key="close"
              textValue="Close"
            >
              <Menu.ItemTitle>Close & Focus Custom</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      <Text data-testid="input-visible">
        {showInput ? 'input-visible' : 'input-hidden'}
      </Text>
      <Text data-testid="prevent-default-status">{preventDefaultFocusTarget}</Text>
    </YStack>
  )
}
