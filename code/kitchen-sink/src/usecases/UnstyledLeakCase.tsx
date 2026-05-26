// reproduces soot's reported bug:
//   styled(Menu.Item, { unstyled: true, ... })
// rendered inside a <Menu>, leaks `unstyled` to the host DOM element.
//
// soot has been working around this via a global filter for the
// react-dom dev warning. The smoking-gun comment in soot is
//   src/interface/menu/constants.ts:34
//     // reset tamagui's default content styles (unstyled prop is broken)
import { Menu } from '@tamagui/menu'
import { Button, Paragraph, Popover, YStack, styled } from 'tamagui'

// exact replica of soot's menuItemStyle
const sootMenuItemStyle = {
  unstyled: true,
  group: 'item',
  gap: '$2',
  px: '$1',
  py: '$1.5',
  items: 'center',
  cursor: 'default',
  containerType: 'normal',
  flexDirection: 'row',
  bg: 'transparent',
  rounded: '$2',
  minW: 185,
  maxW: 185,
  hoverStyle: { bg: '$color4' },
  pressStyle: { bg: '$color4' },
  focusStyle: { bg: '$color4' },
} as const

// pattern 1 — soot's exact `styled(Menu.Item, sootMenuItemStyle)` over Menu.Item
const StyledMenuItem = styled(Menu.Item, sootMenuItemStyle as any)

// pattern 2 — `unstyled: true` in the outer styled config over Popover.Content
const StyledPopoverContent = styled(Popover.Content, {
  unstyled: true,
} as any)

export function UnstyledLeakCase() {
  return (
    <YStack padding="$4" gap="$4">
      <Paragraph>
        UnstyledLeakCase — open menu / popover; check console for{' '}
        <code>Received `true` for a non-boolean attribute `unstyled`</code>
      </Paragraph>

      {/* pattern 1: styled(Menu.Item, sootMenuItemStyle) inside a Menu */}
      <Menu>
        <Menu.Trigger asChild>
          <Button data-testid="leak-menu-trigger">open menu</Button>
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Content data-testid="leak-menu-content">
            <StyledMenuItem data-testid="leak-menu-item-1">
              <Menu.ItemTitle>menu item 1</Menu.ItemTitle>
            </StyledMenuItem>
            <StyledMenuItem data-testid="leak-menu-item-2">
              <Menu.ItemTitle>menu item 2</Menu.ItemTitle>
            </StyledMenuItem>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {/* pattern 2: styled(Popover.Content, { unstyled: true }) inside a Popover */}
      <Popover>
        <Popover.Trigger asChild>
          <Button data-testid="leak-popover-trigger">open popover</Button>
        </Popover.Trigger>
        <StyledPopoverContent data-testid="leak-popover-content">
          <Paragraph>popover content</Paragraph>
        </StyledPopoverContent>
      </Popover>

      {/* pattern 3: runtime forwarding — Popover.Content unstyled={true} */}
      <Popover>
        <Popover.Trigger asChild>
          <Button data-testid="leak-popover-trigger-2">open popover 2</Button>
        </Popover.Trigger>
        <Popover.Content unstyled data-testid="leak-popover-content-2">
          <Paragraph>popover content 2</Paragraph>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}
