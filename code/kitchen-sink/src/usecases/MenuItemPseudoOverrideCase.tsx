import { Menu } from '@tamagui/menu'
import { styled, YStack } from 'tamagui'
import { Button } from '../components/Button'

const menuItemStyle = {
  gap: '$2.5',
  px: '$2',
  height: 36,
  alignItems: 'center',
  cursor: 'default',
  flexDirection: 'row',
  borderRadius: '$2',
  backgroundColor: 'rgba(0,0,0,0)',
  hoverStyle: { backgroundColor: 'rgb(0, 0, 255)' },
  pressStyle: { backgroundColor: 'rgb(0, 255, 0)' },
  focusStyle: { backgroundColor: 'rgb(255, 0, 0)' },
} as const

const menuItemStyleWithShorthands = {
  gap: '$2.5',
  px: '$2',
  height: 36,
  alignItems: 'center',
  cursor: 'default',
  flexDirection: 'row',
  borderRadius: '$2',
  bg: 'rgba(0,0,0,0)',
  hoverStyle: { bg: 'rgb(0, 0, 255)' },
  pressStyle: { bg: 'rgb(0, 255, 0)' },
  focusStyle: { bg: 'rgb(255, 0, 0)' },
} as const

const StyledMenuItem = styled(Menu.Item, menuItemStyle)

export function MenuItemPseudoOverrideCase() {
  return (
    <YStack padding="$4" gap="$4">
      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="spread-trigger" size="medium">
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

      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="custom-trigger" size="medium">
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

      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="shorthand-trigger" size="medium">
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

      <Menu placement="bottom-start" offset={8}>
        <Menu.Trigger asChild>
          <Button data-testid="styled-trigger" size="medium">
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
    </YStack>
  )
}
