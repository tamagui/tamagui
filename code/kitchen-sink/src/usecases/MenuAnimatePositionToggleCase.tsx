import { Menu } from '@tamagui/menu'
import { useState } from 'react'
import { Button, Text, XStack, YStack } from 'tamagui'

// reproduces the bug where toggling animatePosition between renders on the
// same long-lived Menu.Content trips React's "Should have a queue" invariant.
// PopperContent used to spread `transition`/`animateOnly`/`animatePresence`
// only when animatePos was truthy, which flipped 'transition' presence on the
// inner View and changed useComponentState's hasAnimationProp mid-life.
export function MenuAnimatePositionToggleCase() {
  const [animate, setAnimate] = useState<boolean | undefined>(undefined)

  return (
    <YStack padding="$4" gap="$4">
      <Text>Test: toggle animatePosition on shared Menu.Content (no React error)</Text>

      <Menu placement="bottom-start">
        <XStack gap="$4">
          <Menu.Trigger asChild>
            <Button
              data-testid="trigger-no-anim"
              onMouseEnter={() => setAnimate(undefined)}
            >
              No Animate
            </Button>
          </Menu.Trigger>

          <Menu.Trigger asChild>
            <Button data-testid="trigger-anim" onMouseEnter={() => setAnimate(true)}>
              Animate
            </Button>
          </Menu.Trigger>
        </XStack>

        <Menu.Portal>
          <Menu.Content
            data-testid="menu-content"
            animatePosition={animate}
            p="$2"
            minWidth={180}
            borderWidth={1}
            borderColor="$borderColor"
            boxShadow="0 4px 12px $shadowColor"
          >
            <Menu.Item key="i1" textValue="Alpha">
              <Menu.ItemTitle>Alpha</Menu.ItemTitle>
            </Menu.Item>
            <Menu.Item key="i2" textValue="Beta">
              <Menu.ItemTitle>Beta</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </YStack>
  )
}
