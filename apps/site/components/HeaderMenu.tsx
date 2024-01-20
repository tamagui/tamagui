import { Menu } from '@tamagui/lucide-icons'
import * as React from 'react'
import {
  Adapt,
  Button,
  Popover,
  Sheet,
  Spacer,
  XStack,
  YStack,
  isTouchable,
} from 'tamagui'

import { DocsMenuContents } from './DocsMenuContents'
import { HeaderLinks } from './HeaderLinks'
import { useDocsMenu } from './useDocsMenu'

export const HeaderMenu = React.memo(function HeaderMenu() {
  const { open, setOpen } = useDocsMenu()

  return (
    <Popover
      keepChildrenMounted
      hoverable={{
        delay: 50,
        restMs: 40,
      }}
      open={open}
      onOpenChange={setOpen}
      size="$5"
      stayInFrame={{ padding: 20 }}
    >
      <Popover.Anchor asChild>
        <Button
          size="$3"
          ml="$2"
          bc="transparent"
          circular
          noTextWrap
          onPress={() => {
            if (isTouchable || !open) {
              setOpen(!open)
            }
          }}
          theme={open ? 'alt1' : undefined}
          aria-label="Open the main menu"
        >
          <Menu size={22} color="var(--color)" />
        </Button>
      </Popover.Anchor>

      <Adapt platform="touch" when="sm">
        <Sheet
          zIndex={100000000}
          modal
          dismissOnSnapToBottom
          animation="bouncy"
          animationConfig={{
            type: 'spring',
            damping: 25,
            mass: 1.2,
            stiffness: 200,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay zIndex={100} />
        </Sheet>
      </Adapt>

      <HeaderMenuContent />
    </Popover>
  )
})

const HeaderMenuContent = React.memo(function HeaderMenuContent() {
  return (
    <Popover.Content
      bw={1}
      boc="$borderColor"
      enterStyle={{ x: -10, o: 0 }}
      exitStyle={{ x: -10, o: 0 }}
      x={0}
      y={0}
      o={1}
      animation={[
        '75ms',
        {
          opacity: {
            overshootClamping: true,
          },
        },
      ]}
      animateOnly={['transform', 'opacity']}
      p={0}
      maxHeight="80vh"
      maxWidth={360}
      elevate
      zIndex={100000000}
      trapFocus
      br="$6"
    >
      <Popover.Arrow size="$4" borderWidth={1} boc="$borderColor" />

      <Popover.ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <YStack aria-label="Home menu contents" miw={230} p="$3" ai="flex-end">
          <XStack fw="wrap" f={1} gap="$2">
            <HeaderLinks forceShowAllLinks />
          </XStack>

          <Spacer size="$3" />

          <DocsMenuContents />
        </YStack>
      </Popover.ScrollView>
    </Popover.Content>
  )
})
