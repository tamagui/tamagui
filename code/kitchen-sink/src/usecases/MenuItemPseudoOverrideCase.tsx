import { Menu } from '@tamagui/menu'
import { Button, styled, YStack } from 'tamagui'

// the actual pattern the user is using - styled() with styles object
// this creates a styled component where the pseudo styles should override the variant defaults
const menuItemStyleForStyled = {
  // no unstyled: true - relying on custom pseudo styles
  gap: '$2.5',
  px: '$2',
  height: 36,
  alignItems: 'center',
  cursor: 'default',
  flexDirection: 'row',
  borderRadius: '$2',
  backgroundColor: 'rgba(0,0,0,0)',
  hoverStyle: {
    backgroundColor: 'rgb(0, 0, 255)',
  },
  pressStyle: {
    backgroundColor: 'rgb(0, 255, 0)',
  },
  focusStyle: {
    backgroundColor: 'rgb(255, 0, 0)',
  },
} as const

const menuItemStyleForStyledWithUnstyled = {
  ...menuItemStyleForStyled,
  unstyled: true,
} as const

// styled component WITHOUT unstyled - should use custom pseudo styles
const StyledMenuItem = styled(Menu.Item, menuItemStyleForStyled)

// styled component WITH unstyled - should use custom pseudo styles
const StyledMenuItemWithUnstyled = styled(Menu.Item, menuItemStyleForStyledWithUnstyled)

// simulates the user's pattern - spreading a style object that includes both
// base styles and pseudo styles, and expects pseudo styles to override defaults
const menuItemStyle = {
  // note: no unstyled: true here - this is the bug scenario
  gap: '$2.5',
  px: '$2',
  height: 36,
  alignItems: 'center',
  cursor: 'default',
  flexDirection: 'row',
  borderRadius: '$2',
  backgroundColor: 'rgba(0,0,0,0)',
  hoverStyle: {
    backgroundColor: 'rgb(0, 0, 255)',
  },
  pressStyle: {
    backgroundColor: 'rgb(0, 255, 0)',
  },
  focusStyle: {
    backgroundColor: 'rgb(255, 0, 0)',
  },
} as const

const menuItemStyleWithUnstyled = {
  ...menuItemStyle,
  unstyled: true,
} as const

// user's actual pattern with shorthands
const menuItemStyleWithShorthands = {
  // no unstyled: true
  gap: '$2.5',
  px: '$2',
  height: 36,
  alignItems: 'center',
  cursor: 'default',
  flexDirection: 'row',
  borderRadius: '$2',
  bg: 'rgba(0,0,0,0)',
  hoverStyle: {
    bg: 'rgb(0, 0, 255)',
  },
  pressStyle: {
    bg: 'rgb(0, 255, 0)',
  },
  focusStyle: {
    bg: 'rgb(255, 0, 0)',
  },
} as const

const menuItemStyleWithShorthandsUnstyled = {
  ...menuItemStyleWithShorthands,
  unstyled: true,
} as const

/**
 * Menu Item Pseudo Style Override Test Case
 *
 * Tests that user-provided pseudo styles (focusStyle, pressStyle, hoverStyle)
 * override the default variant pseudo styles when unstyled is NOT set.
 *
 * Bug: When unstyled is not true, the variant's default pseudo styles were
 * overriding user-provided pseudo styles due to style importance merging issues.
 */
export function MenuItemPseudoOverrideCase() {
  return (
    <YStack padding="$4" gap="$4">
      {/* Test 1: Spread style object WITHOUT unstyled - should still use custom pseudos */}
      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="spread-trigger" size="$4">
            Open Menu (Spread Style)
          </Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Content data-testid="spread-content">
            <Menu.Item key="item-1" data-testid="spread-item" {...menuItemStyle}>
              <Menu.ItemTitle>Spread Style Item</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {/* Test 2: Spread style object WITH unstyled - works as expected */}
      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="spread-unstyled-trigger" size="$4">
            Open Unstyled Menu (Spread)
          </Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Content data-testid="spread-unstyled-content">
            <Menu.Item
              key="item-1"
              data-testid="spread-unstyled-item"
              {...menuItemStyleWithUnstyled}
            >
              <Menu.ItemTitle>Spread Unstyled Item</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {/* Test 3: Direct props - custom pseudo styles WITHOUT unstyled */}
      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="custom-trigger" size="$4">
            Open Menu (Direct Props)
          </Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Content data-testid="custom-content">
            <Menu.Item
              key="item-1"
              data-testid="custom-item"
              focusStyle={{ backgroundColor: 'rgb(255, 0, 0)' }}
              pressStyle={{ backgroundColor: 'rgb(0, 255, 0)' }}
              hoverStyle={{ backgroundColor: 'rgb(0, 0, 255)' }}
            >
              <Menu.ItemTitle>Custom Pseudo Item</Menu.ItemTitle>
            </Menu.Item>
            <Menu.Item key="item-2" data-testid="default-item">
              <Menu.ItemTitle>Default Item</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {/* Test 4: With unstyled=true and custom pseudo styles - for comparison */}
      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="unstyled-trigger" size="$4">
            Open Unstyled Menu
          </Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Content data-testid="unstyled-content">
            <Menu.Item
              key="item-1"
              data-testid="unstyled-item"
              unstyled
              focusStyle={{ backgroundColor: 'rgb(255, 0, 0)' }}
              pressStyle={{ backgroundColor: 'rgb(0, 255, 0)' }}
              hoverStyle={{ backgroundColor: 'rgb(0, 0, 255)' }}
            >
              <Menu.ItemTitle>Unstyled Custom Pseudo Item</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {/* Test 5: Shorthands in pseudo styles WITHOUT unstyled */}
      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="shorthand-trigger" size="$4">
            Open Menu (Shorthands)
          </Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Content data-testid="shorthand-content">
            <Menu.Item
              key="item-1"
              data-testid="shorthand-item"
              {...menuItemStyleWithShorthands}
            >
              <Menu.ItemTitle>Shorthand Style Item</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {/* Test 6: Shorthands in pseudo styles WITH unstyled */}
      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="shorthand-unstyled-trigger" size="$4">
            Open Unstyled Menu (Shorthands)
          </Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Content data-testid="shorthand-unstyled-content">
            <Menu.Item
              key="item-1"
              data-testid="shorthand-unstyled-item"
              {...menuItemStyleWithShorthandsUnstyled}
            >
              <Menu.ItemTitle>Shorthand Unstyled Item</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {/* Test 7: styled() component WITHOUT unstyled - the actual user pattern */}
      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="styled-trigger" size="$4">
            Open Menu (styled() Component)
          </Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Content data-testid="styled-content">
            <StyledMenuItem key="item-1" data-testid="styled-item">
              <Menu.ItemTitle>styled() Item</Menu.ItemTitle>
            </StyledMenuItem>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      {/* Test 8: styled() component WITH unstyled */}
      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="styled-unstyled-trigger" size="$4">
            Open Menu (styled() + unstyled)
          </Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Content data-testid="styled-unstyled-content">
            <StyledMenuItemWithUnstyled key="item-1" data-testid="styled-unstyled-item">
              <Menu.ItemTitle>styled() + unstyled Item</Menu.ItemTitle>
            </StyledMenuItemWithUnstyled>
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </YStack>
  )
}
