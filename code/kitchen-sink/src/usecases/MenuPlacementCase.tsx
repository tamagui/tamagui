import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { Menu } from '@tamagui/menu'
import React from 'react'
import { Button, H1, Paragraph, Text, XStack, YStack } from 'tamagui'

/**
 * Menu.Placement Test Case
 *
 * Tests the Menu.Placement render prop that provides placement-aware values
 * for animations. When a submenu opens to the left vs right, the xDir value
 * should flip accordingly.
 */
export function MenuPlacementCase() {
  const [subMenuOpen, setSubMenuOpen] = React.useState(false)
  const [placementInfo, setPlacementInfo] = React.useState<string>('')

  return (
    <YStack gap="$4" padding="$4" maxWidth={900} margin="auto">
      <YStack gap="$2">
        <H1>Menu.Placement Render Prop Test</H1>
        <Paragraph>
          Tests that Menu.Placement provides correct placement-aware values for
          animations. The xDir should be 1 for right-opening and -1 for left-opening
          submenus.
        </Paragraph>
        <Text id="placement-info" color="$color10">
          Placement info: {placementInfo || 'None'}
        </Text>
        <Text id="submenu-state" color={subMenuOpen ? '$green10' : '$red10'}>
          Submenu: {subMenuOpen ? 'Open' : 'Closed'}
        </Text>
      </YStack>

      <XStack justifyContent="space-between">
        {/* left-side menu - submenu should open to the right */}
        <Menu allowFlip={false} placement="bottom-start" offset={8}>
          <Menu.Trigger asChild>
            <Button id="menu-trigger-right" size="$4">
              Right Submenu
            </Button>
          </Menu.Trigger>

          <Menu.Portal zIndex={100}>
            <Menu.Content
              id="menu-content-right"
              p="$2"
              minW={220}
              borderWidth={1}
              borderColor="$borderColor"
              bg="$background"
              elevation="$3"
            >
              <Menu.Item key="item-1" style={{ padding: 8 }}>
                <Menu.ItemTitle>Item 1</Menu.ItemTitle>
              </Menu.Item>

              <Menu.Sub
                open={subMenuOpen}
                placement="right-start"
                onOpenChange={setSubMenuOpen}
              >
                <Menu.SubTrigger
                  key="submenu-trigger"
                  id="submenu-trigger-right"
                  justify="space-between"
                  textValue="Actions"
                  style={{ padding: 8 }}
                >
                  <Menu.ItemTitle>Actions</Menu.ItemTitle>
                  <ChevronRight size={14} color="$color10" />
                </Menu.SubTrigger>

                <Menu.Portal zIndex={200}>
                  <Menu.Placement>
                    {({ side, xDir, isLeft, isRight }) => {
                      // update state for test verification
                      React.useEffect(() => {
                        setPlacementInfo(
                          `side=${side}, xDir=${xDir}, isLeft=${isLeft}, isRight=${isRight}`
                        )
                      }, [side, xDir, isLeft, isRight])

                      return (
                        <Menu.SubContent
                          id="submenu-content-right"
                          data-x-dir={xDir}
                          data-side-info={side}
                          bg="$background"
                          p="$2"
                          minW={180}
                          borderWidth={1}
                          borderColor="$borderColor"
                          elevation="$3"
                          transition="200ms"
                          enterStyle={{ scale: 0.9, opacity: 0, x: 5 * xDir }}
                          exitStyle={{ scale: 0.95, opacity: 0 }}
                        >
                          <Menu.Item key="sub-1" style={{ padding: 8 }}>
                            <Menu.ItemTitle>Sub Item 1</Menu.ItemTitle>
                          </Menu.Item>
                          <Menu.Item key="sub-2" style={{ padding: 8 }}>
                            <Menu.ItemTitle>Sub Item 2</Menu.ItemTitle>
                          </Menu.Item>
                        </Menu.SubContent>
                      )
                    }}
                  </Menu.Placement>
                </Menu.Portal>
              </Menu.Sub>

              <Menu.Item key="item-2" style={{ padding: 8 }}>
                <Menu.ItemTitle>Item 2</Menu.ItemTitle>
              </Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu>

        {/* right-side menu - submenu should open to the left */}
        <Menu allowFlip={false} placement="bottom-end" offset={8}>
          <Menu.Trigger asChild>
            <Button id="menu-trigger-left" size="$4">
              Left Submenu
            </Button>
          </Menu.Trigger>

          <Menu.Portal zIndex={100}>
            <Menu.Content
              id="menu-content-left"
              p="$2"
              minW={220}
              borderWidth={1}
              borderColor="$borderColor"
              bg="$background"
              elevation="$3"
            >
              <Menu.Item key="item-1" style={{ padding: 8 }}>
                <Menu.ItemTitle>Item 1</Menu.ItemTitle>
              </Menu.Item>

              <Menu.Sub placement="left-start">
                <Menu.SubTrigger
                  key="submenu-trigger"
                  id="submenu-trigger-left"
                  justify="space-between"
                  textValue="Actions"
                  style={{ padding: 8 }}
                >
                  <ChevronLeft size={14} color="$color10" />
                  <Menu.ItemTitle>Actions</Menu.ItemTitle>
                </Menu.SubTrigger>

                <Menu.Portal zIndex={200}>
                  <Menu.Placement>
                    {({ side, xDir }) => (
                      <Menu.SubContent
                        id="submenu-content-left"
                        data-x-dir={xDir}
                        data-side-info={side}
                        bg="$background"
                        p="$2"
                        minW={180}
                        borderWidth={1}
                        borderColor="$borderColor"
                        elevation="$3"
                        transition="200ms"
                        enterStyle={{ scale: 0.9, opacity: 0, x: 5 * xDir }}
                        exitStyle={{ scale: 0.95, opacity: 0 }}
                      >
                        <Menu.Item key="sub-1" style={{ padding: 8 }}>
                          <Menu.ItemTitle>Sub Item 1</Menu.ItemTitle>
                        </Menu.Item>
                        <Menu.Item key="sub-2" style={{ padding: 8 }}>
                          <Menu.ItemTitle>Sub Item 2</Menu.ItemTitle>
                        </Menu.Item>
                      </Menu.SubContent>
                    )}
                  </Menu.Placement>
                </Menu.Portal>
              </Menu.Sub>

              <Menu.Item key="item-2" style={{ padding: 8 }}>
                <Menu.ItemTitle>Item 2</Menu.ItemTitle>
              </Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu>
      </XStack>
    </YStack>
  )
}
