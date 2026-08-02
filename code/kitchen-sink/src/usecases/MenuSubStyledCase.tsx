import { ChevronRight } from '@tamagui/lucide-icons-2'
import { Menu } from '@tamagui/menu'
import React from 'react'
import { H1, Paragraph, styled, Text, YStack } from 'tamagui'
import { Button } from '../components/Button'

/**
 * Menu Submenu Styled Test Case
 *
 * Tests that styled(Menu.SubContent, {...}) works correctly with animation styles
 * like scale, enter clause, and exit clause. Previously these would break positioning
 * because Menu.SubContent wasn't properly styleable.
 */

// styled wrapper for SubContent - this should work without breaking positioning
const StyledSubContent = styled(Menu.SubContent, {
  bg: 'background',
  p: '2',
  minW: 180,
  borderWidth: 1,
  borderColor: 'border-color',
  boxShadow: '0 4px 12px shadow-color',
  // these used to break positioning:
  scale: '1 enter:0.96 exit:0.98',
  opacity: '1 enter:0 exit:0',
  x: 'enter:-8px exit:-4px',
})

export function MenuSubStyledCase() {
  const [subMenuOpen, setSubMenuOpen] = React.useState(false)
  const [lastAction, setLastAction] = React.useState<string>('')

  return (
    <YStack gap="4" padding="4" maxWidth={800} margin="auto">
      <YStack gap="2">
        <H1>Menu Submenu Styled Test</H1>
        <Paragraph>
          Tests that styled(Menu.SubContent, ...) works correctly with animation styles.
          The submenu should appear to the right of the trigger, not at top-left.
        </Paragraph>
        <Text id="last-action" color="color10">
          Last action: {lastAction || 'None'}
        </Text>
        <Text id="submenu-state" color={`${subMenuOpen ? 'green10' : 'red10'}`}>
          Submenu: {subMenuOpen ? 'Open' : 'Closed'}
        </Text>
      </YStack>

      <YStack alignItems="flex-start" gap="4">
        <Menu allowFlip placement="bottom-start" offset={8}>
          <Menu.Trigger asChild>
            <Button id="menu-trigger" size="4">
              Open Menu
            </Button>
          </Menu.Trigger>

          <Menu.Portal zIndex={100}>
            <Menu.Content
              id="menu-content"
              p="2"
              minW={220}
              borderWidth={1}
              borderColor="border-color"
              bg="background"
              boxShadow="0 4px 12px shadow-color"
            >
              <Menu.Item
                key="menu-item-1"
                id="menu-item-1"
                onSelect={() => setLastAction('Item 1 selected')}
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                bg="focus:background-hover"
              >
                <Menu.ItemTitle>Item 1</Menu.ItemTitle>
              </Menu.Item>

              <Menu.Sub
                open={subMenuOpen}
                placement="right-start"
                onOpenChange={(open) => {
                  setSubMenuOpen(open)
                  setLastAction(`Submenu ${open ? 'opened' : 'closed'}`)
                }}
              >
                <Menu.SubTrigger
                  key="submenu-trigger"
                  id="submenu-trigger"
                  justify="space-between"
                  bg="focus:background-hover"
                  textValue="Actions"
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                >
                  <Menu.ItemTitle>Actions (styled submenu)</Menu.ItemTitle>
                  <ChevronRight size={14} color="color10" />
                </Menu.SubTrigger>

                <Menu.Portal zIndex={200}>
                  <StyledSubContent id="submenu-content">
                    <Menu.Item
                      key="submenu-item-1"
                      id="submenu-item-1"
                      onSelect={() => setLastAction('Sub Item 1 selected')}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 4,
                      }}
                      bg="focus:background-hover"
                    >
                      <Menu.ItemTitle>Sub Item 1</Menu.ItemTitle>
                    </Menu.Item>

                    <Menu.Item
                      key="submenu-item-2"
                      id="submenu-item-2"
                      onSelect={() => setLastAction('Sub Item 2 selected')}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 4,
                      }}
                      bg="focus:background-hover"
                    >
                      <Menu.ItemTitle>Sub Item 2</Menu.ItemTitle>
                    </Menu.Item>
                  </StyledSubContent>
                </Menu.Portal>
              </Menu.Sub>

              <Menu.Item
                key="menu-item-2"
                id="menu-item-2"
                onSelect={() => setLastAction('Item 2 selected')}
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                bg="focus:background-hover"
              >
                <Menu.ItemTitle>Item 2</Menu.ItemTitle>
              </Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu>
      </YStack>
    </YStack>
  )
}
